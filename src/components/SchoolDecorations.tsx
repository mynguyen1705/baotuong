import React from 'react';
import { motion } from 'motion/react';
import { PaperAirplaneSVG } from './PosterDecorations';

/**
 * Chồng Sách Vở Giáo Khoa Vintage (Bìa xanh navy, đỏ gạch, vàng nghệ với gáy sách tinh xảo)
 */
export const VintageBookStackSVG: React.FC<{ className?: string }> = ({
  className = 'w-32 h-auto',
}) => (
  <svg viewBox="0 0 160 130" fill="none" className={className} aria-hidden="true">
    {/* Đổ bóng chồng sách */}
    <ellipse cx="80" cy="120" rx="68" ry="8" fill="#78350F" opacity="0.15" />

    {/* Quyển sách dưới cùng: Bìa xanh navy đậm */}
    <g transform="translate(10, 78)">
      <rect x="0" y="8" width="138" height="26" rx="4" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
      {/* Trang giấy bên trong */}
      <rect x="12" y="11" width="122" height="20" fill="#fef3c7" />
      <line x1="16" y1="16" x2="130" y2="16" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="16" y1="21" x2="130" y2="21" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="16" y1="26" x2="130" y2="26" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />
      {/* Gáy sách mạ vàng */}
      <rect x="0" y="8" width="14" height="26" rx="2" fill="#1d4ed8" />
      <line x1="4" y1="12" x2="4" y2="30" stroke="#fde047" strokeWidth="1.5" />
      <line x1="8" y1="12" x2="8" y2="30" stroke="#fde047" strokeWidth="1.5" />
      {/* Dải ruy băng đánh dấu trang thò ra ngoài */}
      <path d="M 125 24 L 134 38 L 128 35 L 122 38 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
    </g>

    {/* Quyển sách ở giữa: Bìa đỏ gạch / đỏ thắm */}
    <g transform="translate(18, 48) rotate(-3)">
      <rect x="0" y="8" width="126" height="24" rx="4" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" />
      <rect x="10" y="11" width="112" height="18" fill="#fffbeb" />
      <line x1="14" y1="15" x2="118" y2="15" stroke="#fcd34d" strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="14" y1="20" x2="118" y2="20" stroke="#fcd34d" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* Gáy sách */}
      <rect x="0" y="8" width="12" height="24" rx="2" fill="#dc2626" />
      <circle cx="6" cy="20" r="2" fill="#fef08a" />
    </g>

    {/* Quyển sách trên cùng: Bìa vàng nghệ / cam ấm */}
    <g transform="translate(25, 18) rotate(4)">
      <rect x="0" y="8" width="112" height="22" rx="4" fill="#d97706" stroke="#78350f" strokeWidth="2" />
      <rect x="10" y="11" width="98" height="16" fill="#fef9c3" />
      <line x1="14" y1="15" x2="104" y2="15" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="14" y1="19" x2="104" y2="19" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* Gáy sách vàng rực */}
      <rect x="0" y="8" width="12" height="22" rx="2" fill="#f59e0b" />
      <line x1="4" y1="11" x2="4" y2="27" stroke="#ffffff" strokeWidth="1.2" />
      {/* Nhãn sách dán bìa: TOÁN 9 */}
      <rect x="42" y="11" width="36" height="10" rx="2" fill="#ffffff" stroke="#b45309" strokeWidth="0.8" />
      <text x="60" y="18.5" fontSize="6.5" fontWeight="bold" fill="#78350f" textAnchor="middle">
        TOÁN 9
      </text>
    </g>

    {/* Bút chì gỗ gác chéo trên chồng sách */}
    <g transform="translate(85, 8) rotate(28)">
      <rect x="0" y="0" width="8" height="65" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
      <polygon points="0,0 8,0 4,-12" fill="#fde68a" stroke="#78350f" strokeWidth="1" />
      <polygon points="2,-6 6,-6 4,-12" fill="#1e293b" />
      {/* Gôm tẩy hồng đuôi bút chì */}
      <rect x="0" y="58" width="8" height="10" rx="1.5" fill="#f472b6" stroke="#78350f" strokeWidth="1" />
      <rect x="0" y="55" width="8" height="4" fill="#cbd5e1" stroke="#475569" strokeWidth="0.6" />
    </g>
  </svg>
);

/**
 * Cuốn Vở Học Sinh Ô Ly Mở Kèm Thước Kẻ & Bút Máy
 */
export const OpenNotebookSVG: React.FC<{ className?: string }> = ({
  className = 'w-36 h-auto',
}) => (
  <svg viewBox="0 0 170 120" fill="none" className={className} aria-hidden="true">
    <ellipse cx="85" cy="112" rx="72" ry="7" fill="#78350F" opacity="0.14" />
    {/* Bìa sổ da màu lam */}
    <path
      d="M 12 18 C 12 12 18 10 85 10 C 152 10 158 12 158 18 L 154 105 C 154 108 148 110 85 110 C 22 110 16 108 16 105 Z"
      fill="#0284c7"
      stroke="#0369a1"
      strokeWidth="2.5"
    />
    {/* Trang giấy mở bên trái (kẻ ô ly) */}
    <path
      d="M 20 18 Q 52 16 84 18 L 84 104 Q 52 102 20 104 Z"
      fill="#fffdf5"
      stroke="#e2e8f0"
      strokeWidth="1.2"
    />
    {/* Trang giấy mở bên phải (kẻ ô ly) */}
    <path
      d="M 86 18 Q 118 16 150 18 L 150 104 Q 118 102 86 104 Z"
      fill="#fffdf5"
      stroke="#e2e8f0"
      strokeWidth="1.2"
    />
    {/* Đường lằn gáy sổ ở giữa */}
    <line x1="85" y1="14" x2="85" y2="108" stroke="#cbd5e1" strokeWidth="2.5" />
    {/* Các dòng kẻ ô ly trang giấy */}
    {[28, 38, 48, 58, 68, 78, 88, 98].map((y) => (
      <g key={y}>
        <line x1="26" y1={y} x2="80" y2={y} stroke="#bfdbfe" strokeWidth="0.8" />
        <line x1="90" y1={y} x2="144" y2={y} stroke="#bfdbfe" strokeWidth="0.8" />
      </g>
    ))}
    {/* Lề vở màu đỏ */}
    <line x1="34" y1="20" x2="34" y2="102" stroke="#fca5a5" strokeWidth="1" />
    {/* Nét chữ viết tay học trò "Học Tốt - 9A3" */}
    <text x="38" y="36" fontSize="6.5" fontStyle="italic" fill="#4338ca" fontWeight="bold">
      Lớp 9A3 - Chăm ngoan
    </text>
    <text x="38" y="46" fontSize="5.5" fontStyle="italic" fill="#4338ca">
      Ghi nhớ: E = mc²
    </text>
    <text x="94" y="36" fontSize="6" fontStyle="italic" fill="#b91c1c" fontWeight="bold">
      ★ Điểm 10 Tặng Cô
    </text>

    {/* Thước kẻ gỗ trong suốt đặt chéo */}
    <g transform="translate(68, 45) rotate(-22)">
      <rect x="0" y="0" width="75" height="14" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" opacity="0.9" />
      {[6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66].map((x, idx) => (
        <g key={x}>
          <line x1={x} y1="0" x2={x} y2={idx % 2 === 0 ? "5" : "3.5"} stroke="#78350f" strokeWidth="0.8" />
        </g>
      ))}
    </g>
  </svg>
);

/**
 * Bộ Dụng Cụ Học Tập: Thước Ê-ke Tam Giác, Compa Kim Loại & Bút Dạ Quang
 */
export const StationerySetSVG: React.FC<{ className?: string }> = ({
  className = 'w-32 h-auto',
}) => (
  <svg viewBox="0 0 140 120" fill="none" className={className} aria-hidden="true">
    {/* Thước Ê-ke vuông gỗ màu vàng mật ong */}
    <polygon
      points="12,105 110,105 12,15"
      fill="#fde68a"
      stroke="#b45309"
      strokeWidth="2"
      opacity="0.92"
    />
    {/* Lỗ hổng tam giác ở giữa ê-ke */}
    <polygon
      points="26,95 86,95 26,42"
      fill="#fffbeb"
      stroke="#d97706"
      strokeWidth="1.4"
    />
    {/* Vạch chia độ trên cạnh ê-ke */}
    {[24, 36, 48, 60, 72, 84, 96].map((x) => (
      <line key={x} x1={x} y1="105" x2={x} y2="99" stroke="#78350f" strokeWidth="1" />
    ))}

    {/* Chiếc compa kim loại vẽ đường tròn */}
    <g transform="translate(48, 12) rotate(15)">
      {/* Khớp nối compa */}
      <circle cx="16" cy="12" r="5" fill="#64748b" stroke="#334155" strokeWidth="1.2" />
      <circle cx="16" cy="12" r="2.2" fill="#e2e8f0" />
      {/* Chân nhọn compa kim loại */}
      <path d="M 14 16 L 2 82 L 4 84 L 17 18 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      <polygon points="1,82 4,82 2.5,88" fill="#1e293b" />
      {/* Chân bút chì compa */}
      <path d="M 18 16 L 36 78 L 32 80 L 15 18 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      {/* Ống giữ bút chì */}
      <rect x="30" y="62" width="7" height="15" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
      <polygon points="30,77 37,77 33.5,84" fill="#1e293b" />
    </g>

    {/* Bút dạ quang highlight màu vàng neon */}
    <g transform="translate(82, 58) rotate(-42)">
      <rect x="0" y="0" width="14" height="42" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
      <rect x="2" y="32" width="10" height="12" rx="1" fill="#475569" />
      {/* Đầu vát bút dạ quang */}
      <polygon points="3,0 11,0 12,-9 5,-9" fill="#fde047" stroke="#eab308" strokeWidth="1" />
      <text x="7" y="24" fontSize="5" fontWeight="bold" fill="#713f12" textAnchor="middle" transform="rotate(90 7 24)">
        HIGHLIGHT
      </text>
    </g>
  </svg>
);

/**
 * Phòng Thí Nghiệm Hoá Học: Bình Tam Giác Erlenmeyer Sủi Bọt Khí + Ống Nghiệm & Vòng Benzen C6H6
 */
export const ChemistryLabSVG: React.FC<{ className?: string }> = ({
  className = 'w-36 h-auto',
}) => (
  <div data-testid="chemistry-lab-decor" className={`relative select-none ${className}`}>
    <svg viewBox="0 0 160 140" fill="none" className="w-full h-auto overflow-visible" aria-hidden="true">
      <ellipse cx="80" cy="130" rx="60" ry="7" fill="#78350F" opacity="0.14" />

      {/* Bình Tam Giác Erlenmeyer Thủy Tinh */}
      <g transform="translate(32, 18)">
        {/* Vành cổ bình */}
        <ellipse cx="38" cy="8" rx="12" ry="3.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.8" />
        {/* Cổ bình */}
        <rect x="30" y="8" width="16" height="28" fill="#e0f2fe" opacity="0.65" stroke="#0284c7" strokeWidth="1.8" />
        {/* Thân bình tam giác */}
        <path
          d="M 30 36 L 4 100 C 2 106 7 112 16 112 L 60 112 C 69 112 74 106 72 100 L 46 36 Z"
          fill="#f0f9ff"
          stroke="#0284c7"
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Dung dịch hóa chất màu xanh ngọc / ngọc bích bên trong */}
        <path
          d="M 18 72 Q 38 68 58 72 L 65 102 C 67 106 63 110 57 110 L 19 110 C 13 110 9 106 11 102 Z"
          fill="#10b981"
          opacity="0.85"
        />
        {/* Vạch chia thể tích mL */}
        <line x1="28" y1="80" x2="35" y2="80" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="25" y1="90" x2="35" y2="90" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="22" y1="100" x2="35" y2="100" stroke="#ffffff" strokeWidth="1.2" />
        <text x="38" y="92" fontSize="5" fill="#ffffff" fontWeight="bold">100ml</text>

        {/* Bọt khí sủi tăm bên trong dung dịch với chuyển động nổi lên */}
        {[
          { cx: 28, cy: 98, r: 2.5, delay: 0 },
          { cx: 42, cy: 92, r: 3.2, delay: 0.8 },
          { cx: 34, cy: 84, r: 2.2, delay: 1.4 },
          { cx: 48, cy: 78, r: 2.8, delay: 0.4 },
          { cx: 38, cy: 68, r: 2.0, delay: 1.1 },
        ].map((bubble, i) => (
          <motion.circle
            key={i}
            cx={bubble.cx}
            cy={bubble.cy}
            r={bubble.r}
            fill="#a7f3d0"
            stroke="#059669"
            strokeWidth="0.8"
            animate={{
              y: [0, -22, -38],
              opacity: [0.9, 0.7, 0],
              scale: [0.8, 1.15, 1.3],
            }}
            transition={{
              duration: 2.6,
              delay: bubble.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Ánh sáng phản chiếu thủy tinh */}
        <path d="M 12 95 L 32 45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* Giá đỡ 2 Ống Nghiệm Thủy Tinh (Dung dịch cam & tím) */}
      <g transform="translate(105, 38)">
        {/* Ống nghiệm 1: Dung dịch tím */}
        <rect x="0" y="4" width="12" height="60" rx="6" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" />
        <path d="M 1 34 L 11 34 L 11 58 C 11 61 9 63 6 63 C 3 63 1 61 1 58 Z" fill="#8b5cf6" opacity="0.85" />
        {/* Ống nghiệm 2: Dung dịch vàng cam */}
        <rect x="18" y="12" width="12" height="52" rx="6" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
        <path d="M 19 36 L 29 36 L 29 58 C 29 61 27 63 24 63 C 21 63 19 61 19 58 Z" fill="#f59e0b" opacity="0.85" />
      </g>

      {/* Vòng Benzen C6H6 và Công Thức H2O vẽ tay phác thảo */}
      <g transform="translate(15, 15) rotate(-8)">
        {/* Lục giác Benzen */}
        <polygon
          points="20,0 35,8 35,26 20,34 5,26 5,8"
          stroke="#0284c7"
          strokeWidth="1.6"
          fill="none"
        />
        {/* Vòng tròn nhân thơm benzen */}
        <circle cx="20" cy="17" r="7" stroke="#0284c7" strokeWidth="1.4" strokeDasharray="2.5 2" fill="none" />
        <text x="20" y="43" fontSize="6.5" fontWeight="bold" fill="#0369a1" textAnchor="middle">
          C₆H₆
        </text>
      </g>
    </svg>
  </div>
);

/**
 * Mô Hình Nguyên Tử (Atom Model) với Hạt Nhân & Các Electron Xoay Quanh Quỹ Đạo Elip
 */
export const AtomModelSVG: React.FC<{ className?: string }> = ({
  className = 'w-28 h-auto',
}) => (
  <div data-testid="atom-model-decor" className={`relative select-none ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-auto overflow-visible" aria-hidden="true">
      {/* 3 Quỹ đạo Elip electron xoay tròn */}
      <motion.g
        style={{ transformOrigin: '50px 50px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {/* Quỹ đạo 1 */}
        <ellipse cx="50" cy="50" rx="42" ry="14" stroke="#0284c7" strokeWidth="1.4" strokeDasharray="3 2" fill="none" opacity="0.75" />
        <circle cx="92" cy="50" r="3.2" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" />
      </motion.g>

      <motion.g
        style={{ transformOrigin: '50px 50px' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        {/* Quỹ đạo 2 xoay 60 độ */}
        <g transform="rotate(60 50 50)">
          <ellipse cx="50" cy="50" rx="42" ry="14" stroke="#d97706" strokeWidth="1.4" strokeDasharray="3 2" fill="none" opacity="0.75" />
          <circle cx="8" cy="50" r="3.2" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
        </g>
      </motion.g>

      <motion.g
        style={{ transformOrigin: '50px 50px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {/* Quỹ đạo 3 xoay 120 độ */}
        <g transform="rotate(120 50 50)">
          <ellipse cx="50" cy="50" rx="42" ry="14" stroke="#10b981" strokeWidth="1.4" strokeDasharray="3 2" fill="none" opacity="0.75" />
          <circle cx="92" cy="50" r="3.2" fill="#34d399" stroke="#047857" strokeWidth="1" />
        </g>
      </motion.g>

      {/* Hạt nhân nguyên tử phát sáng ở tâm */}
      <circle cx="50" cy="50" r="8" fill="#ef4444" />
      <circle cx="47" cy="48" r="4.5" fill="#f97316" />
      <circle cx="53" cy="52" r="4" fill="#dc2626" />
      <circle cx="50" cy="50" r="2" fill="#fef08a" />
    </svg>
  </div>
);

/**
 * Kí Hiệu & Công Thức Toán Học - Hoá Học Phác Thảo Nghệ Thuật (Bút dạ / Phấn bảng)
 */
export const MathFormulasDoodleSVG: React.FC<{
  type?: 'calc' | 'geometry' | 'science';
  className?: string;
}> = ({ type = 'calc', className = 'w-32 h-auto' }) => (
  <div data-testid="math-formulas-decor" className={`relative select-none ${className}`}>
    {type === 'calc' && (
      <svg viewBox="0 0 150 90" fill="none" className="w-full h-auto overflow-visible" aria-hidden="true">
        {/* Ký hiệu Pi lớn */}
        <g transform="translate(10, 10)">
          <text x="0" y="28" fontSize="32" fontWeight="bold" fontFamily="serif" fill="#dc2626" opacity="0.88">
            π
          </text>
          <text x="32" y="24" fontSize="10" fontWeight="bold" fill="#b91c1c" fontStyle="italic">
            ≈ 3.14159
          </text>
        </g>

        {/* Ký hiệu Tích Phân & Tổng Sigma */}
        <g transform="translate(18, 50)">
          <text x="0" y="28" fontSize="30" fontFamily="serif" fill="#0284c7" opacity="0.85">
            ∫
          </text>
          <text x="14" y="20" fontSize="10" fontWeight="bold" fill="#0369a1">
            f(x)dx
          </text>
        </g>

        {/* Tổng Sigma */}
        <g transform="translate(75, 45)">
          <text x="0" y="28" fontSize="28" fontWeight="bold" fill="#d97706" opacity="0.9">
            ∑
          </text>
          <text x="24" y="24" fontSize="11" fontWeight="bold" fill="#78350f">
            i = 1...n
          </text>
        </g>
      </svg>
    )}

    {type === 'geometry' && (
      <svg viewBox="0 0 150 90" fill="none" className="w-full h-auto overflow-visible" aria-hidden="true">
        {/* Tam giác vuông Pytago & Công thức a² + b² = c² */}
        <g transform="translate(10, 8)">
          <polygon points="5,48 55,48 5,8" stroke="#4338ca" strokeWidth="1.8" fill="none" strokeDasharray="3 1.5" />
          <rect x="5" y="40" width="8" height="8" stroke="#4338ca" strokeWidth="1" fill="none" />
          <text x="28" y="58" fontSize="9" fontWeight="bold" fill="#3730a3">a</text>
          <text x="-2" y="32" fontSize="9" fontWeight="bold" fill="#3730a3">b</text>
          <text x="34" y="26" fontSize="9" fontWeight="bold" fill="#4338ca">c</text>
        </g>
        {/* Công thức Pytago */}
        <g transform="translate(68, 16)">
          <text x="0" y="16" fontSize="12" fontWeight="extrabold" fill="#4338ca">
            a² + b² = c²
          </text>
          <text x="0" y="36" fontSize="10" fontWeight="bold" fill="#6d28d9">
            sin²α + cos²α = 1
          </text>
          <text x="0" y="54" fontSize="11" fontWeight="bold" fill="#dc2626">
            Δ = b² - 4ac &gt; 0
          </text>
        </g>
      </svg>
    )}

    {type === 'science' && (
      <svg viewBox="0 0 150 80" fill="none" className="w-full h-auto overflow-visible" aria-hidden="true">
        {/* Công thức Nước, Khí CO2 và Einstein E=mc² */}
        <g transform="translate(12, 12)">
          <text x="0" y="24" fontSize="20" fontWeight="extrabold" fill="#0284c7">
            H₂O
          </text>
          <text x="58" y="24" fontSize="18" fontWeight="extrabold" fill="#059669">
            CO₂
          </text>
          <text x="0" y="56" fontSize="18" fontWeight="extrabold" fill="#d97706">
            E = mc²
          </text>
          <text x="80" y="56" fontSize="24" fontWeight="bold" fill="#dc2626">
            ∞
          </text>
        </g>
      </svg>
    )}
  </div>
);

/**
 * Phi Đội Máy Bay Giấy Tuổi Học Trò Bay Lượn Mềm Mại Qua Lại Giữa Hai Bên Trang Chủ
 */
export const FlyingPaperAirplanes: React.FC = () => {
  return (
    <div
      data-testid="flying-paper-airplanes"
      className="pointer-events-none absolute inset-0 overflow-hidden z-15 select-none"
      aria-hidden="true"
    >
      {/* Chiếc máy bay 1: Màu vàng hoàng yến lướt từ góc trên bên trái */}
      <motion.div
        data-testid="flying-paper-airplane"
        className="absolute top-24 left-6 sm:left-14"
        animate={{
          x: [0, 52, 105, 42, 0],
          y: [0, -20, 16, 26, 0],
          rotate: [-14, 2, -18, -8, -14],
        }}
        transition={{
          duration: 9.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative">
          <PaperAirplaneSVG color="amber" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" />
          <svg
            className="absolute -left-12 -top-4 w-20 h-16 pointer-events-none overflow-visible opacity-50"
            viewBox="0 0 80 50"
            fill="none"
          >
            <path
              d="M 5 45 Q 25 35 45 38 T 75 22"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      </motion.div>

      {/* Chiếc máy bay 2: Màu xanh da trời lướt nhẹ từ trên bên phải */}
      <motion.div
        data-testid="flying-paper-airplane"
        className="absolute top-32 right-8 sm:right-20"
        animate={{
          x: [0, -56, -112, -45, 0],
          y: [0, 24, -16, -26, 0],
          rotate: [16, -4, 20, 10, 16],
        }}
        transition={{
          duration: 10.5,
          delay: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative">
          <PaperAirplaneSVG
            color="sky"
            className="w-12 h-12 sm:w-14 sm:h-14 scale-x-[-1] drop-shadow-md"
          />
          <svg
            className="absolute -right-12 -top-4 w-20 h-16 pointer-events-none overflow-visible opacity-50"
            viewBox="0 0 80 50"
            fill="none"
          >
            <path
              d="M 75 45 Q 55 35 35 38 T 5 22"
              stroke="#0ea5e9"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      </motion.div>

      {/* Chiếc máy bay 3: Màu vàng bay lượn ở tầm giữa bên trái */}
      <motion.div
        data-testid="flying-paper-airplane"
        className="hidden md:block absolute top-[680px] left-10 lg:left-20"
        animate={{
          x: [0, 65, 120, 55, 0],
          y: [0, -30, 18, 35, 0],
          rotate: [-16, 5, -20, -10, -16],
        }}
        transition={{
          duration: 11.8,
          delay: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative">
          <PaperAirplaneSVG color="amber" className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-md" />
          <svg
            className="absolute -left-14 -top-3 w-24 h-16 pointer-events-none overflow-visible opacity-45"
            viewBox="0 0 90 50"
            fill="none"
          >
            <path
              d="M 5 42 Q 32 30 58 35 T 88 18"
              stroke="#d97706"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      </motion.div>

      {/* Chiếc máy bay 4: Màu xanh trời bay lượn ở nửa dưới bên phải */}
      <motion.div
        data-testid="flying-paper-airplane"
        className="hidden sm:block absolute top-[1320px] right-8 lg:right-16"
        animate={{
          x: [0, -60, -125, -50, 0],
          y: [0, 26, -20, -32, 0],
          rotate: [14, -6, 18, 8, 14],
        }}
        transition={{
          duration: 12.2,
          delay: 3.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative">
          <PaperAirplaneSVG
            color="sky"
            className="w-11 h-11 sm:w-13 sm:h-13 scale-x-[-1] drop-shadow-md"
          />
          <svg
            className="absolute -right-14 -top-3 w-24 h-16 pointer-events-none overflow-visible opacity-45"
            viewBox="0 0 90 50"
            fill="none"
          >
            <path
              d="M 88 42 Q 62 30 36 35 T 5 18"
              stroke="#0284c7"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Hệ thống Trang Trí Cành Hoa Phượng Đỏ Rực Rỡ & Máy Bay Giấy Hai Bên Rìa Trang Chủ (Chuẩn Poster)
 * Đã loại bỏ hoàn toàn các bình thí nghiệm, công thức toán học và mô hình nguyên tử
 */
export const SchoolSideDecorations: React.FC = () => {
  return (
    <div
      data-testid="school-side-decorations"
      className="pointer-events-none absolute inset-0 overflow-hidden z-10 select-none"
      aria-hidden="true"
    >
      {/* ==================== BÊN TRÁI TRANG CHỦ: CÀNH PHƯỢNG ĐỎ ==================== */}
      <div data-testid="flamboyant-branch-left" className="contents">
        {/* Cụm 1: Góc trên bên trái: Cành hoa phượng đỏ thắm rủ xuống */}
        <motion.div
          style={{ transformOrigin: '0% 0%' }}
          animate={{
            rotate: [-1.5, 2.5, -1, -1.5],
            y: [0, -5, 2, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 -left-6 sm:-left-2 lg:left-0 z-10"
        >
          <img
            src="/decorations/hoa-phuong.png"
            alt="Cành hoa phượng đỏ góc trái"
            className="w-36 sm:w-52 md:w-64 lg:w-72 h-auto drop-shadow-xl"
            loading="eager"
          />
        </motion.div>

        {/* Cụm 2: Tầng giữa bên trái: Chùm hoa phượng đỏ vắt ngang */}
        <motion.div
          style={{ transformOrigin: '10% 50%' }}
          animate={{
            rotate: [1.5, -2, 1.2, 1.5],
            y: [0, 6, -3, 0],
          }}
          transition={{ duration: 6.8, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:block absolute top-[560px] -left-8 lg:-left-4 z-10 opacity-90"
        >
          <img
            src="/decorations/hoa-phuong.png"
            alt="Chùm hoa phượng tầng giữa trái"
            className="w-28 sm:w-40 lg:w-48 h-auto -rotate-12 drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>

        {/* Cụm 3: Nửa dưới bên trái: Cành hoa phượng cuối trang */}
        <motion.div
          style={{ transformOrigin: '20% 60%' }}
          animate={{
            rotate: [-2, 1.8, -2],
            y: [0, -6, 0],
          }}
          transition={{ duration: 6.2, delay: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden lg:block absolute top-[1240px] -left-6 lg:left-0 z-10 opacity-85"
        >
          <img
            src="/decorations/hoa-phuong.png"
            alt="Hoa phượng đỏ tầng dưới trái"
            className="w-32 sm:w-44 lg:w-52 h-auto rotate-6 drop-shadow-md"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* ==================== BÊN PHẢI TRANG CHỦ: CÀNH PHƯỢNG ĐỎ ==================== */}
      <div data-testid="flamboyant-branch-right" className="contents">
        {/* Cụm 1: Góc trên bên phải: Cành hoa phượng đỏ lật đối xứng */}
        <motion.div
          style={{ transformOrigin: '100% 0%' }}
          animate={{
            rotate: [1.8, -2.2, 1.2, 1.8],
            y: [0, 6, -2, 0],
          }}
          transition={{ duration: 6.2, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 -right-6 sm:-right-2 lg:right-0 z-10"
        >
          <img
            src="/decorations/hoa-phuong.png"
            alt="Cành hoa phượng đỏ góc phải"
            className="w-36 sm:w-52 md:w-64 lg:w-72 h-auto scale-x-[-1] drop-shadow-xl"
            loading="eager"
          />
        </motion.div>

        {/* Cụm 2: Tầng giữa bên phải: Chùm hoa phượng đỏ */}
        <motion.div
          style={{ transformOrigin: '90% 50%' }}
          animate={{
            rotate: [-1.8, 2.2, -1.5, -1.8],
            y: [0, -7, 2, 0],
          }}
          transition={{ duration: 7, delay: 1.0, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden md:block absolute top-[560px] -right-8 lg:-right-4 z-10 opacity-90"
        >
          <img
            src="/decorations/hoa-phuong.png"
            alt="Chùm hoa phượng tầng giữa phải"
            className="w-28 sm:w-40 lg:w-48 h-auto scale-x-[-1] rotate-12 drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>

        {/* Cụm 3: Nửa dưới bên phải: Hoa phượng */}
        <motion.div
          style={{ transformOrigin: '80% 60%' }}
          animate={{
            rotate: [2, -2, 2],
            y: [0, 5, 0],
          }}
          transition={{ duration: 5.9, delay: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden lg:block absolute top-[1240px] -right-6 lg:right-0 z-10 opacity-85"
        >
          <img
            src="/decorations/hoa-phuong.png"
            alt="Hoa phượng đỏ tầng dưới phải"
            className="w-32 sm:w-44 lg:w-52 h-auto scale-x-[-1] -rotate-6 drop-shadow-md"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* ==================== PHI ĐỘI MÁY BAY GIẤY BAY LƯỢN ==================== */}
      <FlyingPaperAirplanes />
    </div>
  );
};

/**
 * Export alias FloralSideDecorations để tương thích ngược nếu còn import cũ
 */
export const FloralSideDecorations = SchoolSideDecorations;

