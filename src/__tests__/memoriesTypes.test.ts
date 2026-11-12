import { describe, it, expect } from 'vitest';
import { DEFAULT_MEMORIES_DATA } from '../data/defaultMemories';
import { MemoryItem, MemoryStationData } from '../types/memories';

describe('Kiểm tra tính toàn vẹn của Dữ liệu Trạm Ký Ức (11 Khung Ảnh Trái Tim)', () => {
  it('định nghĩa đúng cấu trúc MemoryStationData với tiêu đề và trích dẫn mặc định', () => {
    const data: MemoryStationData = DEFAULT_MEMORIES_DATA;
    expect(data.title).toContain('Trạm ký ức');
    expect(data.quote).toContain('Nơi lưu trữ');
    expect(Array.isArray(data.memories)).toBe(true);
    expect(data.memories.length).toBe(11);
  });

  it('lưới 11 khung ảnh được phân bổ chính xác theo 5 hàng hình trái tim', () => {
    const items: MemoryItem[] = DEFAULT_MEMORIES_DATA.memories;
    const row1 = items.filter((m) => m.row === 1);
    const row2 = items.filter((m) => m.row === 2);
    const row3 = items.filter((m) => m.row === 3);
    const row4 = items.filter((m) => m.row === 4);
    const row5 = items.filter((m) => m.row === 5);

    expect(row1.length).toBe(2); // Hàng 1: 2 ảnh (đỉnh 2 bên tim)
    expect(row2.length).toBe(3); // Hàng 2: 3 ảnh (có ảnh tâm lớn nhất)
    expect(row3.length).toBe(3); // Hàng 3: 3 ảnh ngang nhỏ
    expect(row4.length).toBe(2); // Hàng 4: 2 ảnh
    expect(row5.length).toBe(1); // Hàng 5: 1 ảnh đáy tim

    // Ảnh trung tâm hàng 2 (slot 4) phải là tâm trái tim lớn nhất
    const centerItem = items.find((m) => m.id === 4);
    expect(centerItem).toBeDefined();
    expect(centerItem?.row).toBe(2);
    expect(centerItem?.isCenterpiece).toBe(true);
  });

  it('mỗi khung ảnh có đầy đủ thuộc tính id từ 1 đến 11, photoUrl và ngày tháng hợp lệ', () => {
    const items = DEFAULT_MEMORIES_DATA.memories;
    for (let i = 1; i <= 11; i++) {
      const item = items.find((m) => m.id === i);
      expect(item).toBeDefined();
      expect(item?.photoUrl).toBeTruthy();
      expect(typeof item?.caption).toBe('string');
      expect(typeof item?.date).toBe('string');
    }
  });
});
