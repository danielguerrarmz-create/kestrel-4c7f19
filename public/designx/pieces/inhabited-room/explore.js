/* The drawing's page. It shows pictures, masks, labels and numbers that were made beforehand (manifest.js)
   and computes nothing. A station is a place to look from, with the layers and words that go with it; a
   configuration is one design of the same room. Either can be changed at any time, and neither moves the other. */
(() => {
  'use strict';
  const P = window.BOWER_PLACE;
  const $ = (id) => document.getElementById(id);
  const query = new URLSearchParams(location.search);
  const [W, H] = P.size;
  const NS = 'http://www.w3.org/2000/svg';
  const stations = new Map(P.stations.map((s) => [s.id, s]));
  const still = query.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (query.has('embed')) document.body.classList.add('embed');
  if (still) document.body.classList.add('still');
  for (const [name, value] of [['paper', query.get('paper') || P.paper], ['ink', query.get('ink') || P.ink]]) {
    document.documentElement.style.setProperty(`--${name}`, `#${value}`);
  }

  const state = { station: null, configuration: null, layers: new Set(), picked: null };
  const listeners = new Set();
  let shot = null;   // the picture on top

  const say = (words, configuration) => (typeof words === 'string' ? words : words?.[configuration] ?? '');
  const place = (name) => P.configurations[state.configuration].points[stations.get(state.station).view][name];
  const svg = (tag, attrs = {}, text) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text !== undefined) node.textContent = text;
    return node;
  };

  /** A picture of one view in one configuration, with a mask for each layer it has and nothing switched on. */
  function build(view, configuration) {
    const c = P.configurations[configuration];
    const node = document.createElement('div');
    node.className = 'shot';
    node.dataset.view = view; node.dataset.configuration = configuration;
    const img = document.createElement('img');
    img.className = 'base'; img.alt = ''; img.src = c.frames[view]; img.decoding = 'async';
    node.append(img);
    for (const layer of Object.keys(P.layers)) {   // stacked in the order the layers are listed: the last lies on top
      if (!c.masks[view][layer]) continue;
      const mask = document.createElement('img');
      mask.className = 'mask'; mask.alt = ''; mask.dataset.layer = layer; mask.src = c.masks[view][layer];
      node.append(mask);
    }
    node.append(svg('svg', { class: 'marks', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none' }));
    return node;
  }

  /** The words and marks of the station, where this configuration's places fall in this picture. */
  function mark(node) {
    const station = stations.get(state.station);
    const marks = node.querySelector('svg.marks');
    marks.replaceChildren();
    const xy = (name) => { const p = place(name); return p && p[2] > 0 ? [p[0] * W, p[1] * H] : null; };
    for (const span of station.spans ?? []) {
      const a = xy(span.from), b = xy(span.to);
      if (!a || !b) continue;
      marks.append(svg('path', { class: 'span', d: `M${a[0]},${a[1] - 9}v18M${a[0]},${a[1]}L${b[0]},${b[1]}M${b[0]},${b[1] - 9}v18` }));
      const q = P.configurations[state.configuration].quantities[span.measure];
      marks.append(svg('text', { class: 'span-text', x: (a[0] + b[0]) / 2, y: Math.min(a[1], b[1]) - 14, 'text-anchor': 'middle' }, `${q.value} ${q.unit}`));
    }
    for (const label of station.labels) {
      const at = xy(label.at), text = say(label.text, state.configuration);
      if (!at || !text) continue;
      const to = [Math.max(24, Math.min(W - 24, at[0] + label.to[0])), Math.max(30, Math.min(H - 16, at[1] + label.to[1]))];   // kept inside the picture
      marks.append(svg('path', { class: 'leader', d: `M${at[0]},${at[1]}L${to[0]},${to[1]}` }), svg('circle', { class: 'dot', cx: at[0], cy: at[1], r: 4 }));
      marks.append(svg('text', { x: to[0] + (label.to[0] < 0 ? -8 : 8), y: to[1] + 6, 'text-anchor': label.to[0] < 0 ? 'end' : 'start' }, text));
    }
    for (const hot of station.hotspots) {
      const at = xy(hot.at);
      if (!at) continue;
      const g = svg('g', { class: 'hot', tabindex: 0, role: 'button', 'aria-label': hot.says });
      g.append(svg('circle', { class: 'ring', cx: at[0], cy: at[1], r: 22 }), svg('circle', { class: 'core', cx: at[0], cy: at[1], r: 7 }), svg('text', { x: at[0] + 30, y: at[1] + 6 }, hot.says));
      const go = () => goTo(hot.to, { from: [at[0] / W, at[1] / H] });
      g.addEventListener('click', go);
      g.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); } });
      marks.append(g);
    }
  }

  function dress(node) {
    node.classList.toggle('opened', state.layers.size > 0);
    node.classList.toggle('picking', !!state.picked);
    for (const mask of node.querySelectorAll('.mask')) {
      mask.classList.toggle('on', state.layers.has(mask.dataset.layer));
      mask.classList.toggle('picked', mask.dataset.layer === state.picked);
    }
    mark(node);
  }

  /** Put the picture for the present station and configuration on top. `from` is where on the old picture the viewer
      chose to go (so the old one grows towards it); `out` says the viewer is coming back to a wider view. */
  function show({ from = null, out = false } = {}) {
    const view = stations.get(state.station).view;
    const before = shot;
    if (before && before.dataset.view === view && before.dataset.configuration === state.configuration) { dress(before); return; }
    const next = build(view, state.configuration);
    $('stage').append(next);
    shot = next;
    dress(next);
    if (before && !still) {
      const moved = before.dataset.view !== view;
      if (moved && from) { before.style.transformOrigin = `${from[0] * 100}% ${from[1] * 100}%`; before.style.transform = 'scale(1.7)'; }
      if (moved && out) { next.style.transform = 'scale(1.18)'; }
      requestAnimationFrame(() => requestAnimationFrame(() => { next.classList.add('on'); next.style.transform = ''; before.classList.remove('on'); }));
      setTimeout(() => before.remove(), 420);
    } else {
      next.classList.add('on');
      before?.remove();
    }
  }

  function chrome() {
    const station = stations.get(state.station), c = P.configurations[state.configuration];
    $('title').textContent = station.title;
    $('caption').textContent = say(station.caption, state.configuration);
    $('home').disabled = state.station === P.start;
    for (const button of $('stations').children) button.setAttribute('aria-current', String(button.dataset.station === state.station));
    for (const button of $('configurations').children) button.setAttribute('aria-pressed', String(button.dataset.configuration === state.configuration));
    for (const item of $('layers').children) {
      const button = item.firstChild, layer = button.dataset.layer;
      button.setAttribute('aria-pressed', String(state.layers.has(layer)));
      button.disabled = !(layer in c.masks[station.view]);
    }
    // the numbers that go with this place, for the designs it sets side by side; the one being shown is marked
    const table = $('measures');
    table.replaceChildren();
    if (station.measures.length) {
      const columns = station.compare?.includes(state.configuration) ? station.compare : [state.configuration];
      const head = table.createTHead().insertRow();
      head.append(document.createElement('th'));
      for (const id of columns) {
        const th = document.createElement('th'); th.textContent = P.configurations[id].label; th.classList.toggle('now', id === state.configuration); head.append(th);
      }
      const body = table.createTBody();
      for (const key of station.measures) {
        const row = body.insertRow();
        const th = document.createElement('th'); th.textContent = P.measure_names[key] ?? key; row.append(th);
        for (const id of columns) {
          const td = row.insertCell(); td.textContent = P.configurations[id].quantities[key]?.says ?? ''; td.classList.toggle('now', id === state.configuration);
          td.title = P.configurations[id].quantities[key]?.from ?? '';
        }
      }
    }
    $('small').textContent = `${c.label}: ${c.what} Pictures and numbers were made beforehand from one scene; nothing is worked out on this page. Sizes are provisional and no footing is engineered.`;
  }

  function changed() {
    chrome();
    const snapshot = current();
    for (const listener of listeners) listener(snapshot);
    if (parent !== window) parent.postMessage({ type: 'bower-place:state', state: snapshot }, '*');
  }

  const current = () => ({ station: state.station, configuration: state.configuration, layers: [...state.layers], view: stations.get(state.station).view, stations: P.stations.map((s) => s.id), configurations: Object.keys(P.configurations) });

  /** Go to a place. It brings its own layers, and its own configuration if it has one to show first. */
  function goTo(id, how = {}) {
    const station = stations.get(id);
    if (!station) throw new Error(`No such place in the drawing: ${id}`);
    const wider = id === P.start && state.station !== P.start;
    state.station = id;
    state.layers = new Set(station.layers);
    state.picked = null;
    if (station.configuration && how.keepConfiguration !== true) state.configuration = station.configuration;
    show({ from: how.from ?? null, out: wider });
    changed();
    return current();
  }

  function setConfiguration(id) {
    if (!P.configurations[id]) throw new Error(`No such configuration: ${id}`);
    state.configuration = id;
    show();
    changed();
    return current();
  }

  function setLayers(ids) {
    state.layers = new Set(ids.filter((id) => id in P.layers));
    dress(shot);
    changed();
    return current();
  }

  // ---- the page's own controls (left out with ?embed, where the slide brings its own) ---------------------------
  for (const station of P.stations) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = station.title; button.dataset.station = station.id;
    button.addEventListener('click', () => goTo(station.id, { keepConfiguration: station.id === state.station }));
    $('stations').append(button);
  }
  for (const [id, c] of Object.entries(P.configurations)) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = c.label; button.dataset.configuration = id; button.title = c.what;
    button.addEventListener('click', () => setConfiguration(id));
    $('configurations').append(button);
  }
  for (const [id, layer] of Object.entries(P.layers)) {
    const item = document.createElement('li'), button = document.createElement('button');
    button.type = 'button'; button.dataset.layer = id; button.title = layer.what; button.style.setProperty('--c', `#${layer.colour}`);
    button.append(document.createElement('i'), layer.name);
    button.addEventListener('click', () => { const next = new Set(state.layers); next.has(id) ? next.delete(id) : next.add(id); setLayers([...next]); });
    button.addEventListener('mouseenter', () => { if (state.layers.has(id)) { state.picked = id; dress(shot); } });
    button.addEventListener('mouseleave', () => { state.picked = null; dress(shot); });
    item.append(button); $('layers').append(item);
  }
  $('home').addEventListener('click', () => goTo(P.start, { keepConfiguration: true }));
  addEventListener('keydown', (event) => {
    if (event.target.closest?.('input, textarea')) return;
    if (event.key === 'Escape') goTo(P.start, { keepConfiguration: true });
    const n = Number(event.key);
    if (n >= 1 && n <= P.stations.length) goTo(P.stations[n - 1].id);
    if (event.key === 'b') setConfiguration('baseline');
    if (event.key === 'p') setConfiguration('proposal');
    if (event.key === 'f') setConfiguration('found');
  });

  // ---- for a slide that drives it ----------------------------------------------------------------------------
  const actions = { goTo: (id, how) => goTo(id, how), setConfiguration, setLayers, state: current };
  Object.assign(window, { __goTo: actions.goTo, __setConfiguration: setConfiguration, __setLayers: setLayers, __state: current, __onState: (fn) => { listeners.add(fn); return () => listeners.delete(fn); } });
  addEventListener('message', (event) => {
    const data = event.data;
    if (event.source !== parent || parent === window || data?.type !== 'bower-place:command') return;
    try {
      if (!actions[data.action]) throw new Error(`No such action: ${data.action}`);
      parent.postMessage({ type: 'bower-place:reply', requestId: data.requestId, result: actions[data.action](...(data.args ?? [])) }, '*');
    } catch (error) {
      parent.postMessage({ type: 'bower-place:reply', requestId: data.requestId, error: String(error?.message ?? error) }, '*');
    }
  });

  // every picture is asked for at once, so that going somewhere never waits on one
  for (const c of Object.values(P.configurations)) for (const src of Object.values(c.frames)) { const img = new Image(); img.src = src; }

  state.configuration = P.configurations[query.get('configuration')] ? query.get('configuration') : 'baseline';
  goTo(stations.has(query.get('station')) ? query.get('station') : P.start, { keepConfiguration: true });
  if (query.get('layers')) setLayers(query.get('layers').split(','));
  window.__ready = true;
  if (parent !== window) parent.postMessage({ type: 'bower-place:ready', state: current() }, '*');
})();
