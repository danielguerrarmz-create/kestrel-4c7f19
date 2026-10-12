import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PracticeEditorial } from './PracticeEditorial';

describe('PracticeEditorial', () => {
  const html = renderToStaticMarkup(createElement(PracticeEditorial));

  it('focuses on the two founders', () => {
    expect(html).toContain('Clay Seifert');
    expect(html).toContain('Daniel Guerra');
    expect(html).toContain('/assets/about/clay-seifert.jpg');
    expect(html).toContain('/assets/about/daniel-guerra.jpg');
  });

  it('states the mission as a clear operating promise', () => {
    expect(html).toContain('Our mission');
    expect(html).toContain('One Bower team,');
    expect(html).toContain('assembled for');
    expect(html).toContain('one place.');
    expect(html).toContain('Consent strategy and project-specific advice');
    expect(html).not.toContain('Where we come from');
  });

  it('omits the project archive, timeline and credential wall', () => {
    for (const removed of ['Projects &amp; research', 'Robotic Factory', 'Archipedia', 'Published', '2022', '2023', '2024', '2025']) {
      expect(html).not.toContain(removed);
    }
  });
});
