import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Type,
  Award,
} from 'lucide-react';
import { SectionData, SectionId } from '../types/baotuong';
import { countVietnameseWords, estimateReadingMinutes } from '../utils/wordCount';
import { PoetryAudioPlayer } from './PoetryAudioPlayer';
import { MvVideoShowcase } from './MvVideoShowcase';

export interface SectionReaderModalProps {
  section: SectionData | null;
  allSections: SectionData[];
  posterImageUrl?: string;
  onClose: () => void;
  onNavigate: (id: SectionId) => void;
}

type FontScale = 'normal' | 'large' | 'xlarge';

const FONT_SCALE_CLASSES: Record<FontScale, string> = {
  normal: 'text-base sm:text-lg leading-[1.85]',
  large: 'text-lg sm:text-xl leading-[1.9]',
  xlarge: 'text-xl sm:text-2xl leading-[1.95]',
};

export const SectionReaderModal: React.FC<SectionReaderModalProps> = ({
  section,
  allSections,
  posterImageUrl,
  onClose,
  onNavigate,
}) => {
  const [fontScale, setFontScale] = useState<FontScale>('normal');

  if (!section) return null;

  const currentIndex = allSections.findIndex((s) => s.id === section.id);
  const prevSection =
    currentIndex > 0 ? allSections[currentIndex - 1] : allSections[allSections.length - 1];
  const nextSection =
    currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : allSections[0];

  const fullText = (section.paragraphs ?? []).join(' ');
  const wordCount = countVietnameseWords(fullText);
  const readingMinutes = estimateReadingMinutes(fullText);

  return (
    <AnimatePresence>
      <motion.div
        key={section.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/75 p-0 sm:p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 36, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${section.badgeTitle}: ${section.title}`}
          className="paper-texture flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border-2 border-amber-300 shadow-2xl"
        >
          {/* Thanh tiêu đề cố định trên cùng */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 bg-amber-100/90 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-poster-orange px-3 py-1 font-display text-xs sm:text-sm font-extrabold text-white">
                {section.badgeTitle}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 border border-amber-200">
                <Award className="h-3.5 w-3.5 text-amber-600" />
                {section.scoringWeight}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Bộ điều chỉnh cỡ chữ tiếng Việt */}
              <div
                role="group"
                aria-label="Điều chỉnh cỡ chữ đọc bài"
                className="inline-flex items-center rounded-xl border border-amber-300 bg-white p-0.5"
              >
                <Type className="ml-2 mr-1 h-3.5 w-3.5 text-stone-500" />
                <button
                  type="button"
                  onClick={() => setFontScale('normal')}
                  className={`rounded-lg px-2 py-1 text-xs font-bold ${
                    fontScale === 'normal'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale('large')}
                  className={`rounded-lg px-2 py-1 text-xs font-bold ${
                    fontScale === 'large'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale('xlarge')}
                  className={`rounded-lg px-2 py-1 text-xs font-bold ${
                    fontScale === 'xlarge'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  A++
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng khung đọc"
                className="inline-flex items-center gap-1 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-bold text-stone-800 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <X className="h-4 w-4" />
                <span>Đóng</span>
              </button>
            </div>
          </div>

          {/* Nội dung bài viết cuộn ở giữa */}
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 space-y-6">
            {/* Đầu bài viết */}
            <div className="border-b border-amber-200/90 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-poster-orange">
                {section.categoryLabel} • Chi đội 9A3 – Trường TH&THCS Hiệp Thạnh
              </p>
              <h2 className="mt-1 font-serif text-2xl sm:text-4xl font-bold text-stone-900">
                {section.title}
              </h2>
              <p className="mt-1 font-script text-2xl sm:text-3xl font-bold text-amber-800">
                {section.subtitle}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                <span className="font-semibold text-stone-800">
                  ✍️ {section.authorCredit}
                </span>
                <span>•</span>
                <span className="italic">{section.sourceNote}</span>
                {wordCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-bold text-amber-900">
                      <FileText className="h-3.5 w-3.5" />
                      {wordCount} chữ
                    </span>
                    <span className="inline-flex items-center gap-1 text-stone-500">
                      <Clock className="h-3.5 w-3.5" />~{readingMinutes} phút đọc
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Trích dẫn nổi bật (Pull-quote) */}
            {section.pullQuote && (
              <blockquote className="rounded-2xl border-l-4 border-poster-orange bg-amber-100/60 p-4 font-serif text-base sm:text-lg italic text-stone-800 shadow-sm">
                {section.pullQuote}
              </blockquote>
            )}

            {/* Nội dung chuyên biệt cho Thơ Đa Phương Tiện (Mục 3) */}
            {section.id === 'tho' && section.poems && (
              <PoetryAudioPlayer
                poems={section.poems}
                defaultAudioUrl={section.audioRecitationUrl}
                studentVoiceNote={section.studentVoiceNote ?? ''}
              />
            )}

            {/* Nội dung chuyên biệt cho MV Ca Nhạc Số (Mục 4) */}
            {section.id === 'mv' && section.mvData && (
              <MvVideoShowcase
                mvData={section.mvData}
                posterImageUrl={posterImageUrl}
              />
            )}

            {/* Nội dung văn bản cho Lời ngỏ (Mục 1), Truyện ngắn (Mục 2), Bài tri ân (Mục 5) */}
            {section.paragraphs && section.paragraphs.length > 0 && (
              <div
                className={`space-y-4 font-serif text-stone-800 ${FONT_SCALE_CLASSES[fontScale]}`}
              >
                {section.paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-poster-orange'
                        : ''
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Chữ ký cuối bức thư Tri ân */}
            {section.id === 'tri-an' && (
              <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50/80 p-5 text-right">
                <p className="font-script text-2xl font-bold text-red-800">
                  Kính thư & Tri ân sâu sắc,
                </p>
                <p className="mt-1 font-bold text-stone-900">
                  Tập thể học sinh Chi đội 9A3 – Trường TH&THCS Hiệp Thạnh
                </p>
                <p className="text-xs text-stone-600">
                  Mùa Hiến chương Nhà giáo Việt Nam 20/11
                </p>
              </div>
            )}
          </div>

          {/* Thanh điều hướng cố định dưới đáy (Thuận tiện ngón cái trên điện thoại) */}
          <div className="flex items-center justify-between gap-2 border-t border-amber-200 bg-amber-100/90 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => onNavigate(prevSection.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-stone-800 transition hover:bg-amber-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {prevSection.badgeTitle}
              </span>
            </button>

            <span className="text-xs font-bold text-stone-600">
              Mục {section.orderNumber} / {allSections.length}
            </span>

            <button
              type="button"
              onClick={() => onNavigate(nextSection.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-poster-orange px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-red-600"
            >
              <span className="truncate max-w-[120px] sm:max-w-none">
                {nextSection.badgeTitle}
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

