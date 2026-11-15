/* Edition 08: simplify the projection slide's visible controls and attribution. */
(() => {
  'use strict';
  window.DESIGNX_V8_PROBLEM = original => {
    const template = document.createElement('template');
    template.innerHTML = original.html;
    const content = template.content;
    const scene = content.querySelector('.material-problem');
    if (!scene) return original;
    scene.querySelectorAll('[data-opening-motion]').forEach(element => element.remove());
    scene.querySelectorAll('.opening-sources > span').forEach(element => {
      if (element.textContent.trim() === 'Generated illustration') element.remove();
    });
    // The inherited motion mount safely accepts an empty control list. Its
    // image drift, off-slide pause and reduced-motion rules remain unchanged.
    return { ...original, html:template.innerHTML };
  };
})();
