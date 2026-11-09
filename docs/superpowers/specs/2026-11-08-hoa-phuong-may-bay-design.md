# Thiết Kế: Cành Hoa Phượng Đỏ Tách Nền Trong Suốt & Phi Đội Máy Bay Giấy Chuyển Động Hai Bên Trang Chủ

## 1. Mục Tiêu & Yêu Cầu Thiết Kế
- **Cành Hoa Phượng Đỏ Hai Bên (Trái & Phải)**:
  - Sử dụng hình ảnh minh họa hoa phượng đỏ do người dùng cung cấp đã tách nền hoàn toàn trong suốt (`public/decorations/hoa-phuong.png`).
  - Bố trí ở cả bên trái và bên phải trang chủ báo tường:
    - Nhánh trên rủ từ góc trên xuống (`top: -10px`, hai bên mép màn hình).
    - Nhánh phụ ở tầng giữa trang báo (`top: ~780px` và `top: ~1400px`) tạo sự liền mạch dọc theo trang báo tường.
  - Hiệu ứng motion:
    - Gốc cành đung đưa nhẹ nhàng theo chu kỳ gió (`rotate: [-1.8deg, 2.5deg, -1.8deg]`, `y: [0, 4px, 0]`, duration 4.8s - 5.6s).
    - Các chùm hoa đỏ cam và tàu lá phượng xanh non SVG phụ trợ đung đưa lệch pha trên cành.
- **Phi Đội Máy Bay Giấy Đang Bay (Flying Paper Airplanes)**:
  - 4 chiếc máy bay giấy origami phong cách học trò (màu vàng cam và xanh trời) bay lượn trên nền trang báo.
  - Có vệt đường bay nét đứt uốn lượn mềm mại (`dashed wind trail`).
  - Chuyển động lướt gió: bay theo quỹ đạo cong, nghiêng cánh (roll/tilt) khi đổi hướng, tạo cảm giác sinh động và hoài niệm tuổi học trò.
- **Phong Cách & Hòa Trộn**:
  - Tách nền 100% trong suốt, thêm đổ bóng nhẹ mờ (`drop-shadow(0 6px 14px rgba(180, 83, 9, 0.12))`) để cành phượng nổi bật tự nhiên trên nền giấy báo kem vintage.
  - Loại bỏ các phần tử hoa hướng dương theo đúng lựa chọn Phương án 2 của người dùng.

## 2. Cấu Trúc Thành Phần
1. `src/components/FloralSideDecorations.tsx`:
   - `SwayingFlamboyantBranch`: Component cành hoa phượng đỏ tách nền + lớp SVG lá và chùm hoa đung đưa.
   - `FlyingPaperAirplanes`: Component phi đội 4 máy bay giấy bay lượn kèm đường nét đứt gió.
   - `FloralSideDecorations`: Container tổng hợp bao trọn hai bên trái và phải của trang chủ.
2. `src/__tests__/floralSideDecorations.test.tsx`:
   - Kiểm tra hiển thị cành phượng đỏ tách nền ở cả 2 bên trái & phải (`flamboyant-branch-left`, `flamboyant-branch-right`).
   - Kiểm tra hiển thị phi đội máy bay giấy bay lượn (`flying-paper-airplanes`).
   - Kiểm tra ảnh `hoa-phuong.png` được sử dụng với thuộc tính trong suốt.

