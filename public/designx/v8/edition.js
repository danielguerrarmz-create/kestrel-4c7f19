/* Edition 08 carries v7's scenes into a continuous story, from encountering a
   Bower to designing, making, commissioning, caring and learning from it. */
(() => {
  'use strict';
  const prior = window.DESIGNX_SLIDES;
  const story = window.DESIGNX_V8_STORY;
  const esc = value => String(value).replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if (prior.length !== 18 || story.length !== 20) throw new Error('Edition 08 expects eighteen v7 scenes and two new drawing spaces.');
  const poster = (src,alt,label) => `<figure><img src="v8/assets/studies/${src}" alt="${alt}"><figcaption>${label}</figcaption></figure>`;
  const chapter = number => number <= 4 ? 'A living place' : number <= 7 ? 'Designing the place' : number <= 9 ? 'Making the Bower' : number <= 11 ? 'Commissioning and care' : number <= 16 ? 'Learning from the first Bower' : number === 17 ? 'The people' : 'The wider ambition';
  const newDrawing = item => ({
    title:item.title,theme:item.theme,act:item.number === 4 ? 'The living place' : 'The life of the Bower',sourceIndex:3,
    html:`<section class="v7-scene v8-drawing-brief"><h2 class="v7-title">${esc(item.title)}</h2><p class="v8-drawing-intention">${item.number === 4 ? 'Rooting ground, water, foundations and care access shape the room above.' : 'Establishment, training and tending sustain the place the customer commissioned.'}</p><div class="v8-reserved-drawing"><aside class="v7-drawing-note"><strong>${item.number === 4 ? 'The same room, opened up' : 'The life of the room'}</strong><p>${item.number === 4 ? 'Compose the section around the relationship between roots, footings, water and the entrance. First scene drafts are available for review.' : 'Show establishment and tending in the same room, with a clear route for care and continuing occupation.'}</p></aside></div><p class="v7-status">${item.number === 4 ? 'Working scene drafts exist; presentation drawing in development. Ground, water and foundation arrangements are provisional proposals.' : 'Care drawing in development. Proposed care service; scope, delivery and pricing remain to be defined.'}</p></section>`,
    notes:item.purpose,source:item.number === 4 ? 'Inhabited-room scene: six-bay-radial-v1 baseline; site.json and ground.json contain provisional design proposals. First arrival and section renders are linked in the story map.' : 'V7 proposed annual-care offer and the inhabited-room scene brief. No operating service or observed outcomes asserted.'
  });
  window.DESIGNX_SLIDES = story.map(item => {
    const slide = item.baseSlide ? prior[item.baseSlide - 1] : newDrawing(item);
    const template = document.createElement('template'); template.innerHTML = slide.html;
    const content = template.content;
    content.querySelectorAll('a[href="https://www.bowerbuild.org/designx/v7"]').forEach(link => { link.href = 'v8/'; link.textContent = 'Bower · Edition 08 ↗'; });
    if (item.baseSlide === 4) {
      const slot = content.querySelector('.v7-drawing-space');
      slot.classList.add('v8-growth-slot');
      slot.querySelector('.v7-drawing-note').hidden = true;
      slot.insertAdjacentHTML('beforeend', `<div class="v8-study-poster v8-season-poster">${poster('seasonal-summer.webp','The same three views of the six-bay growth scenario in summer.','Summer')}${poster('seasonal-winter.webp','The same three views of the six-bay growth scenario in winter.','Winter')}</div><div class="v8-study-host slide-interaction" data-v8-study="growth" aria-label="Explore the existing growth study"></div>`);
      content.querySelector('.v7-growth-line').insertAdjacentHTML('afterend','<button type="button" class="v8-open-study slide-interaction" data-v8-open="growth">Enlarge study ↗</button>');
      content.querySelector('.v7-status').textContent = 'Existing six-bay growth study. Concept geometry and trial planting; scenarios on stated assumptions, not forecasts.';
    }
    if (item.baseSlide === 5) {
      const slot = content.querySelector('.v7-anatomy-drawing'); slot.classList.add('v8-pier-slot');
      slot.insertAdjacentHTML('beforeend', `<div class="v8-pier-example"><div class="v8-study-poster">${poster('pier-original.webp','The original six-bay pier arrangement.','Original pier')}${poster('pier-opened.webp','The same room with the pier legs opened.','Opened pier')}</div><button type="button" class="v8-open-study slide-interaction" data-v8-open="pier">Explore the pier study ↗</button></div>`);
      slot.querySelector('.v7-drawing-note').hidden = true;
      content.querySelector('.v7-status').textContent = 'The existing pier study connects planting conditions and entrance clearance. Provisional light model; ground integration is the next drawing.';
    }
    return { ...slide, act:chapter(item.number), comparisonIndex:item.baseSlide ? item.baseSlide - 1 : item.number === 4 ? 3 : 12,
      notes: `${slide.notes}<br><br><strong>Story connection</strong><br>${esc(item.purpose)}<br><br><strong>Continue to the next slide</strong><br>${esc(item.transition)}<br><br><strong>Drawing plan</strong><br>${esc(item.drawing)}`,
      html:template.innerHTML };
  });
  window.DESIGNX_META = Object.freeze({...window.DESIGNX_META,edition:8,targetSlideCount:20,exportReady:false,status:'integrated-working-draft'});

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const printing = new URL(location.href).searchParams.get('print') === '1';
    const seventh = document.querySelector('[data-edition-seven]');
    const printUrl = new URL(location.href); printUrl.search = '?print=1'; printUrl.hash = '';
    queueMicrotask(() => { document.getElementById('pdf-link').href = printUrl.href; });
    if (location.protocol === 'file:') seventh.href = new URL('../v7/index.html',location.href).href;
    document.addEventListener('designx:slidechange',event => { seventh.hash = `slide-${String(window.DESIGNX_SLIDES[event.detail.index].comparisonIndex + 1).padStart(2,'0')}`; });
    const anatomy = root.querySelector('[data-v7-scene="anatomy"]');
    anatomy.addEventListener('click',event => {
      const button = event.target.closest('[data-v7-intent]'); if (!button) return;
      const example = anatomy.querySelector('.v8-pier-example'), note = anatomy.querySelector('.v7-drawing-note');
      example.hidden = button.dataset.v7Intent !== '0'; note.hidden = !example.hidden;
    });
    if (printing || location.protocol === 'file:') { root.querySelectorAll('[data-v8-open]').forEach(button => button.hidden = true); return; }
    const growthHost = root.querySelector('[data-v8-study="growth"]');
    const growth = {host:growthHost,home:growthHost.parentElement,slide:growthHost.closest('.slide'),controller:null,kind:'growth'};
    const pierHost = document.createElement('div'); pierHost.className = 'v8-study-host'; pierHost.dataset.v8Study = 'pier';
    const pier = {host:pierHost,home:null,slide:anatomy.closest('.slide'),controller:null,kind:'pier'};
    const dialog = document.createElement('dialog'); dialog.className = 'v8-study-dialog'; dialog.setAttribute('aria-labelledby','v8-study-title');
    dialog.innerHTML = '<header><h2 id="v8-study-title"></h2><button type="button">Return to slide ×</button></header><div class="v8-dialog-surface"></div><p class="v8-dialog-status"></p>';
    document.body.append(dialog);
    let current = null, expanded = null, returnButton = null, beforePrinting = false;
    const mount = record => {
      if (record.controller) return;
      record.controller = window.DESIGNX_V8_STUDIES.mount(record.host,record.kind);
      record.host.classList.add('v8-mounted');
      if (record === growth) record.home.querySelector('.v8-study-poster').setAttribute('aria-hidden','true');
    };
    const active = () => {
      const visible = !document.hidden && !beforePrinting;
      const grow = visible && current === growth.slide && (!expanded || expanded === growth);
      if (grow) mount(growth);
      growth.controller?.setActive(grow);
      pier.controller?.setActive(visible && expanded === pier);
    };
    const move = (record,target) => {
      if (target.moveBefore && record.host.isConnected) target.moveBefore(record.host,null);
      else { record.controller?.setActive(false); target.append(record.host); active(); }
    };
    const restore = () => {
      if (!expanded) return;
      const record = expanded; expanded = null;
      if (record.home) move(record,record.home); else { record.controller?.setActive(false); record.host.remove(); }
      active(); returnButton?.focus(); returnButton = null;
    };
    dialog.querySelector('button').onclick = () => { dialog.close(); restore(); };
    dialog.addEventListener('close',() => { if (!dialog.open) restore(); });
    dialog.addEventListener('keydown',event => event.stopPropagation());
    growth.host.addEventListener('keydown',event => event.stopPropagation());
    growth.host.addEventListener('wheel',event => event.stopPropagation(),{passive:true});
    root.querySelectorAll('[data-v8-open]').forEach(button => button.addEventListener('click',() => {
      const record = button.dataset.v8Open === 'growth' ? growth : pier;
      expanded = record; returnButton = button;
      dialog.querySelector('h2').textContent = record === growth ? 'Plants make space' : 'The pier opens';
      dialog.querySelector('.v8-dialog-status').textContent = record === growth ? 'Existing growth scenario on stated assumptions. The inhabited scene and its ground relationships are being developed.' : 'Existing design study. Opening the pier changes planting conditions and narrows the entrance. Provisional light model.';
      move(record,dialog.querySelector('.v8-dialog-surface')); mount(record); dialog.showModal(); active();
    }));
    const modes = ['space','light','time'];
    root.querySelector('[data-v7-scene="growth"]').addEventListener('click',event => {
      const button = event.target.closest('[data-v7-growth]'); if (button) growth.controller?.setMode(modes[Number(button.dataset.v7Growth)]);
    });
    document.addEventListener('designx:slidechange',event => {
      if (expanded && expanded.slide !== event.detail.element) { dialog.close(); restore(); }
      current = event.detail.element; active();
    });
    document.addEventListener('visibilitychange',active);
    window.addEventListener('beforeprint',() => { beforePrinting = true; if (dialog.open) { dialog.close(); restore(); } active(); });
    window.addEventListener('afterprint',() => { beforePrinting = false; active(); });
  });
})();
