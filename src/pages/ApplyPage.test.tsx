import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ThemeProvider } from '../theme';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('ApplyPage', () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  const originalPath = `${window.location.pathname}${window.location.search}`;

  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
    vi.stubGlobal('fetch', vi.fn());
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

  function renderApply(search = '') {
    window.history.pushState(null, '', `/apply${search}`);
    act(() => {
      root.render(
        <ThemeProvider>
          <App />
        </ThemeProvider>,
      );
    });
  }

  function changeControl(selector: string, value: string) {
    const control = host.querySelector<HTMLInputElement | HTMLSelectElement>(selector);
    act(() => {
      if (!control) return;
      const prototype =
        control instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(control, value);
      control.dispatchEvent(
        new Event(control instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }),
      );
    });
  }

  it('renders the approved field order and case-detail context', () => {
    renderApply('?source=case-detail&type=contributor&case=acute-aortic-dissection-triage');

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.querySelector('h1')?.textContent).toBe('申请内测');
    expect(host.textContent).toContain('来自：急诊胸痛中的夹层警讯为何被忽略');
    expect(host.textContent).toContain('当前表单不接收病例、报告或其他医学文件。');

    const controls = [
      host.querySelector('select[name="identity"]'),
      host.querySelector('input[name="school"]'),
      host.querySelector('input[name="specialty"]'),
      host.querySelector('input[name="phone"]'),
      host.querySelector('fieldset[name="modules"]'),
      host.querySelector('input[name="consent"]'),
      host.querySelector('button[type="submit"]'),
    ];

    expect(controls.every(Boolean)).toBe(true);
    for (let index = 1; index < controls.length; index += 1) {
      const previous = controls[index - 1];
      const current = controls[index];
      if (!previous || !current) throw new Error('Apply form field order is incomplete');
      expect(Boolean(previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(
        true,
      );
    }
  });

  it('uses visible labels and contains no deferred controls', () => {
    renderApply();

    for (const id of ['apply-identity', 'apply-school', 'apply-specialty', 'apply-phone']) {
      expect(host.querySelector(`label[for="${id}"]`)).not.toBeNull();
    }
    expect(host.querySelector('input[type="file"]')).toBeNull();
    expect(host.querySelector('input[type="password"]')).toBeNull();
    expect(host.querySelector('textarea')).toBeNull();
    expect(host.textContent).not.toContain('参与动机');
    expect(host.textContent).not.toContain('价格');
    expect(host.textContent).not.toContain('支付');
    expect(host.textContent).not.toContain('聊天');
  });

  it('announces validation and focuses the first invalid field', () => {
    renderApply();
    const form = host.querySelector('form');

    act(() => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    const identity = host.querySelector<HTMLSelectElement>('select[name="identity"]');
    const identityErrorId = identity?.getAttribute('aria-describedby');
    const identityError = identityErrorId ? host.querySelector(`#${identityErrorId}`) : null;

    expect(window.location.pathname).toBe('/apply');
    expect(identity?.getAttribute('aria-invalid')).toBe('true');
    expect(identityError?.getAttribute('role')).toBe('alert');
    expect(identityError?.textContent).toContain('请选择你的身份');
    expect(document.activeElement).toBe(identity);
  });

  it('submits valid values without a network request and preserves context', () => {
    renderApply('?source=case-detail&type=contributor&case=acute-aortic-dissection-triage');

    changeControl('select[name="identity"]', '临床医生');
    changeControl('input[name="school"]', '理想医学院');
    changeControl('input[name="specialty"]', '急诊医学');
    changeControl('input[name="phone"]', '13800000000');

    const consent = host.querySelector<HTMLInputElement>('input[name="consent"]');
    act(() => consent?.click());
    act(() => {
      host
        .querySelector('form')
        ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(fetch).not.toHaveBeenCalled();
    expect(`${window.location.pathname}${window.location.search}`).toBe(
      '/apply?status=success&source=case-detail&type=contributor&case=acute-aortic-dissection-triage',
    );
    expect(host.textContent).toContain('申请已提交');
  });

  it('renders a deterministic success state', () => {
    renderApply('?status=success&source=case-detail&type=contributor&case=acute-aortic-dissection-triage');

    expect(host.querySelectorAll('h1')).toHaveLength(1);
    expect(host.textContent).toContain('申请已提交');
    expect(host.querySelector('main#main-content a[href="/cases"]')).not.toBeNull();
    expect(host.querySelector('main#main-content a[href="/"]')).not.toBeNull();
    expect(host.querySelector('form')).toBeNull();
  });
});
