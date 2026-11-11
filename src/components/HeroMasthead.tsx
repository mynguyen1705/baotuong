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
} from 'lucide-react';
import { BaoTuongConfig } from '../types/baotuong';
import { WishesModalMode } from '../types/wishes';
import { TeacherModalMode } from '../types/teachers';
import {
  DreamWingSVG,
  HotAirBalloonSVG,
  PaperAirplaneSVG,
} from './PosterDecorations';
import { VintageBookStackSVG } from './SchoolDecorations';

export interface HeroMastheadProps {
  config: BaoTuongConfig;
  viewMode: 'cards' | 'poster';
  onViewModeChange: (mode: 'cards' | 'poster') => void;
  onOpenQrModal: () => void;
  onOpenWishes?: (mode: WishesModalMode) => void;
  onOpenTeacherBoard?: (mode: TeacherModalMode) => void;
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
  isBgMusicPlaying = false,
  onToggleBgMusic,
}) => {
  return (
    <header className="relative overflow-hidden pt-4 pb-6 px-4 sm:px-6 lg:px-8">
      {/* Chồng sách vở tri thức góc trái trên cùng đung đưa nhẹ nhàng */}
      <motion.div
        style={{ transformOrigin: '0% 0%' }}
        animate={{ rotate: [-2, 3, -2], y: [0, 3, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-2 left-1 sm:left-4 z-10 opacity-90"
      >
        <VintageBookStackSVG className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-md" />
      </motion.div>

      {/* Khinh khí cầu đỏ-kem góc phải trên cùng (giống hệt Poster mẫu) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-4 right-3 sm:right-8 z-10"
      >
        <HotAirBalloonSVG className="w-14 sm:w-20 h-auto" />
      </motion.div>

      <div className="mx-auto max-w-5xl relative z-20">
        {/* Thanh công cụ gọn gàng phía trên (Trường, Lớp 9A3, Nhạc nền, Mã QR) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto flex flex-wrap items-center justify-between gap-2 rounded-full border-2 border-amber-300/90 bg-white/85 px-4 py-1.5 shadow-sm backdrop-blur-sm max-w-4xl"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-stone-800">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-extrabold text-white">
              <Award className="h-3.5 w-3.5" />
              {config.schoolName}
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-950 border border-amber-300">
              {config.className}
            </span>
            <span className="hidden md:inline text-stone-400">•</span>
            <span className="hidden md:inline text-xs font-semibold text-red-800">
              Chủ đề: “{config.competitionTheme}”
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleBgMusic && (
              <button
                type="button"
                onClick={onToggleBgMusic}
                aria-label={isBgMusicPlaying ? 'Tắt nhạc nền 20/11' : 'Bật nhạc nền 20/11'}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold transition ${
                  isBgMusicPlaying
                    ? 'border-amber-600 bg-amber-400 text-stone-950'
                    : 'border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100'
                }`}
              >
                {isBgMusicPlaying ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                    <span>Tắt nhạc nền 20/11</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span>Bật nhạc nền 20/11</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onOpenQrModal}
              className="inline-flex items-center gap-1 rounded-full border-2 border-sky-500 bg-sky-600 px-3 py-1 text-xs font-extrabold text-white shadow-sm transition hover:bg-sky-700"
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
            {/* Dòng 1: BÁO TƯỜNG SỐ */}
            <p className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-wider text-stone-900">
              BÁO TƯỜNG SỐ
            </p>

            {/* Dòng 2: chào mừng Ngày nhà giáo Việt Nam 20/11 */}
            <p className="mt-0.5 font-script text-2xl sm:text-4xl md:text-5xl font-bold text-stone-900">
              chào mừng Ngày nhà giáo Việt Nam 20/11
            </p>

            {/* Dòng 3: Đôi cánh Ước Mơ + Chữ 3D Cam Vàng CHẮP CÁNH / ƯỚC MƠ */}
            <div className="mt-3 flex items-center justify-center gap-0 sm:gap-2">
              <motion.div
                animate={{ rotate: [-2, 3, -2] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                className="-mr-3 sm:-mr-5 self-end mb-2"
              >
                <DreamWingSVG
                  side="left"
                  className="w-20 sm:w-32 md:w-40 h-auto drop-shadow-md"
                />
              </motion.div>

              <h1 className="relative z-10 leading-[0.92] select-none">
                <span className="title-3d-orange block text-4xl sm:text-6xl md:text-7xl tracking-wide">
                  CHẮP CÁNH
                </span>
                <span className="title-3d-orange block text-5xl sm:text-7xl md:text-8xl tracking-wide mt-0.5">
                  ƯỚC MƠ
                </span>
              </h1>

              <motion.div
                animate={{ rotate: [2, -3, 2] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                className="-ml-3 sm:-ml-5 self-end mb-2"
              >
                <DreamWingSVG
                  side="right"
                  className="w-20 sm:w-32 md:w-40 h-auto drop-shadow-md"
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
          </div>
        </div>
      </div>
    </header>
  );
};
