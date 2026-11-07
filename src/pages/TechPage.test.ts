import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TechPage } from './TechPage';
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
  it('keeps local media and in-page navigation available', () => {
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
      expect(html).toContain(`id="${id}"`);
    }
    for (const [,src] of html.matchAll(/(?:src|poster)="(\/assets\/[^" ]+)"/g)) {
      expect(existsSync(resolve('public', src.slice(1))), src).toBe(true);
    }
  });
  it('distinguishes historical evidence from current engine capabilities', () => {
    expect(html).toContain('concept visualisation');
    expect(html).toContain('Digital Assembly Study; September 2026');
    expect(html).toContain('September 2026');
    expect(html).toContain('current demo model');
    expect(html).toContain('engineering review must establish the production fit and capacity');
    // Superseded quantities must not become claims about the third engine.
    for (const stale of ['939', '12.651', '57 still to reconcile', 'None of the load cases has been solved yet.']) {
      expect(html).not.toContain(stale);
    }
  });
  it('opens with one muted looping film without playback controls', () => {
    expect(html.match(/<video /g)).toHaveLength(1);
    expect(html.indexOf('<video ')).toBeLessThan(html.indexOf('id="method"'));
    expect(html).not.toContain('Play assembly study');
    expect(html).not.toContain('study-film-control');
    expect(html).toContain('muted=""');
    expect(html).toContain('loop=""');
    expect(html).not.toContain('prototype-picker');
  });
  it('follows the public editorial house style', () => {
    expect(html).not.toMatch(/[—–]/);
    // Daniel's November 6 correction: no numbered overlines or development-status labels.
    const prose = html.replace(/<[^>]*>/g, ' ');
    expect(prose).not.toMatch(/\b0?\d\s*\/\s*[A-Za-z]/);
    for (const label of ['The next iteration', 'In development', 'Being extended', 'Still to establish', 'The decision loop', 'Inside the idea']) {
      expect(prose).not.toContain(label);
    }
    expect(html).not.toMatch(/class="[^"]*\b(?:eyebrow|kicker|overline)\b/);
  });
  it('shows every drawing and the qualifications without opening a selector or disclosure', () => {
    const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
    expect(main).not.toBe('');
    for (const source of ['bower-engine-one-perspective.webp', 'bower-engine-section-rib-to-arch.webp', 'bower-engine-section-foot.webp', 'bower-engine-section-rib-to-ring.webp', 'bower-engine-section-rib-crossing.webp']) {
      expect(main).toContain(`src="/assets/tech/${source}"`);
    }
    expect(main).not.toMatch(/<(?:details|summary)\b/);
    // Only the timber index is interactive; the detail drawings stay visible together.
    const beforeParts = main.split('id="parts"')[0];
    expect(beforeParts).not.toContain('aria-pressed');
    expect(main).not.toContain('Open drawing');
    expect(main).not.toContain('How it comes together');
    expect(main).toContain('We believe<br/>timber is limitless.');
    expect(main).not.toContain('Timber has');
    expect(main).not.toContain('bower-engine-one-plan.webp');
    expect(main).not.toContain('Begin a conversation</a>');
  });
  it('covers the portfolio subjects while distinguishing load setup from results', () => {
    for (const id of ['surface', 'stock', 'joint', 'foot', 'connections', 'checks', 'structure', 'loads']) {
      expect(html).toContain(`id="${id}"`);
    }
    expect(html).toContain('curves in two directions');
    expect(html).toContain('Species, grade, moisture');
    expect(html).toContain('inputs for further analysis and review');
    expect(html).toContain('Wind and uplift');
    expect(html).toContain('Snow, ice and time');
    expect(html).toContain('Individual timber geometry from Bower One R13');
  });
});
