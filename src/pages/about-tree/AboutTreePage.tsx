/**
 * AboutTreePage.tsx — the TREE OF LIFE About draft (/about/tree, dev-only).
 *
 * A DUPLICATE of the /about story, retold as one living drawing: the company history
 * as a tree that GROWS AS YOU SCROLL. /about itself is untouched.
 *
 * THE NARRATIVE RUNS UPWARD. The journey opens at the ROOTS (the two questions the
 * practice chases are literally the root labels), and scrolling down moves the camera
 * UP the tree while the trunk, branches, shoots and photographs draw in just ahead of
 * you — the scroll is the growing. The crown is Bower itself: "Bower is new." answers
 * the intro's "The obsession is old." (the page title of record on /about).
 *
 * HOW THE MOTION IS BUILT (performance is the constraint everything else obeys):
 *   - One scroll value drives everything. `useScroll` on the tall track → a spring →
 *     `gv` (growth, slightly AHEAD of the camera so the tip sprouts just above the
 *     fold) and `ty` (camera translate, pure transform, GPU-composited).
 *   - Every SVG element carries a growth WINDOW from treeLayout.ts and draws in via
 *     `pathLength` / opacity MotionValues — no React re-renders on scroll, framer
 *     writes straight to the DOM.
 *   - Depth is three layers moving at 0.35× (air, soil, canopy glow), 1× (the tree
 *     and its photographs), and 1.18× (drifting foreground leaves), plus viewport-
 *     fixed gold motes. All transforms, nothing layout-affecting.
 *
 * PHOTOGRAPHS sit in ORGANIC frames (seeded blob radii — never a square block), sized
 * by TIER (historical importance, see milestones.ts), each on its own branch tip.
 * Hover/focus lifts the photograph, deepens its shadow, brightens its branch's gold
 * sheen, quickens its leaves, and floats a contextual card (year · title · blurb ·
 * field note · what it grew). On coarse pointers the card is tap-toggled instead.
 *
 * REDUCED MOTION: the tree renders FULLY GROWN and still — no growth choreography, no
 * breathing, no sway, no motes; the camera remains a direct 1:1 mapping of the user's
 * own scrolling. Cards appear without transitions. Every milestone is a real <li> in
 * chronological order with its full text available to screen readers whether or not
 * the floating card is open.
 *
 * CROPPING NOTE: cover photographs are deliberately clipped by their organic frames
 * (the brief's "natural crops"); anything with baked-in text or linework is `contain`
 * on a mat and never clipped. See the header of milestones.ts.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { SplashHeader } from '../splash/SplashHeader';
import { Footer } from '../../ui/Footer';
import { OculusMark } from '../../ui/OculusMark';
import { srcSetFor } from '../../ui/responsiveImg';
import { useReducedMotion } from '../../ui/useReducedMotion';
import { useMediaQuery, LG_QUERY } from '../../ui/useMediaQuery';
import { routes } from '../../routing';
import { QUESTIONS } from '../PracticePage';
import {
  buildTreeLayout,
  type BranchLayout,
  type BlossomView,
  type LeafView,
  type LimbGroupView,
  type TreeLayout,
  type Win,
} from './treeLayout';

/* ---------------------------------- palette ---------------------------------- */
/* The brief's palette, tied where possible to tokens the site already owns:
 * dark-brown trunk, natural-wood branches, soft-green shoots, restrained gold. */
const TRUNK_DARK = '#4A3423';
const TRUNK_MID = '#6B4E31';
const TRUNK_LIGHT = '#8A6A4A'; // INK_SEPIA — the About page's own colour, as heartwood
const WOOD = '#9C8466'; // tailwind `bark`
const LEAF_GREEN = '#7A8B3C'; // tailwind `moss`
const LEAF_DEEP = '#5E6E2B'; // tailwind `mossDeep` — midribs, veins, blade edges
const LEAF_PALE = '#A9BA6E';
const GOLD = '#D4AF6A';
const GOLD_DEEP = '#B8842A'; // tailwind `amber`
const BLUSH = '#C9A2B4'; // crown blossoms only
const BARK_DARK = '#3A2A1C'; // ribbon edge line + bark grain
const SEPIA_TEXT = '#6F5439';

/* Organic frame shapes — seeded per milestone by index, so nothing is ever a square
 * block and nothing shuffles between loads. `contain` figures take the gentler pebble
 * (max radius 34%: its deepest corner cut is ~10% of the box, and the figure sits at
 * 10.5% inset on its mat, so LINEWORK IS NEVER CLIPPED — only mat). */
const BLOB_RADII = [
  '58% 42% 55% 45% / 48% 60% 40% 52%',
  '45% 55% 48% 52% / 58% 44% 56% 42%',
  '52% 48% 60% 40% / 45% 55% 47% 53%',
  '55% 45% 42% 58% / 52% 46% 58% 44%',
];
const PEBBLE_RADII = [
  '34% 30% 33% 31% / 31% 34% 30% 33%',
  '30% 34% 31% 33% / 33% 30% 34% 31%',
];

/* --------------------------------- primitives --------------------------------- */

/** A path that draws itself in across its growth window. Pure MotionValue plumbing —
 *  zero React renders on scroll. */
function GrowPath({
  d,
  gv,
  window: win,
  stroke,
  strokeWidth,
  opacity = 1,
  fill = 'none',
}: {
  d: string;
  gv: MotionValue<number>;
  window: Win;
  stroke: string;
  strokeWidth: number;
  opacity?: number;
  fill?: string;
}) {
  const [a, b] = win;
  const pathLength = useTransform(gv, [a, Math.max(b, a + 0.0001)], [0, 1]);
  /* The path is INVISIBLE until its window opens. Without this gate, a pathLength of 0
   * with a round linecap still paints a DOT at the path's start — measured: a column of
   * phantom dots up the trunk ahead of the growth tip. */
  const gatedOpacity = useTransform(gv, [Math.max(0, a - 0.001), Math.min(1, a + 0.004)], [0, opacity]);
  return (
    <motion.path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      style={{ pathLength, opacity: gatedOpacity }}
    />
  );
}

/**
 * One wood group — trunk, root plate, a milestone's lateral + twigs, or the crown
 * fan — revealed by a shared mask. Filled variable-width ribbons cannot draw in via
 * stroke dashes, so the mask strokes each limb's CENTERLINE (white, wider than the
 * wood) with the pathLength animation, and the wood appears along its own grain.
 */
function WoodGroup({
  layout,
  group,
  gv,
  fillId,
  children,
}: {
  layout: TreeLayout;
  group: LimbGroupView;
  gv: MotionValue<number>;
  fillId: string;
  children?: ReactNode;
}) {
  return (
    <>
      <mask id={`grow-${group.id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={layout.W} height={layout.H}>
        {group.masks.map((m, i) => (
          <GrowPath key={i} d={m.d} gv={gv} window={m.window} stroke="#fff" strokeWidth={m.w} />
        ))}
      </mask>
      <g mask={`url(#grow-${group.id})`}>
        {group.limbs.map((l, i) => (
          <path
            key={i}
            d={l.ribbonD}
            fill={`url(#${fillId})`}
            stroke={BARK_DARK}
            strokeOpacity={0.22}
            strokeWidth={0.8}
          />
        ))}
        {children}
      </g>
    </>
  );
}

/** One leaf: petiole, blade, midrib and veins from the botanical engine, already in
 *  canvas coordinates. The inner <g> sways around the petiole's own attachment point
 *  (transform-box: view-box puts the CSS origin in user units). */
function LeafEl({
  leaf,
  gv,
  sway,
  fast,
  index,
}: {
  leaf: LeafView;
  gv: MotionValue<number>;
  sway: boolean;
  fast: boolean;
  index: number;
}) {
  const [a, b] = leaf.window;
  const opacity = useTransform(gv, [a, Math.max(b, a + 0.0001)], [0, 1]);
  const fill = leaf.kind === 'gold' ? GOLD : leaf.kind === 'shoot' ? LEAF_PALE : LEAF_GREEN;
  const edge = leaf.kind === 'gold' ? GOLD_DEEP : LEAF_DEEP;
  return (
    <motion.g style={{ opacity }}>
      <g
        className={sway && index % 2 === 0 ? (fast ? 'tree-sway-fast' : 'tree-sway') : undefined}
        style={{
          transformBox: 'view-box',
          transformOrigin: `${leaf.base.x}px ${leaf.base.y}px`,
          animationDelay: `${(index % 9) * -0.8}s`,
        }}
      >
        <path d={leaf.petioleD} stroke={edge} strokeOpacity={0.6} strokeWidth={1} fill="none" />
        <path d={leaf.outlineD} fill={fill} fillOpacity={0.8} stroke={edge} strokeOpacity={0.45} strokeWidth={0.6} />
        <path d={leaf.midribD} stroke={edge} strokeOpacity={0.5} strokeWidth={0.65} fill="none" />
        {leaf.veinDs.map((d, i) => (
          <path key={i} d={d} stroke={edge} strokeOpacity={0.3} strokeWidth={0.45} fill="none" />
        ))}
      </g>
    </motion.g>
  );
}

/** A crown blossom: five obovate petals and a gold disc. */
function BlossomEl({ b, gv, sway }: { b: BlossomView; gv: MotionValue<number>; sway: boolean }) {
  const [a, w] = b.window;
  const opacity = useTransform(gv, [a, Math.max(w, a + 0.0001)], [0, 1]);
  return (
    <motion.g style={{ opacity }}>
      <g
        className={sway ? 'tree-sway' : undefined}
        style={{ transformBox: 'view-box', transformOrigin: `${b.c.x}px ${b.c.y}px` }}
      >
        {b.petalDs.map((d, i) => (
          <path key={i} d={d} fill={BLUSH} fillOpacity={0.5} stroke={BLUSH} strokeOpacity={0.65} strokeWidth={0.6} />
        ))}
        <path d={b.centerD} fill={GOLD} fillOpacity={0.9} />
      </g>
    </motion.g>
  );
}

/** A milestone branch's light: gold sheen + holographic whisper along the lateral's
 *  centerline, and the fork node — all answering the hover. The wood itself is drawn
 *  by its WoodGroup. */
function BranchOverlay({
  branch,
  gv,
  hovered,
}: {
  branch: BranchLayout;
  gv: MotionValue<number>;
  hovered: boolean;
}) {
  const [a, b] = branch.grow;
  const sheenGate = useTransform(gv, [b, Math.min(1, b + 0.05)], [0, 1]);
  const nodeGate = useTransform(gv, [a, Math.min(1, a + 0.02)], [0, 1]);
  const holoOpacity = useTransform(sheenGate, (v) => v * (hovered ? 0.45 : 0.18));
  return (
    <g>
      <motion.g animate={{ opacity: hovered ? 1 : 0.38 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
        <motion.path
          d={branch.sheenD}
          fill="none"
          stroke="url(#gold-sheen)"
          strokeWidth={2.2}
          strokeLinecap="round"
          style={{ opacity: sheenGate }}
        />
      </motion.g>
      <motion.path
        d={branch.sheenD}
        fill="none"
        stroke="url(#holo-sheen)"
        strokeWidth={1.1}
        strokeLinecap="round"
        style={{ opacity: holoOpacity }}
      />
      <motion.circle
        cx={branch.anchor.x}
        cy={branch.anchor.y}
        r={4}
        fill={GOLD}
        fillOpacity={0.9}
        style={{ opacity: nodeGate }}
      />
    </g>
  );
}

/* --------------------------------- the figure --------------------------------- */

/** The srcset `sizes` for a milestone photograph: its true rendered share of the
 *  viewport per variant, so a phone never pulls a desktop plate. */
function sizesFor(layout: TreeLayout, b: BranchLayout): string {
  const pct = Math.ceil((b.photoW / layout.W) * 100);
  return `${pct}vw`;
}

function MilestoneFigure({
  layout,
  branch,
  index,
  gv,
  reduced,
  coarse,
  open,
  onOpen,
  onClose,
}: {
  layout: TreeLayout;
  branch: BranchLayout;
  index: number;
  gv: MotionValue<number>;
  reduced: boolean;
  coarse: boolean;
  open: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const m = branch.milestone;
  const [a, b] = branch.reveal;
  const appear = useTransform(gv, [a, Math.max(b, a + 0.0001)], [0, 1]);
  const scale = useTransform(appear, [0, 1], [0.55, 1]);
  const rise = useTransform(appear, [0, 1], [26, 0]);
  const contain = m.image.fit === 'contain';
  const radius = contain ? PEBBLE_RADII[index % PEBBLE_RADII.length] : BLOB_RADII[index % BLOB_RADII.length];
  const srcSet = srcSetFor(m.image.src);

  const cx = (branch.tip.x / layout.W) * 100;
  const cy = (branch.tip.y / layout.H) * 100;
  const wPct = (branch.photoW / layout.W) * 100;

  return (
    <li
      className="absolute"
      style={{ left: `${cx}%`, top: `${cy}%`, width: `${wPct}%`, transform: 'translate(-50%, -50%)' }}
      data-tree-fig={m.id}
    >
      <motion.div style={reduced ? undefined : { opacity: appear, scale, y: rise }}>
        <motion.button
          type="button"
          className="group relative block w-full cursor-pointer focus-visible:outline-none"
          style={{ aspectRatio: String(m.image.ratio) }}
          whileHover={reduced ? undefined : { scale: 1.045 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onPointerEnter={coarse ? undefined : () => onOpen(m.id)}
          onPointerLeave={coarse ? undefined : onClose}
          onFocus={() => onOpen(m.id)}
          onBlur={onClose}
          onClick={coarse ? () => (open ? onClose() : onOpen(m.id)) : undefined}
          aria-expanded={open}
          aria-label={`${m.year} — ${m.title}`}
        >
          {/* The translucent leaf-halo the photograph sits on: a soft green-gold breath
              behind the frame, brighter under attention. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-[9%] blur-md transition-opacity duration-500 motion-reduce:transition-none"
            style={{
              borderRadius: radius,
              background: `radial-gradient(60% 60% at 50% 42%, ${GOLD}2e, transparent 70%), radial-gradient(80% 80% at 50% 60%, ${LEAF_PALE}3d, transparent 72%)`,
              opacity: open ? 0.95 : 0.55,
              transform: 'rotate(-4deg)',
            }}
          />
          {/* The organic frame itself. */}
          <span
            aria-hidden
            className="absolute inset-0 block overflow-hidden transition-shadow duration-500 motion-reduce:transition-none"
            style={{
              borderRadius: radius,
              /* Drawings sit on a warm vellum mat (their own paper is white, and a white
               * mat would read as a stark card against this page's gold air). */
              background: contain ? '#F5EEDF' : '#FBF9F3',
              border: `1px solid ${TRUNK_LIGHT}40`,
              boxShadow: open
                ? `0 34px 70px -24px ${TRUNK_DARK}80, 0 0 0 1px ${GOLD}66, 0 2px 18px -6px ${GOLD}59`
                : `0 18px 40px -18px ${TRUNK_DARK}59`,
            }}
          >
            <img
              src={m.image.src}
              srcSet={srcSet}
              sizes={srcSet ? sizesFor(layout, branch) : undefined}
              alt={m.image.alt}
              loading="lazy"
              decoding="async"
              className={
                contain
                  ? 'absolute inset-[10.5%] h-[79%] w-[79%] object-contain'
                  : 'absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 group-hover:brightness-[1.05] motion-reduce:transition-none'
              }
            />
          </span>
          {/* Full story for screen readers, popup or no popup. */}
          <span className="sr-only">
            {`${m.year} — ${m.title}. ${m.blurb} Field note: ${m.fact} What it grew: ${m.impact}`}
          </span>
          {/* Keyboard focus ring, drawn on the blob so it reads as part of the frame. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-1 hidden group-focus-visible:block"
            style={{ borderRadius: radius, border: `2px solid ${GOLD_DEEP}` }}
          />
        </motion.button>
      </motion.div>
    </li>
  );
}

/** The floating contextual card — an elegant leaf-tailed bubble, never a stock tooltip.
 *  One instance for the whole page, positioned in canvas pixels and clamped to the
 *  viewport, so it can never fall off an edge on any device. */
function MilestoneCard({
  layout,
  branch,
  canvasW,
  reduced,
}: {
  layout: TreeLayout;
  branch: BranchLayout;
  canvasW: number;
  reduced: boolean;
}) {
  const m = branch.milestone;
  const cardW = Math.min(330, Math.max(240, canvasW * 0.88));
  const px = (branch.tip.x / layout.W) * canvasW;
  const x = Math.min(Math.max(px, cardW / 2 + 12), canvasW - cardW / 2 - 12);
  const yPct = ((branch.tip.y + branch.photoH / 2 + 26) / layout.H) * 100;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute z-30"
      style={{ left: x, top: `${yPct}%`, width: cardW, x: '-50%' }}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
    >
      {/* The stem the bubble hangs from. */}
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45"
        style={{
          background: '#FBF9F3',
          borderLeft: `1px solid ${TRUNK_LIGHT}4d`,
          borderTop: `1px solid ${TRUNK_LIGHT}4d`,
          borderRadius: '60% 0 40% 0',
        }}
      />
      <div
        className="relative overflow-hidden px-5 py-4 backdrop-blur-sm"
        style={{
          background: '#FBF9F3F0',
          border: `1px solid ${TRUNK_LIGHT}4d`,
          borderRadius: '18px 22px 18px 26px / 22px 18px 26px 18px',
          boxShadow: `0 24px 50px -20px ${TRUNK_DARK}66`,
        }}
      >
        {/* One gold vein across the card's crown — the tree's light carried into the paper. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}b3, transparent)` }}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD_DEEP }}>
          {m.year}
        </p>
        <h3 className="mt-1 font-serifDisplay text-[19px] leading-tight text-inkBlack">{m.title}</h3>
        <p className="mt-2 font-serifDisplay text-[13.5px] leading-snug text-inkBlack/80">{m.blurb}</p>
        <p className="mt-2.5 font-serifDisplay text-[12.5px] italic leading-snug" style={{ color: SEPIA_TEXT }}>
          {m.fact}
        </p>
        <div className="mt-3 border-t pt-2.5" style={{ borderColor: `${TRUNK_LIGHT}33` }}>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: `${SEPIA_TEXT}B3` }}>
            What it grew
          </p>
          <p className="mt-1 font-serifDisplay text-[12.5px] leading-snug text-inkBlack/75">{m.impact}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------ ambient dressing ------------------------------ */

/** Viewport-fixed gold motes — the air of the place. Seeded positions, CSS-animated,
 *  absent under reduced motion. */
function Motes() {
  const motes = useMemo(() => {
    const out: { left: number; top: number; size: number; dur: number; delay: number; o: number; dx: number }[] = [];
    let a = 0x51ab5;
    const rand = () => {
      a = (a * 1664525 + 1013904223) >>> 0;
      return a / 4294967296;
    };
    for (let i = 0; i < 16; i++) {
      out.push({
        left: 4 + rand() * 92,
        top: 18 + rand() * 78,
        size: 2 + rand() * 3.4,
        dur: 13 + rand() * 12,
        delay: -rand() * 20,
        o: 0.16 + rand() * 0.2,
        dx: (rand() - 0.5) * 60,
      });
    }
    return out;
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((mo, i) => (
        <span
          key={i}
          className="tree-mote absolute rounded-full"
          style={
            {
              left: `${mo.left}%`,
              top: `${mo.top}%`,
              width: mo.size,
              height: mo.size,
              background: `radial-gradient(circle, ${GOLD}, ${GOLD}00 72%)`,
              animationDuration: `${mo.dur}s`,
              animationDelay: `${mo.delay}s`,
              '--o': mo.o,
              '--dx': `${mo.dx}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** A single blurred foreground leaf for the near parallax plane. */
function DriftLeaf({ left, top, size, rot, delay }: { left: string; top: string; size: number; rot: number; delay: number }) {
  return (
    <svg
      aria-hidden
      className="tree-drift absolute"
      style={{ left, top, width: size, height: size * 0.5, filter: 'blur(2px)', opacity: 0.4, animationDelay: `${delay}s` }}
      viewBox="0 0 100 50"
    >
      <path d={`M 0 25 Q 50 ${25 - 18}, 100 25 Q 50 ${25 + 18}, 0 25`} fill={LEAF_GREEN} transform={`rotate(${rot} 50 25)`} />
    </svg>
  );
}

/* ----------------------------------- the page ---------------------------------- */

export function AboutTreePage() {
  const reduced = useReducedMotion();
  const desktop = useMediaQuery(LG_QUERY);
  const coarse = useMediaQuery('(pointer: coarse)');
  const layout = useMemo(() => buildTreeLayout(desktop ? 'wide' : 'tall'), [desktop]);

  /* ---- the one scroll value ---- */
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const smoothed = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.4, restDelta: 0.0005 });
  const pv = reduced ? scrollYProgress : smoothed;
  /* Growth leads the camera slightly, so there is already a sapling at the roots and
   * the crown finishes blooming as you arrive. Reduced motion: fully grown, always. */
  const gv = useTransform(pv, (v) => (reduced ? 1 : Math.min(1, 0.07 + v * 1.02)));

  /* ---- measured sizes: canvas height in px is width * H/W ---- */
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth));
  const [vh, setVh] = useState(() => (typeof window === 'undefined' ? 800 : window.innerHeight));
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0) setStageW(r.width);
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  const canvasH = (stageW * layout.H) / layout.W;
  const travel = Math.max(0, canvasH - vh);

  /* ---- the three depth planes, all pure transforms of the same progress ---- */
  const ty = useTransform(pv, (v) => -travel * (1 - v));
  const tyBack = useTransform(pv, (v) => -travel * 0.35 * (1 - v));
  const tyFront = useTransform(pv, (v) => -travel * 1.18 * (1 - v));

  /* The ambient glow that rides the growth tip up the trunk. */
  const glowTop = useTransform(gv, (v) => `${(((layout.baseY - v * (layout.baseY - layout.topY)) / layout.H) * 100).toFixed(2)}%`);
  /* The crown block blooms in over the last tenth of the journey. */
  const crownOpacity = useTransform(gv, [0.9, 0.99], [0, 1]);

  /* ---- attention state: hover (fine pointers), focus, or tap-pin (coarse) ---- */
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const openBranch = openId ? layout.branches.find((b) => b.id === openId) ?? null : null;

  const trackVh = desktop ? 540 : 470;
  const sway = !reduced;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SplashHeader transparent logoPill />

      <main>
        {/* ============================= THE GROWING ============================= */}
        <div ref={trackRef} data-tree-track className="relative" style={{ height: `${trackVh}vh` }}>
          <div
            ref={stageRef}
            className="sticky top-0 h-screen overflow-hidden"
            onClick={coarse ? () => setOpenId(null) : undefined}
          >
            {/* --------- far plane: air, soil and canopy light at 0.35× --------- */}
            <motion.div
              aria-hidden
              className="absolute inset-x-0 top-0 will-change-transform"
              style={{ y: tyBack, height: vh + travel * 0.35 }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, #F9F3E4 0%, #F7F4EC 42%, #F1EADA 74%, #E9DCC4 92%, #E2D2B4 100%)',
                }}
              />
              {/* Canopy light, top; the earth the roots hold, bottom. Never grey. */}
              <div
                className="absolute inset-x-0 top-0 h-[46%]"
                style={{ background: `radial-gradient(58% 70% at 50% 12%, ${GOLD}30, transparent 74%)` }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[30%]"
                style={{ background: `radial-gradient(72% 100% at 50% 100%, ${TRUNK_DARK}2b, transparent 70%)` }}
              />
            </motion.div>

            {/* ------------------- mid plane: the tree itself ------------------- */}
            <motion.div className="absolute inset-x-0 top-0 will-change-transform" style={{ y: ty }}>
              <div className={sway ? 'tree-breathe' : undefined} style={{ transformOrigin: '50% 92%' }}>
                <div className="relative w-full" style={{ aspectRatio: `${layout.W} / ${layout.H}` }} data-tree-canvas>
                  {/* The glow riding the growing tip. */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      top: glowTop,
                      width: '52%',
                      aspectRatio: '1',
                      background: `radial-gradient(circle, ${GOLD}24, transparent 62%)`,
                    }}
                  />

                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox={`0 0 ${layout.W} ${layout.H}`}
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden
                  >
                    <defs>
                      {/* Wood: heartwood dark at each fork, weathering lighter to the tip. */}
                      {layout.branches.map((b) => (
                        <linearGradient
                          key={b.id}
                          id={`wood-${b.id}`}
                          gradientUnits="userSpaceOnUse"
                          x1={b.group.gradFrom.x}
                          y1={b.group.gradFrom.y}
                          x2={b.group.gradTo.x}
                          y2={b.group.gradTo.y}
                        >
                          <stop offset="0" stopColor={TRUNK_MID} />
                          <stop offset="1" stopColor={WOOD} />
                        </linearGradient>
                      ))}
                      <linearGradient id="gold-sheen" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor={GOLD} stopOpacity="0.1" />
                        <stop offset="0.5" stopColor={GOLD} stopOpacity="0.85" />
                        <stop offset="1" stopColor={GOLD_DEEP} stopOpacity="0.25" />
                      </linearGradient>
                      {/* The restrained holography: leaf-green into gold into a dusk rose. */}
                      <linearGradient id="holo-sheen" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0.6">
                        <stop offset="0" stopColor={LEAF_PALE} />
                        <stop offset="0.5" stopColor={GOLD} />
                        <stop offset="1" stopColor={BLUSH} />
                      </linearGradient>
                      <linearGradient id="trunk-grad" gradientUnits="userSpaceOnUse" x1="0" y1={layout.baseY} x2="0" y2={layout.topY}>
                        <stop offset="0" stopColor={TRUNK_DARK} />
                        <stop offset="0.55" stopColor={TRUNK_MID} />
                        <stop offset="1" stopColor={TRUNK_LIGHT} />
                      </linearGradient>
                      <linearGradient
                        id="root-grad"
                        gradientUnits="userSpaceOnUse"
                        x1="0"
                        y1={layout.roots.gradFrom.y}
                        x2="0"
                        y2={layout.roots.gradTo.y}
                      >
                        <stop offset="0" stopColor={TRUNK_DARK} />
                        <stop offset="1" stopColor="#2E2115" />
                      </linearGradient>
                      <linearGradient
                        id="crown-grad"
                        gradientUnits="userSpaceOnUse"
                        x1="0"
                        y1={layout.crown.gradFrom.y}
                        x2="0"
                        y2={layout.crown.gradTo.y}
                      >
                        <stop offset="0" stopColor={TRUNK_LIGHT} />
                        <stop offset="1" stopColor={WOOD} />
                      </linearGradient>
                    </defs>

                    {/* The root plate first — the story opens underground. */}
                    <WoodGroup layout={layout} group={layout.roots} gv={gv} fillId="root-grad" />

                    {/* The trunk (with its epicormic sprigs), one continuous account of
                        everything it carries, plus the bark grain inside the same mask. */}
                    <WoodGroup layout={layout} group={layout.trunk} gv={gv} fillId="trunk-grad">
                      {layout.bark.map((t, i) => (
                        <GrowPath
                          key={`bark-${i}`}
                          d={t.d}
                          gv={gv}
                          window={t.window}
                          stroke={TRUNK_LIGHT}
                          strokeWidth={1.1}
                          opacity={0.3}
                        />
                      ))}
                    </WoodGroup>

                    {/* One lateral system per milestone: masked wood, then its light. */}
                    {layout.branches.map((b) => (
                      <WoodGroup key={b.id} layout={layout} group={b.group} gv={gv} fillId={`wood-${b.id}`} />
                    ))}
                    {layout.branches.map((b) => (
                      <BranchOverlay key={`ov-${b.id}`} branch={b} gv={gv} hovered={openId === b.id} />
                    ))}

                    {/* The crown fan. */}
                    <WoodGroup layout={layout} group={layout.crown} gv={gv} fillId="crown-grad" />

                    {/* Foliage over the wood, each blade on its own clock. */}
                    {layout.leaves.map((leaf, i) => (
                      <LeafEl
                        key={`leaf-${i}`}
                        leaf={leaf}
                        gv={gv}
                        sway={sway}
                        fast={leaf.branchId !== null && openId === leaf.branchId}
                        index={i}
                      />
                    ))}

                    {/* The crown's blossoms — the page's only flowers. */}
                    {layout.blossoms.map((b, i) => (
                      <BlossomEl key={`bl-${i}`} b={b} gv={gv} sway={sway} />
                    ))}
                  </svg>

                  {/* ------------- the intro, standing among the roots ------------- */}
                  <header
                    className="absolute left-1/2 w-full max-w-[640px] -translate-x-1/2 px-6 text-center"
                    style={{ top: `${(layout.introY / layout.H) * 100}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: GOLD_DEEP }}>
                      Bower · a living history
                    </p>
                    <h1 className="mt-3 font-serifDisplay text-[clamp(1.7rem,4.6vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.01em] text-inkBlack">
                      The obsession is old.
                    </h1>
                    <p className="mt-3 font-serifDisplay text-[15px] italic leading-snug" style={{ color: SEPIA_TEXT }}>
                      It begins at the roots. Scroll, and the tree grows with you.
                    </p>
                    {!reduced && (
                      <div aria-hidden className="mx-auto mt-5 h-8 w-px" style={{ background: `${SEPIA_TEXT}55` }}>
                        <span
                          className="tree-cue block h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                          style={{ background: GOLD_DEEP, marginLeft: '0.5px' }}
                        />
                      </div>
                    )}
                  </header>

                  {/* The two questions ARE the roots. */}
                  {QUESTIONS.map((q, i) => {
                    const p = layout.questionAnchors[i];
                    return (
                      <p
                        key={q.label}
                        className="absolute w-[min(36ch,78vw)] font-serifDisplay text-[13px] italic leading-snug lg:w-[30ch]"
                        style={{
                          left: `${(p.x / layout.W) * 100}%`,
                          top: `${(p.y / layout.H) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          color: SEPIA_TEXT,
                          textAlign: 'center',
                        }}
                      >
                        <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.18em] not-italic" style={{ color: GOLD_DEEP }}>
                          {q.label}
                        </span>
                        {q.text}
                      </p>
                    );
                  })}

                  {/* ---------------- the crown: Bower answers ---------------- */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 text-center"
                    style={{ top: `${(layout.crownMarkY / layout.H) * 100}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <motion.div style={reduced ? undefined : { opacity: crownOpacity }}>
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 -z-10 h-[220%] w-[160%] -translate-x-1/2 -translate-y-1/2"
                        style={{ background: `radial-gradient(circle, ${GOLD}38, transparent 65%)` }}
                      />
                      <OculusMark size={64} className="mx-auto" />
                      <h2 className="mt-3 font-serifDisplay text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium leading-tight text-inkBlack">
                        Bower is new.
                      </h2>
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: GOLD_DEEP }}>
                        2026 · the crown
                      </p>
                    </motion.div>
                  </div>

                  {/* ------------- the milestones, chronological in the DOM ------------- */}
                  <ol aria-label="Company history, from the roots to the crown" className="absolute inset-0 list-none">
                    {layout.branches.map((b, i) => (
                      <MilestoneFigure
                        key={b.id}
                        layout={layout}
                        branch={b}
                        index={i}
                        gv={gv}
                        reduced={reduced}
                        coarse={coarse}
                        open={openId === b.id}
                        onOpen={setOpenId}
                        onClose={() => setOpenId(null)}
                      />
                    ))}
                  </ol>

                  {/* Year marks on the trunk, one per fork. */}
                  {layout.branches.map((b) => (
                    <YearMark key={`year-${b.id}`} layout={layout} branch={b} gv={gv} stageW={stageW} />
                  ))}

                  {/* The one floating card. */}
                  <AnimatePresence>
                    {openBranch && (
                      <MilestoneCard key={openBranch.id} layout={layout} branch={openBranch} canvasW={stageW} reduced={reduced} />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* ---------- near plane: drifting foreground leaves at 1.18× ---------- */}
            {!reduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 will-change-transform"
                style={{ y: tyFront, height: vh + travel * 1.18 }}
              >
                <DriftLeaf left="6%" top="18%" size={74} rot={-24} delay={0} />
                <DriftLeaf left="88%" top="34%" size={58} rot={40} delay={-6} />
                <DriftLeaf left="12%" top="62%" size={64} rot={12} delay={-11} />
                <DriftLeaf left="82%" top="81%" size={80} rot={-38} delay={-3} />
              </motion.div>
            )}

            {/* Gold motes in the air, fixed to the viewport. */}
            {!reduced && <Motes />}
          </div>
        </div>

        {/* ============================= THE CODA ============================= */}
        <section className="relative bg-paper px-gutter py-24 text-center">
          <p className="font-serifDisplay text-[clamp(1.2rem,2.4vw,1.7rem)] italic leading-snug text-inkBlack/80">
            The tree keeps growing.
          </p>
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            <a
              href={routes.about}
              className="font-mono text-[11px] uppercase tracking-[0.18em] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inkBlack"
              style={{ color: SEPIA_TEXT }}
            >
              The full record
            </a>
            <a
              href={routes.gallery}
              className="font-mono text-[11px] uppercase tracking-[0.18em] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inkBlack"
              style={{ color: SEPIA_TEXT }}
            >
              The commission visions
            </a>
          </nav>
        </section>
      </main>

      <Footer />

      {/* The page's microanimation vocabulary. Everything here is decorative and
          therefore gated: reduced motion never mounts the classes that use it. */}
      <style>{`
        @keyframes tree-sway-kf { 0%, 100% { transform: rotate(-2.2deg); } 50% { transform: rotate(2.6deg); } }
        .tree-sway { animation: tree-sway-kf 6.5s ease-in-out infinite; transform-box: fill-box; transform-origin: 0% 50%; }
        .tree-sway-fast { animation: tree-sway-kf 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: 0% 50%; }
        @keyframes tree-breathe-kf { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.0038); } }
        .tree-breathe { animation: tree-breathe-kf 11s ease-in-out infinite; will-change: transform; }
        @keyframes tree-mote-kf {
          0% { transform: translate3d(0, 14px, 0); opacity: 0; }
          14% { opacity: var(--o, 0.2); }
          86% { opacity: var(--o, 0.2); }
          100% { transform: translate3d(var(--dx, 20px), -44vh, 0); opacity: 0; }
        }
        .tree-mote { animation: tree-mote-kf linear infinite; will-change: transform, opacity; }
        @keyframes tree-drift-kf {
          0%, 100% { translate: 0 0; rotate: 0deg; }
          33% { translate: 14px 20px; rotate: 7deg; }
          66% { translate: -10px 38px; rotate: -6deg; }
        }
        .tree-drift { animation: tree-drift-kf 17s ease-in-out infinite; will-change: translate, rotate; }
        @keyframes tree-cue-kf { 0% { transform: translateY(0); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateY(26px); opacity: 0; } }
        .tree-cue { animation: tree-cue-kf 2.1s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tree-sway, .tree-sway-fast, .tree-breathe, .tree-mote, .tree-drift, .tree-cue { animation: none; }
        }
      `}</style>
    </div>
  );
}

/** A small mono year at each trunk fork, appearing with its branch. Decorative — the
 *  year is already in every milestone's accessible text. The offset clears the
 *  trunk's real half-width at this fork (the pipe-model trunk is wide low down). */
function YearMark({
  layout,
  branch,
  gv,
  stageW,
}: {
  layout: TreeLayout;
  branch: BranchLayout;
  gv: MotionValue<number>;
  stageW: number;
}) {
  const [a, b] = branch.grow;
  const opacity = useTransform(gv, [a, Math.max(b, a + 0.0001)], [0, 1]);
  const right = branch.side === 'left'; // label opposite the branch, so they never collide
  const clear = Math.round((branch.trunkW / layout.W) * stageW) + 14;
  return (
    <motion.span
      aria-hidden
      className="absolute font-mono text-[10px] uppercase tracking-[0.2em]"
      style={{
        left: `${(branch.anchor.x / layout.W) * 100}%`,
        top: `${(branch.anchor.y / layout.H) * 100}%`,
        transform: right ? `translate(${clear}px, -50%)` : `translate(calc(-100% - ${clear}px), -50%)`,
        color: SEPIA_TEXT,
        opacity,
      }}
    >
      {branch.milestone.year}
    </motion.span>
  );
}
