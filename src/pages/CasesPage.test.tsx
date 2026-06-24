import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../theme';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('CasesPage', () => {
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
    window.history.pushState(null, '', `/cases${search}`);
    act(() => {
      root.render(
        <ThemeProvider>
          <App />
        </ThemeProvider>,
      );
    });
  }

  it('renders three real case links and an accessible result count', () => {
    renderPage();

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelector('h1')?.textContent).toBe('避雷案例');
    expect(host.textContent).toContain('仅供医学教育与病例复盘，不构成个体诊疗建议');
    expect(host.querySelectorAll('article[data-case-id]')).toHaveLength(3);
    expect(host.querySelector('a[href="/cases/acute-aortic-dissection-triage"]')).not.toBeNull();
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toContain('共 3 条');

    for (const article of host.querySelectorAll('article[data-case-id]')) {
      expect(article.querySelectorAll('a')).toHaveLength(1);
      expect(article.querySelector('button')).toBeNull();
      expect(article.textContent).toContain('查看完整复盘');
      expect(article.textContent).toMatch(/高风险|中风险/);
    }
  });

  it('keeps the approved content order inside the main region', () => {
    renderPage();

    const heading = host.querySelector('main#main-content h1');
    const disclaimer = host.querySelector('.cases-page-disclaimer');
    const fieldset = host.querySelector('fieldset');

    expect(heading?.previousElementSibling).toBeNull();
    expect(heading?.nextElementSibling).toBe(disclaimer);
    expect(disclaimer).not.toBeNull();
    expect(fieldset).not.toBeNull();
    if (!disclaimer || !fieldset) throw new Error('Cases page content order is incomplete');
    expect(
      Boolean(
        disclaimer.compareDocumentPosition(fieldset) & Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
  });

  it('uses three labeled native selects and writes stable filters to the URL', () => {
    renderPage();

    const fieldset = host.querySelector('fieldset');
    const selects = fieldset?.querySelectorAll('select');
    const department = host.querySelector<HTMLSelectElement>('select[name="department"]');

    expect(selects).toHaveLength(3);
    expect(fieldset?.textContent).toContain('科室');
    expect(fieldset?.textContent).toContain('风险类型');
    expect(fieldset?.textContent).toContain('难度');

    act(() => {
      if (!department) return;
      department.value = '外科 / 感染';
      department.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(window.location.pathname).toBe('/cases');
    expect(window.location.search).toBe(
      '?department=%E5%A4%96%E7%A7%91+%2F+%E6%84%9F%E6%9F%93',
    );
    expect(host.querySelectorAll('article[data-case-id]')).toHaveLength(1);
    expect(host.textContent).toContain('术后发热为何不应直接升级抗生素');
  });

  it('exposes stable mobile metadata hooks for a full-width risk row', () => {
    renderPage();

    for (const article of host.querySelectorAll('article[data-case-id]')) {
      expect(article.querySelector('.case-card-department')).not.toBeNull();
      expect(article.querySelector('.case-card-difficulty')).not.toBeNull();
      expect(article.querySelector('.case-card-risk-type')?.textContent).not.toBe('');
    }
  });

  it('renders a recoverable empty state', () => {
    renderPage('?department=急诊医学&difficulty=基础');

    expect(host.querySelectorAll('article[data-case-id]')).toHaveLength(0);
    expect(host.textContent).toContain('当前筛选条件下没有案例');
    const clearButton = Array.from(host.querySelectorAll('button')).find(
      (button) => button.textContent === '清除筛选',
    );
    expect(clearButton).not.toBeUndefined();

    act(() => clearButton?.click());

    expect(`${window.location.pathname}${window.location.search}`).toBe('/cases');
    expect(host.querySelectorAll('article[data-case-id]')).toHaveLength(3);
  });

  it('shows only the approved curator case without changing the archive layout', () => {
    renderPage('?curator=zhou-heng');

    expect(host.querySelectorAll('article[data-case-id]')).toHaveLength(1);
    expect(host.textContent).toContain('急诊胸痛中的夹层警讯为何被忽略');
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toContain('共 1 条');
    expect(host.querySelector('.case-archive-heading')).not.toBeNull();
  });

  it('keeps deferred controls out of the cases page', () => {
    renderPage();

    expect(host.querySelector('input[type="file"]')).toBeNull();
    expect(host.querySelector('input[type="password"]')).toBeNull();
    expect(host.querySelector('form')).toBeNull();
    expect(host.textContent).not.toContain('上传病例');
    expect(host.textContent).not.toContain('立即购买');
    expect(host.textContent).not.toContain('评论');
    expect(host.textContent).not.toContain('点赞');
  });
});
