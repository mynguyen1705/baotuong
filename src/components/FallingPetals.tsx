import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'motion/react';

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
  type: 'lotus' | 'maple';
  left: number; // Tọa độ ngang %
  size: number; // Kích thước px
  duration: number; // Thời gian rơi (giây)
  delay: number; // Độ trễ (giây)
  sway: number; // Độ chao liệng ngang (px)
  initialRotate: number;
}

/**
 * Hiệu ứng những cánh hoa sen hồng và lá phong rơi nhẹ nhàng khắp trang
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
      { id: 1, type: 'lotus', left: 4, size: 24, duration: 9.5, delay: 0, sway: 35, initialRotate: 15 },
      { id: 2, type: 'maple', left: 11, size: 20, duration: 11.2, delay: 2.4, sway: -40, initialRotate: 45 },
      { id: 3, type: 'lotus', left: 19, size: 28, duration: 8.8, delay: 4.8, sway: 30, initialRotate: -20 },
      { id: 4, type: 'maple', left: 27, size: 22, duration: 12.0, delay: 1.2, sway: -35, initialRotate: 70 },
      { id: 5, type: 'lotus', left: 36, size: 20, duration: 10.4, delay: 5.6, sway: 45, initialRotate: -35 },
      { id: 6, type: 'lotus', left: 45, size: 26, duration: 8.5, delay: 3.1, sway: -25, initialRotate: 10 },
      { id: 7, type: 'maple', left: 54, size: 24, duration: 11.8, delay: 0.8, sway: 35, initialRotate: -55 },
      { id: 8, type: 'lotus', left: 63, size: 22, duration: 9.8, delay: 4.2, sway: -40, initialRotate: 25 },
      { id: 9, type: 'maple', left: 72, size: 26, duration: 10.6, delay: 2.0, sway: 30, initialRotate: 80 },
      { id: 10, type: 'lotus', left: 81, size: 28, duration: 8.9, delay: 6.0, sway: -35, initialRotate: -15 },
      { id: 11, type: 'maple', left: 89, size: 20, duration: 12.5, delay: 1.5, sway: 40, initialRotate: 40 },
      { id: 12, type: 'lotus', left: 96, size: 24, duration: 9.2, delay: 3.8, sway: -30, initialRotate: -45 },
      { id: 13, type: 'lotus', left: 15, size: 18, duration: 10.8, delay: 7.2, sway: 25, initialRotate: 60 },
      { id: 14, type: 'maple', left: 40, size: 22, duration: 11.5, delay: 8.0, sway: -30, initialRotate: -60 },
      { id: 15, type: 'lotus', left: 68, size: 26, duration: 9.0, delay: 7.5, sway: 35, initialRotate: 30 },
      { id: 16, type: 'maple', left: 85, size: 18, duration: 12.2, delay: 8.5, sway: -25, initialRotate: -75 },
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
            opacity: [0, 0.95, 0.95, 0.8, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {petal.type === 'lotus' ? (
            <LotusPetalSVG className="w-full h-full drop-shadow-sm" />
          ) : (
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
