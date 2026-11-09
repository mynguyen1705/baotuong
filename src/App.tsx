import React, { useCallback, useEffect, useState } from 'react';
import { BAO_TUONG_DATA, getSectionById } from './data/baotuongData';
import { SectionId } from './types/baotuong';
import { WishesModalMode } from './types/wishes';
import { DEFAULT_TEACHERS_SEED, TeacherModalMode, TeacherProfile } from './types/teachers';
import { FloatingAcademicSparkles } from './components/FallingPetals';
import { SchoolSideDecorations } from './components/SchoolDecorations';
import { HeroMasthead } from './components/HeroMasthead';
import { InfographicGrid } from './components/InfographicGrid';
import { InteractivePosterView } from './components/InteractivePosterView';
import { SectionReaderModal } from './components/SectionReaderModal';
import { EditorialFooter } from './components/EditorialFooter';
import { QrCodeModal } from './components/QrCodeModal';
import { WishesModal } from './components/WishesModal';
import { TeacherSummaryBoardSection } from './components/TeacherSummaryBoardSection';
import { TeacherBoardModal } from './components/TeacherBoardModal';
import { isLocalhostClient } from './utils/isLocalhostClient';

function parseSectionHash(hash: string): SectionId | null {
  const cleaned = hash.replace(/^#/, '').trim();
  const found = getSectionById(cleaned);
  return found ? found.id : null;
}

function parseWishesHash(hash: string): WishesModalMode | null {
  const cleaned = hash.replace(/^#/, '').trim();
  if (cleaned === 'gui-loi-chuc') return 'submit';
  if (cleaned === 'xem-loi-chuc') return 'view';
  return null;
}

function parseTeacherHash(hash: string): TeacherModalMode | null {
  const cleaned = hash.replace(/^#/, '').trim();
  if (cleaned === 'bang-giao-vien') return 'board';
  if (cleaned === 'bieu-mau-giao-vien') return 'form';
  if (cleaned === 'ho-so-giao-vien') return 'detail';
  return null;
}

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'poster'>('cards');
  const [activeSectionId, setActiveSectionId] = useState<SectionId | null>(() =>
    typeof window !== 'undefined' ? parseSectionHash(window.location.hash) : null
  );
  const [wishesModalMode, setWishesModalMode] = useState<WishesModalMode | null>(() =>
    typeof window !== 'undefined' ? parseWishesHash(window.location.hash) : null
  );
  const [teacherModalMode, setTeacherModalMode] = useState<TeacherModalMode | null>(() =>
    typeof window !== 'undefined' ? parseTeacherHash(window.location.hash) : null
  );
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() =>
    structuredClone(DEFAULT_TEACHERS_SEED)
  );
  const [isOwner, setIsOwner] = useState<boolean>(() => isLocalhostClient());
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    DEFAULT_TEACHERS_SEED[0]?.id ?? null
  );
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrHighlightSectionId, setQrHighlightSectionId] = useState<SectionId | null>(null);
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);

  const fetchTeachers = useCallback(async () => {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
    try {
      let res = await fetch('/api/teachers');
      if (!res.ok) {
        res = await fetch('/teachers-data.json');
      }
      if (!res.ok) return;
      const data = await res.json();
      if (data && Array.isArray(data.teachers)) {
        const fetchedTeachers: TeacherProfile[] = data.teachers;
        setTeachers(fetchedTeachers);
        setSelectedTeacherId((prevId) => {
          if (prevId && fetchedTeachers.some((t) => t.id === prevId)) {
            return prevId;
          }
          return fetchedTeachers[0]?.id ?? null;
        });
      }
      if (typeof data?.isOwner === 'boolean') {
        setIsOwner(data.isOwner && isLocalhostClient());
      }
    } catch {
      // Fallback to seeded teachers when offline or in unit tests without fetch stub
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleUpdateTeacherPhotoInline = useCallback(
    async (teacherId: string, photoDataUrl: string) => {
      if (!isOwner) return;
      // Optimistic update on UI
      setTeachers((prev) =>
        prev.map((item) => (item.id === teacherId ? { ...item, photoUrl: photoDataUrl } : item))
      );
      try {
        const res = await fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoUrl: photoDataUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.teacher) {
            setTeachers((prev) =>
              prev.map((item) => (item.id === teacherId ? data.teacher : item))
            );
          }
        }
      } catch {
        // Keep optimistic state if offline
      }
    },
    [isOwner]
  );

  const handleDeleteTeacherInline = useCallback(
    async (teacherId: string) => {
      if (!isOwner) return;
      setTeachers((prev) => prev.filter((item) => item.id !== teacherId));
      try {
        await fetch(`/api/teachers/${encodeURIComponent(teacherId)}`, {
          method: 'DELETE',
        });
      } catch {
        // Keep optimistic state if offline
      }
    },
    [isOwner]
  );

  const openSection = useCallback((id: SectionId) => {
    setWishesModalMode(null);
    setTeacherModalMode(null);
    setActiveSectionId(id);
    if (id === 'tho' || id === 'mv') {
      setIsBgMusicPlaying(false);
    }
    if (typeof window !== 'undefined') {
      window.location.hash = `#${id}`;
    }
  }, []);

  const closeSection = useCallback(() => {
    setActiveSectionId(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const openWishesModal = useCallback((mode: WishesModalMode) => {
    setActiveSectionId(null);
    setTeacherModalMode(null);
    setWishesModalMode(mode);
    if (typeof window !== 'undefined') {
      window.location.hash = mode === 'view' ? '#xem-loi-chuc' : '#gui-loi-chuc';
    }
  }, []);

  const closeWishesModal = useCallback(() => {
    setWishesModalMode(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const openTeacherModal = useCallback(
    (mode: TeacherModalMode, teacherId?: string) => {
      setActiveSectionId(null);
      setWishesModalMode(null);
      if (teacherId) {
        setSelectedTeacherId(teacherId);
      }
      setTeacherModalMode(mode);
      fetchTeachers();
      if (typeof window !== 'undefined') {
        window.location.hash =
          mode === 'form'
            ? '#bieu-mau-giao-vien'
            : mode === 'detail'
              ? '#ho-so-giao-vien'
              : '#bang-giao-vien';
      }
    },
    [fetchTeachers]
  );

  const closeTeacherModal = useCallback(() => {
    setTeacherModalMode(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      const wishesMode = parseWishesHash(currentHash);
      if (wishesMode) {
        setActiveSectionId(null);
        setTeacherModalMode(null);
        setWishesModalMode(wishesMode);
        return;
      }
      const teacherMode = parseTeacherHash(currentHash);
      if (teacherMode) {
        setActiveSectionId(null);
        setWishesModalMode(null);
        setTeacherModalMode(teacherMode);
        fetchTeachers();
        return;
      }
      setWishesModalMode(null);
      setTeacherModalMode(null);
      setActiveSectionId(parseSectionHash(currentHash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [fetchTeachers]);

  // Phát giai điệu nhạc nền nhẹ nhàng khi bật isBgMusicPlaying
  useEffect(() => {
    if (!isBgMusicPlaying || typeof window === 'undefined') return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    let ctx: AudioContext | null = null;
    let timer: number | null = null;
    try {
      ctx = new AudioContextClass();
      const notes = [261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 329.63, 293.66];
      let step = 0;
      const playTone = () => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.35);
        step += 1;
      };
      playTone();
      timer = window.setInterval(playTone, 1500);
    } catch {
      // Ignore AudioContext restriction errors in headless/test environments
    }

    return () => {
      if (timer !== null) window.clearInterval(timer);
      if (ctx) ctx.close().catch(() => {});
    };
  }, [isBgMusicPlaying]);

  // Điều hướng bằng bàn phím: Escape đóng modal, ArrowLeft / ArrowRight chuyển mục
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (qrModalOpen) {
          setQrModalOpen(false);
        } else if (teacherModalMode) {
          closeTeacherModal();
        } else if (wishesModalMode) {
          closeWishesModal();
        } else if (activeSectionId) {
          closeSection();
        }
        return;
      }

      if (!activeSectionId) return;

      const sections = BAO_TUONG_DATA.sections;
      const idx = sections.findIndex((s) => s.id === activeSectionId);
      if (idx === -1) return;

      if (e.key === 'ArrowRight') {
        const nextIdx = (idx + 1) % sections.length;
        openSection(sections[nextIdx].id);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (idx - 1 + sections.length) % sections.length;
        openSection(sections[prevIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeSectionId,
    qrModalOpen,
    teacherModalMode,
    wishesModalMode,
    closeSection,
    closeTeacherModal,
    closeWishesModal,
    openSection,
  ]);

  const activeSection = activeSectionId ? getSectionById(activeSectionId) ?? null : null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-amber-200 selection:text-amber-950">
      <FloatingAcademicSparkles />
      <SchoolSideDecorations />

      <HeroMasthead
        config={BAO_TUONG_DATA}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isBgMusicPlaying={isBgMusicPlaying}
        onToggleBgMusic={() => setIsBgMusicPlaying((prev) => !prev)}
        onOpenWishes={openWishesModal}
        onOpenTeacherBoard={(mode) => openTeacherModal(mode)}
        onOpenQrModal={() => {
          setQrHighlightSectionId(null);
          setQrModalOpen(true);
        }}
      />

      <main className="flex-1 relative z-20">
        {viewMode === 'cards' ? (
          <InfographicGrid
            sections={BAO_TUONG_DATA.sections}
            onSelectSection={openSection}
            onOpenSectionQr={(id) => {
              setQrHighlightSectionId(id);
              setQrModalOpen(true);
            }}
          />
        ) : (
          <InteractivePosterView
            config={BAO_TUONG_DATA}
            sections={BAO_TUONG_DATA.sections}
            onSelectSection={openSection}
            onOpenSectionQr={(id) => {
              setQrHighlightSectionId(id);
              setQrModalOpen(true);
            }}
          />
        )}

        {/* Bảng Tổng Hợp Giáo Viên Bộ Môn theo đúng bố cục Poster Mẫu */}
        <TeacherSummaryBoardSection
          teachers={teachers}
          isOwner={isOwner}
          onSelectTeacher={(teacher) => {
            openTeacherModal('detail', teacher.id);
          }}
          onOpenForm={(teacherId) => {
            if (teacherId || !isOwner) {
              openTeacherModal('detail', teacherId || teachers[0]?.id);
            } else {
              openTeacherModal('form');
            }
          }}
          onOpenFullBoard={() => openTeacherModal('board')}
          onUpdateTeacherPhoto={isOwner ? handleUpdateTeacherPhotoInline : undefined}
          onDeleteTeacher={isOwner ? handleDeleteTeacherInline : undefined}
        />
      </main>

      <EditorialFooter
        config={BAO_TUONG_DATA}
        onSelectSection={openSection}
        onOpenWishes={openWishesModal}
        onOpenTeacherBoard={(mode) => openTeacherModal(mode)}
        onOpenQrModal={() => {
          setQrHighlightSectionId(null);
          setQrModalOpen(true);
        }}
      />

      <SectionReaderModal
        section={activeSection}
        allSections={BAO_TUONG_DATA.sections}
        onClose={closeSection}
        onNavigate={openSection}
      />

      <WishesModal
        isOpen={wishesModalMode !== null}
        mode={wishesModalMode ?? 'submit'}
        onModeChange={openWishesModal}
        onClose={closeWishesModal}
        defaultClassName="9A3"
      />

      <TeacherBoardModal
        isOpen={teacherModalMode !== null}
        mode={teacherModalMode ?? 'board'}
        isOwner={isOwner}
        teachers={teachers}
        selectedTeacherId={selectedTeacherId}
        onClose={closeTeacherModal}
        onModeChange={(nextMode, teacherId) => openTeacherModal(nextMode, teacherId)}
        onSelectTeacher={(id) => setSelectedTeacherId(id)}
        onTeachersUpdated={(nextTeachers) => setTeachers(nextTeachers)}
        onRefreshTeachers={fetchTeachers}
      />

      <QrCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        config={BAO_TUONG_DATA}
        initialSectionId={qrHighlightSectionId}
      />
    </div>
  );
};

export default App;
