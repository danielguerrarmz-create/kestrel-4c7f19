import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PracticeEditorial } from './PracticeEditorial';
import { TEAM } from './about/projects';

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

  it('uses the approved short biographies from before the October redesign', () => {
    expect(html).toContain('The obsession is old.');
    expect(html).toContain('How can architecture be grown, not only built?');
    for (const founder of TEAM) {
      expect(html).toContain(renderToStaticMarkup(createElement('p', { className: 'practice-minimal-role' }, founder.role)));
      const bio = founder.facts.find((fact) => fact.label === 'Built')!;
      expect(html).toContain(renderToStaticMarkup(createElement('p', { className: 'practice-minimal-founder-bio' }, bio.value)));
      for (const fact of founder.facts.filter((fact) => fact.label !== 'Built')) {
        expect(html).not.toContain(fact.value);
      }
    }
    expect(html).toContain('Founded and led Resia, a design technology company. Peer-reviewed research on architectural geometry.');
    expect(html).toContain('Projects at Forsite Studio from concept through permitting to construction on site.');
  });

  it('keeps the project archive and timeline out of the founders page', () => {
    for (const removed of ['Projects &amp; research', 'Robotic Factory', 'practice-timeline']) {
      expect(html).not.toContain(removed);
    }
  });
});
