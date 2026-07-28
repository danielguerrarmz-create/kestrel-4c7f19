/**
 * qa/base.mjs — WHERE THE HARNESSES POINT, in one place.
 *
 *   node qa/<probe>.mjs                  → http://localhost:5333  (vite.config's dedicated port)
 *   PORT=5173 node qa/<probe>.mjs        → aim it somewhere else
 *   BASE=http://host:1234 node qa/…      → aim it anywhere
 *
 * WHY THIS EXISTS, 2026-07-17. Every harness hardcoded `http://localhost:5333`, and on this machine
 * **5333 was serving a DIFFERENT BRANCH.** `engine-session` is a git WORKTREE of this same repo
 * (branch `engine-draw`, diverged 27 commits); its dev server had taken 5333 first, and because
 * `vite.config.ts` sets `strictPort: true` this tree's own `npm run dev` could not have it and came up
 * on 5173. So every probe's DEFAULT aimed at code that was never written here.
 *
 * Measured, by fetching the served module from each port:
 *
 *   :5173  graduation side "left" · `yearLabelSides` present · the CAADRIA correction live  ← this tree
 *   :5333  graduation unmoved     · `yearLabelSides` absent  · **`ACM DIS` still in the copy**
 *
 * **A harness pointed at the wrong tree does not fail. It passes, about someone else's code.** Round
 * 10's whole lesson was green checks that meant nothing; this is that trap one level out — not a
 * probe measuring the wrong QUANTITY, but a probe measuring the wrong PAGE, and reporting it in your
 * name. The port is not configuration trivia: it is the difference between verification and theatre.
 *
 * A default that is right in the config and wrong in fact is worse than no default, because it is
 * silent. So: the default stays 5333 (that IS this app's port, and the fix is to stop the squatter),
 * but it is now one override away, and `checkTree()` below lets a probe SAY what it is looking at.
 */
export const PORT = process.env.PORT ?? '5333';
export const BASE = process.env.BASE ?? `http://localhost:${PORT}`;

/** The About page, with the species PINNED.
 *
 *  PIN THE SPECIES OR THE A/B MEASURES THE SPECIES. `species.ts` reads
 *  `new URLSearchParams(window.location.search)`, and `PAGE_SPECIES` rolls per load, so an
 *  unpinned run compares two different plants and calls the difference your change.
 *
 *  This used to read `${BASE}/?species=x#/about`, and the ORDER was the whole note: under the
 *  hash router `#/about?species=x` put the param inside the fragment, so `location.search` was
 *  empty and it did not even route — the page rendered the SPLASH and still looked like a page.
 *  (Cost a run on 2026-07-17.) Routing moved to real paths on 2026-07-28, so the query sits where
 *  a query goes and the hazard is gone. Kept as a tombstone because the FAILURE MODE is not:
 *  a probe pointed at the wrong page still returns numbers.
 */
export const aboutUrl = (species = 'spine-2') => `${BASE}/about?species=${species}`;

/**
 * Prove the server is the tree you think it is, and print it, so a run can never be quoted against the
 * wrong branch. Pass a few [label, needle] pairs a fetch of `file` must contain.
 *
 * Fetches the module Vite serves rather than reading the disk — the disk is what you edited, the
 * server is what you measured, and this whole note exists because those were two different things.
 */
export async function checkTree(file, expectations) {
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error(`qa/base: cannot read ${file} from ${BASE} (${res.status})`);
  const src = await res.text();
  const bad = expectations.filter(([, needle]) => !src.includes(needle));
  console.log(
    `TREE ${BASE} → ${file}: ${expectations.map(([l, n]) => `${l}=${src.includes(n)}`).join(' ')}`,
  );
  if (bad.length) {
    throw new Error(
      `qa/base: ${BASE} is NOT the tree you expect — missing ${bad.map(([l]) => l).join(', ')}.\n` +
        `  A probe pointed at the wrong tree PASSES, about someone else's code.\n` +
        `  Another worktree may hold this port (engine-session/engine-draw has taken 5333 before).\n` +
        `  Aim it: PORT=5173 node qa/<probe>.mjs`,
    );
  }
}
