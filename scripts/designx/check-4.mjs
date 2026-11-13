/** Edition 04: embedded fonts, technical interactions, route isolation and print. */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect } from '@playwright/test';
import { openBrowser, waitForDeck, inspectSlides, printUrl, assertPrintSlides, ROOT } from './browser.mjs';

const url = process.env.DESIGNX_V4_URL ?? 'http://127.0.0.1:5333/designx/4';
const output = resolve(ROOT, 'qa-out/designx/edition-04');
const expectedCount = 15;
const beforeExport = process.argv.includes('--before-export');
if (process.argv.slice(2).some(argument => argument !== '--before-export')) throw new Error('Supported QA option: --before-export');
const errors = [];
const checks = [];
const screenshots = [];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const text = async locator => (await locator.innerText()).replace(/\s+/g, ' ').trim();
await mkdir(output, { recursive: true });
const browser = await openBrowser();
const page = await browser.newPage({ viewport: { width: 1600, height: 1020 } });
const observe = target => {
  target.on('pageerror', error => errors.push(error.message));
  target.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
};
observe(page);
const go = async number => {
  await page.evaluate(value => window.DESIGNX.goTo(value), number);
  await expect(page.locator(`#slide-${String(number).padStart(2, '0')}`)).toHaveAttribute('aria-hidden', 'false');
};
const goTheme = async theme => {
  const number = await page.evaluate(value => window.DESIGNX_SLIDES.findIndex(slide => slide.theme.split(' ').includes(value)) + 1, theme);
  assert(number > 0, `Missing scene ${theme}`);
  await go(number);
};
const check = async (name, action) => { await action(); checks.push(name); console.log(`PASS ${name}`); };

try {
  const response = await page.goto(url);
  assert.equal(response.status(), 200);
  await waitForDeck(page);
  await check('The new edition preserves all fifteen scenes and their evidence', async () => {
    await expect(page.locator('body')).toHaveClass(/designx-v4/);
    assert.equal(await page.evaluate(() => window.DESIGNX_META.edition), 4);
    assert.equal(await page.locator('.slide').count(), expectedCount);
    assert.equal(await page.locator('.slide .eyebrow, .slide .fw-eyebrow, .slide .running, .slide .time-running, .slide .fw-running').count(), 0);
    await go(3);
    assert.equal(await text(page.locator('.cover-title')), 'Buildings that grow. And the means to make many.');
    assert.match(await text(page.locator('.variability-slide blockquote')), /Variability is the essence of nature and the enemy of industry;/);
    assert.match(await text(page.locator('.closing-thesis')), /We mine, pour, and cut;/);
    assert.equal(await page.locator('.buyers-slide .prospect-logo img').count(), 3);
    assert.match(await text(page.locator('.buyers-slide .source-note')), /Active conversations, not signed commissions/);
    await expect(page.locator('.computation-slide')).toContainText(/in development/i);
    await expect(page.locator('.factory-slide')).toContainText(/in development/i);
    await go(1);
  });
  await check('Supplied font files load and the architectural and technical faces are distinct', async () => {
    const fonts = await page.evaluate(async () => {
      const supplied = [...document.fonts].filter(face => /Safiro|Argesta/.test(face.family));
      await Promise.all(supplied.map(face => face.load()));
      return supplied.map(face => ({ family: face.family.replaceAll('"', ''), weight: face.weight, style: face.style, status: face.status }));
    });
    for (const name of ['Safiro', 'Argesta Display', 'Argesta Headline', 'Argesta Text']) assert(fonts.some(face => face.family === name), `Missing supplied family ${name}`);
    assert(fonts.every(face => face.status === 'loaded'), 'Every declared supplied font must decode successfully');
    for (const weight of ['400', '500', '600', '700']) assert(fonts.some(face => face.family === 'Safiro' && face.weight === weight), `Missing Safiro ${weight}`);
    const cover = await page.locator('.cover-title h1').evaluate(el => ({ family: getComputedStyle(el).fontFamily, weight: getComputedStyle(el).fontWeight }));
    assert.match(cover.family, /Argesta Display/);
    assert.equal(cover.weight, '400');
    const technical = await page.locator('.computation-slide h2').evaluate(el => ({ family: getComputedStyle(el).fontFamily, weight: getComputedStyle(el).fontWeight }));
    assert.match(technical.family, /Safiro/);
    assert.equal(technical.weight, '700');
    assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).fontSynthesis), 'none');
    await writeFile(resolve(output, 'fonts.json'), JSON.stringify(fonts, null, 2));
  });
  await check('Slide navigation, growth and both flywheels remain interactive', async () => {
    await go(1);
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => page.evaluate(() => window.DESIGNX.current)).toBe(2);
    await page.getByRole('button', { name: 'Open slide index', exact: true }).click();
    await expect(page.locator('#slide-index')).toBeVisible();
    await page.getByRole('button', { name: 'Close slide index', exact: true }).click();
    await goTheme('computation-slide');
    const model = page.locator('#v4-model-view');
    const components = page.locator('.v4-model-switch button[data-model-view="components"]');
    const assembly = page.locator('.v4-model-switch button[data-model-view="assembly"]');
    await expect(model).toHaveAttribute('data-model-view', 'assembly');
    await components.click();
    await expect(model).toHaveAttribute('data-model-view', 'components');
    await expect(components).toHaveAttribute('aria-pressed', 'true');
    await expect(model.locator('.v4-model-components')).toHaveAttribute('aria-hidden', 'false');
    await expect(model.locator('.v4-model-components img')).toHaveCount(3);
    await page.screenshot({ path: resolve(output, 'engine-components.png') });
    await assembly.click();
    await expect(model).toHaveAttribute('data-model-view', 'assembly');
    await expect(assembly).toHaveAttribute('aria-pressed', 'true');
    await expect(model.locator('.v4-model-components')).toHaveAttribute('aria-hidden', 'true');
    await goTheme('growth-slide');
    await page.locator('[data-time-scrub]').fill('60');
    await expect(page.locator('[data-time-scrub]')).toHaveValue('60');
    await goTheme('learning-slide');
    await page.locator('.learning-slide .fw-node').nth(2).click();
    await expect(page.locator('.learning-slide .fw-node').nth(2)).toHaveAttribute('aria-pressed', 'true');
    await goTheme('commercial-loop-slide');
    await page.locator('.commercial-loop-slide .fw-node').nth(2).click();
    await expect(page.locator('.commercial-loop-slide .fw-node').nth(2)).toHaveAttribute('aria-pressed', 'true');
    await goTheme('coupled-slide');
    await page.locator('.coupled-slide input[type=range]').fill('100');
    await expect(page.locator('.coupled-slide input[type=range]')).toHaveValue('100');
  });
  await check('Customer film loads on request and pauses offscreen', async () => {
    await goTheme('buyers-slide');
    const film = page.locator('[data-customer-film]');
    assert.equal(await film.getAttribute('src'), null);
    await page.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => film.evaluate(el => el.currentTime), { timeout: 15000 }).toBeGreaterThan(0.2);
    await page.locator('#v2-film-position').fill('65');
    await expect.poll(() => film.evaluate(el => el.currentTime)).toBeGreaterThan(4);
    assert.equal(await film.evaluate(el => el.paused), true);
    await page.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => film.evaluate(el => el.paused)).toBe(false);
    await go(10);
    assert.equal(await film.evaluate(el => el.paused), true);
  });
  await check('Reduced motion stops automatic movement and all compositions fit', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go(1);
    assert(await page.locator('.material-problem-slide .opening-film').evaluate(el => {
      const style = getComputedStyle(el);
      return style.animationName === 'none' || style.animationPlayState === 'paused';
    }));
    for (let number = 1; number <= expectedCount; number++) {
      await go(number);
      await waitForDeck(page);
      const metrics = (await inspectSlides(page)).find(slide => slide.id === `slide-${String(number).padStart(2, '0')}`);
      assert.deepEqual(metrics.overflow, [], `${metrics.id} has clipped text`);
      const path = resolve(output, `slide-${String(number).padStart(2, '0')}.png`);
      await page.locator('.slide.is-active').screenshot({ path });
      screenshots.push(path);
    }
  });
  await check('Phone, landscape phone, tablet and widescreen fit the stage', async () => {
    for (const [width, height] of [[390, 844], [844, 390], [768, 1024], [1920, 1080]]) {
      await page.setViewportSize({ width, height });
      for (const number of [3, 6, 9]) {
        await go(number);
        const box = await page.locator('#deck').boundingBox();
        assert(box.x >= -1 && box.y >= -1 && box.x + box.width <= width + 1 && box.y + box.height <= height + 1);
        const controls = await page.locator('.viewer-controls').boundingBox();
        assert(controls.y >= 0 && controls.y + controls.height <= height);
        await page.screenshot({ path: resolve(output, `viewport-${width}x${height}-slide-${number}.png`) });
      }
    }
  });
  await check('Print mode retains fifteen complete static compositions and embeds the new faces', async () => {
    const print = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
    observe(print);
    await print.goto(printUrl(url));
    await print.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
    await waitForDeck(print);
    assert.equal(await print.locator('.slide').count(), expectedCount);
    assertPrintSlides(await inspectSlides(print));
    await expect(print.locator('.viewer-controls')).toBeHidden();
    for (const number of [3, 6, 9, 15]) await print.locator(`#slide-${String(number).padStart(2, '0')}`).screenshot({ path: resolve(output, `print-${number}.png`) });
    assert.match(await print.locator('.cover-title h1').evaluate(el => getComputedStyle(el).fontFamily), /Argesta Display/);
    assert.match(await print.locator('.computation-slide h2').evaluate(el => getComputedStyle(el).fontFamily), /Safiro/);
    await print.close();
  });
  await check('Earlier editions retain their own typography and scene counts', async () => {
    const prior = await browser.newPage();
    observe(prior);
    for (const [path, count] of [['/designx', 16], ['/designx/2', 16], ['/designx/3', 15]]) {
      await prior.goto(new URL(path, url).href);
      await waitForDeck(prior);
      assert.equal(await prior.locator('.slide').count(), count);
      assert.equal(await prior.locator('.designx-v4').count(), 0);
      assert(!await prior.locator('.cover-title h1').evaluate(el => /Argesta|Safiro/.test(getComputedStyle(el).fontFamily)));
    }
    await prior.close();
  });
  await check('The PDF aliases, comparison links, deep links and offline edition stay scoped to 04', async () => {
    assert.match(await page.locator('#pdf-link').evaluate(el => el.href), /\/designx\/4\/pdf$/);
    assert.match(await page.locator('[data-edition-three]').evaluate(el => el.href), /\/designx\/3(?:#|$)/);
    if (!beforeExport) {
      const pdf = await readFile(resolve(ROOT, 'public/designx/4/downloads/Bower_DesignX_Buildings_That_Grow_04.pdf'));
      for (const path of ['/designx/4/pdf', '/designx/4/pdf/']) {
        const response = await page.request.get(new URL(path, url).href);
        assert.equal(response.status(), 200);
        assert.match(response.headers()['content-type'], /application\/pdf/);
        assert.match(response.headers()['content-disposition'], /^inline;.*Bower_DesignX_Buildings_That_Grow_04\.pdf/);
        assert.equal(sha256(await response.body()), sha256(pdf));
      }
    }
    const alternate = await browser.newPage();
    observe(alternate);
    await alternate.goto(new URL('/designx/4/?from=qa#slide-03', url).href);
    await waitForDeck(alternate);
    assert.equal(await alternate.evaluate(() => window.DESIGNX.current), 3);
    assert.equal(await alternate.evaluate(() => window.DESIGNX_META.edition), 4);
    await alternate.goto(pathToFileURL(resolve(ROOT, 'public/designx/4/index.html')).href);
    await waitForDeck(alternate);
    assert.equal(await alternate.locator('#pdf-link').evaluate(el => el.href), pathToFileURL(resolve(ROOT, 'public/designx/4/downloads/Bower_DesignX_Buildings_That_Grow_04.pdf')).href);
    await alternate.close();
  });
  assert.deepEqual(errors, [], 'All presentation scripts, images and fonts must load without errors');
  await writeFile(resolve(output, 'check.json'), JSON.stringify({ url, beforeExport, checks, errors, screenshots }, null, 2));
  console.log(`${checks.length} edition 04 checks passed.`);
} finally { await browser.close(); }
