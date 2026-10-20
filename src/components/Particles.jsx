import { useEffect, useRef } from 'react';
import s from './Particles.module.css';

// Draw smooth, elegant heart shape
function drawHeart(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.beginPath();
  const topCurveHeight = size * 0.35;
  ctx.moveTo(0, topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(
    -size / 2, -size * 0.45,
    -size, size * 0.2,
    0, size * 0.95
  );
  // top right curve
  ctx.bezierCurveTo(
    size, size * 0.2,
    size / 2, -size * 0.45,
    0, topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draw fluttering rose petal
function drawPetal(ctx, x, y, size, angle, wobble, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(Math.cos(wobble), 1); // 3D flip effect

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(size * 0.8, -size * 0.7, size * 0.9, size * 0.6, 0, size);
  ctx.bezierCurveTo(-size * 0.9, size * 0.6, -size * 0.8, -size * 0.7, 0, -size);
  ctx.closePath();
  ctx.fill();

  // Subtle petal inner vein/glow
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.7);
  ctx.lineTo(0, size * 0.7);
  ctx.stroke();

  ctx.restore();
}

export default function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let raf;

    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Rose petals palette
    const petalColors = ['#c23b56', '#d64d68', '#e8637a', '#a3203b', '#f29bad'];
    // Heart palette
    const heartColors = ['#f4728d', '#e8506e', '#ff94aa', '#c93356'];

    // 1. Falling rose petals (fluttering downwards)
    const petals = Array.from({ length: 32 }, () => ({
      x: Math.random() * cvs.width,
      y: Math.random() * cvs.height,
      size: Math.random() * 8 + 8,
      vx: (Math.random() - 0.5) * 0.8 + 0.3,
      vy: Math.random() * 1.2 + 0.8,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.03,
      wobble: Math.random() * Math.PI * 2,
      vWobble: Math.random() * 0.035 + 0.02,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      alpha: Math.random() * 0.45 + 0.35,
    }));

    // 2. Rising glowing hearts (floating upwards with gentle drift)
    const hearts = Array.from({ length: 24 }, () => ({
      x: Math.random() * cvs.width,
      y: Math.random() * cvs.height,
      size: Math.random() * 10 + 10,
      vy: -(Math.random() * 0.6 + 0.4),
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.02 + 0.015,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      alpha: Math.random() * 0.4 + 0.3,
      baseAlpha: Math.random() * 0.4 + 0.3,
    }));

    // 3. Starlight / golden sparkles
    const sparkles = Array.from({ length: 28 }, () => ({
      x: Math.random() * cvs.width,
      y: Math.random() * cvs.height,
      r: Math.random() * 1.8 + 0.8,
      pulse: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.01,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // ── Animate Sparkles ──
      sparkles.forEach(s => {
        s.pulse += s.speed;
        const curAlpha = s.alpha * (0.5 + 0.5 * Math.sin(s.pulse));
        ctx.save();
        ctx.globalAlpha = curAlpha;
        ctx.fillStyle = '#fce4be';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── Animate Rose Petals ──
      petals.forEach(p => {
        p.wobble += p.vWobble;
        p.angle += p.vAngle;
        p.x += p.vx + Math.sin(p.wobble) * 0.6;
        p.y += p.vy;

        if (p.y > cvs.height + 30) {
          p.y = -30;
          p.x = Math.random() * cvs.width;
        }
        if (p.x > cvs.width + 30) p.x = -20;
        if (p.x < -30) p.x = cvs.width + 20;

        drawPetal(ctx, p.x, p.y, p.size, p.angle, p.wobble, p.color, p.alpha);
      });

      // ── Animate Floating Hearts ──
      hearts.forEach(h => {
        h.driftPhase += h.driftSpeed;
        h.x += Math.sin(h.driftPhase) * 0.5;
        h.y += h.vy;

        const pulseScale = 1 + 0.08 * Math.sin(h.driftPhase * 1.5);

        if (h.y < -40) {
          h.y = cvs.height + 40;
          h.x = Math.random() * cvs.width;
        }

        drawHeart(ctx, h.x, h.y, h.size * pulseScale, h.color, h.alpha);
      });

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={s.cvs} aria-hidden="true" />;
}
