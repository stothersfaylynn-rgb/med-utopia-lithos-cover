export const BG_IMAGE_1 =
  '/assets/lithos-surface.webp';

export const BG_IMAGE_2 =
  '/assets/lithos-inner.webp';

export const SPOTLIGHT_R = 260;

export const MASK_STOPS: Array<[number, string]> = [
  [0, 'rgba(255,255,255,1)'],
  [0.4, 'rgba(255,255,255,1)'],
  [0.6, 'rgba(255,255,255,0.75)'],
  [0.75, 'rgba(255,255,255,0.4)'],
  [0.88, 'rgba(255,255,255,0.12)'],
  [1, 'rgba(255,255,255,0)'],
];

export function buildMaskGradient(
  ctx: CanvasRenderingContext2D,
  cursorX: number,
  cursorY: number,
): CanvasGradient {
  const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
  MASK_STOPS.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  return gradient;
}
