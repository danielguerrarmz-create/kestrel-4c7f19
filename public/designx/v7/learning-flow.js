/* Edition 07: an intended information flow, not a working design evaluator. */
(() => {
  'use strict';

  const modes = [
    { id: 'all', label: 'Whole system', line: 'Design together. Measure what is made. Observe what grows. Improve the next design.' },
    { id: 'design', label: 'Design', line: 'Before building, making and growth both challenge the same geometry.' },
    { id: 'making', label: 'Making', line: 'Measurements from making can inform the next design before the plants mature.' },
    { id: 'growing', label: 'Growing', line: 'Growth, use and tending test whether the Bower becomes the place we intended.' }
  ];

  const arrow = (d, tone, modes, labels = '') => `<g class="v7flow-link v7flow-${tone}" data-v7flow-in="${modes}"><path d="${d}" marker-end="url(#v7flow-arrow-${tone})"/>${labels}</g>`;
  const label = (x, y, text, anchor = 'middle') => `<text class="v7flow-edge-label" x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;
  const node = (id, x, y, width, height, tone, modes, text) => `<g class="v7flow-node v7flow-${tone}" data-v7flow-node="${id}" data-v7flow-in="${modes}" transform="translate(${x} ${y})"><rect width="${width}" height="${height}"/>${text}</g>`;
  const text = (x, y, content, className = 'v7flow-node-title') => `<text class="${className}" x="${x}" y="${y}">${content}</text>`;

  window.DESIGNX_V7_FLOW = {
    title: 'How the system learns.',
    html: `<section class="v7flow-scene" data-v7-flow data-v7flow-mode="all">
      <h2 class="v7flow-title">How the system <em>learns.</em></h2>
      <div class="v7flow-controls slide-interaction" role="group" aria-label="Follow the learning system">
        ${modes.map(mode => `<button type="button" data-v7flow-select="${mode.id}" aria-pressed="${mode.id === 'all'}" aria-controls="v7flow-diagram v7flow-readout">${mode.label}</button>`).join('')}
      </div>
      <svg id="v7flow-diagram" class="v7flow-diagram" viewBox="0 0 1600 900" role="img" aria-labelledby="v7flow-diagram-title v7flow-diagram-desc">
        <title id="v7flow-diagram-title">Bower’s intended design and learning flow</title>
        <desc id="v7flow-diagram-desc">Intent, site, plants and materials inform candidate geometry. Fabricatability and proposed plantability checks are considered together by the designer, alongside structure, cost, access and experience. The designer can revise the geometry or release it for making and assembly. The Bower is then planted, occupied and tended. Measurements during making, and later observations of growth and use, separately enter a review and validation step. Supported findings can revise design rules for geometry and both sets of checks. The biological checks and physical feedback loops remain proposed.</desc>
        <defs>
          ${['ink', 'rust', 'leaf'].map(tone => `<marker id="v7flow-arrow-${tone}" class="v7flow-marker-${tone}" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1L7.5 4.5L1 8" fill="none" stroke-width="1.8"/></marker>`).join('')}
        </defs>

        <text class="v7flow-phase" x="75" y="210">Before building</text>
        <text class="v7flow-phase" x="1245" y="210">Making + growth</text>
        <g class="v7flow-check-frame" data-v7flow-in="design making growing"><path d="M605 230H580V655H880V230H855"/></g>

        ${arrow('M245 415H305', 'ink', 'design', label(274, 403, 'brief'))}
        ${arrow('M505 415H550V307H600', 'rust', 'design making', label(547, 397, 'test', 'end'))}
        ${arrow('M550 415V560H600', 'leaf', 'design growing')}
        ${arrow('M860 307H915L963 352', 'rust', 'design making', label(935, 285, 'limits + options'))}
        ${arrow('M860 560H915L963 478', 'leaf', 'design growing', label(918, 589, 'growth needs'))}
        ${arrow('M1030 287V207H405V345', 'ink', 'design', label(723, 194, 'revise the candidate'))}
        ${arrow('M1166 415H1205V315H1245', 'ink', 'design making', label(1198, 291, 'release', 'end'))}
        ${arrow('M1400 385V500', 'leaf', 'growing', label(1421, 445, 'plant + occupy', 'start'))}

        ${arrow('M1270 385V435H1185V689H1220V720', 'rust', 'making', `${label(1167, 611, 'as-made', 'end')}${label(1167, 634, 'measurements', 'end')}`)}
        ${arrow('M1400 640V720', 'leaf', 'growing', label(1421, 687, 'growth + use', 'start'))}
        ${arrow('M1070 764H840', 'ink', 'making growing', label(956, 750, 'supported findings'))}
        ${arrow('M440 764H270V565H360V490', 'ink', 'making growing', `${label(287, 665, 'update', 'start')}${label(287, 688, 'geometry', 'start')}`)}
        ${arrow('M730 720V655', 'ink', 'making growing', label(751, 691, 'update checks', 'start'))}

        ${node('inputs', 75, 345, 170, 145, 'plain', 'design', `${text(15, 43, 'Intent + site')}${text(15, 83, 'Space · climate', 'v7flow-node-copy')}${text(15, 110, 'Plants · materials', 'v7flow-node-copy')}`)}
        ${node('geometry', 305, 345, 200, 145, 'geometry', 'design making growing', `${text(20, 58, 'Geometry')}${text(20, 98, 'Candidate form', 'v7flow-node-copy')}`)}
        ${node('fabrication', 600, 250, 260, 115, 'rust', 'design making', `${text(18, 39, 'Fabricatability')}${text(18, 74, 'Parts · joints · process', 'v7flow-node-copy')}${text(18, 99, 'Tolerances · assembly', 'v7flow-node-copy')}`)}
        ${node('plantability', 600, 495, 260, 140, 'leaf', 'design growing', `${text(18, 39, 'Plantability')}${text(18, 74, 'Rooting · reach · light', 'v7flow-node-copy')}${text(18, 99, 'Seasons · tending', 'v7flow-node-copy')}${text(18, 124, 'Proposed extension', 'v7flow-node-status')}`)}

        <g class="v7flow-node v7flow-decision" data-v7flow-node="review" data-v7flow-in="design making growing">
          <path d="M1030 287L1166 415L1030 543L894 415Z"/>
          <text class="v7flow-decision-title" x="1030" y="382" text-anchor="middle">Designer</text>
          <text class="v7flow-decision-title" x="1030" y="420" text-anchor="middle">review</text>
          <text class="v7flow-decision-copy" x="1030" y="445" text-anchor="middle">Structure · cost</text>
          <text class="v7flow-decision-copy" x="1030" y="467" text-anchor="middle">access · experience</text>
        </g>

        ${node('making', 1245, 245, 280, 140, 'rust', 'making', `${text(18, 43, 'Make + assemble')}${text(18, 82, 'Form · scan · machine', 'v7flow-node-copy')}${text(18, 109, 'Check against the design', 'v7flow-node-copy')}`)}
        ${node('living', 1245, 500, 280, 140, 'leaf', 'growing', `${text(18, 43, 'Living Bower')}${text(18, 82, 'Establish · inhabit · tend', 'v7flow-node-copy')}${text(18, 109, 'Observe across seasons', 'v7flow-node-copy')}`)}
        ${node('validation', 1070, 720, 455, 90, 'validation', 'making growing', `${text(20, 38, 'Review + validate evidence')}${text(20, 68, 'Compare intended and observed outcomes.', 'v7flow-node-copy')}`)}
        ${node('rules', 440, 720, 400, 90, 'rules', 'making growing', `${text(20, 38, 'Revise design rules')}${text(20, 68, 'Geometry · making · growth', 'v7flow-node-copy')}`)}
      </svg>
      <p id="v7flow-readout" class="v7flow-readout" data-v7flow-readout aria-live="polite">${modes[0].line}</p>
      <p class="v7flow-print-summary">Design together. Measure what is made. Observe what grows. Improve the next design.</p>
      <p class="v7flow-status">Intended integration. Geometry + fabrication in development; plantability checks and physical feedback are proposed.</p>
    </section>`,
    notes: 'This is the proposed information architecture of one learning system, rather than three separate disciplines or a claim that an autonomous system already exists. Start with the space we want to create, the site and climate, candidate plants, available materials and practical requirements. These inform candidate geometry. During design, fabricatability and proposed plantability checks operate in parallel on that same candidate: making concerns include parts, joints, processes, tolerances and assembly; planting concerns include a credible rooting environment, continuity and reach of support, light, seasonal occupation and tending. Neither set of checks chooses the answer on its own. The designer reconciles their findings with structure, cost, access, maintenance and the intended experience, revises the candidate as necessary, and authorises a coordinated design for making. The drawing intentionally retains this human decision point. Making, scanning and assembly create an earlier evidence stream: compare the geometry actually made and measured with the target, investigate deviations and review what the process teaches us. That learning need not wait for plants to mature. After assembly and planting, the Bower can create a second, slower evidence stream through establishment, seasonal growth, the use of the space and the work of tending it. Ask whether the intended living architectural conditions actually emerge, in which conditions, and at what cost or effort. Both streams enter review and validation before any rule is changed. An observation is not automatically a generalisable rule; context, repeatability, uncertainty and specialist judgement matter. Supported findings could revise rules for the geometry and for both making and planting checks, informing a subsequent design. Daniel’s geometry and fabrication development, existing drawings and growth studies provide the starting work. The integrated biological evaluator, observations from built Bowers and validated physical feedback loop described here remain to be developed and tested. The diagram and interactive highlights explain the intended relationships; they do not execute an engine, demonstrate a built factory or report measured building performance. The commercial flywheel remains separate: projects could provide contexts and resources for this technical and biological learning.',
    source: 'Founder’s intended integrated design and learning system. Existing geometry and fabrication development; proposed plantability evaluation, physical observations and validated feedback. Arrows describe intended information flow, not demonstrated automation.'
  };

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    root.querySelectorAll('[data-v7-flow]').forEach(scene => {
      if (scene.dataset.v7flowMounted) return;
      scene.dataset.v7flowMounted = 'true';
      const buttons = [...scene.querySelectorAll('[data-v7flow-select]')];
      const layers = [...scene.querySelectorAll('[data-v7flow-in]')];
      const select = id => {
        const selected = modes.find(mode => mode.id === id) || modes[0];
        scene.dataset.v7flowMode = selected.id;
        buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.v7flowSelect === selected.id)));
        layers.forEach(layer => layer.classList.toggle('v7flow-muted', selected.id !== 'all' && !layer.dataset.v7flowIn.split(' ').includes(selected.id)));
        scene.querySelector('[data-v7flow-readout]').textContent = selected.line;
      };
      buttons.forEach(button => {
        button.addEventListener('click', () => select(button.dataset.v7flowSelect));
        button.addEventListener('keydown', event => {
          if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' ', 'Enter'].includes(event.key)) event.stopPropagation();
          const index = buttons.indexOf(button);
          let next;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = buttons.length - 1;
          if (next !== undefined) {
            event.preventDefault();
            buttons[next].focus();
            select(buttons[next].dataset.v7flowSelect);
          }
        });
      });
    });
  });
})();
