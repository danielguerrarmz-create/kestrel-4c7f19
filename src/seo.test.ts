import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  FOUNDER_NAMES,
  OG_CARD,
  SITE_ORIGIN,
  absoluteUrl,
  faqPageJsonLd,
  metaForPath,
  organizationJsonLd,
} from './seo';
import { ENGINE_ROUTES, PUBLIC_ROUTES, routes } from './routing';
import { QUESTIONS, RING } from './pages/questions/copy';
import { TEAM } from './pages/about/projects';
import { CONTACT } from './data/config';
import {
  COMMISSION_ANCHOR_GBP,
  COMMISSION_BUDGET_POSITION,
  COMMISSION_DEMO_FIGURE,
  COMMISSION_FLOOR_GBP,
} from './ui/priceCopy';

const at = (rel: string) => fileURLToPath(new URL('../' + rel, import.meta.url));
const indexHtml = readFileSync(at('index.html'), 'utf8');
/**
 * index.html with its `<!-- -->` comments removed.
 *
 * The absence assertions below MUST run against this and not the raw file: the head is heavily
 * commented, and those comments necessarily quote the very strings being pinned as absent ("the
 * previous card sold a generative design engine…", "og:url is deliberately absent"). Asserting on
 * the raw text would make the documentation fail the test that the documentation explains, and
 * the tempting fix — deleting the comment — would delete the reason.
 */
const indexTags = indexHtml.replace(/<!--[\s\S]*?-->/g, '');

/**
 * THE CARD MUST REFERENCE A FILE THAT EXISTS. This is the exact bug the whole change is fixing —
 * index.html had no og:image at all and every pasted link unfurled blank — and the way to
 * reintroduce it is an og:image pointing at a path nobody generated. So: the tag, the file, and
 * the file's real pixel dimensions, checked against each other.
 */
describe('the social card', () => {
  it('is a real 1200x630 JPEG at the path the tags claim', async () => {
    const { default: sharp } = await import('sharp');
    const file = at('public' + OG_CARD.path);
    const meta = await sharp(file).metadata();
    expect(meta.format).toBe('jpeg');
    expect(meta.width).toBe(OG_CARD.width);
    expect(meta.height).toBe(OG_CARD.height);
    // 1.91:1 is the slot every unfurler crops to; matching it means none of them chooses for us.
    expect(OG_CARD.width / OG_CARD.height).toBeCloseTo(1.905, 2);
  });

  it('is under the 300 KB budget unfurlers start giving up at', async () => {
    const { statSync } = await import('node:fs');
    expect(statSync(at('public' + OG_CARD.path)).size).toBeLessThan(300 * 1024);
  });

  it('index.html carries the whole tag set, with ABSOLUTE image URLs', () => {
    const abs = `${SITE_ORIGIN}${OG_CARD.path}`;
    expect(indexHtml).toContain(`<meta property="og:image" content="${abs}" />`);
    expect(indexHtml).toContain(`<meta name="twitter:image" content="${abs}" />`);
    expect(indexHtml).toContain(`<meta property="og:image:width" content="${OG_CARD.width}" />`);
    expect(indexHtml).toContain(`<meta property="og:image:height" content="${OG_CARD.height}" />`);
    expect(indexHtml).toContain(OG_CARD.alt);
    expect(indexHtml).toContain('<meta property="og:site_name" content="Bower" />');
    expect(indexHtml).toContain('<meta property="og:locale" content="en_GB" />');
    // summary_large_image, not `summary`: `summary` renders a small square thumbnail, which is
    // what a 1200x630 landscape card looks worst in.
    expect(indexHtml).toContain('<meta name="twitter:card" content="summary_large_image" />');
    // A root-relative og:image is the classic silent failure: an unfurler has no base URL.
    expect(indexHtml).not.toMatch(/property="og:image" content="\//);
  });

  it('no longer sells the engine, which came off the site on 2026-07-21', () => {
    // Pinned as absences: the old card advertised a product the site does not offer. If either
    // sentence comes back, it comes back deliberately.
    expect(indexTags).not.toContain('priced fixed as you shape it');
    expect(indexTags).not.toContain('generative design engine');
    expect(indexTags).not.toContain('fabrication grammar');
    expect(indexTags).not.toContain('Shape an organic timber gridshell like clay');
  });

  it('omits a static canonical and og:url, which would be wrong on three pages in four', () => {
    // Both are injected per route instead. A STATIC canonical in a single-HTML SPA tells a
    // crawler that /gallery is a duplicate of /, which is worse than having no canonical at all.
    expect(indexTags).not.toContain('rel="canonical"');
    expect(indexTags).not.toContain('property="og:url"');
  });
});

describe('per-page metadata', () => {
  it('gives every public route a distinct title, description and canonical', () => {
    // DISTINCTNESS is the property, so it counts against the real list rather than a literal.
    // Two pages sharing a title or a canonical is the bug this guards, and that stays true at
    // four pages, at five, or at nine.
    const metas = PUBLIC_ROUTES.map(metaForPath);
    const n = PUBLIC_ROUTES.length;
    expect(new Set(metas.map((m) => m.title)).size).toBe(n);
    expect(new Set(metas.map((m) => m.description)).size).toBe(n);
    expect(new Set(metas.map((m) => m.path)).size).toBe(n);
    for (const m of metas) {
      // The whole point of the path migration: `<title>` was the single word "Bower" for every
      // page, which spent the strongest relevance signal on the brand name four times over.
      expect(m.title).not.toBe('Bower');
      expect(m.title.length).toBeGreaterThan(20);
      expect(m.title.length).toBeLessThanOrEqual(60);
      expect(m.description.length).toBeGreaterThanOrEqual(110);
      expect(m.description.length).toBeLessThanOrEqual(160);
      expect(m.ogTitle.length).toBeGreaterThan(8);
    }
  });

  it('canonicalizes each route to its own absolute www URL', () => {
    for (const path of PUBLIC_ROUTES) {
      expect(absoluteUrl(metaForPath(path).path)).toBe(`https://www.bowerbuild.org${path}`);
    }
  });

  it('canonicalizes a trailing slash to the page itself, NOT to the home', () => {
    // The near-miss this caught (2026-07-28): `metaForPath` matched `resolveRoute` exactly, so
    // `/gallery/` fell through to the splash and would have told a crawler that the gallery is a
    // duplicate of the home. It was invisible because `useRoute` normalizes first, which made the
    // whole meta layer depend on one caller's manners.
    for (const path of PUBLIC_ROUTES) {
      expect(metaForPath(path + '/').path).toBe(metaForPath(path).path);
      expect(metaForPath(path + '/').title).toBe(metaForPath(path).title);
    }
    expect(metaForPath('/gallery/').path).toBe(routes.gallery);
    // ...but a deeper unknown path under a real route is still the home, as before.
    expect(metaForPath('/gallery/nope').path).toBe(routes.home);
  });

  it('an unknown path inherits the HOME canonical, not one of its own', () => {
    // The router serves the splash for anything unrecognised, so `/typo` IS the home page.
    // Self-canonicalizing it would invite a crawler to index endless invented duplicates.
    for (const junk of ['/typo', '/gallery/nope', '/register']) {
      expect(metaForPath(junk).path).toBe(routes.home);
      expect(metaForPath(junk).title).toBe(metaForPath(routes.home).title);
    }
  });

  it('a dev-only route carries the HOME head, because the home is what production serves there', () => {
    for (const path of ENGINE_ROUTES) {
      expect(metaForPath(path).path).toBe(routes.home);
    }
    expect(metaForPath('/about/tree').path).toBe(routes.home);
  });

  /**
   * NO FIGURES IN THE META LAYER AT ALL. THE HEAD SELLS; THE PAGE PRICES.
   *
   * The first version of this file quoted `£350,000 including VAT` in two descriptions and two
   * og:descriptions and pinned them against the questions page's answer. That test passed and the
   * DESIGN was still wrong: it made the head a fifth and sixth copy of a fact that
   * `pages/questions/copy.ts` owns and `COMMISSION_BREAKEVEN_GBP` guards. This repo's most
   * expensive bugs are all one shape (one fact, several places, one of them stale), and the head
   * is the worst place to keep a copy, because a link card is cached by iMessage, WhatsApp, Slack
   * and LinkedIn for months and gets screenshotted. A green test cannot un-cache a frozen card.
   *
   * An ABSENCE is a much stronger invariant than a derivation here: there is nothing to keep in
   * sync, so it cannot go stale. Google generates query-relevant snippets from page content
   * anyway, so the price still reaches a "what does a garden pavilion cost" search from the page
   * that owns it.
   */
  it('carries NO price, in any form, on any page', () => {
    for (const m of PUBLIC_ROUTES.map(metaForPath)) {
      for (const text of [m.title, m.description, m.ogTitle, m.ogDescription]) {
        expect(text, 'no currency symbol in the meta layer').not.toMatch(/[£$€]/);
        // ...and no bare figure either: "350,000", "350k" and "from 350" are the same fact
        // wearing a disguise.
        expect(text, 'no bare thousands figure in the meta layer').not.toMatch(
          /\d[\d,.]*\s*(k\b|,\d{3})/i,
        );
      }
    }
  });

  it('and index.html carries none either, since that head ships to every URL', () => {
    // The static head is the one an unfurler actually reads, so it is the copy most likely to be
    // screenshotted and the least likely to be re-read.
    expect(indexTags).not.toMatch(/[£$€]/);
  });

  it('obeys the house dash rule (no em/en dashes in copy that ships)', () => {
    for (const m of PUBLIC_ROUTES.map(metaForPath)) {
      for (const text of [m.title, m.description, m.ogTitle, m.ogDescription]) {
        expect(text).not.toMatch(/[—–]/);
      }
    }
    // index.html's own visible copy, plus every meta content attribute in it.
    for (const [, content] of indexHtml.matchAll(/<meta[^>]*content="([^"]*)"/g)) {
      expect(content).not.toMatch(/[—–]/);
    }
  });

  it('never calls Daniel an architect, and never claims the practice is one', () => {
    // Standing rule: he is architecturally trained, not licensed. A meta description is exactly
    // the kind of copy that gets written on autopilot.
    for (const m of PUBLIC_ROUTES.map(metaForPath)) {
      const text = [m.title, m.description, m.ogTitle, m.ogDescription].join(' ').toLowerCase();
      expect(text).not.toMatch(/\barchitects?\b/);
    }
  });
});

describe('structured data', () => {
  it('the Organization block in index.html is byte-identical to organizationJsonLd()', () => {
    // Two copies exist ON PURPOSE (static so a non-JavaScript crawler gets it; the function so
    // the tests and any future injector share one definition), which is exactly the shape of bug
    // this repo keeps getting burned by. So they are pinned to each other rather than trusted.
    const block = indexHtml.match(
      /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/,
    );
    expect(block, 'index.html must carry a JSON-LD block').toBeTruthy();
    expect(JSON.parse(block![1])).toEqual(organizationJsonLd());
  });

  /**
   * AND THE `<noscript>` PROSE IS THE SAME FACT A THIRD TIME, IN HAND-WRITTEN HTML.
   *
   * The JSON-LD above is pinned; this paragraph was not, and it is the more likely of the two to
   * drift, because it is prose in a file nobody opens rather than a structured block a test already
   * names. `COMPANY_DESCRIPTION` moved on 2026-08-01 and this block happened to be updated in the
   * same commit — by hand, which is the whole problem. Nothing would have failed if it had not been.
   *
   * It is asserted against `organizationJsonLd().description` rather than against
   * `COMPANY_DESCRIPTION` alone because the paragraph is the FULL description (the positioning
   * sentence plus what the thing is), which is exactly what the schema publishes. One source, three
   * surfaces, two of them now pinned to the first.
   *
   * Whitespace is collapsed before comparing: the HTML is wrapped to the file's line width, so a
   * byte-identical assertion would fail on a reflow and teach the next person to delete the test.
   * Collapsing is not a loophole here — an editor cannot change a WORD without failing.
   */
  it('the <noscript> paragraph is the Organization description, not a hand-copy that can drift', () => {
    const noscript = indexHtml.match(/<noscript>([\s\S]*?)<\/noscript>/);
    expect(noscript, 'index.html must carry a <noscript> block').toBeTruthy();
    const paragraphs = [...noscript![1].matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) =>
      m[1].replace(/\s+/g, ' ').trim(),
    );
    // The sweep must have found something, or this asserts nothing at all.
    expect(paragraphs.length).toBeGreaterThan(0);
    expect(paragraphs[0]).toBe(organizationJsonLd().description);
  });

  it('the founders match the About page ledger exactly', () => {
    // FOUNDER_NAMES is duplicated out of `TEAM` to keep the About ledger out of the home bundle.
    // The duplication is only safe because this asserts it.
    expect(FOUNDER_NAMES).toEqual(TEAM.map((m) => m.name));
    expect(FOUNDER_NAMES).toEqual(['Clay Seifert', 'Daniel Guerra']);
  });

  it('the Organization contact is the site\'s own, not an invented one', () => {
    const org = organizationJsonLd();
    expect(org.email).toBe(CONTACT.email);
    expect(org.telephone).toBe(CONTACT.phone);
    expect(org.url).toBe('https://www.bowerbuild.org/');
    // No address, no foundingDate, no priceRange: the site publishes none of them, and schema
    // that outruns the page is the anti-pattern this whole file is guarding against.
    expect(org).not.toHaveProperty('address');
    expect(org).not.toHaveProperty('foundingDate');
  });

  it('the FAQPage mirrors the questions page verbatim, every question and every answer', () => {
    const faq = faqPageJsonLd() as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    // Seven questions plus the close, which is rendered as an eighth question on the page.
    expect(faq.mainEntity).toHaveLength(QUESTIONS.length + 1);
    QUESTIONS.forEach((item, i) => {
      const entry = faq.mainEntity[i];
      expect(entry.name).toBe(item.q);
      // Every paragraph, in order. Schema that paraphrases the page is schema that will one day
      // contradict it.
      for (const para of item.a) expect(entry.acceptedAnswer.text).toContain(para);
      for (const row of item.rows ?? []) {
        expect(entry.acceptedAnswer.text).toContain(`${row.stage}: ${row.span}`);
      }
    });
    const last = faq.mainEntity[faq.mainEntity.length - 1];
    expect(last.name).toBe(RING.q);
    expect(last.acceptedAnswer.text).toContain(CONTACT.email);
    expect(last.acceptedAnswer.text).toContain(RING.study);
  });

  /**
   * THE SCHEMA IS THE ONE PLACE A PRICE MAY APPEAR, BECAUSE IT IS NOT A COPY.
   *
   * `faqPageJsonLd()` maps over `QUESTIONS`, so the cost answer is the page's own sentence
   * serialized, not retyped. Omitting it would be the real error: a schema that dropped the cost
   * answer would contradict the page it claims to describe, and cost is the single question an
   * answer engine is most often asked about a Bower.
   *
   * So the guard here is the SAME one `questions/copy.test.ts` runs on the page — run again on the
   * schema's own output, because the schema is what leaves the building. Two places agreeing is
   * not evidence about either; what is checkable is that the number we publish clears the number
   * we incur.
   */
  it('runs the break-even guard on the SCHEMA output, not just on the page', () => {
    const faq = faqPageJsonLd() as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    const cost = faq.mainEntity.find((q) => q.name.includes('cost'))!;
    /**
     * FOLLOWS THE CLAIM, NOT THE FORMAT, exactly as `questions/copy.test.ts` now does.
     *
     * This parsed a numeral out of the paragraph beginning "Commissions begin at £..." — a sentence
     * that stopped existing on 2026-08-01 when the floor became words ("mid-six figures"). The
     * schema is GENERATED from the page, so the moment the page's format changed this guard was
     * reading a paragraph that was not there. Deleting it was the tempting repair and would have
     * left an answer engine free to be handed a below-cost figure with nothing checking.
     *
     * The floor phrase must be in the schema, and the lowest reading of that phrase must clear
     * cost. Both halves are needed: the number alone would guard a sentence nobody publishes.
     */
    expect(cost.acceptedAnswer.text).toContain(COMMISSION_BUDGET_POSITION);
    expect(cost.acceptedAnswer.text).not.toMatch(/£\s?\d/);
    // The superseded point value, pinned absent in the schema too — an answer engine quoting a
    // withdrawn price is the audience least able to notice it has been withdrawn.
    expect(cost.acceptedAnswer.text).not.toContain('£350,000');
  });

  it('the FAQ answers carry the public budget range and not the cold-visitor fee ladder', () => {
    const text = JSON.stringify(faqPageJsonLd());
    expect(text).not.toContain('£150,000');
    // BOTH STAGE FEES, as the page states them. The schema is generated from `QUESTIONS`, so an
    // answer engine quoting a superseded price is the same anchoring harm as the page doing it —
    // and it is the audience least able to notice.
    expect(text).toContain(COMMISSION_BUDGET_POSITION);
    expect(text).not.toContain('£18,000');
    // Every superseded fee, pinned absent. £25,000 was the old Stage 2 ceiling; £18,000 was its
    // floor and is now the STAGE 1 fee, which is exactly why this list is checked against the live
    // constants above rather than written out as literals.
    expect(text).not.toContain('£25,000');
    expect(text).not.toContain('£6,500');
    expect(text).not.toContain('£1,500');
    // The demo constants (COMMISSION_DEMO_FIGURE, COMMISSION_ANCHOR_GBP, COMMISSION_FLOOR_GBP) are
    // still anchored to £150k and are knowingly flagged-not-fixed, dev-only, Daniel's call. This
    // asserts none of them can leak into a surface that ships.
    for (const demo of [COMMISSION_DEMO_FIGURE, String(COMMISSION_ANCHOR_GBP), String(COMMISSION_FLOOR_GBP)]) {
      expect(text).not.toContain(demo);
    }
  });

  it('FAQPage is NOT in index.html, because it is not true of the other three pages', () => {
    expect(indexTags).not.toContain('FAQPage');
  });
});
