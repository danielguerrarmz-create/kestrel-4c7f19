/* "The place": the whole place first, then into it. Everything shown was made beforehand (manifest.js);
   this page only chooses which picture, marks and words to show. The picture fills the window and everything
   else floats over it. Each view is a sequence of frames on one line of days, and plays by itself on entry. */
(() => {
  'use strict';
  const P = window.BOWER_THE_PLACE;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const query = new URLSearchParams(location.search);
  const stations = new Map(P.stations.map((s) => [s.id, s]));
  const still = query.has('still');
  const calm = still || matchMedia('(prefers-reduced-motion: reduce)').matches;   // no zooms, no drift, no playing on entry
  const body = document.body;
  if (query.has('embed')) body.classList.add('embed');
  body.classList.toggle('still', still);
  body.classList.toggle('calm', calm);

  const state = { station: P.start, day: P.moments[0].day, life: false, playing: false };
  let shot = null, timer = null, W = 0, H = 0, bubbles = [];
  const cache = new Map();   // pictures asked for ahead of being shown, kept so the browser holds them

  const svg = (tag, attrs = {}, text) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const station = () => stations.get(state.station);
  const view = (s = station()) => P.views[s.view];
  /** The frame on show: the last one this view has on or before the chosen day. */
  const frame = (v = view()) => [...v.frames].reverse().find((f) => f.day <= state.day) ?? v.frames[0];
  /** The named moment a day falls in. */
  const moment = (day) => [...P.moments].reverse().find((m) => m.day <= day) ?? P.moments[0];
  const load = (file) => { if (!cache.has(file)) { const img = new Image(); img.decoding = 'async'; img.src = file; cache.set(file, img); } return cache.get(file); };
  /** Milliseconds a frame, slow enough to see each date: half a second where a view has four dates a year (ten
      years in about twenty seconds), longer where it has one a year. ?pace=2 doubles them, ?pace=0.5 halves them. */
  const PACE = Number(query.get('pace')) > 0 ? Number(query.get('pace')) : 1;
  const rate = (n = view().frames.length) => PACE * (n >= 24 ? 500 : n >= 8 ? 800 : 1500);
  const END_HOLD = 3500 * PACE;   // on the last date, before it starts again

  // ---- the picture, edge to edge ----
  /** Where a picture sits on the stage: covering it, unless it is far wider or taller than the stage (a section),
      when it is shown whole and the bands beside it take the colours of its edges. */
  function fit(v) {
    const [iw, ih] = v.size, a = iw / ih, s = W / H, whole = a > s * 1.3 || a < s / 1.3;
    const k = whole ? Math.min(W / iw, H / ih) : Math.max(W / iw, H / ih), w = iw * k, h = ih * k;
    return { x: (W - w) / 2, y: (H - h) / 2, w, h, whole, wide: a > s };
  }
  function lay(node) {
    const b = node.fit = fit(node.v), e = node.v.edges;
    Object.assign(node.img.style, { left: `${b.x}px`, top: `${b.y}px`, width: `${b.w}px`, height: `${b.h}px` });
    node.style.background = b.whole && e ? (b.wide ? `linear-gradient(${e.top} 50%, ${e.bottom} 50%)` : `linear-gradient(to right, ${e.left} 50%, ${e.right} 50%)`) : '';
  }
  function makeShot(v, f, how) {
    const node = document.createElement('div');
    node.className = `shot${how ? ` ${how}` : ''}`;
    node.v = v; node.file = f.file;
    node.img = new Image(); node.img.alt = v.note; node.img.src = f.file;
    node.append(node.img); lay(node);
    return node;
  }
  /** A named place on a frame, in stage pixels: the frame's own places when it has them (the camera moves),
      else the view's; labels only ever from the frame. Null when out of frame. */
  function spot(names, f, v, b, frameOnly) {
    for (const n of names) {
      const p = f.places ? f.places[n] : frameOnly ? null : v.places[n];
      if (!p) continue;
      const x = b.x + p[0] * b.w, y = b.y + p[1] * b.h;
      return x > 8 && x < W - 8 && y > 8 && y < H - 8 ? [x, y] : null;
    }
    return null;
  }

  // ---- bubbles: the ways on, and in a cut the parts named ----
  /** A target is a small red dot in a thin ring; a part named in a cut, a hollow dot. Names show for a moment
      when a view opens, then only near the pointer or with keyboard focus. */
  let pointer = null, namesTimer = 0;
  function buildMarks(s) {
    bubbles = [];
    const all = [...s.targets.map((t) => ({ ...t, open: true })), ...(s.labels ?? []).map((t) => ({ ...t, at: [t.at] }))];
    $('marks').replaceChildren(...all.map((t, i) => {
      const g = svg('g', t.open ? { class: 'hot', tabindex: 0, role: 'button', 'aria-label': t.label } : { class: 'lab' });
      const inner = svg('g', { class: 'in', style: `animation-delay:${i * 120}ms` });   // they arrive one after another
      const name = svg('text', { x: 16, y: 4 }, t.label);
      if (t.open) inner.append(svg('circle', { class: 'hit', r: 22 }), svg('circle', { class: 'pulse', r: 10, style: `animation-delay:${(i * 0.6) % 2.4}s` }), svg('circle', { class: 'ring', r: 10 }), svg('circle', { class: 'core', r: 4.5 }));
      else inner.append(svg('circle', { class: 'core', r: 3.5 }));
      inner.append(name);
      g.append(inner);
      const b = { t, g, name, left: false, at: null };
      if (t.open) {
        const go = () => goTo(t.to, b.at);
        g.addEventListener('click', go);
        g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      }
      bubbles.push(b);
      return g;
    }));
    clearTimeout(namesTimer);
    $('marks').classList.add('names');
    if (!still) namesTimer = setTimeout(() => $('marks').classList.remove('names'), 1600);
    placeMarks();
  }
  /** Each bubble rides with its place on the frame on show; a transform only, no layout. */
  function placeMarks() {
    if (!shot) return;
    const f = frame(shot.v);
    for (const b of bubbles) {
      b.at = spot(b.t.at, f, shot.v, shot.fit, !b.t.open);
      b.g.classList.toggle('gone', !b.at);
      if (!b.at) continue;
      b.g.setAttribute('transform', `translate(${b.at[0].toFixed(1)},${b.at[1].toFixed(1)})`);
      const left = b.at[0] > W - 240;   // the name goes to whichever side has room
      if (left !== b.left) { b.left = left; b.name.setAttribute('x', left ? -16 : 16); b.name.setAttribute('text-anchor', left ? 'end' : 'start'); }
    }
    near();
  }
  /** A name shows while the pointer is within about 130 px of its dot. */
  function near() {
    for (const b of bubbles) b.g.classList.toggle('near', !!(pointer && b.at && Math.hypot(b.at[0] - pointer[0], b.at[1] - pointer[1]) < 130));
  }

  /** The frame on show, in the picture on top: within a view the picture steps, its bubbles follow. */
  function show() {
    const f = frame();
    if (shot && shot.file !== f.file) { shot.file = f.file; shot.img.src = load(f.file).src; }
    placeMarks();
  }

  // ---- the title and the time line over the picture (the figures stay in the manifest, not drawn) ----
  function buildChrome(s) {
    const v = view(s), first = v.frames[0].day, last = v.frames.at(-1).day;
    $('title').textContent = s.title;
    $('back').hidden = s.id === P.start;
    $('hint').hidden = s.id !== P.start;   // on the whole place only: the ways in are small, so say that they are there
    document.title = s.id === P.start ? s.title : `${s.title}: the living place`;
    Object.assign($('scrub'), { min: first, max: last, disabled: first === last });
    const width = $('ticks').clientWidth, days = new Set(v.frames.map((f) => f.day));
    $('ticks').replaceChildren(...P.moments.filter((m) => m.day >= first && m.day <= last).map((m) => {
      const li = document.createElement('li'), button = document.createElement('button'), share = (m.day - first) / (last - first || 1);
      li.dataset.moment = m.id; li.dataset.x = share * width; li.style.left = `${share * 100}%`;
      li.classList.toggle('missing', !days.has(m.day));   // no picture of that day: it shows the one before
      button.type = 'button'; button.title = m.says; button.textContent = m.month;
      button.addEventListener('click', () => handTo(m.id));
      li.append(button);
      return li;
    }));
    const n = v.frames.length;
    $('rendering').textContent = v.expected && n < v.expected ? `rendering: ${n} of ${v.expected}` : '';
    body.classList.toggle('drift', !calm && !s.section);   // perspective views drift slowly; sections stay put
    // the words stand on the picture itself: white or ink, whichever the packing measured to read on this view
    const w = v.words || {};
    for (const zone of ['title', 'link', 'foot']) {
      body.classList.toggle(`${zone}-ink`, w[zone] === 'ink');
      body.classList.toggle(`${zone}-firm`, !!(w.firm && w.firm[zone]));
    }
  }
  function chrome() {
    const s = station(), f = frame();
    $('date').textContent = f.month;
    $('scrub').value = f.day;
    // a tick's label shows when it is the moment on show, or when it has room beside those already shown
    const shownAt = [];
    const ticks = [...$('ticks').children].sort((a, b) => (b.dataset.moment === f.moment) - (a.dataset.moment === f.moment));
    for (const li of ticks) {
      const x = Number(li.dataset.x), room = shownAt.every((x2) => Math.abs(x2 - x) > 130);
      li.classList.toggle('quiet', !room);
      if (room) shownAt.push(x);
      li.firstChild.setAttribute('aria-current', String(li.dataset.moment === f.moment));
    }
    body.classList.toggle('playing', state.playing);
    $('play').textContent = state.playing ? 'Pause' : 'Play';
    $('life').style.display = state.life && P.life.views.includes(s.view) ? '' : 'none';
  }

  const current = () => ({ station: state.station, view: station().view, day: state.day, frame: frame().file, moment: moment(frame().day).id, life: state.life, playing: state.playing, frames: view().frames.length, expected: view().expected ?? null, stations: [...stations.keys()], moments: P.moments.map((m) => m.id) });
  function changed() {
    chrome();
    if (parent !== window) parent.postMessage({ type: 'bower-place:state', state: current() }, '*');
    return current();
  }

  // ---- going into a view, and back out ----
  /** Into a view: the picture zooms toward the bubble clicked (`at`) while the next fades in over it from a little
      larger; without `at` it reverses, the next settling from close in on the bubble that led here. */
  function goTo(id, at) {
    if (!stations.has(id)) throw new Error(`No such place in the drawing: ${id}`);
    const before = shot, from = state.station, s = stations.get(id), v = view(s);
    play(false, true);
    state.station = id;
    const f0 = calm ? v.frames.at(-1) : v.frames[0];
    state.day = f0.day;
    v.frames.forEach((f) => load(f.file));
    const motion = !!before && !calm;
    let how = before ? 'enter' : 'on';
    let origin = null;
    if (motion && !at) {
      const back = s.targets.find((t) => t.to === from);
      origin = back && spot(back.at, f0, v, fit(v)) || [W / 2, H / 2];
      how = 'enter back';
    }
    const next = makeShot(v, f0, how);
    if (origin) next.style.transformOrigin = `${origin[0]}px ${origin[1]}px`;
    $('world').insertBefore(next, $('life'));
    shot = next;
    buildChrome(s);
    $('marks').replaceChildren(); bubbles = [];
    const settle = () => {
      if (shot !== next) return;
      buildMarks(s);
      if (!calm && v.frames.length > 1) { pausedByHand = false; play(true); }   // each view starts playing
      changed();
    };
    if (!before) settle();
    else {
      const go = () => {
        if (motion) {
          before.style.transformOrigin = at ? `${at[0]}px ${at[1]}px` : `${W / 2}px ${H / 2}px`;
          before.classList.add(at ? 'leave' : 'shrink');
        }
        requestAnimationFrame(() => requestAnimationFrame(() => next.classList.replace('enter', 'on')));
        setTimeout(() => { before.remove(); settle(); }, still ? 0 : 640);
      };
      // wait for the picture (not long) so the fade is to a picture, not to nothing
      Promise.race([next.img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 700))]).then(go);
    }
    // then the first frames of the views one click away
    setTimeout(() => { for (const t of s.targets) load(P.views[stations.get(t.to).view].frames[0].file); }, 1500);
    return changed();
  }
  /** A named moment ('year-3'), a day ('day:837') or a number of days after the start of the run. Pauses. */
  function setMoment(at) {
    const named = P.moments.find((m) => m.id === at);
    const day = named ? named.day : Number(String(at).replace('day:', ''));
    if (!Number.isFinite(day)) throw new Error(`No such moment: ${at}`);
    const frames = view().frames;
    play(false, true);
    state.day = Math.max(frames[0].day, Math.min(frames.at(-1).day, day)); show(); return changed();
  }
  function setLife(on) { state.life = !!on; return changed(); }
  /** Plays through this view's frames, holds on the last, and starts again, until paused. It waits for a
      picture that has not arrived rather than stepping past it. */
  function play(on = !state.playing, quiet = false) {
    clearTimeout(timer);
    state.playing = !!on && view().frames.length > 1;
    if (state.playing) {
      const frames = view().frames;
      let i = frames.indexOf(frame()) + 1;
      if (i >= frames.length) i = 0;
      const step = () => {
        const f = frames[i], img = load(f.file);
        if (!img.complete) { timer = setTimeout(step, 60); return; }
        state.day = f.day; show(); changed();
        i += 1;
        if (i < frames.length) timer = setTimeout(step, rate());
        else { i = 0; timer = setTimeout(step, END_HOLD); }
      };
      timer = setTimeout(step, i === 0 ? 400 : rate());
    }
    return quiet ? null : changed();
  }
  /** For the deck: seconds one pass through this view takes, and a seek within it that pauses. */
  const duration = () => (view().frames.length * rate()) / 1000;
  function setT(seconds) {
    const frames = view().frames, i = Math.max(0, Math.min(frames.length - 1, Math.floor((seconds * 1000) / rate())));
    return setMoment(`day:${frames[i].day}`);
  }
  /** The hand moving through time (the slider let go, a named moment, an arrow key): to that day, and on from there.
      It stays still only if the hand has pressed Pause. */
  let pausedByHand = false;
  function handTo(at) { const out = setMoment(at); return pausedByHand || calm ? out : play(true); }
  const nudge = (by) => { const frames = view().frames, f = frames[frames.indexOf(frame()) + by]; if (f) handTo(`day:${f.day}`); };

  // ---- the page's controls ----
  $('scrub').addEventListener('input', (e) => {   // snaps to the nearest frame there is: never a day without a picture
    const day = Number(e.target.value), near = view().frames.reduce((a, f) => (Math.abs(f.day - day) < Math.abs(a.day - day) ? f : a));
    setMoment(`day:${near.day}`);   // held while the slider is in the hand
  });
  $('scrub').addEventListener('change', () => { if (!pausedByHand && !calm) play(true); });   // let go: it carries on from there
  $('back').addEventListener('click', () => goTo(P.start));
  $('play').addEventListener('click', () => { play(); pausedByHand = !state.playing; });
  $('reallines').replaceChildren(...P.real.lines.map((t) => Object.assign(document.createElement('li'), { textContent: t })));
  $('realfrom').textContent = `From ${P.real.from}`;
  $('realbtn').addEventListener('click', () => { const open = $('real').hidden; $('real').hidden = !open; $('realbtn').setAttribute('aria-expanded', String(open)); });
  // Inside a deck's slide (?embed) the deck owns the keys that turn its slides and open its index and notes: they are
  // handed up to it, so that a click on this page does not strand the presenter here. Escape still comes back out of a view.
  const embedded = query.has('embed') && parent !== window;
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.station !== P.start) { goTo(P.start); return; }
    if (embedded && ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'g', 'G', 'n', 'N', 'f', 'F'].includes(e.key) && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      try { parent.document.body.dispatchEvent(new KeyboardEvent('keydown', { key: e.key, code: e.code, bubbles: true, cancelable: true })); parent.focus(); } catch { /* another origin: the keys stay here */ }
      return;
    }
    if (e.target === $('scrub')) return;   // the slider steps itself
    if (e.key === 'ArrowRight') nudge(1);
    if (e.key === 'ArrowLeft') nudge(-1);
    if (e.key === ' ' && e.target === body) { e.preventDefault(); play(); pausedByHand = !state.playing; }
  });
  // the stage is a 1600 x 900 slide, scaled into the window (or the iframe) and centred
  W = 1600; H = 900;
  let k = 1, origin0 = [0, 0];
  function measure() {
    k = Math.min(innerWidth / W, innerHeight / H);
    document.documentElement.style.setProperty('--k', k);
    origin0 = [(innerWidth - W * k) / 2, (innerHeight - H * k) / 2];
    $('marks').setAttribute('viewBox', `0 0 ${W} ${H}`); $('life').setAttribute('viewBox', `0 0 ${W} ${H}`);
  }
  addEventListener('resize', measure);
  $('stage').addEventListener('pointermove', (e) => { pointer = [(e.clientX - origin0[0]) / k, (e.clientY - origin0[1]) / k]; near(); });
  $('stage').addEventListener('pointerleave', () => { pointer = null; near(); });
  measure();

  // ---- life: an illustration, not a finding. A few birds cross the picture now and then and sometimes settle. ----
  const birds = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function fly(b, now) {
    if (!shot) return;
    const perch = spot([P.life.perch], frame(shot.v), shot.v, shot.fit);
    const fromLeft = Math.random() < 0.5, settle = !!perch && !b.perched && Math.random() < 0.35;
    b.p0 = b.perched ? b.p2 : [fromLeft ? -0.08 * W : 1.08 * W, rnd(0.05, 0.35) * H];
    b.p2 = settle ? [perch[0] + rnd(-30, 30), perch[1]] : [fromLeft ? 1.1 * W : -0.1 * W, rnd(0.05, 0.4) * H];
    b.p1 = [(b.p0[0] + b.p2[0]) / 2 + rnd(-80, 80), Math.min(b.p0[1], b.p2[1]) - rnd(40, 160)];
    b.t0 = now + (b.perched ? 0 : rnd(1500, 9000)); b.dur = rnd(5000, 9000); b.perched = false; b.settle = settle;
  }
  for (let i = 0; i < 4; i += 1) {
    const el = svg('path', { class: 'bird', d: 'M-7,0 Q-3.5,-5 0,0 Q3.5,-5 7,0' });
    $('life').append(el); birds.push({ el, t0: 0, dur: 0 });
  }
  function tick(now) {
    requestAnimationFrame(tick);
    if (!state.life || $('life').style.display === 'none') return;
    for (const b of birds) {
      if (!b.p0) fly(b, now);
      else if (!b.perched && now > b.t0 + b.dur) { if (b.settle) { b.perched = true; b.t0 = now; b.dur = rnd(3000, 7000); } else fly(b, now); }
      else if (b.perched && now > b.t0 + b.dur) fly(b, now);
      if (!b.p0) continue;
      const t = b.perched ? 1 : (now - b.t0) / b.dur;
      if (t < 0) { b.el.style.opacity = 0; continue; }
      const u = 1 - t, x = u * u * b.p0[0] + 2 * u * t * b.p1[0] + t * t * b.p2[0], y = u * u * b.p0[1] + 2 * u * t * b.p1[1] + t * t * b.p2[1];
      const flap = b.perched ? 0.25 : 0.35 + 0.65 * Math.abs(Math.sin(now / 95 + b.dur));
      b.el.style.opacity = 1;
      b.el.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(1.4,${(1.4 * flap).toFixed(2)})`);
    }
  }
  if (!still) requestAnimationFrame(tick);

  // ---- for a slide that drives it ----
  const actions = { goTo, setMoment, setLife, play, setT, state: current };
  Object.assign(window, { __goTo: goTo, __setMoment: setMoment, __setLife: setLife, __play: play, __setT: setT, __state: current });
  Object.defineProperty(window, '__duration', { get: duration });
  addEventListener('message', (event) => {
    const data = event.data;
    if (parent === window || event.source !== parent || data?.type !== 'bower-place:command') return;
    try {
      if (!actions[data.action]) throw new Error(`No such action: ${data.action}`);
      parent.postMessage({ type: 'bower-place:reply', requestId: data.requestId, result: actions[data.action](...(data.args ?? [])) }, '*');
    } catch (error) {
      parent.postMessage({ type: 'bower-place:reply', requestId: data.requestId, error: String(error?.message ?? error) }, '*');
    }
  });

  state.life = query.get('life') === '1';
  goTo(stations.has(query.get('station')) ? query.get('station') : P.start);
  if (query.get('moment')) { try { setMoment(query.get('moment')); } catch { /* an unknown moment leaves the first */ } }
  window.__ready = true;
  if (parent !== window) parent.postMessage({ type: 'bower-place:ready', state: current() }, '*');
})();
