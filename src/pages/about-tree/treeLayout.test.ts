import { describe, it, expect } from 'vitest';
import { buildTreeLayout, type TreeLayout, type TreeVariant, type Win } from './treeLayout';
import { TREE_MILESTONES } from './milestones';

/**
 * The Tree of Life's structural contract — layout AND botany. The photograph
 * positions are authored by hand and the wood is grown procedurally, so both
 * halves can quietly break: a milestone with no position throws at render, a
 * frame off the canvas clips, two same-side neighbours overlap, a growth window
 * outside [0,1] never draws — and on the grown side, a limb that fails to taper
 * or a trunk thinner than its branches reads as clipart again, which is the
 * regression the 2026-07-26 rework exists to prevent.
 */
describe('the tree layout holds its own contract', () => {
  const variants: TreeVariant[] = ['wide', 'tall'];

  const allWindows = (layout: TreeLayout): Win[] => [
    ...layout.trunk.limbs.map((l) => l.window),
    ...layout.roots.limbs.map((l) => l.window),
    ...layout.crown.limbs.map((l) => l.window),
    ...layout.branches.flatMap((b) => [b.grow, b.reveal, ...b.group.limbs.map((l) => l.window)]),
    ...layout.leaves.map((l) => l.window),
    ...layout.blossoms.map((b) => b.window),
    ...layout.bark.map((t) => t.window),
  ];

  it('every milestone has a position in both variants (buildTreeLayout would throw)', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      expect(layout.branches.map((b) => b.id).sort()).toEqual(TREE_MILESTONES.map((m) => m.id).sort());
    }
  });

  it('hydraulic commons and flowerfield are on the timeline (2026-07-26, Clay)', () => {
    const ids = TREE_MILESTONES.map((m) => m.id);
    expect(ids).toContain('hydraulic');
    expect(ids).toContain('flowerfield');
  });

  it('branches are chronological bottom-to-top: earlier events sit lower on the trunk', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      for (let i = 1; i < layout.branches.length; i++) {
        const prev = layout.branches[i - 1];
        const cur = layout.branches[i];
        expect(cur.milestone.when).toBeGreaterThanOrEqual(prev.milestone.when);
        expect(cur.anchor.y).toBeLessThan(prev.anchor.y);
      }
    }
  });

  it('every photograph frame fits inside the canvas', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      for (const b of layout.branches) {
        expect(b.tip.x - b.photoW / 2).toBeGreaterThanOrEqual(0);
        expect(b.tip.x + b.photoW / 2).toBeLessThanOrEqual(layout.W);
        expect(b.tip.y - b.photoH / 2).toBeGreaterThanOrEqual(0);
        expect(b.tip.y + b.photoH / 2).toBeLessThanOrEqual(layout.H);
      }
    }
  });

  it('no two photograph frames overlap (the composed-not-cluttered rule, measured)', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      const boxes = layout.branches.map((b) => ({
        id: b.id,
        l: b.tip.x - b.photoW / 2,
        r: b.tip.x + b.photoW / 2,
        t: b.tip.y - b.photoH / 2,
        bo: b.tip.y + b.photoH / 2,
      }));
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const overlaps = a.l < b.r && b.l < a.r && a.t < b.bo && b.t < a.bo;
          expect(overlaps, `${v}: ${a.id} overlaps ${b.id}`).toBe(false);
        }
      }
    }
  });

  it('every growth window is inside [0,1] and runs forward', () => {
    for (const v of variants) {
      for (const [a, b] of allWindows(buildTreeLayout(v))) {
        expect(a).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(1);
        expect(b).toBeGreaterThanOrEqual(a);
      }
    }
  });

  it('a branch reveals its photograph only after it has started growing', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      for (const b of layout.branches) {
        expect(b.reveal[0]).toBeGreaterThan(b.grow[0]);
      }
    }
  });

  it('every branch finishes growing and revealing strictly before g reaches 1', () => {
    // Pins the crown regression: a window clamped to [1,1] at the very top never
    // opened, and the crown photograph did not exist on mobile.
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      for (const b of layout.branches) {
        expect(b.grow[1], `${v}: ${b.id} grow`).toBeLessThan(1);
        expect(b.reveal[1], `${v}: ${b.id} reveal`).toBeLessThan(1);
        expect(b.reveal[1]).toBeGreaterThan(b.reveal[0]);
        expect(b.grow[1]).toBeGreaterThan(b.grow[0]);
      }
    }
  });

  it('the layout is deterministic — the seeded growth never shuffles between builds', () => {
    for (const v of variants) {
      expect(buildTreeLayout(v)).toEqual(buildTreeLayout(v));
    }
  });

  it('the size hierarchy is real: landmark frames are wider than grove, grove than leaf', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      const widthOf = (tier: string) => layout.branches.find((b) => b.milestone.tier === tier)?.photoW ?? 0;
      expect(widthOf('landmark')).toBeGreaterThan(widthOf('major'));
      expect(widthOf('major')).toBeGreaterThan(widthOf('grove'));
      expect(widthOf('grove')).toBeGreaterThan(widthOf('leaf'));
    }
  });

  /* ------------------------------ botanical contract ------------------------------ */

  it('every limb tapers: tip half-width strictly below basal half-width', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      const limbs = [
        ...layout.trunk.limbs,
        ...layout.roots.limbs,
        ...layout.crown.limbs,
        ...layout.branches.flatMap((b) => b.group.limbs),
      ];
      expect(limbs.length).toBeGreaterThan(20);
      for (const l of limbs) {
        expect(l.tipW, l.spineD.slice(0, 24)).toBeLessThan(l.baseW);
      }
    }
  });

  it('the pipe model holds: the trunk base outweighs the root of the sum of its branches', () => {
    // da Vinci / Shinozaki: r_trunk² ≥ Σ r_branch² at the base (≥ because the
    // trunk also carries the crown leader, its own taper term and the buttress).
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      const laterals = layout.branches.filter((b) => b.side !== 'center');
      const sumSq = laterals.reduce((s, b) => s + b.group.limbs[0].baseW ** 2, 0);
      const trunkBase = layout.trunk.limbs[0].baseW;
      expect(trunkBase).toBeGreaterThanOrEqual(Math.sqrt(sumSq));
    }
  });

  it('the trunk is thicker than every lateral, and each lateral thicker than its twigs', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      const trunkBase = layout.trunk.limbs[0].baseW;
      for (const b of layout.branches) {
        const lateral = b.group.limbs[0];
        expect(lateral.baseW, `${v}: ${b.id} vs trunk`).toBeLessThan(trunkBase);
        for (const twig of b.group.limbs.slice(1)) {
          expect(twig.baseW, `${v}: ${b.id} twig`).toBeLessThan(lateral.baseW);
        }
      }
    }
  });

  it('foliage sits on young wood: every leaf belongs to a twig-bearing group or the crown', () => {
    for (const v of variants) {
      const layout = buildTreeLayout(v);
      expect(layout.leaves.length).toBeGreaterThan(60);
      const branchIds = new Set(layout.branches.map((b) => b.id));
      for (const leaf of layout.leaves) {
        if (leaf.branchId !== null) expect(branchIds.has(leaf.branchId)).toBe(true);
      }
    }
  });
});
