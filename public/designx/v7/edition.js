/* Edition 07: plantability informs geometry alongside fabricatability.
   The biological evaluator is a proposed extension, not a working model. */
(() => {
  'use strict';
  const priorSlides = window.DESIGNX_SLIDES;
  const editionUrl = location.protocol === 'file:' ? location.href.split('#')[0] : 'https://www.bowerbuild.org/designx/v7';
  const replacements = { 'growth-slide': 'growth', 'anatomy-slide': 'anatomy', 'computation-slide': 'computation', 'learning-slide': 'learning' };
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
    if (replacements[theme]) return { ...slide, ...window.DESIGNX_V7_SCENES[replacements[theme]], theme: `v7-${theme}`, act: theme === 'anatomy-slide' ? 'II · The invention' : slide.act };
    if (theme === 'commercial-model-slide') return { ...slide, ...window.DESIGNX_V7_COMMERCIAL, theme: 'v7-commercial-model-slide' };
    const template = document.createElement('template');
    template.innerHTML = slide.html.replaceAll('https://www.bowerbuild.org/designx/3', editionUrl).replaceAll('bowerbuild.org/designx/3 <', 'bowerbuild.org/designx/v7 <');
    let notes = slide.notes;
    let title = slide.title;
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
    if (theme === 'cover') {
      content.querySelector('h1').innerHTML = 'Buildings<br>that <em>grow.</em>';
      notes = 'Bower is developing a place shaped by living processes, and the means to make that proposition repeatable. The first product combines an engineered timber frame with planting; the plants are not assumed to carry the engineered load path. The following sequence shows how intended growth can influence the design itself, before fabrication. The first Bower, full biological feedback system and operating factory are not presented as complete.';
    }
    if (theme === 'factory-slide') return { ...slide, title: 'Different parts. A repeatable process.', theme: 'factory-slide v5-factory-overview', html: overview, notes: 'Geometry needs a route into material. These are Daniel’s actual factory development drawings, exploring how to fabricate varied components reliably. Proposed plantability checks would influence the geometry upstream; the resulting form still needs parts, joints and an assembly process. Select any station to explore it. This is a process arrangement, not a validated floor plan. The line is proposed, not operating; source notes distinguish established methods and assumptions requiring tests.' };
    if (theme === 'buyers-slide') content.querySelector('.slide-heading h2').innerHTML = 'The first <em>customers.</em>';
    if (theme === 'commercial-loop-slide') {
      content.querySelector('.fw-intro h2').innerHTML = 'Built proof<br>creates <em>demand.</em>';
      content.querySelector('.fw-hub').innerHTML = `<aside class="commercial-visual-note"><h3>Stage visuals to add</h3><p>Clay + Daniel</p><ol>
        <li><strong>Commission</strong> A site and brief.</li><li><strong>Bower</strong> The inhabitable place.</li><li><strong>Reference</strong> A project worth sharing.</li><li><strong>Demand</strong> Interest in the next Bower.</li><li><strong>Reinvest</strong> Better design and production tools.</li></ol>
        <p class="implementation-note">Change the central visual with each stage. Keep one coherent Bower throughout.</p></aside>`;
    }
    if (theme === 'team-slide') content.querySelector('.slide-heading h2').innerHTML = '<span class="v4-editorial">Architecture. Ecology.</span><br>Software. Manufacturing.';
    if (theme === 'coupled-slide') {
      title = 'Every Bower can teach the next.';
      content.querySelector('.fw-coupled-title h2').innerHTML = 'Every Bower<br>can teach <em>the next.</em>';
      content.querySelector('.fw-system-technical h3').innerHTML = 'Making<br>+ growing.';
      for (const [position, label] of Object.entries({ north: 'Geometry', east: 'Fabrication', south: 'Biology', west: 'Observe' })) content.querySelector(`.fw-system-technical .${position}`).textContent = label;
      content.querySelector('.mission-bridge').textContent = 'The place, the making and the planting inform the next Bower.';
      content.querySelector('.fw-bridge-label-top').textContent = 'PROJECTS + OBSERVATIONS';
      content.querySelector('.fw-bridge-label-bottom').textContent = 'BETTER DESIGN RULES';
      content.querySelector('.fw-qualification').textContent = 'Intended learning and commercial systems. Plantability rules require validation; further development depends on project economics and finance.';
      notes = 'A commission provides a real setting in which architecture, fabrication and plant establishment can be evaluated together. Biology should influence initial geometry through proposed plantability checks. Observations after installation could then test and improve those rules. The commercial loop supports this work through projects, references and possible reinvestment. Early commissions do not automatically finance a factory or a complete biological research programme. Both loops remain development objectives.';
    }
    if (theme === 'future-slide') {
      content.querySelector('.future-standfirst').textContent = 'Learn in a room. Explore what that knowledge could make possible.';
      notes = 'The first inhabitable room is a manageable place to test how structure and planting develop together. The repeatable capability concerns designing and making conditions for living architecture. Larger buildings, streets and urban applications are research possibilities, not an engineered delivery roadmap. Their feasibility, maintenance needs and lifecycle performance remain to be demonstrated.';
    }
    if (theme === 'closing') {
      content.querySelector('.closing-copy h2').innerHTML = 'Buildings<br>that <em>grow.</em>';
      notes = 'Return to a place whose growth is part of its architecture. The immediate task is the first Bower and a design method in which fabricatability and proposed plantability checks inform the same geometry. Preserve the full emotional founder thesis on the slide. The call is to develop this capability, not to claim the complete biological learning system already operates.';
    }
    return { ...slide, title, notes, html: template.innerHTML };
  });

  const factoryIndex = window.DESIGNX_SLIDES.findIndex(slide => slide.theme.includes('v5-factory-overview'));
  window.DESIGNX_SLIDES.splice(factoryIndex + 1, 0, { ...window.DESIGNX_SLIDES[factoryIndex], title: 'Form. Measure. Machine.', theme: 'factory-focus-slide v5-factory-focus', html: heroes, notes: 'These source studies show the fabrication side: robotic pin setting, scanning against a target, and machining joints. Geometry, measurement and manufacture have to agree. The proposed biological extension adds another source of design requirements while retaining these engineering checks. Pin-bed forming and robot milling are established techniques; Bower is developing their geometry control and feedback. Scan deviations are schematic, not measured outcomes. The line has not been built.' });
  // Keep comparison links tied to the existing scenes when this edition adds one.
  window.DESIGNX_SLIDES.forEach((slide, index) => { slide.comparisonIndex = index; });
  const learningIndex = window.DESIGNX_SLIDES.findIndex(slide => slide.theme === 'v7-learning-slide');
  window.DESIGNX_SLIDES.splice(learningIndex + 1, 0, {
    ...window.DESIGNX_SLIDES[learningIndex],
    ...window.DESIGNX_V7_FLOW,
    theme: 'v7-learning-flow-slide',
  });
  window.DESIGNX_META = Object.freeze({ ...window.DESIGNX_META, edition: 7, targetSlideCount: window.DESIGNX_SLIDES.length });

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const thirdLink = document.querySelector('[data-edition-three]');
    const fourthLink = document.querySelector('[data-edition-four]');
    const fifthLink = document.querySelector('[data-edition-five]');
    const sixthLink = document.querySelector('[data-edition-six]');
    if (location.protocol === 'file:') {
      thirdLink.href = new URL('../3/index.html', location.href).href;
      fourthLink.href = new URL('../4/index.html', location.href).href;
      fifthLink.href = new URL('../5/index.html', location.href).href;
      sixthLink.href = new URL('../6/index.html', location.href).href;
      queueMicrotask(() => { document.getElementById('pdf-link').href = 'v7/downloads/Bower_DesignX_Buildings_That_Grow_07.pdf'; });
    }
    document.addEventListener('designx:slidechange', event => {
      const selected = window.DESIGNX_SLIDES[event.detail.index];
      const priorIndex = priorSlides.findIndex(slide => slide.sourceIndex === selected.sourceIndex);
      thirdLink.hash = fourthLink.hash = `slide-${String(Math.max(0, priorIndex) + 1).padStart(2, '0')}`;
      fifthLink.hash = sixthLink.hash = `slide-${String(selected.comparisonIndex + 1).padStart(2, '0')}`;
    });
  });
})();
