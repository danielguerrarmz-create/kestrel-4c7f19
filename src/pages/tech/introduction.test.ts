import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeIntroduction } from './introduction';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
function setup() {
  vi.useFakeTimers();
  let intersection: (entries: {isIntersecting: boolean; intersectionRatio: number}[]) => void = () => {};
  const listeners = new Set<() => void>();
  const doc = { hidden: false, addEventListener: (_: string, fn: () => void) => listeners.add(fn), removeEventListener: (_: string, fn: () => void) => listeners.delete(fn) };
  const disconnect = vi.fn();
  vi.stubGlobal('document', doc);
  vi.stubGlobal('IntersectionObserver', class {
    constructor(fn: typeof intersection) { intersection = fn; }
    observe() {}
    disconnect = disconnect;
  });
  const onStart = vi.fn(), onStep = vi.fn(), onFinish = vi.fn();
  const controller = observeIntroduction({} as Element, {duration:3900,steps:[0,1250,2500],onStart,onStep,onFinish});
  return { ...controller, onStart, onStep, onFinish, disconnect, listeners,
    enter(ratio: number) { intersection([{isIntersecting:ratio>0,intersectionRatio:ratio}]); },
    hide() { doc.hidden = true; listeners.forEach(fn=>fn()); },
  };
}
describe('one-time explanatory introductions', () => {
  it('waits for visibility, completes the tour and never repeats on re-entry', () => {
    const intro = setup(); intro.enter(.2); vi.advanceTimersByTime(5000);
    expect(intro.onStep).not.toHaveBeenCalled();
    intro.enter(.8); vi.advanceTimersByTime(3900);
    expect(intro.onStep.mock.calls).toEqual([[0],[1],[2]]);
    expect(intro.onFinish).toHaveBeenCalledOnce();
    intro.enter(0); intro.enter(1); vi.advanceTimersByTime(5000);
    expect(intro.onStart).toHaveBeenCalledOnce(); intro.dispose();
  });
  it('pauses the guided intro timers and resumes from the remaining reading time', () => {
    const intro = setup(); intro.enter(1); vi.advanceTimersByTime(500);
    intro.setPaused(true); vi.advanceTimersByTime(20000);
    expect(intro.onStep.mock.calls).toEqual([[0]]);
    expect(intro.onFinish).not.toHaveBeenCalled();
    intro.setPaused(false); vi.advanceTimersByTime(749);
    expect(intro.onStep.mock.calls).toEqual([[0]]);
    vi.advanceTimersByTime(1); expect(intro.onStep.mock.calls).toEqual([[0], [1]]);
    vi.advanceTimersByTime(2650); expect(intro.onFinish).toHaveBeenCalledOnce();
    intro.dispose();
  });
  it('hands over immediately and never overrides a user selection after cancellation', () => {
    const intro = setup(); intro.enter(1); vi.advanceTimersByTime(500); intro.stop();
    vi.advanceTimersByTime(5000);
    expect(intro.onStep.mock.calls).toEqual([[0]]);
    expect(intro.onFinish).toHaveBeenCalledOnce(); intro.dispose();
  });
  it('does not begin after someone interacts before the section enters view', () => {
    const intro = setup(); intro.stop(); intro.enter(1); vi.advanceTimersByTime(5000);
    expect(intro.onStart).not.toHaveBeenCalled(); expect(intro.onStep).not.toHaveBeenCalled(); intro.dispose();
  });
  it.each(['leave','hide'] as const)('finishes and cancels outstanding steps on %s', action => {
    const intro = setup(); intro.enter(1); vi.advanceTimersByTime(500);
    if(action==='leave') intro.enter(0); else intro.hide();
    vi.advanceTimersByTime(5000); expect(intro.onStep.mock.calls).toEqual([[0]]);
    expect(intro.onFinish).toHaveBeenCalledOnce(); intro.dispose();
  });
  it('disposes observers and timers without updates after unmount', () => {
    const intro=setup(); intro.enter(1); intro.dispose(); vi.advanceTimersByTime(5000);
    expect(intro.onStep).not.toHaveBeenCalled(); expect(intro.onFinish).not.toHaveBeenCalled();
    expect(intro.disconnect).toHaveBeenCalledOnce(); expect(intro.listeners.size).toBe(0);
  });
});
