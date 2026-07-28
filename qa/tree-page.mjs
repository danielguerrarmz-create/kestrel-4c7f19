/**
 * qa/tree-page.mjs — screenshot review loop for the Tree of Life About (#/about/tree).
 *
 * The page is a scroll-grown drawing, so a single shot proves nothing: this walks the
 * scroll track and captures the journey — roots, low trunk, mid tree, upper tree, crown —
 * on desktop and mobile, plus one hover-card shot and one reduced-motion shot (the
 * fully-grown static poster a reduced-motion visitor actually gets).
 *
 * Shots land in qa/shots/tree/. Run with the dev server up (see base.mjs for the port
 * hazard — VERIFY the server is this tree before believing anything).
 *
 *   node qa/tree-page.mjs
 */
import { BASE, launch, setViewport, setReducedMotion, waitForReady, capture, sleep } from './lib.mjs';

const URL = `${BASE}/#/about/tree`;
const OUT = 'qa/shots/tree';

/** Scroll the window to a fraction of the tree track's own travel, then let the camera
 *  spring settle (the spring is stiffness 70 / damping 22; ~1.2s is past its rest). */
async function scrollToFraction(page, f) {
  await page.evaluate((frac) => {
    const track = document.querySelector('[data-tree-track]');
    if (!track) throw new Error('no [data-tree-track] — wrong page?');
    const rect = track.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const travel = track.offsetHeight - window.innerHeight;
    window.scrollTo(0, top + travel * frac);
  }, f);
  await sleep(1300);
}

/** Hard navigation. `page.goto` to the SAME hash URL is a same-document navigation —
 *  the app does NOT remount, and the section inherits the previous section's state
 *  (measured: the reduced-motion shot rendered the mobile section's non-reduced app).
 *  Blank the page first so every section starts from a real load. */
async function hardGoto(page, url) {
  await page.goto('about:blank');
  await page.goto(url, { waitUntil: 'networkidle2' });
}

const { browser, page } = await launch({ width: 1440, height: 900 });
try {
  /* ---------------- desktop journey ---------------- */
  await hardGoto(page, URL);
  await waitForReady(page, { blobs: 0 });
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    await scrollToFraction(page, f);
    await capture(page, `${OUT}/desktop-${String(f * 100).padStart(3, '0')}.png`, { fullPage: false });
  }

  /* Hover: the Dougherty figure sits near f≈0.62 of the track. */
  await scrollToFraction(page, 0.62);
  const fig = await page.$('[data-tree-fig="dougherty"] button');
  if (fig) {
    await fig.hover();
    await sleep(900);
    await capture(page, `${OUT}/desktop-hover-dougherty.png`, { fullPage: false });
  } else {
    console.warn('hover shot skipped: [data-tree-fig="dougherty"] not found');
  }

  /* ---------------- mobile journey ---------------- */
  await setViewport(page, { width: 390, height: 844, dpr: 2, mobile: true });
  await hardGoto(page, URL);
  await waitForReady(page, { blobs: 0 });
  for (const f of [0, 0.5, 1]) {
    await scrollToFraction(page, f);
    await capture(page, `${OUT}/mobile-${String(f * 100).padStart(3, '0')}.png`, { fullPage: false });
  }

  /* ---------------- reduced motion: the static, fully-grown tree ---------------- */
  await setViewport(page, { width: 1440, height: 900, dpr: 1 });
  await setReducedMotion(page, true);
  await hardGoto(page, URL);
  await waitForReady(page, { blobs: 0 });
  await scrollToFraction(page, 0.5);
  await capture(page, `${OUT}/desktop-reduced-050.png`, { fullPage: false });

  console.log(`tree-page: shots written to ${OUT}/`);
} finally {
  await browser.close();
}
