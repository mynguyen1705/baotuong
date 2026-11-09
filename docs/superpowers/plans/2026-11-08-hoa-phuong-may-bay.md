# Kế Hoạch Triển Khai: Cành Hoa Phượng Đỏ Tách Nền Trong Suốt & Phi Đội Máy Bay Giấy Chuyển Động Hai Bên Trang Chủ

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` and `superpowers:test-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai **Phương án 2** theo yêu cầu người dùng:
1. Sử dụng ảnh hoa phượng đỏ minh họa đã tách nền trong suốt 100% (`public/decorations/hoa-phuong.png`) bố trí ở hai bên trái & phải của trang chủ với hiệu ứng motion đung đưa tự nhiên.
2. Thêm phi đội máy bay giấy bay lượn sinh động (vài chiếc máy bay giấy màu vàng cam & xanh kèm đường nét đứt gió lượn qua hai bên).
3. Loại bỏ hoa hướng dương, tối ưu phong cách báo tường học trò 9A3.

---

### Task 1: Cập Nhật Kiểm Thử `src/__tests__/floralSideDecorations.test.tsx` (TDD)

**Files:**
- Modify: `src/__tests__/floralSideDecorations.test.tsx`

- [x] **Step 1: Cập nhật test cases để kiểm tra:**
  - Hiển thị Cành Hoa Phượng Đỏ bên trái (`flamboyant-branch-left`) và bên phải (`flamboyant-branch-right`).
  - Kiểm tra sử dụng ảnh đã tách nền trong suốt `/decorations/hoa-phuong.png`.
  - Hiển thị phi đội máy bay giấy bay lượn (`flying-paper-airplanes`) với ít nhất 3 chiếc máy bay giấy lướt gió.
  - Không còn chứa hoa hướng dương theo Phương án 2.
- [x] **Step 2: Chạy test để xác nhận test ban đầu thất bại đúng kỳ vọng (Red stage)**.

---

### Task 2: Cập Nhật Component `FloralSideDecorations.tsx` (Phương Án 2)

**Files:**
- Modify: `src/components/FloralSideDecorations.tsx`

- [x] **Step 1: Nâng cấp `SwayingFlamboyantBranch`:**
  - Sử dụng ảnh trong suốt `/decorations/hoa-phuong.png` với bộ lọc ánh sáng ấm, đổ bóng nhẹ `drop-shadow`.
  - Cành trái & cành phải đối xứng tự nhiên qua trục ngang.
  - Hiệu ứng motion đung đưa mượt mà (`rotate`, `y`) theo chu kỳ gió thoảng.
  - Giữ các lớp hoa và lá non SVG đung đưa lệch pha trên thân cành.
- [x] **Step 2: Xây dựng `FlyingPaperAirplanes`:**
  - 4 chiếc máy bay giấy origami màu vàng hoàng yến và xanh thiên thanh bay theo các quỹ đạo lượn sóng khác nhau.
  - Mỗi chiếc có vệt đường bay nét đứt cong (`dashed wind trail`).
  - Chuyển động lượn vòng: bay, nghiêng cánh (roll/tilt), lướt êm với `motion.div` lặp vô tận.
- [x] **Step 3: Bố trí `FloralSideDecorations` dọc hai bên trang chủ:**
  - Bố trí các cụm cành phượng đỏ ở góc trên và dọc thân hai bên mép trang báo.
  - Đặt phi đội máy bay giấy lướt nhẹ nhàng phía trên nền báo tường mà không che chắn nội dung tương tác (`pointer-events-none`).
- [x] **Step 4: Chạy lại toàn bộ test suite (`vitest`) và kiểm tra bản dựng (`npm run build`)**.

