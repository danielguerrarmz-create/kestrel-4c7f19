/* Clarify project phases while preserving the existing explorable learning trace. */
(() => {
  'use strict';
  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const scene = root.querySelector('[data-v7-flow]');
    if (!scene) return;
    scene.classList.add('v8-learning-consolidated');
    const phases = scene.querySelectorAll('.v7flow-phase');
    phases[0].textContent = 'Designing each Bower';
    phases[0].setAttribute('x', '45');
    phases[0].setAttribute('y', '305');
    phases[1].textContent = 'Making and living with it';
    // Widen the brief to the left, keeping its existing connection to Geometry.
    const inputs = scene.querySelector('[data-v7flow-node="inputs"]');
    inputs.setAttribute('transform', 'translate(45 345)');
    inputs.querySelector('rect').setAttribute('width', '200');
    inputs.querySelectorAll('text').forEach((line, index) => {
      line.setAttribute('x', '18');
      line.setAttribute('y', [39, 73, 99, 125][index]);
    });
    scene.querySelector('.v7flow-status').textContent = 'Digital geometry and growth studies exist. Integrated checks and evidence from built Bowers are in development.';
    scene.querySelector('.v7flow-print-summary').textContent = 'Design a support route. Observe establishment and care. Review the evidence. Refine the next design.';
    // Begin with a specific question, then let the presenter open the wider information flow.
    scene.querySelector('[data-v7flow-select="growing"]').click();
  });
})();
