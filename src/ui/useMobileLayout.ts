import { useEffect, useState } from 'react';

/** Keep touch layouts independent of desktop scroll choreography. */
export function useMobileLayout() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return mobile;
}
