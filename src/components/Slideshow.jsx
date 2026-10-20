import { useState, useEffect, useRef } from 'react';
import s from './Slideshow.module.css';

/* Progress bar auto-advances after SLIDE_DUR ms */
const SLIDE_DUR = 5500;

function resolveAsset(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const base = import.meta.env.BASE_URL || './';
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return base.endsWith('/') ? `${base}${cleanUrl}` : `${base}/${cleanUrl}`;
}

export default function Slideshow({ photos, onNext }) {
  const [slides, setSlides]         = useState(photos);
  const [cur, setCur]               = useState(0);
  const [prev, setPrev]             = useState(null);
  const [dir, setDir]               = useState(1);   // 1 = forward, -1 = back
  const [progress, setProgress]     = useState(0);
  const [captionIn, setCaptionIn]   = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const startRef    = useRef(null);
  const rafRef      = useRef(null);

  // Sync slides if photos prop changes
  useEffect(() => {
    setSlides(photos);
  }, [photos]);

  // Animate progress bar
  const startProgress = () => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setProgress(0);
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min(elapsed / SLIDE_DUR, 1);
      setProgress(pct);
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        advance(1);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const advance = (d) => {
    setCaptionIn(false);
    const next = cur + d;
    if (next < 0 || next >= slides.length) {
      if (d === 1) { onNext(); return; }
      return;
    }
    setDir(d);
    setPrev(cur);
    setCur(next);
  };

  // Restart progress when cur changes
  useEffect(() => {
    setCaptionIn(false);
    const t = setTimeout(() => setCaptionIn(true), 600);
    startProgress();
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t);
    };
  }, [cur, slides.length]);

  // Photo upload
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newSlides = files.map(f => ({
      src:     URL.createObjectURL(f),
      caption: f.name.replace(/\.[^/.]+$/, ''),
    }));
    setSlides(prevSlides => [...newSlides, ...prevSlides]);
    setCur(0);
    setPrev(null);
    setUploadOpen(false);
  };

  const isLast = cur === slides.length - 1;
  const slide  = slides[cur] || slides[0];

  return (
    <div className={s.root}>

      {/* ── Background image layer (previous, exiting) ── */}
      {prev !== null && slides[prev] && (
        <div
          key={`prev-${prev}`}
          className={`${s.imgLayer} ${dir === 1 ? s.exitLeft : s.exitRight}`}
        >
          <img src={resolveAsset(slides[prev].src)} alt="" className={s.img} />
          <div className={s.imgScrim} />
        </div>
      )}

      {/* ── Background image layer (current, entering) ── */}
      {slide && (
        <div
          key={`cur-${cur}`}
          className={`${s.imgLayer} ${prev !== null ? (dir === 1 ? s.enterRight : s.enterLeft) : s.enterFirst}`}
        >
          <img src={resolveAsset(slide.src)} alt={slide.caption} className={s.img} />
          <div className={s.imgScrim} />
        </div>
      )}

      {/* ── Progress bars ── */}
      <div className={s.progressBar}>
        {slides.map((_, i) => (
          <div key={i} className={s.barTrack}>
            <div
              className={s.barFill}
              style={{ width: i < cur ? '100%' : i === cur ? `${progress * 100}%` : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* ── Upload button top-left ── */}
      <button className={s.uploadBtn} onClick={() => setUploadOpen(true)}>
        <span className={s.uploadIcon}>+</span>
        <span className={s.uploadLabel}>Ảnh của em</span>
      </button>

      {/* ── Caption ── */}
      {slide && (
        <div className={`${s.caption} ${captionIn ? s.captionIn : ''}`}>
          <p className={s.captionText}>{slide.caption}</p>
          <span className={s.captionSlideNum}>{cur + 1} / {slides.length}</span>
        </div>
      )}

      {/* ── Nav tap zones ── */}
      <button className={`${s.tapZone} ${s.tapLeft}`}  onClick={() => advance(-1)} aria-label="Ảnh trước" />
      <button className={`${s.tapZone} ${s.tapRight}`} onClick={() => isLast ? onNext() : advance(1)} aria-label="Ảnh tiếp" />

      {/* ── Swipe hint arrows ── */}
      <div className={s.arrows}>
        {cur > 0 && <span className={`${s.arrowChevron} ${s.arrowL}`}>‹</span>}
        <span className={`${s.arrowChevron} ${s.arrowR}`}>
          {isLast ? '✦' : '›'}
        </span>
      </div>

      {/* ── Bottom CTA if last slide ── */}
      {isLast && (
        <button className={s.nextCta} onClick={onNext}>
          <span>Đọc thư của anh</span>
          <span className={s.nextArrow}>↓</span>
        </button>
      )}

      {/* ── Upload panel ── */}
      {uploadOpen && (
        <div className={s.uploadOverlay}>
          <div className={s.uploadPanel}>
            <h3 className={s.uploadTitle}>Thêm ảnh của hai mình</h3>
            <p className={s.uploadSub}>Chọn một hoặc nhiều ảnh từ máy</p>
            <label className={s.uploadLbl} htmlFor="photo-upload-input">
              Chọn ảnh
            </label>
            <input
              id="photo-upload-input"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFiles}
            />
            <button className={s.uploadCancel} onClick={() => setUploadOpen(false)}>
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
