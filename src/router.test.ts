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
      '/challenges',
      '?category=临床推理',
      { name: 'challenges', search: '?category=临床推理' },
    ],
    ['/challenges/', '', { name: 'challenges', search: '' }],
    ['/curators', '', { name: 'curators' }],
    ['/curators/', '', { name: 'curators' }],
    ['/aesthetic-engine', '', { name: 'aesthetic-engine' }],
    ['/aesthetic-engine/', '', { name: 'aesthetic-engine' }],
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
    [
      '/challenges/triage-reasoning-aortic-dissection',
      '',
      {
        name: 'challenge-detail',
        challengeSlug: 'triage-reasoning-aortic-dissection',
      },
    ],
    [
      '/challenges/triage%2Dreasoning%2Daortic%2Ddissection/',
      '',
      {
        name: 'challenge-detail',
        challengeSlug: 'triage-reasoning-aortic-dissection',
      },
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
        challengeSlug: null,
        expertSlug: null,
        module: null,
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
        challengeSlug: null,
        expertSlug: null,
        module: null,
        status: 'success',
      },
    });
  });

  it('parses approved academic challenge application context', () => {
    expect(
      parseRoute(
        '/apply',
        '?source=challenge-detail&type=challenge&challenge=triage-reasoning-aortic-dissection',
      ),
    ).toEqual({
      name: 'apply',
      query: {
        source: 'challenge-detail',
        type: 'challenge',
        caseSlug: null,
        challengeSlug: 'triage-reasoning-aortic-dissection',
        expertSlug: null,
        module: null,
        status: null,
      },
    });
  });

  it('parses approved expert curation application context', () => {
    expect(
      parseRoute('/apply', '?source=curators&type=curation&expert=zhou-heng'),
    ).toEqual({
      name: 'apply',
      query: {
        source: 'curators',
        type: 'curation',
        caseSlug: null,
        challengeSlug: null,
        expertSlug: 'zhou-heng',
        module: null,
        status: null,
      },
    });
  });

  it('parses approved aesthetic-engine application context', () => {
    expect(parseRoute('/apply', '?module=aesthetic-engine')).toEqual({
      name: 'apply',
      query: {
        source: null,
        type: null,
        caseSlug: null,
        challengeSlug: null,
        expertSlug: null,
        module: 'aesthetic-engine',
        status: null,
      },
    });
  });

  it.each([
    '/login',
    '/upload',
    '/cases/one/two',
    '/challenges/one/two',
    '/curators/zhou-heng',
    '/aesthetic-engine/upload',
  ])('rejects out-of-scope route %s', (path) => {
    expect(parseRoute(path)).toEqual({ name: 'not-found' });
  });
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
