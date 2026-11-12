import React from 'react';
import {
  Users,
  QrCode,
  CheckCircle2,
  School,
  Sparkles,
  Send,
  BookHeart,
  GraduationCap,
  BookOpen,
  BookText,
  Scroll,
  Film,
  Heart,
  Camera,
} from 'lucide-react';
import { BaoTuongConfig, SectionId } from '../types/baotuong';
import { WishesModalMode } from '../types/wishes';
import { TeacherModalMode } from '../types/teachers';

export interface EditorialFooterProps {
  config: BaoTuongConfig;
  onSelectSection: (id: SectionId) => void;
  onOpenQrModal: () => void;
  onOpenWishes?: (mode: WishesModalMode) => void;
  onOpenTeacherBoard?: (mode: TeacherModalMode) => void;
  onOpenMemories?: () => void;
}

export const EditorialFooter: React.FC<EditorialFooterProps> = ({
  config,
  onSelectSection,
  onOpenQrModal,
  onOpenWishes,
  onOpenTeacherBoard,
  onOpenMemories,
}) => {
  return (
    <footer className="mt-12 border-t-2 border-amber-300 bg-gradient-to-b from-amber-100/70 to-amber-200/50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Khối Ban Biên Tập Lớp 9A3 & Thông tin thể lệ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-3xl border border-amber-300 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-amber-900">
              <Users className="h-6 w-6 text-poster-orange" />
              <h2 className="font-display text-xl sm:text-2xl font-extrabold">
                Ban Biên Tập Báo Tường Số – {config.className}
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-stone-600">
              Đơn vị: <strong>{config.className} – {config.schoolName}</strong> ({config.schoolYear}) • Cố vấn: {config.homeroomTeacher}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {config.editorialBoard.map((member) => (
                <div
                  key={member.role}
                  className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-poster-orange">
                    {member.role}
                  </p>
                  <p className="mt-0.5 font-bold text-stone-900">{member.name}</p>
                  <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                    {member.task}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Khối Checklist 5 Hạng mục sản phẩm theo thể lệ yeucau.txt */}
          <div className="lg:col-span-5 rounded-3xl border border-amber-300 bg-white/90 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <h2 className="font-display text-xl font-extrabold">
                  Danh Mục Tệp Sản Phẩm Số
                </h2>
              </div>
              <p className="mt-1 text-xs text-stone-600">
                Bấm vào từng hạng mục để chuyển nhanh hoặc quét mã QR riêng cho từng sản phẩm:
              </p>

              <ul className="mt-4 space-y-2">
                {config.sections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => onSelectSection(section.id)}
                      className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-paper-50 px-3.5 py-2 text-left text-xs sm:text-sm font-semibold text-stone-800 transition hover:border-poster-orange hover:bg-amber-100/70"
                    >
                      <span className="inline-flex items-center gap-2">
                        {section.id === 'loi-ngo' && <BookOpen className="h-4 w-4 text-amber-700 shrink-0" />}
                        {section.id === 'truyen-ngan' && <BookText className="h-4 w-4 text-emerald-700 shrink-0" />}
                        {section.id === 'tho' && <Scroll className="h-4 w-4 text-red-700 shrink-0" />}
                        {section.id === 'mv' && <Film className="h-4 w-4 text-sky-700 shrink-0" />}
                        {section.id === 'tri-an' && <Heart className="h-4 w-4 text-rose-700 shrink-0" />}
                        <span>
                          <strong>{section.badgeTitle}:</strong> {section.title}
                        </span>
                      </span>
                      <span className="ml-2 shrink-0 text-xs font-bold text-poster-orange">
                        Xem →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {onOpenWishes && (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onOpenWishes('submit')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-poster-orange bg-amber-50 px-3.5 py-2.5 text-xs sm:text-sm font-extrabold text-poster-orange transition hover:bg-amber-100"
                >
                  <Send className="h-4 w-4" />
                  <span>Gửi Lời Chúc 20/11</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenWishes('view')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-red-700 px-3.5 py-2.5 text-xs sm:text-sm font-extrabold text-white transition hover:bg-red-800"
                >
                  <BookHeart className="h-4 w-4" />
                  <span>Xem Lời Chúc (Thầy Cô)</span>
                </button>
              </div>
            )}

            {onOpenTeacherBoard && (
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onOpenTeacherBoard('board')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-sky-600 bg-sky-50 px-3.5 py-2.5 text-xs sm:text-sm font-extrabold text-sky-900 transition hover:bg-sky-100"
                >
                  <GraduationCap className="h-4 w-4 text-sky-700" />
                  <span>Bảng Tổng Hợp Giáo Viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTeacherBoard('form')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-amber-500 px-3.5 py-2.5 text-xs sm:text-sm font-extrabold text-white transition hover:bg-amber-600"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Biểu Mẫu Giáo Viên & Ảnh</span>
                </button>
              </div>
            )}

            {onOpenMemories && (
              <button
                type="button"
                onClick={onOpenMemories}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm transition hover:brightness-105"
              >
                <Camera className="h-4 w-4" />
                <span>Trạm Ký Ức (Album Kỷ Niệm 9A3)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenQrModal}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-800"
            >
              <QrCode className="h-4 w-4" />
              <span>Mở Bảng Mã QR Toàn Tờ Báo </span>
            </button>
          </div>
        </div>

        {/* Dòng bản quyền cuối trang */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-300/80 pt-6 text-xs sm:text-sm text-stone-700">
          <p className="inline-flex items-center gap-1.5 font-semibold">
            <School className="h-4 w-4 text-red-700" />
            <span>
              {config.schoolName} • Tập thể học sinh {config.className}
            </span>
          </p>
          <p className="inline-flex items-center gap-1 text-stone-600">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Chủ đề: “{config.competitionTheme}” – Chào mừng 20/11</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

