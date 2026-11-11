# Kế Hoạch Triển Khai Ảnh Nền Lớp Học 20/11 & Tối Ưu Giao Diện

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Mục tiêu
Thiết lập bức tranh lớp học 20/11 (`media_1794409304185_85b3e051.jpg`) làm background chính thức cho toàn bộ giao diện website báo tường. Tối ưu độ phân giải, bố cục cố định và độ tương phản giúp nội dung trung tâm nổi bật, đồng thời giữ trọn vẹn nét vẽ nghệ thuật cô trò và bàn giáo viên ở hai bên.

## Các file chỉnh sửa
1. `public/backgrounds/bg-classroom-20-11.jpg`: Lưu ảnh nền gốc chất lượng cao.
2. `src/index.css`: Cấu hình background cho `body` với `background-attachment: fixed`, `background-size: cover`, `background-position: center top`, cùng lớp màng nền ấm.
3. `src/components/SchoolDecorations.tsx`: Điều chỉnh độ mờ (opacity) của các họa tiết SVG phụ để nhường sự nổi bật cho hình nền cô trò vẽ tay, bảo đảm 100% test assertions vẫn đạt.
4. `src/App.tsx`: Căn chỉnh lớp phủ (overlay) nhẹ nhàng và padding hợp lý cho container trung tâm.
5. `src/__tests__/floralSideDecorations.test.tsx` & các test suite khác: Xác nhận 51/51 tests passing.

---

### Task 1: Sao chép ảnh nền vào thư mục công khai (`public/backgrounds/`)
- [ ] Tạo thư mục `public/backgrounds/` nếu chưa có.
- [ ] Sao chép nguyên vẹn `media_1794409304185_85b3e051.jpg` sang `public/backgrounds/bg-classroom-20-11.jpg`.

### Task 2: Cập nhật CSS nền toàn trang (`src/index.css`)
- [ ] Thiết lập `body` trong `src/index.css` sử dụng ảnh nền `url('/backgrounds/bg-classroom-20-11.jpg')`.
- [ ] Cấu hình `background-attachment: fixed`, `background-size: cover`, `background-position: center top`.
- [ ] Bổ sung hiệu ứng khử răng cưa và tương phản tối ưu.

### Task 3: Điều chỉnh độ trong suốt của họa tiết SVG phụ (`src/components/SchoolDecorations.tsx`)
- [ ] Giảm opacity của các cụm sách vở, bình thí nghiệm SVG sang dạng chìm tinh tế (`opacity-25 sm:opacity-35`) để tôn vinh bức tranh vẽ cô trò và quả địa cầu ở hai bên cánh gà.
- [ ] Đảm bảo giữ nguyên toàn bộ `data-testid` để không ảnh hưởng đến bộ test.

### Task 4: Kiểm thử và nghiệm thu
- [ ] Chạy `npm test -- --run` kiểm tra toàn bộ 51 tests.
- [ ] Chạy `npm run build` xác nhận build production thành công.
- [ ] Commit thay đổi và push lên nhánh `redesign-ui`.

