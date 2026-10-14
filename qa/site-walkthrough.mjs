/**
 * Whole-site visual smoke test for every public route at desktop and phone sizes.
 *
 * Captures top, middle and end frames while checking every scroll position for
 * horizontal overflow, unloaded images, browser errors and broken page titles.
 * Output defaults to the OS temp directory so review artifacts never dirty Git.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
import { launch, setReducedMotion, setViewport } from './lib.mjs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:5333';
const OUTPUT = process.env.OUTPUT ?? join(tmpdir(), 'bower-site-walkthrough');
const routes = ['/', '/gallery', '/process', '/about', '/about/practice', '/contact', '/press', '/privacy', '/questions'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900, dpr: 1, mobile: false },
  { name: 'mobile', width: 390, height: 844, dpr: 2, mobile: true },
];

await mkdir(OUTPUT, { recursive: true });
const { browser, page } = await launch(viewports[0]);
const results = [];

try {
  await setReducedMotion(page, true);
  for (const viewport of viewports) {
    await setViewport(page, viewport);
    for (const route of routes) {
      const errors = [];
      const onConsole = (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      };
      const onPageError = (error) => errors.push(`page: ${error.message}`);
      page.on('console', onConsole);
      page.on('pageerror', onPageError);

      const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 45000 });
      await page.evaluate(() => document.fonts?.ready);
      const metrics = await page.evaluate(async () => {
        const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        const step = Math.max(1, Math.round(window.innerHeight * 0.72));
        let maxOverflow = 0;
        for (let y = 0; y <= height - window.innerHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          maxOverflow = Math.max(maxOverflow, document.documentElement.scrollWidth - window.innerWidth);
        }
        window.scrollTo(0, 0);
        return {
          title: document.title,
          height,
          width: document.documentElement.scrollWidth,
          maxOverflow,
          images: [...document.images].map((image) => ({
            src: image.currentSrc || image.src,
            complete: image.complete,
            naturalWidth: image.naturalWidth,
            displayed: getComputedStyle(image).display !== 'none' &&
              getComputedStyle(image).visibility !== 'hidden' &&
              Number(getComputedStyle(image).opacity) > 0,
          })),
          h1: document.querySelector('h1')?.textContent?.trim() ?? '',
          footer: Boolean(document.querySelector('footer')),
        };
      });

      const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
      const stops = [
        ['top', 0],
        ['middle', Math.max(0, Math.round((metrics.height - viewport.height) / 2))],
        ['end', Math.max(0, metrics.height - viewport.height)],
      ];
      for (const [label, y] of stops) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await new Promise((resolve) => setTimeout(resolve, 180));
        await page.screenshot({ path: join(OUTPUT, `${viewport.name}-${slug}-${label}.png`) });
      }

      results.push({
        viewport: viewport.name,
        route,
        status: response?.status() ?? 0,
        ...metrics,
        unloadedImages: metrics.images.filter((image) => image.displayed && image.naturalWidth === 0),
        errors,
      });
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      console.log(`${viewport.name.padEnd(7)} ${route.padEnd(16)} status=${response?.status()} overflow=${metrics.maxOverflow}px images=${metrics.images.length} errors=${errors.length}`);
    }
  }
} finally {
  await browser.close();
}

await writeFile(join(OUTPUT, 'report.json'), JSON.stringify(results, null, 2));
for (const viewport of viewports) {
  const files = routes.flatMap((route) => {
    const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
    return ['top', 'middle', 'end'].map((stop) => join(OUTPUT, `${viewport.name}-${slug}-${stop}.png`));
  });
  const thumbWidth = viewport.mobile ? 130 : 300;
  const thumbHeight = 190;
  const thumbs = await Promise.all(files.map((file) => sharp(file).resize(thumbWidth, thumbHeight, { fit: 'cover', position: 'top' }).png().toBuffer()));
  await sharp({ create: { width: thumbWidth * 3, height: thumbHeight * routes.length, channels: 3, background: '#ecefe9' } })
    .composite(thumbs.map((input, index) => ({ input, left: (index % 3) * thumbWidth, top: Math.floor(index / 3) * thumbHeight })))
    .png()
    .toFile(join(OUTPUT, `${viewport.name}-contact-sheet.png`));
}
const failures = results.filter((result) =>
  (result.status < 200 || (result.status >= 300 && result.status !== 304)) ||
  result.maxOverflow > 1 || result.unloadedImages.length || result.errors.length
);
console.log(`REPORT ${join(OUTPUT, 'report.json')}`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
