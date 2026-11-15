/* One study shown as a design tool would show it. Every number and picture was made beforehand (manifest.js,
   the pier block); the page plays a short status line once and then only switches between the two results. */
(() => {
  'use strict';
  const S = window.BOWER_THE_PLACE.pier;
  const $ = (id) => document.getElementById(id);
  const query = new URLSearchParams(location.search);
  const still = query.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fitStage = () => document.documentElement.style.setProperty('--k', Math.min(innerWidth / 1600, innerHeight / 900));
  addEventListener('resize', fitStage); fitStage();
  const states = ['closed', 'opened'];
  let chosen = query.get('state') === 'opened' ? 'opened' : 'closed', stage = 'bare';
  const metres = (v) => (v == null ? 'missing' : `${v.toFixed(2)} m`);

  $('kicker').textContent = S.kicker;
  $('title').textContent = S.title;
  $('pre').textContent = S.precomputed;
  $('param').textContent = S.parameter;
  $('ringnote').textContent = `Ring radius in design.json: ${S.values.map((v) => `${v.ring_m} m`).join(' and ')} (${S.values.map((v) => v.ring_from).join(', ')}). ${S.ring_note}`;
  $('setup').textContent = S.setup ? `Same planting on both: 24 climbers, ${S.setup.care}, ${S.setup.years} years, seed ${S.setup.seed}, simulator ${S.setup.simulator}. ${S.statement}` : '';
  $('picnote').textContent = S.pictures;
  $('reading').textContent = S.reading;
  if (S.missing.length) { $('missing').hidden = false; $('missing').textContent = `Placeholder: missing ${S.missing.join('; ')}`; }

  S.values.forEach((v, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.state = states[i];
    b.innerHTML = '<span></span><b></b><small></small>';
    b.children[0].textContent = v.label;
    b.children[1].textContent = metres(v.feet_m);
    b.children[2].textContent = 'between the feet';
    b.title = S.feet_from;
    b.addEventListener('click', () => { chosen = states[i]; draw(); });
    $('stops2').append(b);
  });

  // the figures: a name, the two values large, the change; where each is written goes in one line at the foot
  const head = document.createElement('div'); head.className = 'cols';
  head.innerHTML = `<span></span><span>${S.stops[0]}</span><span>${S.stops[1]}</span>`;
  $('rows').append(head);
  let group = null;
  for (const r of S.rows) {
    if (r.group !== group && r.group === 'before') $('rows').append(Object.assign(document.createElement('p'), { className: 'sub', textContent: 'Earlier, and the cost' }));
    group = r.group;
    const row = document.createElement('div'); row.className = 'fig';
    row.innerHTML = '<span class="name"></span><em></em><b data-col="closed"></b><b data-col="opened"></b>';
    row.children[0].textContent = r.label; row.children[1].textContent = r.change;
    row.children[2].textContent = r.closed; row.children[3].textContent = r.opened;
    $('rows').append(row);
  }
  if (!S.rows.length) $('rows').textContent = 'Placeholder: no reported figures found.';
  $('sources').replaceChildren(...S.rows.map((r) => Object.assign(document.createElement('li'), { textContent: `${r.label}: ${r.from}` })));
  $('srcbtn').addEventListener('click', () => { const open = $('sources').hidden; $('sources').hidden = !open; $('srcbtn').setAttribute('aria-expanded', String(open)); });

  function draw() {
    for (const b of $('stops2').children) b.setAttribute('aria-checked', String(b.dataset.state === chosen));
    for (const v of $('rows').querySelectorAll('b[data-col]')) v.classList.toggle('now', v.dataset.col === chosen);
    const shots = S.shots[chosen][stage] ?? [];
    $('shots').replaceChildren(...(shots.length ? shots.map((s) => {
      const img = new Image(); img.src = s.src; img.alt = ''; img.style.aspectRatio = `${s.size[0]} / ${s.size[1]}`; return img;
    }) : [Object.assign(document.createElement('div'), { className: 'placeholder', textContent: 'Placeholder: picture missing' })]));
  }

  // a status line that plays once, like a tool at work, then rests. It only reveals results that already exist.
  const steps = S.status;
  let i = 0;
  function next() {
    $('statustext').textContent = steps[i] + (i < steps.length - 1 ? '…' : '');
    $('bar').style.width = `${((i + 1) / steps.length) * 100}%`;
    if (i === 1) chosen = 'opened';
    if (i === steps.length - 1) { stage = 'grown'; document.body.classList.add('rested'); }
    draw();
    i += 1;
    if (i < steps.length) setTimeout(next, 900);
  }
  for (const st of states) for (const s of [...S.shots[st].bare, ...S.shots[st].grown]) { const img = new Image(); img.src = s.src; }
  if (still) { stage = 'grown'; i = steps.length - 1; }
  next();
  window.__ready = true;
})();
