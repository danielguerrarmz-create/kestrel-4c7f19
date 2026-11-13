/** Exercise audience-visible behaviour online and offline. Does not modify presentation files. */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect } from '@playwright/test';
import { DECK_URL, ROOT, SLIDE_COUNT, assertPrintSlides, inspectSlides, openBrowser, printUrl, slideNumberFor, waitForDeck } from './browser.mjs';

const browser = await openBrowser();
const report = { url: DECK_URL, checks: [], viewports: [], errors: [], outsideDeckRequests: [], offlineRequests: [], filmRequests: [] };
const output = resolve(ROOT, 'qa-out/designx');
await mkdir(output, { recursive: true });

async function check(name, action) {
  try {
    await action();
    report.checks.push({ name, status: 'pass' });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({ name, status: 'fail', message: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
    // A failed modal assertion must not leave a dialog blocking unrelated checks.
    for (const context of browser.contexts()) for (const page of context.pages()) {
      await page.evaluate(() => document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close())).catch(() => undefined);
    }
  }
}

async function goTo(page, number) {
  const hash = `#slide-${String(number).padStart(2, '0')}`;
  await page.evaluate((value) => { location.hash = value; }, hash);
  await expect(page.locator(hash)).toBeVisible();
  await expect(page.locator(hash)).toHaveAttribute('aria-hidden', 'false');
  return page.locator(hash);
}

const computed = (locator, property) => locator.evaluate((element, prop) => getComputedStyle(element).getPropertyValue(prop), property);
const opacity = async (locator) => Number(await computed(locator, 'opacity'));

async function interactionChecks(page, prefix = '') {
  await check(`${prefix}customer film loads on request, plays in HD, pauses offscreen and replays`, async () => {
    const video = page.locator('[data-customer-film]');
    assert.equal(await video.getAttribute('src'), null, 'offscreen film must not be assigned a source');
    assert.equal(await video.evaluate(element => element.autoplay), false, 'concept film must not autoplay');
    assert.equal(await video.getAttribute('preload'), 'none', 'film must not preload its video bytes');
    assert.equal(report.filmRequests.length, 0, 'initial deck loading must not request the film');

    const number = slideNumberFor('buyers-slide');
    const slide = await goTo(page, number);
    assert.equal(await video.getAttribute('src'), null, 'entering the scene must not load the film');
    assert.equal(await video.evaluate(element => element.paused), true);
    const poster = slide.locator('.buyer-triptych figure').filter({ has: video }).locator('img');
    await expect(poster).toBeVisible();
    assert(await poster.evaluate(element => element.complete && element.naturalWidth > 0), 'the static poster must already be available');

    await slide.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => video.evaluate(element => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0.15);
    const dimensions = await video.evaluate(element => [element.videoWidth, element.videoHeight]);
    assert.deepEqual(dimensions, [1920, 1080], 'the delivered film should be the 1080p asset');
    assert(report.filmRequests.length > 0, 'the explicit play action should request the film');
    await expect.poll(() => opacity(video)).toBe(1);
    await slide.getByRole('button', { name: 'Pause resort concept film', exact: true }).click();
    assert.equal(await video.evaluate(element => element.paused), true);
    const pausedTime = await video.evaluate(element => element.currentTime);
    await page.waitForTimeout(200);
    assert.equal(await video.evaluate(element => element.currentTime), pausedTime);
    await slide.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => video.evaluate(element => element.currentTime)).toBeGreaterThan(pausedTime + 0.1);

    await goTo(page, number + 1);
    await expect.poll(() => video.evaluate(element => element.paused)).toBe(true);
    const offscreenTime = await video.evaluate(element => element.currentTime);
    await page.waitForTimeout(200);
    assert.equal(await video.evaluate(element => element.currentTime), offscreenTime, 'hidden film must stop playback');
    await goTo(page, number);
    assert.equal(await video.evaluate(element => element.paused), true, 'returning to the scene must not resume automatically');
    await slide.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await video.evaluate(element => { element.currentTime = element.duration - 0.08; });
    await expect.poll(() => video.evaluate(element => element.ended)).toBe(true);
    await expect.poll(() => opacity(video)).toBe(0);
    await slide.getByRole('button', { name: 'Play resort concept film', exact: true }).click();
    await expect.poll(() => video.evaluate(element => !element.paused && element.currentTime > 0.05 && element.currentTime < element.duration / 2)).toBe(true);
    await goTo(page, number + 1);
    await expect.poll(() => video.evaluate(element => element.paused)).toBe(true);
  });

  await check(`${prefix}growth scrubber reveals matched states without advancing the deck`, async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const slide = await goTo(page, slideNumberFor('growth-slide'));
    const scene = slide.locator('.time-scene');
    const scrubber = slide.locator('[data-time-scrub]');
    for (let i = 0; i < 3; i++) {
      const button = slide.locator(`[data-time-step="${i * 50}"]`);
      if (i === 1) { await button.focus(); await page.keyboard.press('Enter'); }
      else await button.click();
      await expect(scrubber).toHaveValue(String(i * 50));
      for (let panel = 0; panel < 3; panel++) {
        const image = slide.locator(`[data-time-frame="${panel}"]`);
        if (panel <= i) await expect.poll(() => opacity(image)).toBe(1);
        else await expect.poll(() => opacity(image)).toBe(0);
      }
    }
    const hash = new URL(page.url()).hash;
    await scrubber.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(scrubber).toHaveValue('99');
    assert.equal(new URL(page.url()).hash, hash, 'arrow keys in the timeline must not change slides');
    await expect(scene).toHaveAttribute('data-time-playing', 'false');
  });

  await check(`${prefix}growth playback advances imagery and stops offscreen`, async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const slide = await goTo(page, slideNumberFor('growth-slide'));
    const scene = slide.locator('.time-scene');
    await slide.locator('[data-time-step="0"]').click();
    await slide.locator('[data-time-play]').click();
    await expect(scene).toHaveAttribute('data-time-playing', 'true');
    await expect.poll(async () => Number(await scene.getAttribute('data-time-progress'))).toBeGreaterThan(3);
    await goTo(page, slideNumberFor('growth-slide') + 1);
    await expect(scene).toHaveAttribute('data-time-playing', 'false');
    const pausedAt = await scene.getAttribute('data-time-progress');
    await page.waitForTimeout(250);
    assert.equal(await scene.getAttribute('data-time-progress'), pausedAt, 'hidden growth scene must stop rendering');
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  await check(`${prefix}anatomy reveals planting and people without changing the structural frame`, async () => {
    const slide = await goTo(page, 4);
    const frame = slide.locator('.anatomy-frame');
    const frameSource = await frame.getAttribute('src');
    await slide.getByRole('button', { name: 'Structure', exact: true }).click();
    await expect.poll(() => opacity(slide.locator('.plant-layer'))).toBe(0);
    await expect.poll(() => opacity(slide.locator('.people-layer'))).toBe(0);
    await slide.getByRole('button', { name: '+ Planting', exact: true }).click();
    await expect.poll(() => opacity(slide.locator('.plant-layer'))).toBeGreaterThan(0.75);
    await expect.poll(() => opacity(slide.locator('.people-layer'))).toBe(0);
    const life = slide.getByRole('button', { name: '+ Life', exact: true });
    await life.focus();
    await page.keyboard.press('Space');
    await expect.poll(() => opacity(slide.locator('.people-layer'))).toBe(1);
    await expect(life).toHaveAttribute('aria-pressed', 'true');
    await expect(frame).toHaveAttribute('src', frameSource);
    await expect(frame).toBeVisible();
  });

  for (const number of ['learning-slide', 'commercial-loop-slide'].map(slideNumberFor)) {
    await check(`${prefix}flywheel ${number} explains selected stages and pauses offscreen`, async () => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      const slide = await goTo(page, number);
      const scene = slide.locator('[data-flywheel]');
      const outcomes = new Set();
      for (const index of [0, 2, 4]) {
        const node = slide.locator(`[data-fw-step="${index}"]`);
        await node.focus();
        await page.keyboard.press('Enter');
        await expect(node).toHaveAttribute('aria-pressed', 'true');
        await expect(slide.locator('[data-fw-step][aria-pressed="true"]')).toHaveCount(1);
        outcomes.add(await slide.locator('[data-fw-outcome]').textContent());
      }
      assert.equal(outcomes.size, 3, 'stages should explain different causal outcomes');
      const hash = new URL(page.url()).hash;
      await page.keyboard.press('ArrowLeft');
      await expect(scene).toHaveAttribute('data-fw-phase', '3');
      assert.equal(new URL(page.url()).hash, hash, 'flywheel keyboard navigation must stay within the scene');
      await slide.locator('[data-fw-reset]').click();
      await expect(scene).toHaveAttribute('data-fw-playing', 'true');
      await expect.poll(() => scene.getAttribute('data-fw-phase')).toBe('1');
      await goTo(page, number + 1);
      await expect(scene).toHaveAttribute('data-fw-playing', 'false');
      const pausedPhase = await scene.getAttribute('data-fw-phase');
      await page.waitForTimeout(250);
      assert.equal(await scene.getAttribute('data-fw-phase'), pausedPhase);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(scene).toHaveAttribute('data-fw-phase', '5');
      await expect(scene).toHaveAttribute('data-fw-playing', 'false');
    });
  }

  await check(`${prefix}coupled flywheels visibly join and preserve local keyboard control`, async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const slide = await goTo(page, slideNumberFor('coupled-slide'));
    const scene = slide.locator('[data-coupled]');
    const slider = slide.locator('#fw-coupling');
    await slider.focus();
    await page.keyboard.press('Home');
    await expect(scene).toHaveAttribute('data-coupling', '0');
    await expect.poll(() => opacity(slide.locator('.fw-bridges'))).toBe(0);
    const separate = await computed(slide.locator('.fw-system-technical'), 'transform');
    const hash = new URL(page.url()).hash;
    await page.keyboard.press('End');
    await expect(scene).toHaveAttribute('data-coupling', '100');
    await expect.poll(() => opacity(slide.locator('.fw-bridges'))).toBe(1);
    assert.notEqual(await computed(slide.locator('.fw-system-technical'), 'transform'), separate, 'systems should physically move together');
    await expect(slide.locator('.fw-coupling-caption')).toHaveText('Projects support learning. Learning improves projects.');
    assert.equal(new URL(page.url()).hash, hash);
    await slide.locator('[data-couple-toggle]').click();
    await expect(scene).toHaveAttribute('data-coupling', '0');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await slide.locator('[data-couple-toggle]').click();
    await expect.poll(() => scene.getAttribute('data-coupling')).toBe('100');
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  await check(`${prefix}future scale selection moves its emphasis without navigating away`, async () => {
    const slide = await goTo(page, slideNumberFor('future-slide'));
    const choices = slide.locator('.scale-scene');
    assert.equal(await choices.count(), 6, 'six architectural scales should be available');
    const originalHash = new URL(page.url()).hash;
    for (const i of [5, 2, 0]) {
      await choices.nth(i).focus();
      await page.keyboard.press('Enter');
      await expect(choices.nth(i)).toHaveAttribute('aria-pressed', 'true');
      await expect(slide.locator('.scale-scene[aria-pressed="true"]')).toHaveCount(1);
      const selectedBackground = await computed(choices.nth(i), 'background-color');
      const unselectedBackground = await computed(choices.nth((i + 1) % 6), 'background-color');
      assert.notEqual(selectedBackground, unselectedBackground, 'selection should produce a visible emphasis');
      assert.equal(new URL(page.url()).hash, originalHash, 'Enter on a scale choice must not advance the slide');
    }
  });
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  page.on('pageerror', (error) => report.errors.push(error.message));
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.endsWith('/resort-hospitality.mp4')) report.filmRequests.push(url.href);
    if (['http:', 'https:'].includes(url.protocol) && url.pathname !== '/designx' && !url.pathname.startsWith('/designx/') && !url.pathname.startsWith('/@vite/')) {
      report.outsideDeckRequests.push(url.href);
    }
  });

  await page.goto(DECK_URL, { waitUntil: 'domcontentloaded' });
  await waitForDeck(page);
  await check('button and keyboard navigation, boundaries and deep link', async () => {
    await page.keyboard.press('Home');
    await expect(page).toHaveURL(/#slide-01$/);
    await expect(page.locator('#prev-slide')).toBeDisabled();
    await page.locator('#next-slide').click();
    await expect(page).toHaveURL(/#slide-02$/);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/#slide-03$/);
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/#slide-02$/);
    await page.locator('#prev-slide').click();
    await expect(page).toHaveURL(/#slide-01$/);
    await page.keyboard.press('End');
    await expect(page).toHaveURL(new RegExp(`#slide-${String(SLIDE_COUNT).padStart(2, '0')}$`));
    await expect(page.locator('#next-slide')).toBeDisabled();
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(new RegExp(`#slide-${String(SLIDE_COUNT).padStart(2, '0')}$`));
    await page.goto(new URL('#slide-07', DECK_URL).href, { waitUntil: 'domcontentloaded' });
    await waitForDeck(page);
    await expect(page.locator('#slide-07')).toBeVisible();
  });

  await interactionChecks(page);

  await check('speaker notes open with N, hold slide navigation, trap focus and close with Escape', async () => {
    await goTo(page, 7);
    const currentTitle = (await page.locator('#slide-07').getAttribute('aria-label')).replace(/^\d+\.\s*/, '');
    await page.locator('#show-notes').focus();
    await page.keyboard.press('n');
    const dialog = page.locator('#speaker-notes');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('#notes-content h3')).toHaveText(currentTitle);
    assert(await dialog.evaluate((element) => element.contains(document.activeElement)), 'keyboard focus must enter the modal');
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/#slide-07$/);
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    assert(await dialog.evaluate((element) => element.contains(document.activeElement)), 'keyboard focus must remain in the modal');
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(page.locator('#show-notes')).toBeFocused();
    await page.locator('#show-notes').click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close speaker notes' }).click();
    await expect(dialog).not.toBeVisible();
  });

  await check('slide index is keyboard navigable and Escape returns to the presentation', async () => {
    await page.locator('#open-index').focus();
    await page.keyboard.press('g');
    const dialog = page.locator('#slide-index');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.index-item')).toHaveCount(SLIDE_COUNT);
    assert(await dialog.evaluate((element) => element.contains(document.activeElement)), 'keyboard focus must enter the index');
    let selected = false;
    for (let i = 0; i < 18; i++) {
      if (await page.evaluate(() => document.activeElement?.getAttribute('data-go') === '2')) { selected = true; break; }
      await page.keyboard.press('Tab');
    }
    assert(selected, 'the third slide must be reachable through normal Tab navigation');
    await page.keyboard.press('Enter');
    await expect(dialog).not.toBeVisible();
    await expect(page.locator('#slide-03')).toBeVisible();
    await expect(page).toHaveURL(/#slide-03$/);
    await page.locator('#open-index').click();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(page.locator('#open-index')).toBeFocused();
  });

  for (const viewport of [{ width: 1280, height: 720 }, { width: 1920, height: 1080 }, { width: 1024, height: 768 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await check(`all slides fit ${viewport.width} × ${viewport.height}`, async () => {
      await page.setViewportSize(viewport);
      // Playwright updates viewport dimensions before the browser dispatches resize.
      // Let the viewer's fit handler run before measuring the authored slide canvas.
      await expect.poll(() => page.locator('#deck').evaluate(stage => {
        const box = stage.getBoundingClientRect();
        return box.left >= -1 && box.top >= -1 && box.right <= innerWidth + 1 && box.bottom <= innerHeight + 1;
      })).toBe(true);
      await page.keyboard.press('Home');
      for (let i = 1; i <= SLIDE_COUNT; i++) {
        const id = `slide-${String(i).padStart(2, '0')}`;
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        const dimensions = await page.locator(`#${id}`).evaluate((slide) => {
          const box = slide.getBoundingClientRect();
          return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height };
        });
        assert(dimensions.width > 0 && dimensions.height > 0, `${id} is not visible`);
        assert(Math.abs(dimensions.width / dimensions.height - 16 / 9) < 0.01, `${id} lost its aspect ratio`);
        assert(dimensions.left >= -1 && dimensions.top >= -1 && dimensions.right <= viewport.width + 1 && dimensions.bottom <= viewport.height + 1, `${id} exceeds viewport bounds`);
        if (i < SLIDE_COUNT) await page.keyboard.press('ArrowRight');
      }
      for (const id of ['prev-slide', 'next-slide', 'open-index', 'show-notes']) {
        const box = await page.locator(`#${id}`).boundingBox();
        assert(box && box.x >= 0 && box.x + box.width <= viewport.width && box.y >= 0 && box.y + box.height <= viewport.height, `${id} falls outside the viewport`);
      }
      report.viewports.push({ ...viewport, slides: SLIDE_COUNT, navigation: 'pass' });
    });
  }

  await check('extensionless /designx serves the standalone deck and preserves its query', async () => {
    const exactUrl = new URL(DECK_URL);
    exactUrl.pathname = '/designx';
    exactUrl.search = '?from=qa';
    exactUrl.hash = '#slide-04';
    const response = await page.goto(exactUrl.href, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `extensionless route returned HTTP ${response?.status()}`);
    await waitForDeck(page);
    assert(new URL(page.url()).searchParams.get('from') === 'qa', 'query parameters must survive document serving');
    await expect(page.locator('#slide-04')).toBeVisible();
    assert((response.headers()['x-robots-tag'] || '').includes('noindex'), 'deck document must remain unindexed');
    assert(await page.locator('script[src*="/assets/index-"]').count() === 0, 'route must not load the marketing SPA');
  });

  await check('/designx/pdf serves the current PDF inline at both aliases', async () => {
    const expected = await readFile(resolve(ROOT, 'public/designx/downloads/Bower_DesignX_Buildings_That_Grow.pdf'));
    const digest = bytes => createHash('sha256').update(bytes).digest('hex');
    for (const pathname of ['/designx/pdf', '/designx/pdf/']) {
      const url = new URL(pathname, DECK_URL);
      url.search = '?from=qa';
      const response = await page.request.get(url.href);
      assert.equal(response.status(), 200, `${pathname} must serve an exported PDF`);
      const headers = response.headers();
      assert(headers['content-type']?.startsWith('application/pdf'), `${pathname} returned HTML or another content type`);
      assert(headers['content-disposition']?.startsWith('inline;'), 'PDF should open in the browser');
      assert(headers['x-robots-tag']?.includes('noindex'), 'PDF must retain presentation indexing policy');
      const bytes = await response.body();
      assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', 'response must contain a real PDF');
      assert.equal(digest(bytes), digest(expected), 'PDF alias must serve the current export byte for byte');
    }
  });

  await check('print has settled visual states, all current slides fit, and controls are hidden', async () => {
    await page.goto(printUrl(), { waitUntil: 'domcontentloaded' });
    await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
    await waitForDeck(page);
    // Deliberately leave interaction state incomplete before checking print CSS.
    await page.evaluate(() => {
      document.getElementById('slide-03').dataset.growth = '0';
      document.getElementById('slide-04').dataset.layer = 'frame';
      document.querySelectorAll('.flow-on').forEach((slide) => slide.classList.remove('flow-on'));
    });
    report.printSlides = await inspectSlides(page);
    assertPrintSlides(report.printSlides);
    await expect(page.locator('.time-print-sequence')).toBeVisible();
    await expect(page.locator('.time-print-sequence figure')).toHaveCount(3);
    await expect(page.locator('.time-cinema:visible, .time-controls:visible')).toHaveCount(0);
    assert(await opacity(page.locator('#slide-04 .plant-layer')) > 0.75);
    assert.equal(await opacity(page.locator('#slide-04 .people-layer')), 1);
    for (const segment of await page.locator('.fw-segment').all()) assert.equal(parseFloat(await computed(segment, 'stroke-dashoffset')), 0);
    await expect(page.locator('.fw-static-summary:visible')).toHaveCount(2);
    await expect(page.locator('.fw-coupled-static')).toBeVisible();
    assert.equal(await opacity(page.locator('.fw-bridges')), 1);
    await expect(page.locator('[data-customer-film]')).not.toBeVisible();
    await expect(page.locator('[data-customer-play]')).not.toBeVisible();
    const filmPoster = page.locator('.buyer-triptych figure').filter({ has: page.locator('[data-customer-film]') }).locator('img');
    await expect(filmPoster).toBeVisible();
    assert(await filmPoster.evaluate(element => element.complete && element.naturalWidth > 0), 'PDF must retain the loaded resort still');
    await expect(page.locator('.viewer-controls:visible, .slide-interaction:visible, dialog:visible')).toHaveCount(0);
  });

  await check('offline file launch loads images and controls with HTTP(S) blocked', async () => {
    const offline = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
    await offline.route(/^https?:\/\//, (route) => {
      report.offlineRequests.push(route.request().url());
      return route.abort('internetdisconnected');
    });
    const filePage = await offline.newPage();
    filePage.on('pageerror', (error) => report.errors.push(`offline: ${error.message}`));
    await filePage.goto(pathToFileURL(resolve(ROOT, 'public/designx/index.html')).href, { waitUntil: 'domcontentloaded' });
    await waitForDeck(filePage);
    await filePage.locator('#next-slide').click();
    await expect(filePage.locator('#slide-02')).toBeVisible();
    await filePage.keyboard.press('End');
    await expect(filePage.locator(`#slide-${String(SLIDE_COUNT).padStart(2, '0')}`)).toBeVisible();
    await filePage.keyboard.press('n');
    await expect(filePage.locator('#speaker-notes')).toBeVisible();
    await filePage.keyboard.press('Escape');
    await expect(filePage.locator('#speaker-notes')).not.toBeVisible();
    assert.equal(report.offlineRequests.length, 0, `offline launch attempted network resources: ${report.offlineRequests.join(', ')}`);
    await offline.close();
  });

  await check('no runtime errors or presentation resources outside /designx', async () => {
    assert.equal(report.errors.length, 0, `Runtime errors: ${report.errors.join('; ')}`);
    assert.equal(report.outsideDeckRequests.length, 0, `Deck must be self-contained: ${[...new Set(report.outsideDeckRequests)].join('; ')}`);
  });
} finally {
  await writeFile(resolve(output, 'browser-check.json'), JSON.stringify(report, null, 2));
  await browser.close();
}

const failed = report.checks.filter((result) => result.status === 'fail');
if (failed.length) throw new Error(`${failed.length} DesignX checks failed. See qa-out/designx/browser-check.json.`);
console.log(`DesignX: ${report.checks.length} browser checks passed across five viewports, interactive visual states, modal navigation, print and offline launch.`);
