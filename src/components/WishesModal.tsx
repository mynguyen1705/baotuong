import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Send, BookHeart, Sparkles } from 'lucide-react';
import { WishesModalMode } from '../types/wishes';
import { WishSubmissionForm } from './WishSubmissionForm';
import { TeacherWishesView } from './TeacherWishesView';

export interface WishesModalProps {
  isOpen: boolean;
  mode: WishesModalMode;
  onModeChange: (mode: WishesModalMode) => void;
  onClose: () => void;
  defaultClassName?: string;
}

export const WishesModal: React.FC<WishesModalProps> = ({
  isOpen,
  mode,
  onModeChange,
  onClose,
  defaultClassName = '9A3',
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 p-2 sm:p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={
              mode === 'view'
                ? 'Trang xem lời chúc 20/11 dành cho thầy cô'
                : 'Biểu mẫu gửi lời chúc 20/11 dành cho học sinh'
            }
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border-2 border-amber-300 bg-paper-50 p-4 sm:p-6 shadow-2xl"
          >
            {/* Header + Nút chuyển tab Gửi lời chúc / Xem lời chúc */}
            <div className="flex flex-col gap-3 border-b border-amber-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-900">
                  <Sparkles className="h-3.5 w-3.5 text-poster-orange" />
                  Tri ân Thầy Cô • 20/11 • Chi đội 9A3 – TH&THCS Hiệp Thạnh
                </span>
                <h2 className="mt-1 font-display text-xl sm:text-2xl font-extrabold text-stone-900">
                  Sổ Tay Lời Chúc Ngày Nhà Giáo Việt Nam 20/11
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng cửa sổ lời chúc 20/11"
                className="self-end sm:self-auto rounded-full border border-stone-300 bg-white p-2 text-stone-700 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Thanh chuyển đổi giữa Gửi Lời Chúc và Trang Xem Lời Chúc Của Thầy Cô */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onModeChange('submit')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-extrabold transition ${mode === 'submit'
                  ? 'bg-gradient-to-b from-orange-400 to-poster-orange text-white shadow-sm'
                  : 'border border-amber-300 bg-white text-stone-700 hover:bg-amber-50'
                  }`}
              >
                <Send className="h-4 w-4" />
                <span>Gửi Lời Chúc 20/11 </span>
              </button>

              <button
                type="button"
                onClick={() => onModeChange('view')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-extrabold transition ${mode === 'view'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'border border-amber-300 bg-white text-stone-700 hover:bg-amber-50'
                  }`}
              >
                <BookHeart className="h-4 w-4" />
                <span>Xem Lời Chúc </span>
              </button>
            </div>

            {/* Nội dung chính theo tab */}
            <div className="mt-5">
              {mode === 'submit' ? (
                <WishSubmissionForm
                  defaultClassName={defaultClassName}
                  onWishCreated={() => {
                    setRefreshTrigger((prev) => prev + 1);
                  }}
                  onSwitchToView={() => onModeChange('view')}
                />
              ) : (
                <TeacherWishesView
                  refreshTrigger={refreshTrigger}
                  onSwitchToSubmit={() => onModeChange('submit')}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

