// Focused edition 08 integration QA. HTTP assets come from disk; no downloads required.
// Set DECK_FS_ROUTE=0 to exercise an already-running local server instead.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, resolve, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/BOWER/Bower_Web/node_modules/playwright');
const href = process.env.DECK_URL || 'http://localhost:5312/designx/v8/';
const origin = new URL(href).origin;
const expectedThemes = ['cover', 'v7-growth-slide', 'v8-time-experiment-slide', 'v8-light-slide', 'v8-space-slide', 'v8-ground-slide', 'v7-anatomy-slide', 'v7-computation-slide', 'v8-engine-slide', 'variability-slide', 'factory-slide', 'factory-focus-slide', 'buyers-slide', 'commercial-loop-slide', 'v7-commercial-model-slide', 'v8-care-slide', 'v7-learning-flow-slide', 'team-slide', 'material-problem-slide', 'v7-future-slide', 'closing'];
const result = { passed: [], failures: [], errors: [], missingAssets: [], failedRequests: [], externalRequests: [], slides: [] };
const dependencies = new Set();
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || 'C:/Users/cseif/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe' });
const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
context.setDefaultTimeout(20000); context.setDefaultNavigationTimeout(20000);
const deckRoot = resolve(root, '../..'), piecesRoot = resolve(deckRoot, '../drawings-in-code/exports/deck');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.md': 'text/plain' };
const inside = (file, directory) => file === directory || file.startsWith(directory + sep);
await context.route('**/*', async route => {
  const url = new URL(route.request().url()); dependencies.add(url.href);
  if (url.origin !== origin) { result.externalRequests.push(url.href); await route.abort('blockedbyclient'); return; }
  if (process.env.DECK_FS_ROUTE === '0') { await route.continue(); return; }
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/favicon.ico') { await route.fulfill({ status: 204, body: '' }); return; }
  let file = resolve(deckRoot, `.${pathname}`);
  try {
    if (!inside(file, deckRoot)) throw new Error('Path outside deck');
    let info;
    try { info = await stat(file); }
    catch {
      if (!pathname.startsWith('/designx/pieces/')) throw new Error('Missing deck asset');
      file = resolve(piecesRoot, pathname.slice('/designx/pieces/'.length));
      if (!inside(file, piecesRoot)) throw new Error('Path outside drawing exports');
      info = await stat(file);
    }
    if (info.isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file), contentType = types[extname(file)] || 'application/octet-stream';
    const range = /^bytes=(\d*)-(\d*)$/.exec(route.request().headers().range || '');
    if (range && (range[1] || range[2])) {
      const start = range[1] ? Number(range[1]) : Math.max(0, body.length - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      if (start > end || start >= body.length) return route.fulfill({ status: 416, headers: { 'Content-Range': `bytes */${body.length}` }, body: '' });
      await route.fulfill({ status: 206, contentType, headers: { 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': String(end - start + 1) }, body: body.subarray(start, end + 1) });
    } else await route.fulfill({ status: 200, contentType, headers: { 'Accept-Ranges': 'bytes' }, body });
  } catch (error) { await route.fulfill({ status: 404, contentType: 'text/plain', body: `${pathname}: ${error.message}` }); }
});
const page = await context.newPage();
let expectingLoadFailure = false;
page.on('pageerror', error => result.errors.push(error.message));
page.on('response', response => { if (response.status() >= 400 && !expectingLoadFailure) result.missingAssets.push({ status: response.status(), url: response.url() }); });
page.on('requestfailed', request => { const error = request.failure()?.errorText || ''; if (!expectingLoadFailure && !/ERR_ABORTED|NS_BINDING_ABORTED/.test(error)) result.failedRequests.push({ url: request.url(), error }); });
const hostSelector = (kind, mode = 'time') => `[data-v8-study="${kind}"]${kind === 'growth' ? `[data-growth-mode="${mode}"]` : ''}`;
const host = (kind, mode = 'time') => page.locator(hostSelector(kind, mode));
const frames = (count = 12) => page.evaluate(n => new Promise(done => { const step = () => --n <= 0 ? done() : requestAnimationFrame(step); requestAnimationFrame(step); }), count);
async function test(name, fn) {
  if(process.env.DECK_TEST && !new RegExp(process.env.DECK_TEST).test(name)) return;
  console.log(`[v8 QA] START ${name}`);
  try { await fn(); result.passed.push(name); console.log(`[v8 QA] PASS ${name}`); }
  catch (error) { result.failures.push({ name, message: error.stack || error.message }); console.log(`[v8 QA] FAIL ${name}: ${error.message}`); }
  finally { await page.evaluate(() => document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close())).catch(() => {}); }
}
async function activate(theme) {
  const number = await page.evaluate(theme => {
    const index = window.DESIGNX_SLIDES.findIndex(slide => slide.theme.split(' ').includes(theme));
    if (index < 0) throw new Error(`Missing slide theme: ${theme}`);
    window.DESIGNX.goTo(index + 1); return index + 1;
  }, theme);
  const slide = page.locator(`#slide-${String(number).padStart(2, '0')}.is-active`); await slide.waitFor(); return slide;
}
async function ready(kind, mode = 'time') {
  await page.waitForFunction(({ kind, selector }) => { const el = document.querySelector(selector); return el?.querySelector('.v8-study')?.dataset.ready === 'true' && (kind === 'growth' ? el.querySelector('.v8-growth-message')?.hidden : el.querySelector('iframe')?.contentWindow.__ready && el.querySelector('.v8-study-loading')?.hidden); }, { kind, selector: hostSelector(kind, mode) });
}
async function snapshot(kind, mode = 'time') {
  return host(kind, mode).evaluate((el, kind) => {
    const doc = el.querySelector('iframe')?.contentDocument;
    if(kind==='growth') {
      const state=el.v8Controller.getState();
      return {mode:state.mode,view:state.view,renderer:state.renderer,duration:state.duration,range:Number(el.querySelector('input[type=range]').value),play:el.querySelector('[data-v8-study-play]').textContent,caption:el.querySelector('output').textContent,childPosition:Math.round(state.time/state.duration*1000),renderedFrame:state.renderedFrame,canvasLabel:el.querySelector('canvas').getAttribute('aria-label')};
    }
    return { mode: el.querySelector('.v8-study')?.dataset.mode, range: Number(el.querySelector('input')?.value), play: el.querySelector('[data-v8-study-play]')?.textContent, caption: el.querySelector('output')?.textContent,
      childPosition: kind === 'growth' ? Number(doc?.getElementById('scrub')?.value) : parseFloat(doc?.getElementById('fill')?.style.width || 'NaN') * 10 };
  }, kind);
}
async function pausedStable(kind, mode = 'time') {
  const before = await snapshot(kind, mode); assert.equal(before.play, 'Play', `${kind}/${mode} should be paused`); await frames();
  const after = await snapshot(kind, mode); assert.equal(after.range, before.range, 'Parent timeline moved while paused'); assert.equal(after.childPosition, before.childPosition, 'Child drawing moved while paused'); return after;
}
async function setRange(kind, value, mode = 'time') {
  await host(kind, mode).locator('input[type=range]').evaluate((el, value) => { el.value = String(value); el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
  await ready(kind, mode); await frames(2); const state = await pausedStable(kind, mode); assert.equal(state.range, value); assert.ok(Math.abs(state.childPosition - value) <= 1, `Child seek ${state.childPosition} differs from ${value}`); return state;
}
async function inspectGrowth(mode = 'time', open = true) {
  const details = host('growth', mode).locator('details');
  if (await details.evaluate(el => el.open) !== open) await details.locator('summary').click();
}

const experiment = () => page.locator('[data-v8-time-experiment]');
async function experimentState() { return experiment().evaluate(el => el.v8Controller.getState()); }
async function experimentReady() {
  await page.waitForFunction(() => {
    const state = document.querySelector('[data-v8-time-experiment]')?.v8Controller?.getState();
    return state?.ready && !state.error;
  });
}
async function experimentPaused() {
  const before = await experimentState(); assert.equal(before.playing, false, 'Time experiment should be paused');
  await frames(); const after = await experimentState();
  assert.equal(after.time, before.time, 'Experiment time moved while paused');
  return after;
}
async function experimentSeek(fraction) {
  await experiment().getByRole('slider', { name:'Time since planting', exact:true }).evaluate((el, fraction) => {
    el.value = String(Number(el.min || 0) + fraction * (Number(el.max || 100) - Number(el.min || 0)));
    el.dispatchEvent(new Event('input', { bubbles:true }));
  }, fraction);
  await experimentReady(); await frames(2);
  const state = await experimentPaused();
  assert.ok(Math.abs(state.time / state.duration - fraction) < .003, `Experiment seek differs from ${fraction}`);
  return state;
}

async function drawingDominates(slide) {
  const layout = await slide.evaluate(el => {
    const drawing = el.querySelector('.v8-growth-screen').getBoundingClientRect(), bounds = el.getBoundingClientRect();
    const title = el.querySelector('.v7-title'), heading = title.getBoundingClientRect();
    return { share: drawing.width * drawing.height / (bounds.width * bounds.height), titleInside: heading.top >= drawing.top && heading.bottom <= drawing.bottom, italic: getComputedStyle(title).fontStyle };
  });
  assert.ok(layout.share > .92, `Drawing occupies only ${(layout.share*100).toFixed(1)}% of the slide`);
  assert.equal(layout.titleInside,true,'Editorial title should sit over the drawing');
  assert.equal(layout.italic,'italic');
}
async function screenshot(name, locator = page.locator('.slide.is-active')) {
  await page.evaluate(() => document.fonts.ready); await locator.evaluate(el => Promise.all([...el.querySelectorAll('img')].map(img => img.decode().catch(() => {}))));
  await locator.evaluate(el => Promise.all(el.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))));
  await frames(2); await locator.screenshot({ path: resolve(root, `.qa/${name}.png`) });
}
async function openStudy(kind) { await page.locator(`.slide.is-active [data-v8-open="${kind}"]`).click(); await page.locator('.v8-study-dialog[open]').waitFor(); await ready(kind); }
async function closeStudy() { await page.locator('.v8-study-dialog[open]').getByRole('button', { name: 'Return to slide ×', exact: true }).click(); await page.waitForFunction(() => !document.querySelector('.v8-study-dialog')?.open); }
async function factoryReady(viewer, id) { await page.waitForFunction(({ viewer, id }) => { const state = window.DESIGNX_FACTORY?.getStates().find(item => item.viewer === viewer); return state?.id === id && state.duration > 0; }, { viewer, id }); }

await mkdir(resolve(root, '.qa'), { recursive: true });
try {
  console.log('[v8 QA] Loading edition 08'); await page.goto(href); await page.waitForFunction(() => Boolean(window.DESIGNX && window.DESIGNX_V8_STORY));
  result.slides = await page.evaluate(() => window.DESIGNX_SLIDES.map((slide, i) => ({ number: i + 1, title: slide.title, theme: slide.theme })));
  await test('Twenty-one-slide narrative preserves the original Time drawing beside its experiment', async () => {
    assert.deepEqual(result.slides.map(slide => slide.theme.split(' ')[0]), expectedThemes); assert.equal(await page.evaluate(() => window.DESIGNX_V8_STORY.length), expectedThemes.length);
    assert.match(await page.locator('body').getAttribute('class'), /designx-v7/); assert.match(await page.locator('body').getAttribute('class'), /designx-v8/);
  });
  await test('Learning phases and first-reference evidence remain clear', async () => {
    const proof = await activate('commercial-loop-slide');
    assert.match(await proof.innerText(), /missing reference/i);
    assert.match(await proof.innerText(), /Conversations in England/);
    assert.match(await proof.innerText(), /wanted to see one completed Bower/);
    assert.equal(await proof.locator('[data-flywheel]').count(),0);
    assert.ok(Number.isFinite(await page.evaluate(() => window.DESIGNX_SLIDES.find(slide => slide.theme.includes('v8-reference-slide')).sourceIndex)),'Reference slide must retain its original comparison target');
    await screenshot('slide-14-reference',proof);
    const learning = await activate('v7-learning-flow-slide');
    assert.deepEqual(await learning.locator('.v7flow-phase').allTextContents(),['Designing each Bower','Making and living with it']);
    for (const phase of await learning.locator('.v7flow-phase').all()) assert.ok(await phase.isVisible(),'Learning phase label should be visible');
    assert.match(await learning.locator('.v7flow-status').innerText(),/Digital geometry and growth studies exist/);
    assert.equal(await learning.locator('[data-v7flow-select="growing"]').getAttribute('aria-pressed'),'true');
    await screenshot('slide-17-learning-initial',learning);
  });
  await test('Reference reveal plays once and holds its final image without controls', async () => {
    const reference = await activate('v8-reference-slide');
    const picture = reference.locator('.v8-reference-visual img');
    assert.equal(await reference.locator('input,button').count(),0);
    await page.waitForFunction(() => document.querySelector('.v8-reference-visual img').style.opacity === '1', null, {timeout:12000});
    assert.equal(await picture.evaluate(el=>getComputedStyle(el).opacity),'1');
    assert.equal(await picture.evaluate(el=>el.getAnimations().length),0);
    await activate('buyers-slide'); await activate('v8-reference-slide'); await frames(12);
    assert.equal(await picture.evaluate(el=>getComputedStyle(el).opacity),'1');
    assert.equal(await picture.evaluate(el=>el.getAnimations().length),0);
    await screenshot('slide-14-reference-complete',reference);
  });
  await test('Engine keeps making, growth and budget distinct from the pier example', async () => {
    const engine = await activate('v8-engine-slide');
    for (const text of ['Can we make it?', 'Can it grow?', 'Can we afford it?', 'Fabricatability', 'Plantability', 'Cost']) assert.ok((await engine.innerText()).replace(/\s+/g,' ').includes(text));
    assert.equal(await engine.locator('[data-v8-engine-check]').count(),9);
    await engine.getByRole('button',{name:'Installation',exact:true}).click();
    assert.match(await engine.locator('[data-v8-engine-text]').innerText(),/installed cost against the budget/);
    assert.equal(await engine.locator('[aria-pressed="true"]').count(),1);
    await engine.getByRole('button',{name:'Light',exact:true}).click();
    assert.match(await engine.locator('[data-v8-engine-text]').innerText(),/orientation and openings/);
    await screenshot('slide-09-engine',engine);
    await activate('v7-computation-slide');
    assert.equal(await page.locator('[data-v8-engine]').count(),1);
    assert.equal(await page.locator('[data-v8-consequences]').count(),1);
  });
  await test('Customer discussions and proposed commercial terms remain intact', async () => {
    const buyers = await activate('buyers-slide');
    for (const label of ['Private gardens', 'Cultural destinations', 'Hospitality', 'In discussion']) assert.match(await buyers.innerText(), new RegExp(label, 'i'));
    for (const name of ['Eden Project', 'The Newt', '25hours']) assert.equal(await buyers.getByRole('img', { name, exact: true }).count(), 1);
    assert.equal(await buyers.locator('video, [data-customer-play], .film-explore').count(),0);
    assert.equal(await buyers.locator('.buyer-triptych figure').count(),3);
    assert.equal(await buyers.locator('.prospect-logo').count(),3);
    assert.doesNotMatch(await buyers.innerText(),/Meeting scheduled|Canary Wharf Group/i);
    assert.match(await buyers.innerText(), /not signed commissions/i); await screenshot('slide-13-customers', buyers);
    const offer = await activate('v7-commercial-model-slide');
    for (const pattern of [/£65,000/, /Deducted from total build cost/i, /Fixed\s+build price/i, /Annual\s+care/i]) assert.match(await offer.innerText(), pattern);
    await screenshot('slide-15-commercial', offer);
  });
  await test('Original eye-level Time film autoplays assembly and preserves pause and scrubbing', async () => {
    const slide = await activate('v7-growth-slide'); await ready('growth');
    const initial = await snapshot('growth');
    assert.equal(initial.mode,'time'); assert.equal(initial.view,-1); assert.equal(initial.renderer,'film'); assert.equal(initial.play,'Pause');
    assert.ok(Math.abs(initial.duration-51)<.05,'Original film timing must be retained');
    const media = await host('growth').locator('video').evaluate(el => ({ width:el.videoWidth,height:el.videoHeight,ready:el.readyState,source:el.currentSrc }));
    assert.deepEqual([media.width,media.height],[1920,1080]); assert.ok(media.ready>=2); assert.match(media.source,/approach-ink-16x9\.(mp4|webm)$/);
    assert.equal(await slide.locator('[data-v7-growth], [data-v8-open="growth"]').count(),0);
    await drawingDominates(slide);
    assert.equal(await host('growth').locator('button:visible').count(),1,'Only Pause should be visible before inspection');
    await host('growth').locator('[data-v8-study-play]').click(); await ready('growth'); await pausedStable('growth');
    assert.match((await setRange('growth',118)).caption,/Assembly/i);
    await screenshot('slide-02-assembly',slide);
    await inspectGrowth();
    await host('growth').getByRole('button',{name:'Installation',exact:true}).click(); await ready('growth'); assert.match((await pausedStable('growth')).caption,/installation/i);
    await host('growth').getByRole('button',{name:'Growing',exact:true}).click(); await ready('growth'); assert.match((await pausedStable('growth')).caption,/Growth and seasons/i);
    await host('growth').getByRole('button',{name:'Summer',exact:true}).click(); await ready('growth'); assert.match((await pausedStable('growth')).caption,/summer/i);
    await inspectGrowth('time',false);
    const still = await host('growth').locator('canvas').evaluate(el=>el.toDataURL()); await frames();
    assert.equal(await host('growth').locator('canvas').evaluate(el=>el.toDataURL()),still,'Paused film and inhabitants must stay still');
    await screenshot('slide-02-growth',slide);
    await setRange('growth',999); await host('growth').locator('[data-v8-study-play]').click();
    await page.waitForFunction(selector => Number(document.querySelector(selector+' input[type=range]').value)<200,hostSelector('growth'));
    await ready('growth'); assert.match((await snapshot('growth')).caption,/design|Assembly/i,'The original film should loop to its assembly sequence');
    await activate('v7-anatomy-slide');
    assert.equal(await host('growth').evaluate(el=>el.v8Controller.getState().running),false);
    const stopped = await host('growth').locator('video').evaluate(el=>({paused:el.paused,time:el.currentTime}));
    assert.equal(stopped.paused,true); await frames(); assert.equal(await host('growth').locator('video').evaluate(el=>el.currentTime),stopped.time);
    await activate('v7-growth-slide'); await ready('growth'); assert.equal((await snapshot('growth')).play,'Pause');
    const paused = await setRange('growth',555);
    await activate('v7-anatomy-slide'); await activate('v7-growth-slide'); await ready('growth');
    assert.deepEqual(await pausedStable('growth'),paused,'An explicitly paused original film must retain its moment on return');
  });
  await test('Time experiment exposes elapsed years and preserves autoplay, pause and scrubbing', async () => {
    const slide = await activate('v8-time-experiment-slide'); await experimentReady();
    const initial = await experimentState();
    assert.equal(initial.variant,'orbit'); assert.equal(initial.playing,true); assert.equal(initial.active,true);
    assert.ok(initial.duration > 30, 'The experiment should retain time to inspect assembly and growth');
    await page.waitForFunction(time => document.querySelector('[data-v8-time-experiment]').v8Controller.getState().time > time + .1, initial.time);
    const axis = experiment().locator('.v8-time-axis');
    assert.ok(await axis.isVisible());
    for (const label of [/Assembly/i,/Planted/i,/Year\s*2/i,/Year\s*5/i,/Year\s*9/i]) assert.match(await axis.innerText(),label);
    await experiment().getByRole('button',{name:'Pause drawing',exact:true}).click();
    await experimentPaused();
    await experimentSeek(.12); assert.match(await experiment().locator('[data-time-readout]').innerText(),/assembly/i);
    await screenshot('slide-03-time-experiment-assembly',slide);
    await experimentSeek(.64); assert.match(await experiment().locator('[data-time-readout]').innerText(),/Year\s*\d/i);
    const canvas = experiment().locator('canvas');
    const image = await canvas.evaluate(el=>el.toDataURL()); await frames();
    assert.equal(await canvas.evaluate(el=>el.toDataURL()),image,'Paused experimental camera, material and occupants must stay still');
    await screenshot('slide-03-time-experiment-orbit',slide);
    const paused = await experimentState();
    await activate('v8-light-slide');
    assert.equal((await experimentState()).running,false);
    assert.equal((await experimentState()).active,false);
    for (const video of await experiment().locator('video').all()) assert.equal(await video.evaluate(el=>el.paused),true);
    await frames(); assert.equal((await experimentState()).time,paused.time);
    await activate('v8-time-experiment-slide'); await experimentReady();
    assert.equal((await experimentPaused()).time,paused.time,'An explicitly paused experiment should retain its moment on return');
    await experiment().getByRole('button',{name:'Play drawing',exact:true}).click();
    await page.waitForFunction(time=>document.querySelector('[data-v8-time-experiment]').v8Controller.getState().time>time+.1,paused.time);
    await activate('v8-light-slide'); const stopped = await experimentState();
    assert.equal(stopped.running,false); await frames(); assert.equal((await experimentState()).time,stopped.time);
    await activate('v8-time-experiment-slide'); await experimentReady();
    await page.waitForFunction(time=>document.querySelector('[data-v8-time-experiment]').v8Controller.getState().time>time+.1,stopped.time);
    await experiment().getByRole('button',{name:'Pause drawing',exact:true}).click();
  });
  await test('Time camera alternatives preserve the selected year and original drawing', async () => {
    const slide = await activate('v8-time-experiment-slide'); await experimentReady();
    const moment = await experimentSeek(.64);
    const details = experiment().locator('details');
    if(await details.count() && !(await details.evaluate(el=>el.open))) await details.locator('summary').click();
    for (const id of ['fixed','rise','orbit']) {
      await experiment().locator(`[data-time-variant="${id}"]`).click(); await experimentReady();
      const state = await experimentPaused(); assert.equal(state.variant,id);
      assert.ok(Math.abs(state.time-moment.time)<.15,'Changing the camera must preserve the selected year');
      assert.equal(await experiment().locator(`[data-time-variant="${id}"]`).getAttribute('aria-pressed'),'true');
      assert.match(await experiment().locator('[data-time-readout]').innerText(),/Year\s*\d/i);
      await screenshot(`slide-03-time-experiment-${id}`,slide);
    }
    if(await details.count() && await details.evaluate(el=>el.open)) await details.locator('summary').click();
    await activate('v7-growth-slide'); await ready('growth');
    assert.match(await host('growth').locator('video').getAttribute('src'),/approach-ink-16x9\.(mp4|webm)$/);
    assert.equal(await page.locator('.slide.v7-growth-slide').count(),1);
    assert.equal(await page.locator('.slide.v8-time-experiment-slide').count(),1);
  });
  await test('Missing Time experiment film shows its still and recovers on retry', async () => {
    expectingLoadFailure = true;
    const pattern = /\/v8\/assets\/time-experiment\/[^?]+\.(mp4|webm)(?:\?|$)/;
    await page.route(pattern,route=>route.abort('failed'));
    try {
      await page.goto(href+'#slide-03'); await page.reload();
      await page.waitForFunction(()=>document.querySelector('[data-v8-time-experiment]')?.v8Controller?.getState().error);
      const state = await experimentState(); assert.equal(state.ready,false); assert.equal(state.running,false);
      assert.match(await experiment().locator('.v8-time-message').innerText(),/film could not load.*still shows the established room/i);
      assert.ok(await experiment().getByRole('button',{name:'Retry drawing',exact:true}).isVisible());
      const poster = page.locator('.slide.v8-time-experiment-slide .v8-time-experiment-poster');
      assert.ok(await poster.isVisible()); await poster.evaluate(el=>el.decode());
      assert.ok(await poster.evaluate(el=>el.complete&&el.naturalWidth>0),'Load failure must retain a usable still');
      await screenshot('slide-03-time-experiment-fallback',page.locator('.slide.v8-time-experiment-slide'));
      await page.unroute(pattern);
      await experiment().getByRole('button',{name:'Retry drawing',exact:true}).click(); await experimentReady();
      assert.equal((await experimentState()).error,null);
      assert.ok(await experiment().locator('.v8-time-message').isHidden());
      assert.ok(await experiment().locator('video').evaluate(el=>el.readyState>=2&&el.videoWidth>0));
    } finally { await page.unroute(pattern); expectingLoadFailure = false; }
  });
  await test('Timber views remain available alongside the original film', async () => {
    const slide = await activate('v7-growth-slide'); await ready('growth'); await inspectGrowth();
    assert.deepEqual(await host('growth').locator('[data-v8-view]').allTextContents(),['Original ink','Above','Approach','Inside']);
    await host('growth').getByRole('button',{name:'Inside',exact:true}).click(); await ready('growth');
    assert.equal((await snapshot('growth')).view,2); assert.equal((await snapshot('growth')).renderer,'raster');
    assert.equal((await snapshot('growth')).renderedFrame,16);
    assert.equal(await host('growth').getByRole('button',{name:'Design',exact:true}).count(),0);
    await host('growth').getByRole('button',{name:'Winter',exact:true}).click(); await ready('growth'); assert.match((await pausedStable('growth')).caption,/winter/i);
    await host('growth').getByRole('button',{name:'Summer',exact:true}).click(); await ready('growth'); assert.match((await pausedStable('growth')).caption,/summer/i);
    await inspectGrowth('time',false); await screenshot('slide-02-timber-inside',slide); await inspectGrowth();
    await host('growth').locator('[data-v8-assembly]').check(); await ready('growth'); assert.equal((await pausedStable('growth')).renderedFrame,0);
    assert.ok((await setRange('growth',50)).renderedFrame<16); assert.equal((await setRange('growth',100)).renderedFrame,16);
    await host('growth').locator('[data-v8-assembly]').uncheck(); await ready('growth');
    assert.equal((await pausedStable('growth')).renderedFrame,16);
    const raster = await setRange('growth',555);
    await host('growth').getByRole('button',{name:'Original ink',exact:true}).click(); await ready('growth'); assert.equal((await snapshot('growth')).renderer,'film');
    await host('growth').getByRole('button',{name:'Inside',exact:true}).click(); await ready('growth');
    assert.deepEqual(await pausedStable('growth'),raster,'Switching to the original film must not discard the retained timber view');
    await host('growth').getByRole('button',{name:'Inhabitants on',exact:true}).click();
    assert.equal(await host('growth').evaluate(el=>el.v8Controller.getState().occupation),false);
    await inspectGrowth('time',false);
  });
  await test('Light compares three stages and Space keeps its own autoplaying panorama', async () => {
    const light=await activate('v8-light-slide'); await ready('growth','light');
    await drawingDominates(light);
    assert.equal((await snapshot('growth','light')).mode,'light'); assert.equal((await snapshot('growth','light')).play,'Pause');
    assert.deepEqual(await host('growth','light').locator('.v8-light-labels span').allTextContents(),['At installation','Establishing','Mature']);
    assert.ok(await host('growth','light').locator('.v8-light-labels').isVisible());
    assert.match((await snapshot('growth','light')).canvasLabel,/Installation.*establishing.*mature/i);
    assert.equal(await host('growth','light').locator('[data-v8-view]').count(),0);
    await inspectGrowth('light'); await host('growth','light').getByRole('button',{name:'Noon',exact:true}).click(); await ready('growth','light');
    assert.ok([...dependencies].some(url=>url.includes('/v8/assets/light-establishment/frames/light-18.webp')),'Light should load the revised establishment drawing');
    assert.match((await pausedStable('growth','light')).caption,/noon/i); await inspectGrowth('light',false); await screenshot('slide-04-light',light);
    const lightPaused=await snapshot('growth','light');
    const space=await activate('v8-space-slide'); await ready('growth','space');
    await drawingDominates(space);
    assert.equal((await snapshot('growth','space')).mode,'space'); assert.equal((await snapshot('growth','space')).play,'Pause');
    await setRange('growth',555,'space');
    const pan=await host('growth','space').evaluate(el=>el.v8Controller.getState().pan);
    await host('growth','space').locator('canvas').press('Shift+ArrowRight');
    assert.notEqual(await host('growth','space').evaluate(el=>el.v8Controller.getState().pan),pan,'Panorama should remain turnable');
    await pausedStable('growth','space'); await screenshot('slide-05-space',space);
    await activate('v8-light-slide'); await ready('growth','light'); assert.deepEqual(await pausedStable('growth','light'),lightPaused,'Each drawing keeps its own paused moment');
    assert.equal(await host('growth','space').evaluate(el=>el.v8Controller.getState().running),false);
  });
  await test('A scene decision changes the drawing, quantities and review flags together',async()=>{
    const slide=await activate('v7-computation-slide');
    await page.waitForFunction(()=>document.querySelector('[data-v8-consequences]')?.dataset.ready==='true');
    await slide.getByRole('button',{name:'Entrance',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('[data-v8-consequences]')?.dataset.stage==='1');
    assert.match(await slide.innerText(),/3.61 m between the legs/);
    await slide.getByRole('button',{name:'Baseline',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('[data-v8-consequences]')?.dataset.configuration==='baseline');
    assert.match(await slide.innerText(),/4.87 m between the legs/);await screenshot('slide-08-consequences',slide);
    await slide.getByRole('button',{name:'Opened pier',exact:true}).click();await slide.getByRole('button',{name:'Designer review',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('[data-v8-consequences]')?.dataset.stage==='3');
    assert.match(await slide.innerText(),/0.23 m/);assert.match(await slide.innerText(),/0.24 m/);
  });
  await test('Missing original film shows a labelled fallback and recovers on retry',async()=>{
    expectingLoadFailure=true;
    const pattern=/\/approach-ink-16x9\.(mp4|webm)(?:\?|$)/;
    await page.route(pattern,route=>route.abort('failed'));
    try {
      await page.goto(href+'#slide-02'); await page.reload();
      await page.waitForFunction(()=>document.querySelector('[data-v8-study="growth"][data-growth-mode="time"]')?.v8Controller?.getState().fallback);
      assert.match((await snapshot('growth')).caption,/Static fallback.*summer/);
      assert.ok(await host('growth').getByRole('button',{name:'Retry drawing',exact:true}).isVisible());
      await page.unroute(pattern);
      await host('growth').getByRole('button',{name:'Retry drawing',exact:true}).click(); await ready('growth');
      assert.equal((await snapshot('growth')).renderer,'film');
      assert.match((await snapshot('growth')).canvasLabel,/Original eye-level ink film/);
    } finally { await page.unroute(pattern); expectingLoadFailure=false; }
  });
  await test('Missing growth frame has an honest static fallback and recovers on retry',async()=>{
    expectingLoadFailure=true;
    const pattern='**/04-plants-make-space-timber/frames/time-30.webp';
    await page.route(pattern,route=>route.abort('failed'));
    try{
      await page.goto(href+'#slide-02');await page.reload();await ready('growth');await inspectGrowth();
      await host('growth').getByRole('button',{name:'Inside',exact:true}).click(); await ready('growth');
      await host('growth').getByRole('button',{name:'Winter',exact:true}).click();
      await page.waitForFunction(()=>document.querySelector('[data-v8-study="growth"]')?.v8Controller?.getState().fallback);
      assert.match((await snapshot('growth')).caption,/Static fallback.*summer/);
      assert.match((await snapshot('growth')).canvasLabel,/summer/);
      await page.unroute(pattern);
      await host('growth').getByRole('button',{name:'Retry drawing',exact:true}).click();await ready('growth');
      assert.match((await snapshot('growth')).caption,/winter/i);
    }finally{await page.unroute(pattern);expectingLoadFailure=false;}
  });
  await test('Reduced motion, view selection and bounded frame loading',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(href+'#slide-02');await page.reload();await ready('growth');assert.equal((await snapshot('growth')).play,'Play');
    assert.equal((await snapshot('growth')).renderer,'film');
    assert.equal(await host('growth').locator('video').evaluate(el=>el.paused),true);
    await setRange('growth',118);
    await inspectGrowth();
    await host('growth').getByRole('button',{name:'Approach',exact:true}).click();assert.equal((await snapshot('growth')).view,1);
    await host('growth').locator('input[type=range]').evaluate(el=>{for(let i=0;i<=1000;i+=71){el.value=String(i);el.dispatchEvent(new Event('input',{bubbles:true}));}});
    assert.ok(await host('growth').evaluate(el=>el.v8Controller.getState().pendingFrames<=3));await ready('growth');
    for (const [mode,theme] of [['light','v8-light-slide'],['space','v8-space-slide']]) {
      await activate(theme); await ready('growth',mode); assert.equal((await snapshot('growth',mode)).play,'Play');
    }
    await activate('v8-time-experiment-slide'); await experimentReady(); assert.equal((await experimentState()).playing,false);
    await experimentSeek(.64); await experimentPaused();
    await activate('v7-computation-slide');assert.equal(await host('growth').evaluate(el=>el.v8Controller.getState().running),false);
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await test('Learning diagram supports direct inspection without a playback strip',async()=>{
    const slide=await activate('v7-learning-flow-slide');await slide.locator('[data-v7flow-select="growing"]').click();
    assert.equal(await slide.locator('[data-v7-flow]').getAttribute('data-trace-step'),'plantability');
    assert.equal(await slide.locator('input[type="range"], [data-sequence-play]').count(),0);
    await slide.locator('[data-v7flow-node="validation"]').click();
    assert.equal(await slide.locator('[data-v7-flow]').getAttribute('data-trace-step'),'validation');
    assert.match(await slide.locator('[data-v7flow-readout]').innerText(),/Compare observations/);
    await slide.locator('[data-v7flow-node="rules"]').focus();await page.keyboard.press('Enter');
    assert.match(await slide.locator('[data-v7flow-readout]').innerText(),/support spacing or the care plan/);
    await slide.locator('[data-v7flow-select="design"]').click();
    const layout=await slide.evaluate(el=>{
      const input=el.querySelector('[data-v7flow-node="inputs"]'),box=input.querySelector('rect').getBoundingClientRect();
      const lines=[...input.querySelectorAll('text')].map(text=>text.getBoundingClientRect());
      const phase=el.querySelector('.v7flow-phase').getBoundingClientRect(),tabs=el.querySelector('.v7flow-controls').getBoundingClientRect();
      return {padded:lines.every(line=>line.left>box.left+8&&line.right<box.right-8&&line.top>box.top+8&&line.bottom<box.bottom-8),phaseClear:phase.top>tabs.bottom+12&&phase.bottom<box.top-12};
    });
    assert.ok(layout.padded,'Intent and site text should fit with padding on every side');
    assert.ok(layout.phaseClear,'The design phase should sit above its input, clear of tabs');
    await screenshot('slide-17-learning-design',slide);
    await slide.locator('[data-v7flow-select="design"]').focus();await page.keyboard.press('ArrowRight');
    assert.equal(await slide.locator('[data-v7-flow]').getAttribute('data-v7flow-mode'),'making');
    assert.match(await slide.locator('[data-v7flow-readout]').innerText(),/released geometry/);
    await slide.locator('[data-v7flow-node="inputs"]').click();
    assert.equal(await slide.locator('[data-v7flow-select="design"]').getAttribute('aria-pressed'),'true');
    await slide.locator('[data-v7flow-select="all"]').click();await screenshot('slide-17-learning-whole',slide);
  });
  await test('Pier exploration preserves time and other intentions remain placeholders', async () => {
    const slide = await activate('v7-anatomy-slide'); await slide.locator('[data-v7-intent="1"]').click();
    assert.equal(await slide.locator('.v7-drawing-note').isVisible(), true); assert.equal(await slide.locator('.v8-pier-example').isVisible(), false);
    await slide.locator('[data-v7-intent="0"]').click(); assert.equal(await slide.locator('.v8-pier-example').isVisible(), true); await screenshot('slide-07-pier', slide); await openStudy('pier');
    for (const name of ['Planted', 'Shaded', 'Piers open', 'Grown again']) { await host('pier').getByRole('button', { name, exact: true }).click(); assert.ok((await pausedStable('pier')).caption.length); }
    await setRange('pier', 555); await host('pier').locator('[data-v8-study-play]').click(); await page.waitForFunction(() => Number(document.querySelector('[data-v8-study="pier"] input').value) > 555);
    await host('pier').locator('[data-v8-study-play]').click(); const before = await pausedStable('pier'); await screenshot('pier-enlarged', page.locator('.v8-study-dialog[open]'));
    await closeStudy(); await openStudy('pier'); assert.deepEqual(await pausedStable('pier'), before, 'Reopening must retain the paused pier'); await closeStudy();
  });
  await test('Original factory overview and Form / Measure / Machine controls work', async () => {
    const overview = await activate('factory-slide'); await factoryReady('overview', 'overview'); await screenshot('slide-11-factory', overview);
    assert.equal(await overview.locator('[data-factory-focus]').count(), 1); await overview.locator('[data-factory-notes]').click(); await page.locator('#factory-notes[open]').waitFor();
    await page.locator('#factory-notes').getByRole('button', { name: 'Close drawing dialog', exact: true }).click();
    await page.frameLocator('.slide.is-active [data-factory-surface] iframe').locator('[data-factory-station="05-press"]').press('Enter');
    await page.waitForFunction(() => document.querySelector('#factory-enlarged[open] iframe')?.contentWindow.BOWER_FACTORY?.getState().id === '05-press');
    assert.equal(await page.locator('#factory-enlarged [data-factory-next]').count(), 1);
    await page.locator('#factory-enlarged').getByRole('button', { name: 'Back to the whole factory', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('#factory-enlarged'));
    const focus = await activate('factory-focus-slide'); await factoryReady('focus', '05-press');
    for (const id of ['07-scan', '11-cut', '05-press']) { await focus.locator(`[data-factory-id="${id}"]`).click(); await factoryReady('focus', id); assert.equal(await focus.locator(`[data-factory-id="${id}"]`).getAttribute('aria-pressed'), 'true'); }
    if (await focus.locator('[data-factory-play]').innerText() === 'Pause') await focus.locator('[data-factory-play]').click();
    await focus.locator('[data-factory-seek]').evaluate(el => { el.value = '42'; el.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForFunction(() => { const state = window.DESIGNX_FACTORY.getStates().find(item => item.viewer === 'focus'); return Math.abs(state.time / state.duration - .42) < .001 && !state.playing; });
    const before = await page.evaluate(() => window.DESIGNX_FACTORY.getStates().find(item => item.viewer === 'focus').time); await frames();
    assert.equal(await page.evaluate(() => window.DESIGNX_FACTORY.getStates().find(item => item.viewer === 'focus').time), before); await screenshot('slide-12-factory-focus', focus);
  });
  await test('Index, notes, new drawing slots and print link remain usable', async () => {
    await screenshot('slide-06-ground', await activate('v8-ground-slide')); await screenshot('slide-16-care', await activate('v8-care-slide'));
    await page.locator('#open-index').click(); assert.equal(await page.locator('#slide-index[open] [data-go]').count(), expectedThemes.length);
    await page.locator('#slide-index [data-go]').last().click(); assert.equal(await page.evaluate(() => window.DESIGNX.current), expectedThemes.length);
    await page.locator('#show-notes').click(); assert.match(await page.locator('#notes-content').innerText(), /Story connection|Continue to the next slide|Drawing plan/); await page.locator('[data-close-dialog="speaker-notes"]').click();
    const print = new URL(await page.locator('#pdf-link').getAttribute('href'), href); assert.equal(print.searchParams.get('print'), '1'); assert.ok(print.pathname.includes('/v8'));
  });
  await test('Static reading view has twenty-one scenes, complete factory diagrams and no broken images', async () => {
    const print = new URL(href); print.search = '?print=1'; await page.goto(print.href); await page.waitForFunction(() => Boolean(window.DESIGNX));
    await page.evaluate(() => Promise.race([Promise.all([window.DESIGNX_READY, window.DESIGNX_FACTORY_READY]), new Promise((_, reject) => setTimeout(() => reject(new Error('Static factory preparation exceeded 20 seconds')), 20000))]));
    await page.waitForFunction(()=>document.querySelector('[data-v8-consequences]')?.dataset.ready==='true');
    assert.equal(await page.locator('.slide.is-active').count(), expectedThemes.length); assert.equal(await page.locator('[data-v8-study] iframe').count(), 0); assert.equal(await page.locator('[data-factory-poster] svg').count(), 4);
    const images = await page.locator('.slide img').evaluateAll(images => images.map(img => ({ src: img.currentSrc || img.src, complete: img.complete, width: img.naturalWidth })));
    assert.ok(images.length); assert.deepEqual(images.filter(img => !img.complete || !img.width), []);
    await screenshot('print-02-time',page.locator('.slide.v7-growth-slide'));
    const experimentPrint = page.locator('.slide.v8-time-experiment-slide');
    assert.ok(await experimentPrint.locator('.v8-time-experiment-poster').isVisible());
    assert.match(await experimentPrint.locator('[data-time-print-caption]').innerText(),/Year\s*9/i);
    assert.equal(await experimentPrint.locator('video').count(),0,'Print should load a stable experiment poster');
    await screenshot('print-03-time-experiment',experimentPrint);
    await screenshot('print-04-light',page.locator('.slide.v8-light-slide'));
    await screenshot('print-05-space',page.locator('.slide.v8-space-slide'));
    await screenshot('print-08-consequences',page.locator('.slide.v7-computation-slide'));
    await screenshot('print-12-manufacturing',page.locator('.slide.factory-focus-slide'));
    await screenshot('print-17-learning',page.locator('.slide.v7-learning-flow-slide'));
  });
  await test('Story map loads and no edition 09 dependencies remain', async () => {
    await page.goto(new URL('story-map.html', href).href); await page.waitForLoadState('domcontentloaded'); assert.match(await page.locator('body').innerText(), /story|presentation|drawing/i);
    await page.screenshot({ path: resolve(root, '.qa/story-map.png'), fullPage: true }); assert.deepEqual([...dependencies].filter(url => /\/v9(?:\/|$)/.test(new URL(url).pathname)), []);
  });
} catch (error) { result.failures.push({ name: 'Setup or navigation', message: error.stack || error.message }); }
finally {
  await browser.close(); await writeFile(resolve(root, '.qa/check-result.json'), JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
  if (result.failures.length || result.errors.length || result.missingAssets.length || result.failedRequests.length || result.externalRequests.length) process.exitCode = 1;
}
