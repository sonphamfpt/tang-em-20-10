import { useState, useEffect } from 'react';
import styles from './MusicPlayer.module.css';

let audioCtx = null;
let interval = null;
const NOTE_SEQ = [
  587.33, 493.88, 440.00, 369.99,
  392.00, 440.00, 493.88, 587.33,
  659.25, 587.33, 523.25, 493.88,
  440.00, 523.25, 587.33, 659.25,
];
let noteIdx = 0;

function playNote(freq) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filt = audioCtx.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = 1200;
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
  osc.connect(filt); filt.connect(gain); gain.connect(audioCtx.destination);
  osc.start(now); osc.stop(now + 1.7);
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (playing) {
      clearInterval(interval);
      interval = null;
      setPlaying(false);
    } else {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      interval = setInterval(() => {
        playNote(NOTE_SEQ[noteIdx % NOTE_SEQ.length]);
        noteIdx++;
      }, 520);
      setPlaying(true);
    }
  };

  // Stop on unmount
  useEffect(() => () => { clearInterval(interval); }, []);

  return (
    <button
      className={`${styles.btn} ${playing ? styles.active : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
    >
      <span className={`${styles.disc} ${playing ? styles.spin : ''}`}>🎵</span>
      <span className={styles.label}>{playing ? 'Đang phát' : 'Phát nhạc'}</span>
    </button>
  );
}
