import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface AcademicSparkle {
  id: number;
  symbol: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const ACADEMIC_SYMBOLS = ['π', '√', '∑', '★', '∞', '∆', '✦', '∫', 'α', '≈'];
const SPARKLE_COLORS = [
  '#0284C7', // Xanh lam học trò
  '#D97706', // Vàng hoàng yến
  '#4338CA', // Tím hoa cà
  '#059669', // Xanh lá ngọc
  '#EA580C', // Cam đất ấm
];

/**
 * Hiệu ứng hạt bụi phấn / kí hiệu toán học lơ lửng nhẹ nhàng (Thay thế hoàn toàn cánh hoa rơi)
 */
export const FloatingAcademicSparkles: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  if (reducedMotion) return null;

  const sparkles: AcademicSparkle[] = Array.from({ length: 14 }, (_, idx) => ({
    id: idx,
    symbol: ACADEMIC_SYMBOLS[idx % ACADEMIC_SYMBOLS.length],
    left: `${(idx * 7.2 + 2) % 96}%`,
    size: 13 + (idx % 3) * 3,
    duration: 16 + (idx % 4) * 3,
    delay: (idx % 5) * 1.6,
    color: SPARKLE_COLORS[idx % SPARKLE_COLORS.length],
  }));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden select-none"
    >
      {sparkles.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: -30, x: 0, opacity: 0 }}
          animate={{
            y: ['0vh', '104vh'],
            x: [0, 24, -18, 12, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.45, 0.45, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: item.left,
            fontSize: `${item.size}px`,
            color: item.color,
          }}
          className="absolute top-0 font-bold font-serif opacity-40 select-none pointer-events-none"
        >
          {item.symbol}
        </motion.div>
      ))}
    </div>
  );
};

export const FallingPetals = FloatingAcademicSparkles;
