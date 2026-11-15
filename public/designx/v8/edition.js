/* Edition 08 carries v7's scenes into a continuous story, from encountering a
   Bower to designing, making, commissioning, caring and learning from it. */
(() => {
  'use strict';
  const prior = window.DESIGNX_SLIDES;
  const story = window.DESIGNX_V8_STORY;
  const esc = value => String(value).replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if (prior.length !== 18 || story.length !== 22) throw new Error('Edition 08 expects eighteen source scenes and twenty-two story scenes.');
  const poster = (src,alt,label) => `<figure><img src="v8/assets/studies/${src}" alt="${alt}"><figcaption>${label}</figcaption></figure>`;
  const chapter = number => number <= 6 ? 'A living place' : number <= 10 ? 'Designing the place' : number <= 12 ? 'Making the Bower' : number <= 15 ? 'The first commission' : number <= 18 ? 'Care and learning' : number === 19 ? 'The people' : 'The wider ambition';
  const newDrawing = item => ({
    title:item.title,theme:item.theme,act:item.theme === 'v8-ground-slide' ? 'The living place' : 'The life of the Bower',sourceIndex:3,
    html:`<section class="v7-scene v8-drawing-brief"><h2 class="v7-title">${esc(item.title)}</h2><p class="v8-drawing-intention">${item.theme === 'v8-ground-slide' ? 'Rooting ground, water, foundations and care access shape the room above.' : 'Establishment, training and tending sustain the place the customer commissioned.'}</p><div class="v8-reserved-drawing"><aside class="v7-drawing-note"><strong>${item.theme === 'v8-ground-slide' ? 'The same room, opened up' : 'The life of the room'}</strong><p>${item.theme === 'v8-ground-slide' ? 'Compose the section around the relationship between roots, footings, water and the entrance. First scene drafts are available for review.' : 'Show establishment and tending in the same room, with a clear route for care and continuing occupation.'}</p></aside></div><p class="v7-status">${item.theme === 'v8-ground-slide' ? 'Working scene drafts exist; presentation drawing in development. Ground, water and foundation arrangements are provisional proposals.' : 'Care drawing in development. Proposed care service; scope, delivery and pricing remain to be defined.'}</p></section>`,
    notes:item.purpose,source:item.theme === 'v8-ground-slide' ? 'Inhabited-room scene: six-bay-radial-v1 baseline; site.json and ground.json contain provisional design proposals. First arrival and section renders are linked in the story map.' : 'V7 proposed annual-care offer and the inhabited-room scene brief. No operating service or observed outcomes asserted.'
  });
  window.DESIGNX_SLIDES = story.map(item => {
    const slide = item.learningQuestions ? { ...prior[item.baseSlide - 1], ...window.DESIGNX_V8_LEARNING_QUESTIONS } : item.baseSlide === 1 ? window.DESIGNX_V8_PROBLEM(prior[item.baseSlide - 1]) : item.baseSlide === 12 ? window.DESIGNX_V8_CUSTOMERS(prior[item.baseSlide - 1]) : item.engine ? { ...prior[item.baseSlide - 1], ...window.DESIGNX_V8_ENGINE } : item.baseSlide === 14 ? { ...prior[item.baseSlide - 1], ...window.DESIGNX_V8_REFERENCE } : item.baseSlide ? prior[item.baseSlide - 1] : newDrawing(item);
    const template = document.createElement('template'); template.innerHTML = slide.html;
    if (item.baseSlide === 6 && !item.engine) template.innerHTML = window.DESIGNX_V8_COMPUTATION.html;
    const content = template.content;
    content.querySelectorAll('a[href="https://www.bowerbuild.org/designx/v7"]').forEach(link => { link.href = 'v8/'; link.textContent = 'Bower · Edition 08 ↗'; });
    if (item.baseSlide === 4) {
      const mode = item.growthMode || 'time';
      const image = mode === 'time' ? 'v8/assets/approach-ink/approach-ink-16x9.jpg' : mode === 'light' ? 'v8/assets/light-establishment/frames/light-18.webp' : 'pieces/04-plants-make-space-timber/frames/space-07.webp';
      const staticImage = mode === 'light'
        ? `<div class="v8-light-print-panels">${[0,1,2].map(i => `<div style="--panel:${i}"><img src="${image}" alt="${['Installation','Establishing','Mature'][i]} at midsummer noon"></div>`).join('')}</div>`
        : `<img src="${image}" alt="${esc(item.title)}: established summer scenario">${mode === 'time' ? '<div class="v8-print-occupants" aria-label="Authored ghost inhabitants"><span></span><span></span></div>' : ''}`;
      template.innerHTML = `<section class="v7-scene v8-growth-scene v8-growth-${mode}"><h2 class="v7-title">${esc(item.title)}</h2><div class="v8-growth-slot"><div class="v8-growth-print">${staticImage}${mode === 'light' ? '<div class="v8-print-stages"><span>At installation</span><span>Establishing</span><span>Mature</span></div>' : ''}</div><div class="v8-study-host slide-interaction" data-v8-study="growth" data-growth-mode="${mode}" aria-label="${esc(item.title)}"></div></div><p class="v8-growth-print-status">Pre-rendered growth scenario on provisional assumptions. Authored occupation; no measured outcomes.</p></section>`;
    }
    if (item.timeExperiment) template.innerHTML = window.DESIGNX_V8_TIME_EXPERIMENT.html;
    if (item.baseSlide === 5) {
      const slot = content.querySelector('.v7-anatomy-drawing'); slot.classList.add('v8-pier-slot');
      slot.insertAdjacentHTML('beforeend', `<div class="v8-pier-example"><div class="v8-study-poster">${poster('pier-original.webp','The original six-bay pier arrangement.','Original pier')}${poster('pier-opened.webp','The same room with the pier legs opened.','Opened pier')}</div><button type="button" class="v8-open-study slide-interaction" data-v8-open="pier">Explore the pier study ↗</button></div>`);
      slot.querySelector('.v7-drawing-note').hidden = true;
      content.querySelector('.v7-status').textContent = 'The existing pier study connects planting conditions and entrance clearance. Provisional light model; ground integration is the next drawing.';
    }
    return { ...slide, title:item.title, theme:item.baseSlide === 4 ? item.theme : slide.theme, act:chapter(item.number), comparisonIndex:item.baseSlide ? item.baseSlide - 1 : item.theme === 'v8-ground-slide' ? 3 : 12,
      source:item.baseSlide === 6 && !item.engine ? 'Inhabited-room export, authored by the scene study: manifest.json, fixed views, layer masks, stable anchors and quantities from configuration geometry. The browser recomputes nothing. Footing proposals remain unengineered.' : slide.source,
      notes: `${item.baseSlide === 6 && !item.engine ? 'Follow one change through plant support, entry, making and designer review. Baseline and opened-pier views, quantities and unresolved checks come from the coordinated inhabited-room handoff. Their threshold widths are measured from digital timber geometry, not a built Bower. The scene study owns these alternatives. This drawing selects existing results and explains consequences; it is not a live design evaluator. Fabricatability remains in development, integrated plantability and calibrated cost checks remain proposed, and the designer is responsible for reconciling the trade-offs.' : item.baseSlide === 11 && !item.learningQuestions ? "This one drawing consolidates the shared-model, project-cycle and learning-system explanations. Begin with Growing: the support route is a design hypothesis; a built Bower would let us observe establishment, clearance and the tending required; evidence review would investigate those outcomes before changing support spacing or a care plan. The same process can be explored through Making, where a member is compared with its target, or Cost, where quantities and scoped quotes are compared with actual production effort. Designing each Bower and Making and living with it identify phases of a project. They do not describe software maturity. Digital geometry and growth studies already support design iteration. Integrated checks, calibrated cost evaluation and physical feedback remain in development. No field observations are reported here. The first Bower could provide both a place prospective clients can visit and evidence that improves future designs; those are distinct uses of the same project." : slide.notes}<br><br><strong>Story connection</strong><br>${esc(item.purpose)}<br><br><strong>Continue to the next slide</strong><br>${esc(item.transition)}<br><br><strong>Drawing plan</strong><br>${esc(item.drawing)}<br><br><strong>Evidence status</strong><br>${esc(item.status)}`,
      html:template.innerHTML };
  });
  window.DESIGNX_META = Object.freeze({...window.DESIGNX_META,edition:8,targetSlideCount:22,exportReady:false,status:'integrated-working-draft'});

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
    const growths = [...root.querySelectorAll('[data-v8-study="growth"]')].map(host => ({host,home:host.parentElement,slide:host.closest('.slide'),controller:null,kind:'growth'}));
    const pierHost = document.createElement('div'); pierHost.className = 'v8-study-host'; pierHost.dataset.v8Study = 'pier';
    const pier = {host:pierHost,home:null,slide:anatomy.closest('.slide'),controller:null,kind:'pier'};
    const dialog = document.createElement('dialog'); dialog.className = 'v8-study-dialog'; dialog.setAttribute('aria-labelledby','v8-study-title');
    dialog.innerHTML = '<header><h2 id="v8-study-title"></h2><button type="button">Return to slide ×</button></header><div class="v8-dialog-surface"></div><p class="v8-dialog-status"></p>';
    document.body.append(dialog);
    let current = null, expanded = null, returnButton = null, beforePrinting = false;
    const mount = record => {
      if (record.controller) return;
      record.controller = record.kind === 'growth' ? window.DESIGNX_V8_GROWTH.mount(record.host) : window.DESIGNX_V8_STUDIES.mount(record.host,record.kind);
      record.host.v8Controller = record.controller;
      record.host.classList.add('v8-mounted');
      if (record.kind === 'growth') record.home.querySelector('.v8-growth-print').setAttribute('aria-hidden','true');
    };
    const active = () => {
      const visible = !document.hidden && !beforePrinting;
      for (const record of growths) {
        const grow = visible && current === record.slide && !expanded;
        if (grow) mount(record);
        record.controller?.setActive(grow);
      }
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
    growths.forEach(record => {
      record.host.addEventListener('keydown',event => event.stopPropagation());
      record.host.addEventListener('wheel',event => event.stopPropagation(),{passive:true});
    });
    root.querySelectorAll('[data-v8-open]').forEach(button => button.addEventListener('click',() => {
      const record = pier;
      expanded = record; returnButton = button;
      dialog.querySelector('h2').textContent = 'The pier opens';
      dialog.querySelector('.v8-dialog-status').textContent = 'Existing design study. Opening the pier changes planting conditions and narrows the entrance. Provisional light model.';
      move(record,dialog.querySelector('.v8-dialog-surface')); mount(record); dialog.showModal(); active();
    }));
    document.addEventListener('designx:slidechange',event => {
      if (expanded && expanded.slide !== event.detail.element) { dialog.close(); restore(); }
      current = event.detail.element; active();
    });
    document.addEventListener('visibilitychange',active);
    window.addEventListener('beforeprint',() => { beforePrinting = true; if (dialog.open) { dialog.close(); restore(); } active(); });
    window.addEventListener('afterprint',() => { beforePrinting = false; active(); });
  });
})();
