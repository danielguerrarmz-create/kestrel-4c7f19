/**
 * qa/bundle-leak.mjs — does the PRODUCTION BUNDLE contain anything that is supposed to be gated?
 *
 *   npm run build && node qa/bundle-leak.mjs
 *
 * UNLINKED IS NOT GATED, and this repo has already paid for that sentence once. `#/about/tree` was
 * "hidden" on 2026-07-26 by simply not linking it, while remaining a STATIC import in Root — so the
 * entire tree page (geometry, milestones, growth windows) shipped to production for a route nobody
 * could reach. The fix was a lazy import behind the `import.meta.env.DEV` ternary, and it was
 * verified by grepping `dist/` for `treeLayout` and `data-tree-track`. That grep was run by hand,
 * once, which means the verification did not survive the commit that motivated it. This file is
 * that grep, kept.
 *
 * WHY A PROBE AND NOT A VITEST: the question is about a BUILD ARTIFACT. `src/routing.test.ts`
 * already covers the two things a unit test can honestly answer — the `resolveRoute` truth table
 * for both values of `dev`, and that Root is wired to it by reading its source. Neither can see
 * what rollup emitted, and the vitest environment has `DEV` true, so a render there can only ever
 * exercise the dev branch. Run this after a build, or in CI after `npm run build`.
 *
 * WHAT A HIT MEANS: the named surface is in the bundle every visitor downloads. That is a payload
 * regression (three.js alone is ~1 MB) and, for an unfinished tool Daniel took off the site
 * deliberately, a disclosure one.
 *
 * ADDING A MARKER: pick a string that ONLY that surface produces and that a minifier cannot rename
 * — a `data-` attribute, a DOM id, visible copy, an imported library's public API. A local
 * function or variable name is worthless here: rollup renames it, so the check silently passes
 * forever.
 *
 * AND THE PROBE CHECKS ITS OWN MARKERS, because the first draft of this file shipped FIVE dead
 * ones (`data-sculpt`, `data-shape-cage`, `__captureSeeds` and two invented strings). Every one
 * was a check that could never fail, sitting inside the file whose whole job is to fail — the
 * exact anti-pattern CLAUDE.md names ("a guard that filters its inputs so it cannot fail"). It also
 * reported a false LEAK on `nonflowers`, which is a vendored error string the ABOUT page
 * legitimately ships, so the marker was wrong rather than the bundle.
 *
 * Hence the two groups. `app` markers must exist in `src/`, and the probe exits 2 as a HARNESS
 * FAILURE if one does not. `emitted` markers legitimately do NOT appear in `src/` — they are a
 * dependency's own strings, or the post-minification form of one of ours (`173_820` in source is
 * `173820` in a bundle) — so they are exempt from that check and are labelled as such.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = process.env.DIST ?? 'dist';

/**
 * Every surface that must NOT ship, and the strings that would prove it did.
 *
 * `app`     — our own strings; MUST exist in src/ or the marker is dead (harness failure).
 * `emitted` — a dependency's strings, or the post-minification form of ours; absent from src/ by
 *             nature, so exempt from the dead-marker check.
 */
const GATED = {
  'about/tree (DEV_ONLY_ROUTES)': { app: ['data-tree-track', 'data-tree-canvas', 'AboutTreePage'] },
  'sculpt (ENGINE_ROUTES)': { app: ['reset shell', 'the param prototype'] },
  'shape (ENGINE_ROUTES)': { app: ['drag the handles to shape the pavilion'] },
  'studio / draw (ENGINE_ROUTES)': { app: ['cut list', 'how the engine works'] },
  'engine walkthrough (ENGINE_ROUTES)': { app: ['EngineSection', 'the generative engine'] },
  /* NOT the bare word "nonflowers": that is a vendored error string the gongbi painter throws, and
     the painter runs on the PUBLIC about page, so it ships correctly. The lab-only string is the
     attribution link the lab renders. This distinction cost a false LEAK on the first run. */
  'labs (ENGINE_ROUTES)': { app: ['LingDong-/nonflowers', 'Browse takes, pin winners.'] },
  'the three.js 3D stack': {
    app: ['PerspectiveCamera', 'OrbitControls'],
    emitted: ['WebGLRenderer'], // three's own class name; never written in our source
  },
  /* Not a route, but the same class of leak and the more expensive one. The demo constants are
     knowingly still anchored to £150k (dev-only, flagged not fixed, Daniel's call) and £150,000 was
     BELOW COST when it briefly shipped on 2026-07-28. None of it may reach a production surface. */
  'the retracted below-cost price': {
    app: ['150,000', '£150k'],
    emitted: ['173820'], // `COMMISSION_ANCHOR_GBP = 173_820` loses its separator when bundled
  },
};

function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(js|css|html)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error(`no ${DIST}/ — run \`npm run build\` first`);
  process.exit(2);
}
if (files.length === 0) {
  console.error(`${DIST}/ has no js/css/html — refusing to report a pass on an empty scan`);
  process.exit(2);
}

const blob = files.map((f) => readFileSync(f, 'utf8')).join('\n');
console.log(`scanned ${files.length} files, ${Math.round(blob.length / 1024)} KB of text\n`);

/* Self-check FIRST: a dead marker is a check that cannot fail, and a probe full of them reports a
   confident pass over a real leak. Reads src/ rather than trusting the list. */
function srcWalk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) srcWalk(p, acc);
    else if (/\.(ts|tsx)$/.test(e.name)) acc.push(p);
  }
  return acc;
}
const src = srcWalk('src')
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');
const dead = Object.entries(GATED).flatMap(([surface, { app = [] }]) =>
  app.filter((m) => !src.includes(m)).map((m) => `${surface}: ${JSON.stringify(m)}`),
);
if (dead.length) {
  console.error('HARNESS FAILURE: marker(s) absent from src/, so they can never fire:');
  for (const d of dead) console.error('  ' + d);
  process.exit(2);
}

let leaks = 0;
for (const [surface, { app = [], emitted = [] }] of Object.entries(GATED)) {
  const hits = [...app, ...emitted].filter((m) => blob.includes(m));
  if (hits.length) {
    leaks++;
    console.log(`  LEAK   ${surface}\n           found: ${hits.join(', ')}`);
  } else {
    console.log(`  clean  ${surface}`);
  }
}

// The public surface must be present, or a build that emitted nothing would "pass" every check
// above. A guard that cannot fail is the bug this repo names most often.
const PRESENT = ['Grow a living', 'og:image', 'bowerbuild.org'];
const missing = PRESENT.filter((m) => !blob.includes(m));
if (missing.length) {
  console.log(`\n  HARNESS FAILURE: the public site is missing from the scan (${missing.join(', ')})`);
  process.exit(2);
}

console.log(leaks === 0 ? '\nno gated surface in the production bundle' : `\n${leaks} leak(s)`);
process.exit(leaks === 0 ? 0 : 1);
