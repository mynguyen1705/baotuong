import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Compass,
  QrCode,
  Users,
  Eye,
  BookOpen,
  BookText,
  Scroll,
  Film,
  Heart,
  ZoomIn,
  X,
} from 'lucide-react';
import { BaoTuongConfig, SectionData, SectionId } from '../types/baotuong';
import { PointerHandIcon } from './PosterDecorations';

export interface InteractivePosterViewProps {
  config: BaoTuongConfig;
  sections: SectionData[];
  onSelectSection: (id: SectionId) => void;
  onOpenSectionQr: (id: SectionId) => void;
}

/**
 * Tọa độ phần trăm chính xác của 5 nút bấm chuyên mục trên ảnh poster gốc:
 * 1. Lời ngỏ: "Lật mở trang viết →"
 * 2. Truyện ngắn: "Đọc câu chuyện 📝"
 * 3. Thơ: "Thưởng thức thơ ca"
 * 4. Âm nhạc: "Lắng nghe khúc ca ▶"
 * 5. Bài tri ân: "Xem lời chúc & tri ân ➔"
 */
const POSTER_HOTSPOTS: {
  id: SectionId;
  name: string;
  left: string;
  top: string;
  width: string;
  height: string;
}[] = [
  {
    id: 'loi-ngo',
    name: '1. Lời ngỏ',
    left: '10.5%',
    top: '38.8%',
    width: '32.0%',
    height: '3.3%',
  },
  {
    id: 'truyen-ngan',
    name: '2. Truyện ngắn',
    left: '58.0%',
    top: '47.0%',
    width: '32.5%',
    height: '3.3%',
  },
  {
    id: 'tho',
    name: '3. Thơ',
    left: '10.0%',
    top: '66.4%',
    width: '33.0%',
    height: '3.4%',
  },
  {
    id: 'mv',
    name: '4. Âm nhạc',
    left: '58.2%',
    top: '78.0%',
    width: '33.0%',
    height: '3.3%',
  },
  {
    id: 'tri-an',
    name: '5. Bài tri ân',
    left: '34.0%',
    top: '96.0%',
    width: '35.5%',
    height: '3.1%',
  },
];

export const InteractivePosterView: React.FC<InteractivePosterViewProps> = ({
  config,
  sections,
  onSelectSection,
  onOpenSectionQr,
}) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  return (
    <section
      aria-label="Sơ đồ Infographic Toàn cảnh Typographic"
      className="mx-auto max-w-5xl px-3 pb-12 sm:px-6"
    >
      <div className="relative overflow-hidden rounded-[2.25rem] border-4 border-amber-300 bg-gradient-to-b from-[#FFFDF6] via-[#FDF5E2] to-[#F9E8C8] p-4 sm:p-8 md:p-10 shadow-2xl">
        {/* Đầu Bảng Sơ Đồ */}
        <div className="border-b-2 border-amber-300 pb-5 text-center relative z-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-200/90 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-950 border border-amber-400">
            <Compass className="h-3.5 w-3.5 text-poster-orange" />
            Sơ Đồ Cấu Trúc Tệp Sản Phẩm Báo Tường Số 9A3
          </p>
          <h2 className="mt-2.5 font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-wide text-[#C2410C]">
            {config.newspaperTitle}
          </h2>
          <p className="mt-1 font-script text-2xl sm:text-3xl font-bold text-[#4A2511]">
            “{config.competitionTheme}” — {config.className} • {config.schoolName}
          </p>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-amber-950/80">
            👉 <em>Nhấp trực tiếp vào bất kỳ nút <strong>“NHẤP VÀO ĐÂY ĐỂ XEM”</strong> trên tranh poster dưới đây để mở từng chuyên mục</em>
          </p>
        </div>

        {/* ========================================================
            BỨC TRANH POSTER TOÀN CẢNH MINH HỌA GỐC TƯƠNG TÁC
           ======================================================== */}
        <div className="mt-8 flex flex-col items-center justify-center relative z-20">
          {/* Thanh công cụ phụ: Nút phóng to xem ảnh siêu nét */}
          <div className="mb-2.5 flex items-center justify-between w-full max-w-md sm:max-w-lg md:max-w-xl px-1">
            <span className="text-xs font-bold text-amber-950/80 flex items-center gap-1.5">
              <span>🖼️</span> Sơ đồ tương tác 5 chuyên mục
            </span>
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-white/95 px-3 py-1 text-xs font-bold text-stone-800 shadow-sm transition hover:bg-amber-100 hover:border-amber-500"
            >
              <ZoomIn className="h-3.5 w-3.5 text-poster-orange" />
              <span>Phóng to xem HD</span>
            </button>
          </div>

          <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl rounded-3xl border-4 border-amber-400 bg-amber-100 p-2 sm:p-3 shadow-2xl overflow-hidden">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-inner bg-[#fff9ed]">
              {/* Ảnh minh họa poster với độ phân giải cao 2x sắc nét */}
              <img
                data-testid="interactive-poster-image"
                src="/posters/poster-toan-canh.jpg"
                srcSet="/posters/poster-toan-canh.jpg 1x, /posters/poster-toan-canh-2x.jpg 2x"
                alt="Báo tường số Chắp Cánh Ước Mơ - Chi đội 9A3"
                className="w-full h-auto block select-none"
                style={{
                  aspectRatio: '506 / 1024',
                  imageRendering: 'auto',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
                loading="eager"
                decoding="sync"
              />

              {/* 5 Vùng Nút Bấm Tương Tác: Hoàn toàn trong suốt (Không dùng backdrop-blur hay màng màu gây mờ ảnh) */}
              {POSTER_HOTSPOTS.map((hotspot) => {
                const section = sections.find((s) => s.id === hotspot.id);
                return (
                  <motion.button
                    key={hotspot.id}
                    data-testid={`hotspot-${hotspot.id}`}
                    type="button"
                    onClick={() => onSelectSection(hotspot.id)}
                    style={{
                      left: hotspot.left,
                      top: hotspot.top,
                      width: hotspot.width,
                      height: hotspot.height,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label={`Xem chuyên mục: ${section?.badgeTitle || hotspot.name}`}
                    className="group absolute cursor-pointer rounded-full border border-amber-500/20 bg-transparent transition-all hover:border-2 hover:border-amber-400 hover:bg-amber-400/15 hover:shadow-[0_0_12px_rgba(245,158,11,0.7)] focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {/* Bàn tay chỉ dẫn trôi nhẹ khi hover */}
                    <span className="absolute -bottom-2 -right-3 pointer-events-none drop-shadow-md transition-transform group-hover:scale-110">
                      <PointerHandIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>

                    {/* Text ẩn cho trợ năng & test matcher */}
                    <span className="sr-only">NHẤP VÀO ĐÂY ĐỂ XEM {section?.badgeTitle}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Thanh Điều Hướng Nhanh Đến 5 Chuyên Mục */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 relative z-20">
          {sections.map((section) => (
            <div key={section.id} className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelectSection(section.id)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-amber-400 bg-white px-3.5 py-1.5 text-xs font-extrabold text-stone-900 shadow-sm transition hover:bg-amber-100 hover:border-amber-500"
              >
                {section.id === 'loi-ngo' && <BookOpen className="h-3.5 w-3.5 text-amber-700" />}
                {section.id === 'truyen-ngan' && <BookText className="h-3.5 w-3.5 text-emerald-700" />}
                {section.id === 'tho' && <Scroll className="h-3.5 w-3.5 text-red-700" />}
                {section.id === 'mv' && <Film className="h-3.5 w-3.5 text-sky-700" />}
                {section.id === 'tri-an' && <Heart className="h-3.5 w-3.5 text-rose-700" />}
                <span>{section.badgeTitle}</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenSectionQr(section.id)}
                aria-label={`Mã QR cho ${section.badgeTitle}`}
                className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 p-1.5 text-stone-700 hover:bg-amber-200"
              >
                <QrCode className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Khối Ban Biên Tập Chi Đội Lớp 9A3 */}
        <div className="mt-10 border-t-2 border-amber-300 pt-8 relative z-20">
          <div className="rounded-3xl border-2 border-amber-400 bg-amber-100/80 p-5 sm:p-6 text-stone-900 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-300/80 pb-4">
              <h3 className="flex items-center gap-2 font-display text-lg font-extrabold uppercase text-[#4A2511]">
                <Users className="h-5 w-5 text-poster-orange" />
                <span>Tổ Chức Thực Hiện • {config.className}</span>
              </h3>
              <p className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Đóng gói đầy đủ 05/05 thành phần báo tường điện tử</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.editorialBoard.map((m) => (
                <div key={m.role} className="rounded-2xl border border-amber-200/90 bg-white/70 p-3.5">
                  <span className="inline-block text-xs font-bold text-poster-orange">{m.role}</span>
                  <p className="font-extrabold text-sm text-stone-900 mt-0.5">{m.name}</p>
                  <p className="text-stone-600 text-[11px] mt-1 leading-relaxed">{m.task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Phóng To Xem Cận Cảnh Poster Sắc Nét HD */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsZoomModalOpen(false)}
          >
            <div
              className="relative max-w-2xl w-full my-auto bg-amber-50 rounded-2xl p-2 sm:p-4 shadow-2xl border-2 border-amber-400"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
                <p className="text-xs sm:text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                  <span>✨</span> Bản Poster Toàn Cảnh Độ Nét Cao HD
                </p>
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(false)}
                  className="rounded-full p-1 text-stone-600 hover:bg-amber-200 transition"
                  aria-label="Đóng phóng to"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-auto max-h-[82vh] rounded-xl flex justify-center bg-[#FFFDF6]">
                <img
                  src="/posters/poster-toan-canh-2x.jpg"
                  alt="Poster Chắp Cánh Ước Mơ HD"
                  className="w-full max-w-xl h-auto block rounded-lg shadow-inner"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
