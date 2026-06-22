import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from './motion';
import { ParticleField } from './ParticleField';
import { RevealLayer } from './RevealLayer';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

type MatchMediaController = {
  matchMedia: typeof window.matchMedia;
  setReducedMotion: (matches: boolean) => void;
};

function createMatchMedia(
  initialReducedMotion: boolean,
  initialCoarsePointer = false,
): MatchMediaController {
  let reducedMotion = initialReducedMotion;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
  const coarsePointerQuery = '(pointer: coarse)';

  const matchMedia = vi.fn((query: string) => ({
    media: query,
    get matches() {
      if (query === reducedMotionQuery) return reducedMotion;
      if (query === coarsePointerQuery) return initialCoarsePointer;
      return false;
    },
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (query === reducedMotionQuery) listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
  })) as unknown as typeof window.matchMedia;

  return {
    matchMedia,
    setReducedMotion(matches) {
      reducedMotion = matches;
      const event = { matches, media: reducedMotionQuery } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function Probe() {
  return <output>{useReducedMotion() ? 'reduce' : 'normal'}</output>;
}

describe('useReducedMotion', () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.removeChild(host);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Reflect.deleteProperty(document, 'hidden');
  });

  it.each([
    [true, 'reduce'],
    [false, 'normal'],
  ] as const)('reads the initial media query state when matches is %s', (matches, expected) => {
    const media = createMatchMedia(matches);
    vi.stubGlobal('matchMedia', media.matchMedia);

    act(() => root.render(<Probe />));

    expect(host.textContent).toBe(expected);
    expect(media.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('subscribes to runtime preference changes', () => {
    const media = createMatchMedia(false);
    vi.stubGlobal('matchMedia', media.matchMedia);
    act(() => root.render(<Probe />));

    act(() => media.setReducedMotion(true));

    expect(host.textContent).toBe('reduce');
  });

  it('uses a stable reveal mask without serializing the canvas in reduce mode', () => {
    const toDataURL = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL');

    act(() =>
      root.render(
        <RevealLayer
          cursorX={240}
          cursorY={180}
          image="/assets/lithos-inner.webp"
          reducedMotion
        />,
      ),
    );

    expect(host.querySelector('[data-reveal-mode="static"]')).not.toBeNull();
    expect(toDataURL).not.toHaveBeenCalled();
  });

  it.each([
    ['reduced motion', true, false],
    ['coarse pointer', false, true],
  ] as const)('does not start the particle loop for %s', (_scenario, reduced, coarse) => {
    const media = createMatchMedia(reduced, coarse);
    vi.stubGlobal('matchMedia', media.matchMedia);
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D);

    act(() =>
      root.render(<ParticleField accent="#69cec6" activeIndex={0} pointer={{ x: 0, y: 0 }} />),
    );

    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('pauses while hidden and resumes only after the page becomes visible', () => {
    const media = createMatchMedia(false, false);
    vi.stubGlobal('matchMedia', media.matchMedia);
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });

    act(() =>
      root.render(<ParticleField accent="#69cec6" activeIndex={0} pointer={{ x: 0, y: 0 }} />),
    );
    expect(requestAnimationFrame).not.toHaveBeenCalled();

    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    act(() => document.dispatchEvent(new Event('visibilitychange')));

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
