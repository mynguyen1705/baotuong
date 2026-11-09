import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WishSubmissionForm } from '../components/WishSubmissionForm';
import * as wishesClient from '../utils/wishesClient';
import { WishItem } from '../types/wishes';

describe('WishSubmissionForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('hiển thị lỗi kiểm tra dữ liệu khi bấm gửi mà để trống tên hoặc lời chúc quá ngắn', async () => {
    const submitSpy = vi.spyOn(wishesClient, 'submitWish');
    render(<WishSubmissionForm defaultClassName="9A3" />);

    fireEvent.click(screen.getByRole('button', { name: /Gửi lời chúc 20\/11/i }));

    expect(await screen.findByText(/Vui lòng nhập tên người gửi/i)).toBeInTheDocument();
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('giữ nguyên nội dung đã nhập khi gửi thất bại và hiển thị thông báo lỗi', async () => {
    vi.spyOn(wishesClient, 'submitWish').mockRejectedValue(
      new Error('Không thể kết nối máy chủ lưu lời chúc.')
    );

    render(<WishSubmissionForm defaultClassName="9A3" />);

    const nameInput = screen.getByLabelText(/Tên người gửi/i) as HTMLInputElement;
    const classInput = screen.getByLabelText(/Lớp/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/Nội dung lời chúc/i) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'Nguyễn Thảo Vy' } });
    fireEvent.change(classInput, { target: { value: '9A3' } });
    fireEvent.change(messageInput, {
      target: { value: 'Em kính chúc cô chủ nhiệm và các thầy cô luôn mạnh khỏe, hạnh phúc!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Gửi lời chúc 20\/11/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Không thể kết nối máy chủ lưu lời chúc/i
    );
    expect(nameInput.value).toBe('Nguyễn Thảo Vy');
    expect(classInput.value).toBe('9A3');
    expect(messageInput.value).toBe(
      'Em kính chúc cô chủ nhiệm và các thầy cô luôn mạnh khỏe, hạnh phúc!'
    );
  });

  it('khóa nút gửi trong lúc đang gửi để chống gửi trùng do bấm nhiều lần', async () => {
    let resolveSubmit!: (value: WishItem) => void;
    const submitSpy = vi.spyOn(wishesClient, 'submitWish').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<WishSubmissionForm defaultClassName="9A3" />);

    fireEvent.change(screen.getByLabelText(/Tên người gửi/i), {
      target: { value: 'Đỗ Hoàng Phúc' },
    });
    fireEvent.change(screen.getByLabelText(/Nội dung lời chúc/i), {
      target: { value: 'Chúc các thầy cô trường TH&THCS Hiệp Thạnh một mùa 20/11 thật ý nghĩa!' },
    });

    const submitBtn = screen.getByRole('button', { name: /Gửi lời chúc 20\/11/i });
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    expect(submitSpy).toHaveBeenCalledTimes(1);
    expect(submitBtn).toBeDisabled();

    resolveSubmit({
      id: 'wish-1',
      senderName: 'Đỗ Hoàng Phúc',
      className: '9A3',
      message: 'Chúc các thầy cô trường TH&THCS Hiệp Thạnh một mùa 20/11 thật ý nghĩa!',
      createdAt: new Date().toISOString(),
    });

    expect(await screen.findByText(/Đã gửi lời chúc thành công/i)).toBeInTheDocument();
  });
});

