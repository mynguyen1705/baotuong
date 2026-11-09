import { describe, it, expect } from 'vitest';
import { countVietnameseWords, estimateReadingMinutes } from '../utils/wordCount';

describe('countVietnameseWords', () => {
  it('đếm chính xác số từ tiếng Việt có dấu và bỏ qua khoảng trắng thừa', () => {
    expect(countVietnameseWords('  Tôn sư   trọng đạo - Nét bút tri ân! ')).toBe(8);
  });

  it('trả về 0 cho chuỗi rỗng', () => {
    expect(countVietnameseWords('   ')).toBe(0);
  });

  it('ước lượng thời gian đọc tối thiểu 1 phút cho văn bản ngắn', () => {
    expect(estimateReadingMinutes('Chắp cánh ước mơ lớp 9A3')).toBe(1);
  });
});

