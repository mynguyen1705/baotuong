import fs from 'node:fs/promises';
import path from 'node:path';
import { DEFAULT_MEMORIES_DATA } from '../data/defaultMemories';
import {
  MemoryItem,
  MemorySlotId,
  MemoryStationData,
  UpdateMemoryPayload,
  UpdateStationMetaPayload,
} from '../types/memories';
import { triggerAutoGitPush } from './autoGitSync';

export interface MemoriesStoreOptions {
  filePath?: string;
  publicFilePath?: string;
}

export class MemoriesStore {
  private filePath: string;
  private publicFilePath?: string;
  private cachedData: MemoryStationData | null = null;
  private lock: Promise<void> = Promise.resolve();

  constructor(options: MemoriesStoreOptions = {}) {
    this.filePath = options.filePath || path.resolve(process.cwd(), 'server', 'data', 'memories.json');
    this.publicFilePath = options.publicFilePath || path.resolve(process.cwd(), 'public', 'memories-data.json');
  }

  private async withLock<T>(op: () => Promise<T>): Promise<T> {
    const next = this.lock.then(op, op);
    this.lock = next.then(
      () => {},
      () => {}
    );
    return next;
  }

  private async loadDataInternal(): Promise<MemoryStationData> {
    if (this.cachedData) {
      return this.cachedData;
    }

    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.memories) && parsed.memories.length >= 11) {
        this.cachedData = parsed;
        return this.cachedData!;
      }
    } catch {
      // Fallback to default
    }

    this.cachedData = structuredClone(DEFAULT_MEMORIES_DATA);
    await this.persistInternal();
    return this.cachedData!;
  }

  async getStationData(): Promise<MemoryStationData> {
    return this.withLock(async () => {
      const data = await this.loadDataInternal();
      return structuredClone(data);
    });
  }

  async updateSlot(slotId: MemorySlotId, payload: UpdateMemoryPayload): Promise<MemoryItem> {
    return this.withLock(async () => {
      const numId = Number(slotId);
      if (!Number.isInteger(numId) || numId < 1 || numId > 15) {
        throw new Error(`Mã vị trí ảnh không hợp lệ: ${slotId} (phải từ 1 đến 15)`);
      }

      await this.loadDataInternal();

      const memories = this.cachedData!.memories;
      const index = memories.findIndex((m) => m.id === numId);
      if (index === -1) {
        throw new Error(`Không tìm thấy ô ảnh vị trí #${numId}`);
      }

      const existing = memories[index];
      const updated: MemoryItem = {
        ...existing,
        photoUrl: payload.photoUrl.trim() || existing.photoUrl,
        caption: typeof payload.caption === 'string' ? payload.caption.trim() : existing.caption,
        date: typeof payload.date === 'string' ? payload.date.trim() : existing.date,
        tag: typeof payload.tag === 'string' ? payload.tag.trim() : existing.tag,
      };

      memories[index] = updated;
      this.cachedData!.lastUpdated = new Date().toISOString();

      await this.persistInternal();
      triggerAutoGitPush();
      return structuredClone(updated);
    });
  }

  async updateMeta(payload: UpdateStationMetaPayload): Promise<MemoryStationData> {
    return this.withLock(async () => {
      await this.loadDataInternal();

      if (typeof payload.title === 'string' && payload.title.trim()) {
        this.cachedData!.title = payload.title.trim();
      }
      if (typeof payload.subtitle === 'string') {
        this.cachedData!.subtitle = payload.subtitle.trim();
      }
      if (typeof payload.quote === 'string' && payload.quote.trim()) {
        this.cachedData!.quote = payload.quote.trim();
      }
      if (typeof payload.authorNote === 'string') {
        this.cachedData!.authorNote = payload.authorNote.trim();
      }

      this.cachedData!.lastUpdated = new Date().toISOString();
      await this.persistInternal();
      triggerAutoGitPush();
      return structuredClone(this.cachedData!);
    });
  }

  private async persistInternal(): Promise<void> {
    if (!this.cachedData) return;
    const jsonStr = JSON.stringify(this.cachedData, null, 2);

    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, jsonStr, 'utf-8');
    } catch (err) {
      console.error('[MemoriesStore] Không thể ghi file:', this.filePath, err);
    }

    if (this.publicFilePath) {
      try {
        await fs.mkdir(path.dirname(this.publicFilePath), { recursive: true });
        await fs.writeFile(this.publicFilePath, jsonStr, 'utf-8');
      } catch {
        // Ignore public sync errors in test
      }
    }
  }
}

export function createMemoriesStore(options: MemoriesStoreOptions = {}): MemoriesStore {
  return new MemoriesStore(options);
}
