/**
 * Đọc tệp ảnh do người dùng chọn và chuyển thành Data URL (tự động thu gọn kích thước qua Canvas nếu trình duyệt hỗ trợ để tải lên nhanh và nhẹ).
 */
export async function fileToImageDataUrl(file: File, maxDimension = 720): Promise<string> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh đã chọn.'));
    reader.readAsDataURL(file);
  });

  // Trong môi trường test (jsdom) hoặc ảnh nhỏ dưới 250KB, trả về ngay Data URL gốc
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    file.size <= 250 * 1024 ||
    typeof HTMLCanvasElement === 'undefined'
  ) {
    return rawDataUrl;
  }

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        if (!width || !height) {
          resolve(rawDataUrl);
          return;
        }
        const scale = Math.min(1, maxDimension / Math.max(width, height));
        const targetW = Math.max(1, Math.round(width * scale));
        const targetH = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressed && compressed.startsWith('data:image/') ? compressed : rawDataUrl);
      } catch {
        resolve(rawDataUrl);
      }
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

