/* Edition 08: customer discovery gives the first built reference a specific role. */
(() => {
  'use strict';

  window.DESIGNX_V8_REFERENCE = {
    title: 'The first Bower is the missing reference.',
    theme: 'commercial-loop-slide v8-reference-slide',
    html: `<section class="v8-reference-scene" aria-labelledby="v8-reference-title">
      <div class="v8-reference-copy">
        <p class="v8-reference-kicker">The first Bower</p>
        <h2 id="v8-reference-title" class="v8-reference-title">The missing<br><em>reference.</em></h2>
        <p class="v8-reference-evidence">International Cultural institutions, estate owners and private prospects repeatedly wanted to see <strong>one completed Bower.</strong></p>
      </div>
      <figure class="v8-reference-visual">
        <img src="assets/room.webp" alt="Bower concept of a complete timber pavilion covered in flowering climbers, with people gathered beneath its arches." width="2400" height="1610" decoding="async">
      </figure>
    </section>`,
    notes: 'The founder reports a repeated finding from international conversations with cultural institutions, estate owners and private prospects: they wanted to see a completed Bower. This is a paraphrase of the founder’s account, not a direct quotation or independently measured market research. It identifies a specific role for the first project: a completed, visitable reference would let prospective clients experience the room, examine its making and discuss establishment and care. The first built Bower remains to be delivered. The illustration imagines a planted Bower at maturity; an installation would begin with younger plants and develop through establishment and care. Longer-term establishment and seasonal performance would require observation over time. These conversations indicate interest and a condition prospects want to assess. They are not orders, named endorsements, a conversion forecast or evidence that a first project will finance later development.',
    source: 'Founder-reported international customer discovery, revised during the 15 November 2026 deck review. No direct quotations, counts, commitments or conversion data are asserted. The existing whole-pavilion concept, assets/room.webp, is reused from the original deck as a full-bleed image. It is a concept illustration, not a photograph of a completed Bower or a validated growth outcome. The browser reveals the same image from a pale monochrome ghost into colour, then holds it.'
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
