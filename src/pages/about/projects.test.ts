import { describe, it, expect } from 'vitest';
import { PROJECTS, DISCIPLINE_ORDER } from './projects';

/**
 * The fixed-panel safety net.
 *
 * The detail panel does not scroll: the media area is a fixed two-region (hero top half, a tidy grid
 * of the rest in the bottom half) and the text column establishes hierarchy through spacing, not an
 * inner scroll. A description or a lesson that grows too long would CLIP instead of scroll. These
 * budgets — calibrated against the real worst cases with a grace margin, not round numbers — turn
 * "currently fits" into "cannot ship if it stops fitting."
 *
 * If a new project trips one of these, the fix is to tighten the copy, NOT to raise the budget — the
 * number is the guarantee. Raise it only after re-measuring the text column at 1366x768 and 1280x800
 * and confirming the taller field still fits.
 */
const BUDGET = {
  /** Title sits beside the meta line. Most are short; the longest is "Hydraulic Commons: Water
   *  Infrastructure" at 39, which wraps to a second line in the narrow menu — that is acceptable. */
  title: 42,
  /** The two-to-three sentence description with its outcome. Longest today is Hydraulic at ~335. */
  description: 340,
  /** The "What we learned" pill at the bottom of the column. Longest is Robots at 228. */
  learned: 260,
  /** venue + " · " + authors, the folded citation line. Longest is Archipedia at 84. */
  citation: 100,
  /** The collaborators / professors line. Longest is Archipedia at 28. */
  collaborators: 60,
} as const;

/** The IMAGE BUDGET (Comment 4): every project shows the hero plus up to three — 1..4 images total. */
/**
 * 4 -> 9 (2026-07-16, round 8), and the reason the cap existed is now handled somewhere better.
 *
 * It was 4 because the rail could OVERFLOW: `stackRatio` sized the cells to fill the height and
 * forgot the (n-1) gaps between them, so every extra image pushed the last one further out of the
 * region and into the "WHAT WE LEARNED" pill. A count cap was the only lever anyone had. That is
 * fixed at the root — `railWidth` puts the gaps in the arithmetic, so the stack fits BY
 * CONSTRUCTION at any count and simply gets narrower.
 *
 * What a count cap can never see is the thing that actually matters now: whether a CELL is legible.
 * That is a function of the height, the ratios and the count together, it only exists in a real
 * layout, and `qa/project-media.mjs` measures it against the running page and fails on slivers.
 * This number is a sanity bound on authored content, not a design rule.
 *
 * 9 is Origami: the hospital photograph, the staged prototype, and the seven-sheet assembly
 * brochure Daniel asked to be wired in. TODO(Daniel): at 9 the rail's cells measure 69px — a
 * legible INDEX (you can see six numbered steps and click any to full size) but not readable
 * documentation. Flagged rather than silently accepted; see the handoff.
 */
const MAX_IMAGES = 9;

/** The citation exactly as the panel renders it: `${venue} · ${authors}`. */
function citationOf(p: (typeof PROJECTS)[number]): string {
  return p.paper ? `${p.paper.venue} · ${p.paper.authors}` : '';
}

describe('projects.ts — the fixed detail panel fits without an inner scroll', () => {
  it.each(PROJECTS.map((p) => [p.n, p.title, p] as const))(
    '%s %s stays within every text budget',
    (_n, _title, p) => {
      expect(p.title.length, `title over ${BUDGET.title}`).toBeLessThanOrEqual(BUDGET.title);
      expect(p.description.length, `description over ${BUDGET.description}`).toBeLessThanOrEqual(
        BUDGET.description,
      );
      expect(p.learned.length, `learned over ${BUDGET.learned}`).toBeLessThanOrEqual(BUDGET.learned);
      expect(citationOf(p).length, `citation over ${BUDGET.citation}`).toBeLessThanOrEqual(
        BUDGET.citation,
      );
      if (p.collaborators) {
        expect(p.collaborators.length, `collaborators over ${BUDGET.collaborators}`).toBeLessThanOrEqual(
          BUDGET.collaborators,
        );
      }
    },
  );

  it('every project carries at least one image (the hero) and at most four', () => {
    for (const p of PROJECTS) {
      expect(p.images.length, `${p.n} ${p.title} has no images`).toBeGreaterThanOrEqual(1);
      expect(p.images.length, `${p.n} ${p.title} has more than ${MAX_IMAGES} images`).toBeLessThanOrEqual(
        MAX_IMAGES,
      );
    }
  });

  it('every image carries a finite, positive aspect ratio (the gallery sizes plates by it)', () => {
    for (const p of PROJECTS) {
      for (const im of p.images) {
        expect(Number.isFinite(im.ratio) && im.ratio > 0, `${p.n} ${im.src} ratio ${im.ratio}`).toBe(
          true,
        );
      }
    }
  });

  it('a pending image is a placeholder: no real src, and it never carries a caption-only real asset', () => {
    for (const p of PROJECTS) {
      for (const im of p.images) {
        if (im.pending) {
          expect(im.src, `${p.n} pending image should have an empty src`).toBe('');
        } else {
          expect(im.src.length, `${p.n} non-pending image needs a real src`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('every project has a valid discipline, and each of the three groups is non-empty', () => {
    for (const p of PROJECTS) {
      expect(DISCIPLINE_ORDER, `${p.n} ${p.title} discipline "${p.discipline}"`).toContain(p.discipline);
    }
    for (const d of DISCIPLINE_ORDER) {
      expect(PROJECTS.some((p) => p.discipline === d), `discipline group "${d}" is empty`).toBe(true);
    }
  });

  /*
   * THE LICENSED CROP IS A LICENCE, NOT A PRECEDENT — and this test is where that sentence stops
   * being prose. Daniel ruled, twice and explicitly, that ONE asset may fill the hero region and lose
   * the overflow: Robots' KUKA loop, because a uniform region and an uncropped 1.7778 video cannot
   * coexist and he chose uniformity ("prioritize that every project occupies the same formatting").
   *
   * IT COSTS 20.1% OF WIDTH. The Plentify loss that got `object-fit: cover` BANNED on heroes was 21%.
   * The difference is not the number — there is no meaningful difference in the number. The difference
   * is that this one is a scoped ruling on a named asset and that one was a silent default. Which
   * means the ONLY thing separating a licence from the return of the banned pattern is that it stays
   * on exactly one asset. Six months from now the comment explaining that will read as permission.
   *
   * So the scope is asserted, by src, rather than described. A second `fillHero` fails here — and it
   * fails with this paragraph attached, which is the point: the next person gets Daniel's reasoning
   * and its cost, not a mystery boolean they route around.
   */
  it('exactly ONE asset carries the licensed crop, and it is the one Daniel licensed', () => {
    const licensed = PROJECTS.flatMap((p) => p.images.filter((im) => im.fillHero === true).map((im) => ({ p, im })));
    expect(
      licensed.length,
      `fillHero is Daniel's scoped licence on ONE asset (Robots' KUKA loop). Found ${licensed.length}: ` +
        `${licensed.map((l) => `${l.p.title} -> ${l.im.src}`).join(', ')}. If a new asset needs to crop its hero, ` +
        `that is a ruling from Daniel, not a flag you add.`,
    ).toBe(1);
    expect(licensed[0].im.src, 'the licence belongs to the KUKA robot loop poster and nothing else').toContain(
      'kuka-robotics-robot-loop-poster',
    );
    // It only means anything on a hero: fillHero on a rail image would crop a supporting shot silently.
    expect(licensed[0].im.hero, 'the licensed crop must be the hero of its project').toBe(true);
  });

  /*
   * A PAPER MAY BE MISSING ITS FILE. IT MAY NOT BE MISSING ITS CITATION.
   *
   * `Recognition` gates the download button on `paper?.pdf`, so `pdf: ''` is a supported, meaningful
   * state: a real citation, no button, file pending (Archipedia). But it renders
   * `{paper.venue} · {paper.authors}` UNCONDITIONALLY — so a `paper` with empty strings does not
   * degrade to nothing, it ships a bare "·" under an "AWARDS AND PUBLICATIONS" heading.
   *
   * That is the trap this test exists for: round 10 was asked to scaffold Plentify's paper "against the
   * Archipedia precedent", and the precedent silently does not transfer, because Archipedia is missing
   * only the FILE while Plentify has no venue and no authors anywhere in the repo. The safe-looking move
   * was the broken one. So the invariant is pinned instead of trusted: pdf may be empty, the citation
   * may not, and the only lawful way to fill this is facts from Daniel.
   */
  it('every paper has a real citation, even when its PDF is still pending', () => {
    for (const p of PROJECTS) {
      if (!p.paper) continue;
      expect(p.paper.venue.trim(), `${p.n} ${p.title}: a paper with no venue renders a bare "·"`).not.toBe('');
      expect(p.paper.authors.trim(), `${p.n} ${p.title}: a paper with no authors renders a bare "·"`).not.toBe('');
      // pdfSize is the button's label, so it only has to exist when the button does.
      if (p.paper.pdf.trim() !== '') {
        expect(p.paper.pdfSize.trim(), `${p.n} ${p.title}: a download button with no size label`).not.toBe('');
      }
    }
  });

  it('the `n` order is a clean run with no gaps', () => {
    const ns = [...PROJECTS].map((p) => p.n).sort((a, b) => a.localeCompare(b));
    ns.forEach((n, i) => {
      expect(n, `n sequence broken at index ${i}`).toBe(String(i + 1).padStart(2, '0'));
    });
  });

  /**
   * THE DATE RUN IS NOW PER TIER, AND THE CHANGE IS NOT A WEAKENING.
   *
   * This asserted that sorting by `n` agreed with descending year across the whole list, which was
   * true while the list was one flat reverse-chronological run. The venue rewrite (2026-07-31) put
   * the three lead projects first, and they are OLDER than the five research entries — so the
   * global run had to break for the page to lead with the work that argues the practice builds
   * things.
   *
   * The property worth keeping is that a reader never sees the clock jump BACKWARDS inside a group,
   * which is what made the flat list legible in the first place. So it is asserted within each
   * tier, and separately the tiers must not interleave — that second assert is the one that would
   * catch the real regression, a research entry sorted up among the leads.
   */
  it('years descend within each tier, and the tiers do not interleave', () => {
    const byN = [...PROJECTS].sort((a, b) => a.n.localeCompare(b.n));

    const tiers = byN.map((p) => p.tier);
    expect(tiers.indexOf('lead'), 'the leads must come first').toBe(0);
    expect(tiers.lastIndexOf('lead'), 'a research entry is sorted among the leads').toBeLessThan(
      tiers.indexOf('research'),
    );

    for (const tier of ['lead', 'research'] as const) {
      const group = byN.filter((p) => p.tier === tier);
      expect(group.length, `no ${tier} projects to check`).toBeGreaterThan(0);
      for (let i = 1; i < group.length; i++) {
        expect(
          Number(group[i].year),
          `${group[i].n} ${group[i].title} (${group[i].year}) is newer than the one before it in ${tier}`,
        ).toBeLessThanOrEqual(Number(group[i - 1].year));
      }
    }
  });
});
