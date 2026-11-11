import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import { BaoTuongConfig, SectionId } from '../types/baotuong';

export interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BaoTuongConfig;
  initialSectionId?: SectionId | null;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  config,
  initialSectionId,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://baotuong-9a3-hiepthanh.edu.vn/';

  const copyUrl = (key: string, url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Trung tâm Mã QR và Đường link truy cập Báo tường số 9A3"
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border-2 border-amber-300 bg-paper-50 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-amber-200 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                  <QrCode className="h-3.5 w-3.5" />
                  Mã QR & Đường link truy cập trực tiếp
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-stone-900">
                  Mã QR Tệp Sản Phẩm Báo Tường Số – {config.className}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Ban giám khảo có thể quét Mã QR tổng để mở toàn bộ Bảng Infographic hoặc quét từng Mã QR bên dưới để đi thẳng tới từng sản phẩm.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng cửa sổ Mã QR"
                className="rounded-full border border-stone-300 bg-white p-2 text-stone-700 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mã QR Tổng cho toàn bộ Tệp sản phẩm Báo tường số */}
            <div className="mt-5 flex flex-col sm:flex-row items-center gap-5 rounded-2xl border-2 border-sky-400 bg-sky-50/70 p-4">
              <div className="rounded-2xl border border-sky-200 bg-white p-3 shadow-sm">
                <QRCodeSVG value={baseUrl} size={124} level="M" includeMargin />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block rounded-md bg-sky-700 px-2.5 py-0.5 text-xs font-bold uppercase text-white">
                  Mã QR Chính – Toàn Bộ Báo Tường Số {config.className}
                </span>
                <h3 className="mt-1 font-display text-lg font-extrabold text-stone-900">
                  {config.newspaperTitle} ({config.schoolName})
                </h3>
                <p className="mt-1 break-all font-mono text-xs text-sky-900 bg-white/90 px-3 py-1.5 rounded-lg border border-sky-200">
                  {baseUrl}
                </p>
                <div className="mt-2.5 flex flex-wrap justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl('main', baseUrl)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-sky-800"
                  >
                    {copiedKey === 'main' ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Đã sao chép link</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Sao chép đường link nộp bài</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 5 Mã QR riêng cho từng sản phẩm con */}
            <h3 className="mt-6 font-display text-base font-extrabold text-stone-800">
              Mã QR truy cập trực tiếp từng hạng mục sản phẩm:
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {config.sections.map((sec) => {
                const sectionUrl = `${baseUrl}#${sec.id}`;
                const isHighlighted = initialSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`flex flex-col items-center rounded-2xl border p-4 text-center transition ${
                      isHighlighted
                        ? 'border-2 border-poster-orange bg-amber-50 shadow-md'
                        : 'border-amber-200 bg-white'
                    }`}
                  >
                    <QRCodeSVG value={sectionUrl} size={96} level="M" />
                    <p className="mt-2.5 font-display text-sm font-extrabold text-stone-900">
                      {sec.badgeTitle}
                    </p>
                    <p className="line-clamp-1 text-xs text-stone-600">
                      {sec.title}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(sec.id, sectionUrl)}
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                      >
                        {copiedKey === sec.id ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedKey === sec.id ? 'Đã chép' : 'Copy link'}</span>
                      </button>
                      <a
                        href={`#${sec.id}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 hover:bg-amber-200"
                      >
                        <span>Mở mục</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mã QR dành riêng cho chức năng Gửi & Xem Lời Chúc 20/11 */}
            <h3 className="mt-6 font-display text-base font-extrabold text-stone-800">
              Mã QR Gửi & Xem Lời Chúc 20/11 (Đồng bộ liên thiết bị):
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  key: 'xem-loi-chuc',
                  title: 'Trang Xem Lời Chúc (Dành Cho Thầy Cô)',
                  subtitle: 'Thầy cô quét mã để đọc toàn bộ lời chúc 20/11 từ thiết bị khác',
                  hash: '#xem-loi-chuc',
                },
                {
                  key: 'gui-loi-chuc',
                  title: 'Biểu Mẫu Gửi Lời Chúc 20/11 (Học Sinh)',
                  subtitle: 'Học sinh quét mã để viết và gửi lời chúc trực tuyến',
                  hash: '#gui-loi-chuc',
                },
                {
                  key: 'bang-giao-vien',
                  title: 'Bảng Tổng Hợp Giáo Viên Bộ Môn (Thầy Cô)',
                  subtitle: 'Thầy cô quét mã mở trang xem Bảng Tổng Hợp Giáo Viên từ thiết bị khác',
                  hash: '#bang-giao-vien',
                },
                {
                  key: 'bieu-mau-giao-vien',
                  title: 'Biểu Mẫu Thông Tin & Ảnh Giáo Viên (Học Sinh)',
                  subtitle: 'Học sinh quét mã thêm giáo viên, đổi ảnh hoặc điền tính cách',
                  hash: '#bieu-mau-giao-vien',
                },
              ].map((item) => {
                const itemUrl = `${baseUrl}${item.hash}`;
                return (
                  <div
                    key={item.key}
                    className="flex flex-col items-center rounded-2xl border-2 border-red-200 bg-red-50/40 p-4 text-center"
                  >
                    <QRCodeSVG value={itemUrl} size={96} level="M" />
                    <p className="mt-2.5 font-display text-sm font-extrabold text-stone-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-stone-600">{item.subtitle}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(item.key, itemUrl)}
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                      >
                        {copiedKey === item.key ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedKey === item.key ? 'Đã chép' : 'Copy link'}</span>
                      </button>
                      <a
                        href={item.hash}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-800"
                      >
                        <span>Mở ngay</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

