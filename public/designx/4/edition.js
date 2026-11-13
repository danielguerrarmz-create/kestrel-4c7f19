/* Edition 04: living architecture in Argesta; the means of making it in Safiro.
   Earlier editions remain unchanged. No new project or performance claims. */
(() => {
  'use strict';
  const priorSlides = window.DESIGNX_SLIDES;
  const editionUrl = location.protocol === 'file:' ? location.href.split('#')[0] : 'https://www.bowerbuild.org/designx/4';
  const technical = new Set(['anatomy-slide', 'computation-slide', 'factory-slide', 'learning-slide']);
  window.DESIGNX_META = Object.freeze({ ...window.DESIGNX_META, edition: 4 });
  window.DESIGNX_SLIDES = priorSlides.map(slide => {
    const theme = slide.theme.split(' ')[0];
    const template = document.createElement('template');
    template.innerHTML = slide.html.replaceAll('https://www.bowerbuild.org/designx/3', editionUrl).replaceAll('bowerbuild.org/designx/3 <', 'bowerbuild.org/designx/4 <');
    const content = template.content;
    if (theme === 'material-problem-slide') {
      content.querySelector('h1').innerHTML = 'We’re about to<br>build the world<br><em>again.</em>';
    }
    if (theme === 'variability-slide') {
      const title = content.querySelector('.living-copy h2');
      title.className = 'living-title';
      title.innerHTML = 'Nature builds<br>by <em>growing.</em>';
      content.querySelector('.living-window').append(title);
    }
    if (theme === 'cover') content.querySelector('h1').innerHTML = 'Buildings<br>that <em>grow.</em>';
    if (theme === 'growth-slide') content.querySelector('.time-heading h2').innerHTML = 'More alive<br>with <em>time.</em>';
    if (theme === 'anatomy-slide') content.querySelector('.slide-heading h2').innerHTML = 'A timber structure.<br>Designed for <span class="v4-leaf-text">life.</span>';
    if (theme === 'computation-slide') {
      content.querySelector('.slide-heading h2').innerHTML = 'From form<br>to <span class="v4-leaf-text">fabrication.</span>';
      const model = content.querySelector('.computation-model');
      model.id = 'v4-model-view';
      model.setAttribute('data-model-view', 'assembly');
      model.querySelector('img').classList.add('v4-model-assembly');
      model.insertAdjacentHTML('beforeend', `<div class="v4-model-components" aria-hidden="true">${['01', '20', '40'].map(n => `<figure><img src="assets/part-${n}.webp" alt="Digital timber component CW-${n.padStart(3, '0')}" loading="lazy"><figcaption>CW-${n.padStart(3, '0')}</figcaption></figure>`).join('')}</div>`);
      model.insertAdjacentHTML('afterend', '<div class="v4-model-switch slide-interaction" role="group" aria-label="Explore the digital model"><button type="button" data-model-view="assembly" aria-pressed="true" aria-controls="v4-model-view">Assembly</button><button type="button" data-model-view="components" aria-pressed="false" aria-controls="v4-model-view">Components <span aria-hidden="true">↗</span></button></div>');
    }
    if (theme === 'factory-slide') content.querySelector('.slide-heading h2').innerHTML = 'Different parts.<br><span class="v4-leaf-text">A repeatable process.</span>';
    if (theme === 'learning-slide') content.querySelector('.fw-intro h2').innerHTML = 'Turn each build<br>into better<br><span class="v4-leaf-text">design rules.</span>';
    if (theme === 'buyers-slide') content.querySelector('.slide-heading h2').innerHTML = 'The first <em>customers.</em>';
    if (theme === 'commercial-model-slide') content.querySelector('.slide-heading h2').innerHTML = '<span class="v4-editorial">Sell a Bower.</span><br>Develop the system.';
    if (theme === 'commercial-loop-slide') {
      content.querySelector('.fw-intro h2').innerHTML = 'Built proof<br>creates <em>demand.</em>';
      const visuals = window.DESIGNX4_COMMERCIAL_VISUALS;
      const hub = content.querySelector('.fw-hub');
      hub.classList.add('v4-commercial-hub');
      hub.innerHTML = visuals.map((visual, index) => `<figure class="v4-commercial-state${index === 0 ? ' is-current' : ''}" data-commercial-state="${index}" role="img" aria-label="${visual.alt}" aria-hidden="${index !== 0}"><div class="v4-commercial-canvas" aria-hidden="true">${visual.markup}</div><figcaption>${visual.caption}</figcaption></figure>`).join('');
      content.querySelector('.fw-commercial').insertAdjacentHTML('beforeend', `<div class="v4-commercial-print" aria-label="The intended commercial cycle">${visuals.slice(0, 5).map(visual => `<figure><h3>${visual.stage}</h3><div class="v4-commercial-print-art" role="img" aria-label="${visual.alt}">${visual.markup}</div><figcaption>${visual.caption}</figcaption></figure>`).join('')}<svg class="v4-print-return" viewBox="0 0 1440 100" aria-hidden="true"><path d="M1305 5V35Q1305 60 1280 60H160Q135 60 135 35V5M127 15L135 5L143 15"/></svg><p>The next place starts with more behind it.</p></div>`);
      content.querySelector('.fw-qualification').textContent = 'Intended commercial model. Concept imagery; no completed commission is shown. Reinvestment depends on project economics and finance.';
    }
    if (theme === 'team-slide') content.querySelector('.slide-heading h2').innerHTML = '<span class="v4-editorial">Architecture.</span><br>Software. Manufacturing.';
    if (theme === 'closing') content.querySelector('.closing-copy h2').innerHTML = 'Buildings<br>that <em>grow.</em>';
    return { ...slide, theme: `${slide.theme}${technical.has(theme) ? ' v4-laboratory' : ''}`, html: template.innerHTML };
  });

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const thirdLink = document.querySelector('[data-edition-three]');
    if (location.protocol === 'file:') {
      thirdLink.href = new URL('../3/index.html', location.href).href;
      queueMicrotask(() => { document.getElementById('pdf-link').href = '4/downloads/Bower_DesignX_Buildings_That_Grow_04.pdf'; });
    }
    document.addEventListener('designx:slidechange', event => {
      thirdLink.hash = `slide-${String(event.detail.index + 1).padStart(2, '0')}`;
    });
    const model = root.querySelector('#v4-model-view');
    const assembly = model.querySelector('.v4-model-assembly');
    const components = model.querySelector('.v4-model-components');
    const buttons = root.querySelectorAll('button[data-model-view]');
    buttons.forEach(button => button.addEventListener('click', () => {
      const view = button.dataset.modelView;
      model.dataset.modelView = view;
      assembly.setAttribute('aria-hidden', String(view !== 'assembly'));
      components.setAttribute('aria-hidden', String(view !== 'components'));
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    }));
    // Follow the existing controller for clicks, playback, keyboard and reduced motion.
    // The scene alone owns phase selection; the visuals never run a competing timer.
    const commercial = root.querySelector('.fw-commercial');
    const syncCommercial = () => {
      const phase = commercial.dataset.fwPhase;
      commercial.querySelectorAll('[data-commercial-state]').forEach(figure => {
        const active = figure.dataset.commercialState === phase;
        figure.classList.toggle('is-current', active);
        figure.setAttribute('aria-hidden', String(!active));
      });
    };
    new MutationObserver(syncCommercial).observe(commercial, { attributes: true, attributeFilter: ['data-fw-phase'] });
    syncCommercial();
  });
})();
