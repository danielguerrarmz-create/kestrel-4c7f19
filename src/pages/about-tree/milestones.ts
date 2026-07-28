/**
 * milestones.ts — the CONTENT of the Tree of Life About draft (#/about/tree, dev-only).
 *
 * DATA AND THE SHAPE OF DATA ONLY, same law as about/clusters.ts: nothing here may import
 * from the page or the layout. The geometry reads this list; this list knows nothing of
 * the geometry.
 *
 * PROVENANCE — nothing below is invented:
 *   - Images and their measured ratios/alt text come verbatim from about/clusters.ts
 *     (the timeline plates Daniel curated) and about/projects.ts (project heroes). If an
 *     asset is swapped there, re-check it here.
 *   - `blurb` / `fact` / `impact` are condensed from the SAME project's `description` and
 *     `learned` fields in about/projects.ts, or from facts already published on #/about
 *     (the TEAM provenance block: Resia's two accelerators and ten people; Rogers
 *     Partners June to December 2025; the fourteen-student Kenya team; CAADRIA 2026).
 *     Shortened, never extended — no new claims.
 *   - The crown image is one of the seven commission visions from GalleryPage.tsx.
 *
 * TIER IS THE VISUAL HIERARCHY the brief asks for — size encodes historical importance:
 *   landmark  the founding moments (the shared desk, New York's closing door, Bower)
 *   major     the first big built arguments (Plentify, Dougherty)
 *   grove     significant work (Origami device, Robots, Resia, Robotic Factory)
 *   leaf      smaller events (the research papers' saliency plate, the compression
 *             test, the LLO lamp)
 *
 * ON CROPPING: `cover` images render inside ORGANIC frames (the brief: "organic shapes…
 * natural crops. Never use rigid square blocks"), so the edges of a photograph are
 * deliberately eaten by the frame here. That is this page's licensed exception to the
 * no-crop law on #/about — the law protects project documentation surfaces; this page is
 * a narrative drawing. Anything with baked-in text or linework stays `contain` on a mat
 * and is never clipped.
 */

export type TreeTier = 'landmark' | 'major' | 'grove' | 'leaf';
export type TreeSide = 'left' | 'right' | 'center';

export interface TreeImage {
  src: string;
  /** Measured intrinsic ratio (width / height) — inherited from clusters.ts / projects.ts. */
  ratio: number;
  alt: string;
  /** Drawings and figures with baked-in text use 'contain' on a vellum mat (never clipped);
   *  photographs use 'cover' inside the organic frame (the brief's natural crop). */
  fit?: 'cover' | 'contain';
}

export interface TreeMilestone {
  id: string;
  /** Display year. */
  year: string;
  /** Fractional year for chronological ordering (mirrors clusters.ts anchors). */
  when: number;
  title: string;
  /** One or two sentences — the card's short description. */
  blurb: string;
  /** The card's "field note": one interesting, sourced fact. */
  fact: string;
  /** The card's "what it grew": the milestone's effect on the practice, from `learned`. */
  impact: string;
  tier: TreeTier;
  side: TreeSide;
  image: TreeImage;
}

const A = '/assets/projects';
const T = '/assets/about/timeline';
const G = '/assets/gallery';

export const TREE_MILESTONES: TreeMilestone[] = [
  {
    id: 'origin',
    year: '2022',
    when: 2022.0,
    title: 'One desk, two obsessions',
    blurb:
      'Before there was a company there was a shared studio desk, late at night — one of them mid-render, the other watching over his shoulder.',
    fact: 'The desk is buried in drawings and drink cups; the render is still going.',
    impact: 'Everything on this tree grows out of that table.',
    tier: 'landmark',
    side: 'left',
    image: {
      src: `${T}/studio-desks.webp`,
      ratio: 1.5009,
      alt: 'The two cofounders at a shared architecture-studio desk late at night, one at the monitor mid-render, the other standing behind it, the desk buried in drawings and drink cups',
    },
  },
  {
    id: 'flowerfield',
    year: '2022',
    when: 2022.3,
    title: 'Flowerfield',
    blurb:
      'Austin’s first ecodistrict: a high-density, low-rise housing community grown like nature — net-zero energy and carbon, all of its water filtered on site.',
    fact: 'It lifts the block from 155 to 630 homes, with room for 2,000 more.',
    impact: 'A building can carry the full complexity of a living system and house more people rather than fewer. The closest ancestor to Eden.',
    tier: 'major',
    side: 'right',
    image: {
      src: `${A}/07-flowerfield/flowerfield-biophilic-ecodistrict-hero-render.webp`,
      ratio: 1.9093,
      alt: 'Aerial-level render of the flowerfield ecodistrict, organic white buildings above a field of flowers and filtration ponds with the Austin skyline behind',
    },
  },
  {
    id: 'origami',
    year: '2022',
    when: 2022.6,
    title: 'Origami wound-care device',
    blurb:
      'A $0.25 origami-inspired device to prevent pressure wounds, prototyped for Moi Teaching Hospital in Kenya with AMPATH.',
    fact: 'Daniel directed a fourteen-student team; the device has to cost cents and fold flat.',
    impact: 'A constraint that hard is a design tool: it forces the idea down to the one move that matters. The design was transferred for clinical deployment.',
    tier: 'grove',
    side: 'left',
    image: {
      src: `${A}/11-wound-care-kenya/wound-care-kenya-brochure-cover.png`,
      ratio: 1.2936,
      fit: 'contain',
      alt: 'The brochure cover: the finished wedge, the materials needed, the two-hour turning interval, and the device in use under a patient',
    },
  },
  {
    id: 'plentify',
    year: '2023',
    when: 2023.4,
    title: 'Plentify',
    blurb:
      'A building that grows its own structure — walls farmed on site as bamboo and hemp, then cast into a composite.',
    fact: 'The composite was prototyped and tested 30% stronger than hempcrete.',
    impact: 'Architecture can be grown in place and paced to the people who build it, not only trucked in and assembled.',
    tier: 'major',
    side: 'right',
    image: {
      src: `${A}/01-synergy/synergy-cosmos-growth-loop-poster.webp`,
      ratio: 1.7778,
      alt: 'The Plentify building growing from bare structure to fully planted',
    },
  },
  {
    id: 'research',
    year: '2023',
    when: 2023.55,
    title: 'Synthetic Vision',
    blurb:
      'A Vision Transformer trained to read how a form was built — extrusion, revolution, subtraction — back out of eroded fragments.',
    fact: 'Published at AAG 2025 (MIT); its sibling study of 158 medieval fragments followed at ACADIA 2025.',
    impact: 'The same premise — that a form’s geometry maps to how it is fabricated — is what lets Bower’s engine price a shape before it is ever cut.',
    tier: 'leaf',
    side: 'left',
    image: {
      src: `${A}/08-synthetic-vision/synthetic-vision-patch-probe-saliency-heatmaps.webp`,
      ratio: 1.2344,
      fit: 'contain',
      alt: 'Saliency heatmaps over architectural fragments, warm colour marking each geometric primitive the model reads',
    },
  },
  {
    id: 'making',
    year: '2024',
    when: 2024.0,
    title: 'The material proof',
    blurb: 'A Plentify sample under compression on the MTS Insight testing machine.',
    fact: 'It held — 30% stronger than hempcrete.',
    impact: 'The number that moved grown architecture from a render to a lab bench.',
    tier: 'leaf',
    side: 'right',
    image: {
      src: `${A}/01-synergy/synergy-cosmos-compression-test.webp`,
      ratio: 1.001,
      fit: 'contain',
      alt: 'A Plentify sample under compression on the MTS Insight testing machine, tested +30% stronger than hempcrete',
    },
  },
  {
    id: 'robots',
    year: '2024',
    when: 2024.2,
    title: 'Robots as instruments',
    blurb:
      'An industrial robot treated as an instrument, not a laborer: on a KUKA arm, one script that sands metal, carves sand, plots ink, and draws with light.',
    fact: 'At Texas Robotics its companion device was built to actually move — and watching where it fails taught more than drawing it ever did.',
    impact: 'Given a well made tool and a thoughtful toolpath, a robot becomes an expressive partner rather than automated labor.',
    tier: 'grove',
    side: 'left',
    image: {
      src: `${A}/06-kuka-robotics/kuka-robotics-robot-loop-poster.webp`,
      ratio: 1.7778,
      alt: 'A KUKA robot arm sanding an aluminium sheet, tooling an ornamented surface',
    },
  },
  {
    id: 'hydraulic',
    year: '2024',
    when: 2024.35,
    title: 'Hydraulic Commons',
    blurb:
      'Water treatment and food production turned into public space on Austin’s Colorado River — treatment, aquaponics and vertical farming each feeding the next.',
    fact: 'Processing 500 gallons an hour, sized to real community need. Fall 2024 Design Excellence Nominee.',
    impact: 'Infrastructure people are invited into gets cared for; the same flows behind a fence never do.',
    tier: 'grove',
    side: 'right',
    image: {
      src: `${A}/17-hydraulic-commons/hydraulic-commons-landform-rendering-river-infrastructure.webp`,
      ratio: 1.7778,
      alt: 'The building rising from the Colorado River bank as landform infrastructure',
    },
  },
  {
    id: 'llo',
    year: '2024',
    when: 2024.45,
    title: 'LLO: Dream Machine',
    blurb:
      'A desk lamp built to give a language model a body — plywood, pulleys and string, left deliberately unfinished.',
    fact: 'It runs Dream Machine: you sketch, then it projects imagery back over the sketch to expand the idea.',
    impact: 'The question was whether a model feels different once it has a posture and sits on the desk with you — not whether it ships.',
    tier: 'leaf',
    side: 'left',
    image: {
      src: `${A}/14-large-language-object/large-language-object-lamp.webp`,
      ratio: 1.3389,
      alt: 'The Large Language Object, a plywood articulated desk lamp on a wooden base with pulleys and a control box',
    },
  },
  {
    id: 'resia',
    year: '2024',
    when: 2024.5,
    title: 'Resia',
    blurb:
      'An AI remodeling platform carrying a homeowner from idea to finished job in one place — Clay on stage, pitching it.',
    fact: 'Grown to ten people through two accelerators.',
    impact: 'A renovation is a chain of handoffs, and most of the pain is in the seams; putting the whole chain in one tool is where the leverage is.',
    tier: 'grove',
    side: 'right',
    image: {
      src: `${T}/resia-pitch.webp`,
      ratio: 1.9025,
      alt: 'Clay Seifert on stage with a microphone presenting Resia, a child’s crayon drawing of a house with two stick figures and green grass on the screen behind him, “FFPC” balloon letters on the stage and an audience in front',
    },
  },
  {
    id: 'dougherty',
    year: '2024',
    when: 2024.6,
    title: 'Dougherty Arts Center',
    blurb:
      'An arts center rebuilt from its own salvaged structure, with 3D-printed catenary arches turning a floodplain site into shaded public space.',
    fact: 'Defended on a studio pin-up wall of stamped DAC sheets, both cardboard models standing in the round.',
    impact: 'On a floodplain the honest move is to touch the ground lightly and give public space back.',
    tier: 'major',
    side: 'left',
    image: {
      src: `${A}/05-dougherty/dougherty-arts-center-catenary-entrance-skyline-money-shot.webp`,
      ratio: 1.7778,
      alt: 'The catenary arch entrances of the Dougherty Arts Center, the Austin skyline behind',
    },
  },
  {
    id: 'factory',
    year: '2025',
    when: 2025.3,
    title: 'Robotic Factory',
    blurb:
      'A factory drawn as architecture rather than a shed: ranks of robot arms on rails beneath planted vaults, the landscape folded over the roof.',
    fact: 'The long section is the argument — machines and planting sharing one structure.',
    impact: 'The factory stops being infrastructure to hide; it becomes a building people would want to be inside.',
    tier: 'grove',
    side: 'right',
    image: {
      src: `${A}/10-robotic-factory/robotic-factory-section-assembly-poster.webp`,
      ratio: 1.9375,
      alt: 'The robotic factory long section assembling itself, vaulted halls, chimneys and planted terraces building up in sequence',
    },
  },
  {
    id: 'newyork',
    year: '2025',
    when: 2025.6,
    title: 'New York — Rogers Partners',
    blurb:
      'Daniel at Rogers Partners in New York, June to December 2025: the timeline’s closing door before Bower.',
    fact: 'An arched double door with ironwork tracery, drawn and dimensioned by hand.',
    impact: 'The last door the practice walked through as employees. Bower opens next.',
    tier: 'landmark',
    side: 'left',
    image: {
      src: `${A}/16-rogers-partners-nyc/rogers-partners-nyc-door-elevation-drawing.webp`,
      ratio: 1.597,
      fit: 'contain',
      alt: 'A Rogers Partners door elevation drawing, an arched double door with ironwork tracery, dimensioned',
    },
  },
  {
    id: 'bower',
    year: '2026',
    when: 2026.0,
    title: 'Bower',
    blurb:
      'A studio growing one-of-a-kind garden pavilions — bowers. The company is founded; the crown of this tree is its first commission vision.',
    fact: 'Seven commission visions hang in the gallery; this crown is one of them.',
    impact: 'Every branch below grew toward this.',
    tier: 'landmark',
    side: 'center',
    image: {
      src: `${G}/02-garden-pavilion.webp`,
      ratio: 1.8338,
      alt: 'A woven timber garden pavilion standing on a lawn, climbing plants growing through its lattice crown',
    },
  },
];
