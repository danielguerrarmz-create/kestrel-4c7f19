import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/** Restarts a visual sequence when it enters the viewport and stops it off-screen. */
export function useViewportSequence<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduced, threshold]);

  return { ref, active: active && !reduced, reduced };
}

/** Plays a muted film from its first frame whenever it returns to view. */
export function useViewportVideo(threshold = 0.35) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.pause();
    if (reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    }, { threshold });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, [reduced, threshold]);

  return ref;
}
