import React from 'react';

export type DecoFrameVariant =
  | 'yellow-rainbow'
  | 'blue-cute'
  | 'mint-cool'
  | 'gradient-bestfriend'
  | 'lavender-star'
  | 'peach-sunshine';

const DECO_VARIANTS: DecoFrameVariant[] = [
  'yellow-rainbow',
  'blue-cute',
  'mint-cool',
  'gradient-bestfriend',
  'lavender-star',
  'peach-sunshine',
];

export function getDecoVariantByIndex(index: number): DecoFrameVariant {
  return DECO_VARIANTS[Math.abs(index) % DECO_VARIANTS.length];
}

export interface DecoPolaroidFrameProps {
  variant?: DecoFrameVariant;
  index?: number;
  beadWord?: string;
  caption: React.ReactNode;
  sticker?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Khung ảnh Polaroid trang trí phong cách Deco Hàn Quốc (lấy cảm hứng trực tiếp từ bộ 4 khung mẫu:
 * Vàng Cầu Vồng, Xanh Periwinkle Cute, Xanh Mint Dâu/Chanh/Cherry, Hồng-Xanh Pastel Tulip & Smiley,
 * cộng thêm 2 biến thể sáng tạo Tím Lavender Ánh Sao và Cam Đào Nắng Mai).
 */
export const DecoPolaroidFrame: React.FC<DecoPolaroidFrameProps> = ({
  variant,
  index = 0,
  beadWord,
  caption,
  sticker,
  children,
  onClick,
  className = '',
}) => {
  const activeVariant = variant || getDecoVariantByIndex(index);

  const frameStyles: Record<
    DecoFrameVariant,
    {
      bgStyle: React.CSSProperties;
      borderClass: string;
      defaultBeads: string[];
      beadColor: string;
      captionPillClass: string;
    }
  > = {
    'yellow-rainbow': {
      bgStyle: {
        background: 'linear-gradient(180deg, #f6f89b 0%, #f3f589 100%)',
      },
      borderClass: 'border-[#d9dc62]',
      defaultBeads: ['9', 'A', '3', '★'],
      beadColor: '#38bdf8',
      captionPillClass: 'bg-white/80 text-stone-900 border border-amber-300/70',
    },
    'blue-cute': {
      bgStyle: {
        background: 'linear-gradient(180deg, #65769c 0%, #58698f 100%)',
      },
      borderClass: 'border-[#475678]',
      defaultBeads: ['C', 'U', 'T', 'E'],
      beadColor: '#fb7185',
      captionPillClass: 'bg-white/95 text-stone-900 border border-sky-200',
    },
    'mint-cool': {
      bgStyle: {
        background: 'linear-gradient(180deg, #e0f9d6 0%, #d3f4c6 100%)',
      },
      borderClass: 'border-[#a7e195]',
      defaultBeads: ['C', 'O', 'O', 'L'],
      beadColor: '#6366f1',
      captionPillClass: 'bg-white/85 text-stone-900 border border-emerald-200',
    },
    'gradient-bestfriend': {
      bgStyle: {
        background: 'linear-gradient(180deg, #fbd2c9 0%, #f7e3dc 48%, #c7f4fa 100%)',
      },
      borderClass: 'border-[#ebb7ae]',
      defaultBeads: ['L', 'O', 'V', 'E'],
      beadColor: '#ec4899',
      captionPillClass: 'bg-white/85 text-stone-900 border border-sky-200/80',
    },
    'lavender-star': {
      bgStyle: {
        background: 'linear-gradient(180deg, #ead6ff 0%, #f3e8ff 55%, #fde2f3 100%)',
      },
      borderClass: 'border-[#cfaefa]',
      defaultBeads: ['S', 'T', 'A', 'R'],
      beadColor: '#8b5cf6',
      captionPillClass: 'bg-white/85 text-stone-900 border border-purple-200',
    },
    'peach-sunshine': {
      bgStyle: {
        background: 'linear-gradient(180deg, #ffe2c6 0%, #fff1cc 55%, #dcfce7 100%)',
      },
      borderClass: 'border-[#f6bd8c]',
      defaultBeads: ['H', 'E', 'R', 'O'],
      beadColor: '#ea580c',
      captionPillClass: 'bg-white/85 text-stone-900 border border-orange-200',
    },
  };

  const currentStyle = frameStyles[activeVariant];
  const beads = beadWord
    ? beadWord.split('').slice(0, 5)
    : currentStyle.defaultBeads;

  return (
    <div
      style={currentStyle.bgStyle}
      className={`relative w-full max-w-[292px] rounded-[6px] border-2 ${currentStyle.borderClass} p-3.5 pb-5 shadow-[0_12px_26px_rgba(15,23,42,0.2)] transition duration-300 group-hover:shadow-[0_16px_32px_rgba(15,23,42,0.28)] ${className}`}
    >
      {/* Khung cửa sổ ảnh vuông ở trung tâm */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[2px] border border-black/15 bg-emerald-950 shadow-inner">
        {children}
      </div>

      {/* Họa tiết SVG Deco trang trí đè lên viền và góc khung theo đúng mẫu */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 350"
        className="pointer-events-none absolute inset-0 h-full w-full z-10 overflow-visible"
      >
        {/* 1. KHUNG VÀNG CẦU VỒNG (Top-Left của ảnh mẫu) */}
        {activeVariant === 'yellow-rainbow' && (
          <g>
            {/* Dải ruy băng hồng lượn sóng góc trên phải */}
            <path
              d="M195,4 C188,28 216,38 228,18 C240,-2 268,14 262,40 C256,64 282,72 296,60"
              fill="none"
              stroke="#f9a8d4"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M210,4 C205,22 225,30 236,14 C248,-2 272,12 267,35 C262,55 282,62 296,52"
              fill="none"
              stroke="#f472b6"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Chuỗi 4 trái tim dọc góc trên trái (Đỏ cam, Vàng, Xanh dương, Tím) */}
            <path
              d="M18,28 C18,28 8,21 8,14 C8,9 13,7 16,11 C17,12 18,14 18,14 C18,14 19,12 20,11 C23,7 28,9 28,14 C28,21 18,28 18,28 Z"
              fill="#f87171"
            />
            <path
              d="M19,50 C19,50 11,44 11,39 C11,35 15,34 17,37 C18,38 19,39 19,39 C19,39 20,38 21,37 C23,34 27,35 27,39 C27,44 19,50 19,50 Z"
              fill="#facc15"
            />
            <path
              d="M18,74 C18,74 9,67 9,61 C9,57 14,55 16,58 C17,59 18,61 18,61 C18,61 19,59 20,58 C22,55 27,57 27,61 C27,67 18,74 18,74 Z"
              fill="#7dd3fc"
            />
            <path
              d="M18,96 C18,96 11,90 11,85 C11,82 15,80 17,83 C18,84 18,85 18,85 C18,85 19,84 20,83 C22,80 25,82 25,85 C25,90 18,96 18,96 Z"
              fill="#c084fc"
            />

            {/* Bông hoa vàng mặt cười góc dưới phải của ảnh */}
            <g transform="translate(262, 224)">
              <circle cx="0" cy="-14" r="9" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
              <circle cx="13" cy="-5" r="9" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
              <circle cx="8" cy="11" r="9" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
              <circle cx="-8" cy="11" r="9" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
              <circle cx="-13" cy="-5" r="9" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="-3.5" cy="-2" r="1.4" fill="#713f12" />
              <circle cx="3.5" cy="-2" r="1.4" fill="#713f12" />
              <path d="M-3,2 Q0,5 3,2" fill="none" stroke="#713f12" strokeWidth="1.4" strokeLinecap="round" />
            </g>

            {/* Dải ruy băng hồng góc dưới trái */}
            <path
              d="M4,264 C28,255 38,278 24,296 C10,312 36,326 60,312 C78,302 88,325 82,346"
              fill="none"
              stroke="#f9a8d4"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d="M4,274 C24,266 32,284 20,298 C8,312 32,324 52,314 C68,306 76,326 70,346"
              fill="none"
              stroke="#f472b6"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Cầu vồng pastel góc dưới phải */}
            <g transform="translate(248, 326) rotate(-8)">
              <path d="M-32,12 A32,32 0 0,1 32,12" fill="none" stroke="#f472b6" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M-25,12 A25,25 0 0,1 25,12" fill="none" stroke="#facc15" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M-18,12 A18,18 0 0,1 18,12" fill="none" stroke="#60a5fa" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M-11,12 A11,11 0 0,1 11,12" fill="none" stroke="#4ade80" strokeWidth="5.5" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 2. KHUNG XANH PERIWINKLE CUTE (Top-Right của ảnh mẫu) */}
        {activeVariant === 'blue-cute' && (
          <g>
            {/* Dải xoắn xanh nhạt góc trên trái */}
            <path
              d="M12,6 C34,14 8,28 32,36 C52,42 10,56 34,66 C50,72 14,86 30,94"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            {/* Dải xoắn xanh dương góc trên phải */}
            <path
              d="M255,6 C238,22 278,28 256,44 C236,58 282,62 266,78 C254,88 286,90 294,80"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Chấm tròn trắng như tuyết rơi */}
            <circle cx="28" cy="145" r="7" fill="#ffffff" />
            <circle cx="282" cy="118" r="8" fill="#ffffff" />
            <circle cx="278" cy="176" r="5.5" fill="#ffffff" />

            {/* Dải ruy băng hồng uốn hình trái tim góc dưới phải */}
            <path
              d="M168,286 C192,272 218,298 246,288 C268,280 286,252 272,236 C258,222 244,242 248,254 C252,242 232,226 222,242 C210,260 236,280 256,274"
              fill="none"
              stroke="#f472b6"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dải xoắn xanh góc dưới trái */}
            <path
              d="M6,256 C28,252 16,276 38,270 C54,266 42,290 56,286"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            {/* Hoa sao vàng nhỏ */}
            <circle cx="24" cy="228" r="6" fill="#facc15" />
            <circle cx="212" cy="255" r="5" fill="#facc15" />
            <circle cx="272" cy="206" r="5" fill="#facc15" />
          </g>
        )}

        {/* 3. KHUNG XANH MINT COOL - DÂU TÂY, CHANH VÀNG & CHERRY (Bottom-Left của ảnh mẫu) */}
        {activeVariant === 'mint-cool' && (
          <g>
            {/* Dâu tây đỏ góc trên trái + lá xanh */}
            <g transform="translate(20, 26)">
              <path
                d="M-9,-6 C-12,4 -6,14 0,16 C6,14 12,4 9,-6 C5,-10 -5,-10 -9,-6 Z"
                fill="#ef4444"
              />
              <path d="M-7,-7 Q0,-13 7,-7 Q0,-4 -7,-7 Z" fill="#22c55e" />
              <circle cx="-3" cy="0" r="1" fill="#fef08a" />
              <circle cx="3" cy="1" r="1" fill="#fef08a" />
              <circle cx="0" cy="6" r="1" fill="#fef08a" />
            </g>
            {/* Lá non dọc viền trên */}
            <ellipse cx="42" cy="12" rx="6" ry="3" transform="rotate(-25 42 12)" fill="#84cc16" />
            <ellipse cx="64" cy="22" rx="7" ry="3.5" transform="rotate(20 64 22)" fill="#a3e635" />
            <ellipse cx="252" cy="14" rx="7" ry="3.5" transform="rotate(-20 252 14)" fill="#a3e635" />
            <ellipse cx="276" cy="24" rx="6" ry="3.5" transform="rotate(30 276 24)" fill="#84cc16" />
            <ellipse cx="282" cy="48" rx="7" ry="3.5" transform="rotate(-40 282 48)" fill="#a3e635" />

            {/* Quả chanh vàng & hoa đỏ góc dưới phải */}
            <g transform="translate(260, 276) rotate(-18)">
              <ellipse cx="0" cy="0" rx="16" ry="12" fill="#facc15" />
              <circle cx="-16" cy="0" r="3" fill="#facc15" />
              <circle cx="16" cy="0" r="3" fill="#facc15" />
              <ellipse cx="-8" cy="-12" rx="6" ry="3" transform="rotate(-30 -8 -12)" fill="#4ade80" />
            </g>
            <g transform="translate(278, 240)">
              <circle cx="0" cy="-7" r="5.5" fill="#f87171" />
              <circle cx="7" cy="-2" r="5.5" fill="#f87171" />
              <circle cx="4" cy="6" r="5.5" fill="#f87171" />
              <circle cx="-4" cy="6" r="5.5" fill="#f87171" />
              <circle cx="-7" cy="-2" r="5.5" fill="#f87171" />
              <circle cx="0" cy="0" r="3.5" fill="#fef08a" />
            </g>

            {/* Đôi quả Cherry đỏ góc dưới trái */}
            <g transform="translate(38, 326)">
              <path d="M-7,2 Q-2,-14 4,-18 M7,2 Q4,-10 4,-18" fill="none" stroke="#15803d" strokeWidth="2" />
              <circle cx="-7" cy="5" r="6" fill="#ef4444" />
              <circle cx="7" cy="5" r="6" fill="#ef4444" />
            </g>
          </g>
        )}

        {/* 4. KHUNG GRADIENT HỒNG - XANH BEST FRIEND - SMILEY & HOA TULIP (Bottom-Right của ảnh mẫu) */}
        {activeVariant === 'gradient-bestfriend' && (
          <g>
            {/* Cụm 3 bông hoa góc trên trái */}
            <g transform="translate(22, 22)">
              <circle cx="0" cy="-6" r="5" fill="#ef4444" />
              <circle cx="6" cy="-1" r="5" fill="#ef4444" />
              <circle cx="3" cy="5" r="5" fill="#ef4444" />
              <circle cx="-3" cy="5" r="5" fill="#ef4444" />
              <circle cx="-6" cy="-1" r="5" fill="#ef4444" />
              <circle cx="0" cy="0" r="3" fill="#fde047" />
            </g>
            <g transform="translate(48, 20)">
              <circle cx="0" cy="-5" r="4.5" fill="#f9a8d4" />
              <circle cx="5" cy="-1" r="4.5" fill="#f9a8d4" />
              <circle cx="3" cy="4" r="4.5" fill="#f9a8d4" />
              <circle cx="-3" cy="4" r="4.5" fill="#f9a8d4" />
              <circle cx="-5" cy="-1" r="4.5" fill="#f9a8d4" />
              <circle cx="0" cy="0" r="2.5" fill="#fde047" />
            </g>
            <g transform="translate(36, 40)">
              <circle cx="0" cy="-4.5" r="4" fill="#fb923c" />
              <circle cx="4.5" cy="-1" r="4" fill="#fb923c" />
              <circle cx="2.5" cy="4" r="4" fill="#fb923c" />
              <circle cx="-2.5" cy="4" r="4" fill="#fb923c" />
              <circle cx="-4.5" cy="-1" r="4" fill="#fb923c" />
              <circle cx="0" cy="0" r="2.2" fill="#fde047" />
            </g>

            {/* Dải ruy băng cam xoắn góc trên phải */}
            <path
              d="M254,6 C292,16 254,34 286,44 C260,56 290,72 268,84 C284,94 274,106 286,112"
              fill="none"
              stroke="#fb923c"
              strokeWidth="7.5"
              strokeLinecap="round"
            />

            {/* Ba mặt cười tròn xếp dọc góc dưới trái (Xanh tím, Vàng, Hồng) */}
            {[
              { cy: 230, fill: '#64748b' },
              { cy: 256, fill: '#fde047' },
              { cy: 282, fill: '#f9a8d4' },
            ].map((smiley, idx) => (
              <g key={idx} transform={`translate(24, ${smiley.cy})`}>
                <circle cx="0" cy="0" r="12.5" fill={smiley.fill} stroke="#334155" strokeWidth="1" />
                <circle cx="-4" cy="-2" r="1.5" fill="#1e293b" />
                <circle cx="4" cy="-2" r="1.5" fill="#1e293b" />
                <path d="M-3.5,3 Q0,6 3.5,3" fill="none" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
              </g>
            ))}

            {/* 3 bông hoa Tulip góc dưới phải */}
            {[
              { x: 206, color: '#64748b' },
              { x: 236, color: '#fde047' },
              { x: 266, color: '#f472b6' },
            ].map((tulip, idx) => (
              <g key={idx} transform={`translate(${tulip.x}, 276)`}>
                <line x1="0" y1="6" x2="0" y2="28" stroke="#15803d" strokeWidth="2.5" />
                <path d="M0,18 L-8,12 M0,20 L8,14" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
                <path
                  d="M-9,4 C-9,-8 -4,-10 0,-4 C4,-10 9,-8 9,4 C9,10 -9,10 -9,4 Z"
                  fill={tulip.color}
                />
              </g>
            ))}
          </g>
        )}

        {/* 5. BIẾN THỂ SÁNG TẠO THÊM: TÍM LAVENDER ÁNH SAO & TRĂNG KHUYẾT */}
        {activeVariant === 'lavender-star' && (
          <g>
            {/* Dải cầu vồng pastel góc trên trái */}
            <path
              d="M6,58 A48,48 0 0,1 62,6"
              fill="none"
              stroke="#c084fc"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M6,44 A34,34 0 0,1 48,6"
              fill="none"
              stroke="#f472b6"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Mặt trăng khuyết vàng góc trên phải */}
            <path
              d="M262,14 C248,20 246,40 260,48 C250,48 238,38 242,22 C245,10 256,10 262,14 Z"
              fill="#facc15"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />
            {/* Ngôi sao 4 cánh lấp lánh góc dưới trái & phải */}
            <path
              d="M24,254 L28,266 L40,270 L28,274 L24,286 L20,274 L8,270 L20,266 Z"
              fill="#facc15"
            />
            <path
              d="M268,256 L272,268 L284,272 L272,276 L268,288 L264,276 L252,272 L264,268 Z"
              fill="#f472b6"
            />
            <circle cx="246" cy="284" r="6" fill="#60a5fa" />
          </g>
        )}

        {/* 6. BIẾN THỂ SÁNG TẠO THÊM: CAM ĐÀO NẮNG MAI & MÂY CƯỜI */}
        {activeVariant === 'peach-sunshine' && (
          <g>
            {/* Đám mây trắng mặt cười góc trên trái */}
            <g transform="translate(36, 24)">
              <circle cx="-12" cy="4" r="10" fill="#ffffff" />
              <circle cx="0" cy="-2" r="13" fill="#ffffff" />
              <circle cx="13" cy="4" r="10" fill="#ffffff" />
              <rect x="-12" y="4" width="25" height="10" fill="#ffffff" />
              <circle cx="-4" cy="3" r="1.4" fill="#334155" />
              <circle cx="4" cy="3" r="1.4" fill="#334155" />
              <path d="M-3,7 Q0,10 3,7" fill="none" stroke="#334155" strokeWidth="1.3" strokeLinecap="round" />
            </g>
            {/* Dải lượn sóng xanh ngọc góc trên phải */}
            <path
              d="M220,6 C234,26 258,8 272,28 C282,42 296,28 296,46"
              fill="none"
              stroke="#34d399"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Cỏ 4 lá may mắn góc dưới phải */}
            <g transform="translate(264, 272)">
              <circle cx="-6" cy="-6" r="6.5" fill="#4ade80" />
              <circle cx="6" cy="-6" r="6.5" fill="#4ade80" />
              <circle cx="-6" cy="6" r="6.5" fill="#4ade80" />
              <circle cx="6" cy="6" r="6.5" fill="#4ade80" />
              <path d="M0,6 Q4,18 10,22" fill="none" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </g>
        )}
      </svg>

      {/* Hàng hạt charm tròn (G I R L / C U T E / C O O L / L O V E) đính dọc mép dưới ảnh giống hệt mẫu */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-20 -mt-3.5 flex items-center justify-start pl-3 gap-1.5"
      >
        {beads.map((char, i) => (
          <span
            key={i}
            style={{ color: currentStyle.beadColor }}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-stone-300/80 bg-white text-[11px] font-black shadow-sm ${
              i % 2 === 0 ? '-translate-y-0.5 rotate-[-6deg]' : 'translate-y-0.5 rotate-[6deg]'
            }`}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Nhãn dán tính cách Die-Cut nổi bên cạnh ảnh */}
      {sticker}

      {/* Dòng Chữ In Hoa Đậm Dưới Chân Polaroid: [MÔN HỌC] - [TÊN GIÁO VIÊN] */}
      <div
        onClick={onClick}
        className={`relative z-20 mt-2.5 cursor-pointer rounded-xl px-2.5 py-1.5 text-center shadow-sm ${currentStyle.captionPillClass}`}
      >
        {caption}
      </div>
    </div>
  );
};

