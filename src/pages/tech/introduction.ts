type Introduction = {
  duration: number;
  steps?: readonly number[];
  onStart: () => void;
  onStep?: (index: number) => void;
  onFinish: () => void;
};

/** One visible explanation, with immediate handover on interaction or departure. */
export function observeIntroduction(element: Element, intro: Introduction) {
  let started = false;
  let stopped = false;
  let visible = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const clear = () => { timers.forEach(clearTimeout); timers.length = 0; };
  const stop = () => {
    if (stopped) return;
    stopped = true;
    clear();
    intro.onFinish();
  };
  const start = () => {
    if (started || stopped || !visible || document.hidden) return;
    started = true;
    intro.onStart();
    intro.steps?.forEach((time, index) => timers.push(setTimeout(() => intro.onStep?.(index), time)));
    timers.push(setTimeout(stop, intro.duration));
  };
  const visibility = () => { if (document.hidden && started) stop(); else start(); };
  if (typeof IntersectionObserver === 'undefined') { stop(); return { stop, dispose: clear }; }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .4;
    if (visible) start();
    else if (started) stop();
  }, { threshold: [.1, .4] });
  observer.observe(element);
  document.addEventListener('visibilitychange', visibility);
  return {
    stop,
    dispose() { stopped = true; clear(); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); },
  };
}
