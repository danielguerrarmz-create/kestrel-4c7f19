/* Edition 03: a material problem, a manufacturing challenge, a living alternative.
   Reuses edition 02's presentation controls without changing either earlier edition. */
(() => {
  'use strict';
  const editionTwo = window.DESIGNX_SLIDES;
  const byTheme = new Map(editionTwo.map(slide => [slide.theme.split(' ')[0], slide]));
  const editionUrl = location.protocol === 'file:' ? location.href.split('#')[0] : 'https://www.bowerbuild.org/designx/3';
  const problem = {
    title: 'Cleaner energy. A material problem remains.',
    act: 'I · The problem & the proposition',
    theme: 'material-problem-slide', sourceIndex: 1,
    html: window.DESIGNX_SCENES.materialProblem(),
    notes: 'The problem is material as well as operational. The latest UNEP report attributes around 37% of global CO₂ emissions to buildings and construction. Cleaner energy reduces emissions, including some from material manufacture, but does not remove the chemical release of CO₂ when limestone is converted into clinker. The diagram isolates that distinction; it is not an emissions model or a complete cement-production inventory. Cement can also be decarbonised through material efficiency, clinker substitution, carbon capture and other pathways. Bower is exploring a biological-material pathway; it has not demonstrated a lifecycle carbon advantage. The opening must be understood without a narrator.',
    source: 'UNEP / GlobalABC, Global Status Report for Buildings and Construction 2025–2026, Key Messages, May 2026: around 37% of global CO₂ emissions. IEA, Technology Roadmap: Low-Carbon Transition in the Cement Industry (2018), process chemistry; Breakthrough Agenda Report 2025, Cement and Concrete, complementary abatement pathways. Links appear on the slide.'
  };
  byTheme.set('material-problem-slide', problem);
  const order = ['material-problem-slide', 'variability-slide', 'cover', 'growth-slide', 'anatomy-slide', 'computation-slide', 'factory-slide', 'learning-slide', 'buyers-slide', 'traction-slide', 'commercial-model-slide', 'commercial-loop-slide', 'coupled-slide', 'team-slide', 'future-slide', 'closing'];
  const headlines = {
    'anatomy-slide': 'A timber structure.<br>Designed for life.',
    'computation-slide': 'From form<br>to fabrication.',
    'factory-slide': 'Different parts.<br>A repeatable process.',
    'commercial-model-slide': 'Sell a Bower.<br>Develop the system.',
    'commercial-loop-slide': 'Built proof<br>creates demand.',
    'coupled-slide': 'From commissions<br>to production capability.',
    'closing': 'Buildings<br>that grow.'
  };

  window.DESIGNX_META = Object.freeze({ status: 'working-draft', edition: 3, targetSlideCount: 16, exportReady: true });
  window.DESIGNX_SLIDES = order.map(theme => {
    const slide = byTheme.get(theme);
    const template = document.createElement('template');
    template.innerHTML = slide.html
      .replaceAll('https://www.bowerbuild.org/designx/2', editionUrl)
      .replaceAll('bowerbuild.org/designx/2 <', 'bowerbuild.org/designx/3 <');
    const content = template.content;
    const heading = content.querySelector('.slide-heading h2, .fw-intro h2, .fw-coupled-title h2');
    if (heading && headlines[theme]) heading.innerHTML = headlines[theme];
    let title = headlines[theme]?.replaceAll('<br>', ' ') ?? slide.title;
    let notes = slide.notes;
    let source = slide.source;

    if (theme === 'variability-slide') {
      title = 'Nature varies. Making must be repeatable.';
      const headings = content.querySelectorAll('.variability-top h2');
      headings[0].innerHTML = 'Nature varies.';
      headings[1].innerHTML = 'Making must<br>be repeatable.';
      content.querySelector('.variability-top').insertAdjacentHTML('afterend', '<p class="opportunity-copy">Biological materials offer another way to build. Their forms, properties and growth demand a process that can adapt.</p>');
      content.querySelector('.source-note').innerHTML = 'Bower One R13 digital components / standard-stock schematic. Biological materials: <a href="https://wedocs.unep.org/items/effe9d8d-a949-4397-bed6-7afda856e261" target="_blank" rel="noopener">UNEP, Building Materials and the Climate ↗</a>';
      notes = 'Timber is already widely used and industrialised. Bower’s specific challenge is to make living architecture, with varied component geometries, biological properties and growth over time, reliable and repeatable. The pictured components are existing digital studies. Biological materials are not automatically carbon-negative: sourcing, processing, durability, maintenance and end of life matter. The exact variability thesis is the founder’s technical bet, not a claim that adaptive fabrication has only just been invented.';
      source = 'Bower One R13 model parts CW-001, CW-020 and CW-040. Founder’s exact variability thesis. UNEP, Building Materials and the Climate (2023), sustainably sourced biological materials as one complementary pathway.';
    }
    if (theme === 'cover') {
      title = 'Bower. Buildings that grow.';
      content.querySelector('.cover-proposition').innerHTML = 'Timber structures. Living growth.<br>Developing the computation and fabrication<br>to make this architecture repeatable.';
      content.querySelector('.cover-top p').remove();
      notes = 'Bower is developing a new category of living architecture and the production capability to make it repeatable. The first Bower combines an engineered timber structure with plants that colonise it. This is the company reveal after the material problem and manufacturing challenge. Computation, fabrication and growth are a development programme, not a claim that the factory is operating or lifecycle performance has been measured.';
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
    if (theme === 'commercial-model-slide') {
      content.querySelector('.slide-heading').insertAdjacentHTML('afterend', '<p class="commission-purpose">Each early commission should create a place people want—and knowledge the next build can reuse.</p>');
      content.querySelector('.capability-rail').innerHTML = '<span>Reusable<br>design rules</span><span>Tested fabrication<br>workflows</span><span>Production<br>tooling</span>';
      content.querySelector('.source-note').textContent = 'Intended commercial model / indicative proposal fees. Capability development and reinvestment depend on project economics and additional finance.';
      notes = 'A commissioned Bower is the initial product. The strategic objective is the capability that can be reused after the commission: design rules, fabrication workflows and production tooling. These capabilities are intended outcomes, not completed factory infrastructure. Indicative siting and design-development fees come from the supplied brief; build terms are project-specific. Early projects demonstrate desire and test delivery. Their climate significance would depend on validated performance and the eventual reach of the system, not the number of garden commissions alone.';
    }
    if (theme === 'coupled-slide') {
      content.querySelector('.fw-qualification').textContent = 'The long-term objective is repeatable production. First commissions test the product, process and demand; the factory remains in development.';
      notes = 'This is the bridge from the first commission to the larger mission. Projects provide real constraints, customer feedback and, eventually, fabrication and growth evidence. The intention is to convert that work into reusable production capability. Better workflows should improve subsequent projects. Neither loop is shown as fully proven. The factory requires technical validation, viable project economics and additional finance; it is not automatically paid for by the first few commissions.';
    }
    if (theme === 'future-slide') {
      content.querySelector('.future-standfirst').textContent = 'Prove the room. Develop the system. Explore what it could make possible.';
      content.querySelector('.source-note').textContent = 'Long-term ambition. Speculative scale studies; engineering feasibility and lifecycle carbon performance remain to be demonstrated.';
    }
    if (theme === 'closing') {
      content.querySelector('.closing-ask').innerHTML = 'Make the first Bower possible.<br>Develop the means to make many.';
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
