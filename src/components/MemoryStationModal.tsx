import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Heart, Sparkles, X } from 'lucide-react';
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

export interface MemoryStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MemoryStationData;
  isOwner?: boolean;
  onUpdateSlot?: (slotId: MemorySlotId, payload: UpdateMemoryPayload) => Promise<void>;
  onUpdateMeta?: (payload: UpdateStationMetaPayload) => Promise<void>;
}

export const MemoryStationModal: React.FC<MemoryStationModalProps> = ({
  isOpen,
  onClose,
  data,
  isOwner = false,
  onUpdateSlot,
  onUpdateMeta,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [editModalMode, setEditModalMode] = useState<'slot' | 'meta' | null>(null);
  const [targetSlotItem, setTargetSlotItem] = useState<MemoryItem | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selectedMemory && !editModalMode) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, selectedMemory, editModalMode]);

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/80 p-2 sm:p-4 md:p-6 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Trạm ký ức - Cửa sổ album ảnh Chi đội 9A3"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative my-auto flex max-h-[94vh] w-full max-w-5xl flex-col overflow-y-auto rounded-[2rem] sm:rounded-[2.8rem] border-2 sm:border-[3px] border-rose-200/90 bg-gradient-to-br from-[#FFF5F7] via-[#FFFAF9] to-[#FFE8ED] p-4 sm:p-7 md:p-9 shadow-[0_20px_60px_rgba(244,63,94,0.2)]"
        >
          {/* Nền hạt li ti & tia sáng hồng mờ */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 10% 20%, rgba(251, 113, 133, 0.15) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(244, 63, 94, 0.12) 0%, transparent 25%)',
            }}
          />

          {/* Họa tiết nét vẽ mỏng ở góc trên phải: Nơ ruy băng vẽ tay */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 80"
            className="pointer-events-none absolute right-12 sm:right-16 top-3 sm:top-5 h-12 w-16 sm:h-16 sm:w-20 text-rose-300/80 stroke-current fill-none stroke-[2.2]"
          >
            <path d="M50 35 C40 10, 15 15, 25 35 C32 45, 48 37, 50 35 Z" />
            <path d="M50 35 C60 10, 85 15, 75 35 C68 45, 52 37, 50 35 Z" />
            <circle cx="50" cy="35" r="4.5" fill="currentColor" />
            <path d="M48 38 C42 55, 30 65, 22 72" />
            <path d="M52 38 C58 55, 70 65, 78 72" />
          </svg>

          {/* Nút đóng Modal độc lập */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng Trạm Ký Ức"
            className="absolute top-3.5 right-3.5 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-rose-300 bg-white/95 text-rose-700 shadow-md transition hover:bg-rose-500 hover:text-white hover:scale-105"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header Bưu Thiếp: Tiêu đề nghệ thuật & nút quản trị Owner */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center pr-8 pl-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-white/80 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-rose-700 shadow-xs backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
              <span>{data.subtitle || 'Khoảnh khắc đong đầy yêu thương'}</span>
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-2">
              <h2 className="font-serif text-2.5xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-rose-900 drop-shadow-[0_2px_4px_rgba(244,63,94,0.15)]">
                {data.title || 'Trạm ký ức'}
              </h2>

              {isOwner && onUpdateMeta && (
                <button
                  type="button"
                  onClick={handleOpenMetaEdit}
                  aria-label="Chỉnh sửa tiêu đề và trích dẫn"
                  title="Chỉnh sửa tiêu đề & trích dẫn (Chủ sở hữu)"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-300 bg-white/95 text-rose-600 shadow-xs transition hover:bg-rose-500 hover:text-white"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dải nơ hoa nhỏ thanh mảnh dưới tiêu đề */}
            <div className="mt-1 flex items-center justify-center gap-2 text-rose-400">
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-rose-300" />
              <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-rose-300" />
            </div>
          </div>

          {/* Lưới ảnh Trạm Ký Ức lấp đầy mọi vị trí */}
          <div className="relative z-10 my-3 sm:my-5 w-full">
            <HeartCollageGrid
              memories={data.memories}
              isOwner={isOwner}
              onSelectMemory={(item) => setSelectedMemory(item)}
              onUploadSlot={isOwner ? handleOpenSlotEdit : undefined}
            />
          </div>

          {/* Chân Bưu Thiếp: Đoạn trích dẫn góc dưới bên trái */}
          <div className="relative z-10 mt-auto flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 border-t border-rose-200/60 pt-3 sm:pt-4 text-center sm:text-left">
            <div className="max-w-md">
              <p className="font-serif text-xs sm:text-sm font-semibold italic text-rose-800/90 leading-relaxed">
                “{data.quote || 'Nơi lưu trữ tình yêu thương, sự đồng hành.'}”
              </p>
            </div>

            {data.authorNote && (
              <div className="text-[11px] sm:text-xs font-bold text-rose-600/80">
                <span>{data.authorNote}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modal Lightbox Phóng To Ảnh */}
        <MemoryLightboxModal
          item={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />

        {/* Modal Quản Trị Dành Cho Owner */}
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
      </div>
    </AnimatePresence>
  );
};
