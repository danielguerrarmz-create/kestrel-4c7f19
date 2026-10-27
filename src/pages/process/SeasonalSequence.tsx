import { useEffect, useRef, useState } from 'react';
import { selectedImage, selectedStudy } from '../../data/selectedImages';
import { srcSetFor } from '../../ui/responsiveImg';
import { useReducedMotion } from '../../ui/useReducedMotion';

const FRAMES = ['25-new-bower', '26-growing-bower', '27-mature-bower', '28-winter-bower'] as const;
const HOLD_MS = 1500;

/** Keep a decoded, opaque image underneath each incoming fade. */
export function SeasonalSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [requested, setRequested] = useState([0]);
  const [ready, setReady] = useState<number[]>([]);
  const [failed, setFailed] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const next = FRAMES.map((_, offset) => (current + offset + 1) % FRAMES.length)
    .find((index) => index !== current && !failed.includes(index));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Warm the next frame one viewport before arrival, rather than on page load.
    const preload = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNear(true);
      preload.disconnect();
    }, { rootMargin: `${window.innerHeight}px 0px` });
    const playback = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3);
    }, { threshold: [0, 0.3] });
    const visibility = () => setPageVisible(!document.hidden);
    visibility();
    preload.observe(element);
    playback.observe(element);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      preload.disconnect();
      playback.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (!near || next === undefined || (reduced && !failed.includes(current))) return;
    // Only request one frame ahead. Retain already loaded frames for the loop.
    setRequested((frames) => frames.includes(next) ? frames : [...frames, next]);
  }, [current, failed, near, reduced, next]);

  useEffect(() => {
    if (next === undefined || !ready.includes(next)) return;
    if (failed.includes(current)) {
      setCurrent(next);
      return;
    }
    if (!visible || !pageVisible || reduced || incoming !== null || !ready.includes(current)) return;
    const timer = window.setTimeout(() => setIncoming(next), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [current, failed, incoming, next, pageVisible, ready, reduced, visible]);

  useEffect(() => {
    // With transitions disabled there is no transitionend event to finish a fade.
    // A background tab may suspend transition events. Retain the incoming frame
    // on return. Scrolling away lets the current fade finish without a hard cut.
    if (incoming === null || (!reduced && pageVisible)) return;
    setCurrent(incoming);
    setIncoming(null);
  }, [incoming, pageVisible, reduced]);

  const onError = (index: number) => {
    setReady((frames) => frames.filter((frame) => frame !== index));
    setFailed((frames) => frames.includes(index) ? frames : [...frames, index]);
  };
  const onLoad = async (image: HTMLImageElement, index: number) => {
    try {
      await image.decode();
      if (image.isConnected) {
        setFailed((frames) => frames.includes(index) ? frames.filter((frame) => frame !== index) : frames);
        setReady((frames) => frames.includes(index) ? frames : [...frames, index]);
      }
    } catch {
      if (image.isConnected) onError(index);
    }
  };

  return (
    <div ref={ref} className="process-editorial-transition">
      {requested.map((index) => {
        const slug = FRAMES[index];
        const src = selectedImage(slug);
        return (
          <div
            key={slug}
            className={`process-season-frame${index === current ? ' is-current' : ''}${index === incoming ? ' is-incoming' : ''}`}
            aria-hidden={index !== current}
            onTransitionEnd={(event) => {
              if (event.target !== event.currentTarget || event.propertyName !== 'opacity' || index !== incoming) return;
              setCurrent(index);
              setIncoming(null);
            }}
          >
            <img
              src={src}
              srcSet={srcSetFor(src)}
              sizes="100vw"
              alt={selectedStudy(slug).alt}
              loading={index === 0 && !near ? 'lazy' : 'eager'}
              decoding="async"
              onLoad={(event) => { void onLoad(event.currentTarget, index); }}
              onError={() => onError(index)}
            />
          </div>
        );
      })}
    </div>
  );
}
