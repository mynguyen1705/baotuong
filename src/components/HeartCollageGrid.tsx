import React from 'react';
import { Camera, Plus, ZoomIn } from 'lucide-react';
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
  // Nhóm các khung ảnh theo 5 hàng chuẩn cấu trúc hình trái tim
  const row1 = memories.filter((m) => m.row === 1); // 2 ảnh (đỉnh 2 bên tim)
  const row2 = memories.filter((m) => m.row === 2); // 3 ảnh (có tâm lớn ở giữa)
  const row3 = memories.filter((m) => m.row === 3); // 3 ảnh ngang
  const row4 = memories.filter((m) => m.row === 4); // 2 ảnh
  const row5 = memories.filter((m) => m.row === 5); // 1 ảnh đáy

  const renderSlot = (
    item: MemoryItem,
    sizeClasses: string,
    aspectClass = 'aspect-[4/3]'
  ) => {
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
        aria-label={`Xem ảnh kỷ niệm ô số ${item.id}: ${item.caption || item.tag || 'Khoảnh khắc 9A3'}`}
        className={`group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-[3px] border-white/95 bg-rose-50 shadow-[0_4px_16px_rgba(244,63,94,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(244,63,94,0.24)] ${sizeClasses} ${aspectClass}`}
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

        {/* Tag nhỏ ở góc nếu có */}
        {item.tag && (
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-rose-700 shadow-xs backdrop-blur-xs">
            {item.tag}
          </span>
        )}

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
            className="absolute top-1.5 right-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-rose-300 bg-white/95 text-rose-600 shadow-sm transition-all hover:bg-rose-500 hover:text-white"
          >
            <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      aria-label="Lưới ảnh trái tim Trạm Ký Ức 9A3"
      className="relative mx-auto flex w-full max-w-xl sm:max-w-2xl flex-col items-center gap-1.5 sm:gap-2.5 px-2 py-4 select-none"
    >
      {/* Hàng 1 (2 ảnh): Hai vòm cong trên đỉnh trái tim, thụt vào ở giữa */}
      <div className="flex w-full items-center justify-center gap-6 sm:gap-14">
        {row1[0] && renderSlot(row1[0], 'w-[32%] sm:w-[30%] rotate-[-2deg]')}
        {row1[1] && renderSlot(row1[1], 'w-[32%] sm:w-[30%] rotate-[2deg]')}
      </div>

      {/* Hàng 2 (3 ảnh): Trái, Tâm Trọng Điểm lớn nhất, Phải */}
      <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
        {row2[0] && renderSlot(row2[0], 'w-[25%] sm:w-[26%] rotate-[-1.5deg]', 'aspect-[4/3]')}
        {row2[1] &&
          renderSlot(
            row2[1],
            'w-[42%] sm:w-[40%] z-10 scale-[1.03] shadow-[0_8px_25px_rgba(244,63,94,0.22)]',
            'aspect-[4/3]'
          )}
        {row2[2] && renderSlot(row2[2], 'w-[25%] sm:w-[26%] rotate-[1.5deg]', 'aspect-[4/3]')}
      </div>

      {/* Hàng 3 (3 ảnh): Ba ảnh ngang nhỏ xếp khít nhau */}
      <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
        {row3[0] && renderSlot(row3[0], 'w-[28%] sm:w-[27%]', 'aspect-[16/10]')}
        {row3[1] && renderSlot(row3[1], 'w-[32%] sm:w-[32%]', 'aspect-[16/10]')}
        {row3[2] && renderSlot(row3[2], 'w-[28%] sm:w-[27%]', 'aspect-[16/10]')}
      </div>

      {/* Hàng 4 (2 ảnh): Thu gọn về phía trục giữa */}
      <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
        {row4[0] && renderSlot(row4[0], 'w-[30%] sm:w-[28%] rotate-[-1deg]', 'aspect-[4/3]')}
        {row4[1] && renderSlot(row4[1], 'w-[30%] sm:w-[28%] rotate-[1deg]', 'aspect-[4/3]')}
      </div>

      {/* Hàng 5 (1 ảnh): Chóp nhọn của đáy trái tim */}
      <div className="flex w-full items-center justify-center">
        {row5[0] && renderSlot(row5[0], 'w-[22%] sm:w-[20%]', 'aspect-square')}
      </div>
    </div>
  );
};
