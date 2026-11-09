import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';
import * as wishesClient from '../utils/wishesClient';
import { WishItem } from '../types/wishes';

describe('Tích hợp luồng Gửi & Xem lời chúc 20/11 trên App', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('mở thẳng Trang Xem Lời Chúc Dành Cho Thầy Cô khi truy cập link #xem-loi-chuc', async () => {
    vi.spyOn(wishesClient, 'fetchWishes').mockResolvedValue([
      {
        id: 'w-101',
        senderName: 'Nguyễn Minh Quân',
        className: '9A3',
        message: 'Em chúc thầy cô ngày 20/11 thật nhiều niềm vui!',
        createdAt: '2026-11-07T11:00:00.000Z',
      },
    ]);

    window.location.hash = '#xem-loi-chuc';
    render(<App />);

    expect(await screen.findByText('Nguyễn Minh Quân')).toBeInTheDocument();
    expect(
      screen.getByText('Em chúc thầy cô ngày 20/11 thật nhiều niềm vui!')
    ).toBeInTheDocument();
  });

  it('mở biểu mẫu Gửi Lời Chúc 20/11 khi bấm nút trên trang chính hoặc vào #gui-loi-chuc', async () => {
    render(<App />);
    const openSubmitButtons = screen.getAllByRole('button', { name: /Gửi Lời Chúc 20\/11/i });
    fireEvent.click(openSubmitButtons[0]);

    expect(await screen.findByLabelText(/Tên người gửi/i)).toBeInTheDocument();
    expect(window.location.hash).toBe('#gui-loi-chuc');
  });

  it('nghiệm thu toàn luồng: học sinh gửi lời chúc ở Trình duyệt A (#gui-loi-chuc) -> thầy cô mở Trình duyệt B (#xem-loi-chuc) xem được ngay', async () => {
    const serverDb: WishItem[] = [];

    vi.spyOn(wishesClient, 'submitWish').mockImplementation(async (input) => {
      const item: WishItem = {
        id: `wish-${serverDb.length + 1}`,
        senderName: input.senderName,
        className: input.className,
        message: input.message,
        createdAt: '2026-11-07T12:00:00.000Z',
      };
      serverDb.unshift(item);
      return item;
    });

    vi.spyOn(wishesClient, 'fetchWishes').mockImplementation(async () => [...serverDb]);

    // Phiên Trình duyệt A: Học sinh mở #gui-loi-chuc và gửi lời chúc
    window.location.hash = '#gui-loi-chuc';
    const sessionA = render(<App />);

    fireEvent.change(await screen.findByLabelText(/Tên người gửi/i), {
      target: { value: 'Trần Khánh Linh' },
    });
    fireEvent.change(screen.getByLabelText(/Lớp/i), {
      target: { value: '9A3' },
    });
    fireEvent.change(screen.getByLabelText(/Nội dung lời chúc/i), {
      target: {
        value: 'Em kính chúc thầy cô trường TH&THCS Hiệp Thạnh luôn mạnh khỏe và hạnh phúc!',
      },
    });
    const dialog = screen.getByRole('dialog');
    const submitBtn = within(dialog)
      .getAllByRole('button')
      .find((btn) => btn.getAttribute('type') === 'submit');
    expect(submitBtn).toBeDefined();
    fireEvent.click(submitBtn!);

    expect(await screen.findByText(/Đã gửi lời chúc thành công/i)).toBeInTheDocument();
    sessionA.unmount();

    // Phiên Trình duyệt B độc lập: Thầy cô mở #xem-loi-chuc từ thiết bị khác
    window.location.hash = '#xem-loi-chuc';
    render(<App />);

    expect(await screen.findByText('Trần Khánh Linh')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Em kính chúc thầy cô trường TH&THCS Hiệp Thạnh luôn mạnh khỏe và hạnh phúc!'
      )
    ).toBeInTheDocument();
  });
});
