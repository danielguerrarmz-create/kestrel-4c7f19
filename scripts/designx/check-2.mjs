/** Edition 02: verify the audience's interactions and inspect all 16 compositions. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect } from '@playwright/test';
import { openBrowser, waitForDeck, inspectSlides, ROOT } from './browser.mjs';

const url = process.env.DESIGNX_V2_URL ?? 'http://127.0.0.1:5333/designx/2';
const output = resolve(ROOT, 'qa-out/designx/edition-02');
await mkdir(output, { recursive: true });
const browser = await openBrowser();
const page = await browser.newPage({ viewport: { width: 1600, height: 1020 } });
const errors = [];
const checks = [];
const screenshots = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const go = async number => {
  await page.evaluate(n => window.DESIGNX.goTo(n), number);
  await expect(page.locator(`#slide-${String(number).padStart(2, '0')}`)).toHaveAttribute('aria-hidden', 'false');
};
const sceneNumber = theme => page.evaluate(value => window.DESIGNX_SLIDES.findIndex(slide => slide.theme.split(' ').includes(value)) + 1, theme);
const goTheme = async theme => go(await sceneNumber(theme));
const check = async (name, action) => {
  await action();
  checks.push(name);
  console.log(`PASS ${name}`);
};

try {
  await page.goto(url);
  await waitForDeck(page);
  await check('Edition route, local brand, typography and 16 shared scenes', async () => {
    assert.equal(await page.locator('.slide').count(), 16);
    await expect(page.locator('body')).toHaveClass(/designx-v2/);
    assert.equal(await page.locator('.brand-emblem').count(), 3);
    const heading = await page.locator('h1').evaluate(el => ({ font: getComputedStyle(el).fontFamily, weight: Number(getComputedStyle(el).fontWeight) }));
    assert.match(heading.font, /Helvetica Neue/);
    assert(heading.weight >= 700);
    assert.equal(await page.locator('[data-customer-film]').getAttribute('src'), null);
  });
  await check('Scroll advances once per gesture and respects the slide index dialog', async () => {
    await page.waitForTimeout(700);
    await page.mouse.move(800, 450);
    await page.mouse.wheel(0, 100);
    await expect.poll(() => page.evaluate(() => window.DESIGNX.current)).toBe(2);
    await page.mouse.wheel(0, 100);
    assert.equal(await page.evaluate(() => window.DESIGNX.current), 2);
    for (let pulse = 0; pulse < 9; pulse++) {
      await page.waitForTimeout(100);
      await page.mouse.wheel(0, 90);
    }
    assert.equal(await page.evaluate(() => window.DESIGNX.current), 2, 'long trackpad inertia must not skip slides');
    await page.getByRole('button', { name: 'Open slide index', exact: true }).click();
    await page.mouse.wheel(0, 500);
    assert.equal(await page.evaluate(() => window.DESIGNX.current), 2);
    await page.getByRole('button', { name: 'Close slide index', exact: true }).click();
  });
  await check('The first film play works before any scrubbing', async () => {
    const fresh = await browser.newPage();
    await fresh.goto(`${url}#slide-${String(await sceneNumber('buyers-slide')).padStart(2, '0')}`);
    await waitForDeck(fresh);
    const film = fresh.locator('[data-customer-film]');
    assert.equal(await film.getAttribute('src'), null);
    await fresh.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => film.evaluate(el => el.currentTime), { timeout: 15000 }).toBeGreaterThan(0.2);
    assert.equal(await film.evaluate(el => el.paused), false);
    await fresh.close();
  });
  await check('Growth is scroll-controlled, with deliberate playback and keyboard escape', async () => {
    await go(3);
    await expect(page.locator('.time-scene')).toHaveAttribute('data-time-playing', 'false');
    await page.waitForTimeout(700);
    await page.mouse.move(900, 450);
    await page.mouse.wheel(0, 240);
    await expect.poll(() => page.locator('[data-time-scrub]').inputValue().then(Number)).toBeGreaterThan(0);
    assert.equal(await page.evaluate(() => window.DESIGNX.current), 3);
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.evaluate(() => window.DESIGNX.current), 4);
  });
  await check('Film remains lazy, then supports seeking, normal play and offscreen pause', async () => {
    await goTheme('buyers-slide');
    const film = page.locator('[data-customer-film]');
    assert.equal(await film.getAttribute('src'), null);
    await page.locator('.buyer-triptych figure').last().hover();
    await page.locator('#v2-film-position').fill('65');
    await expect.poll(() => film.evaluate(el => el.currentTime), { timeout: 15000 }).toBeGreaterThan(4);
    assert.equal(await film.evaluate(el => el.paused), true);
    await page.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => film.evaluate(el => el.paused)).toBe(false);
    await goTheme('variability-slide');
    assert.equal(await film.evaluate(el => el.paused), true);
    await goTheme('buyers-slide');
    await page.waitForTimeout(700);
    await page.locator('.buyer-triptych figure').last().hover({ position: { x: 200, y: 300 } });
    const before = Number(await page.locator('#v2-film-position').inputValue());
    await page.mouse.wheel(0, -120);
    await expect.poll(() => page.locator('#v2-film-position').inputValue().then(Number)).toBeLessThan(before);
    assert.equal(await page.evaluate(() => window.DESIGNX.current), await sceneNumber('buyers-slide'));
    await page.locator('#v2-film-position').fill('100');
    await expect.poll(() => film.evaluate(el => el.duration - el.currentTime)).toBeLessThan(0.1);
    await page.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => film.evaluate(el => el.paused)).toBe(false);
    assert(await film.evaluate(el => el.currentTime < 1), 'Play after the scrub endpoint must restart the film');
  });
  await check('Flywheels and coupling remain interactive', async () => {
    await goTheme('learning-slide');
    const nodes = page.locator('.learning-slide .fw-node');
    await nodes.nth(2).click();
    await expect(nodes.nth(2)).toHaveAttribute('aria-pressed', 'true');
    await go(13);
    const coupling = page.locator('#slide-13 input[type=range]');
    await coupling.fill('100');
    await expect(coupling).toHaveValue('100');
  });
  await check('Reduced motion disables continuous scroll scrubbing and automatic motion', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go(3);
    await expect(page.locator('.time-scene')).toHaveAttribute('data-time-playing', 'false');
    await page.waitForTimeout(700);
    await page.mouse.move(900, 450);
    await page.mouse.wheel(0, 100);
    await expect.poll(() => page.evaluate(() => window.DESIGNX.current)).toBe(4);
  });
  await check('All sixteen slides fit the canvas and load their images', async () => {
    for (let number = 1; number <= 16; number++) {
      await go(number);
      await waitForDeck(page);
      const active = page.locator('.slide.is-active');
      const metrics = (await inspectSlides(page)).find(s => s.id === `slide-${String(number).padStart(2, '0')}`);
      assert.deepEqual(metrics.overflow, [], `${metrics.id} has clipped text`);
      const imagePath = resolve(output, `slide-${String(number).padStart(2, '0')}.png`);
      await active.screenshot({ path: imagePath });
      screenshots.push(imagePath);
    }
  });
  await check('Mobile, tablet and widescreen keep the stage and navigation in view', async () => {
    for (const [width, height] of [[390, 844], [844, 390], [768, 1024], [1920, 1080]]) {
      await page.setViewportSize({ width, height });
      await go(1);
      await expect.poll(async () => {
        const box = await page.locator('#deck').boundingBox();
        return box.x >= -1 && box.y >= -1 && box.x + box.width <= width + 1 && box.y + box.height <= height + 1;
      }).toBe(true);
      const controls = await page.locator('.viewer-controls').boundingBox();
      assert(controls.y >= 0 && controls.y + controls.height <= height);
      await page.screenshot({ path: resolve(output, `viewport-${width}x${height}.png`) });
    }
  });
  await check('The original edition and original PDF are unchanged', async () => {
    const original = await browser.newPage();
    await original.goto(new URL('/designx', url).href);
    await waitForDeck(original);
    assert.equal(await original.locator('.designx-v2').count(), 0);
    const response = await original.request.get(new URL('/designx/pdf', url).href);
    assert.equal(response.headers()['content-type'], 'application/pdf');
    assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-');
    await original.close();
  });
  assert.deepEqual(errors, [], 'Browser resources and scripts must load without errors');
  await writeFile(resolve(output, 'check.json'), JSON.stringify({ url, checks, errors, screenshots }, null, 2));
  console.log(`${checks.length} edition checks passed.`);
} finally {
  await browser.close();
}
