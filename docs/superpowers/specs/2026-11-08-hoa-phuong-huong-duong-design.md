# Đặc tả Thiết kế: Trang Trí Hoa Phượng Đỏ & Hoa Hướng Dương Chuyển Động Hai Bên Trang Chủ

- **Ngày tạo:** 2026-11-08
- **Dự án:** Báo tường điện tử 20/11 – Chi đội 9A3, Trường TH&THCS Hiệp Thạnh
- **Phương án được chọn:** Phương án C (Kết hợp hình ảnh gốc đã xử lý hòa trộn nền trong suốt + các lớp cành lá, bông hoa phượng và hoa hướng dương SVG chuyển động đa tầng bằng `motion`)
- **Bố cục:** Cả hai bên lề Trái & Phải của trang chủ đều có **Cành Hoa Phượng Đỏ** vươn từ phía trên xuống và **Khóm Hoa Hướng Dương** vươn từ phía dưới/giữa lên dọc theo hai bên trang chủ.

---

## 1. Mục tiêu Thiết kế & Thị giác

1. **Tái hiện sống động 2 hình minh họa người dùng cung cấp:**
   - **Hoa Phượng Đỏ (`public/decorations/hoa-phuong.jpg` + lớp SVG cành phượng đa tầng):**
     - Đặt ở hai góc và dọc phần thân trên bên Trái (lật đối xứng tự nhiên vươn từ lề trái vào) và bên Phải (vươn từ lề phải vào).
     - Dùng hòa trộn `mix-blend-multiply` kết hợp `mask-image` làm mờ viền và tăng độ tương phản nhẹ để nền trắng hoàn toàn trong suốt trên nền giấy báo tường.
     - Kết hợp các nhánh lá phượng kép (bipinnate leaves), nụ phượng và chùm hoa phượng 5 cánh đỏ cam bằng SVG đè lên trên, chuyển động lệch pha nhau.
   - **Hoa Hướng Dương (`public/decorations/hoa-huong-duong.jpg` + lớp SVG khóm hướng dương màu nước):**
     - Đặt ở hai bên lề Trái & Phải (ở tầm giữa và dưới trang chủ), vươn cành lá xanh và 3 bông hướng dương vàng rực rỡ lên đón nắng.
     - Xử lý `mix-blend-multiply` + tinh chỉnh độ sáng/tương phản (`brightness(1.06) contrast(1.08)`) + `mask-image` elip mềm để nền giấy màu nước hòa quyện hoàn toàn vào nền trang chủ.
     - Bổ sung các bông hướng dương và lá xanh SVG đa lớp đung đưa nhịp nhàng theo gió.

2. **Hiệu ứng Chuyển động Đung đưa Tự nhiên (`motion/react`):**
   - **Chuyển động cành chính (Primary Sway):** Xoay nhẹ quanh gốc cành (`transformOrigin: 'top left'` / `'top right'` cho hoa phượng; `'bottom center'` cho khóm hướng dương) với góc nghiêng `[-2.8deg, 3.2deg, -2.8deg]` chu kỳ `5.5s – 6.5s`, `ease: 'easeInOut'`, lặp vô hạn (`repeat: Infinity`).
   - **Chuyển động nhánh phụ & bông hoa (Secondary Layered Sway):** Các chùm hoa phượng, nhánh lá non và từng đầu bông hướng dương SVG có chu kỳ lệch pha (`3.6s – 4.8s`) tạo cảm giác cả tán cây và từng bông hoa đang rung rinh thật sự trong làn gió thu 20/11.
   - **An toàn tương tác & Hiển thị đáp ứng (Responsive):**
     - Toàn bộ khung trang trí hai bên có `pointer-events-none` để không bao giờ cản trở thao tác bấm nút hoặc đọc bài của người dùng.
     - Hiển thị kích thước vừa vặn trên màn hình điện thoại và bung rộng đầy đặn trên màn hình máy tính/máy chiếu.

