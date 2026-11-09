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

  it('hiển thị nút Sửa và Xóa cho lời chúc của chính mình và ẩn với lời chúc của người khác', async () => {
    vi.spyOn(wishesClient, 'fetchWishes').mockResolvedValue([
      {
        id: 'w-my-1',
        senderName: 'Trà My',
        className: '9A3',
        message: 'Lời chúc của em Trà My gửi thầy cô!',
        createdAt: '2026-11-07T10:00:00.000Z',
      },
      {
        id: 'w-other-2',
        senderName: 'Bạn Khác',
        className: '9A3',
        message: 'Lời chúc của bạn khác trong trường!',
        createdAt: '2026-11-07T11:00:00.000Z',
      },
    ]);

    vi.spyOn(wishesClient, 'isMyWish').mockImplementation((id) => id === 'w-my-1');

    render(<TeacherWishesView />);

    expect(await screen.findByText('Trà My')).toBeInTheDocument();
    expect(screen.getByText('Bạn Khác')).toBeInTheDocument();

    // Lời chúc của chính mình có nút Sửa và Xóa
    expect(screen.getByRole('button', { name: /Chỉnh sửa lời chúc của Trà My/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Xóa lời chúc của Trà My/i })).toBeInTheDocument();

    // Lời chúc của người khác không có nút Sửa và Xóa
    expect(
      screen.queryByRole('button', { name: /Chỉnh sửa lời chúc của Bạn Khác/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Xóa lời chúc của Bạn Khác/i })
    ).not.toBeInTheDocument();
  });

  it('cho phép chỉnh sửa và xóa lời chúc của chính mình', async () => {
    const mockWish = {
      id: 'w-my-1',
      senderName: 'Trà My',
      className: '9A3',
      message: 'Lời chúc ban đầu của em!',
      createdAt: '2026-11-07T10:00:00.000Z',
    };

    vi.spyOn(wishesClient, 'fetchWishes').mockResolvedValue([mockWish]);
    vi.spyOn(wishesClient, 'isMyWish').mockReturnValue(true);
    const updateSpy = vi.spyOn(wishesClient, 'updateWish').mockResolvedValue({
      ...mockWish,
      message: 'Lời chúc đã được chỉnh sửa!',
    });
    const deleteSpy = vi.spyOn(wishesClient, 'deleteWish').mockResolvedValue();

    render(<TeacherWishesView />);
    expect(await screen.findByText('Lời chúc ban đầu của em!')).toBeInTheDocument();

    // 1. Mở modal sửa
    fireEvent.click(screen.getByRole('button', { name: /Chỉnh sửa lời chúc của Trà My/i }));
    expect(screen.getByRole('dialog', { name: /Chỉnh Sửa Lời Chúc Của Bạn/i })).toBeInTheDocument();

    // Thay đổi nội dung và lưu
    fireEvent.change(screen.getByLabelText(/Nội dung lời chúc/i), {
      target: { value: 'Lời chúc đã được chỉnh sửa!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Lưu thay đổi/i }));

    expect(updateSpy).toHaveBeenCalledWith('w-my-1', expect.objectContaining({
      message: 'Lời chúc đã được chỉnh sửa!',
    }));

    // 2. Mở dialog xóa và xác nhận
    expect(await screen.findByRole('button', { name: /Xóa lời chúc của Trà My/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Xóa lời chúc của Trà My/i }));
    expect(screen.getByRole('dialog', { name: /Xác nhận xóa lời chúc/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Xóa lời chúc$/i }));
    expect(deleteSpy).toHaveBeenCalledWith('w-my-1');
  });
});

