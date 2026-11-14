/* Edition 07: a script for living architecture. No simulated biological results. */
(() => {
  'use strict';
  const growth = [
    { label: 'Space', word: 'space.', line: 'Planting becomes part of the room.', drawing: 'Show how growth changes enclosure and the experience of being inside the Bower.' },
    { label: 'Light', word: 'light.', line: 'Growth changes the light we inhabit.', drawing: 'Show the intended relationship between planting, filtered light and the space below.' },
    { label: 'Time', word: 'time.', line: 'A place that develops after installation.', drawing: 'Show one Bower through establishment, maturity and seasonal change.' }
  ];
  const intentions = [
    { label: 'Shaded room', intention: 'A shaded place to sit.', question: 'Where would planting need to establish and reach?', response: 'Revisit support spacing and paths for growth.', drawing: 'Show the intended shade, then the structural decision it asks us to reconsider.' },
    { label: 'Filtered light', intention: 'A luminous planted canopy.', question: 'What pattern of growth could create that light?', response: 'Explore orientation and openings in the frame.', drawing: 'Show a desired light condition and the change it motivates in the geometry.' },
    { label: 'Seasonal enclosure', intention: 'A room that changes with the seasons.', question: 'How should planting occupy the frame over time?', response: 'Allow for growth, clearance and access for tending.', drawing: 'Show seasonal occupation of the same Bower and the space the structure must allow.' }
  ];
  const nudges = {
    fabrication: [
      { label: 'Forming', text: 'Revisit member curvature around a viable forming method.' },
      { label: 'Connections', text: 'Adjust the geometry so a connection can be made and checked.' },
      { label: 'Assembly', text: 'Reconsider the arrangement around access and assembly sequence.' }
    ],
    planting: [
      { label: 'Reach', text: 'Revisit support spacing around the intended planting’s growth habit.' },
      { label: 'Light', text: 'Explore orientation and openings around the intended living canopy.' },
      { label: 'Establishment', text: 'Connect the frame to a credible place for plants to establish.' }
    ]
  };
  const intelligences = [
    { id: 'geometry', label: 'Geometry', concern: 'Space + openings', detail: 'Bring spatial intent, making and growth into the same design decisions.' },
    { id: 'fabrication', label: 'Fabrication', concern: 'Members + joints', detail: 'Let what we can make inform the form—and test new forms against making.' },
    { id: 'biology', label: 'Biology', concern: 'Growth + establishment', detail: 'Let plant behaviour inform the first geometry, then learn from what grows.' }
  ];
  const choices = (items, key, label) => `<div class="v7-choices slide-interaction" role="group" aria-label="${label}">${items.map((item, i) => `<button type="button" data-v7-${key}="${i}" aria-pressed="${i === 0}">${item.label}</button>`).join('')}</div>`;
  const note = text => `<aside class="v7-drawing-note" aria-label="Drawing to add"><strong>Clay’s drawing</strong><p data-v7-drawing>${text}</p></aside>`;
  const source = 'Founder’s intended living-architecture system. Conceptual relationships; biological checks and outcomes remain to be developed and tested.';

  window.DESIGNX_V7_SCENES = {
    growth: {
      title: 'Plants make space.',
      html: `<section class="v7-scene v7-growth" data-v7-scene="growth"><h2 class="v7-title">Plants make <em data-v7-growth-word>space.</em></h2>${choices(growth, 'growth', 'Explore architectural intentions')}<div class="v7-drawing-space">${note(growth[0].drawing)}</div><p class="v7-growth-line" data-v7-growth-line aria-live="polite">${growth[0].line}</p><div class="v7-print-summary v7-growth-summary">${growth.map(item => `<div><h3>${item.label}</h3><p>${item.line}</p></div>`).join('')}</div><p class="v7-status">Architectural intentions. Growth drawings in development.</p></section>`,
      notes: 'Start with the place we want to inhabit. Plants can be part of how that place makes space, filters light and changes with the seasons. The first Bower should offer an inhabitable structure at installation and an intended transformation as planting establishes. Clay is developing drawings and growth studies to make those conditions tangible. The controls here select parts of the argument; they do not run a plant-growth simulation or demonstrate measured comfort or habitat outcomes. Do not assign a fixed year or guaranteed coverage to an unvalidated growth scenario. The engineered timber frame carries the structural loads; planting colonizes it.',
      source
    },
    anatomy: {
      title: 'Growth changes the geometry.',
      html: `<section class="v7-scene v7-anatomy" data-v7-scene="anatomy"><h2 class="v7-title">Growth changes<br>the <em>geometry.</em></h2>${choices(intentions, 'intent', 'Explore proposed design relationships')}<div class="v7-intent-sequence" aria-live="polite"><div><h3>We want</h3><p data-v7-intention>${intentions[0].intention}</p></div><span aria-hidden="true">→</span><div><h3>We ask</h3><p data-v7-question>${intentions[0].question}</p></div><span aria-hidden="true">→</span><div><h3>We reconsider</h3><p data-v7-response>${intentions[0].response}</p></div></div><div class="v7-anatomy-drawing">${note(intentions[0].drawing)}</div><div class="v7-print-summary v7-intent-summary">${intentions.map(item => `<div><h3>${item.label}</h3><p>${item.response}</p></div>`).join('')}</div><p class="v7-status">Proposed design relationships. Plant requirements and geometric responses need testing together.</p></section>`,
      notes: 'Biology enters before the geometry is settled. Start with an architectural intention, ask what planting behavior could produce it, then reconsider the structure around those needs. These are questions for design, not a finished planting specification. A shaded room, filtered light and seasonal enclosure are example intentions. The response could concern spacing, orientation, continuity of support, establishment, clearance or tending. The point of Clay’s drawings is to make one causal relationship visible: a desired living condition motivates a different architectural decision. That geometry must still satisfy structure, fabrication, assembly and site constraints. We are developing a method for navigating those relationships, not claiming that a particular geometry guarantees an ecological result.',
      source
    },
    computation: {
      title: 'Can we make it? Can it grow?',
      html: `<section class="v7-scene v7-computation" data-v7-scene="computation" data-v7-nudge-side="fabrication"><h2 class="v7-title">Can we make it?<br><span>Can it grow?</span></h2><div class="v7-check-panel v7-fabrication-panel"><h3>Fabricatability</h3><p class="v7-check-description">Can we make and assemble the form?</p><div class="v7-check-choices slide-interaction" role="group" aria-label="Example fabrication considerations">${nudges.fabrication.map((item,i) => `<button type="button" data-v7-nudge="fabrication:${i}" aria-pressed="${i === 0}">${item.label}</button>`).join('')}</div><p class="v7-capability">Daniel’s engine in development</p><a class="v7-study-link" href="https://www.bowerbuild.org/designx/6#slide-06" target="_blank" rel="noopener">Current geometry study ↗</a></div><div class="v7-shared-geometry"><span aria-hidden="true">↔</span><div><h3>Geometry</h3><p>The designer<br>weighs the trade-offs.</p></div><span aria-hidden="true">↔</span></div><div class="v7-check-panel v7-planting-panel"><h3>Plantability</h3><p class="v7-check-description">Does the form support the intended growth?</p><div class="v7-check-choices slide-interaction" role="group" aria-label="Example proposed planting considerations">${nudges.planting.map((item,i) => `<button type="button" data-v7-nudge="planting:${i}" aria-pressed="false">${item.label}</button>`).join('')}</div><p class="v7-capability">Proposed engine extension</p></div><div class="v7-nudge-readout" aria-live="polite"><span data-v7-nudge-label>Possible fabrication nudge</span><p data-v7-nudge-text>${nudges.fabrication[0].text}</p></div><div class="v7-print-summary v7-check-summary"><p><strong>Making informs geometry.</strong> Forming, connections and assembly.</p><p><strong>Growth informs geometry.</strong> Reach, light and establishment.</p></div><p class="v7-status">Example design considerations. Plantability checks are proposed, not implemented or validated.</p></section>`,
      notes: 'Daniel’s engine already develops the relationship between geometry and fabricatability. The proposed extension is to nudge on plantability too. Plantability means whether the form supports the intended living architectural outcome, not merely whether a climber could attach to it. Both sets of considerations should influence the same geometry during design. A response to planting may create a fabrication trade-off, and a fabrication response may alter the conditions for planting. The designer needs those trade-offs to be legible. The clickable considerations on this slide are a conceptual script, not a working evaluation interface, live engine outputs, ecological scores or validated design recommendations. Species, site conditions and the intended spatial experience would have to inform any real biological model.',
      source
    },
    learning: {
      title: 'One learning system.',
      html: `<section class="v7-scene v7-learning" data-v7-scene="learning" data-v7-intelligence="geometry"><h2 class="v7-title">One learning system.</h2><div class="v7-intelligence-lenses" role="group" aria-label="Explore design questions on the same Bower">${intelligences.map((item,i) => `<button class="v7-intelligence-lens" type="button" data-v7-intelligence-select="${item.id}" aria-pressed="${i === 0}" aria-controls="v7-bower-questions"><strong>${item.label}<span aria-hidden="true">↗</span></strong><span>${item.concern}</span></button>`).join('')}</div><figure class="v7-learning-bower" id="v7-bower-questions"><img src="assets/assembly.webp" alt="Earlier Bower One digital assembly study, showing the curved timber members, openings and connections." loading="lazy"><svg class="v7-bower-annotations" viewBox="0 0 1346 1051" aria-hidden="true"><g class="v7-model-layer" data-v7-model-layer="geometry"><path d="M682 174L920 72H1240"/><circle cx="682" cy="174" r="10"/><text x="1240" y="53" text-anchor="end">Openings + light</text><path d="M790 716L1075 864H1290"/><circle cx="790" cy="716" r="10"/><text x="1290" y="906" text-anchor="end">Space to inhabit</text></g><g class="v7-model-layer" data-v7-model-layer="fabrication"><path d="M417 246L245 72H30"/><circle cx="417" cy="246" r="10"/><text x="30" y="53">Member curvature</text><path d="M922 440L1150 348H1320"/><circle cx="922" cy="440" r="10"/><text x="1320" y="326" text-anchor="end">Joint + tool access</text></g><g class="v7-model-layer" data-v7-model-layer="biology"><path d="M637 438L257 680H30"/><circle cx="637" cy="438" r="10"/><text x="30" y="722">Continuity for growth?</text><path d="M532 946H30"/><circle cx="532" cy="946" r="10"/><text x="30" y="994">Where can roots establish?</text></g></svg><figcaption class="sr-only" data-allow-overflow>Illustrative design questions attached to an existing assembly study. These annotations are not engineering checks, a planting specification or simulation results.</figcaption></figure><p class="v7-learning-readout" data-v7-learning-detail aria-live="polite">${intelligences[0].detail}</p><div class="v7-print-summary v7-learning-summary"><p>One form, examined through space, making and growth.</p><p>Observations from each Bower could improve the next design.</p></div><p class="v7-status">Earlier Bower One assembly study. Illustrative questions; plantability checks and feedback from built Bowers remain to be developed and tested.</p></section>`,
      notes: 'Bower is developing living architecture: an engineered timber structure that plants can colonise and transform over time. This slide uses an earlier Bower One digital assembly study as the shared object of three kinds of design reasoning. Geometry concerns the space, openings and arrangement of supports. Fabrication concerns how its members and connections can be made and assembled. Biology concerns the conditions the intended plants need to establish and create the desired architectural experience. These are not a one-way sequence in which biology starts only after manufacture. Plant requirements should influence the first geometry alongside manufacturing constraints, and any change must be considered across all three. Later observations of fabrication, establishment, use and tending could improve future design rules. Selecting a label reveals illustrative questions on the same unchanged model; it does not run a design evaluator, simulate growth or assert that this earlier model resolves those questions. Clay’s new drawings will supply the specific causal examples. The plantability extension and feedback from built Bowers remain to be developed and tested. The commercial flywheel is distinct: commissions create contexts and resources in which this learning could happen.',
      source: 'Earlier Bower One digital assembly study, September 2026, from the existing presentation assets. New annotations identify conceptual design questions; they are not validated model analysis.'
    }
  };

  (window.DESIGNX_MOUNTS ||= []).push(root => {
    root.querySelectorAll('[data-v7-scene]').forEach(scene => {
      scene.querySelectorAll('button').forEach(button => {
        button.addEventListener('keydown', event => {
          if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End',' '].includes(event.key)) event.stopPropagation();
        });
      });
      const press = (selector, selected) => scene.querySelectorAll(selector).forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
      scene.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button || !scene.contains(button)) return;
        if (button.hasAttribute('data-v7-growth')) {
          const state = growth[Number(button.dataset.v7Growth)];
          press('[data-v7-growth]', button);
          scene.querySelector('[data-v7-growth-line]').textContent = state.line;
          scene.querySelector('[data-v7-drawing]').textContent = state.drawing;
        } else if (button.hasAttribute('data-v7-intent')) {
          const state = intentions[Number(button.dataset.v7Intent)];
          press('[data-v7-intent]', button);
          scene.querySelector('[data-v7-intention]').textContent = state.intention;
          scene.querySelector('[data-v7-question]').textContent = state.question;
          scene.querySelector('[data-v7-response]').textContent = state.response;
          scene.querySelector('[data-v7-drawing]').textContent = state.drawing;
        } else if (button.hasAttribute('data-v7-nudge')) {
          const [side, index] = button.dataset.v7Nudge.split(':');
          press('[data-v7-nudge]', button);
          scene.dataset.v7NudgeSide = side;
          scene.querySelector('[data-v7-nudge-label]').textContent = side === 'planting' ? 'Possible planting nudge' : 'Possible fabrication nudge';
          scene.querySelector('[data-v7-nudge-text]').textContent = nudges[side][Number(index)].text;
        } else if (button.hasAttribute('data-v7-intelligence-select')) {
          const selected = intelligences.find(item => item.id === button.dataset.v7IntelligenceSelect);
          press('[data-v7-intelligence-select]', button);
          scene.dataset.v7Intelligence = selected.id;
          scene.querySelector('[data-v7-learning-detail]').textContent = selected.detail;
        }
      });
    });
  });
})();
