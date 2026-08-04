import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

const html = renderToString(createElement(Footer));

describe('Footer', () => {
  it('links both brand signatures to the homepage', () => {
    const year = new Date().getFullYear();
    expect(html).toContain('aria-label="Bower, home"');
    expect(html).toContain(`aria-label="© ${year} Bower, home"`);
    expect(html.match(/href="\/"/g)).toHaveLength(2);
  });
});
