import { useState, useEffect, useRef } from 'react';
import styles from './LoveLetter.module.css';

function useDaysCounter(startDate) {
  const [counts, setCounts] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    if (isNaN(start)) return;
    const tick = () => {
      const diff = Math.max(0, Date.now() - start.getTime());
      const s = Math.floor(diff / 1000);
      setCounts({
        days:  Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        mins:  Math.floor((s % 3600) / 60),
        secs:  s % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate]);
  return counts;
}

function useTypewriter(lines, enabled) {
  const [paragraphs, setParagraphs] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled || !lines.length) return;
    setParagraphs([]);
    setDone(false);
    let lineIdx = 0, charIdx = 0;
    let texts = [];
    let raf;

    const TYPE_SPEED = 38;
    let last = 0;

    const tick = (ts) => {
      if (ts - last < TYPE_SPEED) { raf = requestAnimationFrame(tick); return; }
      last = ts;
      if (lineIdx >= lines.length) { setDone(true); return; }
      const line = lines[lineIdx];
      charIdx++;
      texts = [...texts.slice(0, lineIdx), line.slice(0, charIdx)];
      setParagraphs([...texts]);
      if (charIdx >= line.length) {
        lineIdx++;
        charIdx = 0;
        if (lineIdx < lines.length) texts.push('');
        last += 280; // pause between paragraphs
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, lines]);

  return { paragraphs, done };
}

export default function LoveLetter({ letter, senderName, recipientName, startDate, onFinish }) {
  const [visible, setVisible] = useState(false);
  const [heartsTotal, setHeartsTotal] = useState(99);
  const heartsBtnRef = useRef(null);

  useEffect(() => { setVisible(true); }, []);

  const counts = useDaysCounter(startDate);
  const { paragraphs, done } = useTypewriter(letter, visible);

  const spawnHeart = (e) => {
    setHeartsTotal(n => n + 1);
    const emojis = ['💖','💕','💗','💓','🌸','✨'];
    const el = document.createElement('span');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position:fixed;
      left:${e.clientX}px; top:${e.clientY}px;
      font-size:26px;
      pointer-events:none; z-index:9999;
      animation: flyHeart 1.4s ease-out forwards;
      --dx:${(Math.random()-0.5)*100}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  };

  // Inject keyframe once
  useEffect(() => {
    if (document.getElementById('fly-heart-kf')) return;
    const s = document.createElement('style');
    s.id = 'fly-heart-kf';
    s.textContent = `
      @keyframes flyHeart {
        0%   { opacity:1; transform:translate(-50%,-50%) scale(.7) }
        60%  { opacity:1; transform:translate(calc(-50% + var(--dx)), -180px) scale(1.3) }
        100% { opacity:0; transform:translate(calc(-50% + var(--dx)), -280px) scale(1) }
      }`;
    document.head.appendChild(s);
  }, []);

  return (
    <div className={`${styles.root} ${visible ? styles.visible : ''}`}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.badge}>🌸 Happy 20/10 — Ngày Phụ Nữ Việt Nam</div>
        <h1 className={styles.title}>Chúc Mừng Em Yêu</h1>
        <p className={styles.sub}>Những lời từ tận đáy lòng anh</p>
      </header>

      {/* ── Days counter ── */}
      {startDate && (
        <div className={styles.counterCard}>
          <p className={styles.counterLabel}>Chúng mình đã bên nhau được</p>
          <div className={styles.counterRow}>
            {[
              { v: counts.days,  u: 'Ngày' },
              { v: counts.hours, u: 'Giờ' },
              { v: counts.mins,  u: 'Phút' },
              { v: counts.secs,  u: 'Giây' },
            ].map(({ v, u }) => (
              <div className={styles.counterCell} key={u}>
                <span className={styles.counterNum}>{String(v).padStart(2,'0')}</span>
                <span className={styles.counterUnit}>{u}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Letter scroll ── */}
      <article className={styles.letter}>
        <div className={styles.letterDecor} aria-hidden="true">LOVE</div>
        <div className={styles.salutation}>
          <span className={styles.salTo}>Gửi</span>
          <span className={styles.salName}>{recipientName}</span>
          <span className={styles.salHeart}>💌</span>
        </div>
        <div className={styles.body}>
          {paragraphs.map((text, i) => (
            <p key={i}>
              {text}
              {i === paragraphs.length - 1 && !done && (
                <span className={styles.cursor} aria-hidden="true" />
              )}
            </p>
          ))}
        </div>
        <div className={styles.signature}>
          <span className={styles.sigNote}>Mãi yêu thương,</span>
          <span className={styles.sigName}>{senderName}</span>
        </div>
      </article>

      {/* ── Heart button ── */}
      <div className={styles.heartZone}>
        <button
          ref={heartsBtnRef}
          className={styles.heartBtn}
          onClick={spawnHeart}
          aria-label="Bắn tim"
        >
          <span className={styles.heartBtnIcon}>💖</span>
          Bắn Tim!
        </button>
        <p className={styles.heartCount}>
          Đã gửi <strong>{heartsTotal}</strong> triệu trái tim đến em 💕
        </p>
      </div>

      {/* ── Next step ── */}
      <div className={styles.nextWrap}>
        <button className={styles.nextBtn} onClick={onFinish}>
          Mở Hộp Quà Tặng 🎁
        </button>
      </div>
    </div>
  );
}
