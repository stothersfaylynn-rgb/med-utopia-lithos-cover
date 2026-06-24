import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../theme';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('ChallengeDetailPage', () => {
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

  function renderDetail(challengeSlug: string) {
    window.history.pushState(null, '', `/challenges/${challengeSlug}`);
    act(() => {
      root.render(
        <ThemeProvider>
          <App />
        </ThemeProvider>,
      );
    });
  }

  it('renders the complete representative challenge reading path', () => {
    renderDetail('triage-reasoning-aortic-dissection');

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelector('h1')?.textContent).toContain('第几个信号');

    const sectionIds = [
      'challenge-goal',
      'challenge-questions',
      'challenge-submission',
      'answer-sample',
      'expert-note',
      'evaluation-criteria',
      'related-case',
    ];
    const sections = sectionIds.map((id) => host.querySelector<HTMLElement>(`#${id}`));

    expect(sections.every(Boolean)).toBe(true);
    for (let index = 1; index < sections.length; index += 1) {
      const previous = sections[index - 1];
      const current = sections[index];
      if (!previous || !current) throw new Error('Challenge detail section order is incomplete');
      expect(Boolean(previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(
        true,
      );
    }

    expect(host.querySelector('#expert-note')?.textContent).toContain('周衡（Mock）');
    expect(host.querySelector('#challenge-submission')?.textContent).toContain('不接收站内答案或文件');
    expect(
      host.querySelector('a[href="/cases/acute-aortic-dissection-triage"]'),
    ).not.toBeNull();
    expect(
      host.querySelector(
        'a[href="/apply?source=challenge-detail&type=challenge&challenge=triage-reasoning-aortic-dissection"]',
      ),
    ).not.toBeNull();
    expect(host.querySelector('main#main-content a[href="/challenges"]')?.textContent).toContain(
      '返回挑战列表',
    );
  });

  it('keeps preview challenge content readable without an application link', () => {
    renderDetail('case-curation-hyponatremia');

    expect(host.textContent).toContain('预告');
    expect(host.textContent).toContain('参与申请尚未开放');
    expect(host.querySelector('a[href*="type=challenge"]')).toBeNull();
    expect(host.querySelector('#answer-sample')).not.toBeNull();
  });

  it('renders a recoverable not-found state', () => {
    renderDetail('missing-challenge');

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.textContent).toContain('挑战未找到');
    expect(host.querySelector('main#main-content a[href="/challenges"]')).not.toBeNull();
    expect(host.textContent).not.toContain('申请参与');
  });
});
