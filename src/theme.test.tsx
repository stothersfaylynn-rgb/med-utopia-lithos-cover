import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './theme';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

function Probe() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}

describe('ThemeProvider', () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.documentElement.style.colorScheme = '';
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.removeChild(host);
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.documentElement.style.colorScheme = '';
    vi.unstubAllGlobals();
  });

  function renderProvider() {
    act(() => {
      root.render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>,
      );
    });
  }

  it('prefers the persisted theme and synchronizes the document', () => {
    localStorage.setItem('med-utopia-theme', 'dark');
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));

    renderProvider();

    expect(host.textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('defaults to dark when no theme preference has been saved', () => {
    const matchMedia = vi.fn(() => ({ matches: false }));
    vi.stubGlobal('matchMedia', matchMedia);

    renderProvider();

    expect(matchMedia).not.toHaveBeenCalled();
    expect(host.textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('toggles only between light and dark and persists each choice', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
    renderProvider();
    const button = host.querySelector('button');

    expect(host.textContent).toBe('dark');

    act(() => button?.click());
    expect(host.textContent).toBe('light');
    expect(localStorage.getItem('med-utopia-theme')).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');

    act(() => button?.click());
    expect(host.textContent).toBe('dark');
    expect(localStorage.getItem('med-utopia-theme')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
