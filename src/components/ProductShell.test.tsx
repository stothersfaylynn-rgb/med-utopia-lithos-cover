import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../theme';
import { ProductShell } from './ProductShell';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('ProductShell', () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.removeChild(host);
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  function renderShell(currentPath = '/cases') {
    act(() => {
      root.render(
        <ThemeProvider>
          <ProductShell currentPath={currentPath}>
            <main id="main-content">案例内容</main>
          </ProductShell>
        </ThemeProvider>,
      );
    });
  }

  it('exposes real product links and current page state', () => {
    renderShell();
    const nav = host.querySelector('nav[aria-label="主导航"]');

    expect(nav?.querySelector('a[href="/"]')).not.toBeNull();
    expect(nav?.querySelector('a[href="/cases"]')?.getAttribute('aria-current')).toBe('page');
    expect(nav?.querySelector('a[href="/challenges"]')).not.toBeNull();
    expect(nav?.querySelector('a[href="/curators"]')).not.toBeNull();
    expect(nav?.querySelector('a[href="/aesthetic-engine"]')).not.toBeNull();
    expect(nav?.querySelector('a[href="/apply?source=global"]')).not.toBeNull();
  });

  it('closes the mobile menu with Escape and restores menu focus', () => {
    renderShell();
    const menuButton = host.querySelector<HTMLButtonElement>('button[aria-label="打开主菜单"]');

    expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
    expect(menuButton?.getAttribute('aria-controls')).toBe('product-shell-navigation');

    act(() => menuButton?.click());
    expect(menuButton?.getAttribute('aria-expanded')).toBe('true');

    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menuButton);
  });

  it('marks academic challenges current on list and detail routes', () => {
    renderShell('/challenges/triage-reasoning-aortic-dissection');
    const nav = host.querySelector('nav[aria-label="主导航"]');

    expect(nav?.querySelector('a[href="/challenges"]')?.getAttribute('aria-current')).toBe(
      'page',
    );
    expect(nav?.querySelector('a[href="/cases"]')?.getAttribute('aria-current')).toBeNull();
  });

  it('uses the global theme control with a 44px token target', () => {
    renderShell();
    const themeButton = host.querySelector<HTMLButtonElement>('.product-shell-theme');

    expect(themeButton?.getAttribute('aria-label')).toBe('切换为浅色主题');
    act(() => themeButton?.click());
    expect(localStorage.getItem('med-utopia-theme')).toBe('light');
    expect(themeButton?.getAttribute('aria-label')).toBe('切换为深色主题');
  });
});
