# Redesign Giao Diện Theo Hướng 2 & Trang Trí Cành Phượng Máy Bay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai giao diện mới trên nhánh `redesign-ui` theo Hướng 2 (từng khối chuyên mục 1, 2, 3, 4, 5 mang trọn vẹn tranh vẽ minh họa nghệ thuật từ poster) và thiết kế lại hai bên rìa ngoài (xóa toàn bộ bình thí nghiệm, công thức toán học/hóa học cũ, thay thế bằng những cành hoa phượng đỏ rực rỡ và máy bay giấy bay lượn như trong poster), tối ưu hoàn hảo trên cả máy tính và điện thoại.

**Architecture:** 
- Khối 5 chuyên mục trong `InfographicGrid.tsx` tích hợp ảnh minh họa sắc nét đã crop từ poster gốc (`/sections/sec-*.jpg`), giữ nút bấm cam chuẩn poster `[ NHẤP VÀO ĐÂY ĐỂ XEM ]` có con trỏ bàn tay click/tap.
- Hệ thống trang trí rìa ngoài trong `SideDecorations.tsx` (hoặc cập nhật `SchoolDecorations.tsx`) loại bỏ hoàn toàn bình thí nghiệm, nguyên tử, công thức toán học; thay bằng các chùm hoa phượng đỏ mềm mại (`public/decorations/hoa-phuong.png` và SVG vector) kết hợp phi đội máy bay giấy gấp bay lượn nhẹ nhàng.
- Cập nhật test suite tương ứng để phản ánh thiết kế mới.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Motion/React, Vitest, Testing Library.

**Spec:** Yêu cầu người dùng: "dùng superpowers hướng 2, sửa thêm phần rìa ngoài (xoá hết những cái của giao diện cũ như bình thí nghiệm, kí hiệu toán học,...) thay vào đó là những cành phượng, máy bay như trong poster".

## Global Constraints

- Xóa hoàn toàn bình thí nghiệm (`chemistry-lab-decor`), mô hình nguyên tử (`atom-model-decor`), công thức toán học (`math-formulas-decor`).
- Hiển thị cành hoa phượng đỏ và máy bay giấy bay lượn hai bên sườn.
- Mỗi chuyên mục (1. Lời ngỏ, 2. Truyện ngắn, 3. Thơ, 4. Âm nhạc, 5. Bài tri ân) đều có tranh minh họa gốc từ poster, tiêu đề rõ ràng và nút `NHẤP VÀO ĐÂY ĐỂ XEM`.
- Tối ưu cả Desktop (lưới 2 cột cân xứng + 1 đáy rộng) và Mobile (dọc 1 cột cuộn mượt mà, cảm ứng ngón tay chuẩn).
- Toàn bộ test suite Vitest (51 tests) và build `npm run build` phải vượt qua 100%.

## Review Focus

1. **Hiển thị Rìa Ngoài:** Không còn dấu vết của bình thí nghiệm, benzen, nguyên tử, công thức toán. Có các cành hoa phượng đỏ và máy bay giấy bay lượn.
2. **5 Chuyên Mục:** Mỗi mục có ảnh tranh vẽ minh họa đúng như poster, bấm vào nút mở ra modal đọc trọn vẹn.
3. **Mobile View:** Tự động co giãn 1 cột trên điện thoại, ảnh không bị méo, nút bấm to rõ dễ chạm.
4. **Desktop View:** Bố cục 2 cột thoáng đãng, sắc nét, tương phản tốt trên nền giấy ấm áp.
5. **Chất lượng mã nguồn:** Build sạch sẽ, không có lỗi TypeScript hay cảnh báo.

---

### Task 1: Cập nhật Trang Trí Hai Bên Rìa Ngoài (Cành Phượng & Máy Bay Giấy)

**Files:**
- Modify: `src/components/SchoolDecorations.tsx`
- Test: `src/__tests__/floralSideDecorations.test.tsx`

- [ ] **Step 1:** Viết lại `SchoolSideDecorations` trong `src/components/SchoolDecorations.tsx`:
  - Xóa bỏ các component và phần tử `ChemistryLabSVG`, `AtomModelSVG`, `MathFormulasDoodleSVG`.
  - Thay bằng các chùm cành hoa phượng đỏ nghệ thuật (kết hợp `hoa-phuong.png` và `FlamboyantClusterSVG`) ở các góc trên và sườn hai bên.
  - Giữ lại và nâng cấp phi đội `FlyingPaperAirplanes` với máy bay giấy bay lượn nhẹ nhàng.
- [ ] **Step 2:** Cập nhật test trong `src/__tests__/floralSideDecorations.test.tsx` để xác nhận:
  - Có các cành phượng (`flamboyant-branch-left`, `flamboyant-branch-right`) và máy bay giấy.
  - Không còn bình thí nghiệm, mô hình nguyên tử và công thức toán học.
- [ ] **Step 3:** Chạy `npx vitest run src/__tests__/floralSideDecorations.test.tsx` đảm bảo test pass.

---

### Task 2: Dựng lại 5 Khối Chuyên Mục theo Hướng 2 trong `InfographicGrid.tsx`

**Files:**
- Modify: `src/components/InfographicGrid.tsx`
- Test: `src/__tests__/appInteraction.test.tsx`

- [ ] **Step 1:** Cập nhật `InfographicGrid.tsx`:
  - Khối 1 (Lời ngỏ): Hiển thị ảnh `/sections/sec-loi-ngo.jpg` kèm trích đoạn và nút `NHẤP VÀO ĐÂY ĐỂ XEM`.
  - Khối 2 (Truyện ngắn): Hiển thị ảnh `/sections/sec-truyen-ngan.jpg` (cô trò đọc sách dưới cây) kèm nút `NHẤP VÀO ĐÂY ĐỂ XEM`.
  - Khối 3 (Thơ): Hiển thị ảnh `/sections/sec-tho.jpg` (cuộn thư cổ hoa phượng "Ơn thầy") kèm nút `NHẤP VÀO ĐÂY ĐỂ XEM`.
  - Khối 4 (Âm nhạc): Hiển thị ảnh `/sections/sec-mv.jpg` (video player, học sinh hát, nốt nhạc) kèm nút `NHẤP VÀO ĐÂY ĐỂ XEM`.
  - Khối 5 (Bài tri ân): Hiển thị ảnh `/sections/sec-tri-an.jpg` (học sinh tặng hoa cô giáo áo dài vàng) kèm nút `NHẤP VÀO ĐÂY ĐỂ XEM`.
  - Đảm bảo thẻ semantic và accessibility texts (`01 • MỞ ĐẦU`, v.v.) đầy đủ cho người dùng và test suite.
- [ ] **Step 2:** Chạy `npx vitest run src/__tests__/appInteraction.test.tsx` để kiểm tra các hành vi tương tác click mở modal, phím tắt.

---

### Task 3: Kiểm thử toàn diện, Build & Commit trên nhánh `redesign-ui`

**Files:**
- Modify: Các tệp liên quan
- Test: `npx vitest run` & `npm run build`

- [ ] **Step 1:** Chạy toàn bộ 51 tests `npx vitest run`.
- [ ] **Step 2:** Chạy `npm run build` để kiểm tra compile production.
- [ ] **Step 3:** Commit các thay đổi vào nhánh `redesign-ui` và push lên GitHub.
