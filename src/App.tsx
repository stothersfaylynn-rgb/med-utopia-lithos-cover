import { useEffect, useState } from 'react';
import { ProductShell } from './components/ProductShell';
import { HomePage } from './HomePage';
import { ProductGallery } from './ProductGallery';
import { navigate, parseRoute, type AppRoute } from './router';

function currentRoute() {
  return parseRoute(window.location.pathname, window.location.search);
}

function getRouteNotice(route: AppRoute) {
  if (route.name === 'cases') {
    return ['避雷案例', '案例列表将在后续任务接入。'] as const;
  }
  if (route.name === 'case-detail') {
    return ['案例详情', '案例详情将在后续任务接入。'] as const;
  }
  if (route.name === 'apply') {
    return ['申请内测', '申请表将在后续任务接入。'] as const;
  }
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
