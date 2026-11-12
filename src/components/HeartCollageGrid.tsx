import React from 'react';
import { Camera, ZoomIn } from 'lucide-react';
import { MemoryItem, MemorySlotId } from '../types/memories';

export interface HeartCollageGridProps {
  memories: MemoryItem[];
  isOwner?: boolean;
  onSelectMemory: (item: MemoryItem) => void;
  onUploadSlot?: (slotId: MemorySlotId) => void;
}

export const HeartCollageGrid: React.FC<HeartCollageGridProps> = ({
  memories,
  isOwner = false,
  onSelectMemory,
  onUploadSlot,
}) => {
  const renderSlot = (item: MemoryItem) => {
    const isCenter = Boolean(item.isCenterpiece);

    return (
      <div
        key={item.id}
        data-testid={`heart-photo-slot-${item.id}`}
        data-centerpiece={isCenter ? 'true' : undefined}
        onClick={() => onSelectMemory(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectMemory(item);
          }
        }}
        aria-label={`Xem ảnh kỷ niệm ô số ${item.id}`}
        className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-[3px] border-white/95 bg-rose-50 shadow-[0_4px_16px_rgba(244,63,94,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(244,63,94,0.22)] aspect-[4/3] w-full"
      >
        {/* Ảnh kỷ niệm hiển thị cover sắc nét */}
        <img
          src={item.photoUrl}
          alt={item.caption || `Kỷ niệm 9A3 #${item.id}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Lớp phủ hover với icon kính lúp phóng to */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-rose-950/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-md backdrop-blur-xs">
            <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
        </div>

        {/* Nút upload dành riêng cho Owner */}
        {isOwner && onUploadSlot && (
          <button
            type="button"
            aria-label={`Thay đổi ảnh ô #${item.id}`}
            title="Đổi ảnh hoặc lời nhắn cho ô này (Owner)"
            onClick={(e) => {
              e.stopPropagation();
              onUploadSlot(item.id);
            }}
            className="absolute top-1.5 right-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-rose-300 bg-white/95 text-rose-600 shadow-sm transition-all hover:bg-rose-500 hover:text-white z-10"
          >
            <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      aria-label="Lưới ảnh Trạm Ký Ức 9A3"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-4xl mx-auto py-2 select-none"
    >
      {memories.map((item) => renderSlot(item))}
    </div>
  );
};
