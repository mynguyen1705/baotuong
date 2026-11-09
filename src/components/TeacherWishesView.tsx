import React, { useCallback, useEffect, useState } from 'react';
import {
  BookHeart,
  RefreshCw,
  AlertTriangle,
  MessageSquareHeart,
  Send,
  Clock,
  GraduationCap,
  Edit3,
  Trash2,
  User,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { WishItem } from '../types/wishes';
import { fetchWishes, updateWish, deleteWish, isMyWish } from '../utils/wishesClient';
import { validateWishInput } from '../utils/validateWish';

export interface TeacherWishesViewProps {
  onSwitchToSubmit?: () => void;
  refreshTrigger?: number;
}

function formatWishTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export const TeacherWishesView: React.FC<TeacherWishesViewProps> = ({
  onSwitchToSubmit,
  refreshTrigger = 0,
}) => {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trạng thái Chỉnh sửa lời chúc
  const [editingWish, setEditingWish] = useState<WishItem | null>(null);
  const [editSenderName, setEditSenderName] = useState('');
  const [editClassName, setEditClassName] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [editErrors, setEditErrors] = useState<{ senderName?: string; className?: string; message?: string }>({});
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Trạng thái Xác nhận xóa lời chúc
  const [deletingWish, setDeletingWish] = useState<WishItem | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Thông báo hành động thành công / lỗi
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadWishes = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const data = await fetchWishes();
      setWishes(data);
      setStatus('loaded');
    } catch (err: unknown) {
      let msg = 'Không thể tải danh sách lời chúc lúc này.';
      if (typeof err === 'string') {
        msg = err;
      } else if (err instanceof Error && err.message) {
        msg = err.message;
      }
      if (!msg || msg === '[object Object]' || msg.includes('[object Object]')) {
        msg = 'Không thể kết nối đến máy chủ lời chúc lúc này. Vui lòng bấm Thử lại để tải lại.';
      }
      setErrorMessage(msg);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadWishes();
  }, [loadWishes, refreshTrigger]);

  // Tự ẩn thông báo phản hồi sau 4 giây
  useEffect(() => {
    if (!actionFeedback) return;
    const timer = setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [actionFeedback]);

  // Mở modal chỉnh sửa
  const handleOpenEdit = (wish: WishItem) => {
    setEditingWish(wish);
    setEditSenderName(wish.senderName);
    setEditClassName(wish.className);
    setEditMessage(wish.message);
    setEditErrors({});
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWish || isSubmittingEdit) return;

    const validation = validateWishInput({
      senderName: editSenderName,
      className: editClassName,
      message: editMessage,
    });

    if (!validation.valid) {
      setEditErrors(validation.fieldErrors);
      return;
    }

    setEditErrors({});
    setIsSubmittingEdit(true);

    try {
      const updated = await updateWish(editingWish.id, validation.cleaned);
      setWishes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditingWish(null);
      setActionFeedback({
        type: 'success',
        text: 'Đã cập nhật lời chúc của bạn thành công!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi khi cập nhật lời chúc.';
      setEditErrors({ message: msg });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!deletingWish || isSubmittingDelete) return;

    setIsSubmittingDelete(true);
    try {
      await deleteWish(deletingWish.id);
      setWishes((prev) => prev.filter((item) => item.id !== deletingWish.id));
      setActionFeedback({
        type: 'success',
        text: 'Đã xóa lời chúc của bạn.',
      });
      setDeletingWish(null);
    } catch {
      setActionFeedback({
        type: 'error',
        text: 'Không thể xóa lời chúc lúc này. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Banner thông báo hành động */}
      {actionFeedback && (
        <div
          role="status"
          className={`flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold shadow-sm transition ${
            actionFeedback.type === 'success'
              ? 'border-2 border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-2 border-red-300 bg-red-50 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span>{actionFeedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="rounded p-1 hover:bg-black/5"
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Thanh tiêu đề & làm mới */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-amber-300 bg-white/95 p-5 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold text-red-900">
            <BookHeart className="h-3.5 w-3.5 text-red-700" />
            Trang Xem Lời Chúc Dành Cho Thầy Cô • 20/11
          </span>
          <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold text-stone-900">
            Sổ Tay Lời Chúc & Tri Ân Thầy Cô ({status === 'loaded' ? wishes.length : '...'})
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-600">
            Nơi lưu giữ tập trung những lời chúc 20/11 từ học sinh gửi tới quý thầy cô Trường TH&THCS Hiệp Thạnh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadWishes}
            disabled={status === 'loading'}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-950 transition hover:bg-amber-100 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
            <span>Làm mới danh sách</span>
          </button>

          {onSwitchToSubmit && (
            <button
              type="button"
              onClick={onSwitchToSubmit}
              className="inline-flex items-center gap-1.5 rounded-xl bg-poster-orange px-3.5 py-2 text-xs font-extrabold text-white shadow-sm transition hover:brightness-105"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Viết thêm lời chúc</span>
            </button>
          )}
        </div>
      </div>

      {/* Trạng thái 1: Đang tải */}
      {status === 'loading' && (
        <div
          role="status"
          className="flex flex-col items-center justify-center rounded-3xl border-2 border-amber-200 bg-white/90 py-14 px-4 text-center"
        >
          <RefreshCw className="h-8 w-8 animate-spin text-poster-orange" />
          <p className="mt-3 font-display text-base font-extrabold text-stone-800">
            Đang tải sổ tay lời chúc 20/11...
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Vui lòng chờ trong giây lát để đồng bộ lời chúc mới nhất.
          </p>
        </div>
      )}

      {/* Trạng thái 2: Lỗi tải dữ liệu */}
      {status === 'error' && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-3xl border-2 border-red-300 bg-red-50/95 py-12 px-4 text-center"
        >
          <AlertTriangle className="h-9 w-9 text-red-600" />
          <p className="mt-3 font-display text-lg font-extrabold text-red-950">
            Không thể tải danh sách lời chúc
          </p>
          <p className="mt-1 max-w-md text-xs sm:text-sm text-red-800">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={loadWishes}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-700 px-5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-sm transition hover:bg-red-800"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* Trạng thái 3: Chưa có lời chúc */}
      {status === 'loaded' && wishes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-amber-300 bg-white/90 py-14 px-4 text-center">
          <MessageSquareHeart className="h-10 w-10 text-amber-500" />
          <p className="mt-3 font-display text-lg font-extrabold text-stone-800">
            Chưa có lời chúc nào được gửi
          </p>
          <p className="mt-1 max-w-md text-xs sm:text-sm text-stone-600">
            Hãy là học sinh đầu tiên gửi lời chúc 20/11 ấm áp tới các thầy cô giáo Trường TH&THCS Hiệp Thạnh!
          </p>
          {onSwitchToSubmit && (
            <button
              type="button"
              onClick={onSwitchToSubmit}
              className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-sky-500 bg-gradient-to-b from-orange-400 to-poster-orange px-5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-sm transition hover:brightness-105"
            >
              <Send className="h-4 w-4" />
              <span>Gửi lời chúc đầu tiên</span>
            </button>
          )}
        </div>
      )}

      {/* Trạng thái 4: Hiển thị danh sách lời chúc */}
      {status === 'loaded' && wishes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {wishes.map((wish) => {
            const canManage = isMyWish(wish.id);

            return (
              <article
                key={wish.id}
                className={`flex flex-col justify-between rounded-3xl border-2 p-5 shadow-sm transition hover:shadow-md ${
                  canManage
                    ? 'border-amber-400 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 ring-1 ring-amber-300/60'
                    : 'border-amber-300/90 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/40'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base sm:text-lg font-extrabold text-stone-900">
                        {wish.senderName}
                      </h4>
                      {canManage && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900">
                          <User className="h-3 w-3 text-emerald-700" />
                          Của bạn
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400 bg-amber-100 px-3 py-0.5 text-xs font-extrabold text-amber-950">
                      <GraduationCap className="h-3.5 w-3.5 text-poster-orange" />
                      <span>Lớp {wish.className}</span>
                    </span>
                  </div>

                  {/* Nội dung lời chúc */}
                  <p className="mt-3.5 whitespace-pre-line font-serif text-sm sm:text-base leading-relaxed text-stone-800">
                    {wish.message}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-amber-100 pt-3">
                  {/* Quyền chỉnh sửa và xóa của chính học sinh/khách */}
                  {canManage ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(wish)}
                        aria-label={`Chỉnh sửa lời chúc của ${wish.senderName}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 transition hover:bg-amber-200/80"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-amber-800" />
                        <span>Sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingWish(wish)}
                        aria-label={`Xóa lời chúc của ${wish.senderName}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}

                  {wish.createdAt && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 ml-auto">
                      <Clock className="h-3 w-3" />
                      <span>{formatWishTime(wish.createdAt)}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal Chỉnh Sửa Lời Chúc */}
      {editingWish && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-wish-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-3xl border-2 border-amber-400 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-poster-orange" />
                <h3 id="edit-wish-title" className="font-display text-lg font-extrabold text-stone-900">
                  Chỉnh Sửa Lời Chúc Của Bạn
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingWish(null)}
                className="rounded-full p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                aria-label="Đóng cửa sổ"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-senderName" className="block text-xs font-bold text-stone-700">
                    Tên người gửi <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="edit-senderName"
                    type="text"
                    value={editSenderName}
                    onChange={(e) => setEditSenderName(e.target.value)}
                    maxLength={60}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-poster-orange focus:outline-none focus:ring-1 focus:ring-poster-orange"
                  />
                  {editErrors.senderName && (
                    <p className="mt-1 text-xs text-red-600">{editErrors.senderName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="edit-className" className="block text-xs font-bold text-stone-700">
                    Lớp <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="edit-className"
                    type="text"
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    maxLength={20}
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-poster-orange focus:outline-none focus:ring-1 focus:ring-poster-orange"
                  />
                  {editErrors.className && (
                    <p className="mt-1 text-xs text-red-600">{editErrors.className}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="edit-message" className="block text-xs font-bold text-stone-700">
                  Nội dung lời chúc <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="edit-message"
                  rows={4}
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  maxLength={1000}
                  className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-sm focus:border-poster-orange focus:outline-none focus:ring-1 focus:ring-poster-orange"
                />
                {editErrors.message && (
                  <p className="mt-1 text-xs text-red-600">{editErrors.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingWish(null)}
                  disabled={isSubmittingEdit}
                  className="rounded-xl border border-stone-300 px-4 py-2 text-xs sm:text-sm font-bold text-stone-700 hover:bg-stone-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-poster-orange px-5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60"
                >
                  {isSubmittingEdit ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu thay đổi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Lời Chúc */}
      {deletingWish && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-wish-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border-2 border-red-300 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="rounded-full bg-red-100 p-2.5">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 id="delete-wish-title" className="font-display text-lg font-extrabold text-stone-900">
                  Xác nhận xóa lời chúc
                </h3>
                <p className="text-xs text-stone-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              Bạn có chắc chắn muốn xóa lời chúc của{' '}
              <strong className="text-stone-900">"{deletingWish.senderName}"</strong> (Lớp {deletingWish.className}) không?
            </p>

            <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs italic text-stone-600 line-clamp-3">
              "{deletingWish.message}"
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingWish(null)}
                disabled={isSubmittingDelete}
                className="rounded-xl border border-stone-300 px-4 py-2 text-xs sm:text-sm font-bold text-stone-700 hover:bg-stone-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmittingDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
              >
                {isSubmittingDelete ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xóa lời chúc</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
