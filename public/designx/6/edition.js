/* Edition 06 starts from the unchanged edition-05 presentation.
   Separate story and styles are ready for the next round of work. */
(() => {
  'use strict';
  const priorSlides = window.DESIGNX_SLIDES;
  const editionUrl = location.protocol === 'file:' ? location.href.split('#')[0] : 'https://www.bowerbuild.org/designx/6';
  const technical = new Set(['anatomy-slide', 'computation-slide', 'learning-slide']);
  const controls = () => `<div class="factory-controls slide-interaction">
    <button type="button" data-factory-play aria-label="Play factory drawing">Play</button>
    <button type="button" data-factory-reset aria-label="Restart factory drawing">Restart</button>
    <input data-factory-seek type="range" min="0" max="100" step="0.1" value="0" aria-label="Position in factory drawing">
    <span data-factory-phase>Process overview</span>
    <button type="button" data-factory-notes>Drawing notes ↗</button>
    <button type="button" data-factory-focus>Focus view ↗</button></div>`;
  const overview = `<section class="factory-exhibit factory-overview-exhibit" data-factory-viewer="overview">
    <header class="slide-heading"><h2>Different parts. A repeatable process.</h2></header>
    <p class="factory-caption" data-factory-caption hidden>Fourteen connected operations, from timber preparation to a finished rib.</p>
    <div class="factory-surface" data-factory-surface></div>
    <div class="factory-print-overview" data-factory-poster="overview"></div>
    <div class="factory-explore-controls slide-interaction"><p>Explore a station ↗</p><span data-factory-explored>0 / 14 explored</span><button type="button" data-factory-notes>Drawing notes ↗</button><button type="button" data-factory-focus>Focus view ↗</button></div>
    <p class="source-note">Factory development study. Process arrangement, not a validated floor plan. Proposed line; performance and process assumptions require testing.</p>
    </section>`;
  const heroIds = ['05-press', '07-scan', '11-cut'];
  const heroLabels = ['Form', 'Measure', 'Machine'];
  const heroCaptions = ['Robot-set pins guide the form.', 'A scan compares the rib with its target.', 'Joint geometry becomes a cutting sequence.'];
  const heroes = `<section class="factory-exhibit factory-focus-exhibit" data-factory-viewer="focus">
    <header class="slide-heading"><h2>Form. <br>Measure. <br>Machine.</h2></header>
    <div class="factory-hero-picker slide-interaction" role="group" aria-label="Key manufacturing operations">${heroIds.map((id, i) => `<button type="button" data-factory-id="${id}" aria-pressed="${i === 0}"><span>${id.slice(0, 2)}</span>${heroLabels[i]}<b aria-hidden="true">↗</b></button>`).join('')}</div>
    <div class="factory-surface" data-factory-surface></div>${controls()}
    <p class="factory-caption" data-factory-caption>Robot-set pins guide the glued lamellae.</p>
    <div class="factory-print-heroes">${heroIds.map((id, i) => `<figure><h3>${heroLabels[i]}</h3><div data-factory-poster="${id}"></div><figcaption>${heroCaptions[i]}</figcaption></figure>`).join('')}</div>
    <p class="source-note">Factory development studies. Proposed process, not an operating line. Scan deviations are illustrative. Methods and assumptions in Drawing notes.</p>
    </section>`;
  window.DESIGNX_SLIDES = priorSlides.map(slide => {
    const theme = slide.theme.split(' ')[0];
    const template = document.createElement('template');
    template.innerHTML = slide.html.replaceAll('https://www.bowerbuild.org/designx/3', editionUrl).replaceAll('bowerbuild.org/designx/3 <', 'bowerbuild.org/designx/6 <');
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
    if (theme === 'factory-slide') return { ...slide, title: 'Different parts. A repeatable process.', theme: 'factory-slide v5-factory-overview', html: overview, notes: '<p>Daniel’s factory development drawings. Use the station selector to inspect all fourteen operations. The overview is a process arrangement, not a validated floor plan. The line is proposed, not operating. Drawing notes distinguish established methods, Bower-specific proposals and assumptions requiring tests.</p>' };
    if (theme === 'learning-slide') content.querySelector('.fw-intro h2').innerHTML = 'Turn each build<br>into better<br><span class="v4-leaf-text">design rules.</span>';
    if (theme === 'buyers-slide') content.querySelector('.slide-heading h2').innerHTML = 'The first <em>customers.</em>';
    if (theme === 'commercial-model-slide') content.querySelector('.slide-heading h2').innerHTML = '<span class="v4-editorial">Sell a Bower.</span><br>Develop the system.';
    if (theme === 'commercial-loop-slide') {
      content.querySelector('.fw-intro h2').innerHTML = 'Built proof<br>creates <em>demand.</em>';
      content.querySelector('.fw-hub').innerHTML = `<aside class="commercial-visual-note"><h3>Stage visuals to add</h3><p>Clay + Daniel</p><ol>
        <li><strong>Commission</strong> A site and brief.</li><li><strong>Bower</strong> The inhabitable place.</li><li><strong>Reference</strong> A project worth sharing.</li><li><strong>Demand</strong> Interest in the next Bower.</li><li><strong>Reinvest</strong> Better design and production tools.</li></ol>
        <p class="implementation-note">Change the central visual with each stage. Keep one coherent Bower throughout.</p></aside>`;
    }
    if (theme === 'team-slide') content.querySelector('.slide-heading h2').innerHTML = '<span class="v4-editorial">Architecture. Ecology.</span><br>Software. Manufacturing.';
    if (theme === 'closing') content.querySelector('.closing-copy h2').innerHTML = 'Buildings<br>that <em>grow.</em>';
    return { ...slide, theme: `${slide.theme}${technical.has(theme) ? ' v4-laboratory' : ''}`, html: template.innerHTML };
  });

  const factoryIndex = window.DESIGNX_SLIDES.findIndex(slide => slide.theme.includes('v5-factory-overview'));
  window.DESIGNX_SLIDES.splice(factoryIndex + 1, 0, { ...window.DESIGNX_SLIDES[factoryIndex], title: 'Form. Measure. Machine.', theme: 'factory-focus-slide v5-factory-focus', html: heroes, notes: '<p>Three source drawings make the proposed process tangible: robotic pin setting for form, scanning for target comparison, and machining joints. Pin-bed forming and robot milling are established techniques. The proposed Bower contribution is the geometry control and feedback connecting them. Displayed scan deviations are schematic, not measured results. The line has not been built.</p>' });
  window.DESIGNX_META = Object.freeze({ ...window.DESIGNX_META, edition: 6, targetSlideCount: window.DESIGNX_SLIDES.length });

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const thirdLink = document.querySelector('[data-edition-three]');
    const fourthLink = document.querySelector('[data-edition-four]');
    const fifthLink = document.querySelector('[data-edition-five]');
    if (location.protocol === 'file:') {
      thirdLink.href = new URL('../3/index.html', location.href).href;
      fourthLink.href = new URL('../4/index.html', location.href).href;
      fifthLink.href = new URL('../5/index.html', location.href).href;
      queueMicrotask(() => { document.getElementById('pdf-link').href = '5/downloads/Bower_DesignX_Buildings_That_Grow_05.pdf'; });
    }
    document.addEventListener('designx:slidechange', event => {
      const selected = window.DESIGNX_SLIDES[event.detail.index];
      const priorIndex = priorSlides.findIndex(slide => slide.sourceIndex === selected.sourceIndex);
      thirdLink.hash = fourthLink.hash = `slide-${String(Math.max(0, priorIndex) + 1).padStart(2, '0')}`;
      fifthLink.hash = `slide-${String(event.detail.index + 1).padStart(2, '0')}`;
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
  });
})();
