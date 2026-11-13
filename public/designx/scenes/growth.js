/* A camera-locked image study. These are illustrative states, not simulation data. */
(() => {
  'use strict';
  const states = [
    { file: 'growth-structure.webp', title: 'Structure', caption: 'A room from the beginning.' },
    { file: 'growth-establishment.webp', title: 'Establishment', caption: 'The plants find their place.' },
    { file: 'growth-maturity.webp', title: 'Maturity', caption: 'The garden transforms the room.' },
  ];
  const image = (state, extra = '') => `<img src="assets/${state.file}" alt="${state.title}: an illustrative future planting state of the same Bower." decoding="async" ${extra}>`;
  const scenes = window.DESIGNX_SCENES ||= {};

  scenes.growth = () => `<section class="time-scene" data-time-progress="0" data-time-playing="false" aria-label="Explore the Bower through three illustrative growth states">
    <div class="time-cinema" aria-hidden="true">${states.map((state, i) => `<div class="time-frame" data-time-frame="${i}" style="opacity:${i === 0 ? 1 : 0}">${image(state)}</div>`).join('')}</div>
    <div class="time-shade" aria-hidden="true"></div>
    <div class="time-running"><span>BOWER</span><span>I / The proposition</span></div>
    <header class="time-heading"><p>Architecture, over time.</p><h2>Time is a<br>building material.</h2></header>
    <aside class="time-sticky" aria-label="Artwork to add"><span>To add</span><p>Clay’s plant-growth<br>simulation.</p></aside>
    <div class="time-controls slide-interaction">
      <div class="time-control-heading"><p class="time-stage-title" data-time-title>Structure</p><p class="time-stage-caption" data-time-caption>A room from the beginning.</p><span class="time-instruction">Drag to explore time</span></div>
      <div class="time-scrub-row"><button class="time-play" data-time-play aria-label="Play growth sequence" aria-pressed="false"><svg class="time-play-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5L19 12L8 19Z"/></svg><svg class="time-pause-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5H10V19H7ZM14 5H17V19H14Z"/></svg></button><input data-time-scrub type="range" min="0" max="100" step="1" value="0" aria-label="Explore growth from structure to maturity" aria-valuetext="Structure"><span class="time-scrub-end" aria-hidden="true">↗</span></div>
      <div class="time-stage-stops">${states.map((state, i) => `<button data-time-step="${i * 50}" aria-pressed="${i === 0}"><span>0${i + 1}</span>${state.title}</button>`).join('')}</div>
    </div>
    <div class="time-print-sequence">${states.map((state, i) => `<figure>${image(state)}<figcaption><span>0${i + 1}</span><h3>${state.title}</h3><p>${state.caption}</p></figcaption></figure>`).join('')}</div>
    <p class="time-source">Illustrative growth states</p>
    <p class="sr-only" data-time-announcement aria-live="polite" aria-atomic="true"></p>
  </section>`;

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    root.querySelectorAll('.time-scene').forEach(scene => {
      if (scene.dataset.timeMounted) return;
      scene.dataset.timeMounted = 'true';
      const slide = scene.closest('.slide');
      const scrub = scene.querySelector('[data-time-scrub]');
      const play = scene.querySelector('[data-time-play]');
      const title = scene.querySelector('[data-time-title]');
      const caption = scene.querySelector('[data-time-caption]');
      const announcement = scene.querySelector('[data-time-announcement]');
      const frames = [...scene.querySelectorAll('[data-time-frame]')];
      const stops = [...scene.querySelectorAll('[data-time-step]')];
      let progress = 0;
      let playing = false;
      let activated = false;
      let animation = 0;
      let lastTime = null;
      let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const printMode = document.body.classList.contains('print-mode');
      const clamp = value => Math.max(0, Math.min(1, value));

      function render(value, announce = false) {
        progress = Math.max(0, Math.min(100, value));
        scene.dataset.timeProgress = progress.toFixed(2);
        scrub.value = String(progress);
        scrub.style.setProperty('--time-progress', `${progress}%`);
        frames[0].style.opacity = '1';
        frames[1].style.opacity = String(clamp(progress / 50));
        frames[2].style.opacity = String(clamp((progress - 50) / 50));
        const stateIndex = progress < 25 ? 0 : progress < 75 ? 1 : 2;
        const state = states[stateIndex];
        title.textContent = state.title;
        caption.textContent = state.caption;
        const valueText = progress === 0 ? 'Structure' : progress === 50 ? 'Establishment' : progress === 100 ? 'Maturity' : progress < 50 ? 'Between structure and establishment' : 'Between establishment and maturity';
        scrub.setAttribute('aria-valuetext', valueText);
        stops.forEach((button, i) => button.setAttribute('aria-pressed', String(i === stateIndex)));
        if (announce) announcement.textContent = valueText;
      }

      function pause() {
        playing = false;
        lastTime = null;
        cancelAnimationFrame(animation);
        scene.dataset.timePlaying = 'false';
        play.setAttribute('aria-label', reduced ? 'Show next growth state' : 'Play growth sequence');
        play.setAttribute('aria-pressed', 'false');
      }

      function tick(time) {
        if (!playing || !slide.classList.contains('is-active') || document.hidden) { pause(); return; }
        if (lastTime !== null) render(progress + Math.min(time - lastTime, 100) / 120);
        lastTime = time;
        if (progress >= 100) { pause(); announcement.textContent = 'Maturity. Growth sequence complete.'; return; }
        animation = requestAnimationFrame(tick);
      }

      function start() {
        if (printMode || document.hidden || !slide.classList.contains('is-active')) return;
        if (reduced) {
          const next = progress < 50 ? 50 : progress < 100 ? 100 : 0;
          render(next, true);
          return;
        }
        if (progress >= 100) render(0);
        playing = true;
        scene.dataset.timePlaying = 'true';
        play.setAttribute('aria-label', 'Pause growth sequence');
        play.setAttribute('aria-pressed', 'true');
        lastTime = null;
        animation = requestAnimationFrame(tick);
      }

      play.addEventListener('click', () => playing ? pause() : start());
      scrub.addEventListener('input', () => { pause(); render(Number(scrub.value)); });
      scrub.addEventListener('change', () => render(Number(scrub.value), true));
      scrub.addEventListener('keydown', event => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) event.stopPropagation();
      });
      stops.forEach(button => button.addEventListener('click', () => { pause(); render(Number(button.dataset.timeStep), true); }));
      document.addEventListener('designx:slidechange', event => {
        const isCurrent = event.detail.element === slide && !event.detail.printMode;
        if (!isCurrent) { pause(); return; }
        reduced = Boolean(event.detail.reducedMotion);
        if (!activated) {
          activated = true;
          if (!reduced) start();
        }
      });
      document.addEventListener('designx:motionchange', () => {
        reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) pause();
        play.setAttribute('aria-label', reduced ? 'Show next growth state' : 'Play growth sequence');
      });
      document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
      window.addEventListener('beforeprint', pause);
      render(0);
      if (reduced) play.setAttribute('aria-label', 'Show next growth state');
    });
  });
})();
