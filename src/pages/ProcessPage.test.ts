import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProcessPage } from './ProcessPage';

const html = renderToString(createElement(ProcessPage));

describe('ProcessPage', () => {
  it('carries the approved live-page narrative into the editorial layout', () => {
    expect(html).toContain('From landscape');
    expect(html).toContain('The structure is finished once. The garden never is.');
    expect(html).toContain('None of them<br/>finished.');
    expect(html).toContain('The garden continues');
    expect(html).toContain('Five acts');
    expect(html).toContain('Founding Site Study');
  });

  it('uses five distinct selected renditions and keeps their status clear', () => {
    const sources = [...html.matchAll(/src="(\/assets\/selected\/[^" ]+\.webp)"/g)].map((match) => match[1]);
    expect(sources).toEqual([
      '/assets/selected/30-ancient-bower.webp',
      '/assets/selected/25-new-bower.webp',
      '/assets/selected/26-growing-bower.webp',
      '/assets/selected/27-mature-bower.webp',
      '/assets/selected/28-winter-bower.webp',
    ]);
    expect(new Set(sources).size).toBe(sources.length);
    expect(html).not.toContain('<figcaption');
    expect(html).not.toContain('A disciplined route');
    expect(html).not.toContain('Year zero to year three');
    expect(html).toMatch(/<span>1(?:<!-- -->)?\.<\/span>Conversation/);
    expect(html).toMatch(/<span>5(?:<!-- -->)?\.<\/span>Stewardship/);
  });

  it('uses the supplied growth video and retains the four-frame seasonal transition', () => {
    expect(html).not.toContain('Placeholder for a Bower fabrication film');
    expect(html).not.toContain('Placeholder for a Bower assembly film');
    expect(html).toContain('/assets/process/bower-growth-transition.mp4');
    expect(html).toContain('/assets/process/bower-growth-transition-mobile.mp4');
    expect(html).toContain('/assets/process/bower-growth-transition-poster.webp');
    expect(html).not.toContain('autoplay=""');
    expect(html).toContain('muted=""');
    expect(html).toContain('loop=""');
    expect(html).toContain('process-editorial-transition');
    expect(html).toContain('Every<br/>landscape asks');
    expect(html).toContain('Begin with a conversation');
  });

  it('sizes and snaps the two full-spread image sequences to the viewport', () => {
    expect(html.match(/data-snap-spread="true"/g)).toHaveLength(2);
    expect(html.match(/viewport-spread/g)).toHaveLength(2);
  });
});
