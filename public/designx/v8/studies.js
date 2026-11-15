/* Controls for existing drawing exports. These play authored frames; they do not run a design evaluator. */
(() => {
  'use strict';
  const configurations = {
    growth: { src: 'pieces/04-plants-make-space-timber/index.html?embed', title: 'One room: space, light and time' },
    pier: { src: 'pieces/shaded-at-the-pier/index.html?embed', title: 'The pier study: planting and the opening' }
  };
  const modeChapters = {
    space: [['At installation', 0], ['Established', 7]],
    light: [['Morning', 9], ['Noon', 18], ['Afternoon', 27]],
    time: [['At installation', 16], ['Summer', 26], ['Winter', 30]]
  };

  function mount(host, requestedKind) {
    const kind = requestedKind === 'seasons' ? 'growth' : requestedKind;
    const config = configurations[kind];
    if (!config) throw new Error(`Unknown drawing study: ${requestedKind}`);
    const root = document.createElement('div');
    root.className = `v8-study v8-study-${kind}`;
    root.innerHTML = `<nav class="v8-study-chapters" aria-label="Choose a moment in the drawing"></nav>
      <div class="v8-study-screen"><p class="v8-study-loading" role="status">Open this slide to explore the drawing.</p></div>
      <div class="v8-study-timeline">
        <button type="button" data-v8-study-play disabled>Play</button>
        <button type="button" data-v8-study-reset disabled>Reset</button>
        <input type="range" min="0" max="1000" step="1" value="0" aria-label="Position in drawing" disabled>
        <output class="v8-study-caption" aria-live="off"></output>
      </div>`;
    host.append(root);
    const $ = selector => root.querySelector(selector);
    const screen = $('.v8-study-screen'), loading = $('.v8-study-loading');
    const range = $('input'), output = $('output'), playButton = $('[data-v8-study-play]');
    const resetButton = $('[data-v8-study-reset]'), chapterHost = $('.v8-study-chapters');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const state = { kind, active: false, ready: false, mode: kind === 'growth' ? 'space' : null,
      time: 0, duration: kind === 'growth' ? 30 : 32, playing: !motion.matches, caption: '', error: null };
    const savedModes = new Map();
    let frame = null, raf = 0, poll = 0, deadlineTimer = 0, token = 0, last = 0, lastDraw = 0, destroyed = false;
    let chapters = [];

    function updateControls() {
      playButton.textContent = state.playing ? 'Pause' : 'Play';
      playButton.setAttribute('aria-label', state.playing ? 'Pause drawing' : 'Play drawing');
      playButton.disabled = resetButton.disabled = range.disabled = !state.ready;
      chapterHost.querySelectorAll('button').forEach((button, i) => {
        button.disabled = !state.ready;
        button.setAttribute('aria-pressed', String(Math.abs(state.time - chapters[i][1]) < .12));
      });
      range.value = String(Math.round(1000 * state.time / state.duration));
      range.setAttribute('aria-valuetext', state.caption || `${Math.round(state.time)} seconds`);
      output.textContent = state.caption;
      output.title = state.caption;
      root.dataset.mode = state.mode || kind;
      root.dataset.ready = String(state.ready);
    }

    function draw() {
      if (!state.ready || !frame) return;
      frame.contentWindow.__setT(state.time);
      state.caption = frame.contentDocument.getElementById(kind === 'pier' ? 'cap' : 'stage')?.textContent || '';
      updateControls();
    }

    function seek(time) {
      const value = Number(time);
      if (!Number.isFinite(value)) return;
      state.time = Math.max(0, Math.min(state.duration - .01, value));
      state.playing = false;
      cancelAnimationFrame(raf); raf = 0;
      draw(); updateControls();
    }

    function tick(now) {
      raf = 0;
      if (!state.active || !state.ready || !state.playing || document.hidden) return;
      state.time += Math.min(.1, Math.max(0, (now - last) / 1000)); last = now;
      if (state.time >= state.duration - .01) { state.time = state.duration - .01; state.playing = false; }
      if (now - lastDraw >= 50 || !state.playing) { draw(); lastDraw = now; }
      if (state.playing) raf = requestAnimationFrame(tick);
    }

    function startClock() {
      cancelAnimationFrame(raf); raf = 0;
      if (state.active && state.ready && state.playing && !document.hidden) {
        last = performance.now(); lastDraw = 0;
        raf = requestAnimationFrame(tick);
      }
    }

    function togglePlay() {
      if (!state.ready) return;
      if (!state.playing && state.time >= state.duration - .02) state.time = 0;
      state.playing = !state.playing;
      draw(); startClock();
    }

    function makeChapters() {
      const mode = kind === 'growth' ? frame.contentWindow.BOWER_PIECE.modes.find(item => item.id === state.mode) : null;
      // The supplied frame player holds its last image for the final 8% of each pass.
      chapters = kind === 'pier' ? [['Planted', .01], ['Shaded', 7.01], ['Piers open', 13.01], ['Grown again', 21.01]]
        : modeChapters[state.mode].map(([label, index]) => [label, index / (mode.frames.length - 1) * .92 * mode.seconds]);
      chapterHost.replaceChildren(...chapters.map(([label, time], i) => {
        const button = document.createElement('button');
        button.type = 'button'; button.textContent = label; button.dataset.v8StudyChapter = String(i);
        button.addEventListener('click', () => seek(time));
        return button;
      }));
      if (kind === 'growth' && state.mode === 'space') {
        const hint = document.createElement('span'); hint.className = 'v8-study-hint'; hint.textContent = 'Drag the drawing to turn';
        chapterHost.append(hint);
      }
      // Only the source player's unrolled Space view supports native turning.
      frame.style.pointerEvents = kind === 'growth' && state.mode === 'space' ? 'auto' : 'none';
      frame.tabIndex = kind === 'growth' && state.mode === 'space' ? 0 : -1;
    }

    function setMode(mode) {
      if (kind !== 'growth' || !Object.hasOwn(modeChapters, mode) || destroyed) return false;
      if (mode === state.mode) return true;
      savedModes.set(state.mode, { time: state.time, duration: state.duration, playing: state.playing });
      state.mode = mode;
      const saved = savedModes.get(mode);
      state.time = saved?.time ?? 0;
      state.duration = saved?.duration ?? ({ space: 30, light: 22, time: 40 }[mode]);
      state.playing = saved?.playing ?? false;
      state.caption = '';
      if (state.ready) {
        frame.contentWindow.__setMode(mode);
        state.duration = frame.contentWindow.__duration;
        makeChapters(); draw(); startClock();
      }
      updateControls();
      return true;
    }

    function stopFrame() {
      token++;
      clearTimeout(poll); clearTimeout(deadlineTimer); cancelAnimationFrame(raf); raf = poll = 0;
      frame?.remove(); frame = null; state.ready = false;
      updateControls();
    }

    function unavailable(message) {
      stopFrame(); state.error = message;
      loading.hidden = false;
      loading.replaceChildren(document.createTextNode(message + ' '));
      const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Retry drawing';
      retry.onclick = () => { if (state.active) createFrame(); };
      loading.append(retry);
    }

    function createFrame() {
      if (destroyed || !state.active) return;
      state.error = null; state.ready = false;
      loading.hidden = false; loading.textContent = 'Loading the drawing…';
      const generation = ++token;
      deadlineTimer = setTimeout(() => {
        if (generation === token && state.active) unavailable('Drawing unavailable. The static comparison remains on the slide.');
      }, 20000);
      frame = document.createElement('iframe');
      frame.title = config.title; frame.tabIndex = -1;
      frame.src = new URL(config.src + (kind === 'growth' ? `&mode=${state.mode}` : ''), document.baseURI).href;
      frame.addEventListener('load', () => {
        // A fallback DOM reparent can reload this document. Keep the parent timeline.
        if (generation !== token || !state.active || destroyed) return;
        state.ready = false; cancelAnimationFrame(raf); clearTimeout(poll);
        const deadline = performance.now() + 20000;
        const check = () => {
          if (generation !== token || !state.active || destroyed) return;
          try {
            const win = frame.contentWindow;
            if (win.__ready && typeof win.__setT === 'function') {
              const doc = frame.contentDocument, style = doc.createElement('style');
              style.textContent = kind === 'pier'
                ? 'html,body{height:100%;overflow:hidden}#page{height:100%;padding:0;display:flex;align-items:center;justify-content:center;max-width:none}header,#cap,#bar,#steps,footer{display:none!important}#stage{width:min(100%,calc(100vh * 1260 / 640));flex:none}'
                : 'html,body{height:100%;overflow:hidden}body.embed{display:flex;align-items:center;justify-content:center}.piece{width:min(100%,calc(100vh * 1117 / 326));flex:none}.bar{display:none!important}.panels{font-size:15px}';
              doc.head.append(style);
              if (kind === 'growth') {
                win.__setMode(state.mode);
                // Pause the parent timeline when native drag-to-turn begins.
                doc.getElementById('sheet').addEventListener('pointerdown', () => seek(state.time), { capture: true });
                doc.getElementById('piece').addEventListener('keydown', event => {
                  if (event.key === ' ') { event.preventDefault(); event.stopImmediatePropagation(); togglePlay(); }
                  else if (['ArrowLeft', 'ArrowRight'].includes(event.key) && !event.shiftKey) {
                    event.preventDefault(); event.stopImmediatePropagation();
                    const mode = win.BOWER_PIECE.modes.find(item => item.id === state.mode);
                    seek(state.time + (event.key === 'ArrowRight' ? 1 : -1) * state.duration / Math.max(8, 2 * (mode.frames.length - 1)));
                  }
                }, { capture: true });
              }
              state.duration = win.__duration;
              state.time = Math.min(state.time, state.duration - .01);
              state.ready = true;
              clearTimeout(deadlineTimer);
              makeChapters(); draw(); loading.hidden = true; startClock();
              return;
            }
          } catch { /* An unavailable or opaque frame is reported at the deadline. */ }
          if (performance.now() > deadline) { unavailable('Drawing unavailable. Open the deck through its local server to explore it.'); return; }
          poll = setTimeout(check, 100);
        };
        check();
      });
      screen.prepend(frame);
      updateControls();
    }

    function onKeyboard(event) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', ' '].includes(event.key)) event.stopPropagation();
    }
    const stopWheel = event => event.stopPropagation();
    const onScrub = () => seek(Number(range.value) / 1000 * state.duration);
    const onReset = () => seek(0);
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else startClock(); };
    const onMotion = () => { if (motion.matches) seek(state.time); };
    playButton.addEventListener('click', togglePlay);
    resetButton.addEventListener('click', onReset);
    range.addEventListener('input', onScrub);
    root.addEventListener('keydown', onKeyboard);
    root.addEventListener('wheel', stopWheel, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    updateControls();

    return {
      setActive(value) {
        if (destroyed || state.active === !!value) return;
        state.active = !!value;
        if (state.active) createFrame(); else stopFrame();
      },
      setMode,
      seek,
      getState: () => ({ ...state, loaded: !!frame, running: !!raf, destroyed }),
      destroy() {
        if (destroyed) return;
        state.active = false; stopFrame(); destroyed = true;
        document.removeEventListener('visibilitychange', onVisibility);
        motion.removeEventListener('change', onMotion);
        root.remove();
      }
    };
  }
  window.DESIGNX_V8_STUDIES = Object.freeze({ mount });
})();
