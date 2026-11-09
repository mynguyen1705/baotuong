# Đặc tả Thiết kế: Bảng Tổng Hợp Giáo Viên Bộ Môn (20/11)

- **Ngày tạo:** 2026-11-08
- **Dự án:** Báo tường điện tử 20/11 – Chi đội 9A3, Trường TH&THCS Hiệp Thạnh
- **Phương án được chọn:** Phương án A – Bảng Polaroid Tương Tác + Hồ Sơ Chi Tiết + Biểu Mẫu Đóng Góp Liên Thiết Bị (Không giới hạn số lượng giáo viên, cho phép thêm/đổi ảnh giáo viên bất cứ lúc nào)

---

## 1. Mục tiêu & Phạm vi

1. **Tái hiện bố cục thị giác theo đúng poster mẫu đính kèm:**
   - Nền xanh da trời tươi sáng (`sky-blue`), tiêu đề chữ nổi 3D trắng-xanh **“BẢNG TỔNG HỢP GIÁO VIÊN BỘ MÔN”** kèm dải băng keo vàng **“Học Kỳ I - Năm Học Mới”**.
   - Tờ giấy vở kẻ ngang màu trắng đặt hơi nghiêng trên tập hồ sơ vàng, ghim kẹp giấy bạc, kẹp bướm vàng, bút dạ quang xanh/tím, bút bi đỏ và hệ thống doodle học đường vẽ tay (hình nón, bình thí nghiệm, chuỗi ADN, ngôi sao, trái tim, nốt nhạc, công thức `toán √học²`).
   - Lưới 2 cột các khung ảnh **Polaroid** nghiêng nhẹ đan xen. Mỗi khung Polaroid có:
     - Ảnh chân dung giáo viên (hoặc ảnh minh họa mặc định nếu chưa tải ảnh lên) kèm nút nhanh **“Đổi / Thêm ảnh”** trực tiếp;
     - Nhãn dán (sticker badge) chữ cam viền nâu nổi ở góc ảnh (ví dụ: *“Siêu vui tính!”*, *“Nhẹ nhàng & ấm áp”*...);
     - Dòng tiêu đề in hoa đậm `[MÔN HỌC] - [DANH XƯNG + HỌ TÊN]` (ví dụ: `TOÁN HỌC - THẦY NGUYỄN VĂN A`);
     - 2 dòng mô tả ngắn gọn về tính cách và phong cách giảng dạy bên dưới khung Polaroid.
   - Nhãn giấy nhớ (sticky note) màu vàng ở góc dưới trái: *“Chào mừng các em học sinh đến với năm học mới!”*.
2. **Xem chi tiết & Biểu mẫu đóng góp trên web:**
   - Học sinh hoặc thầy cô nhấp vào bất kỳ thẻ Polaroid nào sẽ mở **Hộp thoại Hồ sơ chi tiết giáo viên** (tính cách, phong cách giảng dạy, câu nói thương hiệu, kỷ niệm đáng nhớ của lớp 9A3, danh sách cảm nhận của học sinh).
   - Học sinh có thể mở **Biểu mẫu Giáo viên (`#bieu-mau-giao-vien`)** để:
     - **Thêm giáo viên bộ môn mới** vào bảng tổng hợp (**không giới hạn số lượng tối đa**);
     - **Cập nhật thông tin / thêm cảm nhận** về tính cách, kỷ niệm cho giáo viên đã có;
     - **Thêm hoặc đổi ảnh giáo viên bất cứ lúc nào** (khi tạo mới, trong biểu mẫu cập nhật, hoặc bấm nút *“Thêm / Đổi ảnh”* ngay trên thẻ Polaroid / trong modal chi tiết) bằng cách tải tệp ảnh từ máy/điện thoại (tự động nén/resize hoặc Data URL) hoặc dán đường dẫn URL ảnh.
3. **Đồng bộ liên thiết bị (Cross-device):**
   - Lưu trữ tập trung trên máy chủ thông qua Vite HTTP Middleware (`/api/teachers`) ghi ra tệp `server/data/teachers.json`.
   - Khi học sinh thêm giáo viên mới, đổi ảnh giáo viên, hoặc gửi thêm chi tiết tính cách trên thiết bị A, thầy cô mở đường dẫn `#bang-giao-vien` (hoặc quét Mã QR từ thiết bị B) sẽ thấy ngay bảng tổng hợp mới nhất.

---

## 2. Dữ liệu khởi tạo (6 Giáo viên mặc định theo Poster mẫu)

Khi `server/data/teachers.json` chưa tồn tại, hệ thống tự động khởi tạo 6 giáo viên chuẩn theo ảnh mẫu:

1. **TOÁN HỌC - THẦY NGUYỄN VĂN A**
   - Badge: `Siêu vui tính!` (vị trí góc phải)
   - Tóm tắt: `Hay đùa nhưng cực kỳ nghiêm túc khi chấm bài`
   - Tính cách & Chi tiết: Hài hước, biến những bài hình học khô khan thành câu đố vui nhưng luôn rèn cho lớp 9A3 tính cẩn thận từng bước giải.
2. **NGỮ VĂN - CÔ TRẦN THỊ B**
   - Badge: `Nhẹ nhàng & ấm áp` (vị trí góc phải)
   - Tóm tắt: `Giọng nói truyền cảm, rất hay kể chuyện văn học`
   - Tính cách & Chi tiết: Dịu dàng, giàu cảm xúc, luôn lắng nghe tâm tư học trò và mở rộng bài giảng bằng những câu chuyện đời thường sâu sắc.
3. **VẬT LÝ - THẦY LÊ VĂN C**
   - Badge: `Nhiều năng lượng!` (vị trí góc trái)
   - Tóm tắt: `Luôn có những thí nghiệm bất ngờ và thú vị`
   - Tính cách & Chi tiết: Sôi nổi, nhiệt huyết, luôn mang dụng cụ thực hành vào lớp để học sinh tự tay khám phá các hiện tượng tự nhiên.
4. **HÓA HỌC - CÔ PHẠM THỊ D**
   - Badge: `Tỉ mỉ & dễ thương` (vị trí góc phải)
   - Tóm tắt: `Thích sơ đồ tư duy và những bài thực hành vui nhộn`
   - Tính cách & Chi tiết: Chu đáo, kiên nhẫn, giúp học sinh nhớ bảng tuần hoàn và phương trình hóa học qua sơ đồ tư duy đầy màu sắc.
5. **SINH HỌC - CÔ MAI LAN**
   - Badge: `Rất yêu thiên nhiên` (vị trí góc trái)
   - Tóm tắt: `Mang cả khu vườn và thế giới động vật vào lớp học`
   - Tính cách & Chi tiết: Gần gũi, yêu cây cỏ và thiên nhiên, truyền cảm hứng bảo vệ môi trường và khám phá thế giới sống quanh ta.
6. **LỊCH SỬ - THẦY QUỐC KHÁNH**
   - Badge: `Người kể chuyện` (vị trí góc phải)
   - Tóm tắt: `Biến các mốc lịch sử thành những câu chuyện ly kỳ`
   - Tính cách & Chi tiết: Giọng kể hào hùng, cuốn hút, giúp mỗi tiết Lịch sử trở thành một chuyến du hành ngược thời gian đầy tự hào.

---

## 3. Kiến trúc Kỹ thuật & API

### 3.1. Mô hình dữ liệu (`src/types/teachers.ts`)
- `TeacherImpression`:
  - `id: string`
  - `studentName: string`
  - `className: string`
  - `trait: string` (Từ khóa tính cách nổi bật)
  - `detail: string` (Chia sẻ chi tiết / kỷ niệm với thầy cô)
  - `createdAt: string`
- `TeacherProfile`:
  - `id: string`
  - `subject: string` (Ví dụ: `"TOÁN HỌC"`)
  - `honorificAndName: string` (Ví dụ: `"THẦY NGUYỄN VĂN A"`)
  - `badgeText: string` (Ví dụ: `"Siêu vui tính!"`)
  - `badgeSide: 'left' | 'right'`
  - `summary: string` (Mô tả 2 dòng hiển thị dưới Polaroid)
  - `personalityTraits: string[]` (Danh sách nét tính cách nổi bật)
  - `detailedBio: string` (Giới thiệu chi tiết về phong cách dạy và kỷ niệm với lớp)
  - `memorableQuote?: string` (Câu nói quen thuộc của thầy/cô)
  - `photoUrl: string` (Data URL ảnh tải lên, URL ảnh, hoặc đường dẫn SVG/chân dung minh họa mặc định)
  - `avatarTheme: 'math' | 'literature' | 'physics' | 'chemistry' | 'biology' | 'history' | 'custom'`
  - `impressions: TeacherImpression[]`
  - `createdAt: string`
  - `updatedAt: string`

### 3.2. Máy chủ lưu trữ & API (`src/server/teachersStore.ts` & `src/server/teachersApiPlugin.ts`)
- Lưu trữ tại `server/data/teachers.json`, **không giới hạn số lượng giáo viên tối đa**.
- Hỗ trợ payload tối đa `5MB` để nhận ảnh base64 Data URL khi người dùng tải ảnh giáo viên lên.
- Các endpoint REST:
  - `GET /api/teachers`: Trả về `{ teachers: TeacherProfile[] }` theo thứ tự hiển thị (6 giáo viên gốc + toàn bộ giáo viên mới được thêm).
  - `POST /api/teachers`: Thêm mới một giáo viên vào bảng tổng hợp (kèm ảnh tùy chọn hoặc dùng avatar minh họa mặc định).
  - `PATCH /api/teachers/:id`: Cập nhật thông tin hoặc **thay đổi/thêm ảnh giáo viên bất cứ lúc nào** (`photoUrl`, `badgeText`, `summary`, `detailedBio`, `personalityTraits`, `memorableQuote`), và/hoặc thêm `impression` mới từ học sinh.

### 3.3. Thành phần Giao diện (`src/components/`)
1. `TeacherSummaryBoardSection.tsx`:
   - Khu vực **Bảng Tổng Hợp Giáo Viên Bộ Môn** hiển thị nổi bật ngay trên trang báo tường (và có chế độ mở toàn màn hình `#bang-giao-vien` cho thầy cô xem từ thiết bị khác).
   - Thiết kế chuẩn poster mẫu: nền xanh da trời, chữ 3D trắng viền xanh, băng keo vàng, tờ giấy kẻ ngang nghiêng nhẹ có ghim kẹp, bút dạ quang, doodle khoa học/nghệ thuật, lưới 2 cột thẻ Polaroid không giới hạn độ dài, nhãn vàng cuối trang.
   - Mỗi thẻ Polaroid có nút máy ảnh nổi góc trên để **Thêm / Đổi ảnh giáo viên ngay lập tức**, hoặc nhấp vào thẻ để xem chi tiết.
2. `TeacherBoardModal.tsx`:
   - Giao diện xem chi tiết từng giáo viên, gửi thêm cảm nhận/chi tiết tính cách, đổi ảnh giáo viên bất cứ lúc nào, và biểu mẫu thêm giáo viên mới (`#bieu-mau-giao-vien`).
3. Tích hợp điều hướng & QR (`HeroMasthead.tsx`, `EditorialFooter.tsx`, `QrCodeModal.tsx`, `App.tsx`):
   - Hỗ trợ hash `#bang-giao-vien` (Mở bảng tổng hợp giáo viên cho thầy cô) và `#bieu-mau-giao-vien` (Mở biểu mẫu điền tính cách & thêm giáo viên cho học sinh).
   - Thêm 2 mã QR chuyên biệt trong `QrCodeModal.tsx` để thầy cô và học sinh quét từ điện thoại/thiết bị khác.

