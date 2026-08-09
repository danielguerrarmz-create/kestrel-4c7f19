/** A one-time wordmark overture for the editorial home page. */
import { useEffect, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const LETTERS = 'BOWER'.split('');
const LETTER_Y = [-18, -12, -21, -14, -19] as const;

export const SESSION_KEY = 'bower.intro.played';
export const INTRO_DONE_EVENT = 'bower:intro-done';

const EASE_SETTLE = [0.16, 1, 0.3, 1] as const;
const EASE_TRAVEL = [0.76, 0, 0.24, 1] as const;
const TIMING = { travel: 1250, arrive: 2400, done: 3100 } as const;

export function shouldPlayIntro(prefersReduced: boolean, alreadyPlayed: boolean): boolean {
  return !prefersReduced && !alreadyPlayed;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function BowerIntro() {
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    let played = false;
    try {
      played = !!sessionStorage.getItem(SESSION_KEY);
    } catch {
      // If storage is unavailable, the intro may play again on a later visit.
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    return shouldPlayIntro(reduced, played);
  });
  const [traveling, setTraveling] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [target, setTarget] = useState<Rect | null>(null);

  useEffect(() => {
    if (!active) return;
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return () => {
      if (window.history.scrollRestoration === 'manual') window.history.scrollRestoration = 'auto';
    };
  }, [active]);

  useIsomorphicLayoutEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const measure = () => {
      const element = document.querySelector('[data-intro-logo]') as HTMLElement | null;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setTarget({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const travelTimer = window.setTimeout(() => setTraveling(true), TIMING.travel);
    const revealTimer = window.setTimeout(() => {
      setRevealing(true);
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    }, TIMING.arrive);
    const doneTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Storage is an enhancement, never a requirement for showing the page.
      }
      setActive(false);
    }, TIMING.done);
    return () => {
      clearTimeout(travelTimer);
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [active]);

  if (!active) return null;

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const width = target?.width ?? 92;
  const height = target?.height ?? 26;
  const openingScale = Math.min(4.4, Math.max(2.35, (viewportWidth * 0.32) / width));
  const openingX = viewportWidth / 2 - (width * openingScale) / 2;
  const openingY = viewportHeight * 0.47 - (height * openingScale) / 2;
  const hasDestination = traveling && !!target;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: revealing ? 0 : 1 }}
        transition={{ duration: 0.58, ease: EASE_SETTLE }}
      />

      {target && (
        <motion.div
          className="absolute left-0 top-0 inline-flex font-sans text-[17px] font-medium tracking-[0.22em] text-[#11110e]"
          style={{ transformOrigin: 'top left' }}
          initial={{ x: openingX, y: openingY, scale: openingScale, opacity: 1 }}
          animate={{
            x: hasDestination ? target.left : openingX,
            y: hasDestination ? target.top : openingY,
            scale: hasDestination ? 1 : openingScale,
            opacity: revealing ? 0 : 1,
          }}
          transition={
            hasDestination
              ? {
                  x: { duration: 1.05, ease: EASE_TRAVEL },
                  y: { duration: 1.05, ease: EASE_TRAVEL },
                  scale: { duration: 1.05, ease: EASE_TRAVEL },
                  opacity: { duration: 0.35, ease: EASE_SETTLE },
                }
              : { duration: 0 }
          }
        >
          {LETTERS.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className="inline-block"
              initial={{ opacity: 0, y: LETTER_Y[index], filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.12 + index * 0.055, ease: EASE_SETTLE }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
