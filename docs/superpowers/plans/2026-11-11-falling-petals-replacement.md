# Kế Hoạch Xóa Hoàn Toàn Chồng Sách, Lọ Thuốc & Thay Thế Bằng Hiệu Ứng Cánh Hoa Rơi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Mục tiêu
Xóa bỏ hoàn toàn (không làm mờ) các biểu tượng chồng sách vở, cuốn vở mở, bình thí nghiệm/lọ thuốc, mô hình nguyên tử trên toàn bộ giao diện; thay thế bằng component hiệu ứng **Cánh hoa sen & Lá phong rơi nhẹ nhàng (Falling Petals)** bay chao liệng tự nhiên từ trên xuống dưới, hài hòa tuyệt đối với tranh nền lớp học 20/11.

## Các file chỉnh sửa
1. `src/components/FallingPetals.tsx` (Mới): Component tạo hiệu ứng cánh hoa sen hồng và lá phong vàng cam rơi từ trên xuống, xoay lượn tự nhiên và tối ưu hiệu năng.
2. `src/components/SchoolDecorations.tsx`: Xóa bỏ các biểu tượng sách vở, lọ thuốc hoặc thay thế cấu trúc gọn gàng cho hiệu ứng hoa rơi.
3. `src/components/InteractivePosterView.tsx`: Xóa bỏ biểu tượng chồng sách `VintageBookStackSVG` ở góc trên khung sơ đồ.
4. `src/components/HeroMasthead.tsx`: Xóa bỏ hoàn toàn các phần tử chồng sách và khinh khí cầu.
5. `src/App.tsx`: Tích hợp `<FallingPetals />` vào trang chính, loại bỏ hoàn toàn các cụm sách vở, lọ thuốc.
6. `src/__tests__/floralSideDecorations.test.tsx`: Cập nhật test suite để kiểm tra đã xóa sạch hoàn toàn chồng sách, lọ thuốc/hóa chất và kích hoạt thành công hiệu ứng cánh hoa rơi.

---

### Task 1: Tạo component hiệu ứng Cánh hoa rơi (`src/components/FallingPetals.tsx`)
- [ ] Thiết kế các vector SVG cánh hoa sen (lotus petal) màu hồng phấn phớt cam và lá phong thu vàng cam.
- [ ] Tạo animation rơi mềm mại từ trên màn hình xuống dưới chân trang với độ chao nghiêng và xoay 3D ngẫu nhiên bằng `motion/react`.
- [ ] Gán `data-testid="falling-petals"` và `pointer-events-none`.

### Task 2: Dọn dẹp hoàn toàn các biểu tượng sách vở & lọ thuốc
- [ ] Trong `src/components/HeroMasthead.tsx`: Xóa các thẻ chứa `VintageBookStackSVG` và `HotAirBalloonSVG`.
- [ ] Trong `src/components/InteractivePosterView.tsx`: Xóa `VintageBookStackSVG` ở góc khung infographic.
- [ ] Trong `src/App.tsx`: Thay `<SchoolSideDecorations />` bằng `<FallingPetals />`.
- [ ] Trong `src/components/SchoolDecorations.tsx`: Giữ lại export tương thích chuyển hướng sang `FallingPetals`.

### Task 3: Cập nhật kiểm thử (`src/__tests__/floralSideDecorations.test.tsx`)
- [ ] Kiểm tra rằng không còn bất kỳ biểu tượng chồng sách, lọ thuốc, bình hóa học, mô hình nguyên tử nào trong DOM.
- [ ] Kiểm tra `<FallingPetals />` hiển thị đầy đủ các cánh hoa rơi chao liệng.

### Task 4: Kiểm thử toàn diện & Đẩy mã nguồn
- [ ] Chạy `npm test -- --run` xác nhận 51/51 tests pass.
- [ ] Chạy `npm run build` xác nhận không có lỗi build.
- [ ] Commit và push lên nhánh `redesign-ui`.
