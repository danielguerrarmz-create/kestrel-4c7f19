/* Condensed CRE retail presentation. Supporting detail belongs in Sources. */
(() => {
  'use strict';
  const sources = {
    streets: ['TfL / UCL · Street Appeal, 2018, p. 6', 'https://content.tfl.gov.uk/street-appeal.pdf'],
    portfolio: ['Hammerson · Portfolio, checked 18 November 2026', 'https://www.hammerson.com/portfolio'],
    quakers: ['Hammerson · Quakers Friars planning announcement, 2025', 'https://www.hammerson.com/news-insights/2025/green-light-hammersons-latest-repositioning-project-bristol'],
    cabot: ['Hammerson · Cabot Gate planning announcement, 2026', 'https://www.hammerson.com/news-insights/2026/hammerson-secures-planning-green-light-600-student-units-bristol'],
    rhs: ['RHS · Climbers: growing guide', 'https://www.rhs.org.uk/plants/types/climbers/growing-guide']
  };
  const link = (key, label) => `<a href="${sources[key][1]}" target="_blank" rel="noopener">${label || sources[key][0]}</a>`;
  const image = (src, alt, className = '', eager = false) => `<img src="${src}" alt="${alt}" class="${className}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
  const heading = text => `<header class="c-heading"><h2>${text}</h2></header>`;
  const foot = text => `<p class="c-source">${text}</p>`;
  const logo = light => image('3/assets/bower-logo.png', 'Bower', `c-logo${light ? ' c-logo-light' : ''}`);
  const slide = (title, act, theme, html, notes, source) => ({ title, act, theme, html, notes, source });

  window.DESIGNX_SLIDES = [
    slide('A living centrepiece for retail', 'The proposition', 'c-cover image-slide',
      `${image('retail/assets/retail-square.png', 'Illustrative concept of a Bower pavilion within an outdoor retail square.', 'c-full-image', true)}<div class="c-shade"></div>${logo(true)}<div class="c-cover-copy"><h1>A living<br>centrepiece<br><em>for retail</em></h1></div><p class="c-caption">Illustrative concept</p>`,
      'Bower proposes a timber pavilion supporting trained climbers. This is a commercial retail application, not a completed installation or a commissioned Hammerson design. The generated image is an interpretation based on Bower’s current six-bay pavilion model, placed in an illustrative retail setting. It is not a verified rendering of the exact model, a surveyed location or an engineered site proposal. The first completed Bower remains to be delivered.',
      'Bower current product proposition: edition 08, product-evidence.js. Image: retail/assets/retail-square.png, generated retail-setting interpretation based on the current six-bay model.'),

    slide('A planted timber pavilion', 'The product', 'c-product',
      `<div class="c-product-copy"><h2>A planted<br><em>timber pavilion</em></h2><p class="c-product-line">Structure now.<br>Canopy over time.</p></div><div class="c-product-crop">${image('pieces/04-plants-make-space-timber/frames/time-16.webp', 'Approach view from the existing timber pavilion design study.', 'c-product-frame')}</div>${foot('Digital study · First build pending')}`,
      'The timber frame carries the structural load. Rooted climbers form the changing canopy; the structural timber does not grow. Bower proposes a coordinated and repeatable design, fabrication and care method, not proprietary biology or structural self-repair. Digital studies exist; integrated delivery, biological performance and commercial advantage remain to be demonstrated. The image displays the approach view from the existing multi-view study. Cropping does not change the source geometry or provide engineering validation. Plant species, planting size, exposure, water and care affect establishment. No guaranteed establishment date, cooling result or rain protection is asserted.',
      `Bower edition 08 product-evidence.js and existing timber study: pieces/04-plants-make-space-timber/frames/time-16.webp. Horticultural context: ${link('rhs')}.`),

    slide('A place to stop', 'Retail uses', 'c-uses image-slide',
      `${image('retail/assets/retail-seating.png', 'Illustrative Bower retail concept showing people seated and meeting beside shops.', 'c-full-image')}<div class="c-shade"></div><div class="c-uses-copy"><h2>A place<br><em>to stop</em></h2><div class="c-use-words"><span>Meet.</span><span>Sit.</span><span>Gather.</span></div></div><p class="c-caption">Illustrative concept · Proposed uses</p>`,
      'Meeting, seating and small gatherings are proposed applications, not demonstrated uses of a completed Bower. Confirm the available footprint, inclusive access, sightlines, seating, operator responsibilities and capacity through design. A planted canopy does not itself provide a weatherproof room. No guaranteed footfall, sales or rental uplift is asserted. The generated image interprets Bower’s current six-bay model in an illustrative retail setting; it is not a verified exact-model rendering, a real destination or an installed project.',
      'Bower retail application proposal. Image: retail/assets/retail-seating.png, generated retail-setting interpretation based on the current six-bay model.'),

    slide('Public-realm evidence', 'Research evidence', 'c-evidence',
      `${heading('Public-realm <em>evidence</em>')}<div class="c-stat"><p class="c-stat-value">+216%</p><p class="c-stat-label">leisure-based stationary activity</p><p class="c-stat-context">Improved London streets versus comparison streets.</p></div>${foot(`${link('streets', 'TfL / UCL, 2018')} · Five improved streets, five comparators.<br>Whole-street interventions; not a Bower forecast.`)}`,
      'Street Appeal compares five improved London high streets and public spaces with five selected unimproved comparators. Its summary reports leisure-based static activities 216% higher in the improved environments. This measures stationary leisure activity, not the duration of visits or a count of unique customers. The improvements bundled pedestrian space, crossings, seating, traffic changes and landscaping. The study does not isolate greenery, artwork or a pavilion. It is context-specific comparative evidence, not a randomised Bower trial. Do not apply the percentage to Hammerson footfall, sales, rent or portfolio value. The same report contains walking and rental-growth results, but these are not presented as additional Bower performance claims.',
      link('streets')),

    slide('Hammerson’s public realm', 'Hammerson context', 'c-context',
      `${heading('Hammerson’s<br><em>public realm</em>')}<div class="c-context-pair"><section><h3>Quakers Friars</h3><p>Landscape and events</p></section><section><h3>Cabot Gate</h3><p>Pavilion and green space</p></section></div>${foot(`${link('quakers', '2025')} / ${link('cabot', '2026')} plans · No Bower commission.`)}`,
      'Hammerson identifies placemaking and new uses as part of its approach to footfall, dwell time and long-term value. Its approved Quakers Friars redevelopment includes landscaped public spaces, cultural amenities and space for community and creative events. Cabot Gate’s outline plans include a community pavilion, green space and improved walking and cycling connections; detailed design and reserved matters approval remain required. These are relevant project contexts, not selected Bower sites. The fit is Bower’s inference from published priorities. No available budget, installation consent, partnership or commissioning authority is assumed. The undated portfolio page was checked on 18 November 2026.',
      `${link('portfolio')}<br>${link('quakers')}<br>${link('cabot')}`),

    slide('Designed around the site', 'Site brief', 'c-site',
      `${heading('Designed around<br><em>the site</em>')}${image('v8/assets/reference/bower-shadow.webp', 'Existing digital Bower canopy scenario shown in isolation.', 'c-site-model')}<div class="c-site-labels"><span>Routes</span><span>Frontages</span><span>Rooting space</span><span>Water</span><span>Care access</span></div>${foot('Digital canopy study · Site-specific design and approvals required')}`,
      'Start with the destination team’s use and operational brief. Confirm pedestrian desire lines, visible shopfronts, seating needs and the available footprint before choosing a location. Assess light, exposure, rooting space, drainage, water provision and species. Establish servicing, cleaning, security, emergency access and safe care routes. Independently resolve structural engineering, foundations, connections, plant and environmental loads, approvals and contractor responsibilities before installation. The model uses a provisional trained-growth scenario, not observed growth. No engineering approval or fixed establishment programme is implied. A conventional planting or seating solution remains a relevant comparator when evaluating value.',
      `Bower proposed retail site-review and delivery scope. Image: v8/assets/reference/bower-shadow.webp, existing digital study. Horticultural context: ${link('rhs')}.`),

    slide('The proposed offer', 'Proposed commercial model', 'c-offer c-dark',
      `${heading('The proposed <em>offer</em>')}<p class="c-offer-budget">Agree an indicative installed budget first.</p><div class="c-offer-grid"><section><h3 class="c-step">Commission</h3><p class="c-amount">£65,000</p><p class="c-credit">Credited against the build<br>if proceeding.</p></section><section><h3 class="c-step">Build</h3><p class="c-amount">Scoped<br>fixed price</p></section><section><h3 class="c-step">Care</h3><p class="c-amount">Annual care</p><p class="c-term">Separately priced</p></section></div>`,
      'This retains the current proposed Bower offer. Establish a credible indicative installed price and agree a project budget before accepting the £65,000 commission fee. The commission develops the site-specific design, planting strategy, feasibility and construction offer. Define deliverables and what happens if feasibility or budget cannot be achieved. The initial budget is not a fixed construction quotation. The commission is credited once against the total purchase price if the customer proceeds, not charged on top of that price. Agree a fixed build price before construction against scope, site assumptions, exclusions and change terms. Annual care is separately scoped and priced; responsibilities, frequency, staffing and duration require agreement. Confirm applicable tax treatment in the proposal. No installed reference price, achieved margin or established service operation is claimed.',
      'Bower edition 07 commercial.js, retained in edition 08 with its proposed annual-care scope. Proposal framework, not a site quotation.'),

    slide('Measure the first installation', 'Evaluation', 'c-measure',
      `${heading('Measure the<br><em>first installation</em>')}<div class="c-measures"><span>Visitor use</span><span>Occupier trading</span><span>Care cost</span></div>${foot('Proposed measures · Agree the baseline and comparison before installation.')}`,
      'Define the observation area, counting and dwell-duration methods before work starts. Record stopping, seating use and visitor feedback. Include adjacent occupier trading only where participation and data permissions are agreed. Use matched trading periods and a suitable comparison area; track weather, seasons, holidays, events, promotions, tenant openings and other capital works. Record establishment, replacements, canopy cover, water, care hours, incidents, installation cost and rework. Report null or negative results as well as positive ones. A first installation tests feasibility and local use; it cannot establish causal portfolio-wide performance or assign wider rental and valuation changes to one pavilion.',
      'Proposed Bower evaluation plan adapted to retail operations. Evidence distinction informed by Street Appeal and edition 08 first-project validation.'),

    slide('The people behind Bower', 'The team', 'c-team',
      `${heading('The people<br><em>behind Bower</em>')}<div class="c-team-grid"><section class="c-person">${image('assets/clay.jpg', 'Clay Seifert.')}<div><h3>Clay Seifert</h3><p>Design + research</p></div></section><section class="c-person">${image('assets/daniel.jpg', 'Daniel Guerra.')}<div><h3>Daniel Guerra</h3><p>Software + fabrication</p></div></section></div>`,
      'Clay’s background includes a B.Arch at UT Austin and computational/living-systems research. Daniel’s published experience includes Forsite Studio projects, project delivery and Bower’s engine and systems development. Neither is presented as an ARB-registered architect. Existing digital models and manufacturing studies establish design work, not an operating factory or completed Bower. Structural engineering, horticultural expertise and project delivery appointments must be scoped for the commission.',
      'Bower current founder slide and edition 08 product-evidence.js. Existing founder portraits: assets/clay.jpg and assets/daniel.jpg.'),

    slide('Choose a first site', 'Next step', 'c-close c-dark',
      `${logo(true)}<div class="c-close-copy"><h2>Choose<br><em>a first site</em></h2><p class="c-next-steps">Site walk. Brief. Budget.</p><a class="c-contact" href="mailto:clay@bowerbuild.org">clay@bowerbuild.org</a></div>`,
      'The proposed next step is a focused site conversation, followed by a defined brief and an indicative installed budget before the paid commission. Establish the problem the asset team wants to solve, its operational owner, decision process and expected evidence. Scope and engineer a pavilion for the actual destination. No site, budget, programme or partnership is committed by this presentation. Sources and limitations remain available on the relevant slides through the Sources control.',
      'Bower next-step proposal. Contact from the current public Bower configuration.')
  ];

  window.DESIGNX_META = Object.freeze({ title: 'Bower · Retail destinations', edition: 'retail', status: 'discussion', exportReady: true, targetSlideCount: 10, date: '2026-11-18' });
})();
