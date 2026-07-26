import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { homeMirror, aboutMirror, galleryMirror, llmsTxt } from './mirror';

/**
 * The agent-readable mirror (public/llms.txt + public/agent/*.md) is BOTH generated and
 * drift-guarded here — the subBranches.generated pattern, applied to prose: the mirrors are
 * rendered from the same components the human site serves, and this test fails the moment any
 * page copy changes without the mirror being regenerated. That is the whole of "going forward
 * non-humans can see the site": not good intentions, a red suite.
 *
 *   npm test                                    → asserts the committed mirrors equal a fresh render
 *   GEN=1 npx vitest run agentMirror.generated  → REWRITES the mirrors from the current pages
 *
 * The sanity block below is what keeps GEN=1 honest: a converter bug that emitted junk would
 * regenerate "successfully" and then ship unreadable mirrors, so the load-bearing lines of each
 * page are asserted on the FRESH render, not the committed file.
 */
const at = (rel: string) => fileURLToPath(new URL('../../public/' + rel, import.meta.url));

const FILES: ReadonlyArray<{ rel: string; fresh: () => string }> = [
  { rel: 'llms.txt', fresh: llmsTxt },
  { rel: 'agent/home.md', fresh: homeMirror },
  { rel: 'agent/about.md', fresh: aboutMirror },
  { rel: 'agent/gallery.md', fresh: galleryMirror },
];

describe('the agent mirror is fresh', () => {
  it('sanity: the fresh render carries each page\'s load-bearing lines', () => {
    const home = homeMirror();
    expect(home).toContain('Bower');
    expect(home.length).toBeGreaterThan(1500);
    const about = aboutMirror();
    expect(about).toContain('The obsession is old.');
    expect(about).toContain('Clay Seifert');
    const gallery = galleryMirror();
    expect(gallery).toContain('Concept renderings');
    // All seven plates, as fetchable markdown images.
    expect(gallery.match(/!\[[^\]]+\]\(\/assets\/gallery\/[^)]+\.webp\)/g)?.length).toBe(7);
    expect(llmsTxt()).toContain('/agent/gallery.md');
  });

  it('the committed mirrors are byte-identical to a fresh render of the live pages', () => {
    if (process.env.GEN) {
      mkdirSync(at('agent'), { recursive: true });
      for (const f of FILES) writeFileSync(at(f.rel), f.fresh());
      return;
    }
    for (const f of FILES) {
      expect(readFileSync(at(f.rel), 'utf8'), `${f.rel} is stale — regenerate: GEN=1 npx vitest run agentMirror.generated`).toBe(f.fresh());
    }
  });
});
