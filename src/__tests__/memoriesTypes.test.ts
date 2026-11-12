import { describe, it, expect } from 'vitest';
import { DEFAULT_MEMORIES_DATA } from '../data/defaultMemories';
import { MemoryItem, MemoryStationData } from '../types/memories';

describe('Kiểm tra tính toàn vẹn của Dữ liệu Trạm Ký Ức (Lưới 12 Khung Ảnh Lấp Đầy)', () => {
  it('định nghĩa đúng cấu trúc MemoryStationData với tiêu đề và trích dẫn mặc định', () => {
    const data: MemoryStationData = DEFAULT_MEMORIES_DATA;
    expect(data.title).toContain('Trạm ký ức');
    expect(data.quote).toContain('Nơi lưu trữ');
    expect(Array.isArray(data.memories)).toBe(true);
    expect(data.memories.length).toBe(12);
  });

  it('lưới ảnh gồm 12 khung ảnh với ảnh trung tâm mang cờ hoa và ngày 20/11', () => {
    const items: MemoryItem[] = DEFAULT_MEMORIES_DATA.memories;
    expect(items.length).toBe(12);

    // Ảnh trung tâm (slot 4) phải có cờ hoa hoặc centerpiece
    const centerItem = items.find((m) => m.id === 4);
    expect(centerItem).toBeDefined();
    expect(centerItem?.isCenterpiece).toBe(true);
  });

  it('mỗi khung ảnh có đầy đủ thuộc tính id từ 1 đến 12, photoUrl và ngày tháng hợp lệ', () => {
    const items = DEFAULT_MEMORIES_DATA.memories;
    for (let i = 1; i <= 12; i++) {
      const item = items.find((m) => m.id === i);
      expect(item).toBeDefined();
      expect(item?.photoUrl).toBeTruthy();
      expect(typeof item?.caption).toBe('string');
      expect(typeof item?.date).toBe('string');
    }
  });
});

