/**
 * Kiểm tra xem trình duyệt hiện tại có đang mở trực tiếp trên máy chủ của chủ sở hữu (localhost / 127.0.0.1) hay không.
 */
export function isLocalhostClient(): boolean {
  if (typeof window === 'undefined' || !window.location) {
    return true;
  }
  const hostname = (window.location.hostname || '').toLowerCase();
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname === '::1'
  );
}

