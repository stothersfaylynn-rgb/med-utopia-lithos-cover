import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { cases } from '../data/cases';
import { experts } from '../data/experts';
import { ThemeProvider } from '../theme';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('CuratorsPage', () => {
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

  function renderPage() {
    window.history.pushState(null, '', '/curators');
    act(() => {
      root.render(
        <ThemeProvider>
          <App />
        </ThemeProvider>,
      );
    });
  }

  it('renders the approved expert index and traceable actions', () => {
    renderPage();

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelector('h1')?.textContent).toBe('专家策展');
    expect(host.textContent).toContain('以研究方向、策展病例与完整点评建立可追溯的判断索引');
    expect(host.textContent).toContain('共 3 位策展人');
    expect(host.querySelectorAll('article[data-expert-slug]')).toHaveLength(3);

    for (const expert of experts) {
      const record = host.querySelector<HTMLElement>(
        `article[data-expert-slug="${expert.slug}"]`,
      );
      const curatedCase = cases.find(({ slug }) => slug === expert.curatedCaseSlug);

      expect(record).not.toBeNull();
      expect(record?.textContent).toContain(expert.name);
      expect(record?.textContent).toContain(expert.specialty);
      expect(record?.textContent).toContain(expert.researchDirections[0]);
      expect(record?.textContent).toContain(expert.researchDirections[1]);
      expect(record?.textContent).toContain(curatedCase?.title);
      expect(record?.textContent).toContain(expert.featuredComment);
      expect(
        record?.querySelector(`a[href="/cases?curator=${expert.slug}"]`),
      ).not.toBeNull();
      expect(
        record?.querySelector(
          `a[href="/cases/${expert.curatedCaseSlug}#expert-commentary"]`,
        ),
      ).not.toBeNull();
      expect(
        record?.querySelector(
          `a[href="/apply?source=curators&type=curation&expert=${expert.slug}"]`,
        ),
      ).not.toBeNull();
    }
  });

  it('keeps deferred profile and consultation features out of the page', () => {
    renderPage();

    expect(host.querySelector('input')).toBeNull();
    expect(host.querySelector('form')).toBeNull();
    expect(host.querySelector('img')).toBeNull();
    expect(host.textContent).not.toContain('在线咨询');
    expect(host.textContent).not.toContain('关注专家');
    expect(host.textContent).not.toContain('评分');
    expect(host.textContent).not.toContain('立即支付');
  });
});
