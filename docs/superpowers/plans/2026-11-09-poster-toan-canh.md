# Kế Hoạch Triển Khai: Thay Thế "Sơ Đồ Infographic Toàn Cảnh" Bằng Ảnh Minh Họa Poster Tương Tác

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` and `superpowers:test-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay thế giao diện sơ đồ cây cũ trong chế độ "Sơ Đồ Infographic Toàn Cảnh" bằng **Ảnh minh họa poster gốc** (`/posters/poster-toan-canh.jpg`), bổ sung 5 điểm nút tương tác "NHẤP VÀO ĐÂY ĐỂ XEM" trực tiếp trên ảnh để mở modal 5 chuyên mục tương ứng.

---

### Task 1: Viết Kiểm Thử Cho `InteractivePosterView` Với Ảnh Minh Họa (TDD)

**Files:**
- Create: `src/__tests__/interactivePosterView.test.tsx`

- [x] **Step 1: Viết test cases kiểm tra:**
  - Hiển thị ảnh minh họa poster `/posters/poster-toan-canh.jpg` (`data-testid="interactive-poster-image"`).
  - Định vị và hiển thị đầy đủ 5 nút tương tác "NHẤP VÀO ĐÂY ĐỂ XEM" ứng với 5 chuyên mục: `loi-ngo`, `truyen-ngan`, `tho`, `mv`, `tri-an`.
  - Nhấp vào từng nút gọi đúng callback `onSelectSection(sectionId)`.
  - Giữ lại khối Thang điểm thể lệ & Ban biên tập lớp 9A3.
- [x] **Step 2: Chạy test để xác nhận test ban đầu thất bại (Red stage)**.

---

### Task 2: Nâng Cấp `InteractivePosterView.tsx` Thành Bức Tranh Poster Tương Tác

**Files:**
- Modify: `src/components/InteractivePosterView.tsx`

- [x] **Step 1: Tích hợp ảnh poster minh họa:**
  - Bố trí ảnh `/posters/poster-toan-canh.jpg` trong khung tràn viền bo tròn nghệ thuật với bóng đổ lớn và viền vàng kim.
  - Tỷ lệ khung hình chuẩn 482x1024, tự co giãn mượt mà theo kích thước màn hình điện thoại, máy tính bảng và máy tính.
- [x] **Step 2: Cài đặt 5 điểm nút tương tác (Hotspots) trên ảnh:**
  - Tọa độ phần trăm chính xác khớp 100% với các nút vẽ trên poster.
  - Hiệu ứng pulsing viền sáng khi rê chuột và bàn tay click chỉ dẫn.
  - Hỗ trợ phím tắt và nhấp cảm ứng (tap/click).
- [x] **Step 3: Chạy toàn bộ kiểm thử `vitest` và kiểm tra bản dựng `npm run build`**.

