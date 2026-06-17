import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./RevealLayer', () => ({
  RevealLayer: () => <div data-testid="reveal-layer" />,
}));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Med-Utopia cover', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.unstubAllGlobals();
  });

  it('renders the Chinese Med-Utopia cover with a dark default theme', () => {
    act(() => {
      createRoot(container).render(<App />);
    });

    expect(container.textContent).toContain('医学理想国');
    expect(container.textContent).toContain('Let experience, judgment, and talent find their place.');
    expect(container.textContent).toContain('进入理想国');
    expect(container.querySelector('[data-theme="dark"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="reveal-layer"]')).not.toBeNull();
  });

  it('can switch from dark to light theme without removing the reveal layer', () => {
    act(() => {
      createRoot(container).render(<App />);
    });

    const toggle = container.querySelector<HTMLButtonElement>('[aria-label="切换为白色界面"]');
    expect(toggle).not.toBeNull();

    act(() => {
      toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.querySelector('[data-theme="light"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="reveal-layer"]')).not.toBeNull();
  });

  it('keeps the title at the original cover scale instead of overpowering the images', () => {
    act(() => {
      createRoot(container).render(<App />);
    });

    const heading = container.querySelector('h1');
    expect(heading?.className).toContain('md:text-8xl');
    expect(heading?.className).not.toContain('13vw');
  });

  it('keeps the background imagery bright and colored across themes', () => {
    act(() => {
      createRoot(container).render(<App />);
    });

    const darkSurfaceLayer = container.querySelector('section > div');
    expect(darkSurfaceLayer?.className).toContain('opacity-100');

    const toggle = container.querySelector<HTMLButtonElement>('[aria-label="切换为白色界面"]');
    act(() => {
      toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const lightSurfaceLayer = container.querySelector('section > div');
    expect(lightSurfaceLayer?.className).toContain('opacity-90');
    expect(lightSurfaceLayer?.className).not.toContain('grayscale');
    expect(container.innerHTML).not.toContain('rgba(1,4,4,0.58)');
    expect(container.innerHTML).not.toContain('rgba(238,244,243,0.7)');
  });
});
