import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Heart, Tag, X } from 'lucide-react';
import { MemoryItem } from '../types/memories';

export interface MemoryLightboxModalProps {
  item: MemoryItem | null;
  onClose: () => void;
}

export const MemoryLightboxModal: React.FC<MemoryLightboxModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-3 sm:p-6 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label={`Ảnh kỷ niệm #${item.id}`}
          className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-rose-200/90 bg-white shadow-2xl"
        >
          {/* Nút đóng modal */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75 hover:scale-105"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Vùng hiển thị ảnh phóng to */}
          <div className="relative flex max-h-[65vh] w-full items-center justify-center overflow-hidden bg-rose-50/50">
            <img
              src={item.photoUrl}
              alt={item.caption || `Kỷ niệm #${item.id}`}
              className="max-h-[65vh] w-full object-contain"
            />
          </div>

          {/* Phần thông tin chân ảnh dạng bưu thiếp ấm áp */}
          <div className="border-t border-rose-100 bg-gradient-to-b from-[#FFF7F9] to-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-rose-800">
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-rose-800">
                <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                <span>Khoảnh khắc #{item.id}</span>
                {item.isCenterpiece && <span className="ml-1 text-amber-600 font-extrabold">• Tâm điểm</span>}
              </span>

              {item.date && (
                <span className="inline-flex items-center gap-1 text-stone-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{item.date}</span>
                </span>
              )}
            </div>

            {/* Lời nhắn / Chú thích kỷ niệm */}
            <p className="mt-2.5 font-serif text-sm sm:text-base font-medium leading-relaxed text-stone-800 italic">
              “{item.caption || 'Một khoảnh khắc đong đầy cảm xúc của tập thể Chi đội 9A3.'}”
            </p>

            {item.tag && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-700">
                <Tag className="h-3.5 w-3.5" />
                <span className="rounded-md bg-white border border-rose-200 px-2 py-0.5 font-semibold">
                  {item.tag}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
