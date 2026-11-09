import React, { useRef } from 'react';
import { Camera, ExternalLink, PlusCircle, Sparkles, Trash2, Users } from 'lucide-react';
import { TeacherProfile } from '../types/teachers';
import { TeacherAvatarIllustration } from './TeacherAvatarIllustration';
import { DecoPolaroidFrame } from './DecoPolaroidFrame';
import { fileToImageDataUrl } from '../utils/imageDataUrl';

export interface TeacherSummaryBoardSectionProps {
  teachers: TeacherProfile[];
  isOwner?: boolean;
  onSelectTeacher: (teacher: TeacherProfile) => void;
  onOpenForm: (preselectedTeacherId?: string) => void;
  onOpenFullBoard?: () => void;
  onUpdateTeacherPhoto?: (teacherId: string, photoDataUrl: string) => void;
  onDeleteTeacher?: (teacherId: string) => void;
  isStandaloneModal?: boolean;
}

/**
 * Tách nhãn sticker thành 2 dòng cân đối giống hệt Poster mẫu:
 * - "Siêu vui tính!" -> ["Siêu", "vui tính!"]
 * - "Nhẹ nhàng & ấm áp" -> ["Nhẹ nhàng", "& ấm áp"]
 * - "Nhiều năng lượng!" -> ["Nhiều", "năng lượng!"]
 * - "Tỉ mỉ & dễ thương" -> ["Tỉ mỉ &", "dễ thương"]
 * - "Rất yêu thiên nhiên" -> ["Rất yêu", "thiên nhiên"]
 * - "Người kể chuyện" -> ["Người kể", "chuyện"]
 */
function splitStickerLines(rawText: string): [string, string?] {
  const cleaned = rawText.trim();
  const presetMap: Record<string, [string, string]> = {
    'siêu vui tính!': ['Siêu', 'vui tính!'],
    'nhẹ nhàng & ấm áp': ['Nhẹ nhàng', '& ấm áp'],
    'nhiều năng lượng!': ['Nhiều', 'năng lượng!'],
    'tỉ mỉ & dễ thương': ['Tỉ mỉ &', 'dễ thương'],
    'rất yêu thiên nhiên': ['Rất yêu', 'thiên nhiên'],
    'người kể chuyện': ['Người kể', 'chuyện'],
  };

  const lower = cleaned.toLowerCase();
  if (presetMap[lower]) {
    return presetMap[lower];
  }

  const words = cleaned.split(/\s+/);
  if (words.length <= 1) {
    return [cleaned];
  }
  if (words.length === 2) {
    return [words[0], words[1]];
  }
  if (words.length === 3) {
    // Nếu từ đầu ngắn ("Siêu", "Nhiều"), ưu tiên 1 từ dòng trên + 2 từ dòng dưới
    if (words[0].length <= 5) {
      return [words[0], `${words[1]} ${words[2]}`];
    }
    return [`${words[0]} ${words[1]}`, words[2]];
  }

  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

interface PolaroidDieCutStickerProps {
  text: string;
  side: 'left' | 'right';
  onClick?: () => void;
}

/**
 * Nhãn dán Die-Cut 2 dòng chữ trắng viền nâu đậm và viền sticker cam ôm sát контур chữ
 * giống hệt ảnh mẫu Bảng Tổng Hợp Giáo Viên Bộ Môn.
 */
const PolaroidDieCutSticker: React.FC<PolaroidDieCutStickerProps> = ({
  text,
  side,
  onClick,
}) => {
  const [line1, line2] = splitStickerLines(text);
  const positionClass =
    side === 'left'
      ? '-left-3 sm:-left-6 top-[46%] -translate-y-1/2 -rotate-[4deg]'
      : '-right-3 sm:-right-6 top-[40%] -translate-y-1/2 -rotate-[3deg]';

  const renderLines = () => (
    <>
      <span className="block whitespace-nowrap">{line1}</span>
      {line2 && <span className="block whitespace-nowrap -mt-0.5">{line2}</span>}
    </>
  );

  return (
    <div
      onClick={onClick}
      className={`absolute z-20 cursor-pointer select-none ${positionClass}`}
      style={{
        filter:
          'drop-shadow(0 2px 0 #4a1406) drop-shadow(0 -1px 0 #4a1406) drop-shadow(1.5px 0 0 #4a1406) drop-shadow(-1.5px 0 0 #4a1406) drop-shadow(0 4px 6px rgba(0,0,0,0.28))',
      }}
    >
      <div className="relative inline-block text-center font-display text-[15px] sm:text-[17px] font-black leading-[1.12] tracking-tight">
        {/* Lớp 1 (Ngoài cùng): Viền cam đất ôm sát chữ tạo hiệu ứng giấy dán die-cut */}
        <span
          aria-hidden="true"
          className="pointer-events-none block select-none text-transparent"
          style={{
            WebkitTextStroke: '13px #e8632c',
            paintOrder: 'stroke fill',
            strokeLinejoin: 'round',
          }}
        >
          {renderLines()}
        </span>

        {/* Lớp 2 (Giữa): Viền nâu sẫm bao quanh thân chữ */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block select-none text-transparent"
          style={{
            WebkitTextStroke: '5.5px #4a1406',
            paintOrder: 'stroke fill',
            strokeLinejoin: 'round',
          }}
        >
          {renderLines()}
        </span>

        {/* Lớp 3 (Trên cùng): Chữ trắng kem sắc nét */}
        <span
          className="absolute inset-0 block text-[#fffdf9]"
          style={{
            textShadow: '0 1px 0 #4a1406',
          }}
        >
          <span className="block whitespace-nowrap">
            {line1}
            {line2 ? ' ' : ''}
          </span>
          {line2 && <span className="block whitespace-nowrap -mt-0.5">{line2}</span>}
        </span>
      </div>
    </div>
  );
};

export const TeacherSummaryBoardSection: React.FC<TeacherSummaryBoardSectionProps> = ({
  teachers,
  isOwner = true,
  onSelectTeacher,
  onOpenForm,
  onOpenFullBoard,
  onUpdateTeacherPhoto,
  onDeleteTeacher,
  isStandaloneModal = false,
}) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = async (
    teacherId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !onUpdateTeacherPhoto) return;
    try {
      const dataUrl = await fileToImageDataUrl(file);
      if (dataUrl) {
        onUpdateTeacherPhoto(teacherId, dataUrl);
      }
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section
      id="khu-vuc-bang-giao-vien"
      aria-label="Bảng tổng hợp giáo viên bộ môn"
      className={`relative mx-auto w-full ${
        isStandaloneModal ? 'max-w-4xl' : 'max-w-5xl px-3 sm:px-6 py-8 sm:py-12'
      }`}
    >
      {/* Khung Poster Nền Xanh Da Trời Chuẩn Ảnh Mẫu */}
      <div
        className="relative overflow-hidden rounded-[2rem] border-4 border-sky-300 shadow-2xl"
        style={{
          background:
            'radial-gradient(circle at 50% 12%, #bfeaff 0%, #63c5fa 38%, #2fa4ea 78%, #1d87cc 100%)',
        }}
      >
        {/* Hiệu ứng tia sáng chéo nhẹ phía trên */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(125deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 18px, transparent 18px, transparent 56px)',
          }}
        />

        {/* Tập hồ sơ vàng lót phía sau bên phải & mép giấy xanh bên trái */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-52 bottom-16 w-12 rounded-r-2xl bg-amber-300/90 border-2 border-stone-800/30 rotate-[2deg] hidden sm:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1 top-64 bottom-24 w-8 rounded-l-xl bg-sky-200/90 border border-stone-700/20 -rotate-[2deg] hidden sm:block"
        />

        {/* Doodle góc trên trái: 3 ngôi sao vẽ tay */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 110"
          className="pointer-events-none absolute left-3 top-4 h-16 w-16 sm:h-24 sm:w-24 z-10"
        >
          <polygon
            points="24,10 28,20 39,20 30,27 33,38 24,31 15,38 18,27 9,20 20,20"
            fill="#fde047"
            stroke="#1e293b"
            strokeWidth="2.5"
          />
          <polygon
            points="72,18 78,34 95,34 81,44 86,60 72,50 58,60 63,44 49,34 66,34"
            fill="#fb7185"
            stroke="#1e293b"
            strokeWidth="3"
          />
          <polygon
            points="42,56 49,73 68,75 53,86 58,104 42,93 26,104 31,86 16,75 35,73"
            fill="#34d399"
            stroke="#1e293b"
            strokeWidth="3"
          />
        </svg>

        {/* Doodle góc trên phải: Nốt nhạc đôi */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="pointer-events-none absolute right-3 top-4 h-16 w-16 sm:h-24 sm:w-24 z-10"
        >
          <g stroke="#1e293b" strokeWidth="3.2" fill="#93c5fd">
            <path d="M35,55 L35,16 L58,24" fill="none" />
            <ellipse cx="26" cy="56" rx="11" ry="8" transform="rotate(-18 26 56)" />
          </g>
          <g stroke="#1e293b" strokeWidth="3.2" fill="#fde047" transform="translate(36, 38)">
            <path d="M25,52 L25,14 L68,6 L68,44" fill="none" strokeWidth="5" />
            <ellipse cx="16" cy="54" rx="11" ry="8" transform="rotate(-18 16 54)" />
            <ellipse cx="59" cy="46" rx="11" ry="8" transform="rotate(-18 59 46)" />
          </g>
        </svg>

        {/* Phần Header: Chữ nổi 3D Trắng Viền Xanh + Băng keo vàng */}
        <div className="relative z-10 pt-7 sm:pt-10 pb-3 px-4 text-center">
          <div className="inline-block rounded-3xl bg-[#1678c2] px-5 sm:px-9 py-2.5 sm:py-3.5 shadow-[0_8px_0_#0c4a7d,0_14px_24px_rgba(0,0,0,0.22)] border-4 border-white/90">
            <h2
              className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wide text-white leading-tight"
              style={{
                textShadow:
                  '0 3px 0 #0d5c96, 0 6px 0 #083b63, 2px 2px 0 #0d5c96, -2px -2px 0 #0d5c96',
              }}
            >
              <span className="block">BẢNG TỔNG HỢP</span>
              <span className="block mt-0.5">GIÁO VIÊN BỘ MÔN</span>
            </h2>
          </div>

          {/* Dải băng keo vàng Năm Học Mới • Chi Đội 9A3 */}
          <div className="mt-3 flex justify-center">
            <div
              className="relative inline-block -rotate-[1deg] bg-[#fde047] px-6 sm:px-10 py-1.5 sm:py-2 shadow-md border border-amber-400/80"
              style={{
                clipPath:
                  'polygon(2% 0%, 98% 2%, 100% 25%, 97% 50%, 100% 78%, 98% 100%, 2% 98%, 0% 72%, 3% 48%, 0% 22%)',
              }}
            >
              <p className="font-display text-sm sm:text-xl font-extrabold text-stone-900 tracking-tight">
                Năm Học Mới • Chi Đội 9A3
              </p>
            </div>
          </div>

          {/* Thanh tác vụ: Nút Thêm giáo viên chỉ hiển thị cho chủ sở hữu (isOwner) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {isOwner && (
              <button
                type="button"
                onClick={() => onOpenForm()}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-amber-500 px-4 py-1.5 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:bg-amber-600"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Thêm giáo viên & ảnh (Quyền Chủ Sở Hữu)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenForm(teachers[0]?.id)}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-sky-900/20 bg-white/95 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-950 shadow-sm transition hover:bg-sky-50"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Điền biểu mẫu tính cách giáo viên</span>
            </button>
            {!isStandaloneModal && onOpenFullBoard && (
              <button
                type="button"
                onClick={onOpenFullBoard}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/80 bg-sky-900/80 px-4 py-1.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-sky-950"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Trang xem cho Thầy Cô ({teachers.length} giáo viên)</span>
              </button>
            )}
          </div>
        </div>

        {/* Tờ Giấy Vở Kẻ Ngang Đặt Hơi Nghiêng Chuẩn Poster */}
        <div className="relative z-10 mx-2 sm:mx-8 mt-2 mb-16 sm:mb-20">
          <div
            className="relative rounded-xl border-2 border-stone-300 bg-white px-3 sm:px-8 pt-8 pb-12 shadow-[0_18px_40px_rgba(12,74,110,0.32)] sm:-rotate-[0.6deg]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, #bae6fd 31px, #bae6fd 33px)',
              backgroundPositionY: '18px',
            }}
          >
            {/* Lề đỏ dọc bên trái của trang vở học trò */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-6 sm:left-12 w-[2px] bg-rose-300/70"
            />

            {/* Ghim kẹp giấy vàng góc trên trái & bạc góc trên phải */}
            <svg
              aria-hidden="true"
              viewBox="0 0 50 110"
              className="pointer-events-none absolute -top-7 left-5 sm:left-10 h-16 w-8 -rotate-6"
            >
              <path
                d="M15,75 L15,20 C15,8 35,8 35,20 L35,85 C35,100 10,100 10,85 L10,32 C10,24 26,24 26,32 L26,72"
                fill="none"
                stroke="#eab308"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </svg>
            <svg
              aria-hidden="true"
              viewBox="0 0 50 110"
              className="pointer-events-none absolute -top-7 right-6 sm:right-12 h-16 w-8 rotate-12"
            >
              <path
                d="M15,75 L15,20 C15,8 35,8 35,20 L35,85 C35,100 10,100 10,85 L10,32 C10,24 26,24 26,32 L26,72"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Doodle trang trí xen kẽ trên giấy vở: Trái tim, Hình nón, Bình thí nghiệm, Chuỗi ADN, Ngôi sao, Công thức Toán */}
            <svg
              aria-hidden="true"
              viewBox="0 0 60 60"
              className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 h-10 w-10 hidden md:block"
            >
              <path
                d="M30,48 C30,48 10,34 10,20 C10,12 18,8 25,14 C28,16 30,19 30,19 C30,19 32,16 35,14 C42,8 50,12 50,20 C50,34 30,48 30,48 Z"
                fill="#fb7185"
                stroke="#1e293b"
                strokeWidth="2.5"
              />
            </svg>

            {/* Hình nón hình học bên lề trái */}
            <svg
              aria-hidden="true"
              viewBox="0 0 70 70"
              className="pointer-events-none absolute left-1 top-[31%] h-12 w-12 hidden sm:block"
            >
              <polygon
                points="35,8 12,54 58,54"
                fill="#e0f2fe"
                stroke="#1e293b"
                strokeWidth="2.2"
              />
              <ellipse
                cx="35"
                cy="54"
                rx="23"
                ry="7"
                fill="#bae6fd"
                stroke="#1e293b"
                strokeWidth="2.2"
              />
            </svg>

            {/* Bình tam giác thí nghiệm Hóa/Sinh bên lề trái dưới */}
            <svg
              aria-hidden="true"
              viewBox="0 0 70 80"
              className="pointer-events-none absolute left-1 top-[64%] h-14 w-14 -rotate-12 hidden sm:block"
            >
              <circle cx="34" cy="12" r="3" fill="none" stroke="#1e293b" strokeWidth="2" />
              <circle cx="42" cy="6" r="2.5" fill="none" stroke="#1e293b" strokeWidth="2" />
              <path
                d="M28,18 L42,18 L42,30 L56,64 C58,69 55,73 49,73 L21,73 C15,73 12,69 14,64 L28,30 Z"
                fill="#ffffff"
                stroke="#1e293b"
                strokeWidth="2.4"
              />
              <path d="M18,56 L52,56 L55,66 L15,66 Z" fill="#a5b4fc" />
            </svg>

            {/* Chuỗi xoắn ADN ở giữa trang */}
            <svg
              aria-hidden="true"
              viewBox="0 0 60 100"
              className="pointer-events-none absolute left-1/2 top-[62%] -translate-x-1/2 h-16 w-12 rotate-12 hidden md:block"
            >
              <path
                d="M15,10 C45,30 15,70 45,90"
                fill="none"
                stroke="#ec4899"
                strokeWidth="3.5"
              />
              <path
                d="M45,10 C15,30 45,70 15,90"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
              />
              <line x1="22" y1="22" x2="38" y2="22" stroke="#1e293b" strokeWidth="2" />
              <line x1="20" y1="50" x2="40" y2="50" stroke="#1e293b" strokeWidth="2" />
              <line x1="22" y1="78" x2="38" y2="78" stroke="#1e293b" strokeWidth="2" />
            </svg>

            {/* Lưới 2 Cột Các Thẻ Polaroid Giáo Viên */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 sm:gap-y-12 px-3 sm:px-8">
              {teachers.map((teacher, index) => {
                const tiltClass =
                  index % 2 === 0
                    ? 'sm:-rotate-[2deg] hover:rotate-0'
                    : 'sm:rotate-[2deg] hover:rotate-0';

                return (
                  <article
                    key={teacher.id}
                    className={`group flex flex-col items-center transition duration-300 ${tiltClass}`}
                  >
                    {/* Khung Polaroid Trang Trí Pastel Deco (6 mẫu luân phiên) */}
                    <DecoPolaroidFrame
                      index={index}
                      onClick={() => onSelectTeacher(teacher)}
                      sticker={
                        <PolaroidDieCutSticker
                          text={teacher.badgeText}
                          side={teacher.badgeSide}
                          onClick={() => onSelectTeacher(teacher)}
                        />
                      }
                      caption={
                        <h3 className="font-display text-sm sm:text-base font-black uppercase tracking-tight text-stone-900 leading-snug">
                          {teacher.subject} - {teacher.honorificAndName}
                        </h3>
                      }
                    >
                      <div
                        onClick={() => onSelectTeacher(teacher)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectTeacher(teacher);
                          }
                        }}
                        aria-label={`Xem chi tiết tính cách ${teacher.subject} - ${teacher.honorificAndName}`}
                        className="relative h-full w-full cursor-pointer"
                      >
                        <TeacherAvatarIllustration
                          photoUrl={teacher.photoUrl}
                          theme={teacher.avatarTheme}
                          honorificAndName={teacher.honorificAndName}
                          subject={teacher.subject}
                          className="h-full w-full transition duration-300 group-hover:scale-105"
                        />

                        {/* Gợi ý nhấp xem hồ sơ chi tiết */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                          <span className="text-[11px] font-bold text-white">
                            Nhấp để xem tính cách & kỷ niệm ({teacher.impressions.length})
                          </span>
                        </div>
                      </div>
                    </DecoPolaroidFrame>

                    {/* 2 Dòng Mô Tả Ngắn Bên Dưới Khung Polaroid */}
                    <p
                      onClick={() => onSelectTeacher(teacher)}
                      className="mt-2.5 max-w-[280px] cursor-pointer text-center font-sans text-xs sm:text-sm font-bold text-stone-800 leading-snug hover:text-sky-900"
                    >
                      {teacher.summary}
                    </p>

                    {/* Thanh nút dưới thẻ: Học sinh xem hồ sơ; Chủ sở hữu (isOwner) có thêm nút Đổi ảnh & Xóa giáo viên */}
                    <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectTeacher(teacher)}
                        className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-900 hover:bg-sky-200"
                      >
                        <Users className="h-3 w-3" />
                        <span>Hồ sơ ({teacher.impressions.length})</span>
                      </button>

                      {isOwner && onUpdateTeacherPhoto && (
                        <>
                          <input
                            ref={(el) => {
                              fileInputRefs.current[teacher.id] = el;
                            }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            aria-label={`Tải ảnh mới cho ${teacher.honorificAndName}`}
                            onChange={(e) => handleFileChange(teacher.id, e)}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[teacher.id]?.click()}
                            title="Thêm hoặc đổi ảnh giáo viên này (Chỉ dành cho chủ sở hữu)"
                            className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 hover:bg-amber-100"
                          >
                            <Camera className="h-3 w-3 text-amber-700" />
                            <span>{teacher.photoUrl ? 'Đổi ảnh' : 'Thêm ảnh'}</span>
                          </button>
                        </>
                      )}

                      {isOwner && onDeleteTeacher && (
                        <button
                          type="button"
                          onClick={() => onDeleteTeacher(teacher.id)}
                          aria-label={`Xóa giáo viên ${teacher.honorificAndName}`}
                          title="Xóa giáo viên này khỏi bảng tổng hợp (Chỉ dành cho chủ sở hữu)"
                          className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Công thức viết tay toán √học² góc dưới phải của tờ giấy */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-6 -rotate-12 font-serif text-base sm:text-lg italic font-bold text-stone-700"
            >
              toán √<span className="underline decoration-stone-700">học²</span>
            </div>
          </div>
        </div>

        {/* Giấy Nhớ Màu Vàng Góc Dưới Trái Chuẩn Poster Mẫu */}
        <div className="relative z-20 -mt-12 sm:-mt-14 mb-5 px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="relative -rotate-[2deg] rounded-sm bg-[#fde047] px-5 sm:px-7 py-3.5 shadow-[0_10px_20px_rgba(0,0,0,0.22)] border border-amber-400 max-w-md">
            <p className="font-handwriting text-lg sm:text-2xl font-bold text-stone-900 leading-snug text-center">
              Chào mừng các em học sinh
              <br />
              đến với năm học mới !
            </p>
          </div>

          {/* Thông tin phân quyền & đồng bộ góc dưới phải */}
          <div className="rounded-2xl border border-white/60 bg-white/90 px-4 py-2.5 text-xs text-stone-700 shadow-md backdrop-blur-sm">
            <p className="font-bold text-sky-950">
              {isOwner
                ? 'Quyền Chủ Sở Hữu (Localhost): Được phép thêm / bớt giáo viên & đổi ảnh'
                : 'Chế độ Khách / Học Sinh: Xem bảng tổng hợp & gửi cảm nhận tính cách'}
            </p>
            <p className="mt-0.5 text-[11px] text-stone-600">
              Mọi thay đổi từ máy chủ của bạn được đồng bộ trực tiếp sang thiết bị của thầy cô.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
