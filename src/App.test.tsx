import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ThemeProvider } from './theme';

vi.mock('./RevealLayer', () => ({
  RevealLayer: ({ reducedMotion = false }: { reducedMotion?: boolean }) => (
    <div data-reveal-mode={reducedMotion ? 'static' : 'dynamic'} data-testid="reveal-layer" />
  ),
}));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Med-Utopia cover', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  const originalPath = window.location.pathname;

  const installMatchMedia = ({
    reducedMotion,
    coarsePointer,
  }: {
    reducedMotion: boolean;
    coarsePointer: boolean;
  }) => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches:
          (query === '(prefers-reduced-motion: reduce)' && reducedMotion) ||
          (query === '(pointer: coarse)' && coarsePointer),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  };

  beforeEach(() => {
    localStorage.clear();
    installMatchMedia({ reducedMotion: false, coarsePointer: false });
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    window.history.pushState(null, '', '/');
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0,
    });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
    vi.unstubAllGlobals();
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
    localStorage.clear();
    window.history.pushState(null, '', originalPath);
  });

  const renderApp = (path = '/') => {
    window.history.pushState(null, '', path);
    act(() => {
      root.render(
        <ThemeProvider>
          <App />
        </ThemeProvider>,
      );
    });
  };

  const clickLink = (href: string) => {
    const link = container.querySelector<HTMLAnchorElement>(`a[href="${href}"]`);
    if (!link) throw new Error(`Missing link: ${href}`);
    act(() => {
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
  };

  const changeControl = (selector: string, value: string) => {
    const control = container.querySelector<HTMLInputElement | HTMLSelectElement>(selector);
    if (!control) throw new Error(`Missing form control: ${selector}`);
    act(() => {
      const prototype =
        control instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(control, value);
      control.dispatchEvent(
        new Event(control instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }),
      );
    });
  };

  const scrollToWorkIndex = (index: number) => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: index * (window.innerHeight || 900) * 0.92,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  };

  it('keeps the Lithos opening homepage at the root route', () => {
    renderApp();

    expect(container.textContent).toContain('医学理想国');
    expect(container.textContent).toContain('Let experience, judgment, and talent find their place.');
    expect(container.textContent).toContain('进入理想国');
    expect(container.textContent).toContain('首页');
    expect(container.querySelector('[data-page="home"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="reveal-layer"]')).not.toBeNull();
    expect(container.innerHTML).toContain('/assets/lithos-surface.webp');
    expect(container.querySelector('.gallery-stage')).toBeNull();
  });

  it('uses the homepage entry button to descend into the product layer', () => {
    renderApp();

    const enterButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.trim() === '进入理想国',
    );
    expect(enterButton).not.toBeUndefined();

    act(() => {
      enterButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(window.location.pathname).toBe('/work');
    expect(container.querySelector('[data-page="work"]')).not.toBeNull();
    expect(container.querySelector('.gallery-stage')?.className).toContain('long-gallery');
  });

  it('connects real homepage navigation while keeping one hero entry', () => {
    renderApp();
    const caseLink = container.querySelector('a[href="/cases"]');

    expect(caseLink).not.toBeNull();
    expect(caseLink?.textContent).toContain('避雷案例');
    expect(container.querySelector('.home-apply-cta')?.textContent).toBe('申请内测');
    expect(container.querySelector('.home-apply-cta')?.getAttribute('href')).toBe(
      '/apply?source=home',
    );
    expect(
      Array.from(container.querySelectorAll('button')).filter(
        (button) => button.textContent?.trim() === '进入理想国',
      ),
    ).toHaveLength(1);
  });

  it('gives locked homepage desktop actions a non-visual 44px hit area', () => {
    renderApp('/');

    const desktopActions = container.querySelectorAll(
      'nav[aria-label="首页导航"] .md\\:flex a',
    );
    expect(desktopActions).toHaveLength(6);
    expect(
      Array.from(desktopActions).every((action) => action.classList.contains('hit-target-44')),
    ).toBe(true);
  });

  it('uses the top-right homepage CTA to enter the apply route', () => {
    renderApp();
    const applyLink = container.querySelector<HTMLAnchorElement>('.home-apply-cta');

    act(() =>
      applyLink?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })),
    );

    expect(window.location.pathname).toBe('/apply');
    expect(window.location.search).toBe('?source=home');
    expect(container.textContent).toContain('申请内测');
  });

  it('completes home to case application success without deferred features', () => {
    renderApp('/');

    clickLink('/cases');
    expect(window.location.pathname).toBe('/cases');

    clickLink('/cases/acute-aortic-dissection-triage');
    expect(window.location.pathname).toBe('/cases/acute-aortic-dissection-triage');

    clickLink(
      '/apply?source=case-detail&type=contributor&case=acute-aortic-dissection-triage',
    );
    expect(`${window.location.pathname}${window.location.search}`).toBe(
      '/apply?source=case-detail&type=contributor&case=acute-aortic-dissection-triage',
    );

    changeControl('select[name="identity"]', '临床医生');
    changeControl('input[name="school"]', '理想医学院');
    changeControl('input[name="specialty"]', '急诊医学');
    changeControl('input[name="phone"]', '13800000000');
    act(() => container.querySelector<HTMLInputElement>('input[name="consent"]')?.click());
    act(() => {
      container
        .querySelector('form')
        ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(`${window.location.pathname}${window.location.search}`).toBe(
      '/apply?status=success&source=case-detail&type=contributor&case=acute-aortic-dissection-triage',
    );
    expect(container.textContent).toContain('申请已提交');
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });

  it('orders product navigation before theme and the global apply action', () => {
    renderApp('/cases');

    const finalPrimaryLink = container.querySelector<HTMLAnchorElement>(
      'nav[aria-label="主导航"] a[href="/aesthetic-engine"]',
    );
    const themeButton = container.querySelector<HTMLButtonElement>('.product-shell-theme');
    const desktopApply = container.querySelector<HTMLAnchorElement>(
      '.product-shell-controls .product-shell-apply',
    );

    expect(finalPrimaryLink).not.toBeNull();
    expect(themeButton).not.toBeNull();
    expect(desktopApply).not.toBeNull();
    if (!finalPrimaryLink || !themeButton || !desktopApply) {
      throw new Error('Product shell keyboard order is incomplete');
    }
    expect(
      Boolean(finalPrimaryLink.compareDocumentPosition(themeButton) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);
    expect(
      Boolean(themeButton.compareDocumentPosition(desktopApply) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);
  });

  it('opens the approved homepage mobile menu and closes it with Escape', () => {
    renderApp();
    const menuButton = container.querySelector<HTMLButtonElement>('button[aria-label="打开主菜单"]');

    act(() => menuButton?.click());
    expect(menuButton?.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('#home-mobile-menu a[href="/cases"]')).not.toBeNull();
    expect(container.querySelector('#home-mobile-menu a[href="/apply?source=home"]')).not.toBeNull();

    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menuButton);
  });

  it('renders the immersive long product page only on the work route', () => {
    renderApp('/work');

    expect(container.textContent).toContain('医学理想国');
    expect(container.textContent).toContain('案例库');
    expect(container.textContent).toContain('学术挑战');
    expect(container.textContent).toContain('申请内测');
    expect(container.textContent).not.toContain('你想进入哪个现场?');
    expect(container.textContent).not.toContain('-> 避雷案例');
    expect(container.querySelector('.assistant-panel')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.textContent).toContain('避雷案例档案');
    expect(container.textContent).toContain('CASE 01 / 专家复盘现场');
    expect(container.textContent).toContain('误判现场');
    expect(container.textContent).toContain('专家复盘');
    expect(container.querySelectorAll('.work-dossier')).toHaveLength(2);
    expect(container.querySelector('.work-dossier.left-dossier')).not.toBeNull();
    expect(container.querySelector('.work-dossier.right-dossier')).not.toBeNull();
    expect(container.querySelector('[data-theme="dark"]')).not.toBeNull();
    expect(container.querySelectorAll('.work-slab')).toHaveLength(5);
    expect(container.querySelector('[data-page="work"]')).not.toBeNull();
    expect(container.querySelector('.gallery-stage')?.className).toContain('long-gallery');
    expect(container.querySelector('.gallery-stage')?.className).toContain('horizontal-cards');
    expect(container.querySelector('.gallery-stage')?.className).toContain('spiral-stair-gallery');
    expect(container.querySelector('[aria-label="向下滚动浏览横版功能长页"]')).not.toBeNull();
  });

  it('moves downward through the long page with the mouse wheel', () => {
    renderApp('/work');

    scrollToWorkIndex(1);

    expect(container.querySelector('[data-active-category="专家点评"]')).not.toBeNull();
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--vertical-progress: 1');
  });

  it('keeps wheel input tied to native scroll position instead of jumping modules directly', () => {
    renderApp('/work');

    act(() => {
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120 }));
    });

    expect(container.querySelector('[data-active-category="避雷案例"]')).not.toBeNull();
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--vertical-progress: 0');
  });

  it('does not loop from the last module back to the first module', () => {
    renderApp('/work');

    scrollToWorkIndex(4);

    expect(container.querySelector('[data-active-category="美学引擎"]')).not.toBeNull();
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--vertical-progress: 4');

    scrollToWorkIndex(3);

    expect(container.querySelector('[data-active-category="专家策展"]')).not.toBeNull();
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--vertical-progress: 3');
  });

  it('centers the final module instead of drifting past the viewport corner', () => {
    renderApp('/work');

    scrollToWorkIndex(4);

    const stageStyle = container.querySelector('.gallery-stage')?.getAttribute('style');

    expect(container.querySelector('[data-active-category="美学引擎"]')).not.toBeNull();
    expect(stageStyle).toContain('--vertical-progress: 4');
    expect(stageStyle).toContain('--spiral-current-x: 0vw');
    expect(stageStyle).toContain('--spiral-current-y: 0vh');
    expect(container.textContent).toContain('医学表达重构');
    expect(container.textContent).toContain('不开放上传');
  });

  it('updates the scene when scrolling between work modules', () => {
    renderApp('/work');

    scrollToWorkIndex(2);

    expect(container.textContent).toContain('学术挑战场');
    expect(container.textContent).toContain('CASE 03 / 推理任务');
    expect(container.textContent).toContain('文献解读');
    expect(container.textContent).toContain('参与申请');
    expect(container.querySelector('[data-active-category="学术挑战"]')).not.toBeNull();
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--vertical-progress: 2');
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--spiral-current-x: 0vw');
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--spiral-current-y: 0vh');
  });

  it('applies mouse movement to the whole scene stage, not only individual modules', () => {
    renderApp('/work');

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 900, clientY: 240 }));
    });

    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--scene-pan-x');
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--scene-pan-y');
  });

  it('keeps the canvas scene and vertical movement arrangement in the product page', () => {
    renderApp('/work');

    expect(container.innerHTML).toContain('med-utopia-particle-field');
    expect(container.querySelector('[aria-label="向下滚动浏览横版功能长页"]')).not.toBeNull();
    expect(container.querySelector('.gallery-stage')?.getAttribute('style')).toContain('--spiral-progress');
    expect(container.querySelectorAll('.work-slab.is-current')).toHaveLength(1);
    expect(container.querySelectorAll('.work-slab.is-above, .work-slab.is-below, .work-slab.is-deep')).not.toHaveLength(0);
  });

  it('links work controls to the completed case and challenge surfaces', () => {
    renderApp('/work');

    expect(container.querySelector('.work-slab a[href="/cases"]')).not.toBeNull();
    expect(
      container.querySelector(
        '.work-slab a[href="/cases/acute-aortic-dissection-triage#expert-commentary"]',
      ),
    ).not.toBeNull();
    expect(container.querySelector('nav[aria-label="主导航"] a[href="/cases"]')).not.toBeNull();
    expect(
      container.querySelector('nav[aria-label="主导航"] a[href="/apply?source=work"]'),
    ).not.toBeNull();
    expect(container.querySelector('.work-slab a[href="/challenges"]')).not.toBeNull();
    expect(
      container.querySelector('nav[aria-label="主导航"] a[href="/challenges"]'),
    ).not.toBeNull();
    expect(container.querySelector('.work-slab a[href="/curators"]')).toBeNull();
    expect(container.querySelector('.work-slab a[href="/aesthetic-engine"]')).toBeNull();
  });

  it('gives locked work navigation a non-visual 44px hit area', () => {
    renderApp('/work');

    const targets = container.querySelectorAll('.brand-mark, .glass-nav .nav-chip');
    expect(targets.length).toBeGreaterThan(0);
    expect(Array.from(targets).every((target) => target.classList.contains('hit-target-44'))).toBe(
      true,
    );
  });

  it('positions an expert commentary deep link after the case detail renders', () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });

    renderApp('/cases/acute-aortic-dissection-triage#expert-commentary');

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('stops continuous homepage animation when reduced motion is requested', () => {
    installMatchMedia({ reducedMotion: true, coarsePointer: false });

    renderApp('/');

    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(container.querySelector('[data-reveal-mode="static"]')).not.toBeNull();
  });

  it('renders a directly selectable static work state in reduce mode', () => {
    installMatchMedia({ reducedMotion: true, coarsePointer: false });

    renderApp('/work');

    expect(container.querySelectorAll('button[data-work-selector]')).toHaveLength(5);
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(container.querySelector('[data-active-category="避雷案例"]')).not.toBeNull();

    const challengeSelector = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button[data-work-selector]'),
    ).find((button) => button.textContent === '学术挑战');
    act(() => challengeSelector?.click());

    expect(container.querySelector('[data-active-category="学术挑战"]')).not.toBeNull();
    expect(challengeSelector?.getAttribute('aria-pressed')).toBe('true');

    act(() => {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 1800 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(container.querySelector('[data-active-category="学术挑战"]')).not.toBeNull();
  });
});
