import { describe, expect, it, vi } from 'vitest';
import {
  BG_IMAGE_1,
  BG_IMAGE_2,
  MASK_STOPS,
  SPOTLIGHT_R,
  buildMaskGradient,
} from './heroConfig';

describe('hero reveal config', () => {
  it('keeps the exact Lithos image URLs and spotlight radius', () => {
    expect(BG_IMAGE_1).toBe('/assets/lithos-surface.webp');
    expect(BG_IMAGE_2).toBe('/assets/lithos-inner.webp');
    expect(SPOTLIGHT_R).toBe(260);
  });

  it('uses the required soft radial mask stops', () => {
    expect(MASK_STOPS).toEqual([
      [0, 'rgba(255,255,255,1)'],
      [0.4, 'rgba(255,255,255,1)'],
      [0.6, 'rgba(255,255,255,0.75)'],
      [0.75, 'rgba(255,255,255,0.4)'],
      [0.88, 'rgba(255,255,255,0.12)'],
      [1, 'rgba(255,255,255,0)'],
    ]);
  });

  it('draws the cursor-centered circular reveal mask', () => {
    const calls: Array<[number, string]> = [];
    const gradient = { addColorStop: (offset: number, color: string) => calls.push([offset, color]) };
    const ctx = {
      createRadialGradient: vi.fn(() => gradient),
    } as unknown as CanvasRenderingContext2D;

    const result = buildMaskGradient(ctx, 120, 220);

    expect(ctx.createRadialGradient).toHaveBeenCalledWith(120, 220, 0, 120, 220, SPOTLIGHT_R);
    expect(calls).toEqual(MASK_STOPS);
    expect(result).toBe(gradient);
  });
});
