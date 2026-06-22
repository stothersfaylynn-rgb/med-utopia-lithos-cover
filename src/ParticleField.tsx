import { useEffect, useRef } from 'react';
import { useReducedMotion } from './motion';

type Pointer = {
  x: number;
  y: number;
};

type ParticleFieldProps = {
  accent: string;
  activeIndex: number;
  pointer: Pointer;
};

type Particle = {
  x: number;
  y: number;
  z: number;
  speed: number;
  drift: number;
};

const PARTICLE_COUNT = 150;

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: 0.25 + Math.random() * 1.25,
    speed: 0.16 + Math.random() * 0.52,
    drift: Math.sin(index * 1.618) * 0.38,
  }));
}

export function ParticleField({ accent, activeIndex, pointer }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef(pointer);
  const accentRef = useRef(accent);
  const indexRef = useRef(activeIndex);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    accentRef.current = accent;
    indexRef.current = activeIndex;
  }, [accent, activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return undefined;
    }

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas?.getContext('2d', { willReadFrequently: true }) ?? null;
    } catch {
      ctx = null;
    }
    if (!canvas || !ctx) return undefined;

    let frame = 0;
    let raf: number | null = null;
    let running = false;
    const coarsePointer = window.matchMedia('(pointer: coarse)');

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particlesRef.current = createParticles(width, height);
    };

    const draw = () => {
      if (!running) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const pointerX = pointerRef.current.x < 0 ? width * 0.55 : pointerRef.current.x;
      const pointerY = pointerRef.current.y < 0 ? height * 0.48 : pointerRef.current.y;

      frame += 0.008 + indexRef.current * 0.0008;
      ctx.clearRect(0, 0, width, height);

      const background = ctx.createRadialGradient(
        width * 0.52,
        height * 0.42,
        20,
        width * 0.52,
        height * 0.42,
        Math.max(width, height) * 0.7,
      );
      background.addColorStop(0, `${accentRef.current}20`);
      background.addColorStop(0.28, 'rgba(10, 32, 31, 0.2)');
      background.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      particlesRef.current.forEach((particle, index) => {
        const pull = Math.max(0, 1 - Math.hypot(pointerX - particle.x, pointerY - particle.y) / 520);
        particle.y += particle.speed * particle.z;
        particle.x += Math.sin(frame + index) * particle.drift + (pointerX - width / 2) * 0.0008 * pull;

        if (particle.y > height + 30) {
          particle.y = -30;
          particle.x = Math.random() * width;
        }
        if (particle.x < -40) particle.x = width + 40;
        if (particle.x > width + 40) particle.x = -40;

        const size = (0.7 + particle.z * 1.8) * (1 + pull * 1.8);
        ctx.beginPath();
        ctx.fillStyle =
          index % 5 === 0
            ? `rgba(255,255,255,${0.13 + pull * 0.24})`
            : `${accentRef.current}${index % 3 === 0 ? '80' : '4d'}`;
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < 9; i += 1) {
        const y = height * (0.18 + i * 0.08) + Math.sin(frame * 3 + i) * 20;
        ctx.strokeStyle = `${accentRef.current}${i % 2 ? '18' : '26'}`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width * 0.42 + Math.sin(frame + i) * 60, y);
        ctx.bezierCurveTo(width * 0.52, y - 40, width * 0.62, y + 50, width * 0.76, y - 10);
        ctx.stroke();
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const start = () => {
      if (running || reducedMotion || document.hidden || coarsePointer.matches) return;
      resize();
      running = true;
      raf = requestAnimationFrame(draw);
    };

    const synchronizeAnimation = () => {
      if (reducedMotion || document.hidden || coarsePointer.matches) {
        stop();
      } else {
        start();
      }
    };

    const handleResize = () => {
      if (running) resize();
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', synchronizeAnimation);
    if (coarsePointer.addEventListener) {
      coarsePointer.addEventListener('change', synchronizeAnimation);
    } else {
      coarsePointer.addListener?.(synchronizeAnimation);
    }
    synchronizeAnimation();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', synchronizeAnimation);
      if (coarsePointer.removeEventListener) {
        coarsePointer.removeEventListener('change', synchronizeAnimation);
      } else {
        coarsePointer.removeListener?.(synchronizeAnimation);
      }
      stop();
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="med-utopia-particle-field pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
