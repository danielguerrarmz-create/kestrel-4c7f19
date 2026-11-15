/* Edition 08: a separate, quieter study of the learning diagram. */
(() => {
  'use strict';

  const questions = {
    making: {
      title: 'Can we <em>make it?</em>',
      label: 'Can we make it?',
      scope: 'Members · joints · assembly',
      detailTitle: 'A change in curvature',
      detail: 'A forming limit can reshape a member. That revision changes its joints, the assembly sequence and the resulting room.'
    },
    growing: {
      title: 'Can it <em>grow?</em>',
      label: 'Can it grow?',
      scope: 'Rooting · light · support · care',
      detailTitle: 'A place to establish',
      detail: 'A viable root zone and reachable support can move a pier or change an opening. Making and cost then need to be reconsidered.'
    },
    cost: {
      title: 'Can we <em>afford it?</em>',
      label: 'Can we afford it?',
      scope: 'Quantities · process · installation',
      detailTitle: 'A design within the budget',
      detail: 'More unique parts or a harder installation can exceed the budget. Revisit the form, process or scope before releasing the design.'
    }
  };

  const questionButtons = Object.entries(questions).map(([key, question]) => `
    <button type="button" class="v8lq-question v8lq-question--${key} slide-interaction"
      data-v8-lq-question="${key}" aria-pressed="${key === 'making'}"
      aria-label="${question.label} Explore a design consequence" aria-controls="v8-lq-readout">
      <span class="v8lq-question-title">${question.title}</span>
      <span class="v8lq-question-scope">${question.scope}</span>
    </button>`).join('');

  window.DESIGNX_V8_LEARNING_QUESTIONS = {
    title: 'How the system learns — three questions',
    theme: 'v8-learning-questions-slide',
    html: `<section class="v8lq-scene" data-v8-learning-questions data-v8-lq-selected="making" aria-labelledby="v8-lq-title">
      <h2 class="v8lq-title" id="v8-lq-title">How the system <em>learns.</em></h2>

      <svg class="v8lq-links" viewBox="0 0 1600 900" aria-hidden="true" focusable="false">
        <defs>
          <marker id="v8-lq-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 L7 4 L1 7" fill="none" stroke="context-stroke" stroke-width="1.1"/></marker>
        </defs>
        <g class="v8lq-paths">
          <path class="v8lq-arrow" d="M255 446 H300"/>
          <path d="M505 446 H545 M545 300 V580"/>
          <path class="v8lq-arrow v8lq-check-path v8lq-path--making" d="M545 300 H585"/>
          <path class="v8lq-arrow v8lq-check-path v8lq-path--growing" d="M545 440 H585"/>
          <path class="v8lq-arrow v8lq-check-path v8lq-path--cost" d="M545 580 H585"/>
          <path class="v8lq-check-path v8lq-path--making" d="M925 300 H965"/>
          <path class="v8lq-check-path v8lq-path--growing" d="M925 440 H965"/>
          <path class="v8lq-check-path v8lq-path--cost" d="M925 580 H965"/>
          <path d="M965 300 V580"/>
          <path class="v8lq-arrow" d="M965 446 H1015"/>
          <path class="v8lq-arrow v8lq-revise" d="M1112 390 V195 H402 V390"/>
          <path class="v8lq-arrow" d="M1210 446 H1250 V330 H1290"/>
          <path class="v8lq-arrow" d="M1410 385 V485"/>
          <path class="v8lq-evidence-path" d="M1530 330 H1560 V717 M1530 540 H1560"/>
          <path class="v8lq-arrow v8lq-evidence-path" d="M1560 717 H1380"/>
          <path class="v8lq-arrow v8lq-evidence-path" d="M1050 717 H925"/>
          <path class="v8lq-arrow v8lq-evidence-path" d="M585 717 H402 V502"/>
        </g>
        <g class="v8lq-edge-labels">
          <text x="755" y="181" text-anchor="middle">revise the proposal</text>
          <text x="1252" y="313" text-anchor="middle">release</text>
          <text x="1410" y="439" text-anchor="middle">establish + inhabit</text>
          <text x="988" y="665" text-anchor="middle">supported findings</text>
          <text x="420" y="698">next design</text>
        </g>
      </svg>

      <div class="v8lq-node v8lq-brief">
        <h3>Intent + site</h3>
        <p>Place · living conditions<br>Customer budget</p>
      </div>
      <div class="v8lq-node v8lq-geometry">
        <h3>Geometry</h3>
        <p>A candidate form</p>
      </div>

      <div class="v8lq-questions" role="group" aria-label="Explore three questions about the same design">${questionButtons}</div>

      <div class="v8lq-node v8lq-review">
        <h3>Designer review</h3>
        <p>Structure · access<br>Experience</p>
      </div>
      <div class="v8lq-node v8lq-making">
        <h3>Make + assemble</h3>
        <p>Form · measure · machine</p>
      </div>
      <div class="v8lq-node v8lq-living">
        <h3>A living Bower</h3>
        <p>Grow · inhabit · tend</p>
      </div>

      <div class="v8lq-node v8lq-evidence">
        <h3>Review the evidence</h3>
        <p>Making · growth · use · care</p>
      </div>
      <div class="v8lq-node v8lq-rules">
        <h3>Revise the design rules</h3>
        <p>Geometry · methods · assumptions</p>
      </div>

      <div class="v8lq-readout" id="v8-lq-readout" aria-live="polite" aria-atomic="true">
        <h3 data-v8-lq-detail-title>${questions.making.detailTitle}</h3>
        <p data-v8-lq-detail>${questions.making.detail}</p>
      </div>
      <div class="v8lq-print-detail">
        <p><strong>Making.</strong> Forming limits, connections and assembly inform the geometry.</p>
        <p><strong>Growing.</strong> Roots, light, support and care inform the living room.</p>
        <p><strong>Cost.</strong> Quantities, production and installation must fit the budget.</p>
      </div>
    </section>`,
    notes: 'This is a comparison study of the learning diagram, retaining the original slide and the separate design-engine slide. The three questions describe parallel considerations of the same candidate design. Making asks about members, connections and assembly; growing asks whether the intended plants have rooting space, suitable light, reachable support and access for care; affordability asks whether the proposed scope fits the client’s agreed budget. A designer reviews these consequences together with structure, access and architectural experience, revises the candidate or releases it to making. The diagram’s return path describes a proposed learning process across two timescales: measured geometry, time, material yield and cost during making; then establishment, growth, occupation and tending through the life of a real Bower. Observations need context, comparison with the design intent and review before supported findings become revised rules. Rules can update geometry, methods and assumptions used in the three checks. One supplier quote, fabrication result or planting observation is not by itself a general rule. Existing timber geometry and growth studies support the work. Integrated plantability and budget checks, and evidence from completed Bowers, remain in development. The three clickable questions reveal authored examples of possible design consequences; no evaluator, geometry generator, price service or growth simulation runs here. The print view retains all three considerations.',
    source: 'A v8 comparison study derived from deck/designx/v7/learning-flow.js, deck/designx/v8/learning-trace.js and learning-editorial.js, and the three questions in deck/designx/v8/engine.js. Architectural intention and evidence distinctions follow VISION.md. No new performance or cost evidence is asserted.'
  };

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    root.querySelectorAll('[data-v8-learning-questions]').forEach(scene => {
      if (scene.dataset.v8LqMounted === 'true') return;
      scene.dataset.v8LqMounted = 'true';
      const buttons = [...scene.querySelectorAll('[data-v8-lq-question]')];
      const detailTitle = scene.querySelector('[data-v8-lq-detail-title]');
      const detail = scene.querySelector('[data-v8-lq-detail]');
      const select = button => {
        const key = button.dataset.v8LqQuestion;
        const question = questions[key];
        if (!question) return;
        scene.dataset.v8LqSelected = key;
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        detailTitle.textContent = question.detailTitle;
        detail.textContent = question.detail;
      };

      buttons.forEach((button, index) => {
        button.addEventListener('click', () => select(button));
        button.addEventListener('keydown', event => {
          const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
          if (event.key === ' ' || event.key === 'Enter') event.stopPropagation();
          if (!keys.includes(event.key)) return;
          event.preventDefault();
          event.stopPropagation();
          const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
            : (index + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length;
          buttons[nextIndex].focus();
          select(buttons[nextIndex]);
        });
      });
    });
  });
})();
