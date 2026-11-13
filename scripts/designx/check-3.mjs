/** Edition 03: cold-read argument, interactive evidence and static submission layout. */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect } from '@playwright/test';
import { openBrowser, waitForDeck, inspectSlides, printUrl, assertPrintSlides, ROOT } from './browser.mjs';

const url = process.env.DESIGNX_V3_URL ?? 'http://127.0.0.1:5333/designx/3';
const expectedSlideCount = 15;
const output = resolve(ROOT, 'qa-out/designx/edition-03');
await mkdir(output, { recursive: true });
const browser = await openBrowser();
const page = await browser.newPage({ viewport: { width: 1600, height: 1020 } });
const errors = [];
const checks = [];
const screenshots = [];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const variabilityThesis = 'Variability is the essence of nature and the enemy of industry; Bower’s bet is to make variability manufacturable.';
const closingThesis = 'We mine, pour, and cut; we assemble inert objects that begin decaying the moment they’re complete; and we’ve quietly accepted that the largest thing our species makes — the built world — is also the most severed from the living one.';
const visibleText = async locator => (await locator.innerText()).replace(/\s+/g, ' ').trim();
const observe = target => {
  target.on('pageerror', error => errors.push(error.message));
  target.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
};
observe(page);
const sceneNumber = theme => page.evaluate(value => window.DESIGNX_SLIDES.findIndex(slide => slide.theme.split(' ').includes(value)) + 1, theme);
const go = async number => {
  await page.evaluate(n => window.DESIGNX.goTo(n), number);
  await expect(page.locator(`#slide-${String(number).padStart(2, '0')}`)).toHaveAttribute('aria-hidden', 'false');
};
const goTheme = async theme => {
  const number = await sceneNumber(theme);
  assert(number > 0, `Missing scene ${theme}`);
  await go(number);
};
const check = async (name, action) => {
  await action();
  checks.push(name);
  console.log(`PASS ${name}`);
};

try {
  await page.goto(url);
  await waitForDeck(page);
  await check('The new route opens a three-slide argument within a fifteen-slide edition', async () => {
    await expect(page.locator('body')).toHaveClass(/designx-v3/);
    assert.equal(await page.locator('.slide').count(), expectedSlideCount);
    assert.equal(await page.evaluate(() => window.DESIGNX_META.targetSlideCount), expectedSlideCount);
    assert.equal(await page.locator('.traction-slide').count(), 0, 'Named prospects now belong on the first-customers slide');
    for (const [index, theme] of ['material-problem-slide', 'variability-slide', 'cover'].entries()) {
      assert.equal(await sceneNumber(theme), index + 1);
    }
    assert.equal(await page.locator('.slide .eyebrow, .slide .fw-eyebrow, .slide .running, .slide .time-running, .slide .fw-running').count(), 0);
    const heading = await page.locator('.material-problem-slide h1').evaluate(el => ({ font: getComputedStyle(el).fontFamily, weight: Number(getComputedStyle(el).fontWeight) }));
    assert.match(heading.font, /Helvetica Neue/);
    assert(heading.weight >= 700);
    assert.equal(await page.locator('[data-customer-film]').getAttribute('src'), null);
  });
  await check('The problem has visible sources and the evidence retains its qualifications', async () => {
    const first = page.locator('.material-problem-slide');
    await expect(first.locator('a[href*="energy-transitions.org"]')).toHaveCount(1);
    await expect(first.locator('a[href*="globalabc.org"], a[href*="unep.org"]')).toHaveCount(1);
    assert.match((await first.locator('h1').innerText()).replace(/\s+/g, ' '), /build the world again/i);
    await expect(first).toContainText('55%');
    await expect(first).toContainText('2022');
    await expect(first).toContainText('2050');
    await expect(first.locator('img[src$="3/assets/world-under-construction.webp"]')).toHaveCount(1);
    await expect(page.locator('.variability-slide img[src$="3/assets/living-structure.webp"]')).toHaveCount(1);
    await expect(page.locator('.computation-slide')).toContainText(/in development/i);
    await expect(page.locator('.factory-slide')).toContainText(/in development/i);
    await go(2);
    await expect(page.locator('.variability-slide blockquote')).toBeVisible();
    assert.equal(await visibleText(page.locator('.variability-slide blockquote')), variabilityThesis);
    await goTheme('closing');
    assert.equal(await page.evaluate(() => window.DESIGNX.current), expectedSlideCount);
    await expect(page.locator('.closing-thesis')).toBeVisible();
    assert.equal(await visibleText(page.locator('.closing-thesis')), closingThesis);
    await go(1);
  });
  await check('Opening motion pauses on request and offscreen', async () => {
    const film = page.locator('.material-problem-slide .opening-film');
    await expect.poll(() => film.evaluate(el => getComputedStyle(el).animationName)).not.toBe('none');
    await expect.poll(() => film.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
    const motionButton = page.locator('.material-problem-slide [data-opening-motion]');
    await motionButton.click();
    await expect(motionButton).toHaveAttribute('aria-label', 'Resume image motion');
    await expect(motionButton).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => film.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
    const pausedTransform = await film.evaluate(el => getComputedStyle(el).transform);
    await page.waitForTimeout(150);
    assert.equal(await film.evaluate(el => getComputedStyle(el).transform), pausedTransform);
    await motionButton.click();
    await expect(motionButton).toHaveAttribute('aria-label', 'Pause image motion');
    await expect(motionButton).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(() => film.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
    await expect.poll(() => film.evaluate(el => getComputedStyle(el).transform)).not.toBe(pausedTransform);
    await go(3);
    await expect.poll(() => film.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
    await go(1);
    await expect.poll(() => film.evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
  });
  await check('Scroll navigation advances once and the slide index remains usable', async () => {
    await page.waitForTimeout(700);
    await page.mouse.move(800, 450);
    await page.mouse.wheel(0, 100);
    await expect.poll(() => page.evaluate(() => window.DESIGNX.current)).toBe(2);
    for (let pulse = 0; pulse < 9; pulse++) {
      await page.waitForTimeout(100);
      await page.mouse.wheel(0, 90);
    }
    assert.equal(await page.evaluate(() => window.DESIGNX.current), 2, 'One continuous gesture must not skip the opening argument');
    await page.getByRole('button', { name: 'Open slide index', exact: true }).click();
    await page.mouse.wheel(0, 500);
    assert.equal(await page.evaluate(() => window.DESIGNX.current), 2);
    await page.getByRole('button', { name: 'Close slide index', exact: true }).click();
  });
  await check('Growth, customer film and both flywheels remain interactive after reordering', async () => {
    await goTheme('growth-slide');
    await expect(page.locator('.time-scene')).toHaveAttribute('data-time-playing', 'false');
    await page.waitForTimeout(700);
    await page.mouse.move(900, 450);
    await page.mouse.wheel(0, 240);
    await expect.poll(() => page.locator('[data-time-scrub]').inputValue().then(Number)).toBeGreaterThan(0);
    assert.equal(await page.evaluate(() => window.DESIGNX.current), await sceneNumber('growth-slide'));
    await goTheme('buyers-slide');
    const buyers = page.locator('.buyers-slide');
    const prospects = buyers.locator('.prospect-strip');
    assert.match(await visibleText(prospects), /In discussion with/);
    await expect(prospects.locator('a')).toHaveCount(3);
    for (const name of ['Eden Project', 'The Newt', '25hours']) {
      const logo = prospects.locator(`a img[alt="${name}"]`);
      await expect(logo).toBeVisible();
      assert(await logo.evaluate(el => el.complete && el.naturalWidth > 0), `${name} logo must load`);
      const link = await logo.evaluate(el => el.closest('a').href);
      assert(new URL(link).protocol === 'https:', `${name} must link to an official website over HTTPS`);
    }
    await expect(buyers.locator('.buyer-triptych figure')).toHaveCount(3);
    await expect(buyers.locator('.source-note')).toHaveText('Active conversations, not signed commissions. Images are Bower concepts, not work for these organisations.');
    const film = page.locator('[data-customer-film]');
    assert.equal(await film.getAttribute('src'), null, 'Entering the combined customers slide must keep the film lazy');
    await page.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => film.evaluate(el => el.currentTime), { timeout: 15000 }).toBeGreaterThan(0.2);
    assert.equal(await film.evaluate(el => el.paused), false);
    await page.locator('#v2-film-position').fill('65');
    await expect.poll(() => film.evaluate(el => el.currentTime)).toBeGreaterThan(4);
    assert.equal(await film.evaluate(el => el.paused), true);
    await page.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => film.evaluate(el => el.paused)).toBe(false);
    await goTheme('learning-slide');
    assert.equal(await film.evaluate(el => el.paused), true);
    const nodes = page.locator('.learning-slide .fw-node');
    await nodes.nth(2).click();
    await expect(nodes.nth(2)).toHaveAttribute('aria-pressed', 'true');
    await goTheme('commercial-loop-slide');
    const commercialNodes = page.locator('.commercial-loop-slide .fw-node');
    await commercialNodes.nth(2).click();
    await expect(commercialNodes.nth(2)).toHaveAttribute('aria-pressed', 'true');
    await goTheme('coupled-slide');
    await page.locator('.coupled-slide input[type=range]').fill('100');
    await expect(page.locator('.coupled-slide input[type=range]')).toHaveValue('100');
  });
  await check('Reduced motion preserves deliberate controls and stops automatic growth', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go(1);
    await expect.poll(() => page.locator('.material-problem-slide .opening-film').evaluate(el => {
      const style = getComputedStyle(el);
      return style.animationName === 'none' || style.animationPlayState === 'paused';
    })).toBe(true);
    await expect(page.locator('.material-problem-slide h1')).toBeVisible();
    for (const control of await page.locator('[data-opening-motion]').all()) await expect(control).toBeHidden();
    await goTheme('growth-slide');
    await expect(page.locator('.time-scene')).toHaveAttribute('data-time-playing', 'false');
    await page.waitForTimeout(700);
    await page.mouse.move(900, 450);
    await page.mouse.wheel(0, 100);
    await expect.poll(() => page.evaluate(() => window.DESIGNX.current)).toBe(await sceneNumber('growth-slide') + 1);
  });
  await check('All fifteen compositions fit their canvas and load their evidence images', async () => {
    for (let number = 1; number <= expectedSlideCount; number++) {
      await go(number);
      await waitForDeck(page);
      const metrics = (await inspectSlides(page)).find(s => s.id === `slide-${String(number).padStart(2, '0')}`);
      assert.deepEqual(metrics.overflow, [], `${metrics.id} has clipped text`);
      const imagePath = resolve(output, `slide-${String(number).padStart(2, '0')}.png`);
      await page.locator('.slide.is-active').screenshot({ path: imagePath });
      screenshots.push(imagePath);
    }
  });
  await check('Phone, landscape phone, tablet and widescreen preserve the stage and controls', async () => {
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
      await goTheme('buyers-slide');
      const deck = await page.locator('#deck').boundingBox();
      for (const logo of await page.locator('.prospect-strip img').all()) {
        const box = await logo.boundingBox();
        assert(box && box.x >= deck.x - 1 && box.y >= deck.y - 1 && box.x + box.width <= deck.x + deck.width + 1 && box.y + box.height <= deck.y + deck.height + 1, 'Prospect logos must remain inside the presentation on every viewport');
      }
      await page.screenshot({ path: resolve(output, `viewport-${width}x${height}-customers.png`) });
    }
  });
  await check('Print mode shows all fifteen static compositions and the combined customer evidence', async () => {
    const print = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
    observe(print);
    await print.goto(printUrl(url));
    await waitForDeck(print);
    assert.equal(await print.locator('.slide').count(), expectedSlideCount);
    assertPrintSlides(await inspectSlides(print));
    await expect(print.locator('.viewer-controls')).toBeHidden();
    await expect(print.locator('.material-problem-slide')).toBeVisible();
    assert(await print.locator('.material-problem-slide .opening-film').evaluate(el => {
      const style = getComputedStyle(el);
      return style.animationName === 'none' || style.animationPlayState === 'paused';
    }));
    assert.equal(await visibleText(print.locator('.variability-slide blockquote')), variabilityThesis);
    assert.equal(await visibleText(print.locator('.closing-thesis')), closingThesis);
    await expect(print.locator('.buyers-slide .prospect-strip')).toBeVisible();
    for (const name of ['Eden Project', 'The Newt', '25hours']) {
      await expect(print.locator(`.buyers-slide .prospect-strip img[alt="${name}"]`)).toBeVisible();
    }
    await print.locator('.material-problem-slide').screenshot({ path: resolve(output, 'print-opening.png') });
    await print.close();
  });
  await check('Previous editions and the original PDF remain independent', async () => {
    const prior = await browser.newPage();
    observe(prior);
    for (const path of ['/designx', '/designx/2']) {
      await prior.goto(new URL(path, url).href);
      await waitForDeck(prior);
      assert.equal(await prior.locator('.slide').count(), 16, 'Previous editions retain their sixteen-slide stories');
      assert.equal(await prior.locator('.designx-v3').count(), 0);
      assert.equal(await prior.locator('.material-problem-slide').count(), 0);
    }
    const response = await prior.request.get(new URL('/designx/pdf', url).href);
    assert.equal(response.headers()['content-type'], 'application/pdf');
    assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-');
    await prior.close();
  });
  await check('The third edition links to its own inline PDF submission', async () => {
    assert.match(await page.locator('#pdf-link').evaluate(el => el.href), /\/designx\/3\/pdf$/);
    const pdfFile = resolve(ROOT, 'public/designx/3/downloads/Bower_DesignX_Buildings_That_Grow_03.pdf');
    const originalPdf = await readFile(resolve(ROOT, 'public/designx/downloads/Bower_DesignX_Buildings_That_Grow.pdf'));
    const editionPdf = await readFile(pdfFile);
    assert.notEqual(sha256(editionPdf), sha256(originalPdf), 'Edition 03 must not serve the original deck');
    for (const path of ['/designx/3/pdf', '/designx/3/pdf/']) {
      const response = await page.request.get(new URL(path, url).href);
      assert.equal(response.status(), 200, path);
      assert.equal(response.headers()['content-type'], 'application/pdf');
      assert.match(response.headers()['content-disposition'], /^inline;.*Bower_DesignX_Buildings_That_Grow_03\.pdf/);
      assert.match(response.headers()['x-robots-tag'], /noindex/);
      const bytes = await response.body();
      assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
      assert(bytes.length > 1000, 'The submission must contain an exported document');
      assert.equal(sha256(bytes), sha256(editionPdf), 'The alias must serve the matching exported edition');
    }
  });
  await check('Trailing-slash deep links and the offline edition keep their own document and PDF', async () => {
    const alternate = await browser.newPage();
    observe(alternate);
    await alternate.goto(new URL('/designx/3/?from=qa#slide-02', url).href);
    await waitForDeck(alternate);
    await expect(alternate.locator('body')).toHaveClass(/designx-v3/);
    assert.equal(await alternate.evaluate(() => window.DESIGNX.current), 2);
    assert.match(await alternate.locator('#pdf-link').evaluate(el => el.href), /\/designx\/3\/pdf$/);
    const offlineUrl = pathToFileURL(resolve(ROOT, 'public/designx/3/index.html')).href;
    await alternate.goto(offlineUrl);
    await waitForDeck(alternate);
    const expectedPdf = pathToFileURL(resolve(ROOT, 'public/designx/3/downloads/Bower_DesignX_Buildings_That_Grow_03.pdf')).href;
    assert.equal(await alternate.locator('#pdf-link').evaluate(el => el.href), expectedPdf);
    await alternate.close();
  });
  assert.deepEqual(errors, [], 'Browser resources and scripts must load without errors');
  await writeFile(resolve(output, 'check.json'), JSON.stringify({ url, checks, errors, screenshots }, null, 2));
  console.log(`${checks.length} edition checks passed.`);
} finally {
  await browser.close();
}
