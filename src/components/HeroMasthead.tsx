import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  LayoutGrid,
  QrCode,
  Volume2,
  VolumeX,
  Award,
  Send,
  BookHeart,
  GraduationCap,
  Camera,
} from 'lucide-react';
import { BaoTuongConfig } from '../types/baotuong';
import { WishesModalMode } from '../types/wishes';
import { TeacherModalMode } from '../types/teachers';
import {
  DreamWingSVG,
  PaperAirplaneSVG,
} from './PosterDecorations';

export interface HeroMastheadProps {
  config: BaoTuongConfig;
  viewMode: 'cards' | 'poster';
  onViewModeChange: (mode: 'cards' | 'poster') => void;
  onOpenQrModal: () => void;
  onOpenWishes?: (mode: WishesModalMode) => void;
  onOpenTeacherBoard?: (mode: TeacherModalMode) => void;
  onOpenMemories?: () => void;
  isBgMusicPlaying?: boolean;
  onToggleBgMusic?: () => void;
}

export const HeroMasthead: React.FC<HeroMastheadProps> = ({
  config,
  viewMode,
  onViewModeChange,
  onOpenQrModal,
  onOpenWishes,
  onOpenTeacherBoard,
  onOpenMemories,
  isBgMusicPlaying = false,
  onToggleBgMusic,
}) => {
  return (
    <header className="relative overflow-hidden pt-4 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl relative z-20">
        {/* Thanh công cụ thông tin & tiện ích thẳng hàng, cân giữa (Trường, Lớp 9A3, Nhạc nền, Mã QR) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-full border-2 border-amber-300/90 bg-white/90 px-3.5 sm:px-5 py-1.5 shadow-sm backdrop-blur-sm w-fit max-w-full text-center"
        >
          {/* Thông tin trường & lớp */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-extrabold text-white shadow-xs">
              <Award className="h-3.5 w-3.5 shrink-0" />
              <span>{config.schoolName}</span>
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs sm:text-sm text-amber-950 border border-amber-300">
              {config.className}
            </span>
          </div>

          <span className="text-stone-300 font-bold hidden sm:inline">•</span>

          {/* Cụm nút tương tác: Nhạc nền & Mã QR */}
          <div className="flex items-center gap-2">
            {onToggleBgMusic && (
              <button
                type="button"
                onClick={onToggleBgMusic}
                aria-label={isBgMusicPlaying ? 'Tắt nhạc nền 20/11' : 'Bật nhạc nền 20/11'}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 sm:px-3.5 py-1 text-xs font-bold transition shadow-xs ${
                  isBgMusicPlaying
                    ? 'border-amber-600 bg-amber-400 text-stone-950 shadow-inner'
                    : 'border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100'
                }`}
              >
                {isBgMusicPlaying ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 animate-pulse text-amber-900" />
                    <span>Tắt nhạc nền 20/11</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-amber-800" />
                    <span>Bật nhạc nền 20/11</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onOpenQrModal}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-sky-500 bg-sky-600 px-3 sm:px-3.5 py-1 text-xs font-extrabold text-white shadow-xs transition hover:bg-sky-700 active:scale-95"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Mã QR & Link Nộp Bài</span>
            </button>
          </div>
        </motion.div>

        {/* Cụm Tiêu Đề Poster Chính: BÁO TƯỜNG SỐ + chào mừng Ngày nhà giáo Việt Nam 20/11 + Đôi cánh CHẮP CÁNH ƯỚC MƠ */}
        <div className="mt-6 text-center relative">
          {/* Máy bay giấy vàng bên trái & xanh bên phải */}
          <motion.div
            animate={{ x: [0, 8, 0], y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none hidden sm:block absolute left-6 md:left-16 top-10"
          >
            <PaperAirplaneSVG color="amber" className="w-12 h-12 -rotate-12" />
          </motion.div>
          <motion.div
            animate={{ x: [0, -8, 0], y: [0, -6, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none hidden sm:block absolute right-8 md:right-20 top-10"
          >
            <PaperAirplaneSVG color="sky" className="w-12 h-12 scale-x-[-1] rotate-12" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
          >
            {/* Dòng 1: Badge BÁO TƯỜNG SỐ bo góc nền cam đào ấm áp theo ảnh thiết kế */}
            <div className="inline-block rounded-2xl sm:rounded-full bg-[#FED7AA]/80 border border-[#FDBA74] px-5 py-1 sm:py-1.5 shadow-sm">
              <span className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-amber-950">
                BÁO TƯỜNG SỐ
              </span>
            </div>

            {/* Dòng 2: Chào mừng Ngày nhà giáo Việt Nam 20/11 theo font Neon 80s với hiệu ứng bóng nổi đa tầng */}
            <p className="mt-1.5 text-2xl sm:text-4xl md:text-5xl font-bold celebration-title-white">
              Chào mừng Ngày nhà giáo Việt Nam 20/11
            </p>

            {/* Dòng 3: Đôi cánh Ước Mơ nét vẽ nghệ thuật ôm sát chữ ƯỚC MƠ + Chữ SVG Gradient Cam Vàng Viền Trắng Tinh Tế */}
            <div className="mt-1 sm:mt-2 flex items-end justify-center relative max-w-5xl mx-auto px-1">
              <motion.div
                animate={{ rotate: [-6, -2, -6], y: [0, -4, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                className="shrink-0 -mr-16 sm:-mr-24 md:-mr-32 lg:-mr-40 self-end mb-1 sm:mb-2 select-none z-0"
              >
                <DreamWingSVG
                  side="left"
                  className="w-18 sm:w-24 md:w-32 lg:w-40 h-auto"
                />
              </motion.div>

              <h1 className="relative z-10 select-none text-center w-full max-w-[85vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center justify-center">
                <span className="relative w-full">
                  <svg
                    viewBox="100 0 720 250"
                    className="w-full h-auto overflow-visible select-none drop-shadow-sm"
                    role="img"
                    aria-label="CHẮP CÁNH ƯỚC MƠ"
                  >
                    <defs>
                      {/* Gradient loang từ Màu 2 (#F88F22) ở trên xuống Màu 1 (#EA6113) rõ nét, rực rỡ */}
                      <linearGradient id="title-grad-vivid" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFA62B" />
                        <stop offset="28%" stopColor="#F88F22" />
                        <stop offset="72%" stopColor="#EA6113" />
                        <stop offset="100%" stopColor="#C23E04" />
                      </linearGradient>
                      {/* Đổ bóng ấm áp dưới viền trắng */}
                      <filter id="title-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#5C1D06" floodOpacity="0.45" />
                      </filter>

                      {/* Khai báo text duy nhất trong defs để DOM chỉ có đúng 1 bản ghi cho mỗi cụm từ */}
                      <text
                        id="title-txt-chapcanh"
                        x="460"
                        y="86"
                        textAnchor="middle"
                        fontFamily="Praise, cursive, sans-serif"
                        fontSize="92"
                        fontWeight="bold"
                        letterSpacing="5"
                      >
                        CHẮP CÁNH
                      </text>
                      <text
                        id="title-txt-uocmo"
                        x="460"
                        y="218"
                        textAnchor="middle"
                        fontFamily="Praise, cursive, sans-serif"
                        fontSize="114"
                        fontWeight="bold"
                        letterSpacing="6"
                      >
                        ƯỚC MƠ
                      </text>
                    </defs>

                    <g filter="url(#title-shadow)">
                      {/* Viền trắng thanh thoát, nhỏ gọn hơn bọc ngoài chữ CHẮP CÁNH (stroke 11px) */}
                      <use
                        href="#title-txt-chapcanh"
                        stroke="#FFFFFF"
                        strokeWidth="11"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="#FFFFFF"
                      />
                      {/* Chữ loang gradient từ Màu 2 (#F88F22) xuống Màu 1 (#EA6113) */}
                      <use
                        href="#title-txt-chapcanh"
                        fill="url(#title-grad-vivid)"
                        stroke="url(#title-grad-vivid)"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />

                      {/* ƯỚC MƠ - Viền trắng nhỏ gọn hơn (stroke 12.5px) */}
                      <use
                        href="#title-txt-uocmo"
                        stroke="#FFFFFF"
                        strokeWidth="12.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        fill="#FFFFFF"
                      />
                      {/* ƯỚC MƠ - Gradient */}
                      <use
                        href="#title-txt-uocmo"
                        fill="url(#title-grad-vivid)"
                        stroke="url(#title-grad-vivid)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>

                  {/* Ngôi sao lấp lánh 2 bên chữ CHẮP CÁNH theo ảnh mẫu */}
                  <span className="pointer-events-none absolute -left-2 sm:-left-4 top-[26%] -translate-y-1/2 text-amber-500 text-lg sm:text-2xl select-none animate-pulse">
                    ✦
                  </span>
                  <span className="pointer-events-none absolute -right-2 sm:-right-4 top-[26%] -translate-y-1/2 text-amber-500 text-lg sm:text-2xl select-none animate-pulse">
                    ✦
                  </span>
                </span>
              </h1>

              <motion.div
                animate={{ rotate: [6, 2, 6], y: [0, -4, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                className="shrink-0 -ml-16 sm:-ml-24 md:-ml-32 lg:-ml-40 self-end mb-1 sm:mb-2 select-none z-0"
              >
                <DreamWingSVG
                  side="right"
                  className="w-18 sm:w-24 md:w-32 lg:w-40 h-auto"
                />
              </motion.div>
            </div>

            {/* Ruy băng thông tin Chi đội 9A3 & Chủ đề cuộc thi */}
            <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-amber-400/90 bg-amber-100/90 px-5 py-1.5 text-xs sm:text-sm font-bold text-amber-950 shadow-sm">
              <span>✨ {config.className} – {config.schoolName}</span>
              <span>•</span>
              <span>Chủ đề: “{config.competitionTheme}”</span>
            </div>
          </motion.div>

          {/* Thanh chuyển đổi chế độ xem */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <div
              role="tablist"
              aria-label="Chế độ xem Bảng Infographic Typographic"
              className="inline-flex rounded-full border-2 border-amber-400 bg-white/90 p-1 shadow-md"
            >
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'cards'}
                onClick={() => onViewModeChange('cards')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-extrabold transition ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-b from-orange-400 to-poster-orange text-white shadow-sm'
                    : 'text-stone-700 hover:bg-amber-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Bảng Infographic Báo Tường (5 Mục)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'poster'}
                onClick={() => onViewModeChange('poster')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-extrabold transition ${
                  viewMode === 'poster'
                    ? 'bg-gradient-to-b from-orange-400 to-poster-orange text-white shadow-sm'
                    : 'text-stone-700 hover:bg-amber-50'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Sơ Đồ Infographic Toàn Cảnh</span>
              </button>
            </div>

            {onOpenWishes && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenWishes('submit')}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-sky-500 bg-gradient-to-b from-orange-400 to-poster-orange px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:brightness-105"
                >
                  <Send className="h-4 w-4" />
                  <span>Gửi Lời Chúc 20/11</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenWishes('view')}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-red-700 bg-red-700 px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:bg-red-800"
                >
                  <BookHeart className="h-4 w-4" />
                  <span>Xem Lời Chúc (Thầy Cô)</span>
                </button>
              </div>
            )}

            {onOpenTeacherBoard && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenTeacherBoard('board')}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-sky-600 bg-sky-600 px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:bg-sky-700"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Bảng Tổng Hợp Giáo Viên</span>
                </button>
              </div>
            )}

            {onOpenMemories && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={onOpenMemories}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-rose-400 bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:brightness-105 touch-manipulation"
                >
                  <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>Trạm Ký Ức</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
