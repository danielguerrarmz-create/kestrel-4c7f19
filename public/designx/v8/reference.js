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
        <section class="v8-reference-evidence" aria-label="Customer discovery">
          <p>International Cultural institutions, estate owners and private prospects repeatedly wanted to see one completed Bower.</p>
        </section>
        <figure class="v8-reference-visual" aria-labelledby="v8-reference-caption">
          <img src="v8/assets/reference/planted-bower.png" alt="Architectural line illustration of the complete Bower, its timber arches and canopy covered with climbing plants, isolated without a landscape background." width="1536" height="1024" decoding="async">
          <figcaption id="v8-reference-caption">A place they can <em>visit.</em></figcaption>
        </figure>
      </div>
    </section>`,
    notes: 'The founder reports a repeated finding from international conversations with cultural institutions, estate owners and private prospects: they wanted to see a completed Bower. This is a paraphrase of the founder’s account, not a direct quotation or independently measured market research. It identifies a specific role for the first project: a completed, visitable reference would let prospective clients experience the room, examine its making and discuss establishment and care. The first built Bower remains to be delivered. The illustration imagines a planted Bower at maturity; an installation would begin with younger plants and develop through establishment and care. Longer-term establishment and seasonal performance would require observation over time. These conversations indicate interest and a condition prospects want to assess. They are not orders, named endorsements, a conversion forecast or evidence that a first project will finance later development.',
    source: 'Founder-reported international customer discovery, revised during the 15 November 2026 deck review. No direct quotations, counts, commitments or conversion data are asserted. The isolated botanical illustration was generated with the built-in image tool using the existing inhabited-room arrival render as its architectural reference. It is a concept illustration, not exact model geometry, a growth simulation or a photograph of a completed Bower. Its source and prompt are recorded in v8/assets/reference/SOURCES.md. The browser reveals the same drawing from a pale monochrome ghost into restrained colour, then holds it.'
  };

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const scene = root.querySelector('.v8-reference-scene');
    if (!scene) return;
    const picture = scene.querySelector('.v8-reference-visual img');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const printing = new URL(location.href).searchParams.get('print') === '1';
    const duration = 6500;
    const animation = picture.animate([
      { opacity:.18, filter:'grayscale(1)', offset:0 },
      { opacity:.35, filter:'grayscale(1)', offset:.2 },
      { opacity:1, filter:'grayscale(0)', offset:1 }
    ], { duration, fill:'both', easing:'ease-in-out' });
    animation.pause(); animation.currentTime = 0;
    let active = false, complete = false, printEvent = false, ready = false;
    function holdFinal() {
      complete = true;
      picture.style.opacity = '1';
      picture.style.filter = 'none';
      animation.cancel();
    }
    function sync() {
      if (complete) return;
      if (ready && active && !document.hidden && !printing && !printEvent) animation.play();
      else animation.pause();
    }
    animation.onfinish = holdFinal;
    picture.decode().catch(() => {}).then(() => { ready = true; sync(); });
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
