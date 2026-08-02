/**
 * seo.ts — the head of every page: title, description, canonical, the social card, and the
 * structured data. One module, because all five have to agree with each other and with the
 * router, and the only way they agree is by being derived from the same place.
 *
 * WHY THIS EXISTS (2026-07-28). Until the path-router change the whole site was one URL to a
 * crawler (`/#/gallery` is `/` with a fragment the server never sees), so there was exactly one
 * `<title>` — the word "Bower" — one description, no canonical, and no sitemap. The strongest
 * relevance signal a page has was spent on the brand name for all four pages at once.
 *
 * AND THE SOCIAL CARD WAS ADVERTISING A PRODUCT THAT NO LONGER EXISTS. index.html's `og:title`
 * read "Bower: shape a living pavilion, priced fixed as you shape it" and its description sold
 * "a generative design engine constrained by a fabrication grammar" — the studio/draw tool, which
 * came off the live site on 2026-07-21. There was no `og:image` at all, so a pasted link showed a
 * blank card with a browser icon and a sentence about a tool nobody can open. The copy below
 * describes the practice as it actually is: a design and manufacturing company that builds living garden pavilions.
 *
 * THERE ARE NO FIGURES IN THE META LAYER, AND THAT IS THE RULE, NOT AN OVERSIGHT.
 *
 * The first version of this file wrote `£350,000 including VAT` into two meta descriptions and two
 * og:descriptions as string literals, with a test binding them to the questions page's answer. That
 * test would have passed forever and the design was still wrong, for the reason this repo keeps
 * relearning: **one fact, one owner.** `pages/questions/copy.ts` owns the published price, it is
 * bound to `ui/priceCopy.ts`'s `COMMISSION_FROM`, and `COMMISSION_BREAKEVEN_GBP` guards it as a COST
 * fact the published figure must clear. Adding a fifth and sixth copy in the head is how the
 * £150,000 incident happens again, and the head is the worst possible place for it: a link card is
 * cached by iMessage, WhatsApp, Slack and LinkedIn for months, outside our control, and gets
 * screenshotted. A test cannot un-cache a frozen card. A price nobody re-reads when it changes is
 * precisely the bug this whole change exists to fix.
 *
 * So the head SELLS and the PAGE PRICES. `seo.test.ts` pins the absence: no currency symbol and no
 * bare thousands figure may appear in any title, description or og:description.
 *
 * THE ONE EXCEPTION IS THE FAQ SCHEMA, AND IT IS NOT A COPY. `faqPageJsonLd()` mirrors `QUESTIONS`
 * verbatim, so it does carry the prices — it IS the page, serialized for answer engines, and a
 * schema that omitted the cost answer would contradict the page it describes. It is derived, never
 * retyped, and `seo.test.ts` runs the same break-even guard on the schema's own output that
 * `questions/copy.test.ts` runs on the page's.
 */
import { useEffect } from 'react';
import { PUBLIC_ROUTES, normalizePath, resolveRoute, routes, type RouteTarget } from './routing';
import { QUESTIONS, RING } from './pages/questions/copy';
import { CONTACT, WORDMARK } from './data/config';
import { COMPANY_DESCRIPTION } from './ui/priceCopy';

/**
 * The canonical origin, WITH the `www`.
 *
 * Verified live 2026-07-28: `bowerbuild.org` answers a 308 to `https://www.bowerbuild.org`, so the
 * www host is the one that serves pages and the one every absolute URL here must use. A canonical
 * pointing at the apex would name a URL that only ever redirects, and an `og:image` on the apex
 * costs every unfurler an extra hop (some give up). No trailing slash: every path below supplies
 * its own leading one.
 */
export const SITE_ORIGIN = 'https://www.bowerbuild.org';

/** Absolute URL for a route path. Absolute is not optional for `og:*` — an unfurler has no base. */
export const absoluteUrl = (path: string): string => `${SITE_ORIGIN}${path}`;

/**
 * THE SHARING CARD. A real 1200x630 JPEG, generated from the gallery's wisteria walk by
 * `scripts/gen-og-card.mjs` so it is reproducible rather than a mystery binary in git.
 *
 * JPEG, NOT WEBP, and that is the whole reason a separate asset exists when the site already
 * ships this picture. The gallery serves `.webp`; iMessage, WhatsApp and LinkedIn are unreliable
 * with WebP in a link preview and will fall back to no image at all, which is the exact bug this
 * is fixing. 1200x630 is the 1.91:1 size every unfurler crops to.
 */
export const OG_CARD = {
  path: '/assets/social/og-card.jpg',
  width: 1200,
  height: 630,
  alt: 'A walk beneath woven timber arches, wisteria hanging through the lattice, cafe tables in the shade beside it',
} as const;

/** One page's head. `ogTitle`/`ogDescription` are separate because a link card is read in a
 *  different posture than a search result: no `| Bower` suffix (the card already prints the site
 *  name), and no keyword work. */
export interface PageMeta {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

/** The only targets `resolveRoute(path, false)` can return: the four pages production serves.
 *  Narrowing it here is what makes `META` exhaustive by construction — add a public page and the
 *  compiler asks for its title rather than letting it ship with the home's. */
type ProductionTarget = Exclude<RouteTarget, 'engine' | 'aboutTree'>;

/**
 * Keyed by the PRODUCTION route target, not by path, on purpose: a crawler asking for `/studio`
 * is served the home splash (the engine gate), so `/studio` must carry the HOME's canonical and
 * title. Keying off `resolveRoute(path, false)` makes "what the crawler sees" and "what the head
 * claims" the same decision rather than two lists that drift.
 */
const META: Record<ProductionTarget, PageMeta> = {
  splash: {
    path: routes.home,
    title: 'Living garden pavilions, designed and built | Bower',
    description:
      'Bower designs and builds living garden pavilions: woven timber gridshells planted with the climbers that grow into them, drawn for the garden they stand in.',
    ogTitle: 'Bower: living garden pavilions',
    ogDescription:
      'A design and manufacturing company building woven timber pavilions for gardens, planted with the climbers that grow into them. Each one drawn for its own garden.',
  },
  gallery: {
    path: routes.gallery,
    title: 'Garden pavilion designs: seven commission visions | Bower',
    description:
      'Seven concept renderings of Bower garden pavilions in their gardens: woven timber gridshells with wisteria, roses and climbers grown through the lattice.',
    ogTitle: 'Bower: seven commission visions',
    ogDescription:
      'Concept renderings of Bower garden pavilions in their gardens, from a wisteria walk to a glass crown.',
  },
  questions: {
    path: routes.questions,
    title: 'Garden pavilion cost, planning permission, timeline | Bower',
    description:
      'What a Bower costs, whether you need planning permission, what it does to your lawn, and how long before you are sitting in it. The practical answers.',
    ogTitle: 'Bower: what one costs, and what it involves',
    ogDescription:
      'The price, the planning position, what building one does to a lawn, and how long it takes. The questions people actually ask, answered plainly.',
  },
  houses: {
    path: routes.houses,
    // NO FIGURES AND NO CAPACITY IN THE HEAD. The same rule as the price: a link card is cached for
    // months by iMessage, WhatsApp, Slack and LinkedIn, gets screenshotted, and cannot be un-cached
    // by a green test. A capacity is exactly the claim this segment checks first.
    title: 'Garden pavilions for houses that receive people | Bower',
    description:
      'A woven timber room for a house that receives people. Raised once on ground screws, it stands through the winter and is better in its tenth year than its first.',
    ogTitle: 'Bower: for houses that receive people',
    ogDescription:
      'A room in the garden that is there in November. Raised once, planted, and left standing. Drawn for the house it belongs to.',
  },
  about: {
    path: routes.about,
    title: 'About Bower: what we build, and why',
    description:
      'The most beautiful places are rarely buildings. A Bower is a woven timber lattice, deliberately incomplete: we make the structure, the garden makes the rest.',
    ogTitle: 'About Bower',
    ogDescription:
      'We make the structure; the garden makes the rest. A woven timber lattice, deliberately incomplete, finished only once the planting has had its say.',
  },
  practice: {
    path: routes.practice,
    title: 'The practice behind Bower: the founders and the work',
    description:
      'The two cofounders behind Bower, the research the practice grew out of, and the architecture and robotics work that came before the first pavilion.',
    ogTitle: 'The practice behind Bower',
    ogDescription:
      'The two cofounders, the research the practice grew out of, and the work that came before the first pavilion.',
  },
};

/**
 * The head for a route path. Pure, so every claim it makes is testable without a DOM.
 *
 * An unknown path returns the HOME's meta, canonical included. That is not laziness: the router
 * serves the splash for anything it does not recognize, so `/typo` IS the home page, and
 * self-canonicalizing it would invite a crawler to index infinitely many duplicates of the home
 * under invented URLs.
 */
export function metaForPath(path: string): PageMeta {
  // NORMALIZE FIRST. `useRoute` already does, so in the running app this is a no-op — but that
  // makes it an invisible dependency on one caller, and the failure is silent in the worst way:
  // `/gallery/` would miss `resolveRoute`'s exact match, fall through to the splash, and
  // CANONICALIZE THE GALLERY TO THE HOME. Caught by analytics.test.ts asking whether a trailing
  // slash reports as the same page, which is the same question one level out.
  // `dev: false` is the other load-bearing argument: it asks what PRODUCTION serves at this path,
  // which is the only view a crawler or an unfurler ever gets.
  return META[resolveRoute(normalizePath(path), false) as ProductionTarget] ?? META.splash;
}

/* ------------------------------ structured data ---------------------------- */

/**
 * The founders, for the Organization schema.
 *
 * NAMED HERE RATHER THAN IMPORTED FROM `pages/about/projects.ts` on purpose: that module is the
 * whole About ledger (sixteen projects, every image path, every bio) and importing it here would
 * pull it into the home page's bundle to print two strings. `seo.test.ts` asserts these match
 * `TEAM` exactly, so the coupling is paid at test time and costs the reader nothing.
 */
export const FOUNDER_NAMES: readonly string[] = ['Clay Seifert', 'Daniel Guerra'];

/**
 * Organization schema for Bower. Every field is something the site already says out loud:
 * the description is llms.txt's own sentence, the founders are the About page's two bios, and
 * the contact is the questions page's close. Nothing here is invented, and nothing here claims a
 * postal address or a founding date the site does not publish.
 */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: WORDMARK,
    url: SITE_ORIGIN + routes.home,
    logo: absoluteUrl('/favicon.svg'),
    image: absoluteUrl(OG_CARD.path),
    // `COMPANY_DESCRIPTION` is how the practice describes itself to a crawler, an agent or a
    // journalist (Clay, 2026-08-01), followed by what the thing actually is. The order matters:
    // the positioning sentence answers "what kind of company", the second answers "what do they
    // make", and a reader of structured data wants both in that order.
    description: `${COMPANY_DESCRIPTION} We design and build living garden pavilions: organic timber gridshell structures, designed for the climbing plants that grow into them and made for the garden they stand in.`,
    founder: FOUNDER_NAMES.map((name) => ({ '@type': 'Person', name })),
    email: CONTACT.email,
    telephone: CONTACT.phone,
  };
}

/**
 * FAQPage schema for `/questions`, built from `QUESTIONS` itself.
 *
 * BUILT FROM THE PAGE'S OWN COPY, NEVER HAND-WRITTEN. Schema that disagrees with the visible text
 * is a Google policy violation and, worse here, a way to publish a price the page has corrected:
 * the £150,000 that shipped for a few hours on 2026-07-28 would have lived on in a hand-copied
 * answer long after the page said £350,000. Paragraphs join with a blank line so an answer engine
 * lifting the raw text gets the same sentences, in the same order, that a reader sees.
 *
 * The close ("Who do I ring?") is included as the last entry because it IS one of the questions on
 * the page, rendered with the same heading and rule as the other seven.
 */
export function faqPageJsonLd(): Record<string, unknown> {
  const entries = [
    ...QUESTIONS.map((item) => ({
      q: item.q,
      a: [...item.a, ...(item.rows ?? []).map((r) => `${r.stage}: ${r.span}`)],
    })),
    { q: RING.q, a: [`${CONTACT.name}, ${CONTACT.phone}, ${CONTACT.email}`, RING.first, RING.study, RING.next] },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: absoluteUrl(routes.questions),
    mainEntity: entries.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a.join('\n\n') },
    })),
  };
}

/* --------------------------------- the sitemap ----------------------------- */

/**
 * `public/sitemap.xml`, generated from `PUBLIC_ROUTES` and drift-guarded by
 * `sitemap.generated.test.ts` — the same pattern as the agent mirror. A hand-maintained sitemap
 * is a list of URLs that used to be true; this one cannot list a route that is not public, and
 * cannot omit one that is.
 *
 * No `lastmod`: a date this file cannot verify is a date it should not publish, and a stale or
 * always-today `lastmod` is worse than none. No `changefreq`/`priority` either; Google ignores
 * both and has said so.
 */
export function sitemapXml(): string {
  const urls = PUBLIC_ROUTES.map((p) => `  <url>\n    <loc>${absoluteUrl(p)}</loc>\n  </url>`).join(
    '\n',
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/* ----------------------------------- the DOM ------------------------------- */

/** Set (or create) a `<meta>` by `name=` or `property=`. */
function setMeta(keyAttr: 'name' | 'property', key: string, content: string): void {
  const sel = `meta[${keyAttr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(keyAttr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** The one `<script type="application/ld+json">` this module owns, so re-navigating replaces
 *  rather than accumulates. Marked with a data attribute so it can never collide with the static
 *  Organization block index.html ships for non-JavaScript readers. */
const LD_MARK = 'data-route-jsonld';

/**
 * Apply a page's head to the document: title, description, canonical, and the OG/Twitter pair
 * that varies per page. The tags that do NOT vary (`og:image`, `og:type`, `og:site_name`,
 * `twitter:card`) stay in index.html, so a link unfurler that does not run JavaScript still gets
 * a card — which is most of them.
 *
 * Exported for the test; components use `useDocumentMeta`.
 */
export function applyDocumentMeta(path: string): void {
  const meta = metaForPath(path);
  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('property', 'og:title', meta.ogTitle);
  setMeta('property', 'og:description', meta.ogDescription);
  setMeta('property', 'og:url', absoluteUrl(meta.path));
  setMeta('name', 'twitter:title', meta.ogTitle);
  setMeta('name', 'twitter:description', meta.ogDescription);

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', absoluteUrl(meta.path));

  // FAQPage belongs to `/questions` and to nothing else. Claiming every URL is an FAQ page is
  // both wrong and a policy violation, so this is injected per route and removed on the way out.
  const stale = document.head.querySelector(`script[${LD_MARK}]`);
  if (stale) stale.remove();
  if (meta.path === routes.questions) {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute(LD_MARK, 'faq');
    script.textContent = JSON.stringify(faqPageJsonLd());
    document.head.appendChild(script);
  }
}

/** Apply the head for the current route, after paint. */
export function useDocumentMeta(path: string): void {
  useEffect(() => {
    applyDocumentMeta(path);
  }, [path]);
}
