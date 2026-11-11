HƯỚNG DẪN ĐẶT FILE ÂM THANH & VIDEO TRONG THƯ MỤC NÀY (public/media/):

1. File nhạc nền trang báo tường (Background Music):
   - Đặt file tên: nhac-nen.mp3 (hoặc nhac-nen-20-11.mp3)
   - Định dạng: .mp3
   - Chức năng: Phát khi bấm nút "Bật nhạc nền 20/11" ở thanh đầu trang báo.

2. File giọng đọc / ngâm thơ (Mục 3. Thơ):
   - Đặt file tên: ngam-tho-9a3.mp3
   - Định dạng: .mp3
   - Chức năng: Phát trong trình phát Audio ở Mục 3. Thơ ("Ơn Thầy Nâng Cánh").
   - Ghi chú: Nếu muốn đổi tên file, bạn có thể chỉnh đường dẫn tại `src/data/baotuongData.ts` (mục `tho` -> `audioRecitationUrl`).

3. File video MV ca nhạc thực tế (Mục 4. Âm nhạc / MV):
   - Đặt file tên: mv-nguoi-gieo-mam-xanh-9a3.mp4
   - Định dạng: .mp4
   - Chức năng: Phát trong trình phát Video của Mục 4 khi chọn chế độ "Video MV Lớp 9A3 (.MP4)".
   - Link YouTube: Có thể sửa link YouTube trong file `src/data/baotuongData.ts` (mục `mv` -> `mvData` -> `youtubeEmbedUrl`).

