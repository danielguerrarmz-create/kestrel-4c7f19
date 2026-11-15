// A drawing to turn, scrub and play: pictures made beforehand by the studio (pipeline/plate.mjs), shown one
// over another. Nothing is worked out here but which two pictures to show and how much of each, so it runs the
// same on any machine and adds almost nothing to the page it is set into.
//
// It reads manifest.json beside it: the space it was made for, the paper and ink of that page, and its modes.
// Each mode is a run of frames with a word for where each stands ("At installation", "Established · autumn").
// A mode whose pictures are the room unrolled can be turned: dragged sideways, it comes round again.
//
// On its own page it shows tabs, a line of words and a statement. Set into a slide (?embed) it shows only the
// drawing and its line of time, and the slide drives it:
//   window.__ready                        true once the first picture is up
//   window.__duration                     seconds one pass of the present mode takes
//   window.__setT(seconds)                stop, and show that moment
//   window.__setMode(id)                  'space', 'light', 'time'...
//   window.__play(on)                     play or pause
//   postMessage({ type: 'bower:mode' | 'bower:seek' | 'bower:play', value })    the same, from outside a frame
// ?mode=light&t=0.5&print  opens on a mode and a moment; print (or printing the page) shows the mode's poster.
(async () => {
  'use strict';
  const q = new URLSearchParams(location.search);
  const $ = (id) => document.getElementById(id);
  const manifest = window.BOWER_PIECE ?? (await (await fetch('manifest.json')).json());
  const root = document.documentElement.style;
  root.setProperty('--paper', manifest.paper);
  root.setProperty('--ink', manifest.ink);
  if (q.has('embed')) document.body.classList.add('embed');
  if (q.has('print')) document.body.classList.add('print');

  const piece = $('piece');
  const canvas = $('sheet');
  const ctx = canvas.getContext('2d');
  const [slotW, slotH] = manifest.slot;
  piece.style.aspectRatio = `${slotW} / ${slotH}`;
  $('statement').textContent = manifest.statement ?? '';

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** How long the picture rests after a hand has been on it before it moves again by itself, and one whole turn of the room. */
  const REST_MS = 4500;
  const TURN_SECONDS = 150;
  const HOLD_AT_END = 0.08;

  const state = { mode: null, t: 0, pan: 0, playing: !still && !q.has('print'), touched: -Infinity, seen: true };
  const pictures = new Map();
  const picture = (src) => {
    if (!pictures.has(src)) {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.addEventListener('load', () => (dirty = true));
      pictures.set(src, img);
    }
    return pictures.get(src);
  };
  let dirty = true;

  // ---- modes -------------------------------------------------------------------------------------------------------
  const tabs = $('modes');
  for (const mode of manifest.modes) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = mode.label;
    b.dataset.mode = mode.id;
    b.addEventListener('click', () => setMode(mode.id));
    tabs.append(b);
  }
  function setMode(id) {
    const mode = manifest.modes.find((m) => m.id === id) ?? manifest.modes[0];
    // views of one thing keep their place along the line of time when one is changed for another
    if (!(manifest.sameTime && state.mode)) state.t = 0;
    state.mode = mode;
    piece.classList.toggle('still', mode.frames.length < 2);
    for (const b of tabs.children) b.setAttribute('aria-pressed', String(b.dataset.mode === mode.id));
    $('line').textContent = mode.line ?? '';
    $('poster').src = `poster-${mode.id}.png`;
    $('hint').textContent = mode.hint ?? (mode.turns ? 'drag to turn' : 'drag to move through time');
    // what each panel of a row is, written at its head
    const heads = $('panels');
    heads.replaceChildren(...(mode.panels ?? []).map((text) => Object.assign(document.createElement('span'), { textContent: text })));
    heads.style.columnGap = `${(mode.gutter ?? 0) * 100}%`;
    window.__duration = mode.seconds;
    // the first picture now, the rest behind it
    for (const f of mode.frames) picture(f.src);
    dirty = true;
  }

  // ---- drawing -----------------------------------------------------------------------------------------------------
  function fit() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(piece.clientWidth * ratio);
    const h = Math.round(piece.clientHeight * ratio);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      dirty = true;
    }
  }
  const ease = (x) => x * x * (3 - 2 * x);
  // Two pictures are mixed on a sheet of their own, each by its share and the two added, and the mix is then laid on
  // the paper. Laid one over the other straight on to the paper they would thin towards it half-way between.
  const mixing = document.createElement('canvas');
  const mixed = mixing.getContext('2d');
  /** One picture across the sheet; a room unrolled is laid twice, so that it comes round. */
  function lay(img, alpha) {
    if (!img.complete || !img.naturalWidth || alpha <= 0) return;
    const ctx = mixed;
    ctx.globalAlpha = alpha;
    if (!state.mode.turns) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return;
    }
    const x = -(((state.pan % 1) + 1) % 1) * canvas.width;
    ctx.drawImage(img, x, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x + canvas.width, 0, canvas.width, canvas.height);
  }
  function draw() {
    const frames = state.mode.frames;
    const n = frames.length;
    // a moment that is no moment (not a number, or off either end of the line) is the start
    if (!(state.t >= 0 && state.t <= 1)) state.t = 0;
    // the run of frames, with a rest on the last before it goes back to the first
    const along = n > 1 ? Math.min(1, state.t / (1 - HOLD_AT_END)) * (n - 1) : 0;
    const i = Math.min(n - 1, Math.floor(along));
    const mix = ease(along - i);
    // a picture that has not arrived yet: the nearest before it that has, so that the sheet is never empty
    const here = (k) => picture(frames[k].src).complete && picture(frames[k].src).naturalWidth > 0;
    let shown = i;
    while (shown > 0 && !here(shown)) shown--;
    const next = shown === i && i + 1 < n && here(i + 1) ? mix : 0;
    if (mixing.width !== canvas.width || mixing.height !== canvas.height) {
      mixing.width = canvas.width;
      mixing.height = canvas.height;
    }
    mixed.globalCompositeOperation = 'source-over';
    mixed.clearRect(0, 0, mixing.width, mixing.height);
    lay(picture(frames[shown].src), 1 - next);
    mixed.globalCompositeOperation = 'lighter';
    if (next > 0) lay(picture(frames[i + 1].src), next);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mixing, 0, 0);
    $('stage').textContent = frames[mix > 0.5 && i + 1 < n ? i + 1 : i].stage;
    $('scrub').value = String(Math.round(state.t * 1000));
    window.__ready = here(shown);
  }

  let before = performance.now();
  function tick(now) {
    // time that stands still or runs backwards (a clock set, a frame forced) moves nothing
    const dt = Math.min(0.1, Math.max(0, (now - before) / 1000)) || 0;
    before = now;
    // whatever goes wrong in one frame, the next is still asked for: the drawing never stops for good
    try {
      step(now, dt);
    } catch (problem) {
      console.warn(problem);
    }
    requestAnimationFrame(tick);
  }
  function step(now, dt) {
    fit();
    const resting = now - state.touched < REST_MS;
    if (state.playing && state.seen && !resting && !document.hidden) {
      if (state.mode.frames.length > 1) state.t = (state.t + dt / state.mode.seconds) % 1;
      if (state.mode.turns) state.pan += dt / TURN_SECONDS;
      dirty = true;
    }
    if (dirty) {
      dirty = false;
      draw();
    }
  }

  // ---- a hand on it --------------------------------------------------------------------------------------------------
  const touch = () => {
    state.touched = performance.now();
    dirty = true;
  };
  function play(on) {
    state.playing = on;
    if (on) state.touched = -Infinity;
    $('play').textContent = on ? 'Pause' : 'Play';
    $('play').setAttribute('aria-label', on ? 'Pause' : 'Play');
  }
  $('play').addEventListener('click', () => play(!state.playing));
  $('scrub').addEventListener('input', () => {
    state.t = Number($('scrub').value) / 1000;
    touch();
  });
  let held = null;
  canvas.addEventListener('pointerdown', (e) => {
    held = { x: e.clientX, pan: state.pan, t: state.t };
    canvas.setPointerCapture(e.pointerId);
    piece.classList.add('held');
    touch();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!held) return;
    const moved = (e.clientX - held.x) / piece.clientWidth;
    // a room unrolled is turned; anything else is moved along its line of time
    if (state.mode.turns) state.pan = held.pan - moved;
    else state.t = Math.min(1 - HOLD_AT_END, Math.max(0, held.t + moved));
    touch();
  });
  const release = () => {
    held = null;
    piece.classList.remove('held');
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  piece.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step) {
      if (e.shiftKey && state.mode.turns) state.pan += step / 12;
      else state.t = Math.min(1 - HOLD_AT_END, Math.max(0, state.t + step / Math.max(8, (state.mode.frames.length - 1) * 2)));
      touch();
    } else if (e.key === ' ') play(!state.playing);
    else return;
    // the keys are the drawing's while it has them, not the slide's
    e.preventDefault();
    e.stopPropagation();
  });

  // ---- driven from outside ---------------------------------------------------------------------------------------------
  window.__setMode = setMode;
  window.__play = play;
  window.__setT = (seconds) => {
    play(false);
    state.t = Math.min(1, Math.max(0, seconds / state.mode.seconds));
    dirty = true;
    draw();
  };
  addEventListener('message', (e) => {
    const m = e.data ?? {};
    if (m.type === 'bower:mode') setMode(m.value);
    else if (m.type === 'bower:seek') window.__setT(m.value);
    else if (m.type === 'bower:play') play(Boolean(m.value));
  });
  new IntersectionObserver(([entry]) => (state.seen = entry.isIntersecting)).observe(piece);
  new ResizeObserver(() => (dirty = true)).observe(piece);

  setMode(q.get('mode') ?? manifest.modes[0].id);
  if (q.has('t')) state.t = Math.min(1, Math.max(0, Number(q.get('t'))));
  play(state.playing);
  requestAnimationFrame(tick);
})();
