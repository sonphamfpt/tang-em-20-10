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
      setT({ d: Math.floor(ss / 86400), h: Math.floor((ss % 86400) / 3600), m: Math.floor((ss % 3600) / 60), s: ss % 60 });
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
    const SPEED = 36; // ms per char

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
        prev += 320; // breath between paragraphs
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return { para, done };
}

export default function Letter({ letter, senderName, recipientName, startDate, onRestart }) {
  const [phase, setPhase] = useState('hidden'); // hidden → scroll → visible
  const [heartCount, setHeartCount] = useState(0);
  const counter = useCounter(startDate);
  const { para, done } = useTypewriter(letter, phase === 'visible');

  // Sequence: wait for page-in, then show
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 400);
    return () => clearTimeout(t1);
  }, []);

  const spawnHearts = (e) => {
    setHeartCount(n => n + 1);
    const glyphs = ['💖','💕','✦','❧','♡'];
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('span');
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      const dx = (Math.random() - 0.5) * 120;
      el.style.cssText = `
        position:fixed;
        left:${e.clientX}px;
        top:${e.clientY}px;
        font-size:${18 + Math.random()*14}px;
        pointer-events:none;
        z-index:9999;
        --dx:${dx}px;
        animation: floatHeart 1.5s ease-out forwards;
        animation-delay:${i * 60}ms;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1600 + i * 60);
    }
  };

  // Inject heart keyframe once
  useEffect(() => {
    if (document.getElementById('fh-kf')) return;
    const st = document.createElement('style');
    st.id = 'fh-kf';
    st.textContent = `@keyframes floatHeart {
      0%   { opacity:1; transform: translate(-50%,-50%) scale(.5) }
      50%  { opacity:1; transform: translate(calc(-50% + var(--dx)), -120px) scale(1.2) }
      100% { opacity:0; transform: translate(calc(-50% + var(--dx)), -200px) scale(.9) }
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

          {/* ── Heart CTA ── */}
          <div className={s.heartSection}>
            <button className={s.heartBtn} onClick={spawnHearts}>
              <span className={s.heartIcon}>♡</span>
            </button>
            {heartCount > 0 && (
              <p className={s.heartNote}>
                Em đã nhận {heartCount} triệu trái tim từ anh
              </p>
            )}
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
