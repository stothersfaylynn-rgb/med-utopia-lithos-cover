import { useLayoutEffect, useRef, useState } from 'react';
import { buildMaskGradient, MASK_STOPS, SPOTLIGHT_R } from './heroConfig';

type RevealLayerProps = {
  image: string;
  cursorX: number;
  cursorY: number;
  reducedMotion: boolean;
};

const STATIC_MASK_IMAGE = `radial-gradient(circle ${SPOTLIGHT_R}px at 50% 50%, ${MASK_STOPS.map(
  ([offset, color]) => `${color} ${offset * 100}%`,
).join(', ')})`;

export function RevealLayer({ image, cursorX, cursorY, reducedMotion }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskImage, setMaskImage] = useState<string>('');

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = buildMaskGradient(ctx, cursorX, cursorY);
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();
    setMaskImage(`url(${canvas.toDataURL()})`);
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        data-reveal-mode={reducedMotion ? 'static' : 'dynamic'}
        style={{
          backgroundImage: `url(${image})`,
          maskImage: reducedMotion ? STATIC_MASK_IMAGE : maskImage,
          WebkitMaskImage: reducedMotion ? STATIC_MASK_IMAGE : maskImage,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </>
  );
}
