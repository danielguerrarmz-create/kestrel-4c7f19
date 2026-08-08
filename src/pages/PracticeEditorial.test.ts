import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PracticeEditorial } from './PracticeEditorial';

describe('PracticeEditorial', () => {
  it('renders the Plentify growth loop as the animated GIF', () => {
    const html = renderToStaticMarkup(createElement(PracticeEditorial));

    expect(html).toContain('src="/assets/projects/01-synergy/synergy-cosmos-growth-loop.gif"');
  });
});
