import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { PUBLIC_ROUTES, routes } from '../routing';
import { SplashPage, studies } from './SplashPage';
const html = renderToString(createElement(SplashPage)).replace(/<!-- -->/g, '');
describe('Bower homepage', () => {
  it('links directly to the public gallery and leads with the product image', () => {
    expect(html).toContain(`href="${routes.gallery}"`);
    expect(html).toContain('View the gallery');
    expect(html).toContain('Living architecture.');
    expect(html).not.toContain('Enter the world');
  });
  it('states the purpose and invites readers to commission one of the first Bowers', () => {
    expect(html).toContain('<p>We build architecture that gives living systems agency in determining what it becomes.</p>');
    expect(html).toContain('Concept visualisation');
    expect(html).toContain('<h2>Begin.</h2>');
    expect(html).toContain('These are the first Bowers. Yours could be among them.');
    expect(html).not.toContain('Founded in 2026');
    expect(html).not.toMatch(/guaranteed|production-ready|architect<|ROI/);
  });
  it('keeps navigation public and Contact primary', () => {
    const primary = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    expect(primary).toContain('Contact');
    expect(primary).not.toContain('Contact Bower');
    expect(primary).toContain(`href="${routes.contact}"`);
    for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) expect([...PUBLIC_ROUTES]).toContain(match[1]);
  });
  it('uses available current study images', () => {
    for (const [slug] of studies) expect(existsSync(`public/assets/selected/${slug}.webp`)).toBe(true);
  });
  it('marks every full-spread image for viewport sizing and soft page snapping', () => {
    expect(html.match(/data-snap-spread="true"/g)).toHaveLength(3);
    expect(html.match(/viewport-spread/g)).toHaveLength(3);
  });
  it('carries the original object-in-time frame into the new home page', () => {
    expect(html).toContain('A Bower begins when building ends.');
    for (const image of ['25-new-bower', '26-growing-bower', '27-mature-bower']) {
      expect(html).toContain(`/assets/selected/${image}.webp`);
    }
    for (const caption of ['At installation', 'After 20 years', 'After 60 years']) {
      expect(html).toContain(caption);
    }
    expect(html).not.toContain('The object in time');
    expect(html).not.toContain('A place to gather.');
    expect(html).not.toContain('A place that grows.');
    expect(html).not.toContain('A lattice');
    expect(html).not.toContain('Leaves in the weave');
    expect(html).not.toContain('A room of blossom and eaves');
    expect(html).not.toContain('The garden makes it more.');
    expect(html).not.toContain('Somewhere to be.');
    expect(html).not.toContain('A living timber pavilion, shaped for your garden.');
    expect(html.indexOf('A Bower begins when building ends.')).toBeLessThan(html.indexOf('A long lunch.'));
    expect(html.indexOf('A long lunch.')).toBeLessThan(html.indexOf('09-summer-family.webp'));
    expect(html).toContain('08-winter-family.webp');
    expect(html.indexOf('09-summer-family.webp')).toBeLessThan(html.indexOf('Nature becomes one of the authors.'));
  });
});
