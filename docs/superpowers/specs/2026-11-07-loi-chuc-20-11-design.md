# Đặc tả Thiết kế: Chức Năng Gửi & Xem Lời Chúc 20/11 – Báo Tường Số 9A3

## 1. Kết Quả Khảo Sát Hiện Trạng & Bối Cảnh (Reconnaissance & Intent)

### 1.1. Đối chiếu với `yeucau.txt`
- **Chủ đề & Đối tượng:** Chủ đề cuộc thi là *“Tôn sư trọng đạo - Nét bút tri ân”*, dành cho học sinh các chi đội từ khối 6 đến khối 9 **Trường TH&THCS Hiệp Thạnh** (sản phẩm hiện tại của **Chi đội 9A3** với tên báo *“Chắp cánh ước mơ”*).
- **Yêu cầu truy cập:** Toàn bộ sản phẩm và các hạng mục con cần truy cập mượt mà qua **Đường link trực tiếp / Mã QR Code** để Ban giám khảo và thầy cô chấm điểm hoặc thưởng thức trên cả điện thoại và máy tính.
- **Trường dữ liệu lời chúc:** File `yeucau.txt` chỉ quy định 5 hạng mục chính của tờ báo và chưa quy định cấu trúc biểu mẫu gửi lời chúc tương tác. Do đó, sử dụng 3 trường chuẩn theo đề xuất:
  1. **Tên người gửi (`senderName`):** Họ tên học sinh (hoặc nhóm học sinh).
  2. **Lớp (`className`):** Lớp/Chi đội (gợi ý nhanh `9A3` hoặc nhập lớp bất kỳ thuộc khối 6–9 trường TH&THCS Hiệp Thạnh).
  3. **Nội dung lời chúc (`message`):** Lời chúc, lời tri ân gửi tới thầy cô nhân ngày 20/11.

### 1.2. Hiện trạng mã nguồn & kế hoạch hiện có
- **Kiến trúc hiện tại:** Ứng dụng Single-Page Application (SPA) sử dụng **Vite 5 + React 18 + TypeScript + Tailwind CSS 3 + `motion`**.
- **Lưu trữ & Đăng nhập hiện có:** Toàn bộ nội dung 5 chuyên mục hiện đang lưu tĩnh trong `src/data/baotuongData.ts`. Dự án **chưa có backend, chưa có cơ sở dữ liệu tập trung và chưa có cơ chế đăng nhập/xác thực người dùng**.
- **Điều hướng hiện có:** `src/App.tsx` đang đồng bộ trạng thái hiển thị theo `window.location.hash` (`#loi-ngo`, `#truyen-ngan`, `#tho`, `#mv`, `#tri-an`) và `src/components/QrCodeModal.tsx` sinh mã QR tự động cho từng đường dẫn hash.

---

## 2. Mục Tiêu, Phi Mục Tiêu & Ràng Buộc (Goals, Non-Goals & Constraints)

### Mục tiêu (Goals)
1. **Luồng Học sinh Gửi lời chúc (`#gui-loi-chuc`):**
   - Biểu mẫu gồm 3 trường: **Tên người gửi**, **Lớp**, **Nội dung lời chúc**.
   - Kiểm tra dữ liệu đầu vào ở cả client và server (bắt buộc nhập, cắt khoảng trắng hai đầu, giới hạn độ dài: tên `2–60` ký tự, lớp `2–20` ký tự, nội dung `10–600` ký tự).
   - Hiển thị rõ trạng thái **đang gửi (`Đang gửi lời chúc...`)**, thông báo **thành công** hoặc **thất bại**.
   - **Giữ nguyên nội dung đã nhập** trên biểu mẫu khi gửi gặp lỗi mạng/máy chủ để học sinh không phải nhập lại.
   - **Chống gửi trùng (Duplicate submission protection):** Khóa nút gửi trong lúc request đang chạy (`disabled` khi `isSubmitting = true`) và chặn gửi lặp cùng một nội dung từ cùng người gửi trong khoảng thời gian ngắn ở phía máy chủ.
2. **Luồng Thầy cô Xem lời chúc (`#xem-loi-chuc`):**
   - Quyền xem **công khai** qua nút bấm nổi bật trên đầu trang (`HeroMasthead`), chân trang (`EditorialFooter`), đường link trực tiếp `/#xem-loi-chuc` và **Mã QR riêng** trong `QrCodeModal` để thầy cô và Ban giám khảo mở xem ngay từ thiết bị khác.
   - Lời chúc hợp lệ **xuất hiện ngay** sau khi gửi (sắp xếp mới nhất lên đầu), không cần qua bước duyệt thủ công.
   - Hiển thị đầy đủ các trạng thái: **Đang tải dữ liệu (`loading`)**, **Chưa có lời chúc nào (`empty`)**, **Lỗi tải dữ liệu (`error` kèm nút Thử lại)** và nút **Làm mới danh sách**.
3. **Lưu trữ tập trung & Bảo mật phía máy chủ:**
   - Lời chúc được lưu tập trung ở phía máy chủ thông qua REST endpoint `/api/wishes` (`GET` và `POST`), đảm bảo lời chúc vẫn còn sau khi tải lại trang (`F5`) và **học sinh gửi ở Thiết bị/Trình duyệt A thì thầy cô mở từ Thiết bị/Trình duyệt B xem được ngay**.
   - Hiển thị lời chúc hoàn toàn dưới dạng **văn bản thuần (plain text)** để chống XSS.
   - Giữ toàn bộ cấu hình đường dẫn lưu trữ hoặc khóa bí mật kết nối dịch vụ lưu trữ ở **phía máy chủ** (đọc từ `process.env` trên server, tuyệt đối không dùng tiền tố `VITE_` cho thông tin nhạy cảm).

### Phi mục tiêu & Anti-Goals
- **Non-Goal:** Không xây dựng hệ thống tài khoản đăng nhập bắt buộc cho học sinh hay mật khẩu chặn thầy cô khi quét QR xem lời chúc.
- **Anti-Goal:** Không dùng `localStorage` làm nơi lưu chính (vì thiết bị khác không đọc được); không render HTML thô (`dangerouslySetInnerHTML`) từ nội dung lời chúc của người dùng.

---

## 3. Các Phương Án Kiến Trúc & Lựa Chọn Đã Chốt (Approaches)

1. **Phương án A (Đã chọn): API Phía Máy Chủ tích hợp trong Vite/Node (`/api/wishes`) + Lưu trữ Tập trung trên Server (`server/data/wishes.json`), hỗ trợ cấu hình qua biến môi trường phía máy chủ**
   - **Cách hoạt động:** Xây dựng module xử lý API phía máy chủ (`src/server/wishesApi.ts`) gắn trực tiếp vào cả `configureServer` (`vite dev`) và `configurePreviewServer` (`vite preview`) trong `vite.config.ts`. Máy chủ lưu danh sách lời chúc vào tệp JSON tập trung `server/data/wishes.json` (tự động tạo thư mục/tệp nếu chưa có, kèm vài lời chúc mẫu giàu cảm xúc của học sinh 9A3 hoặc cho phép cấu hình tệp trống khi test). Nếu triển khai kèm kho lưu trữ từ xa, máy chủ đọc biến môi trường riêng tư phía server (`WISHES_STORAGE_FILE`, `WISHES_REMOTE_URL`, `WISHES_SECRET_TOKEN`) mà client không bao giờ thấy.
   - **Ưu điểm:** Chạy được ngay lập tức trên máy hiện tại (giữa Trình duyệt A và Trình duyệt B, hoặc Điện thoại và Máy tính cùng mạng LAN) mà không bắt buộc đăng ký tài khoản đám mây bên thứ ba; giữ kín toàn bộ thông tin cấu hình ở phía máy chủ.
2. **Phương án B (Dịch vụ Cloud BaaS bên ngoài như Supabase / Firebase bắt buộc từ đầu):**
   - **Đánh đổi:** Phải tạo tài khoản, tạo bảng và cấu hình khóa API trước khi ứng dụng có thể hoạt động.
3. **Phương án C (Lưu trên `localStorage` của trình duyệt):**
   - **Đánh đổi (Loại bỏ):** Không đáp ứng yêu cầu thầy cô mở trang xem từ thiết bị hoặc trình duyệt khác.

---

## 4. Thiết Kế Chi Tiết Luồng Hoạt Động, Giao Diện & API

### 4.1. Luồng truy cập & Điều hướng (Deep-link Hash & QR)
- Bổ sung 2 đường dẫn hash chuyên biệt hoạt động song song với 5 chuyên mục hiện có trong `src/App.tsx`:
  - `#gui-loi-chuc`: Mở trực tiếp khu vực/khung **Gửi lời chúc 20/11** dành cho học sinh.
  - `#xem-loi-chuc`: Mở trực tiếp **Trang Xem Lời Chúc 20/11** dành cho thầy cô và Ban giám khảo.
- Trên `HeroMasthead` và `EditorialFooter`: Thêm cụm nút nổi bật **“Gửi Lời Chúc 20/11”** và **“Xem Lời Chúc (Dành Cho Thầy Cô)”**.
- Trong `QrCodeModal`: Bổ sung thẻ **Mã QR Trang Xem Lời Chúc 20/11 (`/#xem-loi-chuc`)** để thầy cô quét mã bằng điện thoại là mở thẳng vào sổ tay lời chúc.

### 4.2. Đặc tả API Phía Máy Chủ (`/api/wishes`)
- **`GET /api/wishes`**
  - Trả về `200 OK` với JSON: `{ wishes: WishItem[] }` (sắp xếp theo `createdAt` giảm dần – mới nhất lên đầu).
- **`POST /api/wishes`**
  - Body JSON: `{ senderName: string, className: string, message: string }`.
  - Kiểm tra hợp lệ ở phía máy chủ:
    - Loại bỏ thẻ điều khiển/khoảng trắng thừa, chuẩn hóa chuỗi văn bản thuần.
    - `senderName`: bắt buộc, từ `2` đến `60` ký tự.
    - `className`: bắt buộc, từ `2` đến `20` ký tự.
    - `message`: bắt buộc, từ `10` đến `600` ký tự.
    - Chống gửi trùng (Idempotency / Rate-limit nhẹ): Nếu cùng `senderName` + `className` + `message` vừa được gửi trong vòng 30 giây gần nhất, trả về `409 Conflict` với thông báo rõ ràng.
  - Khi hợp lệ: Lưu bản ghi mới (`id`, `senderName`, `className`, `message`, `createdAt`) vào kho lưu trữ tập trung phía máy chủ và trả về `201 Created` kèm `{ wish: WishItem }`.
  - Khi không hợp lệ: Trả về `400 Bad Request` kèm `{ error: string, fieldErrors?: Record<string, string> }`.

### 4.3. Bảo mật & Quyền riêng tư phía máy chủ
- Mọi biến cấu hình phía máy chủ (`WISHES_STORAGE_PATH`, `WISHES_SERVER_SECRET`) chỉ được đọc trong tiến trình Node (`src/server/wishesApi.ts`), không sử dụng tiền tố `VITE_` và không bao giờ trả về trong response API.
- Khi hiển thị lời chúc trên giao diện React (`WishesWallModal` / trang xem lời chúc), mọi trường `senderName`, `className`, `message` được render trực tiếp qua cú pháp JSX text node (`{wish.message}`), đảm bảo trình duyệt tự động escape mọi ký tự đặc biệt (`<`, `>`, `&`, `"`, `'`).

