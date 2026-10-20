import { useEffect, useRef } from 'react';

// Draws floating sakura petals, sparkle stars and mini hearts on a canvas
export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.init(); }
      init() {
        this.x     = Math.random() * canvas.width;
        this.y     = -20 - Math.random() * canvas.height * 0.3;
        this.size  = Math.random() * 10 + 6;
        this.vy    = Math.random() * 1 + 0.6;
        this.phase = Math.random() * Math.PI * 2;
        this.sway  = Math.random() * 1.5 + 0.5;
        this.rot   = Math.random() * 360;
        this.drot  = (Math.random() - 0.5) * 1.5;
        this.alpha = Math.random() * 0.4 + 0.2;
        this.kind  = Math.random() > 0.45
          ? 'petal'
          : Math.random() > 0.5 ? 'heart' : 'star';
      }

      update() {
        this.phase += 0.018;
        this.x += Math.sin(this.phase) * this.sway;
        this.y += this.vy;
        this.rot += this.drot;
        if (this.y > canvas.height + 20) this.init();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rot * Math.PI) / 180);

        if (this.kind === 'petal') {
          ctx.fillStyle = '#ffb3c6';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-this.size / 2, -this.size / 2,
                            -this.size / 2,  this.size / 2,
                             0,              this.size);
          ctx.bezierCurveTo( this.size / 2,  this.size / 2,
                             this.size / 2, -this.size / 2,
                             0,              0);
          ctx.fill();
        } else if (this.kind === 'heart') {
          ctx.fillStyle = '#ff4d6d';
          const s = this.size * 0.55;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.quadraticCurveTo(0,   0, s * 0.25,  0);
          ctx.quadraticCurveTo(s * 0.5, 0, s * 0.5, s * 0.3);
          ctx.quadraticCurveTo(s * 0.5, 0, s * 0.75, 0);
          ctx.quadraticCurveTo(s, 0, s, s * 0.3);
          ctx.quadraticCurveTo(s, s * 0.6, s * 0.5, s);
          ctx.lineTo(0, s * 0.6);
          ctx.fill();
        } else {
          ctx.fillStyle = '#f4c542';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.18, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const COUNT = 40;
    for (let i = 0; i < COUNT; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height; // spread initial positions
      particles.push(p);
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      id="particle-canvas"
      ref={canvasRef}
      aria-hidden="true"
    />
  );
}
