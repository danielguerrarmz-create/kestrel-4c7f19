import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  homeMirror,
  aboutMirror,
  galleryMirror,
  questionsMirror,
  practiceMirror,
  processMirror,
  contactMirror,
  pressMirror,
  privacyMirror,
} from './agent/mirror';
import { metaForPath, organizationJsonLd } from './seo';
import { PUBLIC_ROUTES } from './routing';
import { CONTACT, FOUNDERS } from './data/config';

/**
 * THE VENUE SPEC'S GROUND RULES, AS ABSENCES, SWEPT OVER EVERYTHING THE SITE PUBLISHES.
 *
 * The hospitality rewrite (2026-07-31) came with six "do not break these" rules. Five of them are
 * claims the site must never make, and a rule of that shape has exactly one honest home: a test
 * that sweeps the rendered output, not a note in a handoff nobody reads before editing copy.
 *
 * WHY THE MIRRORS ARE THE TARGET. `agent/mirror.ts` renders each public page through
 * `renderToString` and converts it to markdown, so `homeMirror()` IS the home page's text — every
 * heading, every paragraph, every alt attribute, whatever component it came from. Sweeping the
 * copy MODULES instead would miss a string typed straight into JSX, and this page set has plenty of
 * those. Sweeping the rendered page catches copy wherever it was written.
 *
 * This is also the repo's own lesson about literals, applied on purpose. A guard pinned to
 * `not.toContain('#/studio')` was silently disarmed the day the router changed shape, and stayed
 * green forever afterwards. So each rule below is expressed as the PROPERTY it defends and matched
 * with a pattern broad enough to survive a re-wording — and every sweep asserts it swept something,
 * because a loop over zero pages is the same no-op wearing a different hat.
 */

/** Every public page's rendered text, keyed by name so a failure says which page.
 *  `/houses` left this list on 2026-08-04 when it was gated to dev-only — the sweep covers what
 *  the site PUBLISHES, and the length assert against PUBLIC_ROUTES keeps the two in step. Its
 *  copy is still swept by `capacity.test.ts` while it waits, and it must rejoin here the day it
 *  is republished.
 *  `/commissions` left on 2026-09-03 for the same reason (Clay killed the page; gated, not
 *  deleted). Its copy keeps a reader in `CommissionsPage.test.ts` and a render assertion in
 *  `agentMirror.generated.test.ts`, and it must rejoin here the day it is republished. */
const PAGES: ReadonlyArray<{ name: string; text: () => string }> = [
  { name: 'home', text: homeMirror },
  { name: 'gallery', text: galleryMirror },
  { name: 'questions', text: questionsMirror },
  { name: 'about', text: aboutMirror },
  { name: 'practice', text: practiceMirror },
  { name: 'process', text: processMirror },
  { name: 'contact', text: contactMirror },
  { name: 'press', text: pressMirror },
  { name: 'privacy', text: privacyMirror },
];

/**
 * Rendered prose with link and image TARGETS stripped.
 *
 * Load-bearing: asset paths are root-relative under `/assets/`, so a raw sweep for the banned word
 * "asset" would fire on every image on the site and the natural response to that would be to weaken
 * the pattern until it stopped complaining — which is precisely how a good guard becomes a bad one.
 * Strip the URLs, keep the prose, and the rule can stay strict.
 */
function prose(text: string): string {
  return text
    .replace(/\]\([^)]*\)/g, ']') // markdown link and image targets
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\/[a-z0-9/_.-]*assets[a-z0-9/_.-]*/gi, '');
}

const allProse = () => PAGES.map((p) => ({ name: p.name, text: prose(p.text()) }));

describe('ground rule 5: neither founder is called an architect', () => {
  /**
   * "Architect" is protected under the Architects Act 1997 and neither founder is ARB-registered.
   * "Architecture", "architectural" and the firm name "Rick Wright Architects" are all fine, so the
   * pattern has to be narrow enough to allow those and wide enough to catch the noun.
   *
   * `seo.test.ts` already pins this for meta descriptions. This extends it to the pages themselves,
   * which is where a bio would actually say it.
   */
  it('the word never appears as a noun describing a person, on any page', () => {
    const pages = allProse();
    expect(pages.length).toBe(PUBLIC_ROUTES.length);
    // Allow the firm name (capitalised, plural, preceded by a proper noun) and nothing else.
    const NOUN = /\barchitects?\b(?!\s)|\b(?:an?|the|our|is|as)\s+architects?\b|\barchitects?\s+(?:at|of|by)\b/i;
    for (const { name, text } of pages) {
      const withoutFirmNames = text.replace(/Rick Wright Architects/g, 'that practice');
      const hit = withoutFirmNames.match(NOUN);
      expect(hit?.[0], `${name} calls someone an architect: "${hit?.[0]}"`).toBeUndefined();
    }
  });
});

describe('ground rule 6: the buyer\'s own business vocabulary is never used at them', () => {
  /**
   * "These buyers run a business out of their own house and will do the arithmetic themselves.
   * Using their vocabulary at them converts you from peer to supplier."
   *
   * Note `asset` is in this list, which is why `prose()` strips `/assets/` paths first.
   */
  const BANNED = ['ROI', 'asset', 'assets', 'revenue', 'capex', 'investment', 'investor', 'leverage'];

  it('appears on no public page', () => {
    const pages = allProse();
    expect(pages.length).toBeGreaterThan(0);
    for (const { name, text } of pages) {
      for (const word of BANNED) {
        const re = new RegExp(`\\b${word}\\b`, 'i');
        const hit = text.match(re);
        expect(hit?.[0], `${name} uses the banned word "${word}"`).toBeUndefined();
      }
    }
  });

  it('appears in no page title, description or social card', () => {
    // The head is read in a different posture and cached for months by every unfurler, so a word
    // that lands wrong there is the hardest one to take back.
    for (const path of PUBLIC_ROUTES) {
      const m = metaForPath(path);
      const head = [m.title, m.description, m.ogTitle, m.ogDescription].join(' ');
      for (const word of BANNED) {
        expect(head, `${path} head uses "${word}"`).not.toMatch(new RegExp(`\\b${word}\\b`, 'i'));
      }
    }
  });
});

describe('the marquee-replacement claim is withdrawn from the whole site', () => {
  /**
   * WITHDRAWN 2026-07-31, and the reason is the most useful thing in the revised spec. At 25 to 40
   * square metres a Bower does not replace a marquee. A venue owner establishes that in one
   * question, and a page that opens by claiming it has lost the argument before the reader reaches
   * the second paragraph.
   *
   * The site may say a marquee cannot do something (stand through November, be approved premises,
   * get better in its tenth year) — those are true and they are the actual case. It may not say a
   * Bower takes a marquee's place, or is an alternative to hiring one.
   */
  it('no page claims a Bower replaces, substitutes for or does away with a marquee', () => {
    const pages = allProse();
    expect(pages.length).toBeGreaterThan(0);
    /**
     * The gaps are `(?:\w+\s+){0,n}` rather than a list of the articles I happened to think of,
     * and that is not tidiness — the first version of this list MISSED "instead of hiring a
     * marquee", because its optional group could match "hiring " or "a " but not both. A guard
     * against a CLAIM has to survive the claim being re-worded, or it only catches the one phrasing
     * already deleted. Checked against nine phrasings of the withdrawn claim and six true sentences
     * the site does say about marquees, which must all pass.
     */
    const CLAIMS = [
      /replac\w*\s+(?:\w+\s+){0,2}marquee/i,
      /marquee\s+replacement/i,
      /instead\s+of\s+(?:\w+\s+){0,3}marquee/i,
      /(?:alternative|substitute)\s+(?:to|for)\s+(?:\w+\s+){0,2}marquee/i,
      /no\s+more\s+marquee/i,
      /never\s+hire\s+(?:\w+\s+){0,2}marquee/i,
      /does\s+away\s+with\s+(?:\w+\s+){0,2}marquee/i,
    ];
    for (const { name, text } of pages) {
      for (const re of CLAIMS) {
        const hit = text.match(re);
        expect(hit?.[0], `${name} makes the withdrawn claim: "${hit?.[0]}"`).toBeUndefined();
      }
    }
  });
});

describe('a Bower is never described as waterproof by default', () => {
  /**
   * CLAY'S RULE, 2026-07-31, AMENDED BY CLAY 2026-08-05. The original ruling was "it should not be
   * described as rainproof", full stop. The amendment: a Bower CAN be made waterproof — it adds to
   * the engineering effort, and that is true. So the line the guard holds moved:
   *
   *   - The UNCONDITIONAL claim stays banned: "it is waterproof", "fully weatherproof", "keeps the
   *     rain off". A reader who takes that away plans a wet dinner under an open frame.
   *   - The CONDITIONAL claim is permitted: "can be made waterproof", stated with its cost — it is
   *     an engineering decision taken at the start, not a property of the default object.
   *
   * The commercial pressure this guard exists for is unchanged and permanent: rain is the hardest
   * objection in the segment, and every future copy pass will be tempted to promote "can be made
   * waterproof" to "is waterproof". The patterns below catch exactly that promotion, because they
   * match the affirmative construction and not the conditional one.
   */
  const CLAIMS = [
    // "is waterproof", "fully weatherproof", "completely watertight" — but NOT "is not waterproof",
    // which is the sentence the site actually publishes. The negation lookahead inside the gap is
    // load-bearing and the first version of this pattern lacked it: it fired on `/houses`'s own
    // honest answer, which is a guard that would have forced the true sentence off the page.
    /\b(?:is|are|it's|fully|completely|entirely|totally)\s+(?:(?!not\b|never\b)\w+\s+){0,2}(?:waterproof|watertight|weatherproof|rainproof)\b/i,
    /\bkeeps?\s+(?:the\s+)?rain\s+(?:off|out)\b/i,
    /\bstays?\s+dry\s+(?:whatever|in\s+any|in\s+all)\b/i,
    /\bshelter(?:s|ed)?\s+from\s+(?:the\s+)?rain\b/i,
    /\bdry\s+in\s+(?:any|all)\s+weather\b/i,
  ];

  /**
   * QUESTIONS ARE STRIPPED BEFORE SWEEPING, because an interrogative cannot assert.
   *
   * The guard's second false positive was the FAQ heading itself — "Is it waterproof?" parses as
   * `is` + `it` + `waterproof` and is indistinguishable, to a regex, from "is it waterproof" as a
   * claim. Exempting that one string would have been the quick fix and a bad one: it is the exact
   * shape of the stale literal this repo keeps getting burned by. Dropping every sentence that ends
   * in a question mark is the general rule, and it holds for questions nobody has written yet.
   *
   * An answer that begins "Yes, it is waterproof" survives the strip and still fails, which is the
   * case that matters.
   */
  const claimsOnly = (text: string) => text.replace(/[^.!?\n]*\?/g, ' ');

  it('no page claims it keeps the rain off', () => {
    const pages = allProse();
    expect(pages.length).toBeGreaterThan(0);
    for (const { name, text } of pages) {
      for (const re of CLAIMS) {
        const hit = claimsOnly(text).match(re);
        expect(hit?.[0], `${name} claims weather protection: "${hit?.[0]}"`).toBeUndefined();
      }
    }
  });

  it('the guard can still fail: a claim in an ANSWER is caught', () => {
    // Proves the strip above did not disarm the check. This repo's standing lesson is that a guard
    // which cannot fail is worse than no guard, and stripping text before a sweep is precisely how
    // that happens by accident.
    const sneaky = 'Is it waterproof? Yes, it is fully waterproof in any weather.';
    expect(CLAIMS.some((re) => re.test(claimsOnly(sneaky)))).toBe(true);
    // The plain default still passes...
    const honest = 'Is it waterproof? Not by default. A Bower is an open garden building.';
    expect(CLAIMS.some((re) => re.test(claimsOnly(honest)))).toBe(false);
    // ...and so does the conditional claim the 2026-08-05 amendment permits. If a pattern change
    // ever catches this sentence, the guard has started forcing the true copy off the page, which
    // is the failure the negation lookahead above was added to prevent.
    const conditional = 'It can be made waterproof. That adds engineering, so it is decided at the start.';
    expect(CLAIMS.some((re) => re.test(claimsOnly(conditional)))).toBe(false);
  });

  it('and the pages that raise the subject answer it plainly, default first', () => {
    // The other half, and the one that would catch the answer being DELETED rather than softened.
    // An absence guard alone is satisfied by a site that simply never mentions rain, which is the
    // silence this answer exists to replace. `/houses` left the loop 2026-08-04 (dev-only).
    // Since 2026-08-05 the plain answer has two halves and both must be present: the open default,
    // and the engineered option WITH its cost attached — "can be made waterproof" published without
    // "adds engineering" nearby is the promotion this guard exists to catch.
    for (const page of ['questions']) {
      const text = prose(PAGES.find((p) => p.name === page)!.text());
      expect(text, `${page} no longer states the open-by-default answer`).toMatch(
        /not by default[^.]*\.\s*a bower is an open garden (?:structure|building)/i,
      );
      expect(text, `${page} no longer states the engineered option with its cost`).toMatch(
        /can be made waterproof[^.?]*\.[^.?]*adds engineering/i,
      );
    }
  });
});

describe('the practice describes itself as an independent design practice', () => {
  /**
   * Clay, 2026-07-31: replace "design studio" and "architectural practice" with "design and
   * manufacturing company".
   *
   * "Architectural practice" is the important half and it overlaps ground rule 5: the Architects
   * Act 1997 protects the title, and a firm calling itself an architectural practice is making the
   * claim at the level of the business rather than the person. "Design studio" is a positioning
   * choice — a studio designs and hands over; a company that manufactures is answerable for the
   * thing arriving, which is what a buyer of a forty-year structure is trying to establish.
   */
  it('never calls itself a studio or an architectural practice', () => {
    const pages = allProse();
    expect(pages.length).toBeGreaterThan(0);
    for (const { name, text } of pages) {
      for (const re of [/\barchitectural practice\b/i, /\bdesign studio\b/i]) {
        const hit = text.match(re);
        expect(hit?.[0], `${name} uses "${hit?.[0]}"`).toBeUndefined();
      }
    }
  });

  it('nor in any page title, description or social card', () => {
    for (const path of PUBLIC_ROUTES) {
      const m = metaForPath(path);
      const head = [m.title, m.description, m.ogTitle, m.ogDescription].join(' ');
      for (const phrase of ['architectural practice', 'design studio']) {
        expect(head, `${path} head uses "${phrase}"`).not.toMatch(new RegExp(phrase, 'i'));
      }
    }
  });
});

describe('the site makes no claim about HOW a Bower is manufactured', () => {
  /**
   * WITHDRAWN 2026-08-01 (Clay: "I don't think that is true and I would prefer to not list it as
   * such"). The home's ritual step 3 read "Flat timber components, CNC-cut", and the same claim was
   * in the Organization schema, the `<noscript>` block and llms.txt.
   *
   * It described the DEV-ONLY ENGINE'S fabrication model — flat sheet stock, nested and profiled —
   * as though it were how a commission gets built, and nothing has been built. This belongs with
   * ground rules 3 and 4 below: a manufacturing method is the easiest claim on this site for a
   * technically literate buyer to test, and it is worth the least before there is a fabricator
   * (`pending.ts`, `practice-entity`).
   *
   * `src/config.ts`, `engine/` and `ui/costAttribution.ts` still model sheet CNC and must keep
   * doing so — that is the engine's internal cost model, not a published claim. The sweep runs over
   * the RENDERED pages only, which is exactly the distinction that matters.
   */
  it('no page states a fabrication process', () => {
    const pages = allProse();
    expect(pages.length).toBeGreaterThan(0);
    for (const { name, text } of pages) {
      for (const re of [/\bCNC\b/i, /\bflat[- ]pack/i, /\bcut from sheet/i, /\bnested\s+on\s+a\s+sheet/i]) {
        const hit = text.match(re);
        expect(hit?.[0], `${name} claims a manufacturing process: "${hit?.[0]}"`).toBeUndefined();
      }
      // THE COMPONENT COUNT IS PART OF THE SAME CLAIM and the sweep missed it on the first pass —
      // the home printed "about 176 components" in an annotation strip, live from the engine,
      // while the CNC wording had already come out of the ritual step above it. A count is the
      // more checkable half of "here is how it is made", against an object nobody has built.
      const count = text.match(/\b\d+\s+components\b/i);
      expect(count?.[0], `${name} publishes a component count: "${count?.[0]}"`).toBeUndefined();
    }
  });

  it('nor the Organization schema, which a non-JavaScript crawler reads instead of the page', () => {
    // The schema is duplicated by design (static in index.html, plus the function so tests share
    // one definition) and pinned byte-identical. Both copies are checked here because a claim
    // removed from the page and left in the schema is a claim that is still published.
    expect(JSON.stringify(organizationJsonLd())).not.toMatch(/\bCNC\b/i);
    const html = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8');
    expect(html).not.toMatch(/\bCNC\b/i);
    const llms = readFileSync(fileURLToPath(new URL('../public/llms.txt', import.meta.url)), 'utf8');
    expect(llms).not.toMatch(/\bCNC\b/i);
  });
});

describe('ground rules 3 and 4: unverified material claims', () => {
  /**
   * Two claims that are directionally likely and NOT established:
   *   3. tight-radius curved lamination in Accoya (all documented structural Accoya glulam is
   *      straight beams; minimum bend radius vs lamella thickness is unresolved pending Accsys).
   *   4. that a Bower outlasts oak.
   *
   * Neither is on the site today. Pinned as absences so that "describe the timber" work later does
   * not reach for the two sentences that are most tempting and least supported.
   */
  it('no page claims curved lamination in Accoya, or that Bower outlasts oak', () => {
    const pages = allProse();
    expect(pages.length).toBeGreaterThan(0);
    for (const { name, text } of pages) {
      const accoya = text.match(/accoya/i);
      if (accoya) {
        expect(
          text,
          `${name} mentions Accoya and curvature together; ground rule 3 allows durability and stability only`,
        ).not.toMatch(/accoya[^.]*\b(?:curv|bend|bent|laminat)/i);
      }
      expect(text, `${name} claims Bower outlasts oak`).not.toMatch(
        /(?:outlast|longer\s+than|last\w*\s+longer)[^.]*\boak\b/i,
      );
      expect(text, `${name} claims Bower outlasts oak`).not.toMatch(
        /\boak\b[^.]*(?:outlast|will\s+not\s+last)/i,
      );
    }
  });
});

describe('ground rule 2: renders are always labelled as renders', () => {
  it('the gallery still says its images are concept renderings, not photographs', () => {
    const gallery = galleryMirror();
    expect(gallery).toMatch(/concept studies/i);
    // llms.txt makes the same promise to agents; it is checked in the mirror's own suite.
    const llms = readFileSync(fileURLToPath(new URL('../public/llms.txt', import.meta.url)), 'utf8');
    expect(llms).toMatch(/not photographs of\s+built work/i);
  });
});

describe('no unprovisioned contact address reaches a reader', () => {
  /**
   * A MAILBOX THAT DOES NOT EXIST IS NOT A COPY BUG, SO NO COPY RULE ABOVE WOULD CATCH IT.
   *
   * `daniel@bowerbuild.org` is in `FOUNDERS` and has no mailbox behind it (Daniel, 2026-08-13).
   * Nothing renders it today only because the footer's practice block was cut to one plain row on
   * 2026-07-31 — an accident of layout, not a decision anyone made about this address. The moment a
   * founder contact row is restored in good faith, the site publishes an address that bounces off
   * its own About page, silently to us and terminally to the reader who tried it.
   *
   * **THE SUITE WAS ACTIVELY CERTIFYING IT.** `config.test.ts` checks every founder address is on
   * the practice domain and distinct from `FORM_INBOX`. A nonexistent mailbox satisfies both
   * perfectly, because both are questions about the STRING. Existence is a question about the world,
   * and the only thing in this repo that can answer it is a person, recorded as `provisioned`.
   *
   * Swept over the RAW mirror, not `prose()`: an address can reach a reader as an `mailto:` target
   * under different link text, and `prose()` strips exactly that. This is the one rule here whose
   * failure hides in the URL rather than in the sentence.
   */
  it('sweeps a non-empty set of pages and a non-empty set of addresses', () => {
    // Both halves of this guard have failed as no-ops elsewhere in this repo: a loop over zero
    // pages and a loop over zero patterns each pass while checking nothing.
    expect(PAGES.length).toBe(PUBLIC_ROUTES.length);
    expect(FOUNDERS.length).toBeGreaterThan(0);
  });

  it('an address with no mailbox behind it appears on no published page', () => {
    const unprovisioned = FOUNDERS.filter((f) => !f.provisioned).map((f) => f.email);
    if (unprovisioned.length === 0) return; // every address is real; nothing to defend against
    for (const { name, text } of PAGES.map((p) => ({ name: p.name, text: p.text() }))) {
      for (const email of unprovisioned) {
        expect(
          text.includes(email),
          `${name} publishes ${email}, which has no mailbox behind it (see pending.ts: founder-daniel-mailbox)`,
        ).toBe(false);
      }
    }
  });

  it('the address the site actually prints IS provisioned', () => {
    // The positive half, so this describe cannot quietly become a test about nothing: the guard
    // above is vacuous the day every address is real, and this one is not.
    const published = FOUNDERS.find((f) => f.email === CONTACT.email);
    if (published) expect(published.provisioned, `${CONTACT.email} is printed but not provisioned`).toBe(true);
    expect(contactMirror()).toContain(CONTACT.email);
  });
});
