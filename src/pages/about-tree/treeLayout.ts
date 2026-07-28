/**
 * treeLayout.ts — the GROWN GEOMETRY of the Tree of Life About, pure and testable.
 *
 * REWRITTEN 2026-07-26 (second pass, Clay: away from clipart, toward botanical
 * accuracy). The first draft AUTHORED every curve by hand and stroked it at constant
 * width; this version GROWS the tree with the form vocabulary in treeForms.ts (the
 * repo's procedural-botany code) and only authors the things that are content
 * decisions: where each photograph sits, and how important it is.
 *
 * What is grown rather than drawn:
 *   - The TRUNK is a guided noise walk from the root plate to the crown; every fork
 *     ANCHOR is read off the trunk wherever it actually wandered, not off x = W/2.
 *   - TRUNK WIDTH is the pipe model (da Vinci): its half-width profile is computed
 *     from the basal widths of every branch it carries — the trunk is an account of
 *     its branches, plus a buttress flare into the root plate.
 *   - Each milestone's LATERAL is a steered walk (tropism up, sag by height, target
 *     = the photograph), carrying second-order twigs, which carry the leaves.
 *   - LEAVES are blades with petiole/midrib/veins on young wood only. The crown adds
 *     the page's only blossoms.
 *
 * The scroll contract is unchanged: every form carries a growth WINDOW on g ∈ [0,1],
 * and the page maps scroll → g. Filled ribbons cannot draw in via stroke dashes, so
 * every LimbGroup also carries its MASK data — the page strokes the limb centerlines
 * inside an SVG <mask> and animates those; wood is revealed along its own grain.
 */
import { TREE_MILESTONES, type TreeMilestone, type TreeSide, type TreeTier } from './milestones';
import { Rng } from '../../engine/botanical/prng';
import { Noise } from '../../engine/botanical/noise';
import {
  blade,
  blossom,
  growSpine,
  limbFor,
  maskStrokesFor,
  pipeWidthAt,
  spineAt,
  spineAtY,
  type BladeForm,
  type Limb,
  type MaskStroke,
  type Point,
  type WidthTap,
} from './treeForms';

export type { MaskStroke };

export type TreeVariant = 'wide' | 'tall';

export interface Pt {
  x: number;
  y: number;
}

/** A growth window on g ∈ [0,1]: the element draws in across [start, end]. */
export type Win = [number, number];

/** One wood piece as the page renders it: filled ribbon + its mask stroke.
 *  baseW/tipW are the half-widths at the ends — kept on the view so the taper
 *  contract (every limb narrows tip-ward) is testable, not just believable. */
export interface LimbView {
  ribbonD: string;
  spineD: string;
  maskW: number;
  baseW: number;
  tipW: number;
  window: Win;
}

/** A set of limbs revealed by one shared mask (trunk / roots / one branch / crown).
 *  `masks` carries the mask's stroked centerline segments — usually one per limb,
 *  but strongly tapered limbs (the trunk) split into several so the reveal front
 *  stays near the local diameter (see maskStrokesFor). */
export interface LimbGroupView {
  id: string;
  limbs: LimbView[];
  masks: MaskStroke[];
  gradFrom: Pt;
  gradTo: Pt;
}

export interface LeafView {
  outlineD: string;
  midribD: string;
  veinDs: string[];
  petioleD: string;
  base: Pt;
  window: Win;
  kind: 'leaf' | 'shoot' | 'gold';
  /** The milestone whose hover quickens this leaf; null = trunk/crown foliage. */
  branchId: string | null;
}

export interface BlossomView {
  petalDs: string[];
  centerD: string;
  c: Pt;
  window: Win;
}

export interface BranchLayout {
  id: string;
  milestone: TreeMilestone;
  /** Where the lateral leaves the trunk (on the grown spine, not on W/2). */
  anchor: Pt;
  /** The trunk's half-width at this fork — the year label clears it by this much. */
  trunkW: number;
  /** The photograph's centre — the lateral disappears behind it. */
  tip: Pt;
  /** The lateral + its twigs, masked together. */
  group: LimbGroupView;
  /** The lateral's centerline, for the gold sheen overlay. */
  sheenD: string;
  grow: Win;
  reveal: Win;
  side: TreeSide;
  photoW: number;
  photoH: number;
}

export interface TreeLayout {
  variant: TreeVariant;
  W: number;
  H: number;
  baseY: number;
  topY: number;
  trunk: LimbGroupView;
  roots: LimbGroupView;
  crown: LimbGroupView;
  branches: BranchLayout[];
  leaves: LeafView[];
  blossoms: BlossomView[];
  /** Bark flecks along the trunk face, each with its reveal window. */
  bark: { d: string; window: Win }[];
  introY: number;
  questionAnchors: [Pt, Pt];
  crownMarkY: number;
}

/* ------------------------------ authored decisions ------------------------------- */

/** Photograph width per tier, canvas units — the brief's size = importance. */
const TIER_W: Record<TreeVariant, Record<TreeTier, number>> = {
  wide: { landmark: 400, major: 350, grove: 270, leaf: 215 },
  tall: { landmark: 380, major: 340, grove: 290, leaf: 250 },
};

/** Basal HALF-width of a milestone's lateral, canvas units. These are the pipe
 *  model's inputs: the trunk's own profile is computed from them. (First grown
 *  capture: at 11/9.5/8/6.5 the fourteen-branch sum made the trunk a ~120-unit
 *  slab. The rule is scale-free, so the inputs are tuned to the drawing.) */
const TIER_LIMB_W: Record<TreeVariant, Record<TreeTier, number>> = {
  wide: { landmark: 7, major: 6, grove: 5, leaf: 4 },
  tall: { landmark: 5.6, major: 4.8, grove: 4, leaf: 3.2 },
};

interface VariantSpec {
  W: number;
  H: number;
  baseY: number;
  topY: number;
  /** Photograph centres by milestone id (pinned complete by treeLayout.test.ts). */
  pos: Record<string, Pt>;
  /** Trunk y each lateral forks from. */
  anchorY: Record<string, number>;
  /** Trunk y of small epicormic leaf-shoots between forks. */
  epicormicYs: number[];
  introY: number;
  questionAnchors: [Pt, Pt];
  crownMarkY: number;
}

const SPECS: Record<TreeVariant, VariantSpec> = {
  wide: {
    W: 1600,
    H: 3560,
    baseY: 3140,
    topY: 470,
    pos: {
      origin: { x: 470, y: 2980 },
      flowerfield: { x: 1180, y: 2790 },
      origami: { x: 430, y: 2620 },
      plentify: { x: 1210, y: 2430 },
      research: { x: 420, y: 2270 },
      making: { x: 1250, y: 2110 },
      robots: { x: 430, y: 1930 },
      hydraulic: { x: 1220, y: 1760 },
      llo: { x: 440, y: 1590 },
      resia: { x: 1230, y: 1440 },
      dougherty: { x: 420, y: 1240 },
      factory: { x: 1210, y: 1050 },
      newyork: { x: 450, y: 820 },
      bower: { x: 800, y: 430 },
    },
    anchorY: {
      origin: 3060,
      flowerfield: 2880,
      origami: 2700,
      plentify: 2520,
      research: 2350,
      making: 2190,
      robots: 2020,
      hydraulic: 1850,
      llo: 1690,
      resia: 1530,
      dougherty: 1360,
      factory: 1160,
      newyork: 950,
      bower: 640,
    },
    epicormicYs: [2960, 2600, 2260, 1920, 1460, 1100],
    introY: 3430,
    questionAnchors: [
      { x: 300, y: 3380 },
      { x: 1300, y: 3380 },
    ],
    crownMarkY: 205,
  },
  tall: {
    W: 800,
    H: 4400,
    baseY: 3520,
    topY: 610,
    pos: {
      origin: { x: 250, y: 3360 },
      flowerfield: { x: 560, y: 3135 },
      origami: { x: 240, y: 2960 },
      plentify: { x: 565, y: 2760 },
      research: { x: 240, y: 2570 },
      making: { x: 560, y: 2380 },
      robots: { x: 240, y: 2190 },
      hydraulic: { x: 560, y: 2000 },
      llo: { x: 245, y: 1810 },
      resia: { x: 560, y: 1620 },
      dougherty: { x: 240, y: 1400 },
      factory: { x: 560, y: 1180 },
      newyork: { x: 245, y: 930 },
      bower: { x: 400, y: 500 },
    },
    anchorY: {
      origin: 3440,
      flowerfield: 3240,
      origami: 3040,
      plentify: 2840,
      research: 2650,
      making: 2460,
      robots: 2270,
      hydraulic: 2080,
      llo: 1890,
      resia: 1700,
      dougherty: 1500,
      factory: 1290,
      newyork: 1060,
      bower: 700,
    },
    epicormicYs: [3340, 2900, 2550, 2140, 1780, 1370],
    introY: 3930,
    questionAnchors: [
      { x: 400, y: 4180 },
      { x: 400, y: 4290 },
    ],
    crownMarkY: 205,
  },
};

/* ----------------------------------- utilities ----------------------------------- */

function gOf(y: number, baseY: number, topY: number): number {
  return Math.min(1, Math.max(0, (baseY - y) / (baseY - topY)));
}

function clampWin(win: Win): Win {
  return [Math.min(1, Math.max(0, win[0])), Math.min(1, Math.max(0, win[1]))];
}

/** Shift a window DOWN so it ends by `maxEnd`, keeping its width (see the crown
 *  regression pinned in treeLayout.test.ts — a window clamped to [1,1] never opens). */
function endBy(win: Win, maxEnd: number): Win {
  const over = win[1] - maxEnd;
  return over > 0 ? clampWin([win[0] - over, win[1] - over]) : clampWin(win);
}

const toPt = (p: Point): Pt => ({ x: p[0], y: p[1] });
const angleOf = (v: Point): number => Math.atan2(v[0], -v[1]);

interface LeafSpec {
  form: BladeForm;
  window: Win;
  kind: LeafView['kind'];
  branchId: string | null;
}

function leafView(spec: LeafSpec): LeafView {
  return {
    outlineD: spec.form.outlineD,
    midribD: spec.form.midribD,
    veinDs: spec.form.veinDs,
    petioleD: spec.form.petioleD,
    base: toPt(spec.form.base),
    window: spec.window,
    kind: spec.kind,
    branchId: spec.branchId,
  };
}

const limbView = (limb: Limb, window: Win): LimbView => ({
  ribbonD: limb.ribbonD,
  spineD: limb.spineD,
  maskW: limb.maskW,
  baseW: limb.baseW,
  tipW: limb.tipW,
  window,
});

/* ------------------------------------ the build ----------------------------------- */

export function buildTreeLayout(variant: TreeVariant): TreeLayout {
  const spec = SPECS[variant];
  const { W, H, baseY, topY } = spec;
  const rng = new Rng(`tree-of-life/${variant}/3`);
  const noise = new Noise(rng);
  const su = variant === 'wide' ? 1 : 0.82; // scale unit for organs on the narrow canvas

  const ordered = [...TREE_MILESTONES].sort((a, b) => a.when - b.when);
  const leaves: LeafView[] = [];
  const blossoms: BlossomView[] = [];

  /* Leaf palette odds: mostly true green, some pale new-growth, a little gold —
   * and the gold concentrates toward the crown, where the light is. */
  const leafKind = (heightFrac: number): LeafView['kind'] => {
    const goldP = 0.08 + 0.14 * heightFrac;
    const r = rng.next();
    if (r < goldP) return 'gold';
    if (r < goldP + 0.3) return 'shoot';
    return 'leaf';
  };

  /** Blades along the outer half of a young twig, alternating sides. */
  function foliate(
    twigSpine: Limb['spine'],
    window: Win,
    branchId: string | null,
    heightFrac: number,
    count: number,
  ): void {
    for (let i = 0; i < count; i++) {
      const s = 0.45 + (0.55 * (i + rng.range(0.1, 0.5))) / count;
      const { p, tan } = spineAt(twigSpine, Math.min(1, s));
      const side = i % 2 === 0 ? 1 : -1;
      const theta = angleOf(tan) + side * rng.range(0.65, 1.05);
      const len = rng.range(15, 24) * su;
      const profile = rng.chance(0.6) ? 'ovate' : 'lanceolate';
      const form = blade(rng, noise, p, theta, len, len * (profile === 'ovate' ? 0.34 : 0.26), profile, len > 20 * su ? 2 : 1);
      const w0 = window[0] + (window[1] - window[0]) * Math.min(1, s);
      leaves.push(
        leafView({
          form,
          window: endBy([w0, window[1] + 0.03 + i * 0.012 + rng.range(0, 0.012)], 0.998),
          kind: leafKind(heightFrac),
          branchId,
        }),
      );
    }
    // The terminal leaf on the twig's bud.
    const tipAt = spineAt(twigSpine, 1);
    const form = blade(rng, noise, tipAt.p, angleOf(tipAt.tan), rng.range(14, 19) * su, 5.2 * su, 'lanceolate', 1);
    leaves.push(
      leafView({
        form,
        window: endBy([window[1], window[1] + 0.045], 0.998),
        kind: leafKind(heightFrac),
        branchId,
      }),
    );
  }

  /* ---- 1. The trunk: a guided walk, then a pipe-model width profile. ---- */
  const trunkSpine = growSpine(rng, noise, {
    origin: [W / 2, baseY],
    theta0: rng.range(-0.02, 0.02),
    length: (baseY - topY) * 1.01,
    segments: 30,
    wobble: 0.035,
    noiseScale: 2.3,
    target: [W / 2 + rng.range(-14, 14), topY],
  });

  /* Anchors are read OFF the trunk wherever it wandered. */
  const anchorOf: Record<string, { p: Point; s: number }> = {};
  for (const m of ordered) {
    const hit = spineAtY(trunkSpine, spec.anchorY[m.id]);
    anchorOf[m.id] = { p: hit.p, s: hit.s };
  }

  /* The trunk's width profile: the sum of everything it carries (da Vinci), a crown
   * tap for the leader, and the buttress at the ground. */
  const trunkTaps: WidthTap[] = ordered
    .filter((m) => m.side !== 'center')
    .map((m) => ({ s: anchorOf[m.id].s, w: TIER_LIMB_W[variant][m.tier] }));
  trunkTaps.push({ s: 0.985, w: 3.2 * su });
  const trunkWidthAt = pipeWidthAt(trunkTaps, 2 * su, { flare: 0.7, taperExp: 0.5 });
  const trunkLimb = limbFor(trunkSpine, trunkWidthAt);
  const trunk: LimbGroupView = {
    id: 'trunk',
    limbs: [limbView(trunkLimb, [0, 0.955])],
    // The trunk tapers ~6:1 base to tip: five mask segments keep the growing tip's
    // reveal front near the local diameter instead of the basal one.
    masks: maskStrokesFor(trunkLimb, [0, 0.955], 5),
    gradFrom: { x: W / 2, y: baseY },
    gradTo: { x: W / 2, y: topY },
  };

  /* Bark flecks: short grain ticks inside the trunk mask, denser low where the wood
   * is old. Windows follow the trunk's own reveal so bark never precedes wood. */
  const bark: { d: string; window: Win }[] = [];
  for (let i = 0; i < 26; i++) {
    const s = Math.pow(rng.next(), 1.35);
    const { p, tan } = spineAt(trunkSpine, s);
    const w = trunkWidthAt(s);
    const off = rng.range(-0.55, 0.55) * w;
    const nrm: Point = [-tan[1], tan[0]];
    const a: Point = [p[0] + nrm[0] * off, p[1] + nrm[1] * off];
    const l = rng.range(6, 16) * su;
    const b: Point = [a[0] + tan[0] * l + rng.range(-1.5, 1.5), a[1] + tan[1] * l];
    bark.push({
      d: `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${((a[0] + b[0]) / 2 + rng.range(-2, 2)).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}, ${b[0].toFixed(1)} ${b[1].toFixed(1)}`,
      window: clampWin([s * 0.955, s * 0.955 + 0.03]),
    });
  }

  /* ---- 2. The root plate: major roots dive, surface roots run shallow. ---- */
  const rootBase = trunkSpine.pts[0];
  const trunkBaseW = trunkWidthAt(0.07); // pre-flare wood width the roots share
  const rootLimbs: LimbView[] = [];
  const rootMasks: MaskStroke[] = [];
  const nRoots = 5;
  for (let i = 0; i < nRoots; i++) {
    const spread = -1 + (2 * (i + 0.5)) / nRoots; // -1..1 across the fan
    /* Roots LEAVE the flare sideways (heading π/2 = horizontal) and only then sink
     * (the first grown capture aimed them near-vertical: icicles, not a plate). */
    const theta0 = Math.sign(spread || 1) * (Math.PI / 2 + 0.1 + Math.abs(spread) * 0.5) + rng.range(-0.08, 0.08);
    const spine = growSpine(rng, noise, {
      origin: rootBase,
      theta0,
      length: rng.range(185, 260) * su * (1 - 0.3 * Math.abs(spread)),
      segments: 9,
      wobble: 0.09,
      tropism: -0.22,
    });
    const baseW = trunkBaseW * rng.range(0.45, 0.6);
    const rootWidth = (s: number): number => Math.max(0.8, baseW * Math.pow(1 - s, 1.35) + 0.7);
    const win = clampWin([0.004 * i, 0.05 + 0.013 * i]);
    const rootLimb = limbFor(spine, rootWidth);
    rootLimbs.push(limbView(rootLimb, win));
    rootMasks.push(...maskStrokesFor(rootLimb, win));
  }
  const roots: LimbGroupView = {
    id: 'roots',
    limbs: rootLimbs,
    masks: rootMasks,
    gradFrom: { x: W / 2, y: baseY },
    gradTo: { x: W / 2, y: baseY + 230 * su },
  };

  /* ---- 3. One lateral per milestone: steered, sagging, twig-bearing. ---- */
  const branches: BranchLayout[] = ordered.map((m) => {
    const anchor = anchorOf[m.id];
    const tipPt: Pt = spec.pos[m.id];
    if (!tipPt) throw new Error(`treeLayout(${variant}): no position authored for milestone '${m.id}'`);
    const target: Point = [tipPt.x, tipPt.y];
    const heightFrac = gOf(spec.anchorY[m.id], baseY, topY);
    const gAnchor = heightFrac;
    const grow = endBy([gAnchor - 0.012, gAnchor + 0.055], 0.985);
    const reveal = endBy([gAnchor + 0.02, gAnchor + 0.085], 0.995);

    const sideSign = m.side === 'left' ? -1 : m.side === 'right' ? 1 : rng.chance(0.5) ? 1 : -1;
    const dist = Math.hypot(target[0] - anchor.p[0], target[1] - anchor.p[1]);
    /* Lower limbs leave flatter and sag before their tips rise; upper limbs ascend.
     * (Decurrent habit: branch angle closes toward the crown.) */
    const theta0 =
      m.side === 'center'
        ? rng.range(-0.06, 0.06)
        : sideSign * (1.28 - 0.55 * heightFrac + rng.range(-0.08, 0.08));
    const sag = m.side === 'center' ? 0 : sideSign * 0.38 * (1 - heightFrac);
    const lateralSpine = growSpine(rng, noise, {
      origin: anchor.p,
      theta0,
      length: dist * 1.1,
      segments: 15,
      lean: sag,
      wobble: 0.05,
      noiseScale: 1.9,
      tropism: 0.4,
      target,
    });

    const baseW = TIER_LIMB_W[variant][m.tier];
    /* Twigs: young wood off the lateral's INNER half — the outer half runs behind
     * the photograph, where foliage would be invisible (measured on the first
     * grown capture). The crown's lateral (side 'center') skips them. */
    const twigStations = m.side === 'center' ? [] : [0.3, 0.52];
    const twigLimbs: LimbView[] = [];
    const groupMasks: MaskStroke[] = [];
    const twigTaps: WidthTap[] = [];
    twigStations.forEach((s, ti) => {
      const at = spineAt(lateralSpine, s);
      const tanAng = angleOf(at.tan);
      const up = tanAng > 0 ? -1 : 1; // toward vertical
      const theta = tanAng + up * rng.range(0.5, 0.8) * (ti % 2 === 0 ? 1 : 0.55);
      const len = dist * rng.range(0.2, 0.3) * (1 - 0.3 * ti);
      const tSpine = growSpine(rng, noise, {
        origin: at.p,
        theta0: theta,
        length: len,
        segments: 8,
        wobble: 0.07,
        tropism: 0.75,
      });
      const tw = Math.max(1.6, baseW * 0.42 * (1 - 0.25 * ti));
      twigTaps.push({ s, w: tw });
      const twWidth = pipeWidthAt([], 0.8 * su, { collar: 0.5, taperExp: 0.6 });
      const scaled = (x: number): number => (twWidth(x) / twWidth(0)) * tw;
      const twigWin = endBy(
        [grow[0] + (grow[1] - grow[0]) * s, grow[1] + 0.03 + ti * 0.014],
        0.99,
      );
      const twigLimb = limbFor(tSpine, scaled);
      twigLimbs.push(limbView(twigLimb, twigWin));
      groupMasks.push(...maskStrokesFor(twigLimb, twigWin));
      foliate(tSpine, twigWin, m.id, heightFrac, 3);

      /* One twiglet on the first twig: third-order wood, leaf-tipped. */
      if (ti === 0) {
        const at2 = spineAt(tSpine, 0.55);
        const t2 = growSpine(rng, noise, {
          origin: at2.p,
          theta0: angleOf(at2.tan) + (rng.chance(0.5) ? 1 : -1) * rng.range(0.5, 0.85),
          length: len * 0.5,
          segments: 6,
          wobble: 0.08,
          tropism: 0.85,
        });
        const t2win = endBy([twigWin[0] + (twigWin[1] - twigWin[0]) * 0.5, twigWin[1] + 0.035], 0.992);
        const t2Limb = limbFor(t2, (x) => Math.max(0.7, tw * 0.5 * (1 - 0.7 * x)));
        twigLimbs.push(limbView(t2Limb, t2win));
        groupMasks.push(...maskStrokesFor(t2Limb, t2win));
        foliate(t2, t2win, m.id, heightFrac, 2);
      }
    });

    /* The lateral's own width: pipe model over its twig taps, with a collar at
     * the trunk. Tip width stays finite — it vanishes behind the photograph. */
    const latWidth = pipeWidthAt(twigTaps, Math.max(1.4, baseW * 0.22), { collar: 0.55, taperExp: 0.55 });
    const latScale = baseW / latWidth(0);
    const lateralLimb = limbFor(lateralSpine, (s) => latWidth(s) * latScale);

    return {
      id: m.id,
      milestone: m,
      anchor: toPt(anchor.p),
      tip: tipPt,
      trunkW: trunkWidthAt(anchor.s),
      group: {
        id: `branch-${m.id}`,
        limbs: [limbView(lateralLimb, grow), ...twigLimbs],
        masks: [...maskStrokesFor(lateralLimb, grow, 2), ...groupMasks],
        gradFrom: toPt(anchor.p),
        gradTo: tipPt,
      },
      sheenD: lateralLimb.spineD,
      grow,
      reveal,
      side: m.side,
      photoW: TIER_W[variant][m.tier],
      photoH: TIER_W[variant][m.tier] / m.image.ratio,
    };
  });

  /* ---- 4. Epicormic shoots: small leaf sprigs straight off the trunk. ---- */
  spec.epicormicYs.forEach((y, i) => {
    const hit = spineAtY(trunkSpine, y);
    const g = gOf(y, baseY, topY);
    const side = i % 2 === 0 ? 1 : -1;
    const theta = side * rng.range(1.0, 1.35);
    const sprig = growSpine(rng, noise, {
      origin: hit.p,
      theta0: theta,
      length: rng.range(26, 40) * su,
      segments: 6,
      wobble: 0.08,
      tropism: 0.9,
    });
    const win = clampWin([g, g + 0.05]);
    // Rendered as part of the trunk group so one mask covers it.
    const sprigLimb = limbFor(sprig, (s) => Math.max(0.7, 2.2 * su * (1 - 0.8 * s)));
    trunk.limbs.push(limbView(sprigLimb, win));
    trunk.masks.push(...maskStrokesFor(sprigLimb, win));
    foliate(sprig, win, null, g, 1);
  });

  /* ---- 5. The crown: the leader breaks into an ascending fan; blossoms. ---- */
  const crownBase = spineAt(trunkSpine, 0.985).p;
  const crownLimbs: LimbView[] = [];
  const crownMasks: MaskStroke[] = [];
  const nFan = 6;
  for (let i = 0; i < nFan; i++) {
    const spreadT = i / (nFan - 1); // 0..1 across the fan
    const theta0 = (-1 + 2 * spreadT) * rng.range(0.55, 0.7) + rng.range(-0.06, 0.06);
    const len = (130 - 55 * Math.abs(-1 + 2 * spreadT)) * su * rng.range(0.85, 1.15);
    const spine = growSpine(rng, noise, {
      origin: crownBase,
      theta0,
      length: len,
      segments: 8,
      wobble: 0.06,
      tropism: 0.55,
    });
    const bw = Math.max(1.6, 3.6 * su * (1 - 0.4 * Math.abs(-1 + 2 * spreadT)));
    const win = endBy([0.875 + i * 0.008, 0.955 + i * 0.007], 0.99);
    const fanLimb = limbFor(spine, (s) => Math.max(0.7, bw * (1 - 0.75 * s)));
    crownLimbs.push(limbView(fanLimb, win));
    crownMasks.push(...maskStrokesFor(fanLimb, win));
    foliate(spine, win, null, 1, 2);
    /* Blossoms on the three central fan tips — the page's only flowers. */
    if (i % 2 === 1 || i === Math.floor(nFan / 2)) {
      const tip = spineAt(spine, 1);
      const b = blossom(rng, noise, tip.p, angleOf(tip.tan), rng.range(9, 12) * su);
      blossoms.push({
        petalDs: b.petalDs,
        centerD: b.centerD,
        c: toPt(b.c),
        window: endBy([win[1] + 0.01, win[1] + 0.05], 0.998),
      });
    }
  }
  const crown: LimbGroupView = {
    id: 'crown',
    limbs: crownLimbs,
    masks: crownMasks,
    gradFrom: { x: W / 2, y: topY + 260 * su },
    gradTo: { x: W / 2, y: topY - 60 },
  };

  return {
    variant,
    W,
    H,
    baseY,
    topY,
    trunk,
    roots,
    crown,
    branches,
    leaves,
    blossoms,
    bark,
    introY: spec.introY,
    questionAnchors: spec.questionAnchors,
    crownMarkY: spec.crownMarkY,
  };
}
