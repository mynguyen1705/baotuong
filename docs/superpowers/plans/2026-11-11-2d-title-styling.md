# Kế Hoạch Chuyển Đổi Tiêu Đề 2D Với Viền Trắng Bọc Ngoài

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Mục tiêu
Chuyển đổi tiêu đề báo tường "CHẮP CÁNH ƯỚC MƠ" ở cả **phần trên (HeroMasthead)** và **phần dưới (InteractivePosterView)** từ kiểu 3D đùn khối cũ sang phong cách **2D phẳng hiện đại**, chuẩn màu cam ấm áp và có **viền trắng bọc ngoài dày đẹp (white outline)** đúng như ảnh thiết kế mẫu `media_1794407722933_336e95a1.jpg`.

## Các file chỉnh sửa
1. `src/index.css`: Cập nhật class `.title-2d-orange` với font `Baloo 2` / `Be Vietnam Pro`, màu cam tươi sáng (`#EA580C`), `paint-order: stroke fill`, viền trắng bọc ngoài (`-webkit-text-stroke: 6px #ffffff`), bóng đổ phẳng nhẹ 2D (`drop-shadow(0 4px 8px rgba(180, 83, 9, 0.2))`). Thay thế `.title-3d-orange` cũ hoặc giữ tương thích ngược.
2. `src/components/HeroMasthead.tsx`: Áp dụng class `title-2d-orange` cho hai dòng "CHẮP CÁNH" và "ƯỚC MƠ", căn chỉnh badge "BÁO TƯỜNG SỐ" bo góc nền ấm và các ngôi sao lấp lánh 2D đồng điệu với ảnh mẫu.
3. `src/components/InteractivePosterView.tsx`: Cập nhật tiêu đề h2 "CHẮP CÁNH ƯỚC MƠ" thành kiểu 2D phẳng màu cam gạch `#C2410C` trang nhã, không còn hiệu ứng 3D khối.
4. `src/__tests__/interactivePosterView.test.tsx` & `src/__tests__/appInteraction.test.tsx`: Xác nhận tất cả test chạy thông suốt và kiểm tra regression.

---

### Task 1: Cập nhật CSS định nghĩa kiểu chữ 2D viền trắng (`src/index.css`)
- [ ] Thêm class `.title-2d-orange` trong `src/index.css` với:
  - `font-family: "Baloo 2", cursive, sans-serif; font-weight: 800;`
  - `color: #EA580C; text-transform: uppercase;`
  - `paint-order: stroke fill; -webkit-text-stroke: 7px #ffffff;`
  - `text-shadow` viền phụ và drop-shadow nhẹ `drop-shadow(0 3px 6px rgba(180, 83, 9, 0.22))` tạo viền trắng nổi bật trên nền giấy ấm.
  - Cập nhật `.title-3d-orange` kế thừa hoặc alias sang `.title-2d-orange` để không làm vỡ các thành phần liên quan.

### Task 2: Cập nhật tiêu đề ở trên (`src/components/HeroMasthead.tsx`)
- [ ] Sửa thẻ `h1`: dùng `title-2d-orange` cho "CHẮP CÁNH" và "ƯỚC MƠ".
- [ ] Chỉnh badge "BÁO TƯỜNG SỐ" bo tròn nền màu cam đào/vàng ngà `#FED7AA` viền mỏng `#FDBA74` như ảnh mẫu.
- [ ] Bổ sung các icon ngôi sao lấp lánh nhẹ 2D hai bên tiêu đề như trong hình thiết kế.

### Task 3: Cập nhật tiêu đề ở dưới trong Sơ đồ (`src/components/InteractivePosterView.tsx`)
- [ ] Sửa thẻ `h2` trong Sơ đồ cấu trúc thành 2D phẳng: `text-3xl sm:text-5xl font-extrabold uppercase tracking-wide text-[#C2410C] font-display`.

### Task 4: Kiểm thử và nghiệm thu
- [ ] Chạy `npm test -- --run` đảm bảo 51/51 tests pass.
- [ ] Chạy `npm run build` xác nhận không có lỗi TypeScript / CSS.
- [ ] Commit thay đổi với thông điệp rõ ràng và push lên git.

