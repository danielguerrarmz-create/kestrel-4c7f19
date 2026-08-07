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
    expect(html).toContain('Built to be unfinished.');
    expect(html).toContain('A Bower begins as a woven, load-bearing timber lattice.');
    expect(html).toContain('until structure and garden become one.');
    expect(html).toContain('A lattice');
    expect(html).toContain('Leaves in the weave');
    expect(html).toContain('A room of blossom and eaves');
    expect(html).toContain('Five acts of making.');
    expect(html.match(/data-snap-section/g)).toHaveLength(5);
    expect(html).toContain('md:h-[clamp(10rem,33svh,20rem)]');
  });

  it('uses the shared editorial navigation and ends in an enquiry', () => {
    expect(html).toContain('href="/gallery"');
    expect(html).toContain('href="/about/practice"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('Introduce yours →');
    expect(html).not.toContain('nav-pill');
  });
});
