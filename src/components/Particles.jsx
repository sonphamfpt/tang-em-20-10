import { useEffect, useRef } from 'react';
import s from './Particles.module.css';

export default function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let raf;

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Floating dust + petal particles
    const pool = Array.from({ length: 55 }, () => makeParticle(cvs));
    // spread initial y
    pool.forEach(p => { p.y = Math.random() * cvs.height; });

    function makeParticle(c) {
      return {
        x:     Math.random() * c.width,
        y:     -30,
        size:  Math.random() * 3.5 + 1,
        vy:    Math.random() * 0.55 + 0.25,
        vx:    (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.35 + 0.1,
        phase: Math.random() * Math.PI * 2,
        big:   Math.random() > 0.82,   // occasional big petal
      };
    }

    const loop = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      pool.forEach(p => {
        p.phase += 0.018;
        p.x += p.vx + Math.sin(p.phase) * 0.4;
        p.y += p.vy;
        if (p.y > cvs.height + 30) {
          Object.assign(p, makeParticle(cvs));
          p.y = -30;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        if (p.big) {
          // petal shape
          ctx.fillStyle = '#c2405a';
          ctx.translate(p.x, p.y);
          ctx.rotate(p.phase * 0.6);
          const r = p.size * 3.5;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.bezierCurveTo(-r/2,-r/2,-r/2,r/2,0,r);
          ctx.bezierCurveTo( r/2, r/2, r/2,-r/2,0,0);
          ctx.fill();
        } else {
          // dust
          ctx.fillStyle = '#e8d5b0';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className={s.cvs} aria-hidden="true" />;
}
