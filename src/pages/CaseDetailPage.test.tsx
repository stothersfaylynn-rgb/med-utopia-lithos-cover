import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../theme';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('CaseDetailPage', () => {
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

  function renderDetail(caseSlug: string) {
    window.history.pushState(null, '', `/cases/${caseSlug}`);
    act(() => {
      root.render(
        <ThemeProvider>
          <App />
        </ThemeProvider>,
      );
    });
  }

  it('renders the complete representative case and apply route', () => {
    renderDetail('acute-aortic-dissection-triage');

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelector('h1')?.textContent).toContain('急诊胸痛中的夹层警讯为何被忽略');

    const sectionIds = [
      'decision-path',
      'wrong-path',
      'corrected-review',
      'expert-commentary',
      'evidence',
      'principles',
    ];
    const sections = sectionIds.map((id) => host.querySelector<HTMLElement>(`#${id}`));

    expect(sections.every(Boolean)).toBe(true);
    for (let index = 1; index < sections.length; index += 1) {
      const previous = sections[index - 1];
      const current = sections[index];
      if (!previous || !current) throw new Error('Case detail section order is incomplete');
      expect(Boolean(previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(
        true,
      );
    }

    expect(host.querySelector('#decision-path ol')).not.toBeNull();
    expect(host.querySelector('#expert-commentary')?.textContent).toContain('周衡（Mock）');
    expect(host.querySelector('#expert-commentary')?.textContent).toContain('急诊医学');
    expect(host.querySelector('main#main-content a[href="/cases"]')?.textContent).toContain(
      '返回案例列表',
    );
    expect(
      host.querySelector(
        'a[href="/apply?source=case-detail&type=contributor&case=acute-aortic-dissection-triage"]',
      ),
    ).not.toBeNull();
    expect(
      host.querySelector(
        'a[href="/challenges/triage-reasoning-aortic-dissection"]',
      ),
    ).not.toBeNull();
  });

  it('renders a recoverable not-found state', () => {
    renderDetail('missing-case');

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.textContent).toContain('案例未找到');
    expect(host.querySelector('main#main-content a[href="/cases"]')).not.toBeNull();
    expect(host.textContent).not.toContain('申请参与内容共建');
  });
});
