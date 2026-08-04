import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PUBLIC_ROUTES } from '../routing';
import { SplashPage } from './SplashPage';
import { APPLY_CTA } from './splash/copy';

const html = renderToString(createElement(SplashPage)).replace(/<!-- -->/g, '');

describe('SplashPage', () => {
  it('makes the living Bower the proposition', () => {
    expect(html).toContain('Grow a living');
    expect(html).toContain('font-handwrite');
    expect(html).toContain('aria-label="Bower"');
    expect(html).toContain('>in your garden.</span>');
    expect(html).toContain('A building you tend.');
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

  it('contains only the hero, one full-spread image, and one close before the footer', () => {
    expect(html.match(/<section\b/g)).toHaveLength(3);
    expect(html).toContain('/assets/gallery/favorites/living-bower-interior.webp');
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
