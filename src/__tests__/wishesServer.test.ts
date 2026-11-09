import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { validateWishInput, sanitizePlainText } from '../utils/validateWish';
import { createWishesStore, DuplicateWishError } from '../server/wishesStore';
import { createWishesMiddleware } from '../server/wishesApiPlugin';
import type { IncomingMessage, ServerResponse } from 'node:http';

describe('validateWishInput & sanitizePlainText', () => {
  it('loại bỏ khoảng trắng thừa và ký tự điều khiển nhưng giữ nguyên văn bản thuần', () => {
    expect(sanitizePlainText('  Nguyễn   Văn A \u0000 ')).toBe('Nguyễn Văn A');
  });

  it('báo lỗi khi thiếu tên người gửi, lớp hoặc lời chúc quá ngắn (< 10 ký tự)', () => {
    const result = validateWishInput({
      senderName: ' ',
      className: '',
      message: 'Ngắn',
    });
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.senderName).toBeDefined();
    expect(result.fieldErrors.className).toBeDefined();
    expect(result.fieldErrors.message).toBeDefined();
  });

  it('chấp nhận dữ liệu hợp lệ của học sinh', () => {
    const result = validateWishInput({
      senderName: ' Trần Minh Anh ',
      className: ' 9A3 ',
      message: 'Em kính chúc thầy cô luôn mạnh khỏe và hạnh phúc nhân ngày 20/11!',
    });
    expect(result.valid).toBe(true);
    expect(result.cleaned).toEqual({
      senderName: 'Trần Minh Anh',
      className: '9A3',
      message: 'Em kính chúc thầy cô luôn mạnh khỏe và hạnh phúc nhân ngày 20/11!',
    });
  });
});

describe('createWishesStore centralized server persistence', () => {
  let tempDir: string;
  let storageFile: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'baotuong-wishes-'));
    storageFile = path.join(tempDir, 'wishes.json');
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('lưu lời chúc vào tệp máy chủ và đọc lại được từ instance store khác (mô phỏng thiết bị B)', async () => {
    const storeA = createWishesStore({ storageFilePath: storageFile });
    const created = await storeA.addWish({
      senderName: 'Lê Hoàng Nam',
      className: '9A3',
      message: 'Chúc thầy cô 20/11 tràn ngập niềm vui và nhiệt huyết!',
    });
    expect(created.id).toBeTruthy();

    const storeB = createWishesStore({ storageFilePath: storageFile });
    const list = await storeB.listWishes();
    expect(list).toHaveLength(1);
    expect(list[0].senderName).toBe('Lê Hoàng Nam');
    expect(list[0].className).toBe('9A3');
  });

  it('chặn gửi trùng cùng nội dung trong cửa sổ thời gian chống lặp', async () => {
    const store = createWishesStore({ storageFilePath: storageFile, duplicateWindowMs: 30_000 });
    const payload = {
      senderName: 'Phạm Gia Hân',
      className: '9A3',
      message: 'Cảm ơn thầy cô đã luôn tận tình dìu dắt chúng em!',
    };
    await store.addWish(payload);
    await expect(store.addWish(payload)).rejects.toBeInstanceOf(DuplicateWishError);
  });

  it('xử lý HTTP POST từ Trình duyệt A và HTTP GET từ Trình duyệt B qua /api/wishes mà không lộ khóa bí mật server', async () => {
    const store = createWishesStore({ storageFilePath: storageFile });
    const middleware = createWishesMiddleware(store);

    const invokeMiddleware = (method: string, url: string, bodyObj?: unknown) =>
      new Promise<{ statusCode: number; body: string }>((resolve) => {
        const bodyStr = bodyObj ? JSON.stringify(bodyObj) : '';
        const req: IncomingMessage = {
          method,
          url,
          on(event, listener) {
            if (event === 'data' && bodyStr) {
              (listener as (chunk: string) => void)(bodyStr);
            }
            if (event === 'end') {
              (listener as () => void)();
            }
            return this;
          },
        };
        const res: ServerResponse = {
          statusCode: 200,
          setHeader() {},
          end(data?: string) {
            resolve({ statusCode: this.statusCode, body: data || '' });
          },
        };
        middleware(req, res, () => {
          resolve({ statusCode: 404, body: '' });
        });
      });

    // 1. Trình duyệt A gửi dữ liệu không hợp lệ -> 400
    const badRes = await invokeMiddleware('POST', '/api/wishes', {
      senderName: 'A',
      className: '9A3',
      message: 'Ngắn',
    });
    expect(badRes.statusCode).toBe(400);

    // 2. Trình duyệt A gửi lời chúc hợp lệ -> 201
    const postRes = await invokeMiddleware('POST', '/api/wishes', {
      senderName: 'Bùi Ngọc Ánh',
      className: '9A3',
      message: 'Nhân ngày 20/11, em kính chúc các thầy cô luôn dồi dào sức khỏe và tràn đầy niềm vui!',
    });
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body).not.toContain('signatureHash');

    // 3. Trình duyệt A bấm gửi trùng ngay lập tức -> 409
    const dupRes = await invokeMiddleware('POST', '/api/wishes', {
      senderName: 'Bùi Ngọc Ánh',
      className: '9A3',
      message: 'Nhân ngày 20/11, em kính chúc các thầy cô luôn dồi dào sức khỏe và tràn đầy niềm vui!',
    });
    expect(dupRes.statusCode).toBe(409);

    // 4. Trình duyệt B (thiết bị của thầy cô) gọi GET /api/wishes -> 200 & nhận đúng lời chúc
    const getRes = await invokeMiddleware('GET', '/api/wishes');
    expect(getRes.statusCode).toBe(200);
    const parsedGet = JSON.parse(getRes.body) as {
      wishes: Array<{ senderName: string; className: string; message: string; signatureHash?: string }>;
    };
    expect(parsedGet.wishes).toHaveLength(1);
    expect(parsedGet.wishes[0].senderName).toBe('Bùi Ngọc Ánh');
    expect(parsedGet.wishes[0].className).toBe('9A3');
    expect(parsedGet.wishes[0].signatureHash).toBeUndefined();
  });
});

