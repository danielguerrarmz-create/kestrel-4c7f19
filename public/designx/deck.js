/* Standalone presentation. No framework, analytics, network API or external font. */
(() => {
  'use strict';
  const slides = window.DESIGNX_SLIDES;
  const deck = document.getElementById('deck');
  const printMode = new URLSearchParams(location.search).get('print') === '1';
  document.body.classList.toggle('print-mode', printMode);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  deck.innerHTML = slides.map((slide, i) => `<article class="slide ${slide.theme || ''}" id="slide-${String(i + 1).padStart(2, '0')}" data-slide="${i + 1}" aria-label="${i + 1}. ${slide.title.replace(/"/g, '&quot;')}" aria-roledescription="slide">${slide.html}<span class="folio" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span></article>`).join('');
  const pages = Array.from(deck.querySelectorAll('.slide'));
  (window.DESIGNX_MOUNTS || []).forEach(mount => mount(deck));
  if (location.protocol === 'file:') document.getElementById('pdf-link').href = 'downloads/Bower_DesignX_Buildings_That_Grow.pdf';
  const parseHash = () => Math.min(slides.length - 1, Math.max(0, Number(location.hash.match(/^#slide-(\d{1,2})$/)?.[1] || 1) - 1));
  let current = parseHash();
  const indexDialog = document.getElementById('slide-index');
  const notesDialog = document.getElementById('speaker-notes');
  const indexGrid = document.getElementById('index-grid');
  indexGrid.innerHTML = slides.map((slide, i) => `<button data-go="${i}" class="index-item"><span>${String(i + 1).padStart(2, '0')}</span><strong>${slide.title}</strong><small>${slide.act}</small></button>`).join('');

  function preload(index) {
    const target = pages[index];
    if (!target) return;
    target.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
  }
  function updateNotes() {
    const slide = slides[current];
    document.getElementById('notes-content').innerHTML = `<p class="notes-eyebrow">${String(current + 1).padStart(2, '0')} / ${slide.act}</p><h3>${slide.title}</h3><p>${slide.notes}</p><p class="notes-source">${slide.source}</p>`;
  }
  function show(index, updateHash = true) {
    current = Math.min(slides.length - 1, Math.max(0, index));
    pages.forEach((page, i) => {
      const active = printMode || i === current;
      page.classList.toggle('is-active', active);
      page.setAttribute('aria-hidden', String(!active));
      page.inert = !active;
      if (!active) page.querySelectorAll('video').forEach(video => video.pause());
    });
    if (updateHash && !printMode) {
      // Use the document URL, not <base>; file:// must retain index.html.
      const slideUrl = new URL(location.href);
      slideUrl.hash = `slide-${String(current + 1).padStart(2, '0')}`;
      history.replaceState(null, '', slideUrl.href);
    }
    document.getElementById('slide-counter').innerHTML = `${String(current + 1).padStart(2, '0')} <span>/ ${slides.length}</span>`;
    document.getElementById('current-act').textContent = slides[current].act;
    document.getElementById('prev-slide').disabled = current === 0;
    document.getElementById('next-slide').disabled = current === slides.length - 1;
    document.getElementById('progress-fill').style.width = `${(current + 1) / slides.length * 100}%`;
    document.getElementById('slide-announcement').textContent = `Slide ${current + 1} of ${slides.length}: ${slides[current].title}`;
    indexGrid.querySelectorAll('[data-go]').forEach((button, i) => button.setAttribute('aria-current', i === current ? 'page' : 'false'));
    preload(current); preload(current + 1);
    updateNotes();
    document.dispatchEvent(new CustomEvent('designx:slidechange', { detail: { index: current, element: pages[current], printMode, reducedMotion: reducedMotion.matches } }));
  }
  function fit() {
    if (printMode) return;
    const compact = innerWidth < 650;
    const safeHeight = innerHeight - (document.fullscreenElement ? 38 : compact ? 104 : 112);
    const scale = Math.min((innerWidth - (compact ? 12 : 48)) / 1600, safeHeight / 900);
    deck.style.setProperty('--deck-scale', Math.max(.1, scale));
  }
  document.getElementById('prev-slide').addEventListener('click', () => show(current - 1));
  document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); deck.focus(); });
  document.getElementById('next-slide').addEventListener('click', () => show(current + 1));
  document.getElementById('open-index').addEventListener('click', () => indexDialog.showModal());
  document.getElementById('show-notes').addEventListener('click', () => { updateNotes(); notesDialog.showModal(); });
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.closeDialog).close()));
  indexGrid.addEventListener('click', event => {
    const button = event.target.closest('[data-go]');
    if (!button) return;
    show(Number(button.dataset.go)); indexDialog.close();
  });
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { document.getElementById('slide-announcement').textContent = 'Fullscreen is not available in this browser. The presentation remains usable in this window.'; }
  }
  document.getElementById('fullscreen').addEventListener('click', fullscreen);
  document.addEventListener('fullscreenchange', () => { fit(); document.getElementById('fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen'); });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || printMode || indexDialog.open || notesDialog.open) return;
    if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || (event.key === ' ' && event.target === document.body)) { event.preventDefault(); show(current + 1); }
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); show(current - 1); }
    else if (event.key === 'Home') { event.preventDefault(); show(0); }
    else if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
    else if (event.key.toLowerCase() === 'g') indexDialog.showModal();
    else if (event.key.toLowerCase() === 'n') { updateNotes(); notesDialog.showModal(); }
    else if (event.key.toLowerCase() === 'f') fullscreen();
  });
  let touchStart;
  deck.addEventListener('touchstart', event => { if (!event.target.closest('button,input,a')) touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; }, { passive: true });
  deck.addEventListener('touchend', event => {
    if (!touchStart || printMode) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) show(current + (dx < 0 ? 1 : -1));
    touchStart = undefined;
  }, { passive: true });
  deck.addEventListener('click', event => {
    const stage = event.target.closest('[data-growth-stage]');
    if (stage) {
      const slide = stage.closest('.slide');
      slide.dataset.growth = stage.dataset.growthStage;
      slide.querySelectorAll('[data-growth-stage]').forEach(button => button.setAttribute('aria-pressed', String(button === stage)));
    }
    const layer = event.target.closest('[data-layer]');
    if (layer) {
      const slide = layer.closest('.slide');
      slide.dataset.layer = layer.dataset.layer;
      slide.querySelectorAll('[data-layer]').forEach(button => button.setAttribute('aria-pressed', String(button === layer)));
    }
    const play = event.target.closest('[data-trace]');
    if (play) {
      const slide = play.closest('.slide');
      const on = !slide.classList.contains('flow-on');
      slide.classList.toggle('flow-on', on);
      play.setAttribute('aria-pressed', String(on));
      play.textContent = on ? 'Reset sequence' : 'Trace the sequence';
    }
    const scale = event.target.closest('[data-scale]');
    if (scale) {
      const slide = scale.closest('.slide');
      slide.dataset.scale = scale.dataset.scale;
      slide.querySelectorAll('[data-scale]').forEach(button => button.setAttribute('aria-pressed', String(button === scale)));
    }
  });
  addEventListener('hashchange', () => show(parseHash(), false));
  addEventListener('resize', fit);
  reducedMotion.addEventListener('change', () => {
    document.body.classList.toggle('reduced-motion', reducedMotion.matches);
    document.dispatchEvent(new CustomEvent('designx:motionchange', { detail: { reducedMotion: reducedMotion.matches } }));
  });
  document.body.classList.toggle('reduced-motion', reducedMotion.matches);
  show(current, false); fit();
  if (printMode) pages.forEach((_, i) => preload(i));
  window.DESIGNX_READY = Promise.all([
    document.fonts.ready,
    ...Array.from(deck.querySelectorAll('img')).filter(img => printMode || img.closest('.is-active')).map(img => img.decode().catch(() => { img.dataset.failed = 'true'; }))
  ]).then(() => { document.body.dataset.ready = 'true'; });
  window.DESIGNX = Object.freeze({ count: slides.length, goTo: number => show(number - 1), get current() { return current + 1; } });
})();
