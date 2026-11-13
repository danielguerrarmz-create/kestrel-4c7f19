/* Edition 03's material argument: an explanatory drawing, not a carbon model. */
(() => {
  'use strict';

  const materialProblem = () => `
    <section class="material-problem" data-material-problem style="--grid-emissions:.14">
      <div class="material-copy">
        <h1>Cleaner energy.<br>A material<br>problem remains.</h1>
        <p class="material-intro">We are changing how buildings are powered. We also have to change what they are made from.</p>
        <div class="material-stat"><strong><span>≈</span>37<span>%</span></strong><p>of global CO₂ emissions<br>come from buildings<br>and construction.</p></div>
      </div>
      <figure class="material-diagram">
        <svg viewBox="0 0 780 540" role="img" aria-labelledby="material-diagram-title material-diagram-desc">
          <title id="material-diagram-title">Cleaner electricity does not remove cement's process emissions</title>
          <desc id="material-diagram-desc">Limestone passes through a heated kiln to become clinker. Carbon dioxide is released from the limestone's chemistry. A separate electricity input can become cleaner; the process carbon dioxide remains in this illustrative diagram.</desc>
          <defs>
            <linearGradient id="material-kiln-light" x1="0" x2="1"><stop stop-color="#B7CD7B" stop-opacity=".02"/><stop offset=".6" stop-color="#B7CD7B" stop-opacity=".18"/><stop offset="1" stop-color="#B7CD7B" stop-opacity=".04"/></linearGradient>
            <linearGradient id="material-energy-light" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#B7CD7B"/><stop offset="1" stop-color="#EEF3EA" stop-opacity=".7"/></linearGradient>
            <marker id="material-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1L8 5L1 9" fill="none" stroke="#B1C1B5" stroke-width="1.2"/></marker>
          </defs>
          <g class="material-guide" fill="none" stroke="#B1C1B5" stroke-opacity=".17" stroke-width="1">
            <path d="M28 333H753M28 345H753"/><path d="M65 358V367M155 358V367M245 358V367M335 358V367M425 358V367M515 358V367M605 358V367M695 358V367"/>
          </g>
          <g class="material-stone" stroke="#EEF3EA" stroke-width="1.35" stroke-linejoin="round">
            <path d="M40 282L65 230L118 205L164 224L184 279L156 324L90 331L48 314Z" fill="#B1C1B512"/>
            <path d="M65 230L103 257L118 205M103 257L164 224M103 257L129 304L184 279M129 304L90 331M103 257L48 314" fill="none" stroke-opacity=".48"/>
            <path d="M62 288L74 274M119 226L134 234M151 277L161 263M102 311L111 308" fill="none" stroke-opacity=".3"/>
          </g>
          <text x="110" y="181" class="material-svg-label" text-anchor="middle">Limestone</text>
          <text x="110" y="397" class="material-svg-formula" text-anchor="middle">CaCO₃</text>
          <path class="material-flow" d="M198 279H268" fill="none" stroke="#B1C1B5" stroke-width="1.5" marker-end="url(#material-arrow)"/>
          <g class="material-kiln" stroke="#EEF3EA" stroke-width="1.3" stroke-linejoin="round">
            <path d="M297 229L470 210Q491 210 499 242L509 282Q511 307 489 312L314 332Q293 333 285 302L277 270Q273 242 297 229Z" fill="url(#material-kiln-light)"/>
            <ellipse cx="296" cy="280" rx="20" ry="51" transform="rotate(-11 296 280)" fill="#102820"/>
            <ellipse cx="296" cy="280" rx="12" ry="36" transform="rotate(-11 296 280)" fill="#B7CD7B12" stroke-opacity=".4"/>
            <path d="M332 226Q356 274 348 329M449 213Q474 257 467 315" fill="none" stroke-opacity=".45"/>
            <path d="M323 335L316 345H352L345 332M456 318L447 345H487L474 316" fill="#102820" stroke-opacity=".5"/>
            <path d="M369 300Q376 283 368 272Q384 279 382 262Q402 281 393 296M407 293Q413 280 408 272Q424 281 418 291" fill="none" stroke="#B7CD7B" stroke-width="1.5"/>
          </g>
          <text x="396" y="181" class="material-svg-label" text-anchor="middle">Heat in the kiln</text>
          <text x="396" y="397" class="material-svg-formula" text-anchor="middle">CaCO₃ → CaO + CO₂</text>
          <path class="material-flow" d="M528 279H590" fill="none" stroke="#B1C1B5" stroke-width="1.5" marker-end="url(#material-arrow)"/>
          <g class="material-clinker" stroke="#B1C1B5" stroke-width="1.2" fill="#B1C1B51A">
            <path d="M607 302L619 276L644 271L659 291L649 317L620 322Z"/><path d="M645 271L658 244L688 240L704 263L694 290L659 291Z"/><path d="M658 306L682 284L708 290L722 315L705 331L677 333Z"/>
            <path d="M620 280L637 296L647 275M658 252L682 270L696 259M683 292L691 315L711 315" fill="none" stroke-opacity=".5"/>
          </g>
          <text x="665" y="181" class="material-svg-label" text-anchor="middle">Clinker</text>
          <text x="665" y="397" class="material-svg-small" text-anchor="middle">An ingredient of cement</text>
          <g class="material-process-carbon" data-process-carbon>
            <path d="M485 218V128Q485 99 499 99H515" fill="none" stroke="#EEF3EA" stroke-width="1.6" marker-end="url(#material-arrow)"/>
            <circle cx="546" cy="98" r="26" fill="#EEF3EA"/>
            <text x="546" y="105" class="material-co2" text-anchor="middle">CO₂</text>
            <text x="589" y="93" class="material-svg-label">From the rock</text>
            <text x="589" y="118" class="material-svg-small">Released by chemistry</text>
          </g>
          <g class="material-electricity" stroke="#B7CD7B" fill="none" stroke-width="1.3">
            <path d="M111 479L132 425L153 479M114 471H150M121 453H143M126 439H138M114 471L143 453M150 471L121 453M132 425V415M103 432H161M113 445H151M105 432V438M159 432V438"/>
            <path d="M178 454H278Q298 454 298 434V420" stroke="url(#material-energy-light)" marker-end="url(#material-arrow)"/>
          </g>
          <text x="208" y="488" class="material-svg-label material-svg-energy">Electricity input</text>
          <g class="material-grid-carbon" data-grid-carbon>
            <path d="M177 450H210V429" fill="none" stroke="#B1C1B5" stroke-width="1.4"/>
            <circle cx="210" cy="416" r="13" fill="none" stroke="#B1C1B5"/><text x="210" y="420" text-anchor="middle">CO₂</text>
          </g>
          <text x="491" y="487" class="material-svg-small">Illustrative cement process.</text>
          <text x="491" y="511" class="material-svg-small">Not an emissions model.</text>
        </svg>
      </figure>
      <p class="material-conclusion">Cleaner electricity cannot remove the CO₂ released by limestone chemistry.</p>
      <div class="material-grid-control slide-interaction">
        <label for="material-grid-range">Explore a cleaner grid <span data-grid-state>Cleaner electricity</span></label>
        <input id="material-grid-range" data-material-grid type="range" min="0" max="100" value="100" step="1" aria-label="Explore a cleaner electricity grid" aria-valuetext="Cleaner electricity; limestone process emissions remain" aria-describedby="material-grid-description">
        <p id="material-grid-description">Electricity emissions change. Process CO₂ remains.</p>
      </div>
      <p class="material-sources"><span>Sources: <a href="https://wedocs.unep.org/bitstreams/a086e064-5034-4fe8-aad8-9ed02c93f10f/download" target="_blank" rel="noopener">UNEP 2025–2026</a> · <a href="https://www.iea.org/reports/technology-roadmap-low-carbon-transition-in-the-cement-industry" target="_blank" rel="noopener">IEA, cement chemistry</a></span><span>Other emissions and abatement routes omitted.</span></p>
    </section>`;

  window.DESIGNX_SCENES = Object.assign(window.DESIGNX_SCENES || {}, { materialProblem });
  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const scene = root.querySelector('[data-material-problem]');
    const input = scene?.querySelector('[data-material-grid]');
    if (!scene || !input) return;
    const state = scene.querySelector('[data-grid-state]');
    const sync = () => {
      // Opacity is an explanatory contrast only, not a measured reduction.
      const cleaner = Number(input.value) / 100;
      scene.style.setProperty('--grid-emissions', String(1 - cleaner * .86));
      scene.style.setProperty('--grid-progress', `${input.value}%`);
      state.textContent = cleaner < .5 ? 'Higher-carbon electricity' : 'Cleaner electricity';
      input.setAttribute('aria-valuetext', `${state.textContent}; limestone process emissions remain`);
    };
    input.addEventListener('input', sync);
    input.addEventListener('keydown', event => event.stopPropagation());
    document.addEventListener('designx:slidechange', event => {
      if (event.detail.printMode) { input.value = '100'; sync(); }
    });
    sync();
  });
})();
