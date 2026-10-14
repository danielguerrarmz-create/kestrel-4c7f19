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
    expect(html).not.toContain('Living architecture for significant landscapes.');
    expect(html).not.toContain('mailto:');
    expect(html).toContain(`aria-label="© ${year} Bower, home"`);
    expect(html).toContain('Bower. All rights reserved.');
    expect(html).toContain('/assets/brand/bower-logo-evergreen-horizontal-transparent.png');
    expect(html).toContain('site-footer-logo');
  });

  it('keeps the four requested secondary doors in the footer', () => {
    expect(html).toContain('href="/press"');
    expect(html).toContain('>Press</a>');
    expect(html).toContain('href="/questions"');
    expect(html).toContain('>Questions</a>');
    expect(html).toContain('href="/gallery"');
    expect(html).toContain('>Works</a>');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('>Contact</a>');
    for (const href of ['/commissions', '/process', '/about']) {
      expect(html).not.toContain(`href="${href}"`);
    }
  });
});
