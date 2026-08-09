import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PUBLIC_ROUTES, routes } from '../routing';
import { HERO_ROTATION_MS, nextHeroIndex, SplashPage } from './SplashPage';

const html = renderToString(createElement(SplashPage)).replace(/<!-- -->/g, '');

describe('SplashPage', () => {
  it('opens as living architecture, not a residential garden product', () => {
    expect(html).toContain('Buildings that nature designs.');
    expect(html).toContain('Living architecture');
    expect(html).toContain('Founding commissions');
    expect(html).toContain('England · 2027');
    expect(html).not.toContain('Grow a living');
    expect(html).not.toContain('font-handwrite');
    expect(html).not.toContain('in your garden.');
    expect(html.match(/snap-start/g)).toHaveLength(7);
    expect(html).toContain('href="#meaning"');
    expect(html).toContain('Scroll to discover more');
    expect(html).toContain('id="meaning"');
  });

  it('withholds the commissioning action until the invitation', () => {
    expect(html).toContain('Introduce a landscape →');
    expect(html).toContain(`href="${routes.contact}"`);
    expect([...PUBLIC_ROUTES]).toContain(routes.contact);
    expect(html).not.toContain('Discuss a founding commission');
    expect(html).not.toContain('rounded-full bg-paperVellum');
  });

  it('uses the brief\'s small editorial navigation', () => {
    const primary = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    const links = [...primary.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    const labels = [...primary.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map((match) => match[1]);
    expect(links).toEqual([routes.gallery, routes.process, routes.practice, routes.contact]);
    expect(labels).toEqual(['Works', 'Making', 'Practice', 'Enquire']);
  });

  it('tells the seven-movement exhibition story', () => {
    expect(html.match(/<section\b/g)).toHaveLength(7);
    for (const line of [
      'The object in time',
      'Study No. 01',
      'A life of its own',
      'Evidence of making',
      'Founding commissions',
    ]) {
      expect(html).toContain(line);
    }
    expect(html).toContain('/assets/process/evolution/installation.webp');
    expect(html).toContain('/assets/process/evolution/establishing.webp');
    expect(html).toContain('/assets/process/evolution/mature.webp');
    expect(html).toContain('/assets/gallery/week-3/valley-bower-at-dawn.webp');
    expect(html).toContain('/assets/gallery/week-3/garden-room-gathering.webp');
    expect(html).toContain('/assets/gallery/favorites/timber-joinery-detail.webp');
    expect(html).toContain('Every Bower is different.');
    expect(html).toContain('We are building the means to make them again and again, without ever making the same one twice.');
    expect(html).not.toContain('The system behind it is not.');
    expect(html).toContain('A lattice');
    expect(html).toContain('Leaves in the weave');
    expect(html).toContain('A room of blossom and eaves');
    expect(html).toContain('We create buildings that cannot simply be purchased and placed.');
    expect(html).toContain('They belong to one landscape, develop with it, and become more extraordinary with every passing year.');
  });

  it('labels imagined work honestly and keeps secondary routes in the footer', () => {
    expect(html).toContain('Unbuilt concept visualisation');
    expect(html).toContain('Concept study of a timber lattice joint');
    expect(html).toContain('href="/press"');
    expect(html).toContain('href="/questions"');
    expect(html).not.toContain('href="/commissions"');
    expect(html).toContain('href="/about/practice"');
  });
});

describe('homepage hero rotation', () => {
  it('includes the former manor-garden homepage hero', () => {
    expect(html).toContain('/hero/v4/manor-garden.webp');
    expect(html).not.toContain('/assets/gallery/favorites/english-garden-path.webp');
  });

  it('advances through the hero images and wraps to the first', () => {
    expect(nextHeroIndex(0)).toBe(1);
    expect(nextHeroIndex(1)).toBe(2);
    expect(nextHeroIndex(2)).toBe(0);
  });

  it('changes the image every few seconds', () => {
    expect(HERO_ROTATION_MS).toBeGreaterThanOrEqual(3000);
    expect(HERO_ROTATION_MS).toBeLessThanOrEqual(7000);
  });
});
