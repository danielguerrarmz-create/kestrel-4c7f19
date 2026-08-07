import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProcessPage } from './ProcessPage';

const html = renderToString(createElement(ProcessPage));

describe('ProcessPage', () => {
  it('shows one work through time in the redesigned making sequence', () => {
    expect(html).toContain('/assets/process/evolution/installation.webp');
    expect(html).toContain('/assets/process/evolution/establishing.webp');
    expect(html).toContain('/assets/process/evolution/mature.webp');
    expect(html).toContain('Ask anyone for the most beautiful place they have ever stood in');
    expect(html).toContain('None of them finished. All of them alive.');
    expect(html).toContain('/assets/gallery/week-3/flowering-bower-morning-mist.webp');
    expect(html).toContain('A living room in the landscape · Concept visualisation');
    expect(html).not.toContain('Built to be unfinished.');
    expect(html).toContain('The garden continues the architecture.');
    expect(html).not.toContain('The garden takes it from here.');
    expect(html).toContain('aria-label="The same Bower from year zero to year three"');
    expect(html).toContain('A lattice');
    expect(html).toContain('Leaves in the weave');
    expect(html).toContain('A room of blossom and eaves');
    expect(html).toContain('h-[320svh]');
    expect(html).toContain('data-growth-progress');
    expect(html).not.toContain('/assets/gallery/favorites/living-bower-interior.webp');
    expect(html).not.toContain('/assets/gallery/favorites/english-garden-path.webp');
    expect(html).not.toContain('A Bower begins as a woven, load-bearing timber lattice.');
    expect(html).toContain('Five acts of making.');
    expect(html.indexOf('The garden continues the architecture.')).toBeLessThan(html.indexOf('Five acts of making.'));
    expect(html.lastIndexOf('/assets/process/evolution/mature.webp')).toBeLessThan(html.indexOf('Five acts of making.'));
    expect(html).toContain('/assets/gallery/week-3/landscape-room-at-dawn.webp');
    expect(html.indexOf('/assets/gallery/week-3/landscape-room-at-dawn.webp')).toBeGreaterThan(html.indexOf('Five acts of making.'));
    expect(html).toContain('Every landscape asks for a different answer.');
    expect(html.match(/data-snap-section/g)).toHaveLength(6);
  });

  it('uses the shared editorial navigation and ends with the quiet footer', () => {
    expect(html).toContain('href="/gallery"');
    expect(html).toContain('href="/about/practice"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('Introduce yours →');
    expect(html).not.toContain('nav-pill');
  });
});
