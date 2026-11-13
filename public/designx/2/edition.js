/* Edition 02 shares the story and scene engines; its presentation controls are local. */
(() => {
  'use strict';
  const emblem = '2/assets/bower-emblem.svg';
  document.querySelector('[data-brand-emblem]').src = emblem;
  const originalLink = document.querySelector('.version-link');
  if (location.protocol === 'file:') originalLink.href = new URL('../index.html', location.href).href;
  const editionUrl = location.protocol === 'file:' ? location.href.split('#')[0] : 'https://www.bowerbuild.org/designx/2';
  window.DESIGNX_SLIDES = window.DESIGNX_SLIDES.map(slide => ({
    ...slide,
    html: slide.html
      .replaceAll('<span class="wordmark">bower</span>', `<span class="wordmark"><img class="brand-emblem" src="${emblem}" alt="">bower</span>`)
      .replaceAll('href="https://www.bowerbuild.org/designx"', `href="${editionUrl}"`)
      .replaceAll('bowerbuild.org/designx <', 'bowerbuild.org/designx/2 <'),
  }));

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const printMode = new URLSearchParams(location.search).get('print') === '1';
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const hint = document.getElementById('v2-scroll-hint');
    const growth = root.querySelector('[data-time-scrub]');
    const film = root.querySelector('[data-customer-film]');
    const filmFigure = film?.closest('figure');
    let wheelTotal = 0;
    let lastWheel = 0;
    let lockedUntil = 0;
    let navigationNeedsQuiet = true;
    let growthBoundaryAt = 0;
    let desiredFilmProgress = 0;
    let exploringFilm = false;

    // This stays explicit and lazy: visiting the slide does not download the movie.
    const filmControl = document.createElement('div');
    filmControl.className = 'film-explore slide-interaction';
    filmControl.innerHTML = '<label for="v2-film-position">Explore the film<span aria-hidden="true">↔</span></label><input id="v2-film-position" type="range" min="0" max="100" step="1" value="0" aria-label="Explore architectural film" aria-valuetext="Beginning"><span class="film-explore-note">Drag, or scroll over the image</span><span class="sr-only" data-film-feedback role="status"></span>';
    filmFigure?.append(filmControl);
    const filmScrub = filmControl.querySelector('input');
    const feedback = filmControl.querySelector('[data-film-feedback]');

    function applyFilmPosition() {
      if (!film || !Number.isFinite(film.duration) || film.duration <= 0) return;
      film.pause();
      film.currentTime = Math.min(film.duration - 0.04, film.duration * desiredFilmProgress / 100);
      filmScrub.setAttribute('aria-valuetext', `${Math.round(desiredFilmProgress)} percent through the concept film`);
    }
    function exploreFilm(value) {
      if (!film) return;
      exploringFilm = true;
      desiredFilmProgress = Math.max(0, Math.min(100, value));
      filmScrub.value = String(desiredFilmProgress);
      filmControl.style.setProperty('--film-progress', `${desiredFilmProgress}%`);
      if (!film.getAttribute('src')) {
        feedback.textContent = 'Loading the concept film';
        film.preload = 'auto';
        film.src = film.dataset.src;
        film.load();
      }
      applyFilmPosition();
    }
    film?.addEventListener('loadedmetadata', () => { if (exploringFilm) applyFilmPosition(); });
    const revealFrame = () => {
      if (!exploringFilm || film.readyState < 2 || film.seeking || film.error) return;
      film.classList.add('is-playing-film');
      feedback.textContent = '';
    };
    film?.addEventListener('loadeddata', revealFrame);
    film?.addEventListener('seeked', revealFrame);
    film?.addEventListener('play', () => { exploringFilm = false; });
    root.querySelector('[data-customer-play]')?.addEventListener('click', () => {
      if (film.paused && Number.isFinite(film.duration) && film.duration - film.currentTime < 0.15) film.currentTime = 0;
    }, { capture: true });
    film?.addEventListener('timeupdate', () => {
      if (exploringFilm || !Number.isFinite(film.duration) || film.duration <= 0) return;
      filmScrub.value = String(film.currentTime / film.duration * 100);
      filmScrub.setAttribute('aria-valuetext', `${Math.round(Number(filmScrub.value))} percent through the concept film`);
    });
    film?.addEventListener('error', () => {
      film.classList.remove('is-playing-film');
      feedback.textContent = 'The film could not load. Its concept image remains visible.';
    });
    filmScrub.addEventListener('input', () => exploreFilm(Number(filmScrub.value)));
    filmScrub.addEventListener('keydown', event => event.stopPropagation());

    function exploreGrowth(value) {
      growth.value = String(Math.max(0, Math.min(100, value)));
      growth.dispatchEvent(new Event('input', { bubbles: true }));
    }

    document.addEventListener('designx:slidechange', event => {
      const slide = event.detail.element;
      wheelTotal = 0;
      growthBoundaryAt = 0;
      lockedUntil = performance.now() + 650;
      navigationNeedsQuiet = true;
      // Edition 02 invites deliberate exploration. Existing Play remains available.
      if (slide.classList.contains('growth-slide')) {
        exploreGrowth(Number(growth.value));
        slide.querySelector('.time-instruction').textContent = motion.matches ? 'Drag to explore time' : 'Scroll or drag to explore time';
        hint.textContent = motion.matches ? 'Use the controls to explore · arrows to continue' : 'Scroll to explore time · arrows to continue';
      } else {
        hint.textContent = 'Scroll to explore · or use the arrows';
      }
      originalLink.hash = `slide-${String(event.detail.index + 1).padStart(2, '0')}`;
    });

    // Wheel navigation is an optional companion to keyboard, arrows, index and swipe.
    // A quiet interval plus cooldown prevents a trackpad's inertia skipping scenes.
    root.addEventListener('wheel', event => {
      if (printMode || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
      if (event.target.closest('input, button, a, select, textarea')) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      event.preventDefault();
      const now = performance.now();
      const quiet = now - lastWheel > 200;
      lastWheel = now;
      const pixels = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? innerHeight : 1);
      const delta = Math.max(-240, Math.min(240, pixels));
      if (now < lockedUntil) return;
      if (navigationNeedsQuiet) {
        if (!quiet) return;
        navigationNeedsQuiet = false;
      }
      const slide = root.querySelector('.slide.is-active');
      if (!motion.matches && slide.classList.contains('growth-slide')) {
        const before = Number(growth.value);
        const canScrub = delta > 0 ? before < 100 : before > 0;
        if (canScrub) {
          const next = Math.max(0, Math.min(100, before + delta / 16));
          exploreGrowth(next);
          growthBoundaryAt = next === 0 || next === 100 ? now : 0;
          return;
        }
        if (!quiet || now - growthBoundaryAt < 500) return;
      }
      if (!motion.matches && filmFigure?.contains(event.target)) {
        exploreFilm(Number(filmScrub.value) + delta / 12);
        return;
      }
      if (quiet || Math.sign(wheelTotal) !== Math.sign(delta)) wheelTotal = 0;
      wheelTotal += delta;
      if (Math.abs(wheelTotal) < 65) return;
      window.DESIGNX.goTo(window.DESIGNX.current + Math.sign(wheelTotal));
      wheelTotal = 0;
      lockedUntil = now + 650;
    }, { passive: false });

    document.addEventListener('designx:motionchange', () => {
      if (growth) exploreGrowth(Number(growth.value));
      if (root.querySelector('.growth-slide.is-active')) {
        root.querySelector('.time-instruction').textContent = motion.matches ? 'Drag to explore time' : 'Scroll or drag to explore time';
        hint.textContent = motion.matches ? 'Use the controls to explore · arrows to continue' : 'Scroll to explore time · arrows to continue';
      }
    });
  });
})();
