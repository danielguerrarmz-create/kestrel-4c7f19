/** Edition 05: Daniel's live factory drawings, their lifecycle, routes and static export. */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect } from '@playwright/test';
import { openBrowser, waitForDeck, inspectSlides, printUrl, assertPrintSlides, ROOT } from './browser.mjs';

const url = process.env.DESIGNX_V5_URL ?? 'http://127.0.0.1:5333/designx/5';
const output = resolve(ROOT, 'qa-out/designx/edition-05');
const expectedCount = 16;
const beforeExport = process.argv.includes('--before-export');
const printOnly = process.argv.includes('--print-only');
const explorerOnly = process.argv.includes('--explorer-only');
if (process.argv.slice(2).some(argument => !['--before-export', '--print-only', '--explorer-only'].includes(argument))) throw new Error('Supported QA options: --before-export, --print-only, --explorer-only');
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
const waitForFactory = async target => {
  await target.waitForFunction(() => typeof window.DESIGNX_FACTORY_READY !== 'undefined');
  await target.evaluate(async () => { await window.DESIGNX_FACTORY_READY; await document.fonts.ready; });
};
const go = async number => {
  await page.evaluate(value => window.DESIGNX.goTo(value), number);
  await expect(page.locator(`#slide-${String(number).padStart(2, '0')}`)).toHaveAttribute('aria-hidden', 'false');
};
const goTheme = async theme => {
  const number = await page.evaluate(value => window.DESIGNX_SLIDES.findIndex(slide => slide.theme.split(' ').includes(value)) + 1, theme);
  assert(number > 0, `Missing scene ${theme}`);
  await go(number);
};
const check = async (name, action) => {
  if (printOnly && !name.startsWith('Print mode')) return;
  if (explorerOnly && !/^(Factory|Print mode|PDF aliases)/.test(name)) return;
  await action(); checks.push(name); console.log(`PASS ${name}`);
};
const factoryState = async viewer => {
  try {
    const element = await viewer.locator('iframe').elementHandle();
    const frame = await element?.contentFrame();
    return frame ? await frame.evaluate(() => window.BOWER_FACTORY?.getState()) : null;
  } catch { return null; }
};
const selectDrawing = async (viewer, id) => {
  await viewer.locator(`[data-factory-id="${id}"]`).click();
  await expect.poll(async () => (await factoryState(viewer))?.id).toBe(id);
  await expect.poll(async () => (await factoryState(viewer))?.ready).toBe(true);
};
const openStation = async (target, viewer, id) => {
  await viewer.frameLocator('iframe').locator(`[data-factory-station="${id}"]`).click();
  const dialog = target.locator('#factory-enlarged');
  await expect(dialog).toBeVisible();
  await expect.poll(async () => (await factoryState(dialog))?.id).toBe(id);
  await expect.poll(async () => (await factoryState(dialog))?.ready).toBe(true);
  return dialog;
};

try {
  const response = await page.goto(url);
  assert.equal(response.status(), 200);
  await waitForDeck(page);
  await waitForFactory(page);
  await check('Edition 05 adds actual manufacturing drawings and preserves the core story', async () => {
    await expect(page.locator('body')).toHaveClass(/designx-v5/);
    assert.equal(await page.evaluate(() => window.DESIGNX_META.edition), 5);
    assert.equal(await page.locator('.slide').count(), expectedCount);
    assert.equal(await page.locator('.slide .eyebrow, .slide .fw-eyebrow, .slide .running, .slide .time-running, .slide .fw-running').count(), 0);
    assert.equal(await page.locator('script[src$="4/edition.js"], script[src$="4/commercial-visuals.js"]').count(), 0);
    assert.equal(await page.locator('.v4-commercial-state, .v4-commercial-print-art').count(), 0);
    await go(3);
    assert.equal(await text(page.locator('.cover-title')), 'Buildings that grow. And the means to make many.');
    assert.match(await text(page.locator('.variability-slide blockquote')), /Variability is the essence of nature and the enemy of industry;/);
    assert.match(await text(page.locator('.closing-thesis')), /We mine, pour, and cut;/);
    assert.equal(await page.locator('.buyers-slide .prospect-logo img').count(), 3);
    assert.match(await text(page.locator('.buyers-slide .source-note')), /Active conversations, not signed commissions/);
    await expect(page.locator('.computation-slide')).toContainText(/in development/i);
    await expect(page.locator('.factory-slide')).toContainText(/in development|proposed/i);
    await go(1);
  });
  await check('The supplied Safiro and Argesta files load without font substitution', async () => {
    const fonts = await page.evaluate(async () => {
      const supplied = [...document.fonts].filter(face => /Safiro|Argesta/.test(face.family));
      await Promise.all(supplied.map(face => face.load()));
      return supplied.map(face => ({ family: face.family.replaceAll('"', ''), weight: face.weight, style: face.style, status: face.status }));
    });
    for (const name of ['Safiro', 'Argesta Display', 'Argesta Headline', 'Argesta Text']) assert(fonts.some(face => face.family === name), `Missing supplied family ${name}`);
    assert(fonts.every(face => face.status === 'loaded'));
    for (const weight of ['400', '500', '600', '700']) assert(fonts.some(face => face.family === 'Safiro' && face.weight === weight), `Missing Safiro ${weight}`);
    assert.match(await page.locator('.cover-title h1').evaluate(el => getComputedStyle(el).fontFamily), /Argesta Display/);
    assert.match(await page.locator('.computation-slide h2').evaluate(el => getComputedStyle(el).fontFamily), /Safiro/);
    assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).fontSynthesis), 'none');
    await writeFile(resolve(output, 'fonts.json'), JSON.stringify(fonts, null, 2));
  });
  await check('The drawing catalog serves the process overview and all fourteen stations', async () => {
    const catalog = await page.evaluate(() => window.DESIGNX_FACTORY_CATALOG);
    assert.equal(catalog.length, 15);
    assert.equal(catalog[0].id, 'overview');
    assert.deepEqual(catalog.slice(1).map(entry => entry.number), Array.from({ length: 14 }, (_, index) => String(index + 1).padStart(2, '0')));
    const drawings = [];
    for (const entry of catalog) {
      const response = await page.request.get(new URL(`/designx/5/factory/${entry.id}.html`, url).href);
      assert.equal(response.status(), 200, `${entry.id} is available`);
      const html = await response.text();
      assert.match(html, /<svg\b/);
      assert.match(html, /window\.BOWER_FACTORY/);
      assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:src|href)=["']https?:/);
      drawings.push({ id: entry.id, bytes: Buffer.byteLength(html), sha256: sha256(html) });
    }
    await writeFile(resolve(output, 'factory-drawings.json'), JSON.stringify(drawings, null, 2));
  });
  await check('Factory explorer opens all fourteen spatial stations and restores the same map', async () => {
    const overview = page.locator('[data-factory-viewer="overview"]');
    const focus = page.locator('[data-factory-viewer="focus"]');
    await expect(overview.locator('.factory-station-picker')).toHaveCount(0);
    await expect(focus.locator('[data-factory-id]')).toHaveCount(3);
    assert.equal((await factoryState(overview)).active, false);
    assert.equal((await factoryState(focus)).active, false);
    await go(7);
    await expect.poll(async () => (await factoryState(overview))?.playing).toBe(true);
    assert.equal((await factoryState(focus)).playing, false);
    const mapFrame = await (await overview.locator('iframe').elementHandle()).contentFrame();
    const ids = await page.evaluate(() => window.DESIGNX_FACTORY_CATALOG.slice(1).map(item => item.id));
    await expect(mapFrame.locator('[data-factory-station]')).toHaveCount(14);
    for (const id of ids) {
      const dialog = await openStation(page, overview, id);
      await expect.poll(async () => (await factoryState(overview))?.active).toBe(false);
      const frozen = await factoryState(overview);
      await expect.poll(async () => (await factoryState(dialog))?.playing).toBe(true);
      await dialog.locator('[data-factory-seek]').fill('65');
      await expect.poll(async () => {
        const state = await factoryState(dialog);
        return Math.abs(state.time / state.duration - 0.65);
      }).toBeLessThan(0.01);
      assert.equal((await factoryState(dialog)).playing, false);
      assert.equal((await factoryState(overview)).renderCount, frozen.renderCount);
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect.poll(async () => (await factoryState(overview))?.active).toBe(true);
      assert.equal(await (await overview.locator('iframe').elementHandle()).contentFrame(), mapFrame, 'Opening a station must preserve the original map frame');
      await expect.poll(() => mapFrame.evaluate(() => document.activeElement?.dataset.factoryStation)).toBe(id);
    }
    await mapFrame.locator('[data-factory-station="05-press"]').focus();
    await page.keyboard.press('Enter');
    const enlarged = page.locator('#factory-enlarged');
    await expect(enlarged).toBeVisible();
    await expect.poll(async () => (await factoryState(enlarged))?.ready).toBe(true);
    await enlarged.locator('[data-factory-next]').click();
    await expect.poll(async () => (await factoryState(enlarged))?.id).toBe('06-cure');
    await enlarged.locator('[data-factory-previous]').click();
    await expect.poll(async () => (await factoryState(enlarged))?.id).toBe('05-press');
    await expect.poll(async () => (await factoryState(enlarged))?.ready).toBe(true);
    assert.equal(await page.evaluate(() => window.DESIGNX.current), 7);
    await page.screenshot({ path: resolve(output, 'factory-enlarged.png') });
    await page.keyboard.press('Escape');
    await expect(enlarged).toHaveCount(0);
    await overview.locator('[data-factory-notes]').click();
    await expect(page.locator('.factory-notes-dialog')).toBeVisible();
    await expect(page.locator('.factory-notes-dialog')).toContainText(/testing|test|assumed|proposed/i);
    await page.keyboard.press('Escape');
    await expect(page.locator('.factory-notes-dialog')).toBeHidden();
    await page.locator('.slide.is-active').screenshot({ path: resolve(output, 'factory-explorer.png') });
    await go(8);
    await expect.poll(async () => (await factoryState(overview))?.playing).toBe(false);
    const stopped = await factoryState(overview);
    for (const id of ['07-scan', '11-cut', '05-press']) {
      await selectDrawing(focus, id);
      await expect.poll(async () => (await factoryState(focus))?.playing).toBe(true);
      await focus.locator('[data-factory-seek]').fill('60');
      await expect.poll(async () => (await factoryState(focus))?.playing).toBe(false);
      assert((await text(focus.locator('[data-factory-phase]'))).length > 0);
    }
    assert.equal((await factoryState(overview)).renderCount, stopped.renderCount, 'A hidden factory drawing must not keep rendering');
    await go(1);
    await expect.poll(async () => (await factoryState(focus))?.active).toBe(false);
    assert.equal((await factoryState(focus)).playing, false);
  });
  await check('Slide navigation, the model, growth and both flywheels remain interactive', async () => {
    await go(1);
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => page.evaluate(() => window.DESIGNX.current)).toBe(2);
    await page.getByRole('button', { name: 'Open slide index', exact: true }).click();
    await expect(page.locator('#slide-index')).toBeVisible();
    await page.getByRole('button', { name: 'Close slide index', exact: true }).click();
    await goTheme('computation-slide');
    const model = page.locator('#v4-model-view');
    await page.locator('button[data-model-view="components"]').click();
    await expect(model).toHaveAttribute('data-model-view', 'components');
    await expect(model.locator('.v4-model-components img')).toHaveCount(3);
    await page.locator('button[data-model-view="assembly"]').click();
    await expect(model).toHaveAttribute('data-model-view', 'assembly');
    await goTheme('growth-slide');
    await page.locator('[data-time-scrub]').fill('60');
    await expect(page.locator('[data-time-scrub]')).toHaveValue('60');
    for (const theme of ['learning-slide', 'commercial-loop-slide']) {
      await goTheme(theme);
      await page.locator(`.${theme} .fw-node`).nth(2).click();
      await expect(page.locator(`.${theme} .fw-node`).nth(2)).toHaveAttribute('aria-pressed', 'true');
    }
    await goTheme('coupled-slide');
    await page.locator('.coupled-slide input[type=range]').fill('100');
    await expect(page.locator('.coupled-slide input[type=range]')).toHaveValue('100');
  });
  await check('The customer film loads on request and pauses when its slide is left', async () => {
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
    await go(1);
    assert.equal(await film.evaluate(el => el.paused), true);
  });
  await check('Reduced motion and all sixteen compositions fit without clipped text', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go(7);
    await expect.poll(async () => (await factoryState(page.locator('[data-factory-viewer="overview"]')))?.reducedMotion).toBe(true);
    assert.equal((await factoryState(page.locator('[data-factory-viewer="overview"]'))).playing, false);
    await go(8);
    assert.equal((await factoryState(page.locator('[data-factory-viewer="focus"]'))).playing, false);
    await go(1);
    assert(await page.locator('.material-problem-slide .opening-film').evaluate(el => {
      const style = getComputedStyle(el);
      return style.animationName === 'none' || style.animationPlayState === 'paused';
    }));
    for (let number = 1; number <= expectedCount; number++) {
      await go(number);
      const metrics = (await inspectSlides(page)).find(slide => slide.id === `slide-${String(number).padStart(2, '0')}`);
      assert.deepEqual(metrics.overflow, [], `${metrics.id} has clipped text`);
      const path = resolve(output, `slide-${String(number).padStart(2, '0')}.png`);
      await page.locator('.slide.is-active').screenshot({ path });
      screenshots.push(path);
    }
  });
  await check('Phone, landscape phone, tablet and widescreen retain the stage and its controls', async () => {
    for (const [width, height] of [[390, 844], [844, 390], [768, 1024], [1920, 1080]]) {
      await page.setViewportSize({ width, height });
      for (const number of [3, 7, 8, 12]) {
        await go(number);
        const box = await page.locator('#deck').boundingBox();
        assert(box.x >= -1 && box.y >= -1 && box.x + box.width <= width + 1 && box.y + box.height <= height + 1);
        const controls = await page.locator('.viewer-controls').boundingBox();
        assert(controls.y >= 0 && controls.y + controls.height <= height);
        await page.screenshot({ path: resolve(output, `viewport-${width}x${height}-slide-${number}.png`) });
      }
    }
  });
  await check('Print mode contains sixteen complete static compositions', async () => {
    const print = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
    observe(print);
    await print.goto(printUrl(url));
    await print.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
    await waitForDeck(print);
    await waitForFactory(print);
    await print.evaluate(() => window.DESIGNX_FACTORY.preparePrint());
    assert.equal(await print.locator('.slide').count(), expectedCount);
    await expect(print.locator('[data-factory-poster] > svg')).toHaveCount(4);
    await expect(print.locator('[data-factory-poster] [data-factory-explore], [data-factory-poster] [data-factory-station]')).toHaveCount(0);
    for (const id of ['overview', '05-press', '07-scan', '11-cut']) {
      const poster = print.locator(`[data-factory-poster="${id}"]`);
      await expect(poster).toBeVisible();
      assert(await poster.locator('svg path, svg polygon, svg rect, svg line').count() > 10);
      const bounds = await poster.locator('svg').evaluate(svg => {
        const drawing = svg.querySelector(':scope > g');
        const rectangle = drawing.getBoundingClientRect();
        return { width: rectangle.width, height: rectangle.height, viewBox: [svg.viewBox.baseVal.width, svg.viewBox.baseVal.height] };
      });
      assert(bounds.width > 100 && bounds.height > 100, `${id} must paint a visible drawing, not an SVG fitted in a hidden capture frame: ${JSON.stringify(bounds)}`);
      assert(bounds.viewBox.every(value => Number.isFinite(value) && value > 0));
    }
    await expect(print.locator('[data-factory-viewer="overview"] .factory-surface')).toBeHidden();
    await expect(print.locator('[data-factory-viewer="focus"] .factory-surface')).toBeHidden();
    assertPrintSlides(await inspectSlides(print));
    await expect(print.locator('.viewer-controls')).toBeHidden();
    for (const number of [3, 7, 8, 12, 16]) await print.locator(`#slide-${String(number).padStart(2, '0')}`).screenshot({ path: resolve(output, `print-${number}.png`) });
    await print.close();
  });
  await check('Editions 01–04 retain their own scene counts and do not load edition 05', async () => {
    const prior = await browser.newPage();
    observe(prior);
    for (const [path, count] of [['/designx', 16], ['/designx/2', 16], ['/designx/3', 15], ['/designx/4', 15]]) {
      await prior.goto(new URL(path, url).href);
      await waitForDeck(prior);
      assert.equal(await prior.locator('.slide').count(), count);
      assert.equal(await prior.locator('.designx-v5').count(), 0);
      assert.equal(await prior.locator('script[src*="5/factory"], script[src$="5/edition.js"]').count(), 0);
    }
    await prior.close();
  });
  await check('PDF aliases, comparison links, deep links and offline assets stay scoped to 05', async () => {
    assert.match(await page.locator('#pdf-link').evaluate(el => el.href), /\/designx\/5\/pdf$/);
    assert.match(await page.locator('[data-edition-four]').evaluate(el => el.href), /\/designx\/4(?:#|$)/);
    if (!beforeExport) {
      const pdf = await readFile(resolve(ROOT, 'public/designx/5/downloads/Bower_DesignX_Buildings_That_Grow_05.pdf'));
      for (const path of ['/designx/5/pdf', '/designx/5/pdf/']) {
        const response = await page.request.get(new URL(path, url).href);
        assert.equal(response.status(), 200);
        assert.match(response.headers()['content-type'], /application\/pdf/);
        assert.match(response.headers()['content-disposition'], /^inline;.*Bower_DesignX_Buildings_That_Grow_05\.pdf/);
        assert.equal(sha256(await response.body()), sha256(pdf));
      }
    }
    const alternate = await browser.newPage();
    observe(alternate);
    await alternate.goto(new URL('/designx/5/?from=qa#slide-07', url).href);
    await waitForDeck(alternate);
    await waitForFactory(alternate);
    assert.equal(await alternate.evaluate(() => window.DESIGNX.current), 7);
    assert.equal(await alternate.evaluate(() => window.DESIGNX_META.edition), 5);
    await alternate.goto(pathToFileURL(resolve(ROOT, 'public/designx/5/index.html')).href);
    await waitForDeck(alternate);
    await waitForFactory(alternate);
    assert.equal(await alternate.locator('#pdf-link').evaluate(el => el.href), pathToFileURL(resolve(ROOT, 'public/designx/5/downloads/Bower_DesignX_Buildings_That_Grow_05.pdf')).href);
    await alternate.evaluate(() => window.DESIGNX.goTo(7));
    const offlineViewer = alternate.locator('[data-factory-viewer="overview"]');
    const offlineDialog = await openStation(alternate, offlineViewer, '11-cut');
    await offlineDialog.locator('[data-factory-seek]').fill('40');
    await expect.poll(async () => {
      const state = await factoryState(offlineDialog);
      return Math.abs(state.time / state.duration - 0.4);
    }).toBeLessThan(0.01);
    assert((await text(offlineDialog.locator('[data-factory-phase]'))).length > 0);
    await alternate.keyboard.press('Escape');
    await expect(offlineDialog).toHaveCount(0);
    await expect(alternate.locator('[data-factory-poster] > svg')).toHaveCount(4);
    await alternate.close();
  });
  assert.deepEqual(errors, [], 'All presentation scripts, drawings, images and fonts must load without errors');
  await writeFile(resolve(output, printOnly ? 'check-print.json' : explorerOnly ? 'check-explorer.json' : 'check.json'), JSON.stringify({ url, beforeExport, printOnly, explorerOnly, checks, errors, screenshots }, null, 2));
  console.log(`${checks.length} edition 05 checks passed.`);
} finally { await browser.close(); }
