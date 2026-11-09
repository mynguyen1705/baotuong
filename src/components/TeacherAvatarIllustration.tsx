import React from 'react';
import { TeacherAvatarTheme } from '../types/teachers';

export interface TeacherAvatarIllustrationProps {
  photoUrl?: string;
  theme: TeacherAvatarTheme;
  honorificAndName: string;
  subject: string;
  className?: string;
}

export const TeacherAvatarIllustration: React.FC<TeacherAvatarIllustrationProps> = ({
  photoUrl,
  theme,
  honorificAndName,
  subject,
  className = 'w-full h-full',
}) => {
  if (photoUrl && photoUrl.trim().length > 0) {
    return (
      <img
        src={photoUrl}
        alt={`Ảnh chân dung ${honorificAndName} - ${subject}`}
        className={`object-cover ${className}`}
      />
    );
  }

  const isFemale =
    honorificAndName.toUpperCase().includes('CÔ') ||
    theme === 'literature' ||
    theme === 'chemistry' ||
    theme === 'biology';

  // Màu nền bảng xanh hoặc khu vườn tùy theo môn học đúng tinh thần ảnh mẫu
  const bgMap: Record<TeacherAvatarTheme, { top: string; bottom: string; board: boolean }> = {
    math: { top: '#1f4d36', bottom: '#173b29', board: true },
    literature: { top: '#24523b', bottom: '#1b3f2d', board: true },
    physics: { top: '#1d4a34', bottom: '#153826', board: true },
    chemistry: { top: '#225039', bottom: '#193c2a', board: true },
    biology: { top: '#4d7c42', bottom: '#2d5328', board: false },
    history: { top: '#1e4b35', bottom: '#163827', board: true },
    custom: { top: '#21513a', bottom: '#183c2b', board: true },
  };

  const bg = bgMap[theme] || bgMap.custom;

  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label={`Minh họa chân dung ${honorificAndName}`}
    >
      <defs>
        <linearGradient id={`bg-${theme}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg.top} />
          <stop offset="100%" stopColor={bg.bottom} />
        </linearGradient>
      </defs>

      {/* Nền bảng xanh lớp học hoặc khu vườn */}
      <rect width="240" height="240" fill={`url(#bg-${theme})`} />

      {bg.board ? (
        <>
          {/* Khung viền gỗ bảng lớp học */}
          <rect
            x="10"
            y="10"
            width="220"
            height="220"
            fill="none"
            stroke="#c69355"
            strokeWidth="5"
            opacity="0.55"
          />
          {/* Nét phấn mờ trên bảng theo môn học */}
          {theme === 'math' && (
            <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" fill="none">
              <polygon points="28,70 58,28 74,70" />
              <circle cx="195" cy="52" r="20" />
              <text x="26" y="102" fill="#ffffff" fillOpacity="0.25" fontSize="14" fontFamily="serif">
                ∑ √x² + y²
              </text>
            </g>
          )}
          {theme === 'literature' && (
            <g fill="#ffffff" fillOpacity="0.22">
              <text x="24" y="55" fontSize="14" fontStyle="italic" fontFamily="serif">
                “Chữ tâm kia mới bằng ba chữ tài...”
              </text>
            </g>
          )}
          {theme === 'physics' && (
            <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" fill="none">
              <ellipse cx="48" cy="55" rx="22" ry="9" transform="rotate(30 48 55)" />
              <ellipse cx="48" cy="55" rx="22" ry="9" transform="rotate(-30 48 55)" />
              <text x="165" y="56" fill="#ffffff" fillOpacity="0.25" fontSize="14" fontFamily="monospace">
                E = mc²
              </text>
            </g>
          )}
          {theme === 'chemistry' && (
            <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" fill="none">
              <polygon points="45,35 62,45 62,65 45,75 28,65 28,45" />
              <text x="165" y="58" fill="#ffffff" fillOpacity="0.25" fontSize="14" fontFamily="sans-serif">
                H₂O • O₂
              </text>
            </g>
          )}
          {theme === 'history' && (
            <g fill="#ffffff" fillOpacity="0.22">
              <text x="24" y="54" fontSize="13" fontWeight="bold">
                938 • 1288 • 1945
              </text>
            </g>
          )}
        </>
      ) : (
        /* Nền thiên nhiên xanh mát cho môn Sinh học */
        <g>
          <circle cx="45" cy="48" r="28" fill="#86efac" opacity="0.25" />
          <circle cx="198" cy="60" r="36" fill="#bbf7d0" opacity="0.22" />
          <circle cx="180" cy="30" r="18" fill="#fef08a" opacity="0.3" />
        </g>
      )}

      {/* Thân & Trang phục giáo viên */}
      {isFemale ? (
        <g>
          {/* Tóc dài sau lưng */}
          <path
            d="M68,90 C56,125 56,185 68,225 L172,225 C184,185 184,125 172,90 Z"
            fill="#1e1b18"
          />
          {/* Áo dài vàng / áo sơ mi trắng / áo hoa */}
          <path
            d="M42,240 C46,182 78,166 120,166 C162,166 194,182 198,240 Z"
            fill={
              theme === 'literature'
                ? '#eab308'
                : theme === 'biology'
                  ? '#fef9c3'
                  : '#f8fafc'
            }
          />
          {/* Cổ áo & họa tiết */}
          <path d="M98,166 L120,194 L142,166" fill="#fde68a" opacity="0.7" />
          {theme === 'biology' && (
            <g fill="#16a34a" opacity="0.65">
              <circle cx="85" cy="205" r="4" />
              <circle cx="155" cy="202" r="4" />
              <circle cx="120" cy="218" r="4" />
              {/* Dây đeo thẻ xanh */}
              <path d="M102,168 L116,238 M138,168 L124,238" stroke="#22c55e" strokeWidth="4" />
            </g>
          )}
        </g>
      ) : (
        <g>
          {/* Áo sơ mi / Vest nam */}
          <path
            d="M36,240 C42,178 76,164 120,164 C164,164 198,178 204,240 Z"
            fill={
              theme === 'history'
                ? '#1e293b'
                : theme === 'math'
                  ? '#cbd5e1'
                  : '#f8fafc'
            }
          />
          {/* Cổ sơ mi trắng & Cà vạt */}
          <polygon points="94,164 120,218 146,164" fill="#ffffff" />
          <polygon
            points="115,174 125,174 128,236 120,240 112,236"
            fill={theme === 'history' ? '#2563eb' : '#1e3a8a'}
          />
        </g>
      )}

      {/* Cổ */}
      <rect x="105" y="140" width="30" height="32" rx="12" fill="#f6ccb0" />

      {/* Khuôn mặt tươi cười */}
      <ellipse cx="120" cy="105" rx="42" ry="48" fill="#fbd7be" />

      {/* Tai */}
      <circle cx="77" cy="108" r="8" fill="#f6ccb0" />
      <circle cx="163" cy="108" r="8" fill="#f6ccb0" />

      {/* Kiểu tóc */}
      {isFemale ? (
        <path
          d="M74,102 C74,60 95,48 122,48 C150,48 168,64 166,105 C154,78 138,68 116,72 C95,75 84,88 74,102 Z"
          fill="#1e1b18"
        />
      ) : (
        <path
          d="M76,96 C74,58 96,46 122,46 C148,46 166,60 164,96 C154,74 136,66 118,68 C98,70 86,80 76,96 Z"
          fill="#1f1b18"
        />
      )}

      {/* Lông mày */}
      <path d="M95,90 Q104,85 112,90" stroke="#3b2f2f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M128,90 Q136,85 145,90" stroke="#3b2f2f" strokeWidth="2.8" fill="none" strokeLinecap="round" />

      {/* Đôi mắt sáng */}
      <circle cx="104" cy="102" r="4.2" fill="#1c1917" />
      <circle cx="136" cy="102" r="4.2" fill="#1c1917" />
      <circle cx="105.5" cy="100.5" r="1.4" fill="#ffffff" />
      <circle cx="137.5" cy="100.5" r="1.4" fill="#ffffff" />

      {/* Má hồng thân thiện */}
      <ellipse cx="93" cy="115" rx="7" ry="4" fill="#fb7185" opacity="0.32" />
      <ellipse cx="147" cy="115" rx="7" ry="4" fill="#fb7185" opacity="0.32" />

      {/* Mũi */}
      <path d="M120,103 L118,116 L123,117" stroke="#d99f7e" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Nụ cười rạng rỡ */}
      <path
        d="M104,125 Q120,139 136,125 Z"
        fill="#ffffff"
        stroke="#e11d48"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

