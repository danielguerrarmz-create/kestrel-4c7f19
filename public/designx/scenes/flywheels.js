/* Authored SVG/HTML flywheels. No runtime or network dependencies. */
(() => {
  'use strict';
  const technical = [
    ['Design', 'A form becomes a set of decisions.', 'Geometry, material and planting intent.'],
    ['Make', 'Decisions meet the material.', 'Parts, joints and the realities of fabrication.'],
    ['Grow', 'The building keeps changing.', 'Plants, seasons and the people who use it.'],
    ['Measure', 'Experience becomes evidence.', 'Observe the factory, the garden and the place.'],
    ['Learn', 'The next design starts further ahead.', 'Bring that evidence back into the design rules.']
  ];
  const commercial = [
    ['Commission', 'A client makes the first place possible.', 'A paid design-to-build commission.'],
    ['Bower', 'An idea becomes somewhere to be.', 'A completed place people can experience.'],
    ['Reference', 'The place makes the proposition tangible.', 'A project to visit, share and learn from.'],
    ['Demand', 'The next client can see the possibility.', 'A stronger starting point for the next conversation.'],
    ['Reinvest', 'Projects help build capability.', 'Resources for better tools and future commissions.']
  ];
  const polar = (angle, radius = 280) => {
    const radians = angle * Math.PI / 180;
    return [450 + radius * Math.cos(radians), 330 + radius * Math.sin(radians)];
  };
  const arc = (from, to) => {
    const a = polar(from), b = polar(to);
    return `M ${a[0]} ${a[1]} A280 280 0 0 1 ${b[0]} ${b[1]}`;
  };
  const running = (act, topic) => `<div class="fw-running"><span>BOWER</span><span>${act} / ${topic}</span></div>`;
  function wheel(kind) {
    const isTechnical = kind === 'technical';
    const stages = isTechnical ? technical : commercial;
    const title = isTechnical ? 'Every Bower<br>teaches the next.' : 'Build one.<br>Inspire many.';
    const hub = isTechnical
      ? '<img class="fw-hub-model" src="assets/model-one.webp" alt="Bower One digital model" loading="lazy"><span class="fw-hub-label">THE NEXT BOWER</span>'
      : '<img class="fw-hub-place" src="assets/cover.webp" alt="Planted Bower architectural concept" loading="lazy"><span class="fw-hub-label">THE BOWER / CONCEPT</span>';
    return `<section class="flywheel-scene fw-${kind}" data-flywheel="${kind}" data-fw-phase="0" data-fw-playing="false">
      ${running(isTechnical ? 'II' : 'IV', isTechnical ? 'The invention' : 'The compounding system')}
      <header class="fw-intro"><p class="fw-eyebrow">${isTechnical ? 'The technical flywheel' : 'The commercial flywheel'}</p><h2>${title}</h2></header>
      <div class="fw-readout" aria-live="polite" aria-atomic="true"><p class="fw-stage"><span data-fw-number>01</span><span data-fw-label>${stages[0][0]}</span></p><h3 data-fw-outcome>${stages[0][1]}</h3><p class="fw-detail" data-fw-detail>${stages[0][2]}</p></div>
      <div class="fw-orbit" role="group" aria-label="Explore the ${kind} flywheel">
        <svg class="fw-orbit-lines" viewBox="0 0 900 690" aria-hidden="true">
          <circle class="fw-guide" cx="450" cy="330" r="280"/>
          <circle class="fw-inner-guide" cx="450" cy="330" r="224"/>
          ${stages.map((_, i) => `<path class="fw-segment" data-fw-segment="${i}" pathLength="1" d="${arc(-90 + i * 72 + 12, -90 + (i + 1) * 72 - 12)}"/>`).join('')}
          ${stages.map((_, i) => { const p = polar(-90 + i * 72 + 59); return `<path class="fw-arrow" data-fw-arrow="${i}" d="M-5-6L2 0L-5 6" transform="translate(${p.join(' ')}) rotate(${-90 + i * 72 + 59 + 90})"/>`; }).join('')}
        </svg>
        <div class="fw-hub">${hub}</div>
        ${stages.map(([label], i) => { const [x,y] = polar(-90 + i * 72); return `<button class="fw-node" type="button" data-fw-step="${i}" aria-pressed="${i === 0}" style="left:${x}px;top:${y}px"><span class="fw-node-dot"><span>${String(i + 1).padStart(2, '0')}</span></span><span class="fw-node-label">${label}</span></button>`; }).join('')}
      </div>
      <div class="fw-playback slide-interaction"><button type="button" data-fw-play aria-label="Play ${kind} flywheel">Play the cycle <span aria-hidden="true">↗</span></button><button type="button" data-fw-reset aria-label="Replay ${kind} flywheel">Replay</button><span class="fw-play-hint">or choose a stage</span></div>
      <p class="fw-static-summary">${isTechnical ? 'Design → Make → Grow → Measure → Learn → better design.' : 'Commission → Bower → Reference → Demand → Reinvestment.'}</p>
      <p class="fw-qualification">${isTechnical ? 'Intended learning system. Factory and garden measurement are not yet deployed.' : 'Intended commercial model. Reinvestment depends on project economics and finance.'}</p>
    </section>`;
  }
  function coupled() {
    return `<section class="flywheel-scene fw-coupled" data-coupled data-coupling="0" style="--coupling:0">
      ${running('IV', 'The compounding system')}
      <header class="fw-coupled-title"><p class="fw-eyebrow">The two systems, together</p><h2>Make it compound.</h2></header>
      <div class="fw-coupled-system fw-system-technical"><svg viewBox="0 0 490 490" aria-hidden="true"><circle class="fw-system-orbit" cx="245" cy="245" r="199"/><path class="fw-system-arc" d="M245 46A199 199 0 0 1 444 245"/><path class="fw-system-arc second" d="M245 444A199 199 0 0 1 46 245"/></svg><p class="fw-system-kicker">TECHNICAL</p><h3>Learn<br>from making.</h3><span class="fw-system-label north">Design</span><span class="fw-system-label east">Make</span><span class="fw-system-label south">Grow · Measure</span><span class="fw-system-label west">Learn</span></div>
      <div class="fw-coupled-system fw-system-commercial"><svg viewBox="0 0 490 490" aria-hidden="true"><circle class="fw-system-orbit" cx="245" cy="245" r="199"/><path class="fw-system-arc" d="M245 46A199 199 0 0 1 444 245"/><path class="fw-system-arc second" d="M245 444A199 199 0 0 1 46 245"/></svg><p class="fw-system-kicker">COMMERCIAL</p><h3>Make more<br>possible.</h3><span class="fw-system-label north">Commission</span><span class="fw-system-label east">Reference</span><span class="fw-system-label south">Demand</span><span class="fw-system-label west">Reinvest</span></div>
      <svg class="fw-bridges" viewBox="0 0 1600 900" aria-hidden="true"><defs><marker id="fw-gold-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="#ad8040"/></marker><marker id="fw-green-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="#365c42"/></marker></defs><path class="fw-bridge-resources" pathLength="1" d="M1110 319C1030 228 570 228 490 319" marker-end="url(#fw-gold-arrow)"/><path class="fw-bridge-quality" pathLength="1" d="M490 691C570 782 1030 782 1110 691" marker-end="url(#fw-green-arrow)"/></svg>
      <p class="fw-bridge-label fw-bridge-label-top">PROJECTS + RESOURCES</p><p class="fw-bridge-label fw-bridge-label-bottom">QUALITY + BUILDABILITY</p>
      <div class="fw-coupled-hub"><img src="assets/model-three.webp" alt="Bower Three digital architectural model" loading="lazy"><span>ONE ARCHITECTURAL PRODUCT</span></div>
      <div class="fw-coupling-control slide-interaction"><label for="fw-coupling">Connect the systems</label><input id="fw-coupling" type="range" min="0" max="100" value="0" step="1" aria-valuetext="Separate systems"><button type="button" data-couple-toggle>Bring them together <span aria-hidden="true">↗</span></button></div>
      <p class="fw-coupling-caption" aria-live="polite">Two capabilities. One ambition.</p>
      <p class="fw-coupled-static">Projects support learning. Learning improves projects.</p>
      <p class="fw-qualification">Intended operating model. The Bower connects the research and the business.</p>
    </section>`;
  }
  window.DESIGNX_SCENES = Object.assign(window.DESIGNX_SCENES || {}, { technical: () => wheel('technical'), commercial: () => wheel('commercial'), coupled });
  window.DESIGNX_MOUNTS = window.DESIGNX_MOUNTS || [];
  window.DESIGNX_MOUNTS.push(root => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const isPrint = () => document.body.classList.contains('print-mode') || matchMedia('print').matches;
    const controllers = [];
    root.querySelectorAll('[data-flywheel]').forEach(scene => {
      const stages = scene.dataset.flywheel === 'technical' ? technical : commercial;
      const play = scene.querySelector('[data-fw-play]');
      let index = 0, timer, playing = false;
      const pause = () => {
        clearTimeout(timer); timer = undefined; playing = false;
        scene.dataset.fwPlaying = 'false';
        play.innerHTML = `${index === 5 ? 'Play again' : 'Play the cycle'} <span aria-hidden="true">↗</span>`;
        play.setAttribute('aria-label', `Play ${scene.dataset.flywheel} flywheel`);
      };
      const set = (next, announce = true) => {
        index = Math.max(0, Math.min(5, next)); scene.dataset.fwPhase = String(index);
        scene.querySelectorAll('[data-fw-step]').forEach((node, i) => {
          node.setAttribute('aria-pressed', String(i === index));
          node.classList.toggle('is-visited', i < index);
        });
        scene.querySelectorAll('[data-fw-segment]').forEach((segment, i) => segment.classList.toggle('is-complete', i < index));
        scene.querySelectorAll('[data-fw-arrow]').forEach((arrow, i) => arrow.classList.toggle('is-complete', i < index));
        scene.querySelector('[data-fw-number]').textContent = index === 5 ? '↻' : String(index + 1).padStart(2, '0');
        scene.querySelector('[data-fw-label]').textContent = index === 5 ? 'The next cycle' : stages[index][0];
        scene.querySelector('[data-fw-outcome]').textContent = index === 5 ? (scene.dataset.flywheel === 'technical' ? 'A better starting point. Every time.' : 'The next place starts with more behind it.') : stages[index][1];
        scene.querySelector('[data-fw-detail]').textContent = index === 5 ? (scene.dataset.flywheel === 'technical' ? 'What the last Bower teaches the next.' : 'Experience, references and stronger capability.') : stages[index][2];
        if (!announce) scene.querySelector('.fw-readout').setAttribute('aria-live', 'off');
        else scene.querySelector('.fw-readout').setAttribute('aria-live', 'polite');
      };
      const tick = () => {
        if (!playing) return;
        if (!scene.closest('.slide').classList.contains('is-active') || document.hidden || media.matches || isPrint()) { pause(); return; }
        set(index + 1);
        if (index === 5) pause(); else timer = setTimeout(tick, 2300);
      };
      const start = () => {
        pause();
        if (media.matches || isPrint()) { set(5); return; }
        if (index === 5) set(0);
        playing = true; scene.dataset.fwPlaying = 'true'; play.textContent = 'Pause the cycle';
        play.setAttribute('aria-label', `Pause ${scene.dataset.flywheel} flywheel`);
        timer = setTimeout(tick, 1800);
      };
      scene.querySelectorAll('[data-fw-step]').forEach(button => button.addEventListener('click', () => { pause(); set(Number(button.dataset.fwStep)); }));
      play.addEventListener('click', () => playing ? pause() : start());
      scene.querySelector('[data-fw-reset]').addEventListener('click', () => { pause(); set(0); start(); });
      scene.addEventListener('keydown', event => {
        if (event.target.closest('button') && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault(); event.stopPropagation(); pause();
          set(event.key === 'Home' ? 0 : event.key === 'End' ? 5 : index + (event.key === 'ArrowRight' ? 1 : -1));
          scene.querySelector(`[data-fw-step="${Math.min(index, 4)}"]`).focus();
        }
      });
      const sync = () => {
        if (isPrint() || media.matches) { pause(); set(5, false); }
        else if (!scene.closest('.slide').classList.contains('is-active')) pause();
      };
      set(media.matches || isPrint() ? 5 : 0, false);
      controllers.push({ pause, sync });
    });
    root.querySelectorAll('[data-coupled]').forEach(scene => {
      const range = scene.querySelector('input'), toggle = scene.querySelector('[data-couple-toggle]');
      let frame, value = 0;
      const set = next => {
        value = Math.max(0, Math.min(100, next));
        scene.dataset.coupling = String(Math.round(value));
        scene.style.setProperty('--coupling', value / 100);
        range.value = String(Math.round(value));
        range.setAttribute('aria-valuetext', value < 25 ? 'Separate systems' : value < 75 ? 'Systems connecting' : 'Connected systems');
        toggle.innerHTML = value < 75 ? 'Bring them together <span aria-hidden="true">↗</span>' : 'Separate the systems';
        scene.querySelector('.fw-coupling-caption').textContent = value < 25 ? 'Two capabilities. One ambition.' : value < 75 ? 'Projects create the conditions for learning.' : 'Projects support learning. Learning improves projects.';
      };
      const pause = () => { if (frame) cancelAnimationFrame(frame); frame = undefined; };
      range.addEventListener('input', () => { pause(); set(Number(range.value)); });
      range.addEventListener('keydown', event => event.stopPropagation());
      toggle.addEventListener('click', () => {
        pause();
        const target = value < 75 ? 100 : 0, from = value;
        if (media.matches) { set(target); return; }
        const start = performance.now();
        const animate = now => {
          const fraction = Math.min(1, (now - start) / 1700), eased = fraction * fraction * (3 - 2 * fraction);
          set(from + (target - from) * eased);
          if (fraction < 1 && scene.closest('.slide').classList.contains('is-active') && !document.hidden) frame = requestAnimationFrame(animate);
          else frame = undefined;
        };
        frame = requestAnimationFrame(animate);
      });
      const sync = () => {
        if (isPrint() || media.matches) { pause(); set(100); }
        else if (!scene.closest('.slide').classList.contains('is-active')) pause();
      };
      set(media.matches || isPrint() ? 100 : 0);
      controllers.push({ pause, sync });
    });
    const sync = () => controllers.forEach(controller => controller.sync());
    document.addEventListener('designx:slidechange', sync);
    document.addEventListener('designx:motionchange', sync);
    media.addEventListener('change', sync);
    addEventListener('beforeprint', sync);
    document.addEventListener('visibilitychange', () => { if (document.hidden) controllers.forEach(controller => controller.pause()); });
    sync();
  });
})();
