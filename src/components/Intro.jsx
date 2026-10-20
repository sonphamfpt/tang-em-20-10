import { useEffect, useState } from 'react';
import s from './Intro.module.css';

/*
  Cinematic opening screen.
  Sequence:
    0-800ms  : dark  (nothing)
    800ms    : line1 "Em à…"  fades in
    2200ms   : line2 subtitle fades in
    3600ms   : date badge fades in
    5000ms   : CTA button rises
*/
export default function Intro({ recipientName, onNext }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 700),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3200),
      setTimeout(() => setStage(4), 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={s.root}>
      {/* deep gradient bg */}
      <div className={s.bg} />

      {/* Vignette corners */}
      <div className={s.vignette} />

      {/* Radial glow behind text */}
      <div className={`${s.glow} ${stage >= 1 ? s.glowVisible : ''}`} />

      {/* ── Main text ───────────────────────── */}
      <div className={s.center}>

        {/* Line 1 */}
        <div className={`${s.line1} ${stage >= 1 ? s.appear : ''}`}>
          <span className={s.em}>{recipientName}</span>
          <span className={s.ellipsis}> à…</span>
        </div>

        {/* Thin decorative rule */}
        <div className={`${s.rule} ${stage >= 2 ? s.appear : ''}`}>
          <span className={s.ruleLine} />
          <span className={s.ruleIcon}>✦</span>
          <span className={s.ruleLine} />
        </div>

        {/* Line 2 — subtitle */}
        <p className={`${s.line2} ${stage >= 2 ? s.appear : ''}`}>
          Anh có điều này muốn nói với em
        </p>

        {/* Date badge */}
        <div className={`${s.dateBadge} ${stage >= 3 ? s.appear : ''}`}>
          Ngày Phụ Nữ Việt Nam — 20 tháng 10
        </div>

        {/* CTA */}
        <button
          className={`${s.cta} ${stage >= 4 ? s.appear : ''}`}
          onClick={onNext}
          aria-label="Mở món quà"
        >
          <span className={s.ctaText}>Mở ra xem nào</span>
          <span className={s.ctaArrow}>↓</span>
        </button>

      </div>

      {/* Bottom ornament */}
      <div className={`${s.bottomOrnament} ${stage >= 4 ? s.appear : ''}`}>
        ❧
      </div>
    </div>
  );
}
