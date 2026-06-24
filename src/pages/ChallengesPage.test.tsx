import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../theme';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('ChallengesPage', () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  const originalPath = `${window.location.pathname}${window.location.search}`;

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
    vi.unstubAllGlobals();
    localStorage.clear();
    window.history.pushState(null, '', originalPath);
  });

  function renderPage(search = '') {
    window.history.pushState(null, '', `/challenges${search}`);
    act(() => {
      root.render(
        <ThemeProvider>
          <App />
        </ThemeProvider>,
      );
    });
  }

  it('renders three challenge dossiers and accessible result count', () => {
    renderPage();

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelector('h1')?.textContent).toBe('学术挑战');
    expect(host.textContent).toContain('仅供医学教育与学术讨论');
    expect(host.querySelectorAll('article[data-challenge-id]')).toHaveLength(3);
    expect(
      host.querySelector('a[href="/challenges/triage-reasoning-aortic-dissection"]'),
    ).not.toBeNull();
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toContain('共 3 项');

    for (const article of host.querySelectorAll('article[data-challenge-id]')) {
      expect(article.querySelectorAll('a')).toHaveLength(1);
      expect(article.querySelector('button')).toBeNull();
      expect(article.textContent).toContain('查看挑战详情');
      expect(article.textContent).toMatch(/开放申请|预告/);
      expect(article.textContent).toContain('预计投入');
      expect(article.textContent).toContain('滚动招募');
    }
  });

  it('uses one labeled native category select and writes the filter to the URL', () => {
    renderPage();

    const fieldset = host.querySelector('fieldset');
    const category = host.querySelector<HTMLSelectElement>('select[name="category"]');

    expect(fieldset?.querySelectorAll('select')).toHaveLength(1);
    expect(fieldset?.textContent).toContain('类别筛选');
    expect(Array.from(category?.options ?? []).map(({ value }) => value)).toEqual([
      '',
      '临床推理',
      '文献解读',
      '病例复盘',
      '策展任务',
    ]);

    act(() => {
      if (!category) return;
      category.value = '文献解读';
      category.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(window.location.pathname).toBe('/challenges');
    expect(window.location.search).toBe('?category=%E6%96%87%E7%8C%AE%E8%A7%A3%E8%AF%BB');
    expect(host.querySelectorAll('article[data-challenge-id]')).toHaveLength(1);
    expect(host.textContent).toContain('如何用证据判断术后发热');
  });

  it('renders and clears the intentional empty category state', () => {
    renderPage('?category=病例复盘');

    expect(host.querySelectorAll('article[data-challenge-id]')).toHaveLength(0);
    expect(host.textContent).toContain('当前筛选条件下没有挑战');
    const clearButton = Array.from(host.querySelectorAll('button')).find(
      (button) => button.textContent === '清除筛选',
    );
    expect(clearButton).not.toBeUndefined();

    act(() => clearButton?.click());

    expect(`${window.location.pathname}${window.location.search}`).toBe('/challenges');
    expect(host.querySelectorAll('article[data-challenge-id]')).toHaveLength(3);
  });

  it('keeps deferred systems out of the challenge list', () => {
    renderPage();

    expect(host.querySelector('input[type="file"]')).toBeNull();
    expect(host.querySelector('input[type="password"]')).toBeNull();
    expect(host.querySelector('form')).toBeNull();
    expect(host.textContent).not.toContain('上传答案');
    expect(host.textContent).not.toContain('倒计时');
    expect(host.textContent).not.toContain('排行榜');
  });
});
