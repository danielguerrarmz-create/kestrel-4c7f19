(() => {
  'use strict';

  const nodes = {
    brief: ['Commission', 'Brief · site · budget', 'plain', 163],
    geometry: ['Shape', 'Shared candidate form', 'geometry', 164],
    fabrication: ['Buildability', 'Bends · joints · pins', 'making', 168],
    planting: ['Growth forecast', 'Climbing · load by year', 'growing', 165],
    cost: ['Cost', 'Quantities · quotes', 'cost', 153],
    designer: ['Designer review', 'Weigh the trade-offs', 'designer', 174],
    making: ['Build', 'Press · scan · assemble', 'making', 177],
    living: ['Garden + site', 'Grip · growth · care', 'growing', 161],
    evidence: ['Review evidence', 'Factory · garden · costs', 'evidence', 178]
  };

  // Clay’s Trellis Loop stages, paired with the Bower One geometry and DesignX process studies.
  const nodeContext = {
    brief: 'Review the AI-read brief and site records before passing constraints to Shape.',
    geometry: 'Try AI suggestions. Designers choose, informed by saved Bower One models.',
    fabrication: 'Screen rib bends and joint forces, then derive pin settings for the press.',
    planting: 'Clay’s prototype estimates plant growth and loads. Trials would calibrate them.',
    cost: 'Compare model quantities and supplier quotes with actual build and care costs.',
    designer: 'Weigh screening, planting and cost. Revise the form or release it to build.',
    making: 'The first press step is prototyped. Proposed scans would measure rib springback.',
    living: 'Test wisteria grip and weigh stems. Observe shoot growth, shade and care.',
    evidence: 'Factory scans and garden data would refine the next design and cost checks.'
  };
  const nodeIds = Object.keys(nodes);
  const cardHeight = 62;

  const modes = {
    all: ['Whole system', 'A dreaming system imagines what could be, then lets what happens shape what it imagines next.'],
    design: ['Design', 'Set constraints and test one form for timber, growth and cost before release.'],
    making: ['Making', 'Screen bends and set the pins. Release scans would measure rib springback.'],
    growing: ['Growing', 'Forecast how plants climb and what they weigh. Garden trials would check both.'],
    cost: ['Cost', 'Use quantities and quotes to test the budget, then compare with actual costs.']
  };

  // Source node, destination node, line type, and views that emphasise the connection.
  const links = [
    ['brief', 'geometry', 'design', 'design cost'],
    ['geometry', 'fabrication', 'making', 'design making'],
    ['geometry', 'planting', 'growing', 'design growing'],
    ['geometry', 'cost', 'cost', 'design cost'],
    ['fabrication', 'designer', 'making', 'design making'],
    ['planting', 'designer', 'growing', 'design growing'],
    ['cost', 'designer', 'cost', 'design cost'],
    ['designer', 'geometry', 'evidence', 'design'],
    ['designer', 'making', 'design', 'making growing cost'],
    ['making', 'living', 'growing', 'growing cost'],
    ['making', 'evidence', 'evidence', 'making cost'],
    ['living', 'evidence', 'evidence', 'growing cost'],
    ['cost', 'evidence', 'cost', 'cost'],
    ['evidence', 'geometry', 'evidence', 'making growing cost'],
    ['fabrication', 'planting', 'making', 'design making growing'],
    ['planting', 'fabrication', 'growing', 'design making growing']
  ];

  const layouts = {
    all:     [[92,225],[286,225],[484,116],[484,225],[484,334],[691,225],[983,172],[983,325],[707,459]],
    design:  [[92,200],[286,200],[484,97],[484,200],[484,304],[691,200],[983,152],[983,307],[707,447]],
    making:  [[92,171],[286,171],[498,171],[473,272],[463,367],[708,171],[974,171],[995,341],[728,454]],
    growing: [[92,252],[286,252],[465,118],[498,252],[468,365],[708,235],[993,146],[959,287],[723,422]],
    cost:    [[92,315],[286,315],[470,112],[476,210],[499,315],[708,315],[1000,173],[1000,339],[709,466]]
  };

  const point = (positions, name, side, offset = 0) => {
    const [x, y] = positions[name];
    const halfWidth = nodes[name][3] / 2;
    if (side === 'L') return [x - halfWidth, y + offset];
    if (side === 'R') return [x + halfWidth, y + offset];
    if (side === 'T') return [x + offset, y - cardHeight / 2];
    return [x + offset, y + cardHeight / 2];
  };

  function across(start, end, column) {
    return [start, [column, start[1]], [column, end[1]], end];
  }

  function down(start, end, row) {
    return [start, [start[0], row], [end[0], row], end];
  }

  function routesFor(p) {
    const at = (id, side, offset) => point(p, id, side, offset);
    const checks = ['fabrication', 'planting', 'cost'];
    const [evidenceX, evidenceY] = p.evidence;
    const exchangeRow = (p.fabrication[1] + p.planting[1]) / 2;
    const makingOut = at('making', 'B', -49);
    const livingOut = at('living', 'L', 6);
    const quoteOut = at('cost', 'B', -16);
    return [
      across(at('brief', 'R'), at('geometry', 'L'), 187),
      ...checks.map((id, i) => across(at('geometry', 'R', (i - 1) * 15), at(id, 'L'), 371 + 3.5 * i)),
      ...checks.map((id, i) => across(at(id, 'R'), at('designer', 'L', (i - 1) * 15), 589 + 4.5 * i)),
      down(at('designer', 'T', -18), at('geometry', 'T', -18), 32),
      across(at('designer', 'R'), at('making', 'L', -8), 846),
      down(at('making', 'B', 29), at('living', 'T', 29), (p.making[1] + p.living[1]) / 2),
      [makingOut, [makingOut[0], p.making[1] + 48], [livingOut[0] - 16, p.making[1] + 48], [livingOut[0] - 16, evidenceY - 54], [evidenceX + 48, evidenceY - 54], at('evidence', 'T', 48)],
      across(livingOut, at('evidence', 'R', 7), 856),
      [quoteOut, [quoteOut[0], evidenceY - 4], at('evidence', 'L', -4)],
      down(at('evidence', 'B', -17), at('geometry', 'B', -18), 522),
      down(at('fabrication', 'B', -18), at('planting', 'T', -18), exchangeRow),
      down(at('planting', 'T', 18), at('fabrication', 'B', 18), exchangeRow)
    ];
  }

  function view(mode) {
    const positions = Object.fromEntries(nodeIds.map((id, i) => [id, layouts[mode][i]]));
    return { positions, routes: routesFor(positions) };
  }

  const formatPoint = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  function drawPath(points) {
    const distinct = points.filter((p, i) => !i || Math.hypot(p[0] - points[i-1][0], p[1] - points[i-1][1]) > .01);
    const corners = distinct.slice(1, -1).map((p, i) => {
      const a = distinct[i], b = distinct[i + 2];
      const da = Math.hypot(a[0] - p[0], a[1] - p[1]);
      const db = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const radius = Math.min(12, da / 2, db / 2);
      return `L${formatPoint(mix(p, a, radius / da))} Q${formatPoint(p)} ${formatPoint(mix(p, b, radius / db))}`;
    });
    return `M${formatPoint(distinct[0])} ${corners.join(' ')} L${formatPoint(distinct.at(-1))}`;
  }

  function makeMarkup() {
    return `<section class="dreaming-scene" data-v10-dreaming aria-labelledby="dreaming-title">
      <h2 class="dreaming-title" id="dreaming-title">Dreaming <em>Systems</em></h2>
      <div class="dreaming-exhibit">
        <div class="dreaming-lenses slide-interaction" role="group" aria-label="Diagram views">
          ${Object.entries(modes).map(([mode, [name]]) => `<button type="button" data-mode="${mode}" aria-controls="learning-diagram learning-readout" aria-pressed="false">${name}</button>`).join('')}
        </div>
        <figure class="dreaming-figure">
          <div class="dreaming-drawing">
            <svg id="learning-diagram" class="dreaming-diagram" viewBox="0 0 1120 545" role="group" aria-labelledby="diagram-name" aria-describedby="diagram-description">
              <title id="diagram-name">Bower’s intended design and evidence flow</title>
              <desc id="diagram-description">The commission informs the candidate form. Timber screening sends the rib layout to the growth forecast, which returns estimated plant loads. Buildability, growth and cost inform designer review, which can revise the form or release it for making. Factory measurements, garden and site observations, and cost records can refine the next design.</desc>
              <defs>
                <marker id="terminal" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M1 1 7 4 1 7" stroke="context-stroke" fill="none" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                </marker>
              </defs>
              ${links.map(([from, to, kind]) => `<path class="link" aria-hidden="true" data-from="${from}" data-to="${to}" data-kind="${kind}" marker-end="url(#terminal)"/>`).join('')}
              ${nodeIds.map(id => {
                const [title, detail, kind, width] = nodes[id];
                return `<g class="node" role="button" tabindex="0" aria-expanded="false" aria-controls="learning-node-details" aria-label="${title}" data-node="${id}" data-kind="${kind}">
                  <rect x="${-width / 2}" y="${-cardHeight / 2}" width="${width}" height="${cardHeight}" rx="${id === 'geometry' ? 9 : 16}"/>
                  <text y="-1">${title}</text><text class="detail" y="17">${detail}</text>
                </g>`;
              }).join('')}
            </svg>
          </div>
          <figcaption class="readout" aria-live="polite" aria-atomic="true">
            <p id="learning-readout" class="mode-readout"></p>
            <section id="learning-node-details" class="node-details" aria-labelledby="learning-node-heading" hidden>
              <h3 id="learning-node-heading"></h3>
              <p data-node-context></p>
            </section>
          </figcaption>
        </figure>
      </div>
    </section>`;
  }

  window.DESIGNX_V10_DREAMING = {
    title: 'Dreaming Systems',
    theme: 'v10-dreaming-slide',
    html: makeMarkup(),
    notes: 'Clay Seifert’s Trellis Loop and the Bower One studies connect design decisions with timber screening, growth and cost. The integrated loop and physical calibration are in development.',
    source: 'Trellis Loop stages and Bower One digital studies.'
  };

  // A single interpolated frame keeps moving connectors pinned to their nodes.
  (window.DESIGNX_MOUNTS ||= []).push(deck => {
    const root = deck.querySelector('[data-v10-dreaming]');
    if (!root) return;
    const nodeElements = [...root.querySelectorAll('[data-node]')];
    const wires = [...root.querySelectorAll('.link')];
    const buttons = [...root.querySelectorAll('[data-mode]')];
    const caption = root.querySelector('#learning-readout');
    const detailPanel = root.querySelector('#learning-node-details');
    const detailHeading = detailPanel.querySelector('h3');
    const detailText = detailPanel.querySelector('[data-node-context]');
    let expandedNode = null;

    function expand(node) {
      expandedNode?.setAttribute('aria-expanded', 'false');
      expandedNode = node;
      if (node) {
        detailHeading.textContent = nodes[node.dataset.node][0];
        detailText.textContent = nodeContext[node.dataset.node];
        node.setAttribute('aria-expanded', 'true');
      }
      caption.hidden = Boolean(node);
      detailPanel.hidden = !node;
    }

    nodeElements.forEach(node => {
      const toggle = () => expand(expandedNode === node ? null : node);
      node.addEventListener('click', toggle);
      node.addEventListener('keydown', event => {
        if (event.key === ' ') event.preventDefault();
        if (event.key === 'Enter' && !event.repeat) {
          event.preventDefault();
          toggle();
        }
      });
      node.addEventListener('keyup', event => {
        if (event.key !== ' ') return;
        event.preventDefault();
        toggle();
      });
    });

    function dismissDetail() {
      const trigger = expandedNode;
      expand(null);
      trigger?.focus();
    }

    root.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !expandedNode) return;
      event.preventDefault();
      dismissDetail();
    });
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible;
    let animation;
    let selected;

    function paint(state) {
      visible = state;
      nodeElements.forEach(el => el.setAttribute('transform', `translate(${formatPoint(state.positions[el.dataset.node])})`));
      wires.forEach((el, i) => el.setAttribute('d', drawPath(state.routes[i])));
    }

    function select(mode, motion = false) {
      if (mode === selected) return;
      selected = mode;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
      caption.textContent = modes[mode][1];
      const highlightedNodes = new Set(['geometry']);
      wires.forEach((wire, i) => {
        const [from, to, , emphasis] = links[i];
        const active = mode === 'all' || emphasis.split(' ').includes(mode);
        wire.classList.toggle('is-emphasis', active);
        if (active) {
          highlightedNodes.add(from);
          highlightedNodes.add(to);
        }
      });
      nodeElements.forEach(node => node.classList.toggle('is-emphasis', highlightedNodes.has(node.dataset.node)));

      cancelAnimationFrame(animation);
      const target = view(mode);
      if (!motion || reducedMotion.matches || !visible) {
        paint(target);
        return;
      }
      const start = visible;
      const began = performance.now();
      function step(now) {
        if (!root.isConnected) return;
        const fraction = Math.min((now - began) / 360, 1);
        // Symmetric smoothstep lets viewers track the graph through the middle of the move.
        const progress = fraction * fraction * (3 - 2 * fraction);
        paint({
          positions: Object.fromEntries(nodeIds.map(id => [id, mix(start.positions[id], target.positions[id], progress)])),
          routes: start.routes.map((route, i) => route.map((p, j) => mix(p, target.routes[i][j], progress)))
        });
        if (fraction < 1) animation = requestAnimationFrame(step);
      }
      animation = requestAnimationFrame(step);
    }

    buttons.forEach((button, i) => {
      button.addEventListener('click', event => select(button.dataset.mode, event.detail > 0));
      button.addEventListener('keydown', event => {
        const moves = { ArrowUp: (i + buttons.length - 1) % buttons.length, ArrowDown: (i + 1) % buttons.length, Home: 0, End: buttons.length - 1 };
        if (!(event.key in moves)) return;
        event.preventDefault();
        event.stopPropagation();
        buttons[moves[event.key]].focus();
      });
    });
    select('all');
    if (document.body.classList.contains('print-mode')) {
      nodeElements.forEach(node => node.removeAttribute('tabindex'));
    } else {
      window.addEventListener('beforeprint', () => {
        expand(null);
        select('all');
      });
    }
  });
})();
