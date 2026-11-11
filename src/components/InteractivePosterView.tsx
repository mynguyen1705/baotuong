import React from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import { BaoTuongConfig, SectionData, SectionId } from '../types/baotuong';
import { PointerHandIcon } from './PosterDecorations';
import { VintageBookStackSVG } from './SchoolDecorations';

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
    top: '93.9%',
    width: '36.0%',
    height: '3.4%',
  },
];

export const InteractivePosterView: React.FC<InteractivePosterViewProps> = ({
  config,
  sections,
  onSelectSection,
  onOpenSectionQr,
}) => {
  return (
    <section
      aria-label="Sơ đồ Infographic Toàn cảnh Typographic"
      className="mx-auto max-w-5xl px-3 pb-12 sm:px-6"
    >
      <div className="relative overflow-hidden rounded-[2.25rem] border-4 border-amber-300 bg-gradient-to-b from-[#FFFDF6] via-[#FDF5E2] to-[#F9E8C8] p-4 sm:p-8 md:p-10 shadow-2xl">
        {/* Góc trang trí sách vở */}
        <div className="pointer-events-none absolute -top-4 -right-4 z-10 hidden sm:block opacity-75">
          <VintageBookStackSVG className="w-24 h-24" />
        </div>

        {/* Đầu Bảng Sơ Đồ */}
        <div className="border-b-2 border-amber-300 pb-5 text-center relative z-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-200/90 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-950 border border-amber-400">
            <Compass className="h-3.5 w-3.5 text-poster-orange" />
            Sơ Đồ Cấu Trúc Tệp Sản Phẩm Báo Tường Số 9A3
          </p>
          <h2 className="mt-2.5 title-3d-orange text-3xl sm:text-5xl tracking-wide">
            {config.newspaperTitle}
          </h2>
          <p className="mt-1 font-script text-2xl sm:text-3xl font-bold text-[#4A2511]">
            “{config.competitionTheme}” — {config.className} • {config.schoolName}
          </p>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-amber-950/80">
            👉 <em>Nhấp trực tiếp vào các nút chuyên mục trên tranh poster dưới đây để mở từng nội dung</em>
          </p>
        </div>

        {/* ========================================================
            BỨC TRANH POSTER TOÀN CẢNH MINH HỌA GỐC TƯƠNG TÁC
           ======================================================== */}
        <div className="mt-8 flex justify-center relative z-20">
          <div className="relative w-full max-w-xl md:max-w-2xl rounded-3xl border-4 border-amber-400 bg-amber-100 p-2 sm:p-3 shadow-2xl overflow-hidden">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-inner bg-[#fff9ed]">
              {/* Ảnh minh họa poster gốc với tối ưu độ sắc nét và chống vỡ hình */}
              <img
                data-testid="interactive-poster-image"
                src="/posters/poster-toan-canh.jpg"
                alt="Báo tường số Chắp Cánh Ước Mơ - Chi đội 9A3"
                className="w-full h-auto block select-none"
                style={{
                  aspectRatio: '506 / 1024',
                  imageRendering: '-webkit-optimize-contrast',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
                loading="eager"
                decoding="async"
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
                    className="group absolute cursor-pointer rounded-lg border border-teal-500/30 bg-transparent transition-all hover:border-2 hover:border-emerald-400 hover:bg-emerald-400/10 hover:shadow-[0_0_12px_rgba(16,185,129,0.7)] focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
    </section>
  );
};
