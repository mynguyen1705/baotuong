# Thiết Kế: Thay Thế "Sơ Đồ Infographic Toàn Cảnh" Bằng Ảnh Minh Họa Poster Tương Tác

## 1. Mục Tiêu & Yêu Cầu Thiết Kế
- **Ảnh Minh Họa Poster Toàn Cảnh**:
  - Tích hợp tệp ảnh minh họa poster hoàn chỉnh do người dùng cung cấp (`public/posters/poster-toan-canh.jpg`).
  - Hiển thị toàn bộ bức tranh poster khổ dọc (tỷ lệ 482x1024) sắc nét, được đóng khung nghệ thuật với viền vàng kim, bóng đổ sâu và nền giấy kem vintage.
- **Tính Năng Tương Tác Trực Tiếp Trên Poster (Interactive Hotspots)**:
  - Định vị chính xác 5 vùng nút bấm "NHẤP VÀO ĐÂY ĐỂ XEM" trên ảnh poster:
    1. **Mục 1. LỜI NGỎ**: tọa độ `top: ~38.8%`, `left: ~8.8%`, `width: ~33%`.
    2. **Mục 2. TRUYỆN NGẮN**: tọa độ `top: ~47.0%`, `left: ~57.2%`, `width: ~34%`.
    3. **Mục 3. THƠ (Ơn thầy nâng cánh)**: tọa độ `top: ~67.2%`, `left: ~8.2%`, `width: ~33%`.
    4. **Mục 4. ÂM NHẠC (Bài ca tri ân)**: tọa độ `top: ~77.4%`, `left: ~58.2%`, `width: ~34%`.
    5. **Mục 5. BÀI TRI ÂN**: tọa độ `top: ~96.2%`, `left: ~32.8%`, `width: ~42%`.
  - Hiệu ứng tương tác: Khi rê chuột hoặc chạm tay vào nút trên poster, xuất hiện viền phát sáng (pulsing glow/halo) và bàn tay trỏ, khi bấm vào sẽ mở ngay khung đọc nội dung chi tiết của chuyên mục đó (`onSelectSection(section.id)`).
- **Thanh Công Cụ Hỗ Trợ & Thang Điểm Thể Lệ**:
  - Giữ lại phần Thang điểm 100 điểm và Tổ chức thực hiện Chi đội 9A3 bên dưới poster.
  - Thêm thanh chuyển nhanh đến 5 mục và nút mở Mã QR.

## 2. Cấu Trúc File
- `public/posters/poster-toan-canh.jpg`: Ảnh minh họa gốc chất lượng cao.
- `src/components/InteractivePosterView.tsx`: Component hiển thị ảnh poster tương tác.
- `src/__tests__/interactivePosterView.test.tsx`: Test kiểm thử hiển thị ảnh poster và click 5 vùng tương tác.

