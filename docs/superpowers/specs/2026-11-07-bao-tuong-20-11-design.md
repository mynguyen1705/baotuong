# Đặc tả Thiết kế: Báo Tường Điện Tử 20/11 – "Chắp Cánh Ước Mơ" (Chi đội 9A3)

## 1. Mục đích & Bối cảnh (Intent & Why)
Xây dựng sản phẩm **Báo tường điện tử (Báo tường số)** chào mừng Ngày Nhà giáo Việt Nam 20/11 cho **Chi đội 9A3 – Trường TH&THCS Hiệp Thạnh**, bám sát thể lệ cuộc thi trong `yeucau.txt` (Chủ đề chính: *"Tôn sư trọng đạo - Nét bút tri ân"*) và phong cách mỹ thuật của tấm poster Infographic mẫu *"Chắp cánh ước mơ"* (`795ae02a-b0fc-4968-9692-df0591176618.jpg`).

Sản phẩm đóng vai trò là một **Tệp sản phẩm Báo tường số hợp nhất** truy cập qua 01 đường link trực tiếp / Mã QR Code, đồng thời cung cấp liên kết sâu (deep-link `#id`) và mã QR riêng cho từng hạng mục sản phẩm con để Ban giám khảo chấm điểm thuận tiện trên cả điện thoại và máy tính.

## 2. Mục tiêu, Phi mục tiêu & Ràng buộc (Goals, Non-Goals & Constraints)

### Mục tiêu (Goals)
- Đáp ứng trọn vẹn thang điểm **100/100** của thể lệ `yeucau.txt`:
  1. **Bảng Infographic Tổng quan & Bố cục (20 điểm):** Hiển thị rõ tên báo (*"Chắp cánh ước mơ"*), chủ đề (*"Tôn sư trọng đạo - Nét bút tri ân"*), tên đơn vị (*Chi đội 9A3 – Trường TH&THCS Hiệp Thạnh*), Danh sách Ban biên tập lớp 9A3, sơ đồ 5 chuyên mục trực quan và các nút bấm / Mã QR dẫn tới từng sản phẩm.
  2. **Truyện ngắn & Bài Lời tri ân (20 điểm):**
     - Mục 1 (*Lời ngỏ*) & Mục 2 (*Truyện ngắn: "Người gieo hạt lặng lẽ"*) giàu cảm xúc, ghi rõ tác giả/nguồn.
     - Mục 5 (*Bài Lời tri ân*) độ dài chuẩn **~600 chữ** (trong khoảng 550–650 chữ), có bộ đếm số chữ hiển thị trực quan, không sai chính tả.
  3. **Trình bày Thơ đa phương tiện (20 điểm):**
     - Mục 3 (*Thơ: Tuyển tập thơ nổi tiếng về thầy cô & tuổi học trò* như *"Bụi phấn"*, *"Người thầy"*, *"Thời áo trắng"*... ghi rõ tác giả/nguồn) kết hợp trình phát **Audio ngâm/đọc thơ lồng nhạc nền** (hỗ trợ gắn file thu âm giọng thật của học sinh lớp 9A3, tuyệt đối không dùng giọng đọc AI).
  4. **Chất lượng MV Bài hát minh họa (20 điểm):**
     - Mục 4 (*MV Ca nhạc số*): Sử dụng bài hát **“Người gieo mầm xanh”** (Sáng tác: **Hứa Kim Tuyền**, Trình bày: **Hoàng Dũng**), đi kèm khung trình phát video MV cảnh học sinh lớp 9A3 học tập, vui chơi tại lớp học và sân trường TH&THCS Hiệp Thạnh + lời bài hát đồng bộ cảm xúc.
  5. **Tính Sáng tạo & Kỹ năng số, AI (10 điểm) + Tính Giáo dục & Thuyết trình (10 điểm):**
     - Sử dụng thư viện **`motion`** (`motion/react`) tạo chuyển động tinh tế (hiệu ứng mở trang báo, lá thu/hoa phượng rơi nhẹ, hiệu ứng cuộn thẻ, sóng nhạc), hỗ trợ **Chế độ xem Poster Gốc tương tác (Interactive Poster Mode)** và **Trung tâm Mã QR** cho từng mục.

### Phi mục tiêu (Non-Goals & Anti-Goals)
- Không yêu cầu hệ thống đăng nhập, cơ sở dữ liệu backend hay CMS phức tạp (toàn bộ nội dung được cấu hình tập trung tại `src/data/baotuongData.ts` để học sinh/giáo viên dễ chỉnh sửa).
- **Anti-goal:** Không dùng hiệu ứng chuyển động gây rối mắt hoặc làm chậm khả năng đọc chữ tiếng Việt trên điện thoại; không dùng giọng đọc AI (TTS) cho phần thơ đa phương tiện.

## 3. Các phương án đã cân nhắc & Quyết định lựa chọn (Approaches)

1. **Phương án A (Đã chọn – kết hợp thư viện `motion`):** *Bản đồ Infographic Tương tác + Không gian Đọc Chuyên sâu (Interactive Poster Hub + Rich Reading Modal/Drawer & Deep-link)*.
   - Trang chính tái hiện bố cục Infographic *"Chắp cánh ước mơ"* chuẩn Responsive với 5 thẻ chuyên mục nghệ thuật + chế độ bật xem Poster gốc có điểm chạm (hotspots). Khi bấm vào từng mục (hoặc truy cập qua URL `#loi-ngo`, `#truyen-ngan`, `#tho`, `#mv`, `#tri-an`), mở khung đọc chuyên sâu với hiệu ứng `motion` mượt mà, có thanh điều hướng chuyển mục và điều chỉnh cỡ chữ.
2. **Phương án B (Chỉ dùng ảnh tĩnh gắn hotspot):** Giống ảnh gốc nhưng chữ bị khóa cứng trong ảnh, khó đọc trên màn hình ngang (đã được tích hợp thành 1 chế độ phụ trong Phương án A).
3. **Phương án C (Cuộn dài 1 trang truyền thống):** Làm mất vai trò "Bảng Infographic tổng quan đóng vai trò sơ đồ trang bìa" (20 điểm).

## 4. Kiến trúc Giao diện, Phong cách Thị giác & Nội dung Mẫu

### 4.1. Công nghệ sử dụng
- **Bundler & Framework:** Vite + React 18 + TypeScript.
- **Styling:** Tailwind CSS v3 + Google Fonts hỗ trợ tiếng Việt (`Baloo 2`, `Playfair Display`, `Dancing Script`, `Be Vietnam Pro`, `Lora`).
- **Animation:** `motion` (Framer Motion) cho hiệu ứng xuất hiện thẻ (staggered reveal), chuyển cảnh Modal/Drawer đọc bài (`AnimatePresence`), sóng nhạc Audio và lá thu rơi nhẹ.
- **Icons & QR:** `lucide-react` (biểu tượng giao diện) + `qrcode.react` (tự động sinh mã QR chuẩn cho tờ báo và từng chuyên mục con theo URL thực tế).
- **Testing:** Vitest + React Testing Library + jsdom để kiểm tra dữ liệu 5 chuyên mục, độ dài ~600 chữ của Bài Lời tri ân, điều hướng bàn phím (`Escape`, mũi tên) và deep-link hash.

### 4.2. Cấu trúc 5 Chuyên mục & Nội dung Mẫu (Lớp 9A3 – TH&THCS Hiệp Thạnh)
- **Thông tin chung:**
  - Tên báo tường: **CHẮP CÁNH ƯỚC MƠ**
  - Chủ đề cuộc thi: **Tôn sư trọng đạo - Nét bút tri ân**
  - Đơn vị: **Chi đội 9A3 – Trường TH&THCS Hiệp Thạnh**
  - Ban biên tập lớp 9A3: Tổng biên tập, Phó biên tập, Nhóm Nội dung & Văn học, Nhóm Đa phương tiện (Audio/MV), Nhóm Thiết kế & Kỹ thuật số (dữ liệu mẫu rõ ràng trong `src/data/baotuongData.ts`).
- **Mục 1 – Lời ngỏ (`#loi-ngo`):** Bài mở đầu *"Lời ngỏ: Chắp cánh ước mơ từ mái trường Hiệp Thạnh"* (~200 chữ) gửi gắm tâm tình tuổi học trò cuối cấp của tập thể 9A3.
- **Mục 2 – Truyện ngắn (`#truyen-ngan`):** *"Người gieo hạt lặng lẽ"* (~850 chữ) – câu chuyện cảm động về người giáo viên tận tụy nâng đỡ học trò lớp 9 vượt qua tự ti, trình bày dạng trang sách văn học kèm trích dẫn nổi bật, ghi rõ tác giả/nguồn.
- **Mục 3 – Thơ đa phương tiện (`#tho`):** Tuyển tập thơ nổi tiếng về thầy cô và tuổi học trò (gồm các tác phẩm nổi tiếng như *"Người thầy"* – Nguyễn Nhất Ánh, *"Bụi phấn"* – Vũ Hoàng & Lê Văn Lộc, *"Thời áo trắng"* – Xuân Định; ghi rõ tên tác giả, nguồn sưu tầm) kết hợp **Trình phát Audio Ngâm Thơ** (hỗ trợ phát file `.mp3` giọng đọc học sinh lớp 9A3 + nhạc nền nhẹ nhàng, có sóng âm thanh `motion` và lời thơ đồng bộ).
- **Mục 4 – MV Ca nhạc số (`#mv`):** **“Người gieo mầm xanh”** – Sáng tác: **Hứa Kim Tuyền**, Trình bày: **Hoàng Dũng**. Gồm trình phát Video 16:9 (hỗ trợ cả file `.mp4` quay cảnh học sinh lớp 9A3 tại lớp học, sân trường TH&THCS Hiệp Thạnh và chế độ nhúng YouTube/Google Drive dự phòng), kịch bản phân cảnh thực tế tại trường và lời bài hát tri ân.
- **Mục 5 – Bài Lời tri ân (`#tri-an`):** Bức thư tri ân của tập thể Chi đội 9A3 nhân ngày 20/11 với độ dài chuẩn **~600 chữ** (kèm huy hiệu đếm số chữ tự động để Ban giám khảo đối chiếu), trình bày trên nền giấy thư tay cổ điển ấm áp.

