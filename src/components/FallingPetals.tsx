import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'motion/react';

/**
 * SVG Cánh Hoa Phượng Vĩ Đỏ Thắm (Flamboyant / Phoenix Petal) - Biểu tượng hoa học trò
 */
export const PhoenixPetalSVG: React.FC<{ className?: string; hasSpots?: boolean }> = ({
  className = 'w-6 h-6',
  hasSpots = false,
}) => (
  <svg
    viewBox="0 0 34 42"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="phoenixPetalGrad" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#FF4D4D" />
        <stop offset="35%" stopColor="#EF4444" />
        <stop offset="75%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="phoenixStemGrad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="70%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
      <radialGradient id="phoenixHighlight" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#FECACA" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Phiến cánh hoa phượng xòe tròn hình thìa/quạt lượn sóng mềm */}
    <path
      d="M17 14 C25 14, 32 20, 31 29 C30 36, 23 40, 17 40 C11 40, 4 36, 3 29 C2 20, 9 14, 17 14 Z"
      fill="url(#phoenixPetalGrad)"
      opacity="0.95"
    />
    {/* Ánh sáng mờ trên mặt cánh hoa */}
    <path
      d="M17 16 C23 16, 28 21, 27 28 C26 34, 21 37, 17 37 C13 37, 8 34, 7 28 C6 21, 11 16, 17 16 Z"
      fill="url(#phoenixHighlight)"
    />
    {/* Cuống cánh hoa phượng thon dài uốn cong kiêu hãnh */}
    <path
      d="M17 16 C16.5 10, 15 5, 13 2 C12 0.5, 14 0.5, 15 2 C17.5 5, 18.5 10, 18 16 Z"
      fill="url(#phoenixStemGrad)"
    />
    {/* Đốm phấn hoa màu vàng nghệ đặc trưng của cánh hoa phượng hổ */}
    {hasSpots && (
      <g opacity="0.85">
        <ellipse cx="17" cy="26" rx="4.5" ry="3" fill="#FEF08A" />
        <circle cx="15" cy="25" r="0.8" fill="#B91C1C" />
        <circle cx="18" cy="27" r="0.9" fill="#B91C1C" />
        <circle cx="19" cy="24" r="0.7" fill="#B91C1C" />
      </g>
    )}
  </svg>
);

/**
 * SVG Cánh Hoa Sen Hồng Phấn (Lotus Petal) phớt ánh vàng cam
 */
export const LotusPetalSVG: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 32 40"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lotusPetalGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="40%" stopColor="#FB7185" />
        <stop offset="85%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
      <linearGradient id="lotusPetalHighlight" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="70%" stopColor="#FECDD3" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Thân cánh hoa cong mềm hình giọt ngọc */}
    <path
      d="M16 2 C22 10, 30 20, 26 31 C22 39, 10 39, 6 31 C2 20, 10 10, 16 2 Z"
      fill="url(#lotusPetalGrad)"
      opacity="0.92"
    />
    {/* Vệt sáng trên sống cánh hoa */}
    <path
      d="M16 5 C19 12, 23 20, 20 28 C17 34, 13 32, 12 28 C11 20, 13 12, 16 5 Z"
      fill="url(#lotusPetalHighlight)"
    />
    {/* Gân cánh hoa mờ thanh nhã */}
    <path
      d="M16 8 Q16 24 16 35"
      stroke="#FFE4E6"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

/**
 * SVG Cánh Lá Phong Mùa Thu (Autumn Maple Leaf) vàng cam ấm áp
 */
export const AutumnLeafSVG: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="autumnLeafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="45%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
    </defs>
    {/* Dáng lá phong rơi chao liệng */}
    <path
      d="M18 3 L21 11 L29 8 L26 15 L33 18 L26 23 L28 30 L20 26 L18 34 L16 26 L8 30 L10 23 L3 18 L10 15 L7 8 L15 11 Z"
      fill="url(#autumnLeafGrad)"
      opacity="0.88"
    />
    <path
      d="M18 6 L18 31 M18 18 L25 14 M18 18 L11 14 M18 24 L24 22 M18 24 L12 22"
      stroke="#78350F"
      strokeWidth="0.75"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

interface PetalConfig {
  id: number;
  type: 'phoenix' | 'lotus' | 'maple';
  left: number; // Tọa độ ngang %
  size: number; // Kích thước px
  duration: number; // Thời gian rơi (giây)
  delay: number; // Độ trễ (giây)
  sway: number; // Độ chao liệng ngang (px)
  initialRotate: number;
  hasSpots?: boolean;
}

/**
 * Hiệu ứng nhiều cánh hoa phượng đỏ thắm, cánh hoa sen hồng và lá phong rơi nhẹ nhàng khắp trang
 */
export const FallingPetals: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  const petals = useMemo<PetalConfig[]>(() => {
    return [
      // === Cánh Hoa Phượng Vĩ đỏ thắm học trò (nhiều hơn & nổi bật) ===
      { id: 1, type: 'phoenix', left: 3, size: 28, duration: 8.5, delay: 0.2, sway: 40, initialRotate: 20, hasSpots: true },
      { id: 2, type: 'phoenix', left: 14, size: 24, duration: 9.8, delay: 2.1, sway: -35, initialRotate: -30 },
      { id: 3, type: 'phoenix', left: 24, size: 30, duration: 8.0, delay: 4.5, sway: 45, initialRotate: 55, hasSpots: true },
      { id: 4, type: 'phoenix', left: 35, size: 22, duration: 10.2, delay: 1.0, sway: -30, initialRotate: -45 },
      { id: 5, type: 'phoenix', left: 47, size: 26, duration: 8.8, delay: 5.2, sway: 38, initialRotate: 15 },
      { id: 6, type: 'phoenix', left: 58, size: 32, duration: 7.8, delay: 2.8, sway: -42, initialRotate: 65, hasSpots: true },
      { id: 7, type: 'phoenix', left: 69, size: 24, duration: 9.4, delay: 0.5, sway: 32, initialRotate: -25 },
      { id: 8, type: 'phoenix', left: 79, size: 28, duration: 8.2, delay: 3.9, sway: -38, initialRotate: 40, hasSpots: true },
      { id: 9, type: 'phoenix', left: 88, size: 25, duration: 9.6, delay: 1.7, sway: 40, initialRotate: -60 },
      { id: 10, type: 'phoenix', left: 95, size: 30, duration: 8.4, delay: 4.0, sway: -34, initialRotate: 30 },
      { id: 11, type: 'phoenix', left: 9, size: 22, duration: 10.5, delay: 6.2, sway: 35, initialRotate: 50 },
      { id: 12, type: 'phoenix', left: 41, size: 26, duration: 9.0, delay: 7.1, sway: -30, initialRotate: -35, hasSpots: true },
      { id: 13, type: 'phoenix', left: 74, size: 28, duration: 8.6, delay: 6.8, sway: 45, initialRotate: 25 },
      { id: 14, type: 'phoenix', left: 84, size: 20, duration: 11.0, delay: 7.9, sway: -25, initialRotate: -70 },

      // === Cánh Hoa Sen hồng phấn thanh tao ===
      { id: 15, type: 'lotus', left: 7, size: 26, duration: 9.5, delay: 1.5, sway: 30, initialRotate: 15 },
      { id: 16, type: 'lotus', left: 19, size: 22, duration: 10.4, delay: 3.5, sway: -40, initialRotate: -25 },
      { id: 17, type: 'lotus', left: 30, size: 28, duration: 8.9, delay: 0.8, sway: 35, initialRotate: 40 },
      { id: 18, type: 'lotus', left: 52, size: 24, duration: 9.8, delay: 4.8, sway: -30, initialRotate: -15 },
      { id: 19, type: 'lotus', left: 64, size: 26, duration: 9.2, delay: 2.3, sway: 40, initialRotate: 35 },
      { id: 20, type: 'lotus', left: 76, size: 22, duration: 10.8, delay: 5.7, sway: -35, initialRotate: -45 },
      { id: 21, type: 'lotus', left: 91, size: 28, duration: 8.7, delay: 3.2, sway: 30, initialRotate: 20 },
      { id: 22, type: 'lotus', left: 22, size: 20, duration: 11.2, delay: 8.1, sway: -28, initialRotate: 60 },
      { id: 23, type: 'lotus', left: 56, size: 25, duration: 9.4, delay: 6.5, sway: 36, initialRotate: -50 },

      // === Lá Phong mùa thu vàng cam điểm xuyết ===
      { id: 24, type: 'maple', left: 12, size: 22, duration: 11.5, delay: 0.4, sway: -38, initialRotate: 45 },
      { id: 25, type: 'maple', left: 28, size: 24, duration: 12.0, delay: 3.8, sway: 35, initialRotate: -60 },
      { id: 26, type: 'maple', left: 45, size: 20, duration: 11.8, delay: 2.0, sway: -30, initialRotate: 75 },
      { id: 27, type: 'maple', left: 60, size: 26, duration: 10.5, delay: 5.0, sway: 40, initialRotate: -40 },
      { id: 28, type: 'maple', left: 82, size: 22, duration: 12.4, delay: 1.8, sway: -35, initialRotate: 30 },
      { id: 29, type: 'maple', left: 97, size: 24, duration: 11.0, delay: 6.0, sway: 32, initialRotate: -80 },
      { id: 30, type: 'maple', left: 38, size: 20, duration: 12.2, delay: 8.6, sway: -25, initialRotate: 55 },
    ];
  }, []);

  if (reducedMotion) return null;

  return (
    <div
      data-testid="falling-petals"
      className="pointer-events-none fixed inset-0 overflow-hidden z-20 select-none"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          data-testid={`falling-petal-${petal.type}`}
          className="absolute -top-12"
          style={{
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size,
          }}
          initial={{
            y: -50,
            x: 0,
            rotate: petal.initialRotate,
            opacity: 0,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, petal.sway, -petal.sway, petal.sway * 0.5, 0],
            rotate: [petal.initialRotate, petal.initialRotate + 180, petal.initialRotate + 360],
            opacity: [0, 0.95, 0.95, 0.85, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {petal.type === 'phoenix' && (
            <PhoenixPetalSVG
              className="w-full h-full drop-shadow-sm"
              hasSpots={petal.hasSpots}
            />
          )}
          {petal.type === 'lotus' && (
            <LotusPetalSVG className="w-full h-full drop-shadow-sm" />
          )}
          {petal.type === 'maple' && (
            <AutumnLeafSVG className="w-full h-full drop-shadow-sm" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Alias tương thích ngược
 */
export const FloatingAcademicSparkles = FallingPetals;
