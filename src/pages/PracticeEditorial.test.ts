import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PracticeEditorial } from './PracticeEditorial';

describe('PracticeEditorial', () => {
  it('renders the Plentify growth loop as the animated GIF', () => {
    const html = renderToStaticMarkup(createElement(PracticeEditorial));

    expect(html).toContain('src="/assets/projects/01-synergy/synergy-cosmos-growth-loop.gif"');
  });

  it('explains how a project-specific delivery team is assembled', () => {
    const html = renderToStaticMarkup(createElement(PracticeEditorial));

    expect(html).toContain('One Bower team, assembled for one place.');
    expect(html).toContain('Bower leads the commission');
    for (const discipline of ['Engineering', 'Fabrication', 'Landscape', 'Planning']) {
      expect(html).toContain(discipline);
    }
  });
});
