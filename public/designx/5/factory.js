/* Presentation controls for the supplied factory engine. The postMessage bridge
   also works in an offline file:// copy, where child frames have opaque origins. */
(() => {
  'use strict';
  const catalog = new Map(window.DESIGNX_FACTORY_CATALOG.map(item => [item.id, item]));
  // Short, source-supported captions; the complete source explanation is in notes.
  const captions = {
    overview: 'Fourteen connected operations, from timber preparation to a finished rib.',
    '01-condition': 'Boards acclimatise before moisture checks and grading.',
    '02-grade': 'Grade each board and cut away unsuitable sections.',
    '03-join': 'Finger-joint short pieces into continuous lamellae.',
    '04-plane': 'Plane each lamella before it reaches the glue line.',
    '05-press': 'Robot-set pins shape the glued layers; yokes hold them in place.',
    '06-cure': 'Move the clamped rib to cure while the forming bed starts another.',
    '07-scan': 'Scan the released rib against its target geometry.',
    '08-slice': 'Slice the curved blank into layers for a second bend.',
    '09-press': 'Glue and clamp the layers into a second curve. Tower clamps remain a proposal.',
    '10-scan': 'Scan the doubly curved rib to check its shape.',
    '11-cut': 'Mill the joints, scan their faces, then carve ornament with the same spindle.',
    '12-finish': 'Trim, sand and coat the rib, then leave it to dry.',
    '13-test': 'Test glue-line samples and record the results.',
    '14-ship': 'Scan the finished rib, store it in assembly order and load it for delivery.'
  };
  const controllers = new Set();
  const viewers = [];
  let requestSerial = 0;
  let printing = document.body.classList.contains('print-mode') || new URLSearchParams(location.search).has('print');
  let enlarged = null;
  let readyResolve, readyReject;
  window.DESIGNX_FACTORY_READY = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
  // Keep an export failure visible to QA without an unhandled-rejection warning.
  window.DESIGNX_FACTORY_READY.catch(error => console.error('Factory drawings:', error));

  window.addEventListener('message', event => {
    if (!event.data || !String(event.data.type).startsWith('bower-factory:')) return;
    for (const control of controllers) {
      if (event.source !== control.frame.contentWindow) continue;
      const data = event.data;
      if (data.type === 'bower-factory:reply') {
        const pending = control.pending.get(data.requestId);
        if (pending) {
          clearTimeout(pending.timer); control.pending.delete(data.requestId);
          if (data.error) pending.reject(new Error(data.error)); else pending.resolve(data.result);
        }
      }
      if (data.state) { control.state = data.state; control.onState?.(data.state); }
      if (data.type === 'bower-factory:ready') control.resolveReady(control);
      break;
    }
  });

  function createFrame(surface, id, onState) {
    const item = catalog.get(id);
    if (!item) throw new Error(`Unknown factory drawing: ${id}`);
    const frame = document.createElement('iframe');
    frame.title = `${item.number ? item.number + ' · ' : ''}${item.title}: factory development drawing`;
    frame.tabIndex = -1;
    const control = { frame, id, state: null, pending: new Map(), onState, desiredActive: false };
    control.ready = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Factory drawing did not become ready: ${id}`)), 30000);
      control.resolveReady = value => { clearTimeout(timer); resolve(value); };
      control.cancelReady = () => { clearTimeout(timer); resolve(null); };
    });
    control.call = (action, ...args) => new Promise((resolve, reject) => {
      const requestId = ++requestSerial;
      const timer = setTimeout(() => { control.pending.delete(requestId); reject(new Error(`Factory ${id}: ${action} timed out`)); }, 15000);
      control.pending.set(requestId, { resolve, reject, timer });
      frame.contentWindow.postMessage({ type: 'bower-factory:command', requestId, action, args }, '*');
    });
    control.destroy = () => {
      controllers.delete(control); control.cancelReady();
      for (const pending of control.pending.values()) { clearTimeout(pending.timer); pending.resolve(null); }
      control.pending.clear(); frame.remove();
    };
    controllers.add(control);
    frame.src = new URL(`5/factory/${id}.html`, document.baseURI).href;
    surface.append(frame);
    return control;
  }

  function showError(surface, error) {
    const message = document.createElement('p'); message.className = 'factory-error';
    message.textContent = `This drawing could not load. Reload to try again. ${error.message}`;
    surface.replaceChildren(message);
  }

  function updateControls(element, state) {
    const play = element.querySelector('[data-factory-play]');
    play.textContent = state.playing ? 'Pause' : 'Play';
    play.setAttribute('aria-label', `${state.playing ? 'Pause' : 'Play'} factory drawing`);
    play.disabled = state.reducedMotion;
    play.title = state.reducedMotion ? 'Reduced motion is enabled. Use the timeline to inspect the drawing.' : '';
    const seek = element.querySelector('[data-factory-seek]');
    if (document.activeElement !== seek) seek.value = String(state.time / state.duration * 100);
    seek.setAttribute('aria-valuetext', `${state.step}, ${Math.round(state.time)} of ${Math.round(state.duration)} seconds`);
    element.querySelector('[data-factory-phase]').textContent = state.step;
  }

  function wireControls(element, getControl) {
    const safe = action => async () => { const control = getControl(); if (control?.state) await action(control).catch(console.error); };
    element.querySelector('[data-factory-play]').addEventListener('click', safe(control => control.call(control.state.playing ? 'pause' : 'play')));
    element.querySelector('[data-factory-reset]').addEventListener('click', safe(async control => { await control.call('seek', 0); await control.call('play'); }));
    element.querySelector('[data-factory-seek]').addEventListener('input', safe(control => control.call('seek', Number(element.querySelector('[data-factory-seek]').value) * control.state.duration / 100)));
    // Range and playback keys belong to this control, not deck navigation.
    element.addEventListener('keydown', event => event.stopPropagation());
    element.addEventListener('wheel', event => event.stopPropagation(), { passive: true });
  }

  function syncActivity() {
    for (const viewer of viewers) {
      const control = viewer.control;
      const active = !printing && !document.hidden && !enlarged && viewer.element.closest('.slide').classList.contains('is-active');
      if (!control || control.desiredActive === active) continue;
      control.desiredActive = active;
      control.ready.then(value => value && control.call('setActive', active)).catch(console.error);
    }
    if (enlarged?.control) {
      const control = enlarged.control;
      const active = !printing && !document.hidden;
      if (control.desiredActive !== active) {
        control.desiredActive = active;
        control.ready.then(value => value && control.call('setActive', active)).catch(console.error);
      }
    }
  }

  function makeDialog(id, className, title) {
    const dialog = document.createElement('dialog'); dialog.className = `factory-dialog ${className}`; dialog.id = id;
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.innerHTML = `<div class="factory-dialog-heading"><h2 id="${id}-title"></h2><button type="button" aria-label="Close drawing dialog">Close ×</button></div>`;
    dialog.querySelector('h2').textContent = title;
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => event.stopPropagation());
    dialog.addEventListener('wheel', event => event.stopPropagation(), { passive: true });
    document.body.append(dialog);
    return dialog;
  }

  function showNotes(id) {
    const item = catalog.get(id);
    const dialog = makeDialog('factory-notes', 'factory-notes-dialog', `${item.number ? item.number + ' · ' : ''}${item.title}`);
    const content = document.createElement('div'); content.className = 'factory-drawing-notes';
    const sections = [['The operation', item.whatHappens], ['Industry practice and Bower’s proposal', item.bower], ['Still to test', item.testing]];
    for (const [title, text] of sections) {
      if (!text) continue;
      const heading = document.createElement('h3'); heading.textContent = title;
      const paragraph = document.createElement('p'); paragraph.textContent = text;
      content.append(heading, paragraph);
    }
    if (item.sourceLinks?.length) {
      const heading = document.createElement('h3'); heading.textContent = 'Source references'; content.append(heading);
      const list = document.createElement('ul');
      for (const source of item.sourceLinks) {
        const li = document.createElement('li'), link = document.createElement('a');
        link.textContent = source.title; link.href = source.url; link.target = '_blank'; link.rel = 'noopener'; li.append(link); list.append(li);
      }
      content.append(list);
    }
    dialog.append(content); dialog.addEventListener('close', () => dialog.remove(), { once: true }); dialog.showModal();
  }

  async function enlarge(viewer) {
    if (enlarged || !viewer.control.state) return;
    const base = viewer.control;
    const item = catalog.get(base.id);
    const dialog = makeDialog('factory-enlarged', 'factory-enlarged-dialog', `${item.number ? item.number + ' · ' : ''}${item.title}`);
    const surface = document.createElement('div'); surface.className = 'factory-dialog-surface'; dialog.append(surface);
    const controls = viewer.element.querySelector('.factory-controls').cloneNode(true);
    controls.querySelector('[data-factory-focus]').remove(); controls.querySelector('[data-factory-notes]').remove();
    dialog.append(controls);
    const priorState = { ...base.state };
    enlarged = { dialog, control: null }; syncActivity();
    dialog.showModal();
    const control = createFrame(surface, base.id, state => updateControls(controls, state)); enlarged.control = control;
    wireControls(controls, () => control);
    dialog.addEventListener('close', async () => {
      const finalState = control.state;
      control.destroy(); enlarged = null; dialog.remove();
      if (viewer.control === base && finalState) {
        await base.call('seek', finalState.time);
        if (finalState.playing) await base.call('play');
      }
      syncActivity(); viewer.element.querySelector('[data-factory-focus]').focus();
    }, { once: true });
    try {
      await control.ready;
      if (!enlarged || enlarged.control !== control) return;
      await control.call('seek', priorState.time);
      if (priorState.playing) await control.call('play');
      syncActivity();
    } catch (error) { showError(surface, error); }
  }

  async function select(viewer, id) {
    viewer.control?.destroy();
    const surface = viewer.element.querySelector('[data-factory-surface]'); surface.replaceChildren();
    const control = createFrame(surface, id, state => updateControls(viewer.element, state)); viewer.control = control;
    viewer.element.querySelectorAll('[data-factory-id]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.factoryId === id)));
    viewer.element.querySelector('[data-factory-caption]').textContent = captions[id];
    try { await control.ready; if (viewer.control === control) syncActivity(); }
    catch (error) { if (viewer.control === control) showError(surface, error); throw error; }
  }

  async function preparePosters(root) {
    for (const poster of root.querySelectorAll('[data-factory-poster]')) {
      const surface = document.createElement('div');
      const overview = poster.dataset.factoryPoster === 'overview';
      Object.assign(surface.style, { position: 'fixed', left: '-10000px', top: '0', width: overview ? '1480px' : '450px', height: overview ? '570px' : '430px' });
      surface.className = 'factory-capture-surface'; surface.setAttribute('aria-hidden', 'true'); document.body.append(surface);
      const control = createFrame(surface, poster.dataset.factoryPoster);
      try {
        await control.ready; await control.call('renderStatic');
        const template = document.createElement('template'); template.innerHTML = await control.call('exportSvg');
        const identifiers = new Map([...template.content.querySelectorAll('[id]')].map(node => [node.id, `factory-poster-${control.id}-${node.id}`]));
        for (const node of template.content.querySelectorAll('*')) {
          for (const attribute of [...node.attributes]) {
            let value = attribute.value;
            if (attribute.name === 'id') value = identifiers.get(value);
            else {
              value = value.replace(/url\(#([^)]*)\)/g, (match, id) => identifiers.has(id) ? `url(#${identifiers.get(id)})` : match);
              if (['href', 'xlink:href'].includes(attribute.name) && identifiers.has(value.slice(1))) value = `#${identifiers.get(value.slice(1))}`;
            }
            node.setAttribute(attribute.name, value);
          }
        }
        poster.replaceChildren(template.content);
        const svg = poster.querySelector('svg'); svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', `${catalog.get(control.id).title}: supplied factory development drawing`);
      } finally { control.destroy(); surface.remove(); }
    }
  }

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    root.querySelectorAll('[data-factory-viewer]').forEach(element => {
      const viewer = { element, control: null }; viewers.push(viewer);
      wireControls(element.querySelector('.factory-controls'), () => viewer.control);
      element.querySelectorAll('[data-factory-id]').forEach(button => button.addEventListener('click', () => { select(viewer, button.dataset.factoryId).catch(console.error); }));
      element.querySelector('[data-factory-notes]').addEventListener('click', () => showNotes(viewer.control.id));
      element.querySelector('[data-factory-focus]').addEventListener('click', () => enlarge(viewer));
      element.querySelectorAll('.factory-station-picker,.factory-hero-picker').forEach(picker => picker.addEventListener('keydown', event => event.stopPropagation()));
    });
    Promise.all([...viewers.map(viewer => select(viewer, viewer.element.dataset.factoryViewer === 'overview' ? 'overview' : '05-press')), preparePosters(root)])
      .then(() => { syncActivity(); readyResolve(true); }).catch(readyReject);
    document.addEventListener('designx:slidechange', syncActivity);
    document.addEventListener('visibilitychange', syncActivity);
    window.addEventListener('beforeprint', () => { printing = true; syncActivity(); });
    window.addEventListener('afterprint', () => { printing = document.body.classList.contains('print-mode'); syncActivity(); });
  });
  window.DESIGNX_FACTORY = Object.freeze({
    preparePrint: () => window.DESIGNX_FACTORY_READY,
    getStates: () => viewers.map(viewer => ({ viewer: viewer.element.dataset.factoryViewer, ...viewer.control?.state }))
  });
})();
