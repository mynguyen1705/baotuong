import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Camera,
  CheckCircle2,
  Heart,
  ImagePlus,
  MessageSquarePlus,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { TeacherModalMode, TeacherProfile } from '../types/teachers';
import { TeacherAvatarIllustration } from './TeacherAvatarIllustration';
import { DecoPolaroidFrame } from './DecoPolaroidFrame';
import { TeacherSummaryBoardSection } from './TeacherSummaryBoardSection';
import { fileToImageDataUrl } from '../utils/imageDataUrl';

export interface TeacherBoardModalProps {
  isOpen: boolean;
  mode: TeacherModalMode;
  isOwner?: boolean;
  teachers: TeacherProfile[];
  selectedTeacherId: string | null;
  onClose: () => void;
  onModeChange: (mode: TeacherModalMode, teacherId?: string) => void;
  onSelectTeacher: (teacherId: string) => void;
  onTeachersUpdated: (nextTeachers: TeacherProfile[]) => void;
  onRefreshTeachers?: () => Promise<void>;
}

export const TeacherBoardModal: React.FC<TeacherBoardModalProps> = ({
  isOpen,
  mode,
  isOwner = true,
  teachers,
  selectedTeacherId,
  onClose,
  onModeChange,
  onSelectTeacher,
  onTeachersUpdated,
  onRefreshTeachers,
}) => {
  const activeTeacher =
    teachers.find((t) => t.id === selectedTeacherId) || teachers[0] || null;

  // Form state for adding a new teacher (unlimited count)
  const [subject, setSubject] = useState('');
  const [honorificAndName, setHonorificAndName] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [badgeSide, setBadgeSide] = useState<'left' | 'right'>('right');
  const [summary, setSummary] = useState('');
  const [traitsInput, setTraitsInput] = useState('');
  const [detailedBio, setDetailedBio] = useState('');
  const [memorableQuote, setMemorableQuote] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // State for updating photo or adding impression to an existing teacher
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('9A3');
  const [impressionTrait, setImpressionTrait] = useState('');
  const [impressionDetail, setImpressionDetail] = useState('');
  const [customPhotoUrlInput, setCustomPhotoUrlInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [mode, selectedTeacherId, isOpen]);

  const handleUploadNewTeacherPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToImageDataUrl(file);
      if (dataUrl) {
        setPhotoUrl(dataUrl);
      }
    } catch {
      setErrorMessage('Không thể đọc tệp ảnh vừa chọn.');
    } finally {
      e.target.value = '';
    }
  };

  const handleUpdateExistingTeacherPhoto = async (
    teacherId: string,
    newPhotoDataUrl: string
  ) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl: newPhotoDataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Không thể cập nhật ảnh giáo viên.');
        return;
      }
      const updated: TeacherProfile = data.teacher;
      onTeachersUpdated(
        teachers.map((item) => (item.id === updated.id ? updated : item))
      );
      setSuccessMessage('Đã cập nhật ảnh giáo viên thành công!');
      setCustomPhotoUrlInput('');
    } catch {
      setErrorMessage('Lỗi kết nối máy chủ khi cập nhật ảnh giáo viên.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!isOwner) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Không thể xóa giáo viên.');
        return;
      }
      const nextList = teachers.filter((item) => item.id !== teacherId);
      onTeachersUpdated(nextList);
      if (selectedTeacherId === teacherId) {
        onSelectTeacher(nextList[0]?.id ?? '');
      }
      setSuccessMessage('Đã xóa giáo viên khỏi Bảng Tổng Hợp!');
    } catch {
      setErrorMessage('Lỗi kết nối máy chủ khi xóa giáo viên.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const personalityTraits = traitsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          honorificAndName,
          badgeText,
          badgeSide,
          summary,
          personalityTraits: personalityTraits.length > 0 ? personalityTraits : undefined,
          detailedBio,
          memorableQuote,
          photoUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Vui lòng kiểm tra lại thông tin giáo viên.');
        return;
      }

      const created: TeacherProfile = data.teacher;
      const nextList = [...teachers, created];
      onTeachersUpdated(nextList);

      setSubject('');
      setHonorificAndName('');
      setBadgeText('');
      setSummary('');
      setTraitsInput('');
      setDetailedBio('');
      setMemorableQuote('');
      setPhotoUrl('');
      setSuccessMessage(
        `Đã thêm "${created.subject} - ${created.honorificAndName}" vào Bảng Tổng Hợp Giáo Viên!`
      );
    } catch {
      setErrorMessage('Không thể kết nối máy chủ để lưu giáo viên mới.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImpressionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/teachers/${encodeURIComponent(activeTeacher.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          impression: {
            studentName,
            className,
            trait: impressionTrait,
            detail: impressionDetail,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Vui lòng điền đầy đủ thông tin cảm nhận.');
        return;
      }

      const updated: TeacherProfile = data.teacher;
      onTeachersUpdated(
        teachers.map((item) => (item.id === updated.id ? updated : item))
      );
      setStudentName('');
      setImpressionTrait('');
      setImpressionDetail('');
      setSuccessMessage('Đã gửi cảm nhận & bổ sung tính cách giáo viên thành công!');
    } catch {
      setErrorMessage('Không thể kết nối máy chủ khi gửi cảm nhận.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 p-2 sm:p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Bảng tổng hợp giáo viên bộ môn và biểu mẫu thông tin"
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border-2 border-sky-300 bg-sky-50 p-4 sm:p-6 shadow-2xl"
          >
            {/* Thanh điều hướng chế độ trên đầu Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onModeChange('board')}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-extrabold transition ${
                    mode === 'board'
                      ? 'bg-sky-700 text-white shadow'
                      : 'bg-white text-sky-900 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Bảng Tổng Hợp ({teachers.length} Giáo Viên)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onModeChange('detail')}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-extrabold transition ${
                    mode === 'detail'
                      ? 'bg-sky-700 text-white shadow'
                      : 'bg-white text-sky-900 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>{isOwner ? 'Hồ Sơ Chi Tiết & Đổi Ảnh' : 'Hồ Sơ Chi Tiết & Gửi Cảm Nhận'}</span>
                </button>

                {isOwner && (
                  <button
                    type="button"
                    onClick={() => onModeChange('form')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-extrabold transition ${
                      mode === 'form'
                        ? 'bg-amber-500 text-white shadow'
                        : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>+ Thêm Giáo Viên Mới (Không Giới Hạn)</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onRefreshTeachers && (
                  <button
                    type="button"
                    onClick={() => {
                      onRefreshTeachers();
                    }}
                    title="Làm mới dữ liệu từ máy chủ"
                    className="inline-flex items-center gap-1 rounded-xl border border-sky-300 bg-white px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Đồng bộ mới nhất</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng cửa sổ bảng giáo viên"
                  className="rounded-full border border-stone-300 bg-white p-2 text-stone-700 hover:bg-stone-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Thông báo trạng thái */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-xs sm:text-sm font-semibold text-red-800"
              >
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div
                role="status"
                className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-900"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* CHẾ ĐỘ 1: BẢNG TỔNG HỢP TOÀN CẢNH CHO THẦY CÔ (#bang-giao-vien) */}
            {mode === 'board' && (
              <div className="mt-4">
                <TeacherSummaryBoardSection
                  teachers={teachers}
                  isOwner={isOwner}
                  isStandaloneModal={true}
                  onSelectTeacher={(teacher) => {
                    onSelectTeacher(teacher.id);
                    onModeChange('detail', teacher.id);
                  }}
                  onOpenForm={(teacherId) => {
                    if (teacherId || !isOwner) {
                      const targetId = teacherId || teachers[0]?.id || '';
                      onSelectTeacher(targetId);
                      onModeChange('detail', targetId);
                    } else {
                      onModeChange('form');
                    }
                  }}
                  onUpdateTeacherPhoto={
                    isOwner
                      ? (id, dataUrl) => {
                          handleUpdateExistingTeacherPhoto(id, dataUrl);
                        }
                      : undefined
                  }
                  onDeleteTeacher={
                    isOwner
                      ? (id) => {
                          handleDeleteTeacher(id);
                        }
                      : undefined
                  }
                />
              </div>
            )}

            {/* CHẾ ĐỘ 2: HỒ SƠ CHI TIẾT TÍNH CÁCH & ĐỔI ẢNH GIÁO VIÊN BẤT CỨ LÚC NÀO */}
            {mode === 'detail' && activeTeacher && (
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cột chọn nhanh giáo viên + Khung Polaroid + Đổi ảnh bất cứ lúc nào */}
                <div className="lg:col-span-5 flex flex-col items-center rounded-2xl border-2 border-sky-200 bg-white p-5 shadow-sm">
                  <label
                    htmlFor="select-teacher-profile"
                    className="w-full text-xs font-extrabold uppercase tracking-wider text-sky-900"
                  >
                    Chọn giáo viên bộ môn để xem / đổi ảnh:
                  </label>
                  <select
                    id="select-teacher-profile"
                    value={activeTeacher.id}
                    onChange={(e) => onSelectTeacher(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border-2 border-sky-300 bg-sky-50/60 px-3 py-2 text-sm font-bold text-stone-900 focus:border-sky-600 focus:outline-none"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.subject} - {t.honorificAndName}
                      </option>
                    ))}
                  </select>

                  {/* Khung Polaroid Trang Trí Pastel Deco lớn */}
                  <div className="mt-5 flex w-full justify-center">
                    <DecoPolaroidFrame
                      index={Math.max(
                        0,
                        teachers.findIndex((t) => t.id === activeTeacher.id)
                      )}
                      caption={
                        <div>
                          <span className="inline-block rounded-full bg-orange-500 px-3 py-0.5 text-xs font-black text-white">
                            {activeTeacher.badgeText}
                          </span>
                          <h3 className="mt-1.5 font-display text-base font-black uppercase text-stone-900">
                            {activeTeacher.subject} - {activeTeacher.honorificAndName}
                          </h3>
                          <p className="mt-1 text-xs font-semibold text-stone-600">
                            {activeTeacher.summary}
                          </p>
                        </div>
                      }
                    >
                      <TeacherAvatarIllustration
                        photoUrl={activeTeacher.photoUrl}
                        theme={activeTeacher.avatarTheme}
                        honorificAndName={activeTeacher.honorificAndName}
                        subject={activeTeacher.subject}
                        className="h-full w-full"
                      />
                    </DecoPolaroidFrame>
                  </div>

                  {/* Khối Thêm / Đổi ảnh & Xóa giáo viên (Chỉ hiển thị cho chủ sở hữu trên localhost) */}
                  {isOwner && (
                    <div className="mt-5 w-full rounded-2xl border border-amber-300 bg-amber-50/70 p-3.5">
                      <p className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
                        <Camera className="h-4 w-4 text-amber-600" />
                        <span>Quyền Chủ Sở Hữu: Thêm / đổi ảnh hoặc xóa giáo viên:</span>
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white shadow hover:bg-amber-700">
                          <ImagePlus className="h-4 w-4" />
                          <span>Tải ảnh từ máy / điện thoại</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const dataUrl = await fileToImageDataUrl(file);
                              if (dataUrl) {
                                await handleUpdateExistingTeacherPhoto(activeTeacher.id, dataUrl);
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>

                      <div className="mt-2.5 flex gap-1.5">
                        <input
                          type="text"
                          value={customPhotoUrlInput}
                          onChange={(e) => setCustomPhotoUrlInput(e.target.value)}
                          placeholder="Hoặc dán link ảnh (https://... hoặc data:image/...)"
                          className="flex-1 rounded-xl border border-amber-300 bg-white px-2.5 py-1.5 text-xs text-stone-800"
                        />
                        <button
                          type="button"
                          disabled={isSubmitting || !customPhotoUrlInput.trim()}
                          onClick={() =>
                            handleUpdateExistingTeacherPhoto(
                              activeTeacher.id,
                              customPhotoUrlInput.trim()
                            )
                          }
                          className="rounded-xl bg-stone-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-stone-900 disabled:opacity-50"
                        >
                          Lưu ảnh
                        </button>
                      </div>

                      <div className="mt-3 border-t border-amber-200 pt-2.5 flex justify-end">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleDeleteTeacher(activeTeacher.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Xóa giáo viên này khỏi Bảng Tổng Hợp</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cột thông tin chi tiết tính cách & Biểu mẫu gửi thêm cảm nhận của học sinh */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="rounded-2xl border-2 border-sky-200 bg-white p-5 shadow-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                      <Sparkles className="h-3.5 w-3.5" />
                      Hồ sơ tính cách & Phong cách giảng dạy
                    </span>
                    <h3 className="mt-2 font-display text-xl font-black text-stone-900">
                      {activeTeacher.subject} – {activeTeacher.honorificAndName}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-700">
                      {activeTeacher.detailedBio}
                    </p>

                    {activeTeacher.memorableQuote && (
                      <blockquote className="mt-3 rounded-xl border-l-4 border-amber-500 bg-amber-50/70 px-4 py-2.5 text-xs sm:text-sm italic font-semibold text-amber-950">
                        {activeTeacher.memorableQuote}
                      </blockquote>
                    )}

                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Từ khóa tính cách nổi bật:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activeTeacher.personalityTraits.map((trait, idx) => (
                          <span
                            key={`${trait}-${idx}`}
                            className="inline-flex items-center gap-1 rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-extrabold text-orange-900"
                          >
                            <Heart className="h-3 w-3 text-orange-500" />
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Biểu mẫu cho học sinh bổ sung chi tiết tính cách & kỷ niệm với giáo viên này */}
                  <div className="rounded-2xl border-2 border-sky-200 bg-white p-5 shadow-sm">
                    <h4 className="flex items-center gap-2 font-display text-base font-extrabold text-stone-900">
                      <MessageSquarePlus className="h-4 w-4 text-sky-700" />
                      <span>Biểu mẫu gửi thêm chi tiết tính cách & kỷ niệm về thầy/cô</span>
                    </h4>
                    <form onSubmit={handleAddImpressionSubmit} className="mt-3 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-stone-700">
                            Tên học sinh / Nhóm học sinh *
                          </label>
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Ví dụ: Nguyễn Minh Anh (Tổ 2)"
                            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700">Lớp</label>
                          <input
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700">
                          Nét tính cách ấn tượng nhất *
                        </label>
                        <input
                          type="text"
                          required
                          value={impressionTrait}
                          onChange={(e) => setImpressionTrait(e.target.value)}
                          placeholder="Ví dụ: Giảng bài siêu dễ hiểu, Cực kỳ tâm lý..."
                          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700">
                          Chi tiết / Kỷ niệm đáng nhớ với thầy cô *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={impressionDetail}
                          onChange={(e) => setImpressionDetail(e.target.value)}
                          placeholder="Chia sẻ câu chuyện nhỏ hoặc điều em quý nhất ở thầy/cô..."
                          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-xs sm:text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-700 px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow hover:bg-sky-800 disabled:opacity-50"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Lưu vào hồ sơ tính cách của thầy/cô</span>
                      </button>
                    </form>

                    {/* Danh sách cảm nhận đã gửi */}
                    <div className="mt-5 border-t border-stone-200 pt-4">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-stone-600">
                        Cảm nhận từ học sinh lớp 9A3 ({activeTeacher.impressions.length}):
                      </p>
                      <div className="mt-2.5 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {activeTeacher.impressions.map((imp) => (
                          <div
                            key={imp.id}
                            className="rounded-xl border border-sky-100 bg-sky-50/60 p-3 text-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-sky-950">
                              <span>
                                {imp.studentName} ({imp.className})
                              </span>
                              <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[11px] text-amber-950">
                                {imp.trait}
                              </span>
                            </div>
                            <p className="mt-1 text-stone-700">{imp.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHẾ ĐỘ 3: BIỂU MẪU THÊM GIÁO VIÊN MỚI KHÔNG GIỚI HẠN SỐ LƯỢNG & KÈM ẢNH (#bieu-mau-giao-vien) */}
            {mode === 'form' && !isOwner && (
              <div className="mt-5 rounded-2xl border-2 border-amber-300 bg-white p-6 text-center shadow-sm">
                <h3 className="font-display text-lg font-black text-stone-900">
                  Quyền Thêm / Bớt Giáo Viên Dành Riêng Cho Chủ Sở Hữu
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-600">
                  Chỉ máy tính của chủ sở hữu (localhost/127.0.0.1) mới có quyền thêm hoặc xóa giáo viên và đổi ảnh Polaroid. Học sinh vẫn có thể gửi cảm nhận và tính cách cho từng giáo viên trong phần Hồ Sơ Chi Tiết.
                </p>
                <button
                  type="button"
                  onClick={() => onModeChange('detail')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-700 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow hover:bg-sky-800"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Điền cảm nhận tính cách cho giáo viên đã có</span>
                </button>
              </div>
            )}
            {mode === 'form' && isOwner && (
              <div className="mt-5 rounded-2xl border-2 border-amber-300 bg-white p-5 sm:p-6 shadow-sm">
                <div className="border-b border-amber-200 pb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Quyền Chủ Sở Hữu • Không giới hạn số lượng giáo viên • Thêm/đổi ảnh bất cứ lúc nào
                  </span>
                  <h3 className="mt-2 font-display text-xl font-black text-stone-900">
                    Biểu Mẫu Thêm Giáo Viên Vào Bảng Tổng Hợp
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Điền thông tin tính cách và tải ảnh giáo viên lên để bổ sung thẻ Polaroid mới vào Bảng Tổng Hợp Giáo Viên Bộ Môn.
                  </p>
                </div>

                <form onSubmit={handleCreateTeacherSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="teacher-subject-input"
                        className="block text-xs font-extrabold text-stone-800"
                      >
                        Bộ môn giảng dạy *
                      </label>
                      <input
                        id="teacher-subject-input"
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Ví dụ: TIẾNG ANH, TIN HỌC, ÂM NHẠC..."
                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="teacher-name-input"
                        className="block text-xs font-extrabold text-stone-800"
                      >
                        Danh xưng & Họ tên giáo viên *
                      </label>
                      <input
                        id="teacher-name-input"
                        type="text"
                        required
                        value={honorificAndName}
                        onChange={(e) => setHonorificAndName(e.target.value)}
                        placeholder="Ví dụ: CÔ HỒNG NHUNG hoặc THẦY HOÀNG MINH"
                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="teacher-badge-input"
                        className="block text-xs font-extrabold text-stone-800"
                      >
                        Nhãn tính cách nổi bật (Sticker trên ảnh Polaroid) *
                      </label>
                      <input
                        id="teacher-badge-input"
                        type="text"
                        required
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        placeholder="Ví dụ: Siêu vui tính!, Truyền cảm hứng!, Cực kỳ tâm lý!"
                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="teacher-badge-side"
                        className="block text-xs font-extrabold text-stone-800"
                      >
                        Vị trí nhãn dán
                      </label>
                      <select
                        id="teacher-badge-side"
                        value={badgeSide}
                        onChange={(e) => setBadgeSide(e.target.value as 'left' | 'right')}
                        className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                      >
                        <option value="right">Góc phải khung ảnh</option>
                        <option value="left">Góc trái khung ảnh</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="teacher-summary-input"
                      className="block text-xs font-extrabold text-stone-800"
                    >
                      Mô tả ngắn dưới ảnh Polaroid (2 dòng tóm tắt tính cách) *
                    </label>
                    <input
                      id="teacher-summary-input"
                      type="text"
                      required
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Ví dụ: Giọng nói truyền cảm, luôn có những trò chơi học tập thú vị"
                      className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="teacher-traits-input"
                        className="block text-xs font-extrabold text-stone-800"
                      >
                        Các từ khóa tính cách (cách nhau bởi dấu phẩy)
                      </label>
                      <input
                        id="teacher-traits-input"
                        type="text"
                        value={traitsInput}
                        onChange={(e) => setTraitsInput(e.target.value)}
                        placeholder="Ví dụ: Vui vẻ, Nhiệt tình, Tâm lý"
                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="teacher-quote-input"
                        className="block text-xs font-extrabold text-stone-800"
                      >
                        Câu nói quen thuộc của thầy/cô
                      </label>
                      <input
                        id="teacher-quote-input"
                        type="text"
                        value={memorableQuote}
                        onChange={(e) => setMemorableQuote(e.target.value)}
                        placeholder="Ví dụ: “Học hết sức, chơi hết mình nhé 9A3!”"
                        className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="teacher-bio-input"
                      className="block text-xs font-extrabold text-stone-800"
                    >
                      Giới thiệu chi tiết về tính cách & kỷ niệm với lớp
                    </label>
                    <textarea
                      id="teacher-bio-input"
                      rows={3}
                      value={detailedBio}
                      onChange={(e) => setDetailedBio(e.target.value)}
                      placeholder="Chia sẻ chi tiết về phong cách giảng dạy và kỷ niệm đáng nhớ của thầy/cô..."
                      className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
                    />
                  </div>

                  {/* Khu vực tải ảnh giáo viên (hoặc nhập link ảnh) */}
                  <div className="rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 p-4">
                    <p className="text-xs font-extrabold text-sky-950">
                      Ảnh chân dung giáo viên (Có thể tải lên ngay hoặc bổ sung/đổi ảnh bất cứ lúc nào sau này):
                    </p>
                    <div className="mt-2.5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-sky-700 px-4 py-2 text-xs font-bold text-white shadow hover:bg-sky-800">
                        <ImagePlus className="h-4 w-4" />
                        <span>Chọn tệp ảnh từ thiết bị</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUploadNewTeacherPhoto}
                        />
                      </label>

                      <div className="flex-1 w-full">
                        <label htmlFor="teacher-photo-url-input" className="sr-only">
                          Đường dẫn ảnh giáo viên
                        </label>
                        <input
                          id="teacher-photo-url-input"
                          type="text"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="Hoặc dán đường dẫn ảnh (URL / Data URL)..."
                          className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    {photoUrl && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={photoUrl}
                          alt="Xem trước ảnh giáo viên"
                          className="h-16 w-16 rounded-lg border border-stone-300 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="text-xs font-bold text-red-700 underline"
                        >
                          Xóa ảnh đã chọn (dùng minh họa mặc định)
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onModeChange('board')}
                      className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-700 hover:bg-stone-100"
                    >
                      Xem Bảng Tổng Hợp
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md hover:bg-amber-600 disabled:opacity-50"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Lưu vào Bảng Tổng Hợp Giáo Viên</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

