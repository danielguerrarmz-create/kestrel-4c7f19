/**
 * treeForms.ts — the botanical form vocabulary of the Tree of Life page.
 *
 * REVISION OF 2026-07-26 (Clay: "get away from the kiddy-clipart style… revise the
 * procedural flowers code… make this as botanically accurate as possible"). The first
 * draft drew limbs as CONSTANT-WIDTH STROKES with round caps — which is precisely what
 * makes a drawing read as clipart, because no living limb has constant diameter. This
 * module replaces strokes with the procedural-botany vocabulary the repo already owns:
 *
 *   - Spines are NOISE-WANDERED WALKS (the accumulated-rotation walk from the vendored
 *     nonflowers port / src/engine/botanical/nonflower.ts, here extended with target
 *     steering and tropism so a limb can be asked to arrive somewhere).
 *   - Limbs are RIBBONS — closed outlines around a spine with a width profile — built
 *     on src/engine/botanical/geom.ts (ribbonPath, the same Catmull-Rom smoothing).
 *   - Widths obey the PIPE MODEL (da Vinci's rule): at every fork the parent's
 *     cross-section below equals the sum of cross-sections above, r² = Σ rᵢ²
 *     (Leonardo's notebooks; formalized as the pipe model by Shinozaki et al. 1964).
 *     A trunk is therefore not a drawn shape but an ACCOUNT of everything it carries.
 *   - Leaves are BLADES with a midrib, lateral veins and a petiole, using the named
 *     silhouette profiles in src/engine/botanical/profiles.ts (ovate, lanceolate…).
 *
 * Botanical grammar encoded here, so the next reader knows what is deliberate:
 *   TAPER      a limb narrows continuously tip-ward; nothing has parallel sides.
 *   COLLAR     a branch thickens where it meets its parent (the branch collar).
 *   TROPISM    tips curve upward (negative gravitropism); lower limbs arch down
 *              before their tips rise; roots do the inverse.
 *   BUTTRESS   the trunk flares at the ground into the root plate.
 *   PHYLLOTAXY leaves alternate along young wood only — never on thick limbs.
 *
 * Everything is seeded (engine Rng/Noise) — "organic" never means "different every
 * load". Pure geometry: no React, no colours, no milestone knowledge.
 *
 * References for the grammar (also good viewing for where this register can go):
 *   - Prusinkiewicz & Lindenmayer, *The Algorithmic Beauty of Plants* —
 *     http://algorithmicbotany.org/papers/#abop (free PDF)
 *   - Runions, Lane, Prusinkiewicz 2007, space colonization — already vendored as
 *     src/pages/about/spaceColonization.ts
 *   - Lingdong Huang, *nonflowers* — vendored under src/vendor/nonflowers/
 */
import {
  add,
  dir,
  lerpPt,
  linePath,
  perp,
  type Point,
  ribbonPath,
  scale,
  smoothPath,
  sub,
} from '../../engine/botanical/geom';
import { bladeProfile } from '../../engine/botanical/profiles';
import type { BladeProfile } from '../../engine/botanical/genes';
import { Noise } from '../../engine/botanical/noise';
import type { Rng } from '../../engine/botanical/prng';

export type { Point };

const angleOf = (v: Point): number => Math.atan2(v[0], -v[1]);

/** Finite-difference unit tangents along a polyline (nonflower.ts convention). */
function tangents(pts: readonly Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const t = sub(b, a);
    const l = Math.hypot(t[0], t[1]) || 1e-9;
    out.push([t[0] / l, t[1] / l]);
  }
  return out;
}

export interface Spine {
  pts: Point[];
  tan: Point[];
  /** Normalized arc position of each sample, 0 at base → 1 at tip. */
  s: number[];
  length: number;
  endAngle: number;
}

export interface SpineOpts {
  origin: Point;
  /** Initial heading, radians from straight-up (+ leans right). */
  theta0: number;
  length: number;
  /** Samples along the walk. */
  segments?: number;
  /** Steady curvature over the whole walk (radians): the limb's overall bow. */
  lean?: number;
  /** Perlin wander amplitude (radians per step at strength 1). */
  wobble?: number;
  noiseScale?: number;
  /**
   * Gravitropic pull, radians of heading decay toward straight-up per unit t at
   * the tip. Positive = the tip climbs (a branch reaching for light); negative
   * = the tip sinks (a root). Applied ∝ t² so bases keep their set angle.
   */
  tropism?: number;
  /**
   * Arrive at this point: the heading steers toward the target with gain
   * growing along t, and the final sample lands exactly on it. This is what
   * lets a grown limb still honour a composed layout.
   */
  target?: Point;
}

/** The guided noise walk every limb is built from. */
export function growSpine(rng: Rng, noise: Noise, opts: SpineOpts): Spine {
  const {
    origin,
    theta0,
    length,
    segments = Math.max(6, Math.min(26, Math.round(opts.length / 26))),
    lean = 0,
    wobble = 0.05,
    noiseScale = 1.7,
    tropism = 0,
    target,
  } = opts;
  const nOff = rng.range(0, 500);
  const wrap = (a: number): number => {
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  };
  let theta = theta0;
  let pos = origin;
  const pts: Point[] = [pos];
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const wob = noise.fbm(nOff + t * noiseScale) * wobble;
    theta += lean / segments + wob;
    // Tropism, hardest at the tip (∝ t²): a shoot's heading decays toward
    // straight-up, a root's toward straight-down.
    if (tropism > 0) {
      theta += (0 - theta) * ((tropism * t * t * 6) / segments);
    } else if (tropism < 0) {
      const down = Math.sign(theta || 1) * Math.PI;
      theta += (down - theta) * ((-tropism * t * t * 6) / segments);
    }
    if (target) {
      const want = angleOf(sub(target, pos));
      const gain = 0.12 + 0.75 * t * t;
      theta += wrap(want - theta) * ((gain * 6) / segments);
    }
    pos = add(pos, scale(dir(theta), length / segments));
    pts.push(pos);
  }
  if (target) pts[pts.length - 1] = target;
  const s = pts.map((_, i) => i / (pts.length - 1));
  return { pts, tan: tangents(pts), s, length, endAngle: theta };
}

/** Point on a spine at arc position s ∈ [0,1] (linear between samples). */
export function spineAt(spine: Spine, sPos: number): { p: Point; tan: Point } {
  const x = Math.min(1, Math.max(0, sPos)) * (spine.pts.length - 1);
  const i = Math.min(spine.pts.length - 2, Math.floor(x));
  const f = x - i;
  return {
    p: lerpPt(spine.pts[i], spine.pts[i + 1], f),
    tan: lerpPt(spine.tan[i], spine.tan[i + 1], f),
  };
}

/** The sample of a spine nearest a given y (trunks run monotonically in y). */
export function spineAtY(spine: Spine, y: number): { p: Point; tan: Point; s: number } {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < spine.pts.length; i++) {
    const d = Math.abs(spine.pts[i][1] - y);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return { p: spine.pts[best], tan: spine.tan[best], s: spine.s[best] };
}

/* ------------------------------- pipe-model widths ------------------------------- */

/** A load the limb carries: a child of basal half-width `w` attached at arc `s`. */
export interface WidthTap {
  s: number;
  w: number;
}

/**
 * The half-width profile of a limb under the pipe model: walking DOWN from the
 * tip, cross-section grows by each child's cross-section as its attachment
 * passes — w(s)² = wTip² + Σ {taps above s} wᵢ² — plus a gentle within-segment
 * taper so even an unbranched run narrows tip-ward, a collar swell at the base
 * where the limb meets its parent, and an optional ground flare (buttress).
 */
export function pipeWidthAt(
  taps: readonly WidthTap[],
  tipW: number,
  opts: { collar?: number; flare?: number; taperExp?: number } = {},
): (s: number) => number {
  const { collar = 0, flare = 0, taperExp = 0.4 } = opts;
  const sorted = [...taps].sort((a, b) => a.s - b.s);
  return (s: number): number => {
    let area = tipW * tipW;
    for (const tap of sorted) if (tap.s >= s) area += tap.w * tap.w;
    let w = Math.sqrt(area);
    // Within-segment taper: narrows toward the tip even between forks.
    w *= 1 + taperExp * (1 - s) * 0.25;
    // Branch collar: a swell over the first ~7% of the limb.
    if (collar > 0 && s < 0.07) w *= 1 + collar * Math.pow(1 - s / 0.07, 1.6);
    // Buttress: the trunk widening into its root plate — a gradual swell over the
    // bottom ~9%, not a bell (the first grown capture flared like a skirt).
    if (flare > 0 && s < 0.09) w *= 1 + flare * Math.pow(1 - s / 0.09, 1.6);
    return w;
  };
}

/* ---------------------------------- limb ribbons --------------------------------- */

export interface Limb {
  /** Closed variable-width outline — the wood itself, to be filled. */
  ribbonD: string;
  /** The centerline — the growth mask's stroke and the gold sheen's path. */
  spineD: string;
  spine: Spine;
  /** Half-width at each spine sample — the growth mask segments read these. */
  widths: number[];
  /** Max full width along the limb: sizes a single-stroke growth mask. */
  maskW: number;
  baseW: number;
  tipW: number;
}

/** Build the filled ribbon + centerline for a spine and a half-width profile. */
export function limbFor(spine: Spine, widthAt: (s: number) => number): Limb {
  const left: Point[] = [];
  const right: Point[] = [];
  const widths: number[] = [];
  let maxW = 0;
  for (let i = 0; i < spine.pts.length; i++) {
    const w = widthAt(spine.s[i]);
    widths.push(w);
    maxW = Math.max(maxW, w);
    const nrm = perp(spine.tan[i]);
    left.push(add(spine.pts[i], scale(nrm, w)));
    right.push(add(spine.pts[i], scale(nrm, -w)));
  }
  return {
    ribbonD: ribbonPath(left, right),
    spineD: smoothPath(spine.pts),
    spine,
    widths,
    maskW: maxW * 2 + 10,
    baseW: widthAt(0),
    tipW: widthAt(1),
  };
}

/** One stroked centerline segment of a growth mask. */
export interface MaskStroke {
  d: string;
  w: number;
  window: [number, number];
}

/**
 * The growth mask for a limb, in `splits` chained segments, each stroked at its
 * OWN LOCAL width. One stroke at the limb's max width reveals a strongly tapered
 * limb (the trunk) behind a blunt front as wide as its base — measured on the
 * first grown capture as a chopped slab at the growing tip. Segmenting keeps the
 * reveal front near the limb's local diameter.
 */
export function maskStrokesFor(limb: Limb, window: [number, number], splits = 1): MaskStroke[] {
  const pts = limb.spine.pts;
  if (splits <= 1 || pts.length < splits + 2) {
    return [{ d: limb.spineD, w: limb.maskW, window }];
  }
  const [w0, w1] = window;
  const out: MaskStroke[] = [];
  const n = pts.length - 1;
  for (let k = 0; k < splits; k++) {
    const i0 = Math.round((k / splits) * n);
    const i1 = Math.round(((k + 1) / splits) * n);
    const run = pts.slice(i0, i1 + 1);
    const localMax = Math.max(...limb.widths.slice(i0, i1 + 1));
    out.push({
      d: smoothPath(run),
      w: localMax * 2 + 10,
      // Segments overlap slightly in time so the front never stalls at a seam.
      window: [w0 + ((w1 - w0) * i0) / n, Math.min(w1, w0 + ((w1 - w0) * i1) / n + (w1 - w0) * 0.02)],
    });
  }
  return out;
}

/* ------------------------------------- blades ------------------------------------ */

export interface BladeForm {
  outlineD: string;
  midribD: string;
  veinDs: string[];
  /** Petiole — the short stalk joining blade to twig. */
  petioleD: string;
  /** Attachment point on the twig (sway pivots here). */
  base: Point;
}

/**
 * A leaf: petiole, then a curled blade with midrib and forward-swept vein pairs
 * (the blade construction from engine/botanical/nonflower.ts, positioned in
 * absolute canvas space so the caller just paints it).
 */
export function blade(
  rng: Rng,
  noise: Noise,
  attach: Point,
  theta: number,
  length: number,
  halfWidth: number,
  profile: BladeProfile,
  veinPairs: number,
): BladeForm {
  const petioleLen = Math.max(2.5, length * 0.16);
  const base = add(attach, scale(dir(theta), petioleLen));
  const curl = rng.gauss() * 0.5;
  const spine = growSpine(rng, noise, {
    origin: base,
    theta0: theta,
    length,
    segments: 8,
    lean: curl,
    wobble: 0.035,
  });
  const prof = bladeProfile(profile);
  const left: Point[] = [];
  const right: Point[] = [];
  for (let i = 0; i < spine.pts.length; i++) {
    const w = halfWidth * prof(spine.s[i]);
    const nrm = perp(spine.tan[i]);
    left.push(add(spine.pts[i], scale(nrm, w)));
    right.push(add(spine.pts[i], scale(nrm, -w)));
  }
  const veinDs: string[] = [];
  const n = spine.pts.length - 1;
  for (let k = 1; k <= veinPairs; k++) {
    const t = (k / (veinPairs + 1)) * 0.85 + 0.06;
    const idx = Math.max(1, Math.min(n - 1, Math.round(t * n)));
    const fwd = Math.min(n, idx + 1);
    veinDs.push(linePath(spine.pts[idx], lerpPt(left[fwd], spine.pts[fwd], 0.3)));
    veinDs.push(linePath(spine.pts[idx], lerpPt(right[fwd], spine.pts[fwd], 0.3)));
  }
  return {
    outlineD: ribbonPath(left, right),
    midribD: smoothPath(spine.pts),
    veinDs,
    petioleD: linePath(attach, base),
    base: attach,
  };
}

/* ------------------------------------ blossoms ----------------------------------- */

export interface BlossomForm {
  petalDs: string[];
  centerD: string;
  c: Point;
}

/** A small open rosette (5 obovate petals + centre) for the crown only. */
export function blossom(rng: Rng, noise: Noise, c: Point, faceTheta: number, size: number): BlossomForm {
  const petals = 5;
  const spread = Math.PI * 1.7;
  const prof = bladeProfile('obovate');
  const petalDs: string[] = [];
  for (let k = 0; k < petals; k++) {
    const ang = faceTheta - spread / 2 + ((k + 0.5) / petals) * spread + rng.range(-0.06, 0.06);
    const base = add(c, scale(dir(ang), size * 0.22));
    const spine = growSpine(rng, noise, {
      origin: base,
      theta0: ang,
      length: size,
      segments: 6,
      lean: rng.gauss() * 0.3,
      wobble: 0.03,
    });
    const left: Point[] = [];
    const right: Point[] = [];
    for (let i = 0; i < spine.pts.length; i++) {
      const w = size * 0.42 * prof(spine.s[i]);
      const nrm = perp(spine.tan[i]);
      left.push(add(spine.pts[i], scale(nrm, w)));
      right.push(add(spine.pts[i], scale(nrm, -w)));
    }
    petalDs.push(ribbonPath(left, right));
  }
  const r = Math.max(1.4, size * 0.2);
  const centerD =
    `M ${(c[0] - r).toFixed(2)},${c[1].toFixed(2)} ` +
    `a ${r.toFixed(2)},${r.toFixed(2)} 0 1,0 ${(r * 2).toFixed(2)},0 ` +
    `a ${r.toFixed(2)},${r.toFixed(2)} 0 1,0 ${(-r * 2).toFixed(2)},0 Z`;
  return { petalDs, centerD, c };
}
