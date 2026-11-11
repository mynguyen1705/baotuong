import React, { useState } from 'react';
import { Film, Music2, MapPin, PlayCircle, ExternalLink } from 'lucide-react';
import { MvData } from '../types/baotuong';

export interface MvVideoShowcaseProps {
  mvData: MvData;
  posterImageUrl?: string;
}

/**
 * Tự động phân tích và chuyển đổi mọi định dạng link YouTube (youtu.be, watch?v=, shorts/, embed)
 * sang định dạng chuẩn embed/ có thể phát được trong thẻ <iframe> trên trình duyệt.
 */
function parseYouTubeUrls(rawUrl?: string): { embedUrl: string; watchUrl: string } {
  if (!rawUrl) return { embedUrl: '', watchUrl: '' };
  const trimmed = rawUrl.trim();

  // Dạng 1: youtu.be/<id>
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) {
    const id = shortMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  // Dạng 2: youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    const id = watchMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  // Dạng 3: youtube.com/shorts/<id>
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    const id = shortsMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  // Dạng 4: youtube.com/embed/<id>
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch && embedMatch[1]) {
    const id = embedMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  return { embedUrl: trimmed, watchUrl: trimmed };
}

export const MvVideoShowcase: React.FC<MvVideoShowcaseProps> = ({
  mvData,
}) => {
  const [videoSourceMode, setVideoSourceMode] = useState<'local' | 'youtube'>('local');
  const [localVideoError, setLocalVideoError] = useState(false);

  const { embedUrl, watchUrl } = parseYouTubeUrls(mvData.youtubeEmbedUrl);

  return (
    <div className="space-y-6">
      {/* Thông tin bài hát Người gieo mầm xanh - Hứa Kim Tuyền & Hoàng Dũng */}
      <div className="rounded-3xl border-2 border-sky-300 bg-gradient-to-r from-sky-50 via-white to-amber-50 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-700 px-3 py-1 text-xs font-bold uppercase text-white">
              <Music2 className="h-3.5 w-3.5" />
              MV Ca Nhạc Số Chủ Đề 20/11
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-stone-900">
              {mvData.songTitle}
            </h3>
            <p className="mt-1 text-sm sm:text-base font-semibold text-stone-700">
              Sáng tác: <strong className="text-poster-orange">{mvData.composer}</strong> • Trình bày:{' '}
              <strong className="text-sky-800">{mvData.artist}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setVideoSourceMode('local')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                videoSourceMode === 'local'
                  ? 'bg-poster-orange text-white shadow-sm'
                  : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
              }`}
            >
              Video MV Lớp 9A3 (.MP4)
            </button>
            {mvData.youtubeEmbedUrl && (
              <button
                type="button"
                onClick={() => setVideoSourceMode('youtube')}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  videoSourceMode === 'youtube'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                }`}
              >
                Xem MV Gốc / YouTube
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs sm:text-sm text-emerald-950">
          <MapPin className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
          <span>{mvData.schoolContextNote}</span>
        </p>
      </div>

      {/* Khung trình phát Video MV 16:9 */}
      <div className="overflow-hidden rounded-3xl border-4 border-stone-900 bg-stone-950 shadow-xl">
        {videoSourceMode === 'local' && !localVideoError ? (
          <video
            controls
            onError={() => setLocalVideoError(true)}
            className="aspect-video w-full object-cover"
          >
            <source src={mvData.videoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video HTML5.
          </video>
        ) : videoSourceMode === 'youtube' && embedUrl ? (
          <div className="relative">
            <iframe
              title={`MV ${mvData.songTitle} - ${mvData.composer} & ${mvData.artist}`}
              src={embedUrl}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {watchUrl && (
              <div className="bg-stone-900 px-4 py-2 text-center border-t border-stone-800">
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Nếu gặp lỗi từ chối kết nối, bấm vào đây để mở xem trực tiếp trên YouTube ↗</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden bg-stone-900 text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="relative z-10 max-w-lg space-y-3">
              <PlayCircle className="mx-auto h-14 w-14 text-amber-400" />
              <h4 className="font-display text-xl sm:text-2xl font-extrabold text-amber-300">
                MV “{mvData.songTitle}” – Chi đội 9A3
              </h4>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                Sáng tác: <strong>{mvData.composer}</strong> • Trình bày: <strong>{mvData.artist}</strong>.
                Để phát tệp video quay trực tiếp tại trường TH&THCS Hiệp Thạnh, bạn hãy đặt file video vào đường dẫn{' '}
                <code className="rounded bg-stone-800 px-2 py-0.5 text-amber-300">
                  public{mvData.videoUrl}
                </code>{' '}
                hoặc bấm nút bên dưới để mở trình phát YouTube:
              </p>
              {embedUrl && (
                <button
                  type="button"
                  onClick={() => setVideoSourceMode('youtube')}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-red-700"
                >
                  <Film className="h-4 w-4" />
                  <span>Phát MV “Người gieo mầm xanh” ngay</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

