import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PracticeEditorial } from './PracticeEditorial';
import { PracticePage } from './PracticePage';
import { PROJECTS } from './about/projects';

describe('PracticeEditorial', () => {
  it('renders the Plentify growth loop as the animated GIF', () => {
    const html = renderToStaticMarkup(createElement(PracticePage));

    expect(html).toContain('src="/assets/projects/01-synergy/synergy-cosmos-growth-loop.gif"');
  });

  it('keeps all timeline images in four year chapters and dates Robotic Factory to 2025', () => {
    const html = renderToStaticMarkup(createElement(PracticeEditorial));
    const groups = html.split('class="milestone-record"').slice(1);
    expect(groups).toHaveLength(4);
    expect(groups.map(group => group.split('</article>')[0].match(/<figure /g)?.length)).toEqual([2,2,8,2]);
    expect(html).toContain('2025 · </span>Robotic Factory');
  });

  it('provides four images per project and removes the lesson blocks', () => {
    for (const project of PROJECTS) expect(project.images.filter(image => !image.pending)).toHaveLength(4);
    expect(renderToStaticMarkup(createElement(PracticePage))).not.toContain('What we learned');
  });

  it('explains how a project-specific delivery team is assembled', () => {
    const html = renderToStaticMarkup(createElement(PracticeEditorial));

    expect(html).toContain('We are forming the specialist partnerships');
    expect(html).toContain('first permanent works');
    for (const discipline of ['Engineering', 'Fabrication', 'Landscape', 'Planning']) {
      expect(html).toContain(discipline);
    }
  });
});
