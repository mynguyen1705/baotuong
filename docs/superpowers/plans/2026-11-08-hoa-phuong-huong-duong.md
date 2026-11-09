# Trang Trí Hoa Phượng Đỏ & Hoa Hướng Dương Chuyển Động Hai Bên Trang Chủ – Kế Hoạch Triển Khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` and `superpowers:test-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bổ sung hệ thống trang trí **Cành Hoa Phượng Đỏ** (rủ từ trên xuống ở 2 bên trái/phải) và **Khóm Hoa Hướng Dương** (vươn lên dọc 2 bên trái/phải trang chủ) theo **Phương án C** (kết hợp 2 hình minh họa gốc đã xử lý hòa trộn nền trong suốt cùng các lớp cành lá, bông hoa SVG đa tầng đung đưa bằng `motion`).

**Architecture:**
- Sao chép 2 tệp hình minh họa do người dùng tải lên vào `public/decorations/hoa-phuong.jpg` và `public/decorations/hoa-huong-duong.jpg`.
- Tạo component chuyên biệt `src/components/FloralSideDecorations.tsx` chứa:
  1. `SwayingFlamboyantBranch`: Kết hợp ảnh cành hoa phượng đỏ đã hòa trộn nền trong suốt + các lớp SVG cành gỗ, lá phượng non và chùm hoa phượng đỏ cam đung đưa lệch nhịp (`motion.div` / `motion.g`).
  2. `SwayingSunflowerBouquet`: Kết hợp ảnh khóm 3 bông hoa hướng dương màu nước đã hòa trộn nền + các lớp SVG bông hướng dương, thân cây và lá xanh đung đưa quanh gốc.
  3. `FloralSideDecorations`: Bố trí đồng bộ ở cả 2 bên Trái & Phải của trang chủ (`App.tsx`) và nâng cấp cụm hoa góc trên trong `HeroMasthead.tsx`.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, `motion/react`, Vitest + React Testing Library.

---

### Task 1: Chuẩn bị Tài nguyên Ảnh Minh họa & Viết Kiểm thử Giao diện (`floralSideDecorations.test.tsx`)

**Files:**
- Create: `public/decorations/hoa-phuong.jpg`
- Create: `public/decorations/hoa-huong-duong.jpg`
- Create: `src/__tests__/floralSideDecorations.test.tsx`

- [ ] **Step 1: Sao chép 2 tệp ảnh người dùng gửi vào `public/decorations/`**
- [ ] **Step 2: Viết failing test trong `src/__tests__/floralSideDecorations.test.tsx`**
  Kiểm tra:
  - Hiển thị đầy đủ Cành Hoa Phượng Đỏ bên trái & bên phải (`data-testid="flamboyant-branch-left"`, `data-testid="flamboyant-branch-right"`).
  - Hiển thị đầy đủ Khóm Hoa Hướng Dương bên trái & bên phải (`data-testid="sunflower-bouquet-left"`, `data-testid="sunflower-bouquet-right"`).
  - Kết hợp cả lớp hình ảnh gốc (`/decorations/hoa-phuong.jpg`, `/decorations/hoa-huong-duong.jpg`) và các lớp SVG cánh hoa/lá chuyển động đa tầng.

---

### Task 2: Xây dựng Component `FloralSideDecorations.tsx` & Tích hợp vào Trang chủ (`App.tsx`, `HeroMasthead.tsx`)

**Files:**
- Create: `src/components/FloralSideDecorations.tsx`
- Modify: `src/components/HeroMasthead.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Tạo `src/components/FloralSideDecorations.tsx` theo Phương án C**
  - Cành Hoa Phượng Đỏ (Trái & Phải): kết hợp hình ảnh gốc đã hòa trộn nền trong suốt + lớp SVG cành phượng, lá kép và chùm hoa 5 cánh đung đưa đa tầng bằng `motion`.
  - Khóm Hoa Hướng Dương (Trái & Phải): kết hợp hình ảnh gốc khóm 3 hoa hướng dương màu nước đã hòa trộn nền + lớp SVG bông hướng dương và lá xanh đung đưa quanh gốc bằng `motion`.
- [ ] **Step 2: Tích hợp `FloralSideDecorations` vào `src/App.tsx` và cập nhật `src/components/HeroMasthead.tsx`**
- [ ] **Step 3: Chạy kiểm thử `vitest` và lệnh `npm run build`**

