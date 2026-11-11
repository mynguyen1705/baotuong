import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, Mic, Sparkles, BookMarked } from 'lucide-react';
import { PoemItem } from '../types/baotuong';

export interface PoetryAudioPlayerProps {
  poems: PoemItem[];
  defaultAudioUrl?: string;
  studentVoiceNote: string;
}

export const PoetryAudioPlayer: React.FC<PoetryAudioPlayerProps> = ({
  poems,
  defaultAudioUrl,
  studentVoiceNote,
}) => {
  const [selectedPoemId, setSelectedPoemId] = useState<string>(poems[0]?.id ?? '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'playing-file' | 'playing-melody'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const activePoem = poems.find((p) => p.id === selectedPoemId) ?? poems[0];
  const currentAudioUrl = activePoem?.audioUrl || defaultAudioUrl;

  const stopAmbientMelody = () => {
    if (synthTimerRef.current !== null) {
      window.clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => { });
      audioCtxRef.current = null;
    }
  };

  const handleAudioError = () => {
    if (!audioRef.current) {
      if (isPlaying) startAmbientMelody();
      return;
    }
    const currentSrc = audioRef.current.src || '';
    // Thử đuôi .MP3 nếu .mp3 không tải được (hoặc ngược lại) do phân biệt hoa thường
    if (currentSrc.endsWith('.mp3')) {
      const altSrc = currentSrc.slice(0, -4) + '.MP3';
      audioRef.current.src = altSrc;
      audioRef.current
        .play()
        .then(() => {
          setAudioStatus('playing-file');
        })
        .catch(() => {
          if (isPlaying) startAmbientMelody();
        });
      return;
    }
    if (currentSrc.endsWith('.MP3')) {
      const altSrc = currentSrc.slice(0, -4) + '.mp3';
      audioRef.current.src = altSrc;
      audioRef.current
        .play()
        .then(() => {
          setAudioStatus('playing-file');
        })
        .catch(() => {
          if (isPlaying) startAmbientMelody();
        });
      return;
    }
    if (isPlaying) startAmbientMelody();
  };

  const handleSelectPoem = (poemId: string) => {
    if (poemId === selectedPoemId) return;
    stopAmbientMelody();
    setSelectedPoemId(poemId);
  };

  // Tự động phát tiếp bài mới nếu đang trong trạng thái nghe ngâm thơ
  useEffect(() => {
    if (isPlaying && currentAudioUrl) {
      setAudioStatus('playing-file');
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        const p = audioRef.current.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            handleAudioError();
          });
        }
      }
    }
  }, [selectedPoemId]);

  const startAmbientMelody = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        setAudioStatus('playing-melody');
        return;
      }
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23];
      let step = 0;

      const playNote = () => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.15);
        step += 1;
      };

      playNote();
      synthTimerRef.current = window.setInterval(playNote, 1200);
      setAudioStatus('playing-melody');
    } catch {
      setAudioStatus('playing-melody');
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopAmbientMelody();
      setIsPlaying(false);
      setAudioStatus('idle');
      return;
    }

    setIsPlaying(true);
    if (audioRef.current && currentAudioUrl) {
      setAudioStatus('playing-file');
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          startAmbientMelody();
        });
      }
    } else {
      startAmbientMelody();
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientMelody();
    };
  }, []);

  if (!activePoem) return null;

  return (
    <div className="space-y-6">
      {/* Trình phát Audio Ngâm Thơ Đa Phương Tiện */}
      <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-100/90 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Tạm dừng nghe ngâm thơ' : 'Phát thu âm ngâm thơ và nhạc nền'}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-poster-orange text-white shadow-md transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
                  <Mic className="h-3 w-3" />
                  Audio Thơ Đa Phương Tiện
                </span>
                <span className="text-xs font-semibold text-amber-900">
    
                </span>
              </div>
              <h3 className="mt-1 font-display text-lg font-extrabold text-stone-900">
                Ngâm thơ & Nhạc nền cảm xúc: “{activePoem.title}”
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                {studentVoiceNote}
              </p>
            </div>
          </div>

          {/* Hiệu ứng sóng nhạc bằng motion */}
          <div
            aria-hidden="true"
            className="flex h-10 items-end gap-1 self-center rounded-xl bg-white/80 px-3 py-2 border border-amber-200"
          >
            {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
              <motion.span
                key={bar}
                animate={
                  isPlaying
                    ? { height: ['25%', '95%', '40%', '85%', '30%'] }
                    : { height: '25%' }
                }
                transition={
                  isPlaying
                    ? {
                      duration: 0.9 + bar * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                    : { duration: 0.2 }
                }
                className="w-1.5 rounded-full bg-poster-orange"
              />
            ))}
          </div>
        </div>

        {currentAudioUrl && (
          <audio
            key={currentAudioUrl}
            ref={audioRef}
            src={currentAudioUrl}
            onEnded={() => {
              setIsPlaying(false);
              setAudioStatus('idle');
            }}
            onError={handleAudioError}
          />
        )}

        {isPlaying && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
            <Volume2 className="h-4 w-4 text-emerald-600" />
            <span>
              {audioStatus === 'playing-file'
                ? `Đang phát bản thu âm giọng ngâm: “${activePoem.title}”`
                : 'Đang phát giai điệu nhạc nền ngâm thơ'}
            </span>
          </p>
        )}
      </div>

      {/* Bộ chọn các bài thơ nổi tiếng về tuổi học trò & thầy cô */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5 flex items-center gap-1.5">
          <BookMarked className="h-4 w-4 text-poster-orange" />
          <span>Chọn tác phẩm trong Tuyển tập Thơ nổi tiếng về Tuổi học trò & Người thầy:</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {poems.map((poem, index) => {
            const isSelected = poem.id === activePoem.id;
            return (
              <button
                key={poem.id}
                type="button"
                onClick={() => handleSelectPoem(poem.id)}
                className={`rounded-2xl border px-4 py-2.5 text-left text-xs sm:text-sm font-bold transition ${isSelected
                  ? 'border-2 border-poster-orange bg-poster-orange text-white shadow-sm'
                  : 'border-amber-300 bg-white text-stone-800 hover:bg-amber-50'
                  }`}
              >
                <span>
                  Bài {index + 1}: {poem.title}
                </span>
                <span
                  className={`block text-[11px] font-normal ${isSelected ? 'text-amber-100' : 'text-stone-500'
                    }`}
                >
                  {poem.author}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trang cuộn thư pháp trình bày bài thơ */}
      <motion.div
        key={activePoem.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/90 via-paper-50 to-amber-50/90 p-6 sm:p-8 shadow-inner"
      >
        <div className="border-b border-amber-200 pb-4 text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            {activePoem.yearOrContext}
          </span>
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-red-800">
            {activePoem.title}
          </h3>
          <p className="mt-1 text-sm font-bold text-stone-800">
            Tác giả: <span className="text-poster-orange">{activePoem.author}</span>
          </p>
          {activePoem.source && <p className="text-xs italic text-stone-600">Nguồn: {activePoem.source}</p>}
        </div>

        {/* Các khổ thơ */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activePoem.stanzas.map((stanza, sIdx) => (
            <div
              key={sIdx}
              className="rounded-2xl border border-amber-200/80 bg-white/85 p-4 shadow-sm"
            >
              <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 mb-2">
                Khổ {sIdx + 1}
              </span>
              <div className="space-y-1.5 font-serif text-base sm:text-lg italic leading-relaxed text-stone-900">
                {stanza.map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Lời bình nếu có */}
        {activePoem.commentary && (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-100/60 p-4 text-xs sm:text-sm text-stone-800 leading-relaxed">
            <strong className="text-red-800">Lời bình & Cảm nhận: </strong>
            {activePoem.commentary}
          </div>
        )}
      </motion.div>
    </div>
  );
};
