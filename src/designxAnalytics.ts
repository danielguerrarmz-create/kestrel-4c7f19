/** Analytics for the standalone deck, which does not mount the marketing app. */
type EventProperties = Record<string, string | number>;
type Capture = (event: string, properties: EventProperties, timestamp: Date) => void;

interface Slide {
  number: number;
  title: string;
  count: number;
  edition: number;
}

interface DeckWindow extends Window {
  DESIGNX_SLIDES?: { title: string }[];
  DESIGNX_META?: { edition?: number };
}

/** Local checks, preview deployments and print exports must not count as readers. */
export function shouldTrackDesignx(prod: boolean, key: string, url: URL): boolean {
  const path = url.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
  return prod && key.trim() !== '' && url.protocol === 'https:'
    && ['bowerbuild.org', 'www.bowerbuild.org'].includes(url.hostname)
    && ['/designx', '/designx/v8'].includes(path)
    && url.searchParams.get('print') !== '1';
}

/** Keep the original order and timestamps while the SDK downloads. */
export function queuedCapture(ready: Promise<Capture>): Capture {
  let sink: Capture | undefined;
  let failed = false;
  const pending: Parameters<Capture>[] = [];
  void ready.then(capture => {
    sink = capture;
    for (const args of pending) sink(...args);
    pending.length = 0;
  }).catch(() => {
    failed = true;
    pending.length = 0;
  });
  return (...args) => {
    if (failed) return;
    if (sink) {
      try { sink(...args); } catch { /* Analytics must never interrupt the deck. */ }
    } else if (pending.length < 500) pending.push(args);
  };
}

export function createDesignxTracker(capture: Capture, getUrl: () => URL) {
  let lastSlide = 0;
  let opened = false;
  const record = (event: string, properties: EventProperties = {}) => {
    const url = getUrl();
    capture(event, {
      deck_id: 'designx',
      route: '/designx',
      path: url.pathname,
      $pathname: '/designx',
      $current_url: url.href,
      ...properties,
    }, new Date());
  };
  record('$pageview');
  return {
    slide(slide: Slide) {
      if (!Number.isInteger(slide.number) || slide.number < 1 || slide.number > slide.count
        || slide.number === lastSlide) return;
      lastSlide = slide.number;
      const properties = {
        deck_edition: slide.edition,
        slide_number: slide.number,
        slide_title: slide.title,
        slide_count: slide.count,
        progress_percent: Math.round(slide.number / slide.count * 100),
      };
      if (!opened) {
        opened = true;
        record('designx_deck_viewed', properties);
      }
      record('designx_slide_viewed', properties);
    },
    printOpened() { record('designx_print_opened'); },
  };
}

function start(): void {
  const key: string = import.meta.env.VITE_POSTHOG_KEY ?? '';
  if (!shouldTrackDesignx(import.meta.env.PROD, key, new URL(location.href))) return;

  const host: string = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com';
  const capture = queuedCapture(import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      capture_pageleave: true,
      // Session replay follows the same project's remote settings as the main site.
    });
    return (event, properties, timestamp) => {
      posthog.capture(event, properties, { timestamp });
    };
  }));
  const tracker = createDesignxTracker(capture, () => new URL(location.href));
  const deckWindow = window as DeckWindow;
  const recordSlide = (number: number) => {
    if (document.visibilityState === 'hidden') return;
    const slides = deckWindow.DESIGNX_SLIDES;
    const slide = slides?.[number - 1];
    if (!slide || !slides) return;
    tracker.slide({ number, title: slide.title, count: slides.length, edition: deckWindow.DESIGNX_META?.edition ?? 8 });
  };
  const recordCurrentSlide = () => {
    const current = document.querySelector<HTMLElement>('#deck .slide.is-active');
    if (current) recordSlide(Number(current.dataset.slide));
  };
  document.addEventListener('designx:slidechange', event => {
    const detail = (event as CustomEvent<{ index: number; printMode: boolean }>).detail;
    if (detail && !detail.printMode) recordSlide(detail.index + 1);
  });
  document.addEventListener('visibilitychange', recordCurrentSlide);
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('#pdf-link')) tracker.printOpened();
  });
  // The static scene scripts and this module can finish in either order.
  recordCurrentSlide();
}

if (typeof window !== 'undefined') start();
