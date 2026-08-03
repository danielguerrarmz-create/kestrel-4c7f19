import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  homeMirror,
  aboutMirror,
  galleryMirror,
  questionsMirror,
  housesMirror,
  practiceMirror,
  llmsTxt,
  commissionsMirror,
  processMirror,
  contactMirror,
} from './mirror';
import { CONTACT } from '../data/config';
import { COMMISSION_BUDGET_POSITION } from '../ui/priceCopy';

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
  { rel: 'agent/commissions.md', fresh: commissionsMirror },
  { rel: 'agent/process.md', fresh: processMirror },
  { rel: 'agent/contact.md', fresh: contactMirror },
];

describe('the agent mirror is fresh', () => {
  it('sanity: the fresh render carries each page\'s load-bearing lines', () => {
    const home = homeMirror();
    expect(home).toContain('Bower');
    expect(home.length).toBeGreaterThan(900);
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
    expect(gallery.toLowerCase()).toContain('concept studies');
    // All thirteen plates, including the supplied favourites, as fetchable markdown images.
    expect(gallery.match(/!\[[^\]]+\]\(\/assets\/gallery\/[^)]+\.webp\)/g)?.length).toBe(13);
    expect(llmsTxt()).toContain('/agent/gallery.md');
    // The questions page is the one an agent asked "what does a Bower cost" most needs, so its
    // load-bearing facts are asserted on the FRESH render: the price, the planning position, and
    // a way to reach a person. A mirror that lost these would still look like a page.
    const questions = questionsMirror();
    // THE COMMISSION FLOOR IS WORDS NOW (2026-08-01): "mid-six figures", replacing "£350,000
    // including VAT", which had itself replaced a below-cost £150,000. All three are pinned —
    // the live phrase present, both superseded figures absent — because an agent quoting a stale
    // price back to a buyer is the same anchoring harm as the page doing it, and the agent's
    // reader has no way to tell the figure was withdrawn.
    expect(questions).toContain(COMMISSION_BUDGET_POSITION);
    expect(questions).not.toMatch(/£\s?\d/);
    expect(questions).not.toContain('£350,000');
    expect(questions).not.toContain('£150,000');
    expect(questions).toContain('planning permission');
    // BOTH HALVES OF THIS SURVIVED THE MERGE, because they guard different failures. Reading
    // through `CONTACT` (main) catches the mirror going stale against the constant; asserting the
    // DOMAIN as a property (this branch) catches the constant itself being changed to something
    // off-domain, which the first check would happily accept. And the superseded personal address
    // is pinned absent by name: the site published a founder's Gmail from 2026-07-28 until the
    // studio inbox existed on 2026-08-01, and an agent handing a buyer that address would be
    // routing them somewhere the domain's SPF and DMARC records say nothing about.
    expect(questions).toContain(CONTACT.email);
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
    expect(commissionsMirror()).toContain('What a Bower makes possible');
    expect(processMirror()).toContain('From landscape to Bower');
    expect(contactMirror()).toContain('Discuss a founding commission');
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
