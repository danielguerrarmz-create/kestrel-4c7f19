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
 * exercise the dev branch.
 *
 * CHAIN IT ON A SUCCESSFUL BUILD. `npm run build && node qa/bundle-leak.mjs` — the `&&` is not
 * decoration. Proving this probe could fail, the second attempt injected a bug that `tsc` rejected;
 * the build stopped, `dist/` still held the PREVIOUS artifact, and because the commands were not
 * chained the probe scanned yesterday's output and printed a confident pass over a build that had
 * never happened. **A guard that reads a stale artifact is worse than no guard, because it
 * launders staleness as evidence.**
 *
 * So it does not merely say so in a comment: it compares mtimes and refuses to report at all when
 * any source file is newer than the newest thing in `dist/`. A comment cannot fail; it can only be
 * believed.
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
import { readFileSync, readdirSync, statSync } from 'node:fs';
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
  /* Gated 2026-08-04 (Clay, founding-commission launch). The page still publishes the Stage 1 and
     Stage 2 fees the withdrawn-budget posture contradicts, so its copy shipping is a MESSAGE leak,
     not just a bundle-size one. The fee marker doubles as a guard on the fee reappearing anywhere:
     while the site says "we do not publish an indicative budget", no production surface may carry
     the study fee — reintroducing it must be a deliberate act that comes here to remove the line. */
  'houses (DEV_ONLY_ROUTES)': {
    app: ['nothing else like it in England', 'hundred and twenty', '£18,000', 'HousesPage'],
  },
  /* Gated 2026-09-03 (Clay: "the commissions page is no longer live, we killed it" — and it was
     still fully published when he said so). Like `/houses`, this is a MESSAGE leak as well as a
     payload one: the page carries the Founding Site Study fee and the appointment gates, so a
     killed page shipping its terms is worse than shipping its weight. `CommissionsPage` is in the
     list because the static import in Root was the actual bug — dropping a route from
     PUBLIC_ROUTES does nothing to a page the bundler was still told to include. */
  'commissions (DEV_ONLY_ROUTES)': {
    app: [
      'What a Bower makes possible',
      'Commitment increases only as certainty does',
      'A controlled route to delivery',
      'CommissionsPage',
    ],
  },
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

function walk(dir, acc = [], match = /\.(js|css|html)$/) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc, match);
    else if (match.test(e.name)) acc.push(p);
  }
  return acc;
}

/** Newest mtime under a tree, in ms. */
const newestMtime = (dir, match) =>
  walk(dir, [], match).reduce((max, f) => Math.max(max, statSync(f).mtimeMs), 0);

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

/**
 * IS THE ARTIFACT EVEN FROM THIS SOURCE TREE? The failure this exists for: a build that fails
 * (a type error, a syntax error) leaves the PREVIOUS `dist/` in place, so an unchained
 * `node qa/bundle-leak.mjs` scans an artifact that predates the change it is supposed to judge and
 * reports a confident pass. It fooled me once while I was proving this very probe could fail.
 *
 * mtime is a coarse instrument and deliberately so: it only has to catch "you edited source and
 * did not successfully rebuild", which is the whole of the failure mode. Erring toward a false
 * HARNESS FAILURE is correct here — the cost is re-running the build, and the alternative is a
 * pass that means nothing.
 */
const newestSrc = Math.max(
  newestMtime('src', /\.(ts|tsx|css)$/),
  statSync('index.html').mtimeMs,
  statSync('package.json').mtimeMs,
);
const newestDist = newestMtime(DIST);
if (newestSrc > newestDist) {
  const behind = Math.round((newestSrc - newestDist) / 1000);
  console.error(
    `HARNESS FAILURE: ${DIST}/ is ${behind}s older than the newest source file, so it does not\n` +
      `describe this tree. A build probably failed and left the previous artifact in place.\n` +
      `Run:  npm run build && node qa/bundle-leak.mjs   (the && is the point)`,
  );
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

/*
 * The public surface must be present, or a build that emitted nothing would "pass" every check
 * above. A guard that cannot fail is the bug this repo names most often.
 *
 * AND THIS CONTROL WENT STALE AND TOOK THE WHOLE PROBE WITH IT (found 2026-09-03). It read
 * `'Grow a living'`, which was home-page copy until the 2026-07-23 rewrite cut the page from 240
 * words to 123 — the string has been pinned ABSENT in `SplashPage.test.ts` ever since. So this
 * check had been failing for weeks, the probe exited 2 on every run, and NOTHING above it was ever
 * reported. The gate it exists to verify was never actually verified.
 *
 * The fix is not just a fresher string, because a fresher string goes stale the same way. The
 * app-side control is now held to the SAME standard as a GATED marker: it must exist in `src/`,
 * and the probe says so in its own words when it does not. A positive control that can rot into a
 * silent no-op is the exact failure this file's header lectures about, committed in the file's own
 * last ten lines.
 */
const PRESENT = { app: ['Buildings that nature designs.'], emitted: ['og:image', 'bowerbuild.org'] };
const deadControl = PRESENT.app.filter((m) => !src.includes(m));
if (deadControl.length) {
  console.log(
    `\n  HARNESS FAILURE: the positive control is stale — ${deadControl.map((m) => JSON.stringify(m)).join(', ')}\n` +
      '  no longer exists in src/, so this probe would pass over an empty bundle. Repoint it at\n' +
      '  copy the home page actually renders.',
  );
  process.exit(2);
}
const missing = [...PRESENT.app, ...PRESENT.emitted].filter((m) => !blob.includes(m));
if (missing.length) {
  console.log(`\n  HARNESS FAILURE: the public site is missing from the scan (${missing.join(', ')})`);
  process.exit(2);
}

console.log(leaks === 0 ? '\nno gated surface in the production bundle' : `\n${leaks} leak(s)`);
process.exit(leaks === 0 ? 0 : 1);
