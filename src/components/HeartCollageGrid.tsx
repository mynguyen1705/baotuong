import React from 'react';
import { Camera, ZoomIn } from 'lucide-react';
import { MemoryItem, MemorySlotId } from '../types/memories';

export interface HeartCollageGridProps {
  memories: MemoryItem[];
  isOwner?: boolean;
  onSelectMemory: (item: MemoryItem) => void;
  onUploadSlot?: (slotId: MemorySlotId) => void;
}

export interface CollageSlotLayout {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Bố cục 13 khung ảnh xếp so le (staggered mosaic) theo đúng thiết kế mẫu tham chiếu:
 * - Cột 1 (trái): Ô 1 (nhỏ đỉnh), Ô 2 (vuông lớn nhô ra), Ô 3 (vuông vừa đáy)
 * - Cột 2 (trong trái): Ô 4 (chữ nhật đứng cao), Ô 5 (ngang giữa), Ô 6 (ngang đáy)
 * - Cột 3 (trung tâm phải): Ô 7 (ngang lớn đỉnh), Ô 8 (vuông giữa), Ô 9 (lớn góc dưới)
 * - Cột 4 (phải ngoài): Ô 10 (ngang dài), Ô 11 (nhỏ đỉnh phải), Ô 12 (vừa đáy phải), Ô 13 (mini đáy phải)
 */
const STAGGERED_COLLAGE_SLOTS: CollageSlotLayout[] = [
  // Cột 1 (ngoài cùng bên trái)
  { id: 1, left: 10.82, top: 14.70, width: 10.15, height: 13.12 },
  { id: 2, left: 0.00, top: 31.50, width: 20.97, height: 34.65 },
  { id: 3, left: 6.16, top: 70.08, width: 14.81, height: 21.26 },

  // Cột 2 (bên trái rãnh giữa)
  { id: 4, left: 23.79, top: 10.50, width: 19.80, height: 38.32 },
  { id: 5, left: 23.79, top: 53.02, width: 19.80, height: 18.37 },
  { id: 6, left: 23.79, top: 75.07, width: 19.80, height: 20.73 },

  // Cột 3 (bên phải rãnh giữa)
  { id: 7, left: 46.92, top: 0.00, width: 28.62, height: 27.03 },
  { id: 8, left: 46.92, top: 31.50, width: 15.97, height: 25.98 },
  { id: 9, left: 46.92, top: 61.94, width: 29.28, height: 38.06 },

  // Cột 4 (ngoài cùng bên phải)
  { id: 10, left: 65.72, top: 31.50, width: 34.28, height: 25.98 },
  { id: 11, left: 78.54, top: 10.24, width: 14.81, height: 16.80 },
  { id: 12, left: 79.37, top: 61.94, width: 16.14, height: 18.37 },
  { id: 13, left: 79.37, top: 84.78, width: 10.15, height: 9.71 },
];

export const HeartCollageGrid: React.FC<HeartCollageGridProps> = ({
  memories,
  isOwner = false,
  onSelectMemory,
  onUploadSlot,
}) => {
  return (
    <div
      aria-label="Lưới ảnh Trạm Ký Ức 9A3"
      className="relative mx-auto my-2 w-full max-w-4xl aspect-[601/381] select-none"
    >
      {STAGGERED_COLLAGE_SLOTS.map((slot) => {
        const item =
          memories.find((m) => m.id === slot.id) ||
          memories[slot.id - 1] || {
            id: slot.id,
            photoUrl: `/memories/photo-${slot.id}.jpg`,
            caption: `Khoảnh khắc 9A3 #${slot.id}`,
          };
        const isCenter = Boolean(item.isCenterpiece);

        return (
          <div
            key={slot.id}
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
            style={{
              position: 'absolute',
              left: `${slot.left}%`,
              top: `${slot.top}%`,
              width: `${slot.width}%`,
              height: `${slot.height}%`,
            }}
            className="group cursor-pointer overflow-hidden rounded-md sm:rounded-xl md:rounded-2xl border-1.5 sm:border-2 md:border-[3px] border-white/95 bg-rose-50 shadow-[0_2px_8px_rgba(244,63,94,0.14)] sm:shadow-[0_4px_16px_rgba(244,63,94,0.18)] transition-all duration-300 hover:z-20 hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(244,63,94,0.28)]"
          >
            {/* Ảnh hiển thị cover khớp toàn bộ khung */}
            <img
              src={item.photoUrl}
              alt={item.caption || `Kỷ niệm 9A3 #${item.id}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Lớp phủ hover với icon kính lúp phóng to */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-rose-950/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-md backdrop-blur-xs">
                <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
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
                className="absolute top-1 right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-rose-300 bg-white/95 text-rose-600 shadow-sm transition-all hover:bg-rose-500 hover:text-white z-10"
              >
                <Camera className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
