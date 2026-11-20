/* Trained leaders follow the crown hoops. Their spread and density are drawn
   for this elevation. The species and height curves come from drawing.js. */
function makeSeasonalCanopy(piers, horizon, ground, pixelScale) {
  const random = rng(41307);
  const planting = [
    [SP.wisteria, SP.rose],
    [SP.honeysuckle, SP.ivy],
    [SP.vine, SP.wisteria]
  ];
  const foliage = new Map([
    [SP.wisteria, ['#a1b486', '#b5bd8d', '#bfaa62', '#cfba79']],
    [SP.rose, ['#899f73', '#a7b68b', '#af9966', '#b9986a']],
    [SP.honeysuckle, ['#97a876', '#adbc8e', '#ccaa68', '#b89e67']],
    [SP.ivy, ['#748b70', '#90a285', '#748b70', '#90a285']],
    [SP.vine, ['#94a879', '#a8b785', '#ad4f39', '#c46a47']]
  ]);
  const sprites = new Map();
  const bloom = document.createElement('canvas');
  bloom.width = Math.ceil(30 * pixelScale);
  bloom.height = Math.ceil(90 * pixelScale);
  const petals = bloom.getContext('2d');
  petals.scale(pixelScale, pixelScale);
  petals.beginPath();
  petals.moveTo(15, 0);
  petals.bezierCurveTo(11, 16, 19, 48, 14, 78);
  petals.strokeStyle = '#7f8566';
  petals.lineWidth = .95;
  petals.stroke();
  const petalColors = ['#b49ebf', '#9276a2', '#b8a6cd', '#cbbada'];
  for (let i = 0; i < 28; i++) {
    const u = i / 28;
    const side = i % 2 ? 1 : -1;
    const width = 1.7 + 4.6 * (1 - u);
    const x = 15 + 1.5 * Math.sin(4.4 * u) + side * width * (.45 + .55 * Math.sin(i * 1.7) ** 2);
    const y = 7 + 71 * u;
    petals.beginPath();
    petals.ellipse(x, y, width, width * .62, side * .57, 0, Math.PI * 2);
    petals.fillStyle = petalColors[i % 4];
    petals.fill();
    petals.strokeStyle = 'rgba(78,62,83,.56)';
    petals.lineWidth = .5;
    petals.stroke();
  }
  // A spray retains the individual leaf shapes, veins and pencil outlines of
  // the original drawing. Stamp that ink once per shoot as the roof fills.
  function spray(species, paletteIndex, variant) {
    const key = species.name + paletteIndex + variant;
    if (sprites.has(key)) return sprites.get(key);
    const tile = document.createElement('canvas');
    tile.width = Math.ceil(108 * pixelScale);
    tile.height = Math.ceil(88 * pixelScale);
    const pen = tile.getContext('2d');
    pen.scale(pixelScale, pixelScale);
    pen.translate(16, 41);
    pen.lineCap = 'round';
    pen.lineJoin = 'round';
    const shape = rng(701 + species.seed + 53 * variant);
    const length = 43 + shape() * 19;
    const arch = (shape() - .6) * 18;
    LEAFC = foliage.get(species)[paletteIndex];
    pen.beginPath();
    pen.moveTo(0, 0);
    pen.quadraticCurveTo(length * .6, arch, length, 5);
    pen.strokeStyle = ink(.67);
    pen.lineWidth = 1.25;
    pen.stroke();
    for (let i = 1; i <= 7; i++) {
      const u = i / 8;
      const y = 2 * (1 - u) * u * arch + u * u * 5;
      const turn = (i % 2 ? 1 : -1) * (.65 + .55 * shape());
      leafAt(pen, length * u, y, turn, species.leaf, .48 + .42 * shape());
    }
    sprites.set(key, tile);
    return tile;
  }

  const leaders = [];
  // The far row is lighter and disappears into the garden at eye level.
  for (const depth of [.47, .74, 1]) {
    for (const [pierIndex, pier] of piers.entries()) {
      for (const side of [-1, 1]) {
        const species = planting[pierIndex][side === -1 ? 0 : 1];
        for (let level = 0; level < 6; level++) {
          const height = 288 - level * 55 + (random() - .5) * 23;
          const anchor = 19 + 142 * Math.pow((600 - height) / 300, 1.6);
          const reach = species === SP.wisteria && level === 0
            ? -(500 + 70 * random())
            : (level % 3 === 0 ? -1 : 1) * (170 + 280 * random());
          const sag = 9 + 36 * random();
          const rise = 18 + random() * 45;
          const bends = random() * 6.28;
          const points = [];
          const count = Math.ceil(Math.abs(reach) / 9);
          for (let i = 0; i <= count; i++) {
            const u = i / count;
            const x = pier + side * (anchor + reach * u);
            const y = height + sag * Math.sin(Math.PI * u) - rise * u +
              4 * Math.sin(9 * u + bends);
            const screenX = 800 + (x - 800) * depth;
            const screenY = horizon + (y - horizon) * depth;
            const flip = random() < .46 ? -1 : 1;
            points.push({
              x: screenX, y: screenY, angle: (flip < 0 ? Math.PI : 0) + (random() - .6) * 2,
              size: (.55 + random() * .64) * depth,
              variant: Math.floor(random() * 5), tone: Math.floor(random() * 2),
              autumnAt: .12 + random() * .7, dropsAt: .05 + random() * .93,
              pendant: random() < .24, flowerSize: .65 + random() * .55
            });
          }
          leaders.push({ depth, species, points, start: .27 + level * .044 + random() * .12 });
        }
      }
    }
  }
  function paint(ctx, state, front) {
    ctx.save();
    const hangingFlowers = [];
    for (const leader of leaders) {
      if ((leader.depth === 1) !== front) continue;
      const { species, depth, points } = leader;
      // A species first climbs its support, then branches into free crown space.
      const ascent = Math.min(1, GH(species, state.g) / 4.94);
      const spread = clamp((ascent - leader.start) / (1 - leader.start), 0, 1);
      const end = Math.floor(spread * (points.length - 1));
      if (!end) continue;
      ctx.globalAlpha = front ? .96 : depth * .88;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i <= end; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.lineWidth = (1.1 + state.g * 1.1) * depth;
      ctx.strokeStyle = '#867a67';
      ctx.stroke();
      for (let i = 0; i <= end; i++) {
        const p = points[i];
        const leaf = species.ever ? 1 : clamp((state.leaf - p.dropsAt) * 9 + .6, 0, 1);
        if (leaf < .03) continue;
        const size = p.size * Math.min(1, (end - i + 1) / 5) * leaf;
        const tone = p.tone + (state.autumn > p.autumnAt ? 2 : 0);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.drawImage(spray(species, tone, p.variant), -16 * size, -41 * size, 108 * size, 88 * size);
        ctx.restore();
        if (!p.pendant || !front || state.g < species.ff) continue;
        let amount = 0;
        if (species === SP.wisteria && state.spring > .1) {
          hangingFlowers.push(p);
        }
        if (species === SP.rose || species === SP.honeysuckle) amount = state.summer;
        if (amount > .1) {
          FLOWC = species.c;
          flowerAt(ctx, p.x, p.y + 2, species.flower, amount * p.flowerSize);
        }
      }
    }
    ctx.globalAlpha = .94;
    for (const p of hangingFlowers) {
      const size = state.spring * p.flowerSize * (p.y > 230 ? 1.12 : .73);
      ctx.drawImage(bloom, p.x - 15 * size, p.y + 1, 30 * size, 90 * size);
    }
    ctx.restore();
  }

  const roots = [];
  const rootRandom = rng(9904);
  for (const pier of piers) {
    for (const side of [-1, 1]) {
      for (let i = 0; i < 9; i++) {
        const points = [];
        let x = pier + side * (43 + 18 * rootRandom());
        let y = ground + 2;
        let angle = .15 + rootRandom() * .94;
        const length = 12 + Math.floor(rootRandom() * 23);
        for (let j = 0; j < length; j++) {
          points.push([x, y]);
          angle += (rootRandom() - .5) * .43;
          x += side * Math.cos(angle) * 5;
          y = Math.max(ground + 4, y + Math.sin(angle) * 4.5);
        }
        roots.push({points, width: 1 + 1.25 * rootRandom()});
      }
    }
  }
  function paintRoots(ctx, growth) {
    ctx.save();
    ctx.strokeStyle = ink(.47);
    for (const root of roots) {
      const end = Math.floor((.08 + .92 * growth) * (root.points.length - 1));
      ctx.lineWidth = root.width * (.45 + .55 * growth);
      ctx.beginPath();
      ctx.moveTo(...root.points[0]);
      for (let i = 1; i <= end; i++) {
        const [x, y] = root.points[i];
        ctx.lineTo(x, y);
        if (i > 4 && i % 5 === 0) {
          ctx.lineTo(x - 3, y + 3 + (end - i) * .39);
          ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  return { paint, paintRoots };
}
