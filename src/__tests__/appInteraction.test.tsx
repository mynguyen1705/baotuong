import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Báo tường số 9A3 App Interactions (Typographic Poster Style)', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('hiển thị thiết kế Typographic Infographic theo đúng style Poster Chắp Cánh Ước Mơ mà không dùng ảnh cũ', () => {
    const { container } = render(<App />);
    expect(screen.getAllByText(/9A3/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TH&THCS Hiệp Thạnh/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/NHẤP VÀO ĐÂY ĐỂ XEM/i).length).toBe(5);
    const oldImgs = container.querySelectorAll('img[src*="poster-goc"]');
    expect(oldImgs.length).toBe(0);
    expect(screen.getByText('CHẮP CÁNH')).toBeInTheDocument();
    expect(screen.getByText('ƯỚC MƠ')).toBeInTheDocument();
    expect(screen.getByText(/01 • MỞ ĐẦU/i)).toBeInTheDocument();
  });

  it('mở đúng chuyên mục MV Người gieo mầm xanh khi bấm nút xem hoặc truy cập hash #mv', () => {
    window.location.hash = '#mv';
    render(<App />);
    expect(screen.getAllByText(/Người gieo mầm xanh/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hứa Kim Tuyền/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hoàng Dũng/i).length).toBeGreaterThan(0);
  });

  it('mở đúng chuyên mục Thơ với các bài thơ nổi tiếng về tuổi học trò và trình phát Audio khi truy cập #tho', () => {
    window.location.hash = '#tho';
    render(<App />);
    expect(screen.getAllByText(/Thầy Và Chuyến Đò Xưa/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nguyễn Quốc Đạt/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hải Đăng/i).length).toBeGreaterThan(0);
    const playBtn = screen.getByRole('button', { name: /Phát thu âm ngâm thơ và nhạc nền/i });
    fireEvent.click(playBtn);
    expect(screen.getByRole('button', { name: /Tạm dừng nghe ngâm thơ/i })).toBeInTheDocument();
  });

  it('đóng khung đọc khi nhấn phím Escape và hỗ trợ điều hướng ArrowRight/ArrowLeft', () => {
    window.location.hash = '#tri-an';
    render(<App />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByText(/Bức Thư Tháng Mười Một/i).length).toBeGreaterThan(0);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(window.location.hash).toBe('#loi-ngo');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('chuyển đổi được sang chế độ Sơ Đồ Infographic Toàn Cảnh và mở được bảng Mã QR', () => {
    render(<App />);
    const posterTab = screen.getByRole('tab', { name: /Sơ Đồ Infographic Toàn Cảnh/i });
    fireEvent.click(posterTab);
    expect(
      screen.getByText(/Sơ Đồ Cấu Trúc Tệp Sản Phẩm Báo Tường Số 9A3/i)
    ).toBeInTheDocument();

    const qrBtn = screen.getByRole('button', { name: /Mã QR & Link Nộp Bài/i });
    fireEvent.click(qrBtn);
    expect(
      screen.getByRole('dialog', {
        name: /Trung tâm Mã QR và Đường link truy cập Báo tường số 9A3/i,
      })
    ).toBeInTheDocument();
  });

  it('tự động tắt nhạc nền trang báo khi mở chuyên mục Thơ hoặc MV để tránh xung đột âm thanh', () => {
    render(<App />);
    const musicBtn = screen.getByRole('button', { name: /Bật nhạc nền 20\/11/i });
    fireEvent.click(musicBtn);
    expect(screen.getByRole('button', { name: /Tắt nhạc nền 20\/11/i })).toBeInTheDocument();

    const viewButtons = screen.getAllByText(/NHẤP VÀO ĐÂY ĐỂ XEM/i);
    fireEvent.click(viewButtons[3]);
    expect(screen.getByRole('button', { name: /Bật nhạc nền 20\/11/i })).toBeInTheDocument();
  });

  it('hiển thị Bảng Tổng Hợp Giáo Viên Bộ Môn trên trang chính và mở đúng chế độ khi truy cập #bang-giao-vien hoặc #bieu-mau-giao-vien', () => {
    window.location.hash = '#bieu-mau-giao-vien';
    render(<App />);
    expect(
      screen.getByRole('dialog', {
        name: /Bảng tổng hợp giáo viên bộ môn và biểu mẫu thông tin/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Biểu Mẫu Thêm Giáo Viên Vào Bảng Tổng Hợp/i)
    ).toBeInTheDocument();
  });

  it('hiển thị Phân Khu Trạm Ký Ức với 11 khung ảnh trái tim và hỗ trợ mở Lightbox xem cận cảnh', () => {
    window.location.hash = '';
    render(<App />);

    expect(screen.getByRole('heading', { name: /Trạm ký ức/i })).toBeInTheDocument();
    expect(screen.getByText(/Nơi lưu trữ tình yêu thương, sự đồng hành/i)).toBeInTheDocument();
    expect(screen.getAllByTestId(/^heart-photo-slot-/).length).toBe(11);

    // Bấm vào ảnh slot 4 để mở Lightbox
    const slot4 = screen.getByTestId('heart-photo-slot-4');
    fireEvent.click(slot4);
    expect(screen.getByRole('dialog', { name: /Ảnh kỷ niệm/i })).toBeInTheDocument();
  });
});
