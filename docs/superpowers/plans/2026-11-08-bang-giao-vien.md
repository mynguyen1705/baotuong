# Bảng Tổng Hợp Giáo Viên Bộ Môn – Kế Hoạch Triển Khai (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bổ sung chức năng **Bảng Tổng Hợp Giáo Viên Bộ Môn** theo đúng bố cục poster mẫu (Polaroid trên giấy vở kẻ ngang nghiêng, nền xanh da trời, chữ nổi 3D, nhãn dán góc ảnh, doodle học đường), cho phép học sinh xem chi tiết tính cách, điền biểu mẫu thêm giáo viên mới (**không giới hạn số lượng**), **thêm/đổi ảnh giáo viên bất cứ lúc nào**, và đồng bộ qua máy chủ Vite để thầy cô mở xem từ thiết bị khác.

**Architecture:**
- **Backend/Storage (`src/server/teachersStore.ts` + `src/server/teachersApiPlugin.ts`):** Lưu trữ dữ liệu tập trung tại `server/data/teachers.json` (tự động seed 6 giáo viên bộ môn từ poster mẫu khi khởi chạy lần đầu), cung cấp REST API `GET /api/teachers`, `POST /api/teachers` (thêm giáo viên mới không giới hạn số lượng), và `PATCH /api/teachers/:id` (cập nhật thông tin, thêm/đổi ảnh giáo viên bất cứ lúc nào với giới hạn body `5MB`, hoặc gửi thêm cảm nhận của học sinh).
- **Frontend (`src/components/TeacherSummaryBoardSection.tsx` + `src/components/TeacherBoardModal.tsx`):** Tái hiện chính xác bố cục thị giác của poster mẫu bằng Tailwind CSS + SVG minh họa, cho phép nhấp vào từng thẻ Polaroid để xem hồ sơ chi tiết hoặc bấm nút máy ảnh để đổi ảnh giáo viên ngay lập tức; hỗ trợ điều hướng URL hash `#bang-giao-vien` và `#bieu-mau-giao-vien` cùng mã QR liên thiết bị.

**Tech Stack:** Vite 6, React 18, TypeScript, Tailwind CSS 3, `motion` (Framer Motion), `lucide-react`, `qrcode.react`, Vitest + React Testing Library.

---

## Cấu trúc Tệp (File Map)

1. **Tạo mới:**
   - `src/types/teachers.ts` — Định nghĩa kiểu dữ liệu `TeacherProfile`, `TeacherImpression`, `CreateTeacherInput`, `UpdateTeacherInput`, `TeacherModalMode` và dữ liệu seed 6 giáo viên mặc định.
   - `src/server/teachersStore.ts` — Quản lý đọc/ghi `server/data/teachers.json`, kiểm tra hợp lệ dữ liệu, thêm giáo viên không giới hạn số lượng, cập nhật ảnh `photoUrl` và thêm cảm nhận học sinh.
   - `src/server/teachersApiPlugin.ts` — Vite HTTP middleware cho `/api/teachers` (`GET`, `POST`) và `/api/teachers/:id` (`PATCH`) với giới hạn body `5MB` cho ảnh Data URL.
   - `src/utils/imageDataUrl.ts` — Hàm tiện ích đọc tệp ảnh từ `<input type="file" />` và nén/chuyển đổi sang Data URL mượt mà.
   - `src/components/TeacherAvatarIllustration.tsx` — Bộ chân dung minh họa SVG sống động cho từng giáo viên/môn học khi chưa tải ảnh chụp thật hoặc làm ảnh mặc định.
   - `src/components/TeacherSummaryBoardSection.tsx` — Bảng Tổng Hợp Giáo Viên Bộ Môn theo đúng bố cục poster mẫu (nền xanh da trời, chữ nổi 3D trắng-xanh, băng keo vàng, tờ giấy kẻ ngang nghiêng, ghim kẹp giấy, bút dạ quang, doodle hình nón/bình thí nghiệm/ADN/nốt nhạc, lưới 2 cột thẻ Polaroid không giới hạn số lượng, nút đổi ảnh nhanh trên mỗi thẻ, giấy nhớ vàng góc dưới).
   - `src/components/TeacherBoardModal.tsx` — Hộp thoại đa năng hỗ trợ 3 chế độ:
     - Xem hồ sơ chi tiết tính cách & kỷ niệm của một giáo viên + Đổi ảnh giáo viên bất cứ lúc nào + Gửi thêm cảm nhận của học sinh;
     - Biểu mẫu (`#bieu-mau-giao-vien`) để học sinh thêm giáo viên mới (kèm ảnh tải lên bất kỳ lúc nào) hoặc chọn giáo viên có sẵn để bổ sung chi tiết tính cách;
     - Chế độ xem toàn cảnh Bảng Tổng Hợp (`#bang-giao-vien`) dành cho thầy cô khi mở từ thiết bị khác qua link/QR.
   - `src/__tests__/teachersStore.test.ts` — Unit test cho `teachersStore` (seed 6 giáo viên, thêm không giới hạn số lượng, đổi ảnh bất cứ lúc nào, thêm cảm nhận).
   - `src/__tests__/teachersApi.test.ts` — Integration test cho middleware `/api/teachers` và `/api/teachers/:id`.
   - `src/__tests__/teacherBoardModal.test.tsx` — UI test cho `TeacherSummaryBoardSection` và `TeacherBoardModal` (hiển thị 6 giáo viên mẫu, thêm giáo viên mới, đổi ảnh giáo viên bất cứ lúc nào, thêm cảm nhận tính cách).

2. **Cập nhật:**
   - `vite.config.ts` — Đăng ký `teachersApiPlugin()` cùng với `wishesApiPlugin()`.
   - `src/components/HeroMasthead.tsx` — Thêm nút truy cập nhanh **“Bảng tổng hợp giáo viên”** & **“Điền biểu mẫu giáo viên”**.
   - `src/components/EditorialFooter.tsx` — Thêm liên kết nhanh tới `#bang-giao-vien` và `#bieu-mau-giao-vien`.
   - `src/components/QrCodeModal.tsx` — Bổ sung 2 mã QR liên thiết bị: **Bảng Tổng Hợp Giáo Viên (`#bang-giao-vien`)** cho thầy cô và **Biểu Mẫu Thông Tin Giáo Viên (`#bieu-mau-giao-vien`)** cho học sinh.
   - `src/App.tsx` — Nhúng `TeacherSummaryBoardSection` vào trang chính, quản lý trạng thái `TeacherBoardModal` và đồng bộ URL hash `#bang-giao-vien` / `#bieu-mau-giao-vien`.
   - `.gitignore` — Đảm bảo bỏ qua tệp runtime `server/data/teachers.json`.

---

### Task 1: Định nghĩa Kiểu dữ liệu, 6 Giáo viên Seed & Store Lưu trữ (`teachersStore.ts`)

**Files:**
- Create: `src/types/teachers.ts`
- Create: `src/server/teachersStore.ts`
- Test: `src/__tests__/teachersStore.test.ts`

- [ ] **Step 1: Viết failing test cho `teachersStore` trong `src/__tests__/teachersStore.test.ts`**
  Kiểm tra:
  - Khởi tạo tự động 6 giáo viên mặc định theo poster mẫu (`TOÁN HỌC - THẦY NGUYỄN VĂN A`, `NGỮ VĂN - CÔ TRẦN THỊ B`, `VẬT LÝ - THẦY LÊ VĂN C`, `HÓA HỌC - CÔ PHẠM THỊ D`, `SINH HỌC - CÔ MAI LAN`, `LỊCH SỬ - THẦY QUỐC KHÁNH`).
  - Thêm mới nhiều giáo viên liên tiếp không giới hạn số lượng tối đa (`addTeacher`).
  - Cập nhật/thay đổi ảnh giáo viên (`photoUrl`) bất cứ lúc nào cho cả giáo viên mặc định lẫn giáo viên mới (`updateTeacher`).
  - Thêm nhận xét/chi tiết tính cách của học sinh vào hồ sơ giáo viên (`addImpression`).

- [ ] **Step 2: Chạy test để xác nhận fail**
  Run: `npx vitest run src/__tests__/teachersStore.test.ts`
  Expected: FAIL do chưa có `src/types/teachers.ts` và `src/server/teachersStore.ts`.

- [ ] **Step 3: Viết `src/types/teachers.ts` và `src/server/teachersStore.ts`**
  - Định nghĩa đầy đủ `TeacherProfile`, `TeacherImpression`, `DEFAULT_TEACHERS` (6 giáo viên chuẩn poster mẫu).
  - Cài đặt `createTeachersStore` đọc/ghi JSON an toàn với hàng đợi tuần tự, không giới hạn số lượng giáo viên, hỗ trợ `listTeachers()`, `addTeacher()`, `updateTeacher()`, và `addImpression()`.

- [ ] **Step 4: Chạy lại test để xác nhận pass**
  Run: `npx vitest run src/__tests__/teachersStore.test.ts`
  Expected: PASS toàn bộ test trong `teachersStore.test.ts`.

---

### Task 2: Xây dựng Vite Middleware API (`/api/teachers`) hỗ trợ Tải ảnh & Đồng bộ liên thiết bị

**Files:**
- Create: `src/server/teachersApiPlugin.ts`
- Modify: `vite.config.ts`
- Modify: `.gitignore`
- Test: `src/__tests__/teachersApi.test.ts`

- [ ] **Step 1: Viết failing test cho `/api/teachers` trong `src/__tests__/teachersApi.test.ts`**
  Kiểm tra:
  - `GET /api/teachers` trả về 200 kèm 6 giáo viên khởi tạo.
  - `POST /api/teachers` tạo giáo viên mới kèm ảnh Data URL và trả về 201.
  - `PATCH /api/teachers/:id` cho phép đổi ảnh (`photoUrl`) bất cứ lúc nào và thêm cảm nhận tính cách mới của học sinh, trả về 200.
  - Trả về 400 khi dữ liệu thiếu trường bắt buộc, 404 khi `id` không tồn tại.

- [ ] **Step 2: Chạy test để xác nhận fail**
  Run: `npx vitest run src/__tests__/teachersApi.test.ts`
  Expected: FAIL do chưa có `src/server/teachersApiPlugin.ts`.

- [ ] **Step 3: Cài đặt `src/server/teachersApiPlugin.ts` và gắn vào `vite.config.ts`**
  - Hỗ trợ body lên tới `5 * 1024 * 1024` bytes (5MB) để gửi ảnh Data URL mượt mà.
  - Định tuyến `GET /api/teachers`, `POST /api/teachers`, `PATCH /api/teachers/:id`.
  - Đăng ký `teachersApiPlugin()` trong `vite.config.ts`.

- [ ] **Step 4: Chạy lại test để xác nhận pass**
  Run: `npx vitest run src/__tests__/teachersApi.test.ts`
  Expected: PASS toàn bộ test trong `teachersApi.test.ts`.

---

### Task 3: Xây dựng Giao diện Bảng Tổng Hợp Giáo Viên Bộ Môn (`TeacherSummaryBoardSection.tsx`) & Hộp thoại Chi tiết / Biểu mẫu (`TeacherBoardModal.tsx`)

**Files:**
- Create: `src/utils/imageDataUrl.ts`
- Create: `src/components/TeacherAvatarIllustration.tsx`
- Create: `src/components/TeacherSummaryBoardSection.tsx`
- Create: `src/components/TeacherBoardModal.tsx`
- Test: `src/__tests__/teacherBoardModal.test.tsx`

- [ ] **Step 1: Viết failing test cho giao diện Bảng Tổng Hợp Giáo Viên và Biểu Mẫu trong `src/__tests__/teacherBoardModal.test.tsx`**
  Kiểm tra:
  - Hiển thị đúng tiêu đề **“BẢNG TỔNG HỢP GIÁO VIÊN BỘ MÔN”**, nhãn băng keo vàng **“Học Kỳ I - Năm Học Mới”**, giấy nhớ vàng **“Chào mừng các em học sinh đến với năm học mới !”**, và đầy đủ 6 thẻ Polaroid giáo viên từ poster mẫu.
  - Nhấp vào thẻ Polaroid mở hộp thoại chi tiết tính cách giáo viên và cho phép học sinh gửi thêm cảm nhận hoặc đổi ảnh giáo viên ngay lập tức.
  - Mở biểu mẫu thêm giáo viên mới, tải ảnh giáo viên lên và lưu thành công vào bảng tổng hợp (hiển thị giáo viên thứ 7, thứ 8... không giới hạn).

- [ ] **Step 2: Chạy test để xác nhận fail**
  Run: `npx vitest run src/__tests__/teacherBoardModal.test.tsx`
  Expected: FAIL do chưa có các component giao diện.

- [ ] **Step 3: Cài đặt các component giao diện chuẩn theo poster mẫu**
  - `src/utils/imageDataUrl.ts`: Chuyển `File` ảnh sang Data URL (hỗ trợ nén nhẹ qua Canvas nếu ảnh lớn hoặc fallback `FileReader` trong môi trường test).
  - `src/components/TeacherAvatarIllustration.tsx`: Chân dung minh họa thân thiện trên nền bảng xanh phấn trắng cho từng môn học khi giáo viên chưa có ảnh chụp tải lên.
  - `src/components/TeacherSummaryBoardSection.tsx`: Thiết kế chuẩn theo ảnh mẫu `media_1794138340363_2e369052.jpg`:
    - Khung nền xanh da trời rực rỡ kèm hiệu ứng ánh sáng, ngôi sao và nốt nhạc góc trên;
    - Chữ nổi 3D trắng viền xanh đậm **“BẢNG TỔNG HỢP GIÁO VIÊN BỘ MÔN”** + băng keo vàng **“Học Kỳ I - Năm Học Mới”**;
    - Tờ giấy vở kẻ ngang trắng đặt nghiêng nhẹ trên bìa hồ sơ vàng, ghim kẹp giấy kim loại 2 bên, kẹp bướm vàng, bút dạ quang tím/xanh lá, bút bi đỏ, cùng các hình vẽ tay học đường (hình nón, bình tam giác thí nghiệm, xoắn ADN, ngôi sao, trái tim, nốt nhạc, công thức `toán √học²`);
    - Lưới 2 cột các khung ảnh Polaroid nghiêng nhẹ tự động mở rộng không giới hạn số lượng giáo viên; mỗi thẻ có nút **“Thêm / Đổi ảnh”** trực tiếp, nhãn dán cam viền nâu nổi ở góc ảnh, dòng chữ đậm `[MÔN HỌC] - [TÊN GIÁO VIÊN]` và 2 dòng mô tả tính cách;
    - Giấy nhớ vàng góc dưới trái **“Chào mừng các em học sinh đến với năm học mới !”** kèm thanh công cụ cho học sinh bấm **“+ Thêm giáo viên mới”**, **“Điền biểu mẫu tính cách”**, hoặc **“Mở trang xem cho Thầy Cô”**.
  - `src/components/TeacherBoardModal.tsx`: Hộp thoại chi tiết giáo viên & biểu mẫu thêm/cập nhật giáo viên, cho phép tải ảnh hoặc đổi ảnh giáo viên bất cứ lúc nào.

- [ ] **Step 4: Chạy lại test để xác nhận pass**
  Run: `npx vitest run src/__tests__/teacherBoardModal.test.tsx`
  Expected: PASS toàn bộ test trong `teacherBoardModal.test.tsx`.

---

### Task 4: Tích hợp vào `App.tsx`, `HeroMasthead.tsx`, `EditorialFooter.tsx`, `QrCodeModal.tsx` & Kiểm thử Tổng thể

**Files:**
- Modify: `src/components/HeroMasthead.tsx`
- Modify: `src/components/EditorialFooter.tsx`
- Modify: `src/components/QrCodeModal.tsx`
- Modify: `src/App.tsx`
- Modify: `src/__tests__/appInteraction.test.tsx`

- [ ] **Step 1: Cập nhật test tích hợp trong `src/__tests__/appInteraction.test.tsx`**
  Kiểm tra:
  - Trang chính hiển thị khu vực **Bảng Tổng Hợp Giáo Viên Bộ Môn**.
  - Điều hướng qua hash `#bang-giao-vien` và `#bieu-mau-giao-vien` mở đúng chế độ xem bảng tổng hợp cho thầy cô hoặc biểu mẫu cho học sinh.
  - Hộp thoại QR (`QrCodeModal`) có đầy đủ mã QR cho `#bang-giao-vien` và `#bieu-mau-giao-vien`.

- [ ] **Step 2: Cập nhật `HeroMasthead.tsx`, `EditorialFooter.tsx`, `QrCodeModal.tsx` và `App.tsx`**
  - Tích hợp `TeacherSummaryBoardSection` và `TeacherBoardModal` vào `App.tsx` (tự động tải danh sách giáo viên từ `/api/teachers` và đồng bộ khi thêm mới/cập nhật ảnh/thêm cảm nhận).
  - Thêm nút mở nhanh trên `HeroMasthead` và `EditorialFooter`, cùng 2 mã QR mới trong `QrCodeModal`.

- [ ] **Step 3: Chạy toàn bộ bộ test và lệnh build sản phẩm**
  Run:
  - `npx vitest run`
  - `npm run build`
  Expected: Tất cả test suites PASS 100%, `tsc && vite build` thành công không có lỗi.

