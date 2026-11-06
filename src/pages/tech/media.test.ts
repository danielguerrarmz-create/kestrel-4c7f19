import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeAssemblyPlayback } from './media';

afterEach(() => vi.unstubAllGlobals());

function setup(reduced = false) {
  let intersection: (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void = () => {};
  const listeners = new Set<() => void>();
  const doc = { hidden: false, addEventListener: (_: string, fn: () => void) => listeners.add(fn), removeEventListener: (_: string, fn: () => void) => listeners.delete(fn) };
  const disconnect = vi.fn();
  vi.stubGlobal('document', doc);
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof intersection) { intersection = callback; }
    observe() {}
    disconnect = disconnect;
  });
  const video = { play: vi.fn(() => Promise.resolve()), pause: vi.fn() };
  const cleanup = observeAssemblyPlayback(video as unknown as HTMLVideoElement, reduced);
  return { video, doc, cleanup, disconnect, listeners,
    enter(ratio: number) { intersection([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]); },
    hide(hidden: boolean) { doc.hidden = hidden; listeners.forEach(fn => fn()); },
  };
}

describe('assembly autoplay', () => {
  it('plays only when sufficiently visible and the tab is active', async () => {
    const env = setup();
    env.enter(.2);
    expect(env.video.play).not.toHaveBeenCalled();
    env.enter(.7);
    expect(env.video.play).toHaveBeenCalledTimes(1);
    env.hide(true);
    expect(env.video.pause).toHaveBeenCalledTimes(3);
    env.hide(false);
    expect(env.video.play).toHaveBeenCalledTimes(2);
    env.enter(0);
    await Promise.resolve();
    expect(env.video.pause).toHaveBeenCalled();
    env.cleanup();
    expect(env.disconnect).toHaveBeenCalledOnce();
    expect(env.listeners.size).toBe(0);
  });
  it('does not start under reduced motion', () => {
    const env = setup(true);
    env.enter(1);
    env.hide(false);
    expect(env.video.play).not.toHaveBeenCalled();
    expect(env.listeners.size).toBe(0);
    env.cleanup();
  });
  it('stops a pending play that resolves after leaving the frame', async () => {
    const env = setup();
    let resolvePlay: () => void = () => {};
    env.video.play.mockImplementation(() => new Promise<void>(resolve => { resolvePlay = resolve; }));
    env.enter(1);
    env.enter(0);
    env.video.pause.mockClear();
    resolvePlay();
    await Promise.resolve();
    expect(env.video.pause).toHaveBeenCalledOnce();
    env.cleanup();
  });
});
