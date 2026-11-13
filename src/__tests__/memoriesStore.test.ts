import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createMemoriesStore, MemoriesStore } from '../server/memoriesStore';

describe('MemoriesStore Backend Unit Tests', () => {
  let tempDir: string;
  let testFilePath: string;
  let store: MemoriesStore;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'memories-store-test-'));
    testFilePath = path.join(tempDir, 'memories.json');
    store = createMemoriesStore({ filePath: testFilePath });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  });

  it('khởi tạo dữ liệu mặc định khi file chưa tồn tại', async () => {
    const data = await store.getStationData();
    expect(data.title).toContain('Trạm ký ức');
    expect(data.memories.length).toBe(13);
  });

  it('cho phép Owner cập nhật ảnh và lời nhắn cho từng slot (1..13)', async () => {
    const updated = await store.updateSlot(4, {
      photoUrl: 'data:image/jpeg;base64,mockphoto',
      caption: 'Ảnh mới chụp ngày 20/11 lớp 9A3',
      date: '20/11/2026',
    });

    expect(updated.id).toBe(4);
    expect(updated.photoUrl).toBe('data:image/jpeg;base64,mockphoto');
    expect(updated.caption).toBe('Ảnh mới chụp ngày 20/11 lớp 9A3');

    // Đọc lại từ store xác nhận tính bền vững
    const current = await store.getStationData();
    const slot4 = current.memories.find((m) => m.id === 4);
    expect(slot4?.photoUrl).toBe('data:image/jpeg;base64,mockphoto');
    expect(slot4?.caption).toBe('Ảnh mới chụp ngày 20/11 lớp 9A3');
  });

  it('báo lỗi khi cập nhật slot không hợp lệ (ngoài khoảng 1..12)', async () => {
    await expect(
      store.updateSlot(99, { photoUrl: 'test' })
    ).rejects.toThrow(/không hợp lệ/i);
  });

  it('cho phép cập nhật tiêu đề và câu trích dẫn của Trạm Ký Ức', async () => {
    const updated = await store.updateMeta({
      title: 'Khoảnh Khắc Đẹp Nhất 9A3',
      quote: 'Dẫu mai đi bốn phương trời, ơn thầy nghĩa cô chẳng phai mờ.',
    });

    expect(updated.title).toBe('Khoảnh Khắc Đẹp Nhất 9A3');
    expect(updated.quote).toBe('Dẫu mai đi bốn phương trời, ơn thầy nghĩa cô chẳng phai mờ.');

    const current = await store.getStationData();
    expect(current.title).toBe('Khoảnh Khắc Đẹp Nhất 9A3');
  });
});

