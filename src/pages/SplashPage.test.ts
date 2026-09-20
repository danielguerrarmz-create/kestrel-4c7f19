import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { PUBLIC_ROUTES, routes } from '../routing';
import { SplashPage, studies } from './SplashPage';
const html = renderToString(createElement(SplashPage)).replace(/<!-- -->/g, '');
describe('Bower homepage', () => {
  it('keeps the opening skippable and the gallery accessible without playing motion', () => {
    expect(html).toContain('Skip to gallery');
    expect(html).toContain('Enter the world of Bower');
    expect(html).toContain('aria-labelledby="gallery-title"');
    expect(html).toContain('aria-labelledby="study-title"');
  });
  it('identifies the company and the status of the work', () => {
    expect(html).toContain('building technology company');
    expect(html).toContain('not photographs of completed buildings');
    expect(html).toContain('Founded in 2026');
    expect(html).toContain('partnerships for the first permanent works are forming');
    expect(html).not.toMatch(/guaranteed|production-ready|architect<|ROI/);
  });
  it('keeps navigation public and Contact primary', () => {
    const primary = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    expect(primary).toContain('Contact Bower');
    expect(primary).toContain(`href="${routes.contact}"`);
    for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) expect([...PUBLIC_ROUTES]).toContain(match[1]);
  });
  it('uses available current study images', () => {
    for (const [slug] of studies) expect(existsSync(`public/assets/studies/${slug}.webp`)).toBe(true);
  });
});
