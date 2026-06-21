export type ApplyQuery = {
  source: string | null;
  type: string | null;
  caseSlug: string | null;
  status: 'success' | null;
};

export type AppRoute =
  | { name: 'home' }
  | { name: 'work' }
  | { name: 'cases'; search: string }
  | { name: 'case-detail'; caseSlug: string }
  | { name: 'apply'; query: ApplyQuery }
  | { name: 'not-found' };

export function parseRoute(pathname: string, search = ''): AppRoute {
  const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/$/, '');

  if (normalizedPath === '/') {
    return { name: 'home' };
  }

  if (normalizedPath === '/work') {
    return { name: 'work' };
  }

  if (normalizedPath === '/cases') {
    return { name: 'cases', search };
  }

  const caseMatch = normalizedPath.match(/^\/cases\/([^/]+)$/);
  if (caseMatch) {
    return { name: 'case-detail', caseSlug: decodeURIComponent(caseMatch[1]) };
  }

  if (normalizedPath === '/apply') {
    const query = new URLSearchParams(search);
    return {
      name: 'apply',
      query: {
        source: query.get('source'),
        type: query.get('type'),
        caseSlug: query.get('case'),
        status: query.get('status') === 'success' ? 'success' : null,
      },
    };
  }

  return { name: 'not-found' };
}

export function navigate(to: string): void {
  window.history.pushState(null, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
