import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { CreateWishInput, WishItem } from '../types/wishes';
import { validateWishInput } from '../utils/validateWish';

export class WishValidationError extends Error {
  public readonly fieldErrors: Partial<Record<keyof CreateWishInput, string>>;

  constructor(message: string, fieldErrors: Partial<Record<keyof CreateWishInput, string>>) {
    super(message);
    this.name = 'WishValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class DuplicateWishError extends Error {
  constructor(message = 'Lời chúc này vừa được gửi. Vui lòng không bấm gửi lặp lại.') {
    super(message);
    this.name = 'DuplicateWishError';
  }
}

export class WishNotFoundError extends Error {
  constructor(message = 'Không tìm thấy lời chúc trong hệ thống.') {
    super(message);
    this.name = 'WishNotFoundError';
  }
}

export interface WishesStoreOptions {
  storageFilePath?: string;
  duplicateWindowMs?: number;
}

interface StoredWishRecord extends WishItem {
  signatureHash?: string;
}

export interface WishesStore {
  listWishes(): Promise<WishItem[]>;
  addWish(input: CreateWishInput): Promise<WishItem>;
  updateWish(id: string, input: Partial<CreateWishInput>): Promise<WishItem>;
  deleteWish(id: string): Promise<void>;
}

function getServerConfig(options?: WishesStoreOptions) {
  const storageFilePath =
    options?.storageFilePath ||
    process.env.WISHES_STORAGE_FILE ||
    path.resolve(process.cwd(), 'server', 'data', 'wishes.json');

  // Khóa bí mật chỉ tồn tại ở phía máy chủ để ký kiểm tra bản ghi nội bộ, không bao giờ trả về client
  const serverSecret = process.env.WISHES_SERVER_SECRET || 'baotuong-9a3-hiepthanh-server-secret';
  const duplicateWindowMs = options?.duplicateWindowMs ?? 30_000;

  return {
    storageFilePath,
    serverSecret,
    duplicateWindowMs,
  };
}

function toPublicWish(record: StoredWishRecord): WishItem {
  return {
    id: String(record.id),
    senderName: String(record.senderName),
    className: String(record.className),
    message: String(record.message),
    createdAt: String(record.createdAt),
  };
}

export function createWishesStore(options?: WishesStoreOptions): WishesStore {
  const { storageFilePath, serverSecret, duplicateWindowMs } = getServerConfig(options);
  let writeQueue: Promise<unknown> = Promise.resolve();

  async function readRecords(): Promise<StoredWishRecord[]> {
    try {
      const raw = await fs.readFile(storageFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && Array.isArray(parsed.wishes)) {
        return parsed.wishes;
      }
      return [];
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'ENOENT') {
        const isCustomStorage = Boolean(options?.storageFilePath || process.env.WISHES_STORAGE_FILE);
        if (!isCustomStorage) {
          try {
            const publicFallback = path.resolve(process.cwd(), 'public', 'wishes-data.json');
            const publicRaw = await fs.readFile(publicFallback, 'utf-8');
            const publicParsed = JSON.parse(publicRaw);
            const wishes = Array.isArray(publicParsed) ? publicParsed : publicParsed?.wishes;
            if (Array.isArray(wishes) && wishes.length > 0) {
              await writeRecords(wishes);
              return wishes;
            }
          } catch {
            // ignore fallback error
          }
        }
        return [];
      }
      throw err;
    }
  }

  async function writeRecords(records: StoredWishRecord[]): Promise<void> {
    await fs.mkdir(path.dirname(storageFilePath), { recursive: true });
    await fs.writeFile(storageFilePath, JSON.stringify({ wishes: records }, null, 2), 'utf-8');
  }

  return {
    async listWishes(): Promise<WishItem[]> {
      const records = await readRecords();
      return records
        .map(toPublicWish)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    async addWish(input: CreateWishInput): Promise<WishItem> {
      const validation = validateWishInput(input);
      if (!validation.valid) {
        throw new WishValidationError(
          validation.errorMessage || 'Dữ liệu lời chúc không hợp lệ.',
          validation.fieldErrors
        );
      }

      const { senderName, className, message } = validation.cleaned;

      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const now = Date.now();
        const normalizedKey = `${senderName.toLowerCase()}|${className.toLowerCase()}|${message.toLowerCase()}`;
        const signatureHash = crypto
          .createHmac('sha256', serverSecret)
          .update(normalizedKey)
          .digest('hex');

        const isDuplicate = records.some((item) => {
          const itemTime = new Date(item.createdAt).getTime();
          if (Number.isNaN(itemTime) || now - itemTime > duplicateWindowMs) {
            return false;
          }
          if (item.signatureHash) {
            return item.signatureHash === signatureHash;
          }
          const existingKey = `${item.senderName.toLowerCase()}|${item.className.toLowerCase()}|${item.message.toLowerCase()}`;
          return existingKey === normalizedKey;
        });

        if (isDuplicate) {
          throw new DuplicateWishError();
        }

        const newRecord: StoredWishRecord = {
          id: `wish-${now}-${crypto.randomBytes(4).toString('hex')}`,
          senderName,
          className,
          message,
          createdAt: new Date(now).toISOString(),
          signatureHash,
        };

        const updated = [newRecord, ...records];
        await writeRecords(updated);
        return toPublicWish(newRecord);
      });

      writeQueue = task.catch(() => {});
      return task;
    },

    async updateWish(id: string, input: Partial<CreateWishInput>): Promise<WishItem> {
      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const index = records.findIndex((w) => w.id === id);
        if (index === -1) {
          throw new WishNotFoundError();
        }

        const current = records[index];
        const validation = validateWishInput({
          senderName: input.senderName ?? current.senderName,
          className: input.className ?? current.className,
          message: input.message ?? current.message,
        });

        if (!validation.valid) {
          throw new WishValidationError(
            validation.errorMessage || 'Dữ liệu lời chúc không hợp lệ.',
            validation.fieldErrors
          );
        }

        const updatedRecord: StoredWishRecord = {
          ...current,
          senderName: validation.cleaned.senderName,
          className: validation.cleaned.className,
          message: validation.cleaned.message,
        };

        records[index] = updatedRecord;
        await writeRecords(records);
        return toPublicWish(updatedRecord);
      });

      writeQueue = task.catch(() => {});
      return task;
    },

    async deleteWish(id: string): Promise<void> {
      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const filtered = records.filter((w) => w.id !== id);
        if (filtered.length === records.length) {
          throw new WishNotFoundError();
        }
        await writeRecords(filtered);
      });

      writeQueue = task.catch(() => {});
      return task;
    },
  };
}

