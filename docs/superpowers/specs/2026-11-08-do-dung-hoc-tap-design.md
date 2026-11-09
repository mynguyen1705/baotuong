# Thiết Kế: Trang Trí Sách Vở, Đồ Dùng Học Tập, Kí Hiệu Toán Học & Hóa Học Hai Bên Trang Chủ

## 1. Mục Tiêu & Yêu Cầu Thiết Kế
- **Xóa Bỏ Toàn Bộ Hoa**:
  - Loại bỏ hoàn toàn hình ảnh hoa phượng đỏ, hoa hướng dương, chùm hoa và cánh hoa rơi trên toàn bộ trang chủ báo tường (cả hai bên trái/phải, góc trên Masthead và nền).
- **Trang Trí Sách Vở & Đồ Dùng Học Tập Hai Bên (Trái & Phải)**:
  - **Sách & Vở**:
    - Chồng sách giáo khoa / bách khoa bìa màu xanh navy, đỏ gạch, vàng nghệ với gáy sách dập chỉ vintage.
    - Cuốn vở học sinh ô ly mở sẵn trang giấy kẻ ô kẻ ngang với nét bút mực tím học trò.
  - **Đồ Dùng Học Tập**:
    - Thước kẻ gỗ chia vạch milimet, thước ê-ke tam giác góc vuông, thước đo độ bán nguyệt (protractor).
    - Compa kim loại màu bạc vẽ đường tròn.
    - Bút máy mạ vàng, bút chì gỗ 2B chuốt nhọn, bút dạ quang vàng neon highlight.
  - **Kí Hiệu & Dụng Cụ Hóa Học**:
    - Bình tam giác Erlenmeyer chứa dung dịch màu xanh ngọc / tím lam với bọt khí sủi tăm bay lên (`bubbles floating motion`).
    - Ống nghiệm có vạch đo thể tích.
    - Vòng benzen thơm $C_6H_6$, phân tử nước $H_2O$, khí $CO_2$.
    - Cấu trúc nguyên tử hạt nhân với 3 quỹ đạo electron elip xoay quanh (`atom orbital motion`).
  - **Kí Hiệu Toán Học & Công Thức**:
    - Các ký hiệu kinh điển: $\pi$, $\sqrt{x}$, $\sum_{i=1}^n$, $\int f(x)dx$, $\infty$, $\Delta > 0$, $a^2 + b^2 = c^2$, $\sin^2\alpha + \cos^2\alpha = 1$.
    - Hình phác thảo hình học không gian (tam giác vuông, hình nón, góc $\alpha$).
  - **Máy Bay Giấy Tuổi Học Trò**:
    - Giữ lại phi đội máy bay giấy origami màu vàng hoàng yến và xanh da trời bay lượn nhẹ nhàng kèm đường nét đứt gió.
- **Hiệu Ứng Motion**:
  - Sách vở và dụng cụ học tập đung đưa bồng bềnh nhẹ nhàng theo phương thẳng đứng và xoay góc nhẹ (`rotate: [-2deg, 3deg, -2deg]`, `y: [0, 8px, 0]`, duration 4.5s - 6s).
  - Bọt khí trong bình hóa học sủi tăm nổi lên.
  - Vòng elip electron nguyên tử xoay tròn lấp lánh.
  - Ký hiệu toán học và hóa học lơ lửng, nhấp nháy phát sáng nhẹ nhàng tạo không khí học thuật tràn đầy cảm hứng.

## 2. Các Thành Phần & Tệp Tin
1. `src/components/SchoolDecorations.tsx`:
   - `VintageBookStackSVG`: Chồng sách vintage tri thức.
   - `OpenNotebookSVG`: Vở ô ly mở kèm bút và thước.
   - `StationerySetSVG`: Thước kẻ ê-ke, compa, bút chì.
   - `ChemistryLabSVG`: Bình tam giác Erlenmeyer sủi bọt khí + ống nghiệm + vòng benzen $C_6H_6$.
   - `AtomModelSVG`: Mô hình nguyên tử có electron xoay.
   - `MathFormulasDoodleSVG`: Các công thức và ký hiệu toán học phác thảo.
   - `SchoolSideDecorations`: Bố trí hai bên trái & phải của trang chủ.
2. `src/components/HeroMasthead.tsx`:
   - Thay cụm hoa phượng ở góc trái trên cùng bằng Biểu tượng Sách Mở & Bút Thước Học Trò.
3. `src/App.tsx`:
   - Thay `FloralSideDecorations` và `FallingPetals` bằng `SchoolSideDecorations` và `FloatingAcademicSparkles`.
4. `src/__tests__/floralSideDecorations.test.tsx` (hoặc test mới `schoolDecorations.test.tsx`):
   - Đảm bảo không còn hoa phượng/hướng dương, hiển thị đầy đủ sách vở, dụng cụ học tập, ký hiệu toán/hóa và máy bay giấy.

