import React, { useCallback, useEffect, useState } from 'react';
import {
  BookHeart,
  RefreshCw,
  AlertTriangle,
  MessageSquareHeart,
  Send,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { WishItem } from '../types/wishes';
import { fetchWishes } from '../utils/wishesClient';

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

  const loadWishes = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const data = await fetchWishes();
      setWishes(data);
      setStatus('loaded');
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Không thể tải danh sách lời chúc lúc này.'
      );
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadWishes();
  }, [loadWishes, refreshTrigger]);

  return (
    <div className="space-y-5">
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
            Vui lòng chờ trong giây lát để đồng bộ lời chúc mới nhất từ máy chủ.
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

      {/* Trạng thái 4: Hiển thị danh sách lời chúc dưới dạng văn bản thuần */}
      {status === 'loaded' && wishes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {wishes.map((wish) => (
            <article
              key={wish.id}
              className="flex flex-col justify-between rounded-3xl border-2 border-amber-300/90 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/40 p-5 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                  <div>
                    <h4 className="font-display text-base sm:text-lg font-extrabold text-stone-900">
                      {wish.senderName}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400 bg-amber-100 px-3 py-0.5 text-xs font-extrabold text-amber-950">
                    <GraduationCap className="h-3.5 w-3.5 text-poster-orange" />
                    <span>Lớp {wish.className}</span>
                  </span>
                </div>

                {/* Nội dung lời chúc hiển thị dưới dạng văn bản thuần (JSX text node) */}
                <p className="mt-3.5 whitespace-pre-line font-serif text-sm sm:text-base leading-relaxed text-stone-800">
                  {wish.message}
                </p>
              </div>

              {wish.createdAt && (
                <div className="mt-4 flex items-center justify-end gap-1 pt-2 text-[11px] font-medium text-stone-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatWishTime(wish.createdAt)}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

