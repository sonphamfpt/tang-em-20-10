import { useState, useEffect, useRef } from 'react';
import s from './MusicPlayer.module.css';

// Romantic music box melody (D major pentatonic / warm ballad)
const MELODY = [
  // bar 1
  { f: 587.33, d: 500 }, // D5
  { f: 493.88, d: 500 }, // B4
  { f: 440.00, d: 500 }, // A4
  { f: 369.99, d: 500 }, // F#4
  // bar 2
  { f: 392.00, d: 500 }, // G4
  { f: 440.00, d: 500 }, // A4
  { f: 493.88, d: 500 }, // B4
  { f: 587.33, d: 750 }, // D5
  // bar 3
  { f: 659.25, d: 500 }, // E5
  { f: 587.33, d: 500 }, // D5
  { f: 523.25, d: 500 }, // C5
  { f: 493.88, d: 500 }, // B4
  // bar 4
  { f: 440.00, d: 500 }, // A4
  { f: 523.25, d: 500 }, // C5
  { f: 587.33, d: 500 }, // D5
  { f: 659.25, d: 850 }, // E5
];

export default function MusicPlayer({ musicUrl, playing, onToggle }) {
  const audioRef    = useRef(null);
  const audioCtxRef = useRef(null);
  const timerRef    = useRef(null);
  const noteIdxRef  = useRef(0);

  // Play synthesized chime note
  const playChime = (freq) => {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now  = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const filt = ctx.createBiquadFilter();

      // Soft bell / music box timbre
      filt.type = 'lowpass';
      filt.frequency.value = 1600;
      filt.Q.value = 3;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filt);
      filt.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch {
      // AudioContext silently handled
    }
  };

  const scheduleNextNote = () => {
    if (!audioCtxRef.current) return;
    const note = MELODY[noteIdxRef.current % MELODY.length];
    playChime(note.f);
    noteIdxRef.current = (noteIdxRef.current + 1) % MELODY.length;
    timerRef.current = setTimeout(scheduleNextNote, note.d);
  };

  // Handle Play / Stop
  useEffect(() => {
    if (playing) {
      if (musicUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio(musicUrl);
          audioRef.current.loop = true;
        }
        audioRef.current.play().catch(() => {});
      } else {
        if (!audioCtxRef.current) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) audioCtxRef.current = new AC();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        scheduleNextNote();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, musicUrl]);

  return (
    <div className={s.wrapper}>
      <button
        className={`${s.btn} ${playing ? s.active : ''}`}
        onClick={onToggle}
        aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        title={playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      >
        <div className={s.eq}>
          <span className={s.bar} />
          <span className={s.bar} />
          <span className={s.bar} />
        </div>
        <span className={s.label}>{playing ? 'Nhạc nền' : 'Bật nhạc'}</span>
      </button>
    </div>
  );
}
