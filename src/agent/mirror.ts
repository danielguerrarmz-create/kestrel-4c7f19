/**
 * mirror.ts — the agent-readable mirror of the public site (2026-07-23, Clay: "I am having
 * trouble ever getting claude/other agents to be able to view the site... is there anything you
 * can change so that now and going forward non-humans can see the site?").
 *
 * WHY A MIRROR AND NOT SSR: the site is a client-rendered SPA, so a fetch of any URL returns an
 * empty `<div id="root">` and a JS bundle — an agent that does not execute JavaScript sees
 * nothing. Rather than re-architect rendering for a marketing site, we publish what such agents
 * actually consume: `/llms.txt` (the llms.txt convention: a markdown site guide at a well-known
 * path) plus full markdown mirrors of each public page under `/agent/`. They are static files in
 * `public/`, so every host that serves the site serves them, dev and production alike.
 *
 * HALF OF THAT PROBLEM WENT AWAY ON 2026-07-28 and half did not. The routes are real paths now
 * (`/about`, not `#/about`), so each page IS a distinct URL server-side and can be crawled,
 * canonicalized and ranked separately — see routing.ts. What has not changed is that the HTML at
 * those URLs is still an empty shell until JavaScript runs, which is exactly what these mirrors
 * are for. Both are needed: the paths make the pages addressable, the mirrors make them readable.
 *
 * "GOING FORWARD" IS THE DRIFT GUARD, NOT GOOD INTENTIONS. The mirrors are GENERATED from the
 * same components the human site renders — `renderToString` over SplashPage / AboutPage /
 * GalleryPage, converted to markdown — and `agentMirror.generated.test.ts` (the
 * subBranches.generated pattern) asserts on every test run that the committed files equal a fresh
 * render. Change any page copy and the suite goes red until `GEN=1 npx vitest run
 * agentMirror.generated` regenerates. A hand-written mirror would be stale prose within a week;
 * this one cannot lie silently.
 *
 * THE CONVERTER IS FOR OUR OWN MARKUP ONLY. htmlToMarkdown walks well-formed renderToString
 * output; it is not a general HTML parser and must never be pointed at foreign HTML. Rules:
 * headings become `#`s, list items become `-`, images become `![alt](src)`, anchors become
 * `[text](href)`, an `<svg role="img">` collapses to its aria-label (that is how the drawn About
 * timeline stays readable), and `aria-hidden` subtrees plus bare ornament svgs are dropped.
 */
import { renderToString } from 'react-dom/server';
import { createElement, type ComponentType } from 'react';
import { SplashPage } from '../pages/SplashPage';
import { AboutPage } from '../pages/AboutPage';
import { PracticePage } from '../pages/PracticePage';
import { GalleryPage } from '../pages/GalleryPage';
import { QuestionsPage } from '../pages/QuestionsPage';
import { HousesPage } from '../pages/HousesPage';
import { CommissionsPage } from '../pages/CommissionsPage';
import { ProcessPage } from '../pages/ProcessPage';
import { ContactPage } from '../pages/ContactPage';
import { PressPage } from '../pages/PressPage';
import { COMPANY_DESCRIPTION } from '../ui/priceCopy';

/* ------------------------------ html -> markdown --------------------------- */

const BLOCK = new Set([
  'address', 'article', 'aside', 'blockquote', 'button', 'dd', 'div', 'dl', 'dt', 'fieldset',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr',
  'li', 'main', 'nav', 'ol', 'p', 'section', 'table', 'tr', 'ul',
]);

const decode = (s: string): string =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

const attr = (tag: string, name: string): string | null => {
  const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
  return m ? decode(m[1]) : null;
};

/**
 * Convert renderToString output to readable markdown. A single pass over a tag/text token
 * stream with a skip-depth for subtrees that carry no prose (aria-hidden ornament, style, and
 * svgs — except an svg with a role="img" aria-label, which contributes its label as a paragraph).
 */
export function htmlToMarkdown(html: string): string {
  const tokens = html.split(/(<[^>]+>)/g).filter(Boolean);
  const out: string[] = [];
  /** Depth inside a subtree we are dropping entirely; 0 = keeping content. */
  let skip = 0;
  let skipTag = '';
  /** Stack of open anchor hrefs so `[text](href)` closes correctly. */
  const anchors: string[] = [];
  let heading: number | null = null;
  let inListItem = false;

  const push = (text: string) => {
    if (!text) return;
    out.push(text);
  };
  const blockBreak = () => {
    if (out.length && !out[out.length - 1].endsWith('\n\n')) push('\n\n');
  };

  for (const t of tokens) {
    if (t[0] !== '<') {
      if (skip) continue;
      const text = decode(t).replace(/\s+/g, ' ');
      if (text.trim()) push(text);
      // A whitespace-only text node is still a word boundary: React renders `the{' '}<em>` as
      // `the<!-- --> <em>`, so dropping bare-space tokens glued real words together ("theone").
      else if (text && out.length) push(' ');
      continue;
    }
    const isClose = t[1] === '/';
    const name = (t.match(/^<\/?\s*([a-zA-Z0-9]+)/)?.[1] ?? '').toLowerCase();
    const selfClosing = /\/>$/.test(t) || ['br', 'hr', 'img', 'source', 'image'].includes(name);

    if (skip) {
      if (!isClose && !selfClosing && name === skipTag) skip++;
      if (isClose && name === skipTag) skip--;
      continue;
    }

    if (!isClose && (name === 'style' || name === 'script' || name === 'noscript')) {
      skip = 1;
      skipTag = name;
      continue;
    }
    if (!isClose && name === 'svg') {
      // A described drawing speaks its description; ornament says nothing.
      const label = attr(t, 'aria-label');
      if (label) {
        blockBreak();
        push(`*${label.trim()}*`);
        blockBreak();
      }
      skip = 1;
      skipTag = 'svg';
      continue;
    }
    if (!isClose && attr(t, 'aria-hidden') === 'true' && !selfClosing) {
      skip = 1;
      skipTag = name;
      continue;
    }

    if (name === 'img') {
      if (attr(t, 'aria-hidden') === 'true') continue;
      const alt = (attr(t, 'alt') ?? '').trim();
      const src = attr(t, 'src') ?? '';
      // An empty alt is the decorative-image convention; a mirror line with no description
      // would be a bare punctuation mark, which is exactly what a screen reader also skips.
      if (!alt) continue;
      if (src && !src.startsWith('data:')) {
        blockBreak();
        push(`![${alt}](${src})`);
        blockBreak();
      }
      continue;
    }
    if (name === 'br') {
      push('\n');
      continue;
    }
    if (name === 'a') {
      if (!isClose) {
        anchors.push(attr(t, 'href') ?? '');
        push('[');
      } else {
        const href = anchors.pop() ?? '';
        push(`](${href}) `);
      }
      continue;
    }
    // JSX puts no whitespace between sibling inline labels (`<span>01</span><span>Title</span>`),
    // so a closing inline tag contributes a soft space; the cleanup pass collapses doubles and
    // the punctuation rule removes any that land before a comma or full stop.
    if ((name === 'span' || name === 'em' || name === 'strong' || name === 'i' || name === 'b') && isClose) {
      push(' ');
      continue;
    }
    const h = name.match(/^h([1-6])$/);
    if (h && !isClose) {
      blockBreak();
      heading = Number(h[1]);
      push('#'.repeat(heading) + ' ');
      continue;
    }
    if (h && isClose) {
      heading = null;
      blockBreak();
      continue;
    }
    if (name === 'li' && !isClose) {
      blockBreak();
      inListItem = true;
      push('- ');
      continue;
    }
    if (name === 'li' && isClose) {
      inListItem = false;
      blockBreak();
      continue;
    }
    if (BLOCK.has(name)) blockBreak();
  }

  void heading;
  void inListItem;

  // Join, then tidy: spaces around newlines, >2 blank lines, stray space before punctuation
  // introduced by tag boundaries, and empty links ("[](...)" from icon-only anchors).
  return out
    .join('')
    .replace(/\[\]\([^)]*\)/g, '')
    .replace(/ +\]/g, ']')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ +([.,;:!?])/g, '$1')
    .replace(/ {2,}/g, ' ')
    .trim();
}

/* --------------------------------- the mirrors ----------------------------- */

const render = (Page: ComponentType) => htmlToMarkdown(renderToString(createElement(Page)));

const PREAMBLE = (human: string, title: string) =>
  `<!-- GENERATED FILE. Do not edit: src/agent/mirror.ts renders it from the live page
     components, and agentMirror.generated.test.ts fails the suite if it drifts.
     Regenerate: GEN=1 npx vitest run agentMirror.generated -->

# ${title}

> Markdown mirror of ${human} for AI agents and other non-JavaScript readers, generated
> from the same React components the human page renders. Image paths are root-relative
> to this site's origin.

`;

export function homeMirror(): string {
  return PREAMBLE('the Bower home page (`/`)', 'Bower — home') + render(SplashPage) + '\n';
}

export function aboutMirror(): string {
  return PREAMBLE('the Bower about page (`/about`)', 'Bower — about') + render(AboutPage) + '\n';
}

/** The founders, the timeline and the work: the EXPANDED about, nested at `/about/practice` since
 *  2026-07-31. This is the mirror an agent asked "who are these people, and what have they built"
 *  actually needs — `/agent/about.md` is now the short page and answers a different question. */
export function practiceMirror(): string {
  return (
    PREAMBLE('the Bower company page (`/about/practice`)', 'Bower — the company') +
    render(PracticePage) +
    '\n'
  );
}

export function galleryMirror(): string {
  return PREAMBLE('the Bower gallery (`/gallery`)', 'Bower — gallery') + render(GalleryPage) + '\n';
}

/** The practical answers (2026-07-28). The one mirror whose content an agent asked about Bower is
 *  most likely to actually need: price, planning, timeline, and the contact details. */
export function questionsMirror(): string {
  return (
    PREAMBLE('the Bower questions page (`/questions`)', 'Bower — questions') +
    render(QuestionsPage) +
    '\n'
  );
}

/** The commercial-hospitality page (2026-07-31). DEV-ONLY since 2026-08-04: no longer generated
 *  into `public/agent/` or listed in llms.txt, but kept exported so the page's own guards
 *  (capacity, house rules on its copy) stay armed while the material waits for an aimed relaunch. */
export function housesMirror(): string {
  return (
    PREAMBLE('the Bower houses page (`/houses`)', 'Bower — houses') + render(HousesPage) + '\n'
  );
}

export function commissionsMirror(): string {
  return PREAMBLE('the Bower commissions page (`/commissions`)', 'Bower — commissions') + render(CommissionsPage) + '\n';
}

export function processMirror(): string {
  return PREAMBLE('the Bower process page (`/process`)', 'Bower — process') + render(ProcessPage) + '\n';
}

export function contactMirror(): string {
  return PREAMBLE('the Bower contact page (`/contact`)', 'Bower — contact') + render(ContactPage) + '\n';
}

export function pressMirror(): string {
  return PREAMBLE('the Bower press page (`/press`)', 'Bower — press') + render(PressPage) + '\n';
}

/** The llms.txt site guide (llmstxt.org convention): a short orientation plus links to the full
 *  mirrors. The one-line description is index.html's own meta description, so the two cannot
 *  disagree about what Bower is without this file going red in the drift test. */
export function llmsTxt(): string {
  return `# Bower

> ${COMPANY_DESCRIPTION}
> We design and build living garden pavilions: organic timber gridshell structures, designed
> for the climbing plants that grow into them and made for the garden they stand in.
> This is the marketing site; it is a JavaScript single-page app, so non-JavaScript readers
> should use the markdown mirrors below.

## Pages

- [Home](/agent/home.md): what Bower is, the product story, register interest
- [Commissions](/agent/commissions.md): cultural landscapes, gathering, ecology and learning
- [Gallery](/agent/gallery.md): fourteen concept studies of Bowers in gardens, gatherings and cultural landscapes
- [Process](/agent/process.md): conversation, feasibility, design, making and stewardship
- [Contact](/agent/contact.md): discuss a founding commission with Clay Seifert
- [Press](/agent/press.md): press and editorial enquiries
- [Questions](/agent/questions.md): size, price, planning permission, groundworks, timeline,
  pruning, and how to contact the studio
- [About](/agent/about.md): what a Bower is and what the practice is for, in short
- [The company](/agent/practice.md): the two founders, the timeline of the company, and the
  work so far. The expanded version of the About page, nested at \`/about/practice\`

## Notes for agents

- The human site lives at \`/\`, \`/commissions\`, \`/gallery\`, \`/process\`, \`/about\`,
  \`/about/practice\`, \`/contact\`, \`/press\` and \`/questions\`. These are real paths, and an
  old hash link still redirects to the new path), but each one serves the same HTML shell and
  needs JavaScript to render.
- Images referenced in the mirrors are root-relative and fetchable directly.
- \`/sitemap.xml\` lists the nine public URLs.
- The gallery images are concept studies and concept visualisations, not photographs of
  built work, and the site says so.
- Bower has built nothing yet. Every image on the site is a rendering and is labelled as one.
  A Bower is not a marquee and the site does not claim that it replaces one.
`;
}
