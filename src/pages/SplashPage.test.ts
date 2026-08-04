import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PUBLIC_ROUTES, routes } from '../routing';
import { SplashPage } from './SplashPage';
import { APPLY_CTA } from './splash/copy';

const html = renderToString(createElement(SplashPage)).replace(/<!-- -->/g, '');

describe('SplashPage', () => {
  it('makes the living Bower the proposition', () => {
    expect(html).toContain('Grow a living');
    expect(html).toContain('font-handwrite');
    expect(html).toContain('aria-label="Bower"');
    expect(html).toContain('>in your garden.</span>');
    expect(html).toContain('bower,');
    expect(html).toContain('A shaded resting place in a garden');
    expect(html).toContain('Designed for your garden');
    expect(html).toContain('plant</em> that grows through it.');
    expect(html).toContain('selecting three exceptional sites');
  });

  it('has one primary action and it reaches a public route', () => {
    expect(html).toContain(APPLY_CTA);
    const filled = html.match(/rounded-full bg-paperVellum px-6 py-3/g) ?? [];
    expect(filled).toHaveLength(1);
    expect([...PUBLIC_ROUTES]).toContain('/contact');
  });

  it('keeps exactly three links in the primary header', () => {
    const primary = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    const links = [...primary.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    expect(links).toEqual(['/gallery', '/process', '/contact']);
    expect(primary).not.toContain('about');
    expect(primary).not.toContain('practice');
  });

  it('tells a deliberate four-part story before the footer', () => {
    expect(html.match(/<section\b/g)).toHaveLength(4);
    expect(html).toContain('/assets/gallery/favorites/living-bower-interior.webp');
    expect(html).toContain('Made for the life of a landscape.');
    expect(html).toContain('>Gather</h3>');
    expect(html).toContain('>Observe</h3>');
    expect(html).toContain('>Tend</h3>');
    expect(html).toContain('/assets/gallery/favorites/garden-table.webp');
    expect(html).toContain('/assets/gallery/favorites/garden-performance.webp');
    expect(html).toContain('/assets/process/evolution/mature.webp');
    expect(html).toContain('group-hover:opacity-100');
    expect(html).toContain('duration-[1400ms]');
    expect(html).toContain(`href="${routes.commissions}"`);
    expect(html).toContain(`href="${routes.gallery}"`);
    expect(html).toContain(`href="${routes.process}"`);
    expect(html).not.toContain('Three forms of life');
    expect(html).not.toContain('A credible path to building');
    expect(html).not.toContain('Why Bower');
    expect(html).not.toContain('register interest');
  });

  it('keeps secondary routes available in the footer', () => {
    for (const route of ['/commissions', '/about', '/questions']) {
      expect(html).toContain(`href="${route}"`);
    }
    expect(html).not.toContain('href="/about/practice"');
  });
});
