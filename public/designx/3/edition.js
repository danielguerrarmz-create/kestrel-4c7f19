/* Edition 03: a material problem, a manufacturing challenge, a living alternative.
   Reuses edition 02's presentation controls without changing either earlier edition. */
(() => {
  'use strict';
  const editionTwo = window.DESIGNX_SLIDES;
  // Use the complete supplied logo used by the current marketing site.
  // The inherited edition-02 Oculus/Georgia construction is not this artwork.
  const brandMarkup = '<img class="deck-brand-lockup" src="3/assets/bower-logo.png" alt="Bower">';
  const viewerBrand = document.querySelector('.viewer-brand');
  viewerBrand.innerHTML = brandMarkup;
  viewerBrand.setAttribute('aria-label', 'Bower home');
  const byTheme = new Map(editionTwo.map(slide => [slide.theme.split(' ')[0], slide]));
  const editionUrl = location.protocol === 'file:' ? location.href.split('#')[0] : 'https://www.bowerbuild.org/designx/3';
  const problem = {
    title: 'We’re about to build the world again.',
    act: 'I · The problem & the proposition',
    theme: 'material-problem-slide', sourceIndex: 1,
    html: window.DESIGNX_SCENES.materialProblem(),
    notes: 'For the MIT–LUMA audience, embodied carbon is shared ground. The opening establishes the scale and timing of material decisions, rather than teaching cement chemistry. ETC projects approximately 55% growth in global building floor area between 2022 and 2050, from about 250 to 390 billion square metres. This is a projection with a stated baseline, not a prediction that half of all buildings will be replaced. Cleaner energy can reduce future operating and manufacturing emissions; it cannot retroactively prevent emissions already released during construction. The cinematic image is a generated illustration, not a named project. The next two slides turn directly to the alternative and Bower’s developing production capability.',
    source: 'Energy Transitions Commission, Achieving Zero-Carbon Buildings: Electric, Efficient and Flexible (2025), executive summary pp. 7 and 10, 2022–2050 floor-area projection. UNEP / GlobalABC 2025–2026 report for sector context. Generated architectural illustration; sources linked on slide.'
  };
  byTheme.set('material-problem-slide', problem);
  const order = ['material-problem-slide', 'variability-slide', 'cover', 'growth-slide', 'anatomy-slide', 'computation-slide', 'factory-slide', 'learning-slide', 'buyers-slide', 'commercial-model-slide', 'commercial-loop-slide', 'coupled-slide', 'team-slide', 'future-slide', 'closing'];
  const headlines = {
    'anatomy-slide': 'A timber structure.<br>Designed for life.',
    'computation-slide': 'From form<br>to fabrication.',
    'factory-slide': 'Different parts.<br>A repeatable process.',
    'commercial-model-slide': 'Sell a Bower.<br>Develop the system.',
    'commercial-loop-slide': 'Built proof<br>creates demand.',
    'coupled-slide': 'From commissions<br>to production capability.',
    'closing': 'Buildings<br>that grow.'
  };

  window.DESIGNX_META = Object.freeze({ status: 'working-draft', edition: 3, targetSlideCount: order.length, exportReady: true });
  window.DESIGNX_SLIDES = order.map(theme => {
    const slide = byTheme.get(theme);
    const template = document.createElement('template');
    template.innerHTML = (theme === 'variability-slide' ? window.DESIGNX_SCENES.livingOpportunity() : slide.html)
      .replaceAll('https://www.bowerbuild.org/designx/2', editionUrl)
      .replaceAll('bowerbuild.org/designx/2 <', 'bowerbuild.org/designx/3 <');
    const content = template.content;
    content.querySelectorAll('.wordmark').forEach(mark => { mark.innerHTML = brandMarkup; });
    const heading = content.querySelector('.slide-heading h2, .fw-intro h2, .fw-coupled-title h2');
    if (heading && headlines[theme]) heading.innerHTML = headlines[theme];
    let title = headlines[theme]?.replaceAll('<br>', ' ') ?? slide.title;
    let notes = slide.notes;
    let source = slide.source;

    if (theme === 'variability-slide') {
      title = 'Nature builds by growing.';
      notes = 'The alternative is material that grows, paired with architecture that continues to become more alive. The technical obstacle follows immediately: forms, biological properties and growth vary, while the making must be reliable and repeatable. Timber construction already exists at industrial scale; Bower is developing its particular living-architecture system. The components are real digital studies, not manufactured parts. The forest is a generated illustration. Biological materials are not automatically carbon-negative: responsible sourcing, processing, durability, maintenance and end of life matter. Bower has not yet measured lifecycle performance.';
      source = 'Bower One R13 digital model parts CW-001, CW-020 and CW-040. Founder’s variability thesis. UNEP, Building Materials and the Climate (2023). Generated woodland illustration.';
    }
    if (theme === 'cover') {
      title = 'Bower. Buildings that grow.';
      content.querySelector('.cover-proposition').textContent = 'And the means to make many.';
      content.querySelector('.cover-top p').remove();
      notes = 'Bower is developing the architectural product and the capability to produce it together. Start with one beautiful, inhabitable Bower to test desirability and buildability. Use commissions to develop repeatable design and fabrication knowledge. A production system is the route toward wider application. This is a development path, not a claim that the first building, operating factory or lifecycle carbon case is complete. The first product combines an engineered timber structure with planting; the plants are not assumed to replace the engineered load path.';
    }
    if (theme === 'growth-slide') {
      title = 'More alive with time.';
      content.querySelector('.time-heading h2').innerHTML = 'More alive<br>with time.';
    }
    if (theme === 'anatomy-slide') {
      content.querySelector('.source-note').textContent = 'Digital assembly study. The engineered timber frame carries the structure; planting colonises it.';
    }
    if (theme === 'computation-slide') {
      content.querySelector('.slide-heading').insertAdjacentHTML('afterend', '<p class="engine-purpose">Turn a changing form into parts, checks and fabrication instructions.</p>');
    }
    if (theme === 'factory-slide') {
      content.querySelector('.factory-deckline').textContent = 'The aim: repeat the method, even when the components change.';
    }
    if (theme === 'buyers-slide') {
      content.querySelector('.buyer-triptych').insertAdjacentHTML('afterend', '<div class="prospect-strip" role="group" aria-label="Organisations in active discussion"><p>In discussion<br>with</p><a class="prospect-logo prospect-logo-eden" href="https://www.edenproject.com/" target="_blank" rel="noopener"><img src="3/assets/prospects/eden-project.svg" alt="Eden Project" loading="lazy"></a><a class="prospect-logo prospect-logo-newt" href="https://thenewtinsomerset.com/" target="_blank" rel="noopener"><img src="3/assets/prospects/the-newt.svg" alt="The Newt" loading="lazy"></a><a class="prospect-logo prospect-logo-25hours" href="https://25hours-hotels.com/" target="_blank" rel="noopener"><img src="3/assets/prospects/25hours.svg" alt="25hours" loading="lazy"></a></div>');
      content.querySelector('.source-note').textContent = 'Active conversations, not signed commissions. Images are Bower concepts, not work for these organisations.';
      notes = 'Private gardens, cultural destinations and hospitality are prospective settings for the first Bowers. In discussion with the Eden Project, The Newt and 25hours: these are active conversations, not signed commissions or endorsements. The logos sit together as customer-discovery evidence; no individual image represents a commission from, or a proposal for, any named organisation. The resort film remains a generated Bower concept. This combines the market and conversations into a single slide.';
      source = 'Prospect naming and active-discussion status approved by the founder. Official institutional logo assets are recorded in 3/assets/prospects/sources.json. Concept images: existing Bower and founder-authorized Higgsfield library.';
    }
    if (theme === 'commercial-model-slide') {
      content.querySelector('.slide-heading').insertAdjacentHTML('afterend', '<p class="commission-purpose">Each early commission should create a place people want—and knowledge the next build can reuse.</p>');
      content.querySelector('.capability-rail').innerHTML = '<span>Reusable<br>design rules</span><span>Tested fabrication<br>workflows</span><span>Production<br>tooling</span>';
      content.querySelector('.source-note').textContent = 'Intended commercial model / indicative proposal fees. Capability development and reinvestment depend on project economics and additional finance.';
      notes = 'A commissioned Bower is the initial product. The strategic objective is the capability that can be reused after the commission: design rules, fabrication workflows and production tooling. These capabilities are intended outcomes, not completed factory infrastructure. Indicative siting and design-development fees come from the supplied brief; build terms are project-specific. Early projects demonstrate desire and test delivery. Their climate significance would depend on validated performance and the eventual reach of the system, not the number of garden commissions alone.';
    }
    if (theme === 'coupled-slide') {
      content.querySelector('.fw-coupled-title').insertAdjacentHTML('afterend', '<p class="mission-bridge">First commissions test desirability and buildability.<br>A repeatable production system is how the ambition reaches beyond them.</p>');
      content.querySelector('.fw-qualification').textContent = 'The long-term objective is repeatable production. First commissions test the product, process and demand; the factory remains in development.';
      notes = 'This is the bridge from the first commission to the larger mission. Projects provide real constraints, customer feedback and, eventually, fabrication and growth evidence. The intention is to convert that work into reusable production capability. Better workflows should improve subsequent projects. Neither loop is shown as fully proven. The factory requires technical validation, viable project economics and additional finance; it is not automatically paid for by the first few commissions.';
    }
    if (theme === 'future-slide') {
      content.querySelector('.future-standfirst').textContent = 'Prove the room. Develop the system. Explore what it could make possible.';
      content.querySelector('.source-note').textContent = 'Long-term ambition. Speculative scale studies; engineering feasibility and lifecycle carbon performance remain to be demonstrated.';
    }
    if (theme === 'closing') {
      content.querySelector('.closing-ask').innerHTML = 'Make the first Bower possible.<br>Develop the means to make many.';
      content.querySelector('.closing-copy').insertAdjacentHTML('afterend', '<blockquote class="closing-thesis">We mine, pour, and cut; we assemble inert objects that begin decaying the moment they’re complete; and we’ve quietly accepted that <strong>the largest thing our species makes — the built world — is also the most severed from the living one.</strong></blockquote>');
      notes = 'Close with the founder’s emotional thesis, retained visibly in full. It is a cultural argument about the built world’s relationship with life, not a measured claim that every building immediately fails. Pair it with the specific ambition: make the first Bower possible and develop the means to make many. The images remain concepts, not completed buildings.';
    }
    // An edition can have functional labels and source notes, but no eyebrow headings.
    content.querySelectorAll('.eyebrow, .fw-eyebrow, .time-heading>p, .running, .time-running, .fw-running, .fee-order, .fw-system-kicker').forEach(element => element.remove());
    return { ...slide, title, notes, source, act: order.indexOf(theme) < 5 ? 'I · The problem & the proposition' : slide.act, html: template.innerHTML };
  });

  (window.DESIGNX_MOUNTS ||= []).push(() => {
    const secondLink = document.querySelector('[data-edition-two]');
    if (location.protocol === 'file:') {
      secondLink.href = new URL('../2/index.html', location.href).href;
      // The shared viewer sets its original offline PDF after mounting scenes.
      queueMicrotask(() => { document.getElementById('pdf-link').href = '3/downloads/Bower_DesignX_Buildings_That_Grow_03.pdf'; });
    }
    document.addEventListener('designx:slidechange', event => {
      const sourceIndex = window.DESIGNX_SLIDES[event.detail.index].sourceIndex;
      const index = editionTwo.findIndex(slide => slide.sourceIndex === sourceIndex);
      secondLink.hash = `slide-${String(index + 1).padStart(2, '0')}`;
    });
  });
})();
