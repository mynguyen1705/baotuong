/**
 * Đếm số từ tiếng Việt chính xác (bỏ qua dấu gạch ngang đơn lẻ và khoảng trắng thừa).
 */
export function countVietnameseWords(text: string): number {
  if (!text) return 0;
  const cleaned = text
    .replace(/[—–\-•·…""''()[\]{}.,!?;:/\\|]+/g, ' ')
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

/**
 * Ước lượng số phút đọc dựa trên tốc độ đọc trung bình tiếng Việt (~200 từ/phút).
 */
export function estimateReadingMinutes(text: string): number {
  const words = countVietnameseWords(text);
  return Math.max(1, Math.round(words / 200));
}

