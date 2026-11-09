# Kế Hoạch Triển Khai: Thay Thế Toàn Bộ Hoa Bằng Sách Vở, Đồ Dùng Học Tập & Kí Hiệu Toán - Hóa Học

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` and `superpowers:test-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xóa toàn bộ hoa trên web báo tường; thay thế bằng hệ thống trang trí hai bên trang chủ gồm **những quyển sách, vở, đồ dùng học tập (thước kẻ, ê-ke, compa, bút), kí hiệu và dụng cụ hóa học (bình thí nghiệm sủi bọt, nguyên tử, vòng benzen), kí hiệu toán học ($\pi, \sqrt{x}, \sum, \int, a^2+b^2=c^2$)** chuyển động nhịp nhàng (motion), cùng phi đội máy bay giấy bay lượn.

---

### Task 1: Viết Kiểm Thử TDD Cho Hệ Thống Trang Trí Đồ Dùng Học Tập & Toán - Hóa

**Files:**
- Modify: `src/__tests__/floralSideDecorations.test.tsx` (hoặc test mới cho `SchoolSideDecorations`)

- [x] **Step 1: Viết test cases kiểm tra:**
  - Không còn bất kỳ phần tử hoa phượng đỏ hay hoa hướng dương nào (`queryByTestId('flamboyant-branch-left')` là null, không có ảnh hoa phượng/hướng dương).
  - Hiển thị đầy đủ sách vở, đồ dùng học tập bên trái & bên phải (`data-testid="school-supplies-left"`, `data-testid="school-supplies-right"`).
  - Hiển thị bình thí nghiệm hóa học sủi bọt & kí hiệu hóa học (`data-testid="chemistry-lab-decor"`).
  - Hiển thị mô hình nguyên tử và kí hiệu toán học (`data-testid="math-formulas-decor"`, `data-testid="atom-model-decor"`).
  - Hiển thị phi đội máy bay giấy đang bay (`data-testid="flying-paper-airplanes"`).
- [x] **Step 2: Chạy test để xác nhận test ban đầu thất bại (Red stage)**.

---

### Task 2: Xây Dựng Component `SchoolDecorations.tsx` & Tích Hợp Vào Trang Chủ

**Files:**
- Create: `src/components/SchoolDecorations.tsx`
- Modify: `src/components/FloralSideDecorations.tsx` (re-export or alias để tương thích)
- Modify: `src/components/HeroMasthead.tsx` (thay hoa ở góc bằng sách & bút thước)
- Modify: `src/components/InfographicGrid.tsx` & `src/components/InteractivePosterView.tsx` (thay hoa trang trí)
- Modify: `src/App.tsx` (thay `FloralSideDecorations` và `FallingPetals`)

- [x] **Step 1: Tạo `SchoolDecorations.tsx` với đầy đủ:**
  - `VintageBookStackSVG`: Chồng sách giáo khoa / bách khoa bìa màu vintage.
  - `OpenNotebookSVG`: Vở ô ly mở kèm bút mực và thước kẻ.
  - `StationerySetSVG`: Bộ ê-ke tam giác, compa, bút chì gỗ, bút dạ quang neon.
  - `ChemistryLabSVG`: Bình tam giác Erlenmeyer dung dịch xanh ngọc với bọt khí sủi tăm bay lên + ống nghiệm + vòng benzen $C_6H_6$ & $H_2O$.
  - `AtomModelSVG`: Cấu trúc nguyên tử với các quỹ đạo elip electron xoay quanh hạt nhân.
  - `MathFormulasDoodleSVG`: Các ký hiệu toán học $\pi, \sqrt{x}, \sum, \int, a^2+b^2=c^2, \Delta, \infty$.
  - `SchoolSideDecorations`: Bố trí đa tầng hai bên Trái & Phải trang chủ với motion đung đưa tự nhiên và phi đội máy bay giấy.
- [x] **Step 2: Cập nhật `HeroMasthead.tsx`, `InfographicGrid.tsx`, `InteractivePosterView.tsx` để xóa toàn bộ hoa**.
- [x] **Step 3: Cập nhật `App.tsx` để hiển thị `SchoolSideDecorations` và thay `FallingPetals` bằng các hạt ký hiệu học thuật lơ lửng nhẹ nhàng**.
- [x] **Step 4: Chạy toàn bộ test suites (`vitest`) và kiểm tra bản dựng (`npm run build`)**.

