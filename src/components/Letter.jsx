import { useState, useEffect, useRef } from 'react';
import s from './Letter.module.css';

/* ── Days counter hook ───────────────────────────── */
function useCounter(startDate) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    if (isNaN(start)) return;
    const tick = () => {
      const ms = Math.max(0, Date.now() - start);
      const ss = Math.floor(ms / 1000);
      setT({
        d: Math.floor(ss / 86400),
        h: Math.floor((ss % 86400) / 3600),
        m: Math.floor((ss % 3600) / 60),
        s: ss % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate]);
  return t;
}

/* ── Typewriter hook ─────────────────────────────── */
function useTypewriter(lines, active) {
  const [para, setPara]   = useState([]);
  const [done, setDone]   = useState(false);
  const rafRef            = useRef(null);

  useEffect(() => {
    if (!active) return;
    setPara([]); setDone(false);
    let li = 0, ci = 0, texts = [];
    let prev = 0;
    const SPEED = 34; // ms per char

    const tick = (ts) => {
      if (ts - prev < SPEED) { rafRef.current = requestAnimationFrame(tick); return; }
      prev = ts;
      if (li >= lines.length) { setDone(true); return; }
      const line = lines[li];
      ci++;
      texts = [...texts.slice(0, li), line.slice(0, ci)];
      setPara([...texts]);
      if (ci >= line.length) {
        li++; ci = 0;
        if (li < lines.length) texts.push('');
        prev += 300; // breath between paragraphs
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return { para, done };
}

export default function Letter({
  letter,
  senderName,
  recipientName,
  startDate,
  onRestart,
}) {
  const [phase, setPhase]           = useState('hidden'); // hidden → visible
  const [heartCount, setHeartCount] = useState(0);
  const counter = useCounter(startDate);
  const { para, done } = useTypewriter(letter, phase === 'visible');

  // Sequence: wait for page-in, then show
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 400);
    return () => clearTimeout(t1);
  }, []);

  // Heart Fireworks Explosion
  const triggerFireworks = (originX, originY) => {
    const glyphs = ['💖', '💕', '❤️', '✨', '🌸', '💐', '💓', '💗', '✦'];
    const count = 32;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = 90 + Math.random() * 160;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      const el = document.createElement('span');
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      el.style.cssText = `
        position: fixed;
        left: ${originX}px;
        top: ${originY}px;
        font-size: ${18 + Math.random() * 16}px;
        pointer-events: none;
        z-index: 9999;
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: heartFirework 1.35s cubic-bezier(0.12, 0.8, 0.32, 1) forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }
  };

  const handleHeartClick = (e) => {
    setHeartCount(n => n + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    triggerFireworks(x, y);
  };



  // Inject heart firework keyframe once
  useEffect(() => {
    if (document.getElementById('hfw-kf')) return;
    const st = document.createElement('style');
    st.id = 'hfw-kf';
    st.textContent = `@keyframes heartFirework {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0.4);
      }
      60% {
        opacity: 1;
        transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.25);
      }
      100% {
        opacity: 0;
        transform: translate(calc(-50% + var(--tx) * 1.1), calc(-50% + var(--ty) * 1.1 + 40px)) scale(0.7);
      }
    }`;
    document.head.appendChild(st);
  }, []);

  return (
    <div className={s.root}>
      {/* Ambient top gradient */}
      <div className={s.topGlow} />

      <div className={s.scrollWrap}>
        <div className={`${s.inner} ${phase === 'visible' ? s.visible : ''}`}>

          {/* ── Header ── */}
          <header className={s.header}>
            <div className={s.eyebrow}>Gửi</div>
            <h1 className={s.name}>{recipientName}</h1>
            <div className={s.ornamentRow}>
              <span className={s.ornLine} /><span className={s.orn}>❧</span><span className={s.ornLine} />
            </div>
          </header>

          {/* ── Days counter ── */}
          {startDate && (
            <div className={s.counter}>
              <p className={s.counterLabel}>Chúng mình đã bên nhau</p>
              <div className={s.counterGrid}>
                {[
                  { v: counter.d, u: 'ngày'  },
                  { v: counter.h, u: 'giờ'   },
                  { v: counter.m, u: 'phút'  },
                  { v: counter.s, u: 'giây'  },
                ].map(({ v, u }) => (
                  <div key={u} className={s.counterCell}>
                    <span className={s.counterNum}>{String(v).padStart(2,'0')}</span>
                    <span className={s.counterUnit}>{u}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Letter body ── */}
          <article className={s.letterCard}>
            <div className={s.letterInner}>
              {para.map((txt, i) => (
                <p key={i} className={s.para}>
                  {txt}
                  {i === para.length - 1 && !done && (
                    <span className={s.cursor} aria-hidden="true" />
                  )}
                </p>
              ))}
            </div>
            <div className={s.signature}>
              <div className={s.sigRule} />
              <span className={s.sigFrom}>Của</span>
              <span className={s.sigName}>{senderName}</span>
            </div>
          </article>

          {/* ── Heart Fireworks CTA ── */}
          <div className={s.heartSection}>
            <button className={s.heartBtn} onClick={handleHeartClick} aria-label="Bắn tim pháo hoa">
              <span className={s.heartIcon}>♡</span>
            </button>
            <p className={s.heartNote}>
              {heartCount > 0
                ? `Em đã nhận ${heartCount} triệu trái tim từ anh 💖`
                : 'Chạm vào trái tim để bắn pháo hoa ✨'}
            </p>
          </div>



          {/* ── Restart ── */}
          <div className={s.restartRow}>
            <button className={s.restartBtn} onClick={onRestart}>
              ↺ Xem lại từ đầu
            </button>
          </div>

          {/* ── Bottom ornament ── */}
          <div className={s.bottomOrnament}>✦ 20.10 ✦</div>

        </div>
      </div>
    </div>
  );
}
