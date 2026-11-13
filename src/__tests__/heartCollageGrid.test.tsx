import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeartCollageGrid } from '../components/HeartCollageGrid';
import { DEFAULT_MEMORIES_LIST } from '../data/defaultMemories';
import { MemoryItem } from '../types/memories';

describe('HeartCollageGrid Component Tests', () => {
  it('hiển thị đầy đủ 13 khung ảnh xếp so le mosaic lấp đầy mọi vị trí', () => {
    render(
      <HeartCollageGrid
        memories={DEFAULT_MEMORIES_LIST}
        isOwner={false}
        onSelectMemory={() => {}}
      />
    );

    const frames = screen.getAllByTestId(/^heart-photo-slot-/);
    expect(frames.length).toBe(13);

    expect(screen.getByTestId('heart-photo-slot-1')).toBeInTheDocument();
    expect(screen.getByTestId('heart-photo-slot-2')).toBeInTheDocument();
    expect(screen.getByTestId('heart-photo-slot-4')).toHaveAttribute('data-centerpiece', 'true');
    expect(screen.getByTestId('heart-photo-slot-11')).toBeInTheDocument();
    expect(screen.getByTestId('heart-photo-slot-12')).toBeInTheDocument();
    expect(screen.getByTestId('heart-photo-slot-13')).toBeInTheDocument();
  });

  it('gọi callback onSelectMemory khi người dùng click vào bất kỳ khung ảnh nào để phóng to', () => {
    const handleSelect = vi.fn();
    render(
      <HeartCollageGrid
        memories={DEFAULT_MEMORIES_LIST}
        isOwner={false}
        onSelectMemory={handleSelect}
      />
    );

    const slot4 = screen.getByTestId('heart-photo-slot-4');
    fireEvent.click(slot4);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 4, isCenterpiece: true })
    );
  });

  it('ẩn tuyệt đối các nút chỉnh sửa/upload/xóa đối với người xem (Guest - isOwner = false)', () => {
    render(
      <HeartCollageGrid
        memories={DEFAULT_MEMORIES_LIST}
        isOwner={false}
        onSelectMemory={() => {}}
      />
    );

    expect(screen.queryByTitle(/Tải ảnh mới/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\+ Tải ảnh/i)).not.toBeInTheDocument();
  });

  it('hiển thị nút thao tác và upload đối với Chủ Sở Hữu (Owner - isOwner = true)', () => {
    const handleUpload = vi.fn();
    render(
      <HeartCollageGrid
        memories={DEFAULT_MEMORIES_LIST}
        isOwner={true}
        onSelectMemory={() => {}}
        onUploadSlot={handleUpload}
      />
    );

    const editBtns = screen.getAllByRole('button', { name: /Thay đổi ảnh/i });
    expect(editBtns.length).toBe(13);
  });
});

