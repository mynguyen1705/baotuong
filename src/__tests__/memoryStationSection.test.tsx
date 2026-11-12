import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryStationSection } from '../components/MemoryStationSection';
import { DEFAULT_MEMORIES_DATA } from '../data/defaultMemories';

describe('MemoryStationSection Component Tests', () => {
  it('hiển thị đầy đủ tiêu đề "Trạm ký ức", trích dẫn góc trái và 12 khung ảnh', () => {
    render(
      <MemoryStationSection
        data={DEFAULT_MEMORIES_DATA}
        isOwner={false}
        onUpdateSlot={async () => {}}
        onUpdateMeta={async () => {}}
      />
    );

    expect(screen.getByText(/Trạm ký ức/i)).toBeInTheDocument();
    expect(screen.getByText(/Nơi lưu trữ tình yêu thương/i)).toBeInTheDocument();
    expect(screen.getAllByTestId(/^heart-photo-slot-/).length).toBe(12);
  });

  it('mở Lightbox phóng to ảnh khi nhấp vào một khung ảnh', () => {
    render(
      <MemoryStationSection
        data={DEFAULT_MEMORIES_DATA}
        isOwner={false}
        onUpdateSlot={async () => {}}
        onUpdateMeta={async () => {}}
      />
    );

    const slot4 = screen.getByTestId('heart-photo-slot-4');
    fireEvent.click(slot4);

    expect(screen.getByRole('dialog', { name: /Ảnh kỷ niệm/i })).toBeInTheDocument();
    expect(screen.getByText(/Khoảnh khắc #4/i)).toBeInTheDocument();
    expect(screen.getByText(/20\/11\/2026/i)).toBeInTheDocument();

    // Đóng Lightbox
    const closeBtn = screen.getByRole('button', { name: /Đóng/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog', { name: /Ảnh kỷ niệm/i })).not.toBeInTheDocument();
  });

  it('ẩn các nút quản trị đối với Guest và hiển thị nút quản trị đối với Owner', () => {
    const { rerender } = render(
      <MemoryStationSection
        data={DEFAULT_MEMORIES_DATA}
        isOwner={false}
        onUpdateSlot={async () => {}}
        onUpdateMeta={async () => {}}
      />
    );

    expect(screen.queryByRole('button', { name: /Chỉnh sửa tiêu đề/i })).not.toBeInTheDocument();

    rerender(
      <MemoryStationSection
        data={DEFAULT_MEMORIES_DATA}
        isOwner={true}
        onUpdateSlot={async () => {}}
        onUpdateMeta={async () => {}}
      />
    );

    expect(screen.getByRole('button', { name: /Chỉnh sửa tiêu đề & trích dẫn/i })).toBeInTheDocument();
  });
});

