import { useEffect, useState } from 'react';
import { ProductShell } from './components/ProductShell';
import { HomePage } from './HomePage';
import { ApplyPage } from './pages/ApplyPage';
import { AestheticEnginePage } from './pages/AestheticEnginePage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { CasesPage } from './pages/CasesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { CuratorsPage } from './pages/CuratorsPage';
import { ProductGallery } from './ProductGallery';
import { navigate, parseRoute, type AppRoute } from './router';

function currentRoute() {
  return parseRoute(window.location.pathname, window.location.search);
}

function getRouteNotice(_route: AppRoute) {
  return ['该页面暂未开放', '此入口已纳入第一版导航，内容将在后续阶段接入。'] as const;
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const handlePopState = () => setRoute(currentRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (route.name === 'work') {
    return <ProductGallery onGoHome={() => navigate('/')} />;
  }

  if (route.name === 'home') {
    return <HomePage onEnterWork={() => navigate('/work')} />;
  }

  if (route.name === 'cases') {
    return <CasesPage search={route.search} />;
  }

  if (route.name === 'case-detail') {
    return <CaseDetailPage caseSlug={route.caseSlug} />;
  }

  if (route.name === 'challenge-detail') {
    return <ChallengeDetailPage challengeSlug={route.challengeSlug} />;
  }

  if (route.name === 'challenges') {
    return <ChallengesPage search={route.search} />;
  }

  if (route.name === 'curators') {
    return <CuratorsPage />;
  }

  if (route.name === 'aesthetic-engine') {
    return <AestheticEnginePage />;
  }

  if (route.name === 'apply') {
    return <ApplyPage search={window.location.search} />;
  }

  const [title, description] = getRouteNotice(route);
  return (
    <ProductShell currentPath={window.location.pathname}>
      <main className="product-route-state" id="main-content">
        <p className="product-route-eyebrow">Med-Utopia</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </main>
    </ProductShell>
  );
}
