import { describe, expect, it, vi } from 'vitest';
import { createDesignxTracker, queuedCapture, shouldTrackDesignx } from './designxAnalytics';

describe('standalone DesignX analytics', () => {
  it('only counts production readers of the public presentation', () => {
    for (const url of [
      'https://bowerbuild.org/designx',
      'https://www.bowerbuild.org/designx/',
      'https://www.bowerbuild.org/designx/v8/#slide-08',
      'https://www.bowerbuild.org/designx/index.html',
    ]) expect(shouldTrackDesignx(true, 'project-key', new URL(url))).toBe(true);
    for (const url of [
      'http://localhost:5333/designx',
      'https://preview.vercel.app/designx',
      'file:///deck/designx/index.html',
      'https://www.bowerbuild.org/designx?print=1',
      'https://www.bowerbuild.org/designx/v8/?print=1',
      'https://www.bowerbuild.org/designx/7',
      'https://www.bowerbuild.org/designx/v8/story-map.html',
      'https://www.bowerbuild.org/',
    ]) expect(shouldTrackDesignx(true, 'project-key', new URL(url))).toBe(false);
    expect(shouldTrackDesignx(false, 'project-key', new URL('https://bowerbuild.org/designx'))).toBe(false);
    expect(shouldTrackDesignx(true, '  ', new URL('https://bowerbuild.org/designx'))).toBe(false);
  });

  it('counts one page and deck, keeps deep-link slide numbers, and deduplicates repeated render events', () => {
    const capture = vi.fn();
    let url = new URL('https://bowerbuild.org/designx/v8/#slide-08');
    const tracker = createDesignxTracker(capture, () => url);
    tracker.slide({ number: 8, title: 'Making the Bower', count: 16, edition: 8 });
    tracker.slide({ number: 8, title: 'Making the Bower', count: 16, edition: 8 });
    url = new URL('https://bowerbuild.org/designx/v8/#slide-09');
    tracker.slide({ number: 9, title: 'Manufacturing', count: 16, edition: 8 });
    tracker.slide({ number: 8, title: 'Making the Bower', count: 16, edition: 8 });
    tracker.printOpened();
    expect(capture.mock.calls.map(call => call[0])).toEqual([
      '$pageview', 'designx_deck_viewed', 'designx_slide_viewed',
      'designx_slide_viewed', 'designx_slide_viewed', 'designx_print_opened',
    ]);
    expect(capture.mock.calls[2][1]).toMatchObject({
      $pathname: '/designx', path: '/designx/v8/', deck_id: 'designx',
      slide_number: 8, slide_count: 16, slide_title: 'Making the Bower', progress_percent: 50,
      $current_url: 'https://bowerbuild.org/designx/v8/#slide-08',
    });
    expect(capture.mock.calls[3][1].$current_url).toBe('https://bowerbuild.org/designx/v8/#slide-09');
  });

  it('does not count missing or out-of-range slides as deck reads', () => {
    const capture = vi.fn();
    const tracker = createDesignxTracker(capture, () => new URL('https://bowerbuild.org/designx'));
    for (const number of [NaN, 0, 17, 1.5]) tracker.slide({ number, title: '', count: 16, edition: 8 });
    expect(capture.mock.calls.map(call => call[0])).toEqual(['$pageview']);
  });

  it('preserves early views and occurrence times until the SDK is available', async () => {
    const sink = vi.fn();
    let ready!: (capture: typeof sink) => void;
    const capture = queuedCapture(new Promise(resolve => { ready = resolve; }));
    const first = new Date('2026-11-17T09:00:00Z');
    const second = new Date('2026-11-17T09:00:01Z');
    capture('$pageview', { route: '/designx' }, first);
    capture('designx_slide_viewed', { slide_number: 8 }, second);
    expect(sink).not.toHaveBeenCalled();
    ready(sink);
    await Promise.resolve();
    capture('designx_slide_viewed', { slide_number: 9 }, second);
    expect(sink.mock.calls.map(call => call[0])).toEqual(['$pageview', 'designx_slide_viewed', 'designx_slide_viewed']);
    expect(sink.mock.calls[0][2]).toBe(first);
    expect(sink.mock.calls[1][2]).toBe(second);
  });

  it('isolates an unavailable or failing analytics client from presentation controls', async () => {
    const rejected = queuedCapture(Promise.reject(new Error('SDK blocked')));
    await Promise.resolve();
    await Promise.resolve();
    expect(() => rejected('designx_slide_viewed', { slide_number: 2 }, new Date())).not.toThrow();
    const failing = queuedCapture(Promise.resolve(() => { throw new Error('capture failed'); }));
    await Promise.resolve();
    expect(() => failing('designx_slide_viewed', { slide_number: 2 }, new Date())).not.toThrow();
  });
});
