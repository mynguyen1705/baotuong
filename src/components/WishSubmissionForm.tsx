import React, { useRef, useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, BookHeart } from 'lucide-react';
import { CreateWishInput, WishItem } from '../types/wishes';
import { validateWishInput } from '../utils/validateWish';
import { submitWish } from '../utils/wishesClient';

export interface WishSubmissionFormProps {
  defaultClassName?: string;
  onWishCreated?: (wish: WishItem) => void;
  onSwitchToView?: () => void;
}

export const WishSubmissionForm: React.FC<WishSubmissionFormProps> = ({
  defaultClassName = '9A3',
  onWishCreated,
  onSwitchToView,
}) => {
  const [senderName, setSenderName] = useState('');
  const [className, setClassName] = useState(defaultClassName);
  const [message, setMessage] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateWishInput, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedWish, setLastSubmittedWish] = useState<WishItem | null>(null);

  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) {
      return;
    }

    setSubmitError(null);
    setLastSubmittedWish(null);

    const validation = validateWishInput({ senderName, className, message });
    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors);
      return;
    }

    setFieldErrors({});
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const created = await submitWish(validation.cleaned);
      setLastSubmittedWish(created);
      setSenderName('');
      setMessage('');
      onWishCreated?.(created);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Không thể gửi lời chúc lúc này. Vui lòng kiểm tra kết nối và thử lại.';
      setSubmitError(errorMsg);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-amber-300 bg-white/95 p-5 sm:p-7 shadow-md">
      <div className="border-b border-amber-200 pb-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">
          <Sparkles className="h-3.5 w-3.5 text-poster-orange" />
          Góc Tri Ân 20/11 • Trường TH&THCS Hiệp Thạnh
        </span>
        <h3 className="mt-2 font-display text-xl sm:text-2xl font-extrabold text-stone-900">
          Gửi Lời Chúc 20/11 Tới Thầy Cô
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-stone-600 leading-relaxed">
          Hãy viết những lời chúc chân thành nhất gửi tới thầy cô giáo nhân Ngày Nhà giáo Việt Nam 20/11. Lời chúc của bạn sẽ được lưu vào Sổ Tay Tri Ân để thầy cô mở xem trên mọi thiết bị.
        </p>
      </div>

      {submitError && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-900"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-bold">Gửi lời chúc chưa thành công</p>
            <p className="mt-0.5 text-xs sm:text-sm">{submitError}</p>
            <p className="mt-1 text-xs text-red-700">
              Nội dung bạn đã nhập vẫn được giữ nguyên bên dưới để bạn có thể gửi lại ngay.
            </p>
          </div>
        </div>
      )}

      {lastSubmittedWish && (
        <div
          role="status"
          className="mt-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/90 p-4 text-emerald-950"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-extrabold text-sm sm:text-base">
                Đã gửi lời chúc thành công!
              </p>
              <p className="mt-1 text-xs sm:text-sm text-emerald-900">
                Cảm ơn <strong>{lastSubmittedWish.senderName}</strong> ({lastSubmittedWish.className}) đã gửi lời tri ân tới thầy cô.
              </p>
              {onSwitchToView && (
                <button
                  type="button"
                  onClick={onSwitchToView}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  <BookHeart className="h-4 w-4" />
                  <span>Mở Trang Xem Lời Chúc Của Thầy Cô</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label
              htmlFor="wish-sender-name"
              className="block text-xs sm:text-sm font-bold text-stone-800"
            >
              Tên người gửi <span className="text-red-600">*</span>
            </label>
            <input
              id="wish-sender-name"
              name="senderName"
              type="text"
              maxLength={60}
              disabled={isSubmitting}
              value={senderName}
              onChange={(e) => {
                setSenderName(e.target.value);
                if (fieldErrors.senderName) {
                  setFieldErrors((prev) => ({ ...prev, senderName: undefined }));
                }
              }}
              placeholder="Ví dụ: Nguyễn Minh Anh"
              aria-invalid={Boolean(fieldErrors.senderName)}
              aria-describedby={fieldErrors.senderName ? 'wish-sender-error' : undefined}
              className="mt-1.5 w-full rounded-xl border-2 border-amber-300 bg-amber-50/40 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-poster-orange focus:bg-white focus:outline-none disabled:opacity-60"
            />
            {fieldErrors.senderName && (
              <p id="wish-sender-error" className="mt-1 text-xs font-semibold text-red-600">
                {fieldErrors.senderName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="wish-class-name"
              className="block text-xs sm:text-sm font-bold text-stone-800"
            >
              Lớp <span className="text-red-600">*</span>
            </label>
            <input
              id="wish-class-name"
              name="className"
              type="text"
              maxLength={20}
              disabled={isSubmitting}
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                if (fieldErrors.className) {
                  setFieldErrors((prev) => ({ ...prev, className: undefined }));
                }
              }}
              placeholder="Ví dụ: 9A3"
              aria-invalid={Boolean(fieldErrors.className)}
              aria-describedby={fieldErrors.className ? 'wish-class-error' : undefined}
              className="mt-1.5 w-full rounded-xl border-2 border-amber-300 bg-amber-50/40 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-poster-orange focus:bg-white focus:outline-none disabled:opacity-60"
            />
            {fieldErrors.className && (
              <p id="wish-class-error" className="mt-1 text-xs font-semibold text-red-600">
                {fieldErrors.className}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="wish-message"
              className="block text-xs sm:text-sm font-bold text-stone-800"
            >
              Nội dung lời chúc <span className="text-red-600">*</span>
            </label>
            <span className="text-xs text-stone-500">
              {message.trim().length}/600 ký tự
            </span>
          </div>
          <textarea
            id="wish-message"
            name="message"
            rows={4}
            maxLength={600}
            disabled={isSubmitting}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (fieldErrors.message) {
                setFieldErrors((prev) => ({ ...prev, message: undefined }));
              }
            }}
            placeholder="Nhân ngày Nhà giáo Việt Nam 20/11, em kính chúc thầy cô..."
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? 'wish-message-error' : undefined}
            className="mt-1.5 w-full rounded-2xl border-2 border-amber-300 bg-amber-50/40 px-3.5 py-2.5 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-poster-orange focus:bg-white focus:outline-none disabled:opacity-60"
          />
          {fieldErrors.message && (
            <p id="wish-message-error" className="mt-1 text-xs font-semibold text-red-600">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-stone-500">
            * Lời chúc hiển thị dưới dạng văn bản thuần trong Sổ Tay Tri Ân 20/11.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-sky-500 bg-gradient-to-b from-orange-400 to-poster-orange px-6 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? 'Đang gửi lời chúc...' : 'Gửi lời chúc 20/11'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

