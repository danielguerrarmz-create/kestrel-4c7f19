/** Run after the PDF authoring workflow has been initialized. Requires the local site server. */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { assertPrintSlides, DECK_META, inspectSlides, openBrowser, printUrl, ROOT, SLIDE_COUNT, waitForDeck } from './browser.mjs';

if (!DECK_META.exportReady || SLIDE_COUNT !== DECK_META.targetSlideCount) {
  throw new Error('DesignX export is disabled or its scene count differs from the authored target. Set the intended revision status and export readiness in slides.js before exporting.');
}

const filename = 'Bower_DesignX_Buildings_That_Grow.pdf';
const outputDirectory = resolve(ROOT, 'output/pdf');
const captureDirectory = resolve(ROOT, 'qa-out/designx/slides');
const downloadDirectory = resolve(ROOT, 'public/designx/downloads');
await Promise.all([outputDirectory, captureDirectory, downloadDirectory].map((path) => mkdir(path, { recursive: true })));

const browser = await openBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, reducedMotion: 'reduce' });
  // Chromium embeds WebP photos as oversized lossless pixel streams. Supply JPEG
  // bytes to this export browser only; the website keeps its original WebP files.
  // Small technical evidence stays lossless, and slide text/diagrams stay vector.
  const photoCache = new Map();
  await page.route(/\/designx\/assets\/.*\.webp(?:\?.*)?$/, async route => {
    const filename = decodeURIComponent(new URL(route.request().url()).pathname.slice('/designx/assets/'.length));
    if (!/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.webp$/i.test(filename)) return route.continue();
    const bytes = await readFile(resolve(ROOT, 'public/designx/assets', filename));
    const metadata = await sharp(bytes).metadata();
    if (metadata.width < 1800) return route.continue();
    if (!photoCache.has(filename)) {
      photoCache.set(filename, await sharp(bytes).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 88, chromaSubsampling: '4:4:4' }).toBuffer());
    }
    await route.fulfill({ status: 200, contentType: 'image/jpeg', body: photoCache.get(filename) });
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(printUrl(), { waitUntil: 'domcontentloaded' });
  if (response && !response.ok()) throw new Error(`Presentation returned HTTP ${response.status()}.`);
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  await waitForDeck(page);
  const slides = await inspectSlides(page);
  assertPrintSlides(slides);
  if (errors.length) throw new Error(errors.join('\n'));
  for (const slide of slides) {
    await page.locator(`#${slide.id}`).screenshot({ path: resolve(captureDirectory, `${slide.id}.png`), animations: 'disabled' });
  }
  const output = resolve(outputDirectory, filename);
  await page.pdf({
    path: output,
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
    tagged: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await copyFile(output, resolve(downloadDirectory, filename));
  await writeFile(resolve(captureDirectory, 'export-report.json'), JSON.stringify({ url: printUrl(), output, slides, errors }, null, 2));
  console.log(`Exported ${slides.length} slides: ${output}`);
  console.log(`Screenshots: ${captureDirectory}`);
} finally {
  await browser.close();
}
