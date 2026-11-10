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
  let paused = false;
  let elapsed = 0;
  let resumedAt = 0;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const clear = () => { timers.forEach(clearTimeout); timers.length = 0; };
  const stop = () => {
    if (stopped) return;
    stopped = true;
    clear();
    intro.onFinish();
  };
  const schedule = () => {
    resumedAt = Date.now();
    intro.steps?.forEach((time, index) => {
      if (time >= elapsed) timers.push(setTimeout(() => intro.onStep?.(index), time - elapsed));
    });
    timers.push(setTimeout(stop, intro.duration - elapsed));
  };
  const setPaused = (value: boolean) => {
    if (stopped || paused === value) return;
    paused = value;
    if (!started) return;
    if (paused) { elapsed += Date.now() - resumedAt; clear(); }
    else schedule();
  };
  const start = () => {
    if (started || stopped || !visible || paused || document.hidden) return;
    started = true;
    intro.onStart();
    schedule();
  };
  const visibility = () => { if (document.hidden && started) stop(); else start(); };
  if (typeof IntersectionObserver === 'undefined') { stop(); return { stop, setPaused, dispose: clear }; }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .4;
    if (visible) start();
    else if (started) stop();
  }, { threshold: [.1, .4] });
  observer.observe(element);
  document.addEventListener('visibilitychange', visibility);
  return {
    stop,
    setPaused,
    dispose() { stopped = true; clear(); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); },
  };
}
