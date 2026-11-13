/* Edition 03 opening: material choices now, a living alternative, a way to repeat it. */
(() => {
  'use strict';
  const motionControl = '<button class="opening-motion slide-interaction" type="button" data-opening-motion aria-label="Pause image motion" aria-pressed="false">Pause motion <span aria-hidden="true">Ⅱ</span></button>';
  const materialProblem = () => `
    <section class="material-problem">
      <img class="opening-film construction-film" src="3/assets/world-under-construction.webp" alt="Illustrative view across unfinished concrete floors towards a district of building frames and cranes." loading="eager" fetchpriority="high">
      <div class="construction-shade"></div>
      <div class="construction-copy">
        <h1>We’re about to<br>build the world<br>again.</h1>
        <p>Cleaner energy can change how a building runs.<br>It cannot undo the carbon already released<br>to make it.</p>
      </div>
      <div class="construction-future"><strong>+55<span>%</span></strong><p>projected growth in global<br>building floor area, 2022–2050.</p><p class="construction-decision">Material choices made now<br>will shape that world for decades.</p></div>
      <p class="opening-sources"><span><a href="https://static.energy-transitions.org/uploads/resources/ETC_Buildings-Decarbonisation-Report_ExecutiveSummary_DIGITALvf.pdf" target="_blank" rel="noopener">ETC, Zero-Carbon Buildings (2025), pp. 7, 10</a> · <a href="https://www.unep.org/en/news-and-stories/press-release/climate-action-key-affordable-housing-buildings-decarbonisation" target="_blank" rel="noopener">UNEP (2026)</a></span><span>Generated illustration</span></p>
      ${motionControl}
    </section>`;
  const livingOpportunity = () => `
    <section class="living-opportunity">
      <div class="living-window"><img class="opening-film living-film" src="3/assets/living-structure.webp" alt="Illustrative woodland view of a substantial living tree, branching timber and a fern-covered floor." loading="lazy"><span class="living-image-caption">Generated illustration</span></div>
      <div class="living-copy">
        <h2>Nature builds<br>by growing.</h2>
        <p class="living-promise">Build with material that grows and stores carbon.<br>Make places that become more alive with time.</p>
        <p class="living-barrier">The obstacle is production.</p>
        <p class="living-explanation">Natural forms vary. Living growth keeps changing.<br>A repeatable process has to adapt.</p>
        <div class="living-parts" aria-label="Three different timber components from the Bower One digital model">
          <img src="assets/part-01.webp" alt="Bower digital timber component CW-001" loading="lazy">
          <img src="assets/part-20.webp" alt="Bower digital timber component CW-020" loading="lazy">
          <img src="assets/part-40.webp" alt="Bower digital timber component CW-040" loading="lazy">
        </div>
        <p class="living-parts-caption">Different parts. One process to develop.<span>Bower One / digital component studies</span></p>
      </div>
      <blockquote>Variability is the essence of nature and the enemy of industry;<br><em>Bower’s bet is to make variability manufacturable.</em></blockquote>
      <p class="living-source">Biological materials: <a href="https://wedocs.unep.org/items/effe9d8d-a949-4397-bed6-7afda856e261" target="_blank" rel="noopener">UNEP, Building Materials and the Climate (2023)</a>. Carbon benefit depends on sourcing and the building’s whole life; Bower’s performance is not yet measured.</p>
      ${motionControl}
    </section>`;

  window.DESIGNX_SCENES = Object.assign(window.DESIGNX_SCENES || {}, { materialProblem, livingOpportunity });
  (window.DESIGNX_MOUNTS ||= []).push(root => {
    const controls = root.querySelectorAll('[data-opening-motion]');
    let paused = false;
    const sync = () => {
      document.body.classList.toggle('opening-motion-paused', paused);
      document.body.classList.toggle('opening-document-hidden', document.hidden);
      controls.forEach(button => {
        button.setAttribute('aria-pressed', String(paused));
        button.setAttribute('aria-label', paused ? 'Resume image motion' : 'Pause image motion');
        button.innerHTML = paused ? 'Resume motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
      });
    };
    controls.forEach(button => button.addEventListener('click', () => { paused = !paused; sync(); }));
    document.addEventListener('visibilitychange', sync);
    sync();
  });
})();
