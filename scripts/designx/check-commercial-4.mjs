/** Edition 04 commercial loop: one illustrated visual for each controller phase. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect } from '@playwright/test';
import { openBrowser, inspectSlides, printUrl, ROOT, waitForDeck } from './browser.mjs';

const url = process.env.DESIGNX_V4_URL ?? 'http://127.0.0.1:5333/designx/4';
const output = resolve(ROOT, 'qa-out/designx/edition-04/commercial');
await mkdir(output, { recursive: true });
const browser = await openBrowser();
const page = await browser.newPage({ viewport: { width: 1600, height: 1020 } });
const errors = [];
const checks = [];
const screenshots = [];
const observe = target => {
  target.on('pageerror', error => errors.push(error.message));
  target.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
};
observe(page);
const check = async (name, action) => { await action(); checks.push(name); console.log(`PASS ${name}`); };
let slideNumber;
const scene = page.locator('.fw-commercial');
const nodes = scene.locator('[data-fw-step]');
const active = scene.locator('.v4-commercial-state.is-current');
const go = number => page.evaluate(value => window.DESIGNX.goTo(value), number);
const assertPhase = async phase => {
  await expect(scene).toHaveAttribute('data-fw-phase', String(phase));
  await expect(active).toHaveCount(1);
  await expect(active).toHaveAttribute('data-commercial-state', String(phase));
  await expect(active).toHaveAttribute('aria-hidden', 'false');
  await expect(active).toBeVisible();
  await expect.poll(() => active.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await expect.poll(() => active.evaluate(el => getComputedStyle(el).transform)).toBe('none');
  assert.deepEqual(await scene.locator('.v4-commercial-state').evaluateAll(states => states.map(el => el.getAttribute('aria-hidden'))), Array.from({ length: 6 }, (_, index) => String(index !== phase)));
};
const screenshot = async name => {
  const path = resolve(output, name);
  await page.locator('.commercial-loop-slide').screenshot({ path });
  screenshots.push(path);
};

try {
  const response = await page.goto(url);
  assert.equal(response.status(), 200);
  await waitForDeck(page);
  slideNumber = await page.evaluate(() => window.DESIGNX_SLIDES.findIndex(slide => slide.theme.split(' ').includes('commercial-loop-slide')) + 1);
  assert.equal(slideNumber, 11);
  await go(slideNumber);

  await check('Each of five clickable stages selects distinct art, caption and accessible content', async () => {
    await expect(scene.locator('.v4-commercial-state')).toHaveCount(6);
    await expect(nodes).toHaveCount(5);
    const definitions = await page.evaluate(() => window.DESIGNX4_COMMERCIAL_VISUALS.map(({ stage, caption, alt, markup }) => ({ stage, caption, alt, markup })));
    assert.equal(new Set(definitions.map(state => state.caption)).size, 6);
    assert.equal(new Set(definitions.map(state => state.markup)).size, 6);
    for (let index = 0; index < 5; index++) {
      await nodes.nth(index).click();
      await assertPhase(index);
      await expect(nodes.nth(index)).toHaveAttribute('aria-pressed', 'true');
      await expect(active.locator('figcaption')).toHaveText(definitions[index].caption);
      await expect(active).toHaveAttribute('aria-label', definitions[index].alt);
      assert.deepEqual((await inspectSlides(page)).find(slide => slide.id === 'slide-11').overflow, []);
      await screenshot(`phase-${index}-${definitions[index].stage.toLowerCase()}.png`);
    }
    await nodes.nth(4).press('End');
    await assertPhase(5);
    assert.equal(await page.evaluate(() => window.DESIGNX.current), slideNumber, 'End belongs to the loop, not the deck');
    await expect(active.locator('figcaption')).toHaveText(definitions[5].caption);
    await screenshot('phase-5-next-cycle.png');
  });

  await check('Playback updates the same visual state and stops when the slide is left', async () => {
    await nodes.nth(4).press('Home');
    await assertPhase(0);
    await scene.locator('[data-fw-play]').click();
    await expect(scene).toHaveAttribute('data-fw-playing', 'true');
    await expect.poll(() => scene.getAttribute('data-fw-phase'), { timeout: 5000 }).toBe('1');
    await assertPhase(1);
    await go(slideNumber + 1);
    await expect(scene).toHaveAttribute('data-fw-playing', 'false');
    const pausedPhase = await scene.getAttribute('data-fw-phase');
    await page.waitForTimeout(2500);
    assert.equal(await scene.getAttribute('data-fw-phase'), pausedPhase);
    await go(slideNumber);
    await scene.locator('[data-fw-play]').click();
    await expect.poll(() => scene.getAttribute('data-fw-phase'), { timeout: 5000 }).toBe('2');
    await assertPhase(2);
    await scene.locator('[data-fw-play]').click();
    await expect(scene).toHaveAttribute('data-fw-playing', 'false');
  });

  await check('Reduced motion still permits deliberate stage selection without automatic advance', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await assertPhase(5);
    for (const phase of [0, 3, 4]) {
      await nodes.nth(phase).click();
      await assertPhase(phase);
      assert.equal(await active.evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    }
    await expect(scene).toHaveAttribute('data-fw-playing', 'false');
    await page.waitForTimeout(2500);
    await assertPhase(4);
  });

  await check('Both phone orientations preserve the loop, current illustration and controls', async () => {
    for (const [width, height] of [[390, 844], [844, 390]]) {
      await page.setViewportSize({ width, height });
      await nodes.nth(3).click();
      await assertPhase(3);
      const deck = await page.locator('#deck').boundingBox();
      assert(deck.x >= -1 && deck.y >= -1 && deck.x + deck.width <= width + 1 && deck.y + deck.height <= height + 1);
      const illustration = await active.boundingBox();
      assert(illustration.x >= deck.x - 1 && illustration.y >= deck.y - 1 && illustration.x + illustration.width <= deck.x + deck.width + 1 && illustration.y + illustration.height <= deck.y + deck.height + 1);
      const controls = await page.locator('.viewer-controls').boundingBox();
      assert(controls.y >= 0 && controls.y + controls.height <= height + 1);
      await page.screenshot({ path: resolve(output, `viewport-${width}x${height}.png`) });
    }
  });

  await check('Print exposes all five stages as a static visual sequence without the old orbit', async () => {
    const print = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
    observe(print);
    await print.goto(printUrl(url));
    await print.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
    await waitForDeck(print);
    const slide = print.locator('.commercial-loop-slide');
    await expect(slide.locator('.v4-commercial-print')).toBeVisible();
    await expect(slide.locator('.v4-commercial-print>figure')).toHaveCount(5);
    for (const figure of await slide.locator('.v4-commercial-print>figure').all()) await expect(figure).toBeVisible();
    await expect(slide.locator('.fw-orbit')).toBeHidden();
    await expect(slide.locator('.fw-readout')).toBeHidden();
    await expect(slide.locator('.fw-static-summary')).toBeHidden();
    assert.deepEqual((await inspectSlides(print)).find(slide => slide.id === 'slide-11').overflow, []);
    const artStyles = await slide.locator('.v4-commercial-print-art').evaluateAll(art => art.map(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })));
    assert(artStyles.every(art => art.width > 200 && art.height > 150));
    await slide.screenshot({ path: resolve(output, 'print-commercial.png') });
    await print.close();
  });

  assert.deepEqual(errors, [], 'Commercial visuals and their inherited concept image must load without errors');
  await writeFile(resolve(output, 'check.json'), JSON.stringify({ url, slideNumber, checks, errors, screenshots }, null, 2));
  console.log(`${checks.length} commercial visual checks passed.`);
} finally { await browser.close(); }
