/* Edition 08: customer discovery gives the first built reference a specific role. */
(() => {
  'use strict';

  window.DESIGNX_V8_REFERENCE = {
    title: 'The first Bower is the missing reference.',
    theme: 'commercial-loop-slide v8-reference-slide',
    html: `<section class="v8-reference-scene" aria-labelledby="v8-reference-title">
      <h2 id="v8-reference-title" class="v8-reference-title">
        <span>The first Bower is</span>
        <span>the missing <em>reference.</em></span>
      </h2>
      <div class="v8-reference-body">
        <section class="v8-reference-evidence" aria-labelledby="v8-reference-evidence-title">
          <h3 id="v8-reference-evidence-title">Conversations in England</h3>
          <p>Cultural institutions, estate owners and private prospects repeatedly wanted to see one completed Bower.</p>
        </section>
        <figure class="v8-reference-visual" aria-labelledby="v8-reference-caption">
          <img src="v8/assets/scene-drafts/arrival.png" alt="Provisional design render of the Bower, with people approaching through its garden. The same view resolves from a faint ghost into full colour." width="1920" height="1200">
          <figcaption id="v8-reference-caption">A place they can <em>visit.</em></figcaption>
        </figure>
      </div>
      <aside class="v7-drawing-note v8-reference-note" aria-label="Drawing brief">
        <strong>Drawing to make</strong>
        <p>The same Bower, ghosted, becomes a place in full colour. Ground, planting and people come into presence.</p>
        <p class="v8-reference-draft">Timing sketch uses the current arrival draft.</p>
      </aside>
    </section>`,
    notes: 'The founder reports a repeated finding from conversations in England with cultural institutions, estate owners and private prospects: they wanted to see a completed Bower. This is a paraphrase of the founder’s account, not a direct quotation or independently measured market research. It identifies a specific role for the first project: a completed, visitable reference would let prospective clients experience the room, examine its making and discuss establishment and care. The first built Bower remains to be delivered. A new installation would show its initial condition and care provision; longer-term establishment and seasonal performance would require observation over time. These conversations indicate interest and a condition prospects want to assess. They are not orders, named endorsements, a conversion forecast or evidence that a first project will finance later development.',
    source: 'Founder-reported customer discovery in England, supplied during the November 2026 deck review. No direct quotations, counts, commitments or conversion data are asserted. The provisional reveal uses the existing inhabited-room arrival render, v8/assets/scene-drafts/arrival.png. It is a design study, not a photograph of a completed Bower. The browser changes opacity and colour only; this timing sketch does not show construction or simulate growth.'
  };

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const scene = root.querySelector('.v8-reference-scene');
    if (!scene) return;
    const picture = scene.querySelector('.v8-reference-visual img');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const printing = new URL(location.href).searchParams.get('print') === '1';
    const duration = 6500;
    const animation = picture.animate([
      { opacity:.12, filter:'grayscale(1)', offset:0 },
      { opacity:.12, filter:'grayscale(1)', offset:.15 },
      { opacity:1, filter:'grayscale(0)', offset:1 }
    ], { duration, fill:'both', easing:'ease-in-out' });
    animation.pause(); animation.currentTime = 0;
    let active = false, complete = false, printEvent = false;
    function holdFinal() {
      complete = true;
      picture.style.opacity = '1';
      picture.style.filter = 'none';
      animation.cancel();
    }
    function sync() {
      if (complete) return;
      if (active && !document.hidden && !printing && !printEvent) animation.play();
      else animation.pause();
    }
    animation.onfinish = holdFinal;
    if (printing || reduced.matches) holdFinal();
    document.addEventListener('designx:slidechange', event => {
      active = event.detail.element === scene.closest('.slide');
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', () => { if (reduced.matches) holdFinal(); });
    window.addEventListener('beforeprint', () => { printEvent = true; sync(); });
    window.addEventListener('afterprint', () => { printEvent = false; sync(); });
  });
})();
