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
  pressMirror,
  privacyMirror,
} from './mirror';
import { CONTACT } from '../data/config';
import { FOUNDING_SITE_STUDY_FEE } from '../ui/priceCopy';

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
  // `/houses` was gated to dev-only on 2026-08-04, so its mirror is no longer generated or
  // published; `public/agent/houses.md` was deleted in the same change.
  { rel: 'agent/practice.md', fresh: practiceMirror },
  // `/commissions` was gated to dev-only on 2026-09-03 (Clay killed the page), so its mirror is no
  // longer generated or published either; `public/agent/commissions.md` was deleted in the same
  // change. Same treatment, same reasoning as `/houses` above.
  { rel: 'agent/process.md', fresh: processMirror },
  { rel: 'agent/contact.md', fresh: contactMirror },
  { rel: 'agent/press.md', fresh: pressMirror },
  { rel: 'agent/privacy.md', fresh: privacyMirror },
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
    // `/about` WENT THROUGH THREE VERSIONS ON 2026-08-04, all Clay's: prose manifesto -> pitch
    // poem -> the FINAL version these pins hold (aboutCopy.ts), which restored the manifesto's
    // hinge line, folded in the poem's year couplet, and kept the founders' coda. The assertions
    // moved each time because the fact moved.
    expect(about).toContain('None of them finished. All of them alive.');
    expect(about).toContain('Year three, it’s a room made of blossom and eaves.');
    expect(about).toContain('Clay Seifert and Daniel Guerra. Founding commissions from 2027.');
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
    // The reworked gallery is deliberately held to eight immersive plates.
    expect(gallery.match(/!\[[^\]]+\]\(\/assets\/gallery\/[^)]+\.webp\)/g)?.length).toBe(8);
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
    expect(questions).toContain('four-week Founding Site Study');
    // AMENDED 2026-08-04: the Stage 1 fee (£20,000, credited against the design and engineering
    // commission) is published again on Clay's ruling, so "no £ at all" became the property that
    // survives fee changes: every £-figure an agent can quote from this mirror IS the live
    // Stage 1 fee. Both superseded commission figures stay pinned absent by name.
    const questionFigures = questions.match(/£[\d,]+/g) ?? [];
    expect(new Set(questionFigures)).toEqual(new Set([FOUNDING_SITE_STUDY_FEE]));
    expect(questions.toLowerCase()).not.toContain('credited');
    expect(questions).not.toContain('£350,000');
    expect(questions).not.toContain('£150,000');
    expect(questions).toContain('permissions or approvals');
    expect(questions).toContain('Do you work internationally?');
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

    // The houses page (2026-07-31) is DEV-ONLY as of 2026-08-04. Its honest-concession lines are
    // still asserted on the fresh render (the content survives for a later aimed relaunch), but
    // it must be ABSENT from llms.txt: an llms entry for an ungenerated mirror is a dead link
    // handed to every agent, and the page's fee copy contradicts the published budget posture.
    const houses = housesMirror();
    expect(houses).toContain('is not a marquee');
    expect(houses).toContain('hundred and twenty');
    expect(houses.length).toBeGreaterThan(1200);
    expect(llmsTxt()).not.toContain('houses.md');
    // `/commissions` is gated the same way (2026-09-03) and gets the same two-part check: the copy
    // must still render, and it must NOT be advertised to agents. The first half is what keeps a
    // shelved page from rotting; the second is what stops llms.txt handing out a dead link.
    expect(commissionsMirror()).toContain('What a Bower makes possible');
    expect(llmsTxt()).not.toContain('commissions.md');
    expect(processMirror()).toContain('From landscape to Bower');
    // Changed 2026-08-05 with Clay's redundancy pass: the contact heading is the next step in
    // the reader's own terms, not a restatement of the button that brought them here.
    expect(contactMirror()).toContain('Tell us about your landscape.');
    expect(privacyMirror()).toContain('Privacy, plainly.');
    expect(llmsTxt()).toContain('/agent/privacy.md');
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
