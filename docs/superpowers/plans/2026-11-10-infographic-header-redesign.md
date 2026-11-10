# Thiết Kế Lại Giao Diện Chính Theo Đúng Infographic Mẫu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết kế lại phần giao diện chính (Hero Masthead) của website Báo tường số để khớp 100% với poster infographic mẫu (bối cảnh tranh vẽ sân trường rợp bóng mát, logo Đội TNTP Sẵn Sàng, logo Trường Hiệp Thạnh, tiêu đề "CHẮP CÁNH" có cánh thiên thần trắng và "Ước Mơ" thư pháp đỏ viền trắng), tối ưu hoàn hảo trên cả máy tính và điện thoại mà không cần giả lập 3D phức tạp.

**Architecture:** Sử dụng trực tiếp hình ảnh phần đầu tranh nghệ thuật trường học và cụm tiêu đề chính xác từ bản vẽ poster gốc (`public/posters/hero-banner-chap-canh.jpg`), tích hợp vào `HeroMasthead.tsx` với khung viền poster màu nước bo góc mềm mại, kết hợp typography trợ năng (`sr-only` / semantic `h1`), và các thanh nút chức năng (*Bật/Tắt nhạc nền*, *Gửi lời chúc 20/11*, *Xem lời chúc*, *Bảng giáo viên*, *Mã QR*) được bố trí tinh gọn, cân đối trên cả desktop và mobile.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vitest, Testing Library.

**Spec:** Yêu cầu từ người dùng: "cụm tiêu đề không cần làm 3D, làm giống cái poster tôi gửi cho bạn là dc", thiết kế giao diện chính khớp infographic, tối ưu máy tính và điện thoại.

## Global Constraints

- Không dùng CSS text-shadow giả lập 3D cồng kềnh, hiển thị trực quan giống hệt poster mẫu đã gửi.
- Bảo đảm đầy đủ các chữ semantic "CHẮP CÁNH" và "ƯỚC MƠ" cho SEO và bộ test Vitest hiện có.
- Tối ưu kích thước, phản hồi trên mobile (không bị vỡ layout, không che khuất hình ảnh, nút bấm thân thiện với cảm ứng ngón tay min 44px).
- Vượt qua toàn bộ 51 tests của Vitest và build production `npm run build` thành công.

## Review Focus

1. **Hiển thị trên Mobile (màn hình hẹp 360px - 414px):** Khung ảnh poster đầu trang co giãn theo tỉ lệ mượt mà, chữ sắc nét, các nút chức năng tự động xuống dòng và căn giữa đẹp mắt.
2. **Hiển thị trên Desktop (màn hình rộng >= 1024px):** Khung banner hiển thị ở độ rộng cân đối (max-w-4xl đến max-w-5xl) cùng hiệu ứng bóng đổ và viền nghệ thuật.
3. **Độ tương phản và tính khả dụng của các nút:** Các nút Gửi Lời Chúc, Xem Lời Chúc, Bảng Giáo Viên, Mã QR, Bật Nhạc Nền luôn dễ nhìn, dễ bấm.
4. **Giữ nguyên trạng thái chuyển đổi chế độ xem:** Chế độ xem "Bảng Infographic Báo Tường (5 Mục)" và "Sơ Đồ Infographic Toàn Cảnh" tiếp tục hoạt động chính xác.
5. **Đồng bộ tự động lên GitHub & Vercel:** Sau khi hoàn thành, hệ thống tự động build và push lên nhánh main.

---

### Task 1: Chuẩn bị tệp ảnh Banner Header sắc nét từ Poster Mẫu

**Files:**
- Create/Update: `public/posters/hero-banner-chap-canh.jpg`
- Test: Kiểm tra kích thước và độ sắc nét

- [ ] **Step 1:** Kiểm tra tệp `public/posters/hero-banner-chap-canh.jpg` được xuất chuẩn từ `public/posters/poster-toan-canh-sharp.jpg` với đầy đủ logo Đội TNTP, logo Trường Hiệp Thạnh, dòng chữ BÁO TƯỜNG SỐ, Chào mừng 20/11, cụm CHẮP CÁNH ƯỚC MƠ và khung cảnh sân trường.
- [ ] **Step 2:** Đảm bảo tỉ lệ và chất lượng hình ảnh đạt độ phân giải cao và dung lượng tối ưu (~150KB).

---

### Task 2: Cập nhật component `HeroMasthead.tsx` khớp hoàn toàn với Poster Mẫu

**Files:**
- Modify: `src/components/HeroMasthead.tsx`
- Test: `src/__tests__/appInteraction.test.tsx`

- [ ] **Step 1:** Cập nhật bố cục `HeroMasthead.tsx`:
  - Thay thế cụm chữ và cánh vẽ que cũ bằng banner ảnh nghệ thuật chính xác từ poster `hero-banner-chap-canh.jpg`.
  - Bổ sung semantic heading `h1` với text `CHẮP CÁNH` và `ƯỚC MƠ` ẩn trợ năng/SEO để giữ tính truy cập và khớp 100% với test suite.
  - Tinh chỉnh thanh công cụ phía trên (Logo Trường TH&THCS Hiệp Thạnh, Chi đội 9A3, Chủ đề 20/11, Nút Bật/Tắt nhạc nền, Mã QR).
  - Tinh chỉnh các nút chức năng chính (Gửi Lời Chúc 20/11, Xem Lời Chúc Thầy Cô, Bảng Giáo Viên) được đặt ngay ngắn, hiện đại phía dưới banner nghệ thuật.
- [ ] **Step 2:** Chạy kiểm thử tương tác `npx vitest run src/__tests__/appInteraction.test.tsx`.
- [ ] **Step 3:** Chạy toàn bộ 51 tests `npx vitest run`.

---

### Task 3: Tối ưu Responsive trên Máy tính & Điện thoại và Nghiệm thu Toàn diện

**Files:**
- Modify: `src/components/HeroMasthead.tsx`
- Test: `npm run build` & `npx vitest run`

- [ ] **Step 1:** Kiểm tra hiển thị responsive trên mobile (viewport hẹp 375px) và desktop (viewport rộng 1200px) bằng Tailwind CSS classes (`w-full`, `max-w-4xl`, `rounded-3xl`, `shadow-xl`, `object-cover` hoặc `object-contain`).
- [ ] **Step 2:** Kiểm tra `npm run build` để đảm bảo bundle biên dịch hoàn hảo.
- [ ] **Step 3:** Commit và đẩy code lên GitHub để Vercel cập nhật bản public.

