import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeVisibleLoop } from './visibleLoop';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
function setup(interval?: number) {
  vi.useFakeTimers();
  let intersect: (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void = () => {};
  const listeners = new Set<() => void>();
  const document = {
    hidden: false,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  };
  const disconnect = vi.fn();
  vi.stubGlobal('document', document);
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof intersect) { intersect = callback; }
    observe() {}
    disconnect = disconnect;
  });
  const step = vi.fn();
  const controller = observeVisibleLoop({} as Element, step, interval);
  return { ...controller, step, disconnect, listeners,
    enter(ratio: number) { intersect([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]); },
    hide(value: boolean) { document.hidden = value; listeners.forEach(fn => fn()); },
  };
}

describe('visible load-case loop', () => {
  it('repeats at the requested 2.5-second interval only after the figure enters view', () => {
    const loop = setup(2500);
    loop.enter(.2); vi.advanceTimersByTime(15000); expect(loop.step).not.toHaveBeenCalled();
    loop.enter(.8); vi.advanceTimersByTime(2499); expect(loop.step).not.toHaveBeenCalled();
    vi.advanceTimersByTime(7501); expect(loop.step).toHaveBeenCalledTimes(4);
    loop.dispose();
  });
  it('pauses immediately and resumes with a full reading interval', () => {
    const loop = setup(); loop.enter(1); vi.advanceTimersByTime(4000);
    loop.setPaused(true); vi.advanceTimersByTime(20000); expect(loop.step).not.toHaveBeenCalled();
    loop.setPaused(false); vi.advanceTimersByTime(4999); expect(loop.step).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1); expect(loop.step).toHaveBeenCalledOnce(); loop.dispose();
  });
  it('suspends offscreen and in a hidden tab without duplicate timers on return', () => {
    const loop = setup(); loop.enter(1); vi.advanceTimersByTime(5000);
    loop.enter(0); vi.advanceTimersByTime(10000); expect(loop.step).toHaveBeenCalledOnce();
    loop.enter(1); loop.hide(true); vi.advanceTimersByTime(10000); expect(loop.step).toHaveBeenCalledOnce();
    loop.hide(false); loop.enter(.8); vi.advanceTimersByTime(5000); expect(loop.step).toHaveBeenCalledTimes(2);
    loop.dispose();
  });
  it('cleans up timers, visibility listeners and the observer on unmount', () => {
    const loop = setup(); loop.enter(1); loop.dispose(); vi.advanceTimersByTime(10000);
    expect(loop.step).not.toHaveBeenCalled(); expect(loop.disconnect).toHaveBeenCalledOnce();
    expect(loop.listeners.size).toBe(0);
  });
});
