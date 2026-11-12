import React, { useState } from 'react';
import { Edit3, Heart, Sparkles } from 'lucide-react';
import {
  MemoryItem,
  MemorySlotId,
  MemoryStationData,
  UpdateMemoryPayload,
  UpdateStationMetaPayload,
} from '../types/memories';
import { HeartCollageGrid } from './HeartCollageGrid';
import { MemoryLightboxModal } from './MemoryLightboxModal';
import { MemoryEditModal } from './MemoryEditModal';

export interface MemoryStationSectionProps {
  data: MemoryStationData;
  isOwner?: boolean;
  onUpdateSlot?: (slotId: MemorySlotId, payload: UpdateMemoryPayload) => Promise<void>;
  onUpdateMeta?: (payload: UpdateStationMetaPayload) => Promise<void>;
}

export const MemoryStationSection: React.FC<MemoryStationSectionProps> = ({
  data,
  isOwner = false,
  onUpdateSlot,
  onUpdateMeta,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [editModalMode, setEditModalMode] = useState<'slot' | 'meta' | null>(null);
  const [targetSlotItem, setTargetSlotItem] = useState<MemoryItem | null>(null);

  const handleOpenSlotEdit = (slotId: MemorySlotId) => {
    const item = data.memories.find((m) => m.id === slotId) || null;
    setTargetSlotItem(item);
    setEditModalMode('slot');
  };

  const handleOpenMetaEdit = () => {
    setEditModalMode('meta');
  };

  const handleCloseEditModal = () => {
    setEditModalMode(null);
    setTargetSlotItem(null);
  };

  return (
    <section
      id="tram-ky-uc"
      aria-label="Trạm ký ức - Album ảnh trái tim Chi đội 9A3"
      className="relative mx-auto w-full max-w-5xl px-3 sm:px-6 py-8 sm:py-12"
    >
      {/* Tấm Bưu Thiếp / Trang Nhật Ký Trắng Hồng Pastel */}
      <div className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[3rem] border-2 sm:border-[3px] border-rose-200/90 bg-gradient-to-br from-[#FFF5F7] via-[#FFFAF9] to-[#FFE8ED] p-4 sm:p-8 md:p-10 shadow-[0_16px_40px_rgba(244,63,94,0.12)]">
        {/* Nền hạt li ti & tia sáng hồng mờ */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(251, 113, 133, 0.15) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(244, 63, 94, 0.12) 0%, transparent 25%)',
          }}
        />

        {/* Họa tiết nét vẽ mỏng ở các góc: Nơ ruy băng vẽ tay ở góc trên phải */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 80"
          className="pointer-events-none absolute right-3 sm:right-6 top-3 sm:top-5 h-12 w-16 sm:h-16 sm:w-20 text-rose-300/80 stroke-current fill-none stroke-[2.2]"
        >
          {/* Nơ ruy băng mềm mại */}
          <path d="M50,35 C42,22 25,18 20,28 C15,38 35,46 48,38" />
          <path d="M50,35 C58,22 75,18 80,28 C85,38 65,46 52,38" />
          <circle cx="50" cy="35" r="4.5" fill="#fda4af" stroke="#fb7185" />
          <path d="M48,40 C44,52 38,68 32,74" strokeDasharray="2 2" />
          <path d="M52,40 C56,52 62,68 68,74" strokeDasharray="2 2" />
        </svg>

        {/* Họa tiết hoa lá & trái tim tối giản ở góc trên trái */}
        <svg
          aria-hidden="true"
          viewBox="0 0 80 80"
          className="pointer-events-none absolute left-3 sm:left-6 top-3 sm:top-5 h-10 w-10 sm:h-14 sm:w-14 text-rose-300/75 stroke-current fill-none stroke-[2]"
        >
          <path d="M15,65 Q30,40 50,25" />
          <path d="M30,40 Q40,32 45,42 Q35,48 30,40 Z" fill="#ffe4e6" />
          <path d="M42,32 Q52,22 58,30 Q48,38 42,32 Z" fill="#ffe4e6" />
          <path
            d="M58,18 C58,18 52,12 47,15 C42,18 45,26 58,34 C71,26 74,18 69,15 C64,12 58,18 58,18 Z"
            fill="#f43f5e"
            fillOpacity="0.25"
            stroke="#fb7185"
            strokeWidth="1.5"
          />
        </svg>

        {/* ========================================================
            TIÊU ĐỀ TRÊN ĐỈNH TRÁI TIM: "Trạm ký ức"
           ======================================================== */}
        <div className="relative z-10 text-center pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2">
            <span className="text-rose-400">✧</span>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-rose-950">
              {data.title || 'Trạm ký ức'}
            </h2>
            <span className="text-rose-400">✧</span>
          </div>

          {/* Họa tiết gạch chân lượn sóng nhỏ tinh tế bên dưới */}
          <div className="mt-1 flex items-center justify-center gap-1.5 text-rose-300">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-rose-300" />
            <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-rose-300" />
          </div>

          {data.subtitle && (
            <p className="mt-1 text-xs sm:text-sm font-medium text-rose-800/80">
              {data.subtitle}
            </p>
          )}

          {/* Nút chỉnh sửa tiêu đề dành riêng cho Owner */}
          {isOwner && onUpdateMeta && (
            <div className="mt-2">
              <button
                type="button"
                onClick={handleOpenMetaEdit}
                aria-label="Chỉnh sửa tiêu đề & trích dẫn"
                className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-white/90 px-3 py-1 text-xs font-bold text-rose-700 shadow-xs transition hover:bg-rose-50"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Chỉnh sửa tiêu đề & trích dẫn</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================
            KHUNG ẢNH TRUNG TÂM (HEART PHOTO COLLAGE - 11 ẢNH)
           ======================================================== */}
        <div className="relative z-10 mt-4 sm:mt-6">
          <HeartCollageGrid
            memories={data.memories}
            isOwner={isOwner}
            onSelectMemory={(item) => setSelectedMemory(item)}
            onUploadSlot={handleOpenSlotEdit}
          />
        </div>

        {/* ========================================================
            GÓC DƯỚI BÊN TRÁI: ĐOẠN TRÍCH DẪN NGẮN VÀ CHÚ THÍCH
           ======================================================== */}
        <div className="relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-t border-rose-200/60 pt-4 px-2">
          {/* Trích dẫn góc dưới bên trái */}
          <div className="max-w-md">
            <p className="font-serif text-sm sm:text-base font-semibold italic text-rose-950 leading-relaxed">
              “{data.quote || 'Nơi lưu trữ tình yêu thương, sự đồng hành.'}”
            </p>
            {data.authorNote && (
              <p className="mt-1 text-xs font-bold text-rose-700/80">
                — {data.authorNote}
              </p>
            )}
          </div>

          {/* Gợi ý tương tác góc phải */}
          <div className="flex items-center gap-1.5 text-xs text-rose-600/80 self-end">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span>Nhấp vào từng ảnh để phóng to và xem kỷ niệm</span>
          </div>
        </div>
      </div>

      {/* Modal Lightbox Phóng To Ảnh */}
      <MemoryLightboxModal
        item={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />

      {/* Modal Chỉnh Sửa Dành Cho Owner */}
      {isOwner && onUpdateSlot && onUpdateMeta && (
        <MemoryEditModal
          isOpen={editModalMode !== null}
          mode={editModalMode ?? 'slot'}
          slotItem={targetSlotItem}
          currentTitle={data.title}
          currentQuote={data.quote}
          onClose={handleCloseEditModal}
          onSaveSlot={onUpdateSlot}
          onSaveMeta={onUpdateMeta}
        />
      )}
    </section>
  );
};
