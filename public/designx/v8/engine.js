/* Edition 08: restore the v7 engine explanation beside the particular pier study. */
(() => {
  'use strict';

  const considerations = {
    fabrication: [
      { label: 'Forming', text: 'Revisit member curvature around a viable forming method.' },
      { label: 'Connections', text: 'Adjust the geometry so a connection can be made and checked.' },
      { label: 'Assembly', text: 'Reconsider the arrangement around access and assembly sequence.' }
    ],
    planting: [
      { label: 'Reach', text: 'Revisit support spacing around the intended planting’s growth habit.' },
      { label: 'Light', text: 'Explore orientation and openings around the intended living canopy.' },
      { label: 'Establishment', text: 'Connect the frame to a credible place for plants to establish.' }
    ],
    cost: [
      { label: 'Materials', text: 'Compare geometry-dependent quantities and dated supplier quotes with the client’s agreed budget.' },
      { label: 'Complexity', text: 'Test how unique parts and production steps affect whether the design fits that budget.' },
      { label: 'Installation', text: 'Include transport, access and assembly time when testing the installed cost against the budget.' }
    ]
  };
  const labels = {
    fabrication: 'Possible fabrication response',
    planting: 'Possible planting response',
    cost: 'Possible budget response'
  };
  const choices = (side, label) => `<div class="v7-check-choices slide-interaction" role="group" aria-label="${label}">${considerations[side].map((item, index) => `<button type="button" data-v8-engine-check="${side}:${index}" aria-pressed="${side === 'fabrication' && index === 0}" aria-controls="v8-engine-readout">${item.label}</button>`).join('')}</div>`;

  window.DESIGNX_V8_ENGINE = {
    title: 'Can we make it? Can it grow? Can we afford it?',
    theme: 'v8-engine-slide',
    html: `<section class="v7-scene v7-computation v8-engine" data-v8-engine data-v8-engine-side="fabrication" aria-labelledby="v8-engine-title">
      <h2 id="v8-engine-title" class="v8-engine-kicker">The design engine</h2>
      <section class="v7-check-panel v7-fabrication-panel" aria-labelledby="v8-engine-fabrication">
        <h3 id="v8-engine-fabrication" class="v8-engine-question">Can we<br><em>make it?</em></h3>
        <h4>Fabricatability</h4>
        <p class="v7-check-description">Can we make and assemble the form?</p>
        ${choices('fabrication', 'Example fabrication considerations')}
        <a class="v7-study-link" href="6/#slide-06" target="_blank" rel="noopener">Current geometry study ↗</a>
      </section>
      <section class="v7-check-panel v7-planting-panel" aria-labelledby="v8-engine-planting">
        <h3 id="v8-engine-planting" class="v8-engine-question">Can it<br><em>grow?</em></h3>
        <h4>Plantability</h4>
        <p class="v7-check-description">Does the form support the intended growth?</p>
        ${choices('planting', 'Example proposed plantability considerations')}
        <p class="v7-capability">Growth studies exist.<br>Integrated checks proposed.</p>
      </section>
      <section class="v7-check-panel v7-cost-panel" aria-labelledby="v8-engine-cost">
        <h3 id="v8-engine-cost" class="v8-engine-question">Can we<br><em>afford it?</em></h3>
        <h4>Cost</h4>
        <p class="v7-check-description">Can this design fit the client’s budget?</p>
        ${choices('cost', 'Example proposed cost and affordability considerations')}
        <p class="v7-capability">Proposed cost and budget checks.</p>
      </section>
      <div id="v8-engine-readout" class="v7-nudge-readout" aria-live="polite" aria-atomic="true">
        <span data-v8-engine-label>${labels.fabrication}</span>
        <p data-v8-engine-text>${considerations.fabrication[0].text}</p>
      </div>
      <div class="v7-print-summary v7-check-summary">
        <p><strong>Making informs geometry.</strong> Forming, connections and assembly.</p>
        <p><strong>Growth informs geometry.</strong> Reach, light and establishment.</p>
        <p><strong>The budget informs geometry.</strong> Quantities, processes and installation.</p>
      </div>
    </section>`,
    notes: 'This restores the original v7 explanation of the engine as a distinct part of the argument. The adjacent pier study shows a particular design decision and its consequences. Here we explain the intended method for deriving and comparing those questions across a design. Fabricatability asks whether members, connections and the assembly can be made. Plantability asks whether the form provides the conditions for the intended growth and architectural experience. Cost asks whether the proposed scope can fit the client’s agreed budget, using geometry-dependent quantities, production and installation assumptions, dated supplier quotes and eventually evidence from making. Affordability is a feasibility question, not a claim that the engine finds the cheapest form. All three inform shared geometry. The designer reconciles the trade-offs and retains responsibility for revising the proposal. Existing code generates timber members and joints, reports geometric quantities and supports plant-growth studies. These are distinct developments, not a demonstrated integrated evaluation engine. The building subsystem explicitly labels its geometry and clearances as provisional and does not establish structural or fabrication adequacy. Plant rates and behaviour largely use provisional assumptions. Integrated plantability checks and a calibrated monetary cost or budget evaluator remain proposed. The controls on this slide select authored examples. They do not regenerate geometry, run growth, obtain prices, calculate a budget, or certify feasibility.',
    source: 'Adapted for v8 from the original computation scene in deck/designx/v7/living.js and the three-question version in Bower_Web/public/designx/v7/living.js. Capability wording checked against bower-blender/bower/member.py, timber.py and snapshot.py, Horti-code-ture/packages/core/src/sim/engine.ts, and the existing drawings-in-code pipeline. Cost and plantability integration remain proposed.'
  };

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    root.querySelectorAll('[data-v8-engine]').forEach(scene => {
      if (scene.dataset.v8EngineMounted === 'true') return;
      scene.dataset.v8EngineMounted = 'true';
      const buttons = [...scene.querySelectorAll('[data-v8-engine-check]')];
      buttons.forEach(button => {
        button.addEventListener('keydown', event => {
          if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' '].includes(event.key)) event.stopPropagation();
        });
        button.addEventListener('click', () => {
          const [side, index] = button.dataset.v8EngineCheck.split(':');
          const item = considerations[side]?.[Number(index)];
          if (!item) return;
          buttons.forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate === button)));
          scene.dataset.v8EngineSide = side;
          scene.querySelector('[data-v8-engine-label]').textContent = labels[side];
          scene.querySelector('[data-v8-engine-text]').textContent = item.text;
        });
      });
    });
  });
})();
