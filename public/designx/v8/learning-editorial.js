/* Clarify project phases while preserving the existing explorable learning trace. */
(() => {
  'use strict';
  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const scene = root.querySelector('[data-v7-flow]');
    if (!scene) return;
    scene.classList.add('v8-learning-consolidated');
    const phases = scene.querySelectorAll('.v7flow-phase');
    phases[0].textContent = 'Designing each Bower';
    phases[1].textContent = 'Making and living with it';
    scene.querySelector('.v7flow-status').textContent = 'Digital geometry and growth studies exist. Integrated checks and evidence from built Bowers are in development.';
    scene.querySelector('.v7flow-print-summary').textContent = 'Design a support route. Observe establishment and care. Review the evidence. Refine the next design.';
    // Begin with a specific question, then let the presenter open the wider information flow.
    scene.querySelector('[data-v7flow-select="growing"]').click();
  });
})();
