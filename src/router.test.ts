import { afterEach, describe, expect, it, vi } from 'vitest';
import { navigate, parseRoute } from './router';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('parseRoute', () => {
  it.each([
    ['/', '', { name: 'home' }],
    ['/work', '', { name: 'work' }],
    ['/work/', '', { name: 'work' }],
    ['/cases', '?department=急诊医学', { name: 'cases', search: '?department=急诊医学' }],
    ['/cases/', '', { name: 'cases', search: '' }],
    [
      '/cases/acute-aortic-dissection-triage',
      '',
      { name: 'case-detail', caseSlug: 'acute-aortic-dissection-triage' },
    ],
    [
      '/cases/acute%2Daortic%2Ddissection%2Dtriage/',
      '',
      { name: 'case-detail', caseSlug: 'acute-aortic-dissection-triage' },
    ],
  ])('parses %s', (pathname, search, expected) => {
    expect(parseRoute(pathname, search)).toEqual(expected);
  });

  it('parses approved apply context', () => {
    expect(
      parseRoute(
        '/apply',
        '?source=case-detail&type=contributor&case=acute-aortic-dissection-triage',
      ),
    ).toEqual({
      name: 'apply',
      query: {
        source: 'case-detail',
        type: 'contributor',
        caseSlug: 'acute-aortic-dissection-triage',
        status: null,
      },
    });
  });

  it('parses only the approved apply query keys', () => {
    expect(parseRoute('/apply/', '?status=success&upload=report.pdf')).toEqual({
      name: 'apply',
      query: {
        source: null,
        type: null,
        caseSlug: null,
        status: 'success',
      },
    });
  });

  it.each(['/challenges', '/login', '/upload', '/cases/one/two'])(
    'rejects out-of-scope route %s',
    (path) => {
      expect(parseRoute(path)).toEqual({ name: 'not-found' });
    },
  );
});

describe('navigate', () => {
  it('pushes a real URL once and emits one popstate event', () => {
    const pushState = vi.spyOn(window.history, 'pushState');
    const listener = vi.fn();
    window.addEventListener('popstate', listener);

    navigate('/cases');

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(pushState).toHaveBeenCalledWith(null, '', '/cases');
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('popstate', listener);
  });
});
