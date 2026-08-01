import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { homeMirror, aboutMirror, galleryMirror, questionsMirror, housesMirror, practiceMirror, llmsTxt } from './mirror';

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
  { rel: 'agent/questions.md', fresh: questionsMirror },
  { rel: 'agent/houses.md', fresh: housesMirror },
  { rel: 'agent/practice.md', fresh: practiceMirror },
];

describe('the agent mirror is fresh', () => {
  it('sanity: the fresh render carries each page\'s load-bearing lines', () => {
    const home = homeMirror();
    expect(home).toContain('Bower');
    expect(home.length).toBeGreaterThan(1500);
    // `/about` BECAME THE SHORT PAGE on 2026-07-31 and these assertions moved with the content
    // they were guarding, down to `practice` below. Left as a marker because a mirror test that
    // simply lost two assertions in a refactor is how a page silently stops being checked.
    const about = aboutMirror();
    expect(about).toContain('None of them finished. All of them alive.');
    expect(about).toContain('A world full of Bowers.');
    // The door onward must survive: without it the expanded page is unreachable from the short one,
    // which is the entire structure Clay asked for.
    expect(about).toContain('/about/practice');
    expect(llmsTxt()).toContain('/agent/practice.md');

    // The expanded about: the founders and the work.
    const practice = practiceMirror();
    expect(practice).toContain('The obsession is old.');
    expect(practice).toContain('Clay Seifert');
    expect(practice).toContain('Daniel Guerra');
    const gallery = galleryMirror();
    expect(gallery).toContain('Concept renderings');
    // All seven plates, as fetchable markdown images.
    expect(gallery.match(/!\[[^\]]+\]\(\/assets\/gallery\/[^)]+\.webp\)/g)?.length).toBe(7);
    expect(llmsTxt()).toContain('/agent/gallery.md');
    // The questions page is the one an agent asked "what does a Bower cost" most needs, so its
    // load-bearing facts are asserted on the FRESH render: the price, the planning position, and
    // a way to reach a person. A mirror that lost these would still look like a page.
    const questions = questionsMirror();
    // £350,000 as of 2026-07-28: the £150,000 this line used to assert was below break-even.
    // Both are pinned — the live figure present, the superseded one absent — because an agent
    // quoting a stale price back to a buyer is the same anchoring harm as the page doing it.
    expect(questions).toContain('£350,000');
    expect(questions).not.toContain('£150,000');
    expect(questions).toContain('planning permission');
    // The published address became clay@bowerbuild.org on 2026-07-31. Pinned as a PROPERTY rather
    // than as the literal it replaced: what matters is that the mirror hands an agent a practice
    // address on the practice's own domain, not that it happens to be this string.
    expect(questions).toMatch(/\S+@bowerbuild\.org/);
    expect(questions).not.toContain('gmail.com');
    expect(llmsTxt()).toContain('/agent/questions.md');

    // The houses page (2026-07-31). Its load-bearing lines are the HONEST ones: the concession
    // that canvas still goes up for a hundred and twenty, and the capacity it actually holds. A
    // mirror that kept the argument and lost the concession would read as the overclaim this page
    // was rewritten to remove, and an agent quoting it back to an owner is the same harm as the
    // page doing it.
    const houses = housesMirror();
    expect(houses).toContain('is not a marquee');
    expect(houses).toContain('hundred and twenty');
    expect(houses).toContain('thirty');
    expect(houses.length).toBeGreaterThan(1200);
    expect(llmsTxt()).toContain('/agent/houses.md');
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
