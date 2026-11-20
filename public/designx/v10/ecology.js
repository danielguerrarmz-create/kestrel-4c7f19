/* The poster is also the finished drawing for print and reduced motion. */
(() => {
  'use strict';

  const assets = 'v10/assets/ecology-drawings/';
  const escape = value => String(value).replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function html(item) {
    const slug = escape(item.ecologyDrawing);
    const growth = item.ecologyDrawing !== 'why-these-plants';
    const layouts = {
      'nature-makes-space': 'space',
      'the-living-place': 'place',
      'rooted-before-it-climbs': 'roots',
      'six-piers-six-climbers': 'piers',
      'why-these-plants': 'palette'
    };
    const layout = layouts[item.ecologyDrawing];
    return `<section class="v8-ecology" data-ecology-layout="${layout}" aria-label="${escape(item.title)}">
      ${layout === 'piers' ? '' : `<h2>${escape(item.title)}</h2>`}
      <figure>
        <div class="v8-ecology-art" data-ecology-drawing="${slug}">
          <picture>
            ${growth ? `<source media="screen and (prefers-reduced-motion: no-preference)" srcset="${assets}stills/${slug}-opening.png">` : ''}
            <img src="${assets}stills/${slug}.png" alt="${escape(item.alt)}" loading="lazy">
          </picture>
        </div>
        <figcaption>${escape(item.caption)}</figcaption>
      </figure>
    </section>`;
  }

  function mount(root) {
    if (location.protocol === 'file:' || document.body.classList.contains('print-mode')) {
      root.querySelectorAll('.v8-ecology source').forEach(source => { source.media = 'not all'; });
      return;
    }
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let selected = null;
    let frame = null;
    let printing = false;

    function sync() {
      const interactive = ['nature-makes-space', 'why-these-plants'].includes(selected?.dataset.ecologyDrawing);
      const target = !document.hidden && !printing && (interactive || !reducedMotion.matches) ? selected : null;
      if (frame && frame.parentElement !== target) {
        frame.parentElement.querySelector('img').removeAttribute('aria-hidden');
        frame.remove();
        frame = null;
      }
      if (!target || frame) return;
      const next = document.createElement('iframe');
      next.title = target.closest('section').getAttribute('aria-label');
      next.tabIndex = interactive ? 0 : -1;
      next.src = assets + target.dataset.ecologyDrawing + '.html';
      next.addEventListener('load', () => {
        const drawing = next.contentDocument;
        if (!drawing || next !== frame) return;
        const reveal = () => {
          if (next !== frame) return;
          next.classList.add('is-ready');
          target.querySelector('img').setAttribute('aria-hidden', 'true');
        };
        if (drawing.documentElement.dataset.drawn === 'true') reveal();
        else drawing.addEventListener('ecology:drawn', reveal, { once: true });
        // Iframe input does not bubble into the viewer. Delegate navigation
        // to the existing deck handlers so inspecting a plant never traps it.
        drawing.addEventListener('keydown', event => {
          if (event.defaultPrevented || (event.target.closest?.('button') && [' ', 'Enter'].includes(event.key))) return;
          const key = new KeyboardEvent('keydown', event);
          if (!document.body.dispatchEvent(key)) event.preventDefault();
        });
        drawing.addEventListener('wheel', event => {
          if (!target.dispatchEvent(new WheelEvent('wheel', event))) event.preventDefault();
        }, { passive: false });
        for (const type of ['touchstart', 'touchend']) {
          drawing.addEventListener(type, event => {
            // The deck measures a swipe in screen CSS pixels. The iframe's
            // client coordinates are in the unscaled 1600 px slide.
            const rect = next.getBoundingClientRect();
            const touches = Array.from(event.changedTouches, touch => new Touch({
              identifier: touch.identifier, target,
              clientX: rect.left + touch.clientX * rect.width / next.clientWidth,
              clientY: rect.top + touch.clientY * rect.height / next.clientHeight
            }));
            target.dispatchEvent(new TouchEvent(type, { bubbles: true, changedTouches: touches }));
          }, { passive: true });
        }
      }, { once: true });
      frame = next;
      target.append(next);
    }

    document.addEventListener('designx:slidechange', event => {
      selected = event.detail.element.querySelector('[data-ecology-drawing]');
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    window.addEventListener('beforeprint', () => { printing = true; sync(); });
    window.addEventListener('afterprint', () => { printing = false; sync(); });
  }

  window.DESIGNX_V10_ECOLOGY = { html };
  (window.DESIGNX_MOUNTS ||= []).push(mount);
})();
