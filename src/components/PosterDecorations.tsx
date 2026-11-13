import React from 'react';

/**
 * Biểu tượng bàn tay trắng trỏ click ở góc dưới bên phải nút "NHẤP VÀO ĐÂY ĐỂ XEM"
 */
export const PointerHandIcon: React.FC<{ className?: string }> = ({
  className = 'h-7 w-7',
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    {/* Tia nhấp chuột */}
    <path
      d="M11 4V1M5 7L2.5 5M17 7L19.5 5"
      stroke="#1E88E5"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Bàn tay trỏ trắng viền nâu đen */}
    <path
      d="M13.5 7.5C13.5 5.84 14.84 4.5 16.5 4.5C18.16 4.5 19.5 5.84 19.5 7.5V15.5H20.8C22.2 15.5 23.3 16.6 23.3 18V18.5H24.5C25.9 18.5 27 19.6 27 21V22C28.3 22.2 29.3 23.3 29.3 24.7V27.5C29.3 31.4 26.1 34.5 22.2 34.5H15.8C12.5 34.5 9.8 32.3 8.9 29.2L6.6 21.8C6.1 20.3 6.9 18.7 8.4 18.2C9.7 17.8 11.1 18.4 11.7 19.6L13.5 23V7.5Z"
      fill="#FFFFFF"
      stroke="#29180E"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Đôi cánh ước mơ nét vẽ mực đen, ruột trắng mờ (Hand-drawn Sketch Wings)
 * Nền ngoài trong suốt, ruột lông vũ trắng đục nổi bật, viền đen sắc sảo nịnh mắt
 */
export const DreamWingSVG: React.FC<{
  side: 'left' | 'right';
  className?: string;
}> = ({ side, className = 'w-16 sm:w-24 md:w-36 lg:w-44 h-auto' }) => (
  <img
    src={side === 'left' ? '/decorations/sketch-wing-left.png' : '/decorations/sketch-wing-right.png'}
    alt={side === 'left' ? 'Đôi cánh ước mơ bên trái' : 'Đôi cánh ước mơ bên phải'}
    className={`${className} object-contain select-none pointer-events-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-transform`}
    draggable={false}
  />
);

/**
 * Chùm hoa phượng đỏ & lá xanh trang trí góc báo tường
 */
export const FlamboyantClusterSVG: React.FC<{ className?: string }> = ({
  className = 'w-28 h-28',
}) => (
  <svg viewBox="0 0 140 140" fill="none" aria-hidden="true" className={className}>
    {/* Tán lá phượng xanh */}
    <g fill="#4D7C0F" opacity="0.9">
      <ellipse cx="32" cy="78" rx="18" ry="7" transform="rotate(-25 32 78)" />
      <ellipse cx="52" cy="92" rx="16" ry="6" transform="rotate(-15 52 92)" />
      <ellipse cx="82" cy="36" rx="18" ry="7" transform="rotate(20 82 36)" />
      <ellipse cx="96" cy="54" rx="15" ry="6" transform="rotate(35 96 54)" />
      <ellipse cx="68" cy="74" rx="17" ry="6" transform="rotate(10 68 74)" />
    </g>
    {/* Bông hoa phượng đỏ 5 cánh */}
    {[
      { cx: 42, cy: 42, r: 1 },
      { cx: 74, cy: 52, r: 0.9 },
      { cx: 36, cy: 68, r: 0.85 },
      { cx: 62, cy: 28, r: 0.8 },
    ].map((f, idx) => (
      <g
        key={idx}
        transform={`translate(${f.cx}, ${f.cy}) scale(${f.r})`}
      >
        <circle cx="0" cy="-12" r="8" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
        <circle cx="11" cy="-4" r="8" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.5" />
        <circle cx="7" cy="10" r="8" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
        <circle cx="-7" cy="10" r="8" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.5" />
        <circle cx="-11" cy="-4" r="8" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4.5" fill="#FDE047" />
      </g>
    ))}
  </svg>
);

/**
 * Khinh khí cầu ước mơ góc phải trên cùng của Poster
 */
export const HotAirBalloonSVG: React.FC<{ className?: string }> = ({
  className = 'w-16 sm:w-20 h-auto',
}) => (
  <svg viewBox="0 0 90 120" fill="none" aria-hidden="true" className={className}>
    <path
      d="M45 8 C20 8, 8 28, 12 52 C16 72, 30 82, 35 90 L55 90 C60 82, 74 72, 78 52 C82 28, 70 8, 45 8 Z"
      fill="#EF4444"
      stroke="#7C2D12"
      strokeWidth="2.5"
    />
    <path
      d="M45 8 C32 8, 25 28, 28 52 C30 70, 37 82, 40 90 L50 90 C53 82, 60 70, 62 52 C65 28, 58 8, 45 8 Z"
      fill="#FEF3C7"
      stroke="#7C2D12"
      strokeWidth="2"
    />
    <path d="M37 90 L39 100 M53 90 L51 100" stroke="#7C2D12" strokeWidth="2" />
    <rect
      x="35"
      y="100"
      width="20"
      height="13"
      rx="3"
      fill="#B45309"
      stroke="#7C2D12"
      strokeWidth="2"
    />
  </svg>
);

/**
 * Máy bay giấy tuổi học trò
 */
export const PaperAirplaneSVG: React.FC<{
  color?: 'amber' | 'sky';
  className?: string;
}> = ({ color = 'amber', className = 'w-12 h-12' }) => {
  const mainFill = color === 'amber' ? '#FDE68A' : '#BAE6FD';
  const wingFill = color === 'amber' ? '#F59E0B' : '#38BDF8';
  return (
    <svg viewBox="0 0 64 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 22 L58 6 L38 42 L26 28 L4 22 Z"
        fill={mainFill}
        stroke="#4A2511"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M58 6 L26 28 L28 40 L35 33"
        fill={wingFill}
        stroke="#4A2511"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};
