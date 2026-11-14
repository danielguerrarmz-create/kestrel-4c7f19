/** Edition 07: plantability story, conceptual controls, stable factory and static export. */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { expect } from '@playwright/test';
import { openBrowser, waitForDeck, inspectSlides, assertPrintSlides, printUrl, ROOT } from './browser.mjs';

const url = process.env.DESIGNX_V7_URL ?? 'http://127.0.0.1:5333/designx/v7';
const beforeExport = process.argv.includes('--before-export');
if (process.argv.slice(2).some(argument => argument !== '--before-export')) throw new Error('Supported QA option: --before-export');
const output = resolve(ROOT, 'qa-out/designx/edition-07');
await mkdir(output, { recursive: true });
const errors = [], checks = [], screenshots = [];
const browser = await openBrowser();
const page = await browser.newPage({ viewport: { width: 1600, height: 1020 } });
const observe = target => {
  target.on('pageerror', error => errors.push(error.message));
  target.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
};
observe(page);
const check = async (name, action) => { await action(); checks.push(name); console.log(`PASS ${name}`); };
const go = async number => {
  await page.evaluate(value => window.DESIGNX.goTo(value), number);
  await expect(page.locator(`#slide-${String(number).padStart(2, '0')}`)).toHaveAttribute('aria-hidden', 'false');
};
const state = async viewer => {
  try { return await (await (await viewer.locator('iframe').first().elementHandle()).contentFrame()).evaluate(() => window.BOWER_FACTORY.getState()); }
  catch { return null; }
};
const screenshot = async name => {
  const path = resolve(output, name);
  await page.screenshot({ path, animations: 'disabled' }); screenshots.push(path);
};
const clickChoice = async (selector, outputSelector, expected) => {
  const choice = page.locator(selector), previousSlide = await page.evaluate(() => window.DESIGNX.current);
  await choice.click(); await expect(choice).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator(outputSelector)).toContainText(expected);
  await choice.focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(() => window.DESIGNX.current), previousSlide, 'A focused scene control must not advance the deck');
};

try {
  const response = await page.goto(url); assert.equal(response.status(), 200);
  await waitForDeck(page);
  await page.evaluate(() => window.DESIGNX_FACTORY_READY);
  await check('Seventeen scenes preserve the founder theses, evidence and honest development status', async () => {
    assert.equal(await page.evaluate(() => window.DESIGNX_META.edition), 7);
    await expect(page.locator('.slide')).toHaveCount(17);
    await expect(page.locator('[data-v7-scene]')).toHaveCount(4);
    await expect(page.locator('.slide .eyebrow, .slide .fw-eyebrow, .slide .running, .slide .time-running, .slide .fw-running')).toHaveCount(0);
    await expect(page.locator('.variability-slide blockquote')).toContainText('Variability is the essence of nature and the enemy of industry');
    await expect(page.locator('.closing-thesis')).toContainText('We mine, pour, and cut;');
    await expect(page.locator('.closing-thesis')).toContainText('the most severed from the living one');
    await expect(page.locator('.v7-computation')).toContainText('Proposed engine extension');
    await expect(page.locator('.v7-computation .v7-status')).toContainText('not implemented or validated');
    await expect(page.locator('.buyers-slide .source-note')).toContainText('Active conversations, not signed commissions');
    await expect(page.locator('.buyers-slide .prospect-logo')).toHaveCount(3);
    await expect(page.locator('.v7-study-link')).toHaveAttribute('href', 'https://www.bowerbuild.org/designx/6#slide-06');
    await expect(page.locator('#pdf-link')).toHaveAttribute('href', 'v7/pdf');
  });
  await check('Living-space and geometry choices change their argument without claiming a simulation', async () => {
    await go(4);
    await clickChoice('[data-v7-growth="1"]', '[data-v7-growth-line]', 'light we inhabit');
    await expect(page.locator('.v7-growth [data-v7-drawing]')).toContainText('filtered light');
    await expect(page.locator('.v7-growth .v7-title')).toHaveText('Plants make space.');
    await clickChoice('[data-v7-growth="2"]', '[data-v7-growth-line]', 'after installation');
    await expect(page.locator('.v7-growth [data-v7-growth][aria-pressed="true"]')).toHaveCount(1);
    await page.locator('[data-v7-growth="0"]').focus(); await page.keyboard.press('Enter');
    await expect(page.locator('[data-v7-growth="0"]')).toHaveAttribute('aria-pressed', 'true');
    await go(5);
    await clickChoice('[data-v7-intent="1"]', '[data-v7-response]', 'orientation and openings');
    await expect(page.locator('[data-v7-intention]')).toContainText('luminous planted canopy');
    await clickChoice('[data-v7-intent="2"]', '[data-v7-response]', 'clearance and access');
    await expect(page.locator('[data-v7-question]')).toContainText('over time');
    await expect(page.locator('[data-v7-intent][aria-pressed="true"]')).toHaveCount(1);
  });
  await check('Both kinds of nudge inform one geometry and biology changes the initial design', async () => {
    await go(6);
    await clickChoice('[data-v7-nudge="planting:0"]', '[data-v7-nudge-text]', 'support spacing');
    await expect(page.locator('[data-v7-nudge-label]')).toHaveText('Possible planting nudge');
    await clickChoice('[data-v7-nudge="planting:2"]', '[data-v7-nudge-text]', 'establish');
    await clickChoice('[data-v7-nudge="fabrication:1"]', '[data-v7-nudge-text]', 'connection can be made and checked');
    await expect(page.locator('[data-v7-nudge][aria-pressed="true"]')).toHaveCount(1);
    await go(9);
    const assembly = page.locator('.v7-learning-bower img');
    await expect(assembly).toBeVisible();
    await expect(assembly).toHaveAttribute('src', 'assets/assembly.webp');
    const assemblyBox = await assembly.boundingBox();
    await clickChoice('[data-v7-intelligence-select="biology"]', '[data-v7-learning-detail]', 'first geometry');
    await expect(page.locator('.v7-learning')).toHaveAttribute('data-v7-intelligence', 'biology');
    await expect(page.locator('[data-v7-model-layer="biology"]')).toBeVisible();
    await expect(page.locator('[data-v7-model-layer="geometry"]')).toBeHidden();
    await clickChoice('[data-v7-intelligence-select="fabrication"]', '[data-v7-learning-detail]', 'test new forms');
    await expect(page.locator('[data-v7-model-layer="fabrication"]')).toBeVisible();
    const fabricationBox = await assembly.boundingBox();
    for (const key of ['x', 'y', 'width', 'height']) assert(Math.abs(fabricationBox[key] - assemblyBox[key]) < 1, `Changing design concerns moved the model's ${key}`);
    await expect(page.locator('[data-v7-intelligence-select][aria-pressed="true"]')).toHaveCount(1);
    await page.locator('#show-notes').click();
    await expect(page.locator('#notes-content')).toContainText('not a one-way sequence');
    await page.locator('[data-close-dialog="speaker-notes"]').click();
    await expect(page.locator('[data-edition-six]')).toHaveAttribute('href', new URL('/designx/6#slide-09', url).href);
  });
  await check('Companion flow keeps both feedback timescales and the previous assembly scene', async () => {
    await go(10);
    const flow = page.locator('[data-v7-flow]');
    await expect(flow).toHaveAttribute('data-v7flow-mode', 'all');
    await expect(page.locator('#slide-09 .v7-learning-bower')).toHaveCount(1);
    const initialBox = await flow.boundingBox();
    const explanations = new Set();
    for (const mode of ['design', 'making', 'growing', 'cost', 'all']) {
      const button = page.locator(`[data-v7flow-select="${mode}"]`);
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(flow).toHaveAttribute('data-v7flow-mode', mode);
      explanations.add(await page.locator('[data-v7flow-readout]').textContent());
      await button.focus(); await page.keyboard.press('ArrowRight');
      assert.equal(await page.evaluate(() => window.DESIGNX.current), 10, 'Flow controls must not advance the deck');
      await button.click(); await button.blur();
      const box = await flow.boundingBox();
      for (const key of ['x', 'y', 'width', 'height']) assert(Math.abs(box[key] - initialBox[key]) < 1, `Flow mode moved ${key}`);
      await screenshot(`flow-${mode}.png`);
    }
    assert.equal(explanations.size, 5, 'Each path must explain its distinct information flow');
    await expect(page.locator('[data-v7flow-node="cost"]')).toBeVisible();
    await expect(page.locator('[data-v7flow-select][aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator('[data-edition-six]')).toHaveAttribute('href', new URL('/designx/6#slide-09', url).href);
    await go(11);
    await expect(page.locator('#slide-11')).toHaveClass(/buyers-slide/);
    await expect(page.locator('[data-edition-six]')).toHaveAttribute('href', new URL('/designx/6#slide-10', url).href);
  });
  await check('Factory station entry and re-entry restart inside the unchanged drawing frame', async () => {
    await go(7);
    const overview = page.locator('[data-factory-viewer="overview"]');
    const map = overview.frameLocator('[data-factory-surface] > iframe');
    await expect(map.locator('[data-factory-station]')).toHaveCount(14);
    const box = await overview.locator('[data-factory-surface]').boundingBox();
    for (let visit = 0; visit < 2; visit++) {
      await map.locator('[data-factory-station="05-press"] .factory-station-label').click();
      const dialog = page.locator('#factory-enlarged');
      await expect(dialog).toHaveClass(/factory-inline/);
      await expect(dialog.locator('iframe')).toBeVisible();
      await expect.poll(async () => (await state(dialog))?.playing).toBe(true);
      const current = await state(dialog); assert.equal(current.id, '05-press'); assert(current.time < 1.5, 'Station must restart');
      const actual = await dialog.locator('.factory-dialog-surface').boundingBox();
      for (const key of ['x', 'y', 'width', 'height']) assert(Math.abs(actual[key] - box[key]) < 1.5, `Factory ${key} changed`);
      await dialog.locator('[data-factory-seek]').fill('65');
      await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0);
    }
  });
  await check('Desktop and mobile keep every slide inside the fixed frame', async () => {
    for (const viewport of [{ width: 1600, height: 1020 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(viewport);
      await page.waitForFunction(() => document.querySelector('.deck-stage').getBoundingClientRect().width <= innerWidth);
      for (let number = 1; number <= 17; number++) {
        await go(number);
        const slide = (await inspectSlides(page))[number - 1];
        assert.equal(slide.overflow.length, 0, `${viewport.width}x${viewport.height} ${slide.id}: ${slide.overflow.join(' / ')}`);
        assert(Math.abs(slide.width / slide.height - 16 / 9) < .01, `${slide.id} aspect ratio changed`);
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        assert(scrollWidth <= viewport.width + 1, `${viewport.width}x${viewport.height} ${slide.id}: horizontal browser overflow to ${scrollWidth}px`);
        if (number === 14) {
          const title = await page.locator('.fw-coupled-title h2').boundingBox();
          const bridge = await page.locator('.mission-bridge').boundingBox();
          assert(title.y + title.height <= bridge.y + 1, `${viewport.width}x${viewport.height}: coupled title overlaps its bridge copy`);
        }
        if ([4, 5, 6, 9, 10, 12, 14].includes(number)) await screenshot(`viewport-${viewport.width}-${number}.png`);
      }
    }
  });
  await check('Reduced motion preserves all conceptual controls without autoplay', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload(); await waitForDeck(page);
    await expect(page.locator('body')).toHaveClass(/reduced-motion/);
    await go(4); await clickChoice('[data-v7-growth="1"]', '[data-v7-growth-line]', 'light we inhabit');
    await go(9); await clickChoice('[data-v7-intelligence-select="biology"]', '[data-v7-learning-detail]', 'first geometry');
    await go(10); await page.locator('[data-v7flow-select="growing"]').click();
    await expect(page.locator('[data-v7-flow]')).toHaveAttribute('data-v7flow-mode', 'growing');
    await page.locator('[data-v7flow-select="cost"]').click();
    await expect(page.locator('[data-v7-flow]')).toHaveAttribute('data-v7flow-mode', 'cost');
  });
  await check('Version 6 still loads its original scenes and factory integration', async () => {
    const previous = await browser.newPage(); observe(previous);
    await previous.goto(new URL('/designx/6', url).href); await waitForDeck(previous);
    assert.equal(await previous.evaluate(() => window.DESIGNX_META.edition), 6);
    await expect(previous.locator('.slide')).toHaveCount(16);
    await expect(previous.locator('[data-v7-scene]')).toHaveCount(0);
    await expect(previous.locator('.growth-slide')).toHaveCount(1);
    await expect(previous.locator('#v4-model-view')).toHaveCount(1);
    await previous.close();
  });
  await check('Print mode retains all seventeen compositions and a complete static argument', async () => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto(printUrl(url)); await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
    await waitForDeck(page);
    await page.evaluate(async () => { await window.DESIGNX_FACTORY_READY; await window.DESIGNX_FACTORY.preparePrint(); });
    const slides = await inspectSlides(page); assert.equal(slides.length, 17); assertPrintSlides(slides);
    for (const scene of ['growth', 'anatomy', 'computation', 'learning']) await expect(page.locator(`[data-v7-scene="${scene}"] .v7-print-summary`)).toBeVisible();
    for (const layer of ['geometry', 'fabrication', 'biology']) await expect(page.locator(`[data-v7-model-layer="${layer}"]`)).toBeVisible();
    await expect(page.locator('[data-v7-flow]')).toBeVisible();
    await expect(page.locator('[data-v7flow-select="all"]')).toBeHidden();
    await page.locator('[data-v7flow-select="growing"]').evaluate(button => button.click());
    const printedLayers = await page.locator('[data-v7flow-in]').evaluateAll(layers => layers.map(layer => getComputedStyle(layer).opacity));
    assert(printedLayers.every(opacity => opacity === '1'), 'Printing a selected path must retain the entire flow');
    for (const number of [4, 5, 6, 9, 10, 12, 14]) {
      const path = resolve(output, `print-${number}.png`); await page.locator(`#slide-${String(number).padStart(2, '0')}`).screenshot({ path, animations: 'disabled' }); screenshots.push(path);
    }
  });
  if (!beforeExport) await check('Both PDF aliases serve the matching exported document', async () => {
    const local = await readFile(resolve(ROOT, 'public/designx/v7/downloads/Bower_DesignX_Buildings_That_Grow_07.pdf'));
    const sha = bytes => createHash('sha256').update(bytes).digest('hex');
    for (const path of ['/designx/v7/pdf', '/designx/v7/pdf/']) {
      const response = await page.request.get(new URL(path, url).href);
      assert.equal(response.status(), 200); assert.match(response.headers()['content-type'], /application\/pdf/);
      assert.equal(sha(await response.body()), sha(local));
    }
  });
  assert.deepEqual(errors, [], 'Browser errors or missing resources');
  await writeFile(resolve(output, 'check-report.json'), JSON.stringify({ url, checks, errors, screenshots, beforeExport }, null, 2));
  console.log(`PASS ${checks.length} edition-07 check groups`);
} finally { await browser.close(); }
