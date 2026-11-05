import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TechPage } from './TechPage';
import { chapters } from './tech/content';
import { resolveRoute, PUBLIC_ROUTES } from '../routing';
import { metaForPath } from '../seo';

const html = renderToString(createElement(TechPage));
describe('Bower technology page', () => {
  it('ships as a public page while the interactive engine stays private', () => {
    expect(PUBLIC_ROUTES).toContain('/tech');
    expect(metaForPath('/tech').path).toBe('/tech');
    expect(resolveRoute('/tech', false)).toBe('tech');
    expect(resolveRoute('/engine', false)).toBe('splash');
  });
  it('keeps every chapter and local media source available', () => {
    expect(chapters).toHaveLength(6);
    for (const chapter of chapters) expect(html).toContain(`id="${chapter.id}"`);
    for (const [,src] of html.matchAll(/(?:src|poster)="(\/assets\/[^" ]+)"/g)) {
      expect(existsSync(resolve('public', src.slice(1))), src).toBe(true);
    }
  });
  it('retains the study revisions, open checks and unsolved analysis', () => {
    expect(html).toContain('15 September 2026');
    expect(html).toContain('57 still to reconcile');
    expect(html).toContain('None of the load cases has been solved yet.');
    expect(html).toContain('assigns no density or design mass');
    expect(html).not.toContain('id="growth"');
    expect(html).not.toContain('id="garden"');
    expect(html).not.toContain('What stays open for the engineer');
    expect(html).not.toContain('class="tech-label"');
    expect(html).toContain('Technology at Bower</h1>');
    expect(html).toContain('Pause assembly study');
    expect(html).not.toContain('autoplay=""');
  });
});
