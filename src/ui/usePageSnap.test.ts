import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEffect } from 'react';
import { resolveSnapStrength, usePageSnap } from './usePageSnap';

vi.mock('react', () => ({ useEffect: vi.fn() }));

/** Run the registered effect directly: these tests exercise its browser lifecycle
 * without introducing a DOM renderer into the project's node test environment. */
function mount(options: Parameters<typeof usePageSnap>[0] = {}) {
  vi.mocked(useEffect).mockClear();
  usePageSnap(options);
  const cleanup = vi.mocked(useEffect).mock.calls[0][0]();
  if (typeof cleanup !== 'function') throw new Error('Page snapping must provide cleanup');
  return cleanup;
}

function browser({ legacy = false, mobile = false, previous }: {
  legacy?: boolean;
  mobile?: boolean;
  previous?: string;
} = {}) {
  const attributes = new Map<string, string>();
  if (previous !== undefined) attributes.set('data-page-snap', previous);
  const listeners = new Set<() => void>();
  const query = {
    matches: mobile,
    ...(legacy ? {
      addListener: vi.fn((listener: () => void) => listeners.add(listener)),
      removeListener: vi.fn((listener: () => void) => listeners.delete(listener)),
    } : {
      addEventListener: vi.fn((_event: string, listener: () => void) => listeners.add(listener)),
      removeEventListener: vi.fn((_event: string, listener: () => void) => listeners.delete(listener)),
    }),
  };
  vi.stubGlobal('document', {
    documentElement: {
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      removeAttribute: (name: string) => attributes.delete(name),
    },
  });
  vi.stubGlobal('window', { matchMedia: vi.fn(() => query) });
  return {
    attributes,
    listeners,
    resize(isMobile: boolean) {
      query.matches = isMobile;
      for (const listener of listeners) listener();
    },
  };
}

beforeEach(() => vi.mocked(useEffect).mockClear());
afterEach(() => vi.unstubAllGlobals());

describe('responsive page snapping', () => {
  it('keeps the desktop rule while allowing a firmer mobile rule', () => {
    expect(resolveSnapStrength('proximity', 'mandatory', false)).toBe('proximity');
    expect(resolveSnapStrength('proximity', 'mandatory', true)).toBe('mandatory');
  });

  it('uses the same mandatory rhythm at every size by default', () => {
    expect(resolveSnapStrength('mandatory', undefined, false)).toBe('mandatory');
    expect(resolveSnapStrength('mandatory', undefined, true)).toBe('mandatory');
  });

  it.each([false, true])('removes page snapping and its breakpoint listener on unmount (legacy: %s)', (legacy) => {
    const env = browser({ legacy });
    const unmount = mount();
    expect(env.attributes.get('data-page-snap')).toBe('mandatory');
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(env.listeners.size).toBe(1);

    unmount();
    expect(env.attributes.has('data-page-snap')).toBe(false);
    expect(env.listeners.size).toBe(0);
    env.resize(true);
    expect(env.attributes.has('data-page-snap')).toBe(false);
  });

  it('applies the current breakpoint and updates it in both directions', () => {
    const env = browser({ mobile: true });
    const unmount = mount({ strength: 'mandatory', mobileStrength: 'proximity' });
    expect(env.attributes.get('data-page-snap')).toBe('proximity');
    env.resize(false);
    expect(env.attributes.get('data-page-snap')).toBe('mandatory');
    env.resize(true);
    expect(env.attributes.get('data-page-snap')).toBe('proximity');
    unmount();
  });

  it('restores existing state across cleanup and remount without retaining listeners', () => {
    const env = browser({ previous: 'proximity' });
    const firstUnmount = mount();
    expect(env.attributes.get('data-page-snap')).toBe('mandatory');
    firstUnmount();
    expect(env.attributes.get('data-page-snap')).toBe('proximity');

    const secondUnmount = mount();
    expect(env.listeners.size).toBe(1);
    secondUnmount();
    expect(env.attributes.get('data-page-snap')).toBe('proximity');
    expect(env.listeners.size).toBe(0);
    env.resize(true);
    expect(env.attributes.get('data-page-snap')).toBe('proximity');
  });
});
