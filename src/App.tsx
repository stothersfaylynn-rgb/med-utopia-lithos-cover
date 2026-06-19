import { useEffect, useState } from 'react';
import { HomePage } from './HomePage';
import { ProductGallery } from './ProductGallery';

function currentRoute() {
  return window.location.pathname === '/work' ? 'work' : 'home';
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const handlePopState = () => setRoute(currentRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goToWork = () => {
    window.history.pushState(null, '', '/work');
    setRoute('work');
  };

  const goHome = () => {
    window.history.pushState(null, '', '/');
    setRoute('home');
  };

  if (route === 'work') {
    return <ProductGallery onGoHome={goHome} />;
  }

  return <HomePage onEnterWork={goToWork} />;
}
