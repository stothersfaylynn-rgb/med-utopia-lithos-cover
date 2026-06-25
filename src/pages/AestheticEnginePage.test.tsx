import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../theme';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('AestheticEnginePage', () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  const originalPath = `${window.location.pathname}${window.location.search}`;

  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    window.history.pushState(null, '', '/aesthetic-engine');
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.removeChild(host);
    vi.unstubAllGlobals();
    localStorage.clear();
    window.history.pushState(null, '', originalPath);
  });

  function renderPage() {
    act(() => {
      root.render(
        <ThemeProvider>
          <App />
        </ThemeProvider>,
      );
    });
  }

  it('renders the approved Coming Soon surface without upload controls', () => {
    renderPage();

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelector('h1')?.textContent).toBe('敬请期待');
    expect(host.textContent).toContain(
      '医学美学重构引擎正在内测中。报告美化、PPT 重构、科研海报生成等功能将作为独立工具开放，当前页面不提供文件上传。',
    );
    expect(host.querySelector('[data-page="aesthetic-engine"]')).not.toBeNull();
    expect(host.querySelector('input[type="file"]')).toBeNull();
    expect(host.querySelector('form')).toBeNull();
    expect(host.textContent).not.toContain('立即生成');
    expect(host.textContent).not.toContain('开始重构');
  });

  it('keeps all theme assets in the fixed 2:3 trail-card system', () => {
    renderPage();

    const sourceCards = host.querySelectorAll<HTMLElement>('[data-aesthetic-source-card]');

    expect(sourceCards).toHaveLength(6);
    expect(
      Array.from(sourceCards).every((card) => card.dataset.cardRatio === '2:3'),
    ).toBe(true);
    expect(
      Array.from(sourceCards).map((card) => card.querySelector('img')?.getAttribute('src')),
    ).toEqual([
      '/aesthetic-engine/report-reconstruction.png',
      '/aesthetic-engine/presentation-reconstruction.png',
      '/aesthetic-engine/poster-grid.png',
      '/aesthetic-engine/evidence-matrix.png',
      '/aesthetic-engine/decision-path.png',
      '/aesthetic-engine/dossier-cover.png',
    ]);
  });

  it('spawns bounded fixed-frame image trail items from pointer movement', () => {
    renderPage();
    const stage = host.querySelector<HTMLElement>('[data-aesthetic-trail-stage]');

    expect(stage).not.toBeNull();

    act(() => {
      stage?.dispatchEvent(
        new MouseEvent('mousemove', { bubbles: true, clientX: 320, clientY: 220 }),
      );
    });

    const trailItem = host.querySelector<HTMLElement>('[data-aesthetic-trail-item]');
    expect(trailItem).not.toBeNull();
    expect(trailItem?.dataset.cardRatio).toBe('2:3');
    expect(trailItem?.style.getPropertyValue('--trail-x')).toBe('320px');
    expect(trailItem?.style.getPropertyValue('--trail-y')).toBe('220px');
    expect(trailItem?.querySelector('img')?.getAttribute('src')).toContain('/aesthetic-engine/');
  });

  it('offers only the approved internal-test intention action', () => {
    renderPage();

    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('main a[href]'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/apply?module=aesthetic-engine',
    ]);
    expect(links[0]?.textContent).toBe('申请美学引擎内测');
    expect(host.querySelector('main button')).toBeNull();
  });
});
