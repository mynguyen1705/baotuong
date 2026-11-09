import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeacherWishesView } from '../components/TeacherWishesView';
import * as wishesClient from '../utils/wishesClient';

describe('TeacherWishesView', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('hiển thị trạng thái đang tải khi bắt đầu lấy dữ liệu', () => {
    vi.spyOn(wishesClient, 'fetchWishes').mockImplementation(() => new Promise(() => {}));
    render(<TeacherWishesView />);
    expect(screen.getByText(/Đang tải sổ tay lời chúc/i)).toBeInTheDocument();
  });

  it('hiển thị trạng thái chưa có lời chúc khi danh sách trống', async () => {
    vi.spyOn(wishesClient, 'fetchWishes').mockResolvedValue([]);
    render(<TeacherWishesView />);
    expect(await screen.findByText(/Chưa có lời chúc nào được gửi/i)).toBeInTheDocument();
  });

  it('hiển thị trạng thái lỗi tải dữ liệu và cho phép bấm Thử lại', async () => {
    const fetchSpy = vi
      .spyOn(wishesClient, 'fetchWishes')
      .mockRejectedValueOnce(new Error('Lỗi kết nối máy chủ'))
      .mockResolvedValueOnce([
        {
          id: 'w-1',
          senderName: 'Lê Minh Khôi',
          className: '9A3',
          message: 'Chúc thầy cô luôn dồi dào sức khỏe!',
          createdAt: '2026-11-07T10:00:00.000Z',
        },
      ]);

    render(<TeacherWishesView />);
    expect(await screen.findByText(/Không thể tải danh sách lời chúc/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Thử lại/i }));
    expect(await screen.findByText('Lê Minh Khôi')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('hiển thị nội dung lời chúc dưới dạng văn bản thuần (không thực thi HTML/script)', async () => {
    vi.spyOn(wishesClient, 'fetchWishes').mockResolvedValue([
      {
        id: 'w-xss',
        senderName: '<b>Học sinh</b>',
        className: '9A3',
        message: '<script>window.__xssExecuted = true;</script>Chúc mừng 20/11!',
        createdAt: '2026-11-07T10:00:00.000Z',
      },
    ]);

    const { container } = render(<TeacherWishesView />);
    expect(
      await screen.findByText('<script>window.__xssExecuted = true;</script>Chúc mừng 20/11!')
    ).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
  });
});

