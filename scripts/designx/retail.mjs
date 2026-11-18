/** Validate, capture and export the separate CRE retail edition. */
import { mkdir, writeFile, readFile, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { openBrowser, waitForDeck, inspectSlides, assertPrintSlides, ROOT } from './browser.mjs';

const base = process.env.DESIGNX_RETAIL_URL || 'http://127.0.0.1:5333/cre-retail';
const capture = resolve(ROOT, 'qa-out/designx/retail');
const downloads = resolve(ROOT, 'public/designx/retail/downloads');
const output = resolve(ROOT, 'output/pdf/Bower_CRE_Retail.pdf');
await Promise.all([capture, downloads, resolve(ROOT, 'output/pdf')].map(path => mkdir(path, { recursive: true })));
const browser = await openBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const failures = [];
  page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  // Serve the authorized local public files inside the browser for sandboxed QA.
  // The site routes are separately checked by documentRoutes.test.ts.
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.pdf': 'application/pdf' };
  await page.route('http://127.0.0.1:5333/**', async route => {
    let pathname = decodeURIComponent(new URL(route.request().url()).pathname);
    if (pathname.includes('..')) return route.abort();
    if (/^\/(?:designx\/retail|cre-retail)\/?$/.test(pathname)) pathname = '/designx/retail/index.html';
    const extension = pathname.slice(pathname.lastIndexOf('.'));
    try { await route.fulfill({ status: 200, contentType: mime[extension] || 'application/octet-stream', body: await readFile(resolve(ROOT, `public${pathname}`)) }); }
    catch { await route.fulfill({ status: 404, body: 'Local asset not found' }); }
  });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await waitForDeck(page);
  if (await page.locator('.slide').count() !== 14) throw new Error('Expected 14 retail slides.');
  const fonts = await page.evaluate(async () => {
    await document.fonts.load('400 76px "Argesta Display"');
    await document.fonts.load('italic 76px "Argesta Display"');
    await document.fonts.load('400 28px "Safiro"');
    await document.fonts.load('500 24px "Safiro"');
    return [...document.fonts].filter(face => face.status === 'loaded').map(face => ({ family: face.family, style: face.style, weight: face.weight }));
  });
  for (const family of ['Argesta Display', 'Safiro']) {
    if (!fonts.some(font => font.family.replaceAll('"', '') === family)) throw new Error(`Font not loaded: ${family}`);
  }
  await page.keyboard.press('ArrowRight');
  if (await page.evaluate(() => window.DESIGNX.current) !== 2) throw new Error('Keyboard navigation failed.');
  await page.getByRole('button', { name: 'Sources', exact: true }).click();
  if (!await page.locator('#speaker-notes').evaluate(dialog => dialog.open)) throw new Error('Sources did not open.');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open slide index' }).click();
  await page.locator('[data-go="5"]').click();
  if (await page.evaluate(() => window.DESIGNX.current) !== 6) throw new Error('Slide index failed.');
  for (const viewport of [{ width: 1600, height: 1000 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const fit = await page.locator('#deck').boundingBox();
    if (fit.x < -1 || fit.y < -1 || fit.x + fit.width > viewport.width + 1 || fit.y + fit.height > viewport.height + 1) throw new Error(`Deck outside viewport: ${JSON.stringify(viewport)}`);
    await page.screenshot({ path: resolve(capture, `viewport-${viewport.width}.png`) });
  }
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.route(/\/designx\/.*\.(webp|png)(?:\?.*)?$/, async route => {
    const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
    if (pathname.includes('..')) throw new Error('Invalid asset path');
    const bytes = await readFile(resolve(ROOT, `public${pathname}`));
    const metadata = await sharp(bytes).metadata();
    if (metadata.hasAlpha || metadata.width < 1800) return route.fallback();
    return route.fulfill({ status: 200, contentType: 'image/jpeg', body: await sharp(bytes).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 89, chromaSubsampling: '4:4:4' }).toBuffer() });
  });
  await page.goto(`${base}?print=1`, { waitUntil: 'domcontentloaded' });
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  await waitForDeck(page);
  const slides = await inspectSlides(page);
  assertPrintSlides(slides);
  const text = await page.locator('#deck').innerText();
  for (const [index] of slides.entries()) await page.locator(`#slide-${String(index + 1).padStart(2, '0')}`).screenshot({ path: resolve(capture, `slide-${String(index + 1).padStart(2, '0')}.png`), animations: 'disabled' });
  await page.pdf({ path: output, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, tagged: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await copyFile(output, resolve(downloads, 'Bower_CRE_Retail.pdf'));
  if (errors.length || failures.length) throw new Error(JSON.stringify({ errors, failures }));
  await writeFile(resolve(capture, 'report.json'), JSON.stringify({ url: base, fonts, slides, errors, failures, output }, null, 2));
  await writeFile(resolve(capture, 'slide-text.txt'), text);
  const thumbs = await Promise.all(slides.map((_, index) => sharp(resolve(capture, `slide-${String(index + 1).padStart(2, '0')}.png`)).resize(480, 270).png().toBuffer()));
  await sharp({ create: { width: 1440, height: 1350, channels: 3, background: '#d7ddcf' } }).composite(thumbs.map((input, index) => ({ input, left: (index % 3) * 480, top: Math.floor(index / 3) * 270 }))).png().toFile(resolve(capture, 'montage.png'));
  console.log(JSON.stringify({ slides: slides.length, fonts, output, capture, errors, failures }, null, 2));
} finally {
  await browser.close();
}
