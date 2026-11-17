import assert from 'node:assert/strict';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { openBrowser } from '../scripts/designx/browser.mjs';

// Route every request locally before navigation: this test must never send
// fabricated reading sessions to production analytics.
const distRoot = resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4' };
const browser = await openBrowser();
const report = [];

function decodeBatch(body) {
  if (!body?.length) return [];
  let text = body[0] === 0x1f && body[1] === 0x8b ? gunzipSync(body).toString() : body.toString();
  if (text.startsWith('data=')) text = Buffer.from(new URLSearchParams(text).get('data'), 'base64').toString();
  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : parsed.batch ?? [parsed];
}

async function waitFor(check, message) {
  const deadline = Date.now() + 12000;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(message);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function setup() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce',
    // SDK bot filtering intentionally excludes the browser's default HeadlessChrome UA.
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
  });
  const events = [], errors = [], analyticsRequests = [], decodeErrors = [];
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname.endsWith('.posthog.com')) {
      analyticsRequests.push({ path: url.pathname, method: request.method() });
      if (request.method() === 'POST' && /\/e\/?$|\/capture\/?$|\/batch\/?$/.test(url.pathname)) {
        try { events.push(...decodeBatch(request.postDataBuffer())); }
        catch (error) { decodeErrors.push(`${url.pathname}: ${error.message}`); }
      }
      if (url.pathname.endsWith('.js')) return route.fulfill({ contentType: 'text/javascript', body: '' });
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({
        featureFlags: {}, featureFlagPayloads: {}, sessionRecording: false, supportedCompression: ['gzip-js'],
        config: { enable_heatmaps: false, sessionRecording: false },
      }) });
    }
    if (!['www.bowerbuild.org', 'bowerbuild.org', '127.0.0.1', 'preview.vercel.app'].includes(url.hostname)) return route.abort();
    let file = resolve(distRoot, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(distRoot + sep)) return route.abort();
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      const body = await readFile(file);
      const contentType = types[extname(file)] ?? 'application/octet-stream';
      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers().range ?? '');
      if (range) {
        const start = Number(range[1] || 0), end = range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
        return route.fulfill({ status: 206, contentType, headers: { 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${body.length}` }, body: body.subarray(start, end + 1) });
      }
      return route.fulfill({ status: 200, contentType, body });
    } catch { return route.fulfill({ status: 404, body: 'Not found' }); }
  });
  return { context, events, errors, analyticsRequests, decodeErrors };
}

try {
  for (const target of ['https://www.bowerbuild.org/designx', 'https://bowerbuild.org/designx/v8/#slide-08']) {
    const state = await setup();
    const page = await state.context.newPage();
    await page.goto(target);
    await page.waitForFunction(() => window.DESIGNX?.count === 16);
    const initialSlide = await page.evaluate(() => window.DESIGNX.current);
    await page.keyboard.press('ArrowRight');
    await page.evaluate(() => {
      // Keep the test in one tab but exercise the real click listener.
      document.getElementById('pdf-link').addEventListener('click', event => event.preventDefault(), { once: true });
      document.getElementById('pdf-link').click();
    });
    await waitFor(() => state.events.some(event => event.event === 'designx_print_opened'), `No captured print event: ${JSON.stringify(state.analyticsRequests)}; ${state.decodeErrors}`);
    const names = state.events.map(event => event.event);
    assert.equal(names.filter(name => name === '$pageview').length, 1);
    assert.equal(names.filter(name => name === 'designx_deck_viewed').length, 1);
    const slides = state.events.filter(event => event.event === 'designx_slide_viewed');
    assert.deepEqual(slides.map(event => event.properties.slide_number), [initialSlide, initialSlide + 1]);
    assert.ok(slides.every(event => event.properties.$pathname === '/designx' && event.properties.slide_count === 16));
    assert.deepEqual(state.errors, []);
    assert.deepEqual(state.decodeErrors, []);
    report.push({ target, events: state.events.filter(event => event.event === '$pageview' || event.event.startsWith('designx_')).map(event => ({ event: event.event, slide: event.properties.slide_number, count: event.properties.slide_count, path: event.properties.$pathname })), errors: state.errors });
    await state.context.close();
  }
  for (const target of ['http://127.0.0.1:5333/designx', 'https://preview.vercel.app/designx', 'https://www.bowerbuild.org/designx?print=1']) {
    const state = await setup();
    const page = await state.context.newPage();
    await page.goto(target);
    await page.waitForFunction(() => window.DESIGNX?.count === 16);
    await page.waitForTimeout(600);
    assert.deepEqual(state.analyticsRequests, [], `Analytics should be silent for ${target}`);
    assert.deepEqual(state.errors, []);
    report.push({ target, analyticsRequests: 0, errors: state.errors });
    await state.context.close();
  }
  await mkdir('qa-out/designx/analytics', { recursive: true });
  await writeFile('qa-out/designx/analytics/report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log('PASS: built SDK sends page/deck/slide/print events; local, preview and print are silent. All requests intercepted, no production traffic sent.');
} finally { await browser.close(); }
