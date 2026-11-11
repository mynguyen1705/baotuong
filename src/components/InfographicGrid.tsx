import React from 'react';
import { motion } from 'motion/react';
import {
  QrCode,
  Play,
  Volume2,
  Feather,
  Sparkles,
  Heart,
  BookOpen,
  BookText,
  Scroll,
  Film,
} from 'lucide-react';
import { SectionData, SectionId } from '../types/baotuong';
import { countVietnameseWords } from '../utils/wordCount';
import {
  PaperAirplaneSVG,
  PointerHandIcon,
} from './PosterDecorations';
import { StationerySetSVG, VintageBookStackSVG } from './SchoolDecorations';

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
        {/* Đồ dùng học tập và sách vở trang trí bên sườn giống báo tường học trò */}
        <div className="pointer-events-none absolute top-[43%] -left-5 z-10 hidden sm:block opacity-75">
          <StationerySetSVG className="w-24 h-24" />
        </div>
        <div className="pointer-events-none absolute bottom-4 -right-4 z-10 hidden sm:block opacity-75">
          <VintageBookStackSVG className="w-28 h-28" />
        </div>

        {/* LƯỚI 2 CỘT CHO MỤC 1, 2, 3, 4 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-9 relative z-20">
          {/* =========================================================
              MỤC 1: 1. LỜI NGỎ (Trang sách mở tỏa sáng + Lọ mực + Bút máy)
             ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-between rounded-3xl border-2 border-amber-300/80 bg-amber-50/55 p-5 sm:p-6 shadow-sm"
          >
            <div>
              {/* Tiêu đề mục chuẩn style Poster gốc */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-xs font-extrabold uppercase tracking-widest text-amber-800/70">
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

              {/* Nghệ thuật Typographic Trang Sách Mở Tỏa Sáng + Lọ mực xanh + Máy bay giấy */}
              <div
                onClick={() => onSelectSection('loi-ngo')}
                className="mt-4 relative cursor-pointer pt-2 pb-3"
              >
                {/* Máy bay giấy bay ra từ trang sách */}
                <PaperAirplaneSVG
                  color="sky"
                  className="pointer-events-none absolute -top-2 right-1 w-10 h-10 z-20"
                />

                {/* Hai trang sách mở phát sáng lấp lánh */}
                <div className="open-book-surface relative grid grid-cols-1 sm:grid-cols-2 rounded-2xl border-2 border-[#B45309] p-4 sm:p-5 shadow-lg">
                  {/* Gáy sách ở giữa */}
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute inset-y-2 left-1/2 w-[3px] -translate-x-1/2 bg-gradient-to-b from-amber-300 via-amber-700/50 to-amber-300"
                  />
                  {/* Ánh sáng lấp lánh giữa sách */}
                  <Sparkles className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 h-5 w-5 text-amber-500 animate-pulse" />

                  {/* Trang trái: Chữ viết tay nghệ thuật */}
                  <div className="pr-0 sm:pr-4 border-b sm:border-b-0 border-amber-300/70 pb-3 sm:pb-0 flex flex-col justify-between">
                    <span className="font-script text-2xl sm:text-3xl font-bold text-amber-900 leading-tight">
                      Chắp cánh ước mơ
                    </span>
                    <p className="mt-2 font-serif text-xs sm:text-sm italic text-stone-800 leading-relaxed">
                      “{loiNgo.typoTheme.featuredLines[0]}{' '}
                      {loiNgo.typoTheme.featuredLines[1]}”
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                      <Feather className="h-3.5 w-3.5 text-sky-700" />
                      <span>Chi đội 9A3 • TH&THCS Hiệp Thạnh</span>
                    </div>
                  </div>

                  {/* Trang phải: Trích đoạn Lời ngỏ Typographic */}
                  <div className="pl-0 sm:pl-4 pt-3 sm:pt-0 flex flex-col justify-between">
                    <p className="font-serif text-xs sm:text-sm text-stone-800 leading-relaxed first-letter:float-left first-letter:mr-1.5 first-letter:font-serif first-letter:text-3xl first-letter:font-bold first-letter:text-poster-orange">
                      Tháng Mười Một lại về mang theo sắc nắng vàng dịu dàng và lòng biết ơn sâu sắc của tuổi học trò cuối cấp...
                    </p>
                    <p className="mt-2 text-right font-script text-base font-bold text-red-800">
                      — Tập thể Lớp 9A3 —
                    </p>
                  </div>
                </div>

                {/* Lọ mực xanh góc trái dưới của trang sách */}
                <div className="mt-2 flex items-center justify-between px-1 text-xs text-stone-600">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-900 px-2.5 py-1 text-[11px] font-bold text-sky-100 shadow-sm">
                    🖋️ Nét bút tri ân 20/11
                  </span>
                  <span className="font-serif italic text-amber-900">
                    Bấm để đọc trọn vẹn Lời ngỏ →
                  </span>
                </div>
              </div>
            </div>

            <PosterActionBtn onClick={() => onSelectSection('loi-ngo')} />
          </motion.article>

          {/* =========================================================
              MỤC 2: 2. TRUYỆN NGẮN - Chiếc lá mùa thu & Nét chữ ngày xưa
             ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col justify-between rounded-3xl border-2 border-emerald-400/70 bg-gradient-to-b from-emerald-50/70 via-amber-50/50 to-lime-100/60 p-5 sm:p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-serif text-xs font-extrabold uppercase tracking-widest text-emerald-800">
                  <BookText className="h-3.5 w-3.5 text-emerald-700" />
                  <span>{truyenNgan.typoTheme.displayNumeral} • TRUYỆN NGẮN</span>
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
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#4A2511] flex items-center justify-center gap-2">
                  <BookText className="h-6 w-6 text-emerald-700 shrink-0" />
                  <span>{truyenNgan.badgeTitle}</span>
                </h2>
                <p className="font-script text-2xl sm:text-3xl font-bold text-[#4A2511]">
                  {truyenNgan.subtitle}
                </p>
              </div>

              {/* Khung Typographic Truyện Ngắn */}
              <div
                onClick={() => onSelectSection('truyen-ngan')}
                className="mt-4 relative cursor-pointer overflow-hidden rounded-2xl border-2 border-emerald-700/60 bg-gradient-to-b from-[#FAFDF6] to-[#E6F4D7] p-4 sm:p-5 shadow-md"
              >
                {/* Tán cây xanh góc phải trên */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-6 -right-6 h-24 w-28 rounded-full bg-emerald-600/20 blur-md"
                />

                <div className="flex items-center justify-between gap-2 border-b border-emerald-700/20 pb-2 text-xs font-bold text-emerald-900">
                  <span className="inline-flex items-center gap-1">
                    <BookText className="h-3.5 w-3.5 text-emerald-700" />
                    Tuyển tập truyện ngắn tuổi học trò
                  </span>
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white">
                    Chi đội 9A3
                  </span>
                </div>

                {/* Trích đoạn Typographic nổi bật của Truyện ngắn */}
                <blockquote className="mt-3 font-serif text-sm sm:text-base italic text-stone-900 leading-relaxed">
                  {truyenNgan.pullQuote}
                </blockquote>

                <p className="mt-2.5 text-xs text-stone-700 leading-relaxed line-clamp-2">
                  {truyenNgan.summary}
                </p>

                {/* Thảm cỏ xanh dưới chân khung truyện */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-800/90 px-3 py-1.5 text-[11px] font-bold text-emerald-50">
                  <span>✍️ {truyenNgan.authorCredit}</span>
                  <span>🍂 02 truyện ngắn giàu ý nghĩa</span>
                </div>
              </div>
            </div>

            <PosterActionBtn onClick={() => onSelectSection('truyen-ngan')} />
          </motion.article>

          {/* =========================================================
              MỤC 3: 3. THƠ - Ơn thầy nâng cánh (Cuộn giấy da cổ điển + Bút máy)
             ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="flex flex-col justify-between rounded-3xl border-2 border-red-300/80 bg-gradient-to-b from-rose-50/60 via-amber-50/60 to-orange-50/60 p-5 sm:p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-serif text-xs font-extrabold uppercase tracking-widest text-red-800">
                  <Scroll className="h-3.5 w-3.5 text-red-700" />
                  <span>{tho.typoTheme.displayNumeral} • THƠ TRI ÂN</span>
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
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#4A2511] flex items-center justify-center gap-2">
                  <Scroll className="h-6 w-6 text-red-700 shrink-0" />
                  <span>{tho.badgeTitle}</span>
                </h2>
                <p className="font-script text-2xl sm:text-3xl font-bold text-[#4A2511]">
                  {tho.subtitle}
                </p>
              </div>

              {/* Cuộn Giấy Da Thư Pháp (Parchment Scroll) + Chữ "Ơn thầy" + Bút máy */}
              <div
                onClick={() => onSelectSection('tho')}
                className="mt-4 relative cursor-pointer"
              >
                {/* Dải ruy băng đỏ uốn lượn phía trên cuộn giấy */}
                <div className="mx-auto mb-1 flex items-center justify-center gap-2 text-xs font-bold text-red-700">
                  <Scroll className="h-3.5 w-3.5 text-red-700" />
                  <span>Tuyển tập Thơ tri ân thầy cô và ký ức mái trường</span>
                </div>

                <div className="parchment-scroll-surface relative rounded-2xl border-y-2 border-x-8 border-[#B47B38] p-5 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-800/20 pb-3">
                    {/* Chữ thư pháp lớn "Ơn thầy" giống hệt giữa cuộn giấy trên ảnh mẫu */}
                    <div>
                      <span className="font-script text-4xl sm:text-5xl font-bold text-[#5C2D16] drop-shadow-sm">
                        Ơn thầy
                      </span>
                      <span className="ml-2 inline-block text-lg text-sky-800">✒️</span>
                    </div>

                    <div className="text-left sm:text-right text-xs font-serif italic text-stone-800 space-y-0.5">
                      <p>“Lặng xuôi năm tháng êm trôi</p>
                      <p>Con đò kể chuyện một thời rất xưa...”</p>
                      <p className="font-sans text-[11px] font-bold not-italic text-red-800">
                        — Nguyễn Quốc Đạt • Hải Đăng 9A3 • Tứ Gia
                      </p>
                    </div>
                  </div>

                  {/* Thanh báo hiệu có trình phát Audio giọng đọc học sinh 9A3 */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#4A2511]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-700 px-3 py-1 text-[11px] text-white">
                      <Volume2 className="h-3.5 w-3.5" />
                      Nghe Audio Học Sinh 9A3 Ngâm Thơ + Nhạc Nền
                    </span>
                    <span className="text-[11px] text-amber-950">
                      03 Bài thơ tri ân →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <PosterActionBtn onClick={() => onSelectSection('tho')} />
          </motion.article>

          {/* =========================================================
              MỤC 4: 4. MV (Video ca nhạc) - Người gieo mầm xanh (Khung trình phát Video + Khuông nhạc)
             ========================================================= */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-col justify-between rounded-3xl border-2 border-sky-400/80 bg-gradient-to-b from-sky-50/70 via-amber-50/50 to-orange-50/60 p-5 sm:p-6 shadow-sm"
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

              {/* Khung Trình Phát Video Ca Nhạc (Giống hệt khung Player trên Poster mẫu) */}
              <div
                onClick={() => onSelectSection('mv')}
                className="mt-4 relative cursor-pointer rounded-2xl border-4 border-stone-800 bg-[#FFF8EB] p-4 shadow-lg"
              >
                {/* Màn hình xanh nhỏ ở góc trên phải giống hệt Poster gốc */}
                <div className="absolute -top-3 -right-2 z-20 flex h-11 w-16 items-center justify-center rounded-lg border-2 border-stone-800 bg-sky-300 shadow">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Khuông nhạc + Khóa Sol + Nút Play Đỏ ở giữa + Typography bài hát */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition group-hover:scale-105">
                    <Play className="h-8 w-8 fill-current ml-1" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-red-700">
                      <span>🎼 Ca khúc chủ đề MV:</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-stone-900 truncate">
                      Người Gieo Mầm Xanh
                    </h3>
                    <p className="text-xs font-bold text-stone-700">
                      Sáng tác: <span className="text-poster-orange">Hứa Kim Tuyền</span> • Trình bày:{' '}
                      <span className="text-sky-800">Hoàng Dũng</span>
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-800">
                      📍 Quay thực tế: Lớp 9A3 & Sân trường TH&THCS Hiệp Thạnh
                    </p>
                  </div>
                </div>

                {/* Thanh tua Video Player màu đen ở đáy khung giống hệt Poster gốc */}
                <div className="mt-4 rounded-xl bg-stone-900 px-3 py-2 text-white">
                  <div className="h-1.5 w-full rounded-full bg-stone-700 overflow-hidden">
                    <div className="h-full w-2/5 rounded-full bg-red-600" />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-stone-300">
                    <span>▶ ⏸ 🔊 01:28 / 03:45</span>
                    <span className="text-amber-300 font-sans font-bold">
                      04 Phân cảnh sân trường ⛶
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <PosterActionBtn onClick={() => onSelectSection('mv')} />
          </motion.article>
        </div>

        {/* =========================================================
            MỤC 5: 5. BÀI TRI ÂN (Thẻ Trải Rộng Toàn Chiều Ngang Dưới Đáy + Phong Thư Trái Tim)
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
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
                Tâm thư tri ân
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

          {/* Bố cục Bức Thư Tri Ân + Phong Thư Dán Tim Đỏ (Giống góc dưới phải Poster gốc) */}
          <div
            onClick={() => onSelectSection('tri-an')}
            className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center cursor-pointer rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/50 p-5 sm:p-6"
          >
            <div className="lg:col-span-8 space-y-2.5">
              <p className="font-serif text-base sm:text-lg italic font-semibold text-stone-900 leading-relaxed">
                {triAn.pullQuote}
              </p>
              <p className="font-serif text-xs sm:text-sm text-stone-700 leading-relaxed">
                “Mỗi viên phấn trắng mòn đi trên bảng đen là một hạt mầm tri thức được gieo vào tâm hồn chúng em. Những sợi tóc pha sương trên mái đầu thầy, những nếp nhăn nơi khóe mắt cô sau mỗi mùa thi chuyển cấp chính là minh chứng lặng thầm cho sự cống hiến cao cả của nghề dạy học...”
              </p>
            </div>

            {/* Cụm Phong Thư Tri Ân gắn Trái Tim Đỏ giống hệt góc phải dưới của Poster mẫu */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl border-2 border-amber-300 bg-white p-4 text-center shadow-sm relative">
              <div className="flex items-center gap-1.5 text-rose-600 mb-1">
                <Heart className="h-4 w-4 fill-current" />
                <Heart className="h-5 w-5 fill-current -mt-2" />
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <div className="w-full rounded-xl border-2 border-amber-400 bg-amber-100/80 px-4 py-3 shadow-inner">
                <p className="font-script text-2xl font-bold text-red-800">
                  Gửi Thầy Cô Kính Yêu!
                </p>
                <p className="mt-0.5 text-xs font-bold text-stone-800">
                  Tập thể học sinh Chi đội 9A3
                </p>
                <p className="text-[11px] text-stone-600">
                  Trường TH&THCS Hiệp Thạnh • 20/11
                </p>
              </div>
            </div>
          </div>

          <PosterActionBtn onClick={() => onSelectSection('tri-an')} />
        </motion.article>
      </div>
    </section>
  );
};
