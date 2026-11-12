import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Check, Sparkles, Upload, X } from 'lucide-react';
import { MemoryItem, MemorySlotId, UpdateMemoryPayload, UpdateStationMetaPayload } from '../types/memories';
import { fileToImageDataUrl } from '../utils/imageDataUrl';

export interface MemoryEditModalProps {
  isOpen: boolean;
  mode: 'slot' | 'meta';
  slotItem?: MemoryItem | null;
  currentTitle?: string;
  currentQuote?: string;
  onClose: () => void;
  onSaveSlot: (slotId: MemorySlotId, payload: UpdateMemoryPayload) => Promise<void>;
  onSaveMeta: (payload: UpdateStationMetaPayload) => Promise<void>;
}

export const MemoryEditModal: React.FC<MemoryEditModalProps> = ({
  isOpen,
  mode,
  slotItem,
  currentTitle = 'Trạm ký ức',
  currentQuote = 'Nơi lưu trữ tình yêu thương, sự đồng hành.',
  onClose,
  onSaveSlot,
  onSaveMeta,
}) => {
  const [photoUrl, setPhotoUrl] = useState(slotItem?.photoUrl || '');
  const [caption, setCaption] = useState(slotItem?.caption || '');
  const [date, setDate] = useState(slotItem?.date || '');
  const [tag, setTag] = useState(slotItem?.tag || '');

  const [title, setTitle] = useState(currentTitle);
  const [quote, setQuote] = useState(currentQuote);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setErrorMsg('');
      const dataUrl = await fileToImageDataUrl(file);
      setPhotoUrl(dataUrl);
    } catch {
      setErrorMsg('Không thể đọc file ảnh. Vui lòng thử lại với file JPEG/PNG.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (mode === 'slot' && slotItem) {
        if (!photoUrl.trim()) {
          setErrorMsg('Vui lòng chọn hoặc nhập đường dẫn ảnh.');
          setIsSubmitting(false);
          return;
        }
        await onSaveSlot(slotItem.id, {
          photoUrl: photoUrl.trim(),
          caption: caption.trim(),
          date: date.trim(),
          tag: tag.trim(),
        });
      } else {
        await onSaveMeta({
          title: title.trim(),
          quote: quote.trim(),
        });
      }
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 p-3 sm:p-6 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label={mode === 'slot' ? `Quản lý ảnh ô #${slotItem?.id}` : 'Chỉnh sửa tiêu đề & trích dẫn'}
          className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border-2 border-rose-300 bg-white shadow-2xl"
        >
          {/* Header modal */}
          <div className="flex items-center justify-between border-b border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="font-display text-base font-extrabold text-rose-950">
                {mode === 'slot'
                  ? `Chỉnh sửa ảnh ô #${slotItem?.id} ${slotItem?.isCenterpiece ? '(Tâm điểm)' : ''}`
                  : 'Chỉnh sửa Trạm Ký Ức (Owner)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="rounded-full p-1 text-stone-400 hover:bg-white hover:text-stone-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form nội dung */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                {errorMsg}
              </div>
            )}

            {mode === 'slot' ? (
              <>
                {/* Xem trước ảnh */}
                <div className="relative mx-auto flex h-44 w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/60">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Xem trước" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-xs font-bold text-rose-400">
                      <Camera className="h-8 w-8 mb-1" />
                      <span>Chưa có ảnh</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-md hover:bg-rose-700"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Chọn ảnh từ máy</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Hoặc nhập URL ảnh trực tiếp */}
                <div>
                  <label className="block text-xs font-bold text-stone-700">Đường dẫn ảnh (URL hoặc Data URL)</label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://... hoặc /sections/..."
                    className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>

                {/* Lời nhắn chú thích */}
                <div>
                  <label className="block text-xs font-bold text-stone-700">Lời nhắn / Chú thích kỷ niệm</label>
                  <textarea
                    rows={2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Ghi lại kỷ niệm đáng nhớ của khoảnh khắc này..."
                    className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700">Ngày chụp / Sự kiện</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="20/11/2026"
                      className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700">Nhãn dán (Tag)</label>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="Kỷ niệm, Giờ học..."
                      className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-xs focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-stone-700">Tiêu đề chính</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm font-bold text-rose-950 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700">Đoạn trích dẫn ngắn (Góc dưới trái)</label>
                  <textarea
                    rows={3}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-xs font-serif italic text-stone-800 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 text-xs font-extrabold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                <span>{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
