import React from 'react';
import { motion } from 'motion/react';
import {
  QrCode,
  Play,
  Volume2,
  Heart,
} from 'lucide-react';
import { SectionData, SectionId } from '../types/baotuong';
import { countVietnameseWords } from '../utils/wordCount';
import {
  PaperAirplaneSVG,
  PointerHandIcon,
} from './PosterDecorations';

export interface InfographicGridProps {
  sections: SectionData[];
  onSelectSection: (id: SectionId) => void;
  onOpenSectionQr: (id: SectionId) => void;
}

/**
 * Nút bấm Cam Viền Xanh Ngọc + Bàn tay trỏ chuẩn 100% style Poster gốc
 */
const PosterActionBtn: React.FC<{
  onClick: () => void;
  label?: string;
}> = ({ onClick, label = 'NHẤP VÀO ĐÂY ĐỂ XEM' }) => (
  <div className="mt-4 flex justify-center">
    <button
      type="button"
      onClick={onClick}
      className="poster-cta-btn group relative inline-flex min-h-[48px] items-center justify-center rounded-2xl px-7 py-2.5 font-display text-sm sm:text-base font-extrabold uppercase tracking-wide text-white focus:outline-none focus:ring-4 focus:ring-sky-300"
    >
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">{label}</span>
      {/* Bàn tay trắng trỏ vào góc dưới phải của nút giống hệt ảnh mẫu */}
      <span className="pointer-events-none absolute -bottom-3.5 -right-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5">
        <PointerHandIcon className="h-8 w-8 drop-shadow" />
      </span>
    </button>
  </div>
);

export const InfographicGrid: React.FC<InfographicGridProps> = ({
  sections,
  onSelectSection,
  onOpenSectionQr,
}) => {
  const loiNgo = sections.find((s) => s.id === 'loi-ngo')!;
  const truyenNgan = sections.find((s) => s.id === 'truyen-ngan')!;
  const tho = sections.find((s) => s.id === 'tho')!;
  const mv = sections.find((s) => s.id === 'mv')!;
  const triAn = sections.find((s) => s.id === 'tri-an')!;

  const triAnWords = triAn.paragraphs
    ? countVietnameseWords(triAn.paragraphs.join(' '))
    : 622;

  return (
    <section
      aria-label="Bảng Infographic Báo tường số Chắp Cánh Ước Mơ"
      className="mx-auto max-w-5xl px-3 pb-10 sm:px-6"
    >
      {/* Khung Poster Giấy Màu Nước Ấm Áp Chứa Đủ 5 Mục (2x2 + 1 Đáy) */}
      <div className="relative rounded-[2.25rem] border-4 border-amber-300/90 bg-gradient-to-b from-[#FFFDF6] via-[#FDF5E2] to-[#F9E8C8] p-5 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Cành hoa phượng và máy bay giấy trang trí nhẹ nhàng bên sườn khung poster */}
        <div className="pointer-events-none absolute top-[40%] -left-3 z-10 hidden sm:block opacity-85">
          <PaperAirplaneSVG color="amber" className="w-12 h-12 -rotate-12 drop-shadow-md" />
        </div>
        <div className="pointer-events-none absolute bottom-5 -right-3 z-10 hidden sm:block opacity-85">
          <PaperAirplaneSVG color="sky" className="w-12 h-12 rotate-12 scale-x-[-1] drop-shadow-md" />
        </div>

        {/* LƯỚI 2 CỘT CHO MỤC 1, 2, 3, 4 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-9 relative z-20">
          {/* =========================================================
              MỤC 1: 1. LỜI NGỎ (Tranh minh họa sách mở, lọ mực, bút máy)
             ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-between rounded-3xl border-2 border-amber-300/80 bg-amber-50/70 p-5 sm:p-6 shadow-md"
          >
            <div>
              {/* Tiêu đề mục chuẩn style Poster gốc */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-xs font-extrabold uppercase tracking-widest text-amber-800">
                  {loiNgo.typoTheme.displayNumeral} • MỞ ĐẦU
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSectionQr('loi-ngo')}
                  aria-label={`Mã QR cho ${loiNgo.badgeTitle}`}
                  className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:border-sky-500 hover:text-sky-700"
                >
                  <QrCode className="h-3 w-3" />
                  <span>QR</span>
                </button>
              </div>

              <div className="mt-1 text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#4A2511]">
                  {loiNgo.badgeTitle}
                </h2>
                <p className="font-script text-xl sm:text-2xl font-bold text-[#6B371A]">
                  Khúc dạo đầu tuổi học trò 9A3
                </p>
              </div>

              {/* Khung tranh minh họa nghệ thuật từ Poster gốc */}
              <div
                onClick={() => onSelectSection('loi-ngo')}
                className="mt-4 relative cursor-pointer group"
              >
                <div className="overflow-hidden rounded-2xl border-2 border-amber-400 bg-amber-100 shadow-md transition group-hover:shadow-lg group-hover:scale-[1.01]">
                  <img
                    src="/sections/sec-loi-ngo.jpg"
                    alt="1. Lời ngỏ - Báo tường số Chi đội 9A3"
                    className="w-full h-auto block select-none object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-stone-700">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-200/80 px-2.5 py-1 text-[11px] font-bold text-amber-950">
                    🖋️ Nét bút tri ân 20/11
                  </span>
                  <span className="font-serif italic text-amber-900 font-semibold">
                    Bấm để đọc trọn vẹn Lời ngỏ →
                  </span>
                </div>
              </div>
            </div>

            <PosterActionBtn onClick={() => onSelectSection('loi-ngo')} />
          </motion.article>

          {/* =========================================================
              MỤC 2: 2. TRUYỆN NGẮN (Tranh minh họa cô trò đọc sách dưới cây)
             ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col justify-between rounded-3xl border-2 border-emerald-400/80 bg-gradient-to-b from-emerald-50/70 via-amber-50/50 to-lime-100/60 p-5 sm:p-6 shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-xs font-extrabold uppercase tracking-widest text-emerald-800">
                  {truyenNgan.typoTheme.displayNumeral} • VĂN HỌC HỌC ĐƯỜNG
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSectionQr('truyen-ngan')}
                  aria-label={`Mã QR cho ${truyenNgan.badgeTitle}`}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-white px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:border-sky-500 hover:text-sky-700"
                >
                  <QrCode className="h-3 w-3" />
                  <span>QR</span>
                </button>
              </div>

              <div className="mt-1 text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#4A2511]">
                  {truyenNgan.badgeTitle}
                </h2>
                <p className="font-script text-2xl sm:text-3xl font-bold text-[#4A2511]">
                  Người gieo hạt lặng lẽ
                </p>
              </div>

              {/* Khung tranh minh họa nghệ thuật từ Poster gốc */}
              <div
                onClick={() => onSelectSection('truyen-ngan')}
                className="mt-4 relative cursor-pointer group"
              >
                <div className="overflow-hidden rounded-2xl border-2 border-emerald-500 bg-emerald-100 shadow-md transition group-hover:shadow-lg group-hover:scale-[1.01]">
                  <img
                    src="/sections/sec-truyen-ngan.jpg"
                    alt="2. Truyện ngắn - Người gieo hạt lặng lẽ"
                    className="w-full h-auto block select-none object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-stone-700">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-200/80 px-2.5 py-1 text-[11px] font-bold text-emerald-950">
                    🌳 Dưới gốc bàng sân trường
                  </span>
                  <span className="font-serif italic text-emerald-900 font-semibold">
                    Bấm để đọc truyện ngắn →
                  </span>
                </div>
              </div>
            </div>

            <PosterActionBtn onClick={() => onSelectSection('truyen-ngan')} />
          </motion.article>

          {/* =========================================================
              MỤC 3: 3. THƠ (Tranh minh họa cuộn thư hoa phượng "Ơn thầy")
             ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="flex flex-col justify-between rounded-3xl border-2 border-red-300/80 bg-gradient-to-b from-rose-50/70 via-amber-50/60 to-orange-50/60 p-5 sm:p-6 shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-xs font-extrabold uppercase tracking-widest text-red-800">
                  {tho.typoTheme.displayNumeral} • THƠ & AUDIO NGÂM THƠ
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSectionQr('tho')}
                  aria-label={`Mã QR cho ${tho.badgeTitle}`}
                  className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-white px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:border-sky-500 hover:text-sky-700"
                >
                  <QrCode className="h-3 w-3" />
                  <span>QR</span>
                </button>
              </div>

              <div className="mt-1 text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#4A2511]">
                  {tho.badgeTitle}
                </h2>
                <p className="font-script text-2xl sm:text-3xl font-bold text-[#4A2511]">
                  Ơn thầy nâng cánh
                </p>
              </div>

              {/* Khung tranh minh họa nghệ thuật từ Poster gốc */}
              <div
                onClick={() => onSelectSection('tho')}
                className="mt-4 relative cursor-pointer group"
              >
                <div className="overflow-hidden rounded-2xl border-2 border-rose-400 bg-rose-100 shadow-md transition group-hover:shadow-lg group-hover:scale-[1.01]">
                  <img
                    src="/sections/sec-tho.jpg"
                    alt="3. Thơ - Ơn thầy nâng cánh"
                    className="w-full h-auto block select-none object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-stone-700">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-200/80 px-2.5 py-1 text-[11px] font-bold text-rose-950">
                    <Volume2 className="h-3.5 w-3.5 text-rose-700" />
                    Có Audio giọng đọc ngâm thơ
                  </span>
                  <span className="font-serif italic text-red-900 font-semibold">
                    Bấm để ngâm thơ & đọc bài →
                  </span>
                </div>
              </div>
            </div>

            <PosterActionBtn onClick={() => onSelectSection('tho')} />
          </motion.article>

          {/* =========================================================
              MỤC 4: 4. MV (Tranh minh họa màn hình video ca nhạc 9A3)
             ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-col justify-between rounded-3xl border-2 border-sky-400/80 bg-gradient-to-b from-sky-50/70 via-amber-50/50 to-orange-50/60 p-5 sm:p-6 shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-xs font-extrabold uppercase tracking-widest text-sky-900">
                  {mv.typoTheme.displayNumeral} • MV CA NHẠC SỐ 9A3
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSectionQr('mv')}
                  aria-label={`Mã QR cho ${mv.badgeTitle}`}
                  className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-white px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:border-sky-500 hover:text-sky-700"
                >
                  <QrCode className="h-3 w-3" />
                  <span>QR</span>
                </button>
              </div>

              <div className="mt-1 text-center relative">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4A2511]">
                  4. MV <span className="font-script font-bold">(Video ca nhạc)</span>
                </h2>
                <p className="font-script text-2xl sm:text-3xl font-bold text-[#4A2511]">
                  Người gieo mầm xanh ♪♫
                </p>
              </div>

              {/* Khung tranh minh họa nghệ thuật từ Poster gốc */}
              <div
                onClick={() => onSelectSection('mv')}
                className="mt-4 relative cursor-pointer group"
              >
                <div className="overflow-hidden rounded-2xl border-2 border-sky-400 bg-sky-100 shadow-md transition group-hover:shadow-lg group-hover:scale-[1.01]">
                  <img
                    src="/sections/sec-mv.jpg"
                    alt="4. Âm nhạc: Bài ca tri ân - MV Người gieo mầm xanh"
                    className="w-full h-auto block select-none object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-stone-700">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-200/80 px-2.5 py-1 text-[11px] font-bold text-sky-950">
                    <Play className="h-3.5 w-3.5 fill-current text-sky-700" />
                    Trình phát Video MV 9A3
                  </span>
                  <span className="font-serif italic text-sky-900 font-semibold">
                    Bấm để xem video ca nhạc →
                  </span>
                </div>
              </div>
            </div>

            <PosterActionBtn onClick={() => onSelectSection('mv')} />
          </motion.article>
        </div>

        {/* =========================================================
            MỤC 5: 5. BÀI TRI ÂN (Tranh minh họa tặng hoa cô giáo & phong thư)
           ========================================================= */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-9 relative z-20 rounded-3xl border-2 border-amber-400/90 bg-gradient-to-r from-[#FFFDF8] via-[#FFF9EC] to-[#FDF2DC] p-6 sm:p-8 shadow-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-serif text-xs font-extrabold uppercase tracking-widest text-red-800">
              {triAn.typoTheme.displayNumeral} • TÂM THƯ NGÀY NHÀ GIÁO VIỆT NAM 20/11
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900 border border-emerald-300">
                ✓ {triAnWords} chữ (Chuẩn ~600 chữ)
              </span>
              <button
                type="button"
                onClick={() => onOpenSectionQr('tri-an')}
                aria-label={`Mã QR cho ${triAn.badgeTitle}`}
                className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-bold text-stone-700 hover:border-sky-500 hover:text-sky-700"
              >
                <QrCode className="h-3 w-3" />
                <span>QR</span>
              </button>
            </div>
          </div>

          <div className="mt-1 text-center">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#4A2511]">
              {triAn.badgeTitle}
            </h2>
            <p className="font-script text-2xl sm:text-3xl font-bold text-[#6B371A]">
              {triAn.title}
            </p>
          </div>

          {/* Khung tranh minh họa nghệ thuật từ Poster gốc */}
          <div
            onClick={() => onSelectSection('tri-an')}
            className="mt-5 cursor-pointer group"
          >
            <div className="overflow-hidden rounded-2xl border-2 border-amber-400 bg-amber-100 shadow-md transition group-hover:shadow-lg group-hover:scale-[1.01]">
              <img
                src="/sections/sec-tri-an.jpg"
                alt="5. Bài tri ân - Tri ân thầy cô ngày 20/11"
                className="w-full h-auto block select-none object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between px-1 text-xs text-stone-700 gap-2">
              <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                <Heart className="h-4 w-4 fill-current" />
                <span>Gửi gắm lòng biết ơn sâu sắc tới quý thầy cô trường TH&THCS Hiệp Thạnh</span>
              </div>
              <span className="font-serif italic text-amber-900 font-semibold">
                Bấm để đọc toàn văn bức tâm thư →
              </span>
            </div>
          </div>

          <PosterActionBtn onClick={() => onSelectSection('tri-an')} />
        </motion.article>
      </div>
    </section>
  );
};
