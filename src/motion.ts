import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function readReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(readReducedMotion);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const updatePreference = () => setReducedMotion(media.matches);

    updatePreference();
    if (media.addEventListener) {
      media.addEventListener('change', updatePreference);
      return () => media.removeEventListener('change', updatePreference);
    }

    media.addListener?.(updatePreference);
    return () => media.removeListener?.(updatePreference);
  }, []);

  return reducedMotion;
}
