/* Editorial and layout changes for the Version 10 presentation. */
(() => {
  'use strict';
  const slides = window.DESIGNX_SLIDES;
  function edit(theme, update, title) {
    const slide = slides.find(item => item.theme.split(' ').includes(theme));
    const template = document.createElement('template');
    template.innerHTML = slide.html;
    update(template.content);
    slide.html = template.innerHTML;
    if (title) slide.title = title;
  }

  edit('cover', content => content.querySelector('.cover-bottom').remove());
  edit('closing', content => content.querySelector('.closing-bottom').remove());

  edit('v8-canopy-orbit-slide', content => {
    content.querySelector('.v7-title').classList.add('sr-only');
  });

  edit('variability-slide', content => {
    content.querySelectorAll('.living-image-caption, [data-opening-motion], .living-parts-caption > span')
      .forEach(element => element.remove());
    // Both passages turn from natural variation to production after the line break.
    for (const passage of content.querySelectorAll('.living-explanation, .living-opportunity blockquote')) {
      const lineBreak = passage.querySelector('br');
      const production = document.createElement('span');
      production.className = 'production-line';
      while (lineBreak.nextSibling) production.append(lineBreak.nextSibling);
      lineBreak.after(production);
    }
  });

  edit('v5-factory-overview', content => {
    content.querySelector('.slide-heading h2').textContent = 'Variability in Manufacturing';
    content.querySelector('[data-factory-focus]').remove();
    const intro = content.querySelector('.factory-explore-controls p');
    intro.className = 'factory-intro v10-takeaway';
    intro.innerHTML = 'We imagine a factory built around the shape of each timber rib. <span class="station-invitation">Select a station to see how it would work.</span>';
    intro.parentElement.before(intro);
    content.querySelector('.source-note').remove();
  }, 'Variability in Manufacturing');

  edit('v5-factory-focus', content => {
    const scene = content.querySelector('.factory-focus-exhibit');
    scene.removeAttribute('data-factory-viewer');
    scene.querySelector('.source-note').remove();
    scene.setAttribute('data-factory-sequence', '');
    scene.setAttribute('aria-label', 'Form, measure, machine');
    scene.querySelectorAll('.slide-heading, .factory-hero-picker, .factory-surface, .factory-controls, .factory-caption')
      .forEach(element => element.remove());
    const panels = [
      ['05-press', 'Form', 'Adjustable pins shape the glued timber layers. Yokes hold them in place as the rib cures.'],
      ['07-scan', 'Measure', 'Scan the released rib and compare its measured shape with the target geometry.'],
      ['11-cut', 'Machine', 'Mill the joints and scan the cut faces to check them against the design.']
    ];
    scene.insertAdjacentHTML('afterbegin', `<div class="v8-factory-sequence slide-interaction">
      <div class="v8-factory-panels">
        ${panels.map(([id, label], i) => `<section class="v8-factory-panel${i === 0 ? ' is-playing' : ''}">
          <h2>${label}</h2><div data-sequence-drawing="${id}"></div>
        </section>`).join('')}
      </div>
      <div class="v8-factory-transport"></div>
    </div>`);
    scene.insertAdjacentHTML('beforeend', `<div class="v8-factory-narrations">
      ${panels.map(([, , caption], i) => `<p class="v8-factory-narration${i === 0 ? ' is-current' : ''}">${caption}</p>`).join('')}
    </div>`);
  });

  edit('buyers-slide', content => {
    content.querySelector('.source-note').remove();
    content.querySelector('.slide-heading h2').innerHTML = 'Our first <em>customers.</em>';
  }, 'Our first customers.');

  edit('v8-reference-slide', content => {
    content.querySelector('.v8-reference-kicker').remove();
    content.querySelector('.v8-reference-title').innerHTML = 'A Bower<br>people can visit';
    content.querySelector('.v8-reference-evidence').textContent = 'In conversations with cultural institutions and estate owners, one request kept coming up. They wanted to see a completed Bower.';
    content.querySelector('.v8-reference-ask').textContent = 'We’re looking for a site partner for the first Bower.';
    content.querySelector('.v8-reference-ask').classList.add('v10-takeaway');
  }, 'A Bower people can visit');

  edit('v7-commercial-model-slide', content => {
    content.querySelector('.v7commercial-title').innerHTML = 'Bower’s first <em>three steps</em>';
    content.querySelectorAll('.v7commercial-step > span').forEach(number => number.remove());
  }, 'Bower’s first three steps');

  const learning = slides.find(slide => slide.html.includes('data-v7-flow'));
  Object.assign(learning, window.DESIGNX_V10_DREAMING);
  window.DESIGNX_META = Object.freeze({ ...window.DESIGNX_META, edition: 10 });

  edit('material-problem-slide', content => {
    content.querySelector('h1').innerHTML = 'Building the world<br> <em>anew</em>';
  }, 'Building the world anew');

  for (const slide of slides) {
    const template = document.createElement('template');
    template.innerHTML = slide.html;
    template.content.querySelectorAll('h1 em, h2 em, h3 em').forEach(em => em.replaceWith(...em.childNodes));
    template.content.querySelectorAll('a, button, .factory-explore-controls > p').forEach(element => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const arrows = /[\u2190-\u21ff\u27f0-\u27ff]/u;
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        if (!arrows.test(text.data)) continue;
        text.data = text.data.replace(/\s*[\u2190-\u21ff\u27f0-\u27ff]\s*/gu, ' ').trim();
        if (element.matches('a, button')) element.classList.add('v8-text-action');
      }
    });
    slide.html = template.innerHTML;
  }
})();
