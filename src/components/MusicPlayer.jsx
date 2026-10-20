import { useEffect, useRef } from 'react';
import s from './MusicPlayer.module.css';

function resolveAsset(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const base = import.meta.env.BASE_URL || './';
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return base.endsWith('/') ? `${base}${cleanUrl}` : `${base}/${cleanUrl}`;
}

export default function MusicPlayer({ musicUrl, playing, onToggle }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!musicUrl) return;
    const resolved = resolveAsset(musicUrl);

    if (!audioRef.current) {
      const audio = new Audio(resolved);
      audio.loop = true;
      audio.preload = 'auto';
      audioRef.current = audio;
    } else if (audioRef.current.src !== resolved) {
      audioRef.current.src = resolved;
    }

    if (playing) {
      const audio = audioRef.current;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by browser policy: unlock on the very first touch/click anywhere on page
          const unlock = () => {
            if (audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
          };
          window.addEventListener('touchstart', unlock, { once: true, passive: true });
          window.addEventListener('click', unlock, { once: true });
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [playing, musicUrl]);

  return (
    <div className={s.wrapper}>
      <button
        className={`${s.btn} ${playing ? s.active : ''}`}
        onClick={onToggle}
        aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
        title={playing ? 'Tắt nhạc (Thiên Lý Ơi x Chờ Chút x Nơi Này Có Anh)' : 'Bật nhạc (Thiên Lý Ơi x Chờ Chút x Nơi Này Có Anh)'}
      >
        <div className={s.eq}>
          <span className={s.bar} />
          <span className={s.bar} />
          <span className={s.bar} />
        </div>
        <span className={s.label}>{playing ? 'Mashup ♫' : 'Bật nhạc'}</span>
      </button>
    </div>
  );
}
