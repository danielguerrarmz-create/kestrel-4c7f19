/** Run after the PDF authoring workflow has been initialized. Requires the local site server. */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { assertPrintSlides, inspectSlides, openBrowser, printUrl, ROOT, waitForDeck } from './browser.mjs';

const args = process.argv.slice(2);
if (args.length > 1 || args.some(argument => !/^--edition=[34]$/.test(argument))) throw new Error('Supported export options: --edition=3 or --edition=4');
const edition = args[0]?.slice('--edition='.length) ?? '1';
const numberedEdition = edition !== '1';
const deckUrl = numberedEdition ? (process.env[`DESIGNX_V${edition}_URL`] ?? `http://127.0.0.1:5333/designx/${edition}`) : undefined;
const filename = numberedEdition ? `Bower_DesignX_Buildings_That_Grow_0${edition}.pdf` : 'Bower_DesignX_Buildings_That_Grow.pdf';
const outputDirectory = resolve(ROOT, 'output/pdf');
const captureDirectory = resolve(ROOT, numberedEdition ? `qa-out/designx/edition-0${edition}/print` : 'qa-out/designx/slides');
const downloadDirectory = resolve(ROOT, numberedEdition ? `public/designx/${edition}/downloads` : 'public/designx/downloads');
await Promise.all([outputDirectory, captureDirectory, downloadDirectory].map((path) => mkdir(path, { recursive: true })));

const browser = await openBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, reducedMotion: 'reduce' });
  // Chromium embeds WebP photos as oversized lossless pixel streams. Supply JPEG
  // bytes to this export browser only; the website keeps its original WebP files.
  // Small technical evidence stays lossless, and slide text/diagrams stay vector.
  const photoCache = new Map();
  await page.route(/\/designx\/(?:[34]\/)?assets\/.*\.webp(?:\?.*)?$/, async route => {
    const filename = decodeURIComponent(new URL(route.request().url()).pathname.slice('/designx/'.length));
    if (!/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.webp$/i.test(filename)) return route.continue();
    const bytes = await readFile(resolve(ROOT, 'public/designx', filename));
    const metadata = await sharp(bytes).metadata();
    const editionPhoto = /^3\/assets\/(?:world-under-construction|living-structure)\.webp$/.test(filename);
    if (metadata.width < 1800 && !editionPhoto) return route.continue();
    if (!photoCache.has(filename)) {
      photoCache.set(filename, await sharp(bytes).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 88, chromaSubsampling: '4:4:4' }).toBuffer());
    }
    await route.fulfill({ status: 200, contentType: 'image/jpeg', body: photoCache.get(filename) });
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(printUrl(deckUrl), { waitUntil: 'domcontentloaded' });
  if (response && !response.ok()) throw new Error(`Presentation returned HTTP ${response.status()}.`);
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  await waitForDeck(page);
  const renderedMeta = await page.evaluate(() => window.DESIGNX_META);
  if (!renderedMeta.exportReady || (numberedEdition && renderedMeta.edition !== Number(edition))) throw new Error('The rendered document does not match the requested export edition.');
  const slides = await inspectSlides(page);
  if (slides.length !== renderedMeta.targetSlideCount) throw new Error('The rendered slide count differs from this edition’s authored target.');
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
  await writeFile(resolve(captureDirectory, 'export-report.json'), JSON.stringify({ url: printUrl(deckUrl), output, slides, errors }, null, 2));
  console.log(`Exported ${slides.length} slides: ${output}`);
  console.log(`Screenshots: ${captureDirectory}`);
} finally {
  await browser.close();
}
