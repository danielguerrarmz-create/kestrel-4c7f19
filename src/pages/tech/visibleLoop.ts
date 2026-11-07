/** Loop only while the illustration is visible. Resuming gives each case a full reading interval. */
export function observeVisibleLoop(element: Element, onStep: () => void, interval = 5000) {
  let visible = false;
  let paused = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  const clear = () => { clearInterval(timer); timer = undefined; };
  const sync = () => {
    clear();
    if (visible && !paused && !document.hidden) timer = setInterval(onStep, interval);
  };
  if (typeof IntersectionObserver === 'undefined') return { setPaused() {}, dispose() {} };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .4;
    sync();
  }, { threshold: [0, .4] });
  observer.observe(element);
  document.addEventListener('visibilitychange', sync);
  return {
    setPaused(value: boolean) { paused = value; sync(); },
    dispose() { clear(); observer.disconnect(); document.removeEventListener('visibilitychange', sync); },
  };
}
