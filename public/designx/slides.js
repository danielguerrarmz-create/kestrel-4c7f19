/* Editorial source of truth. All media paths are local to this presentation. */
(() => {
  'use strict';
  // Working deck: the founder requested visible sticky notes for incoming visuals.
  window.DESIGNX_META = Object.freeze({ status: 'working-draft', targetSlideCount: 16, exportReady: true });
  const img = (file, alt, cls = '', extra = '') => `<img src="assets/${file}" alt="${alt}" class="${cls}" loading="lazy" decoding="async" ${extra}>`;
  const running = (act, label) => `<div class="running"><span>BOWER</span><span>${act} / ${label}</span></div>`;
  const note = text => `<p class="source-note">${text}</p>`;
  const head = (eyebrow, title, cls = '') => `<header class="slide-heading ${cls}"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></header>`;
  const arrow = '<span class="text-arrow" aria-hidden="true">↗</span>';
  const bowerMark = `<svg viewBox="0 0 120 90" fill="none" aria-hidden="true"><path d="M8 80 Q10 21 60 10 Q110 21 112 80 M8 80 Q60 12 112 80 M24 80 Q60 2 96 80 M40 80 Q60 16 80 80 M8 80 Q37 34 60 10 Q83 34 112 80" stroke="currentColor" stroke-width="1.5"/><path d="M16 61 Q60 38 104 61 M24 43 Q60 26 96 43" stroke="currentColor" stroke-width="1"/></svg>`;
  // Schematic trained-plant paths follow the visible front arches of the fixed model.
  const vineCurves = [[[380,635],[380,525],[240,383],[98,288]],[[386,630],[410,486],[653,335],[776,365]],[[849,495],[847,428],[829,382],[776,365]]];
  const plantPath = vineCurves.map(p => `M${p[0]} C${p[1]} ${p[2]} ${p[3]}`).join(' ');
  const leaves = vineCurves.flatMap((p,j) => Array.from({ length: j===2 ? 10 : 23 }, (_, i) => {
    const t = i / (j===2 ? 9 : 22), u = 1-t;
    const x = u*u*u*p[0][0]+3*u*u*t*p[1][0]+3*u*t*t*p[2][0]+t*t*t*p[3][0];
    const y = u*u*u*p[0][1]+3*u*u*t*p[1][1]+3*u*t*t*p[2][1]+t*t*t*p[3][1];
    return `<ellipse cx="${x}" cy="${y}" rx="7" ry="17" transform="rotate(${i % 2 ? -45 : 45} ${x} ${y})"/>`;
  })).join('');
  const anatomyOverlay = `<svg class="anatomy-overlay" viewBox="0 0 960 700" aria-label="Illustrative planting and occupation over the existing Bower model"><g class="plant-layer" fill="#526c42" opacity=".82"><path d="${plantPath}" fill="none" stroke="#344c2c" stroke-width="4"/>${leaves}</g><g class="people-layer" fill="#243b31"><circle cx="465" cy="463" r="10"/><path d="M457 477h16l6 45h-9l-4-27-2 27h-10z M458 518h8v40h-8z M468 518h8l6 40h-8z"/><circle cx="571" cy="487" r="9"/><path d="M563 499h15l8 40h-31z M565 536h7v31h-7z M575 536h6v31h-6z"/></g></svg>`;

  const sticky = (title, copy, cls = '') => `<aside class="visual-sticky ${cls}" aria-label="Visual to come: ${title}"><span>VISUAL TO COME</span><h3>${title}</h3><p>${copy}</p></aside>`;

  function scaleStudy() {
    const arch = (x,y,s=1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M0 100Q0 15 60 0Q120 15 120 100 M0 100Q60 8 120 100 M18 100Q60 -2 102 100 M38 100Q60 24 82 100 M0 100Q34 40 60 0Q86 40 120 100"/><path d="M17 60Q60 35 103 60M30 38Q60 22 90 38" stroke-width="1"/></g>`;
    const tree = (x,y,s=1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 80V27M0 55L-19 38M0 45L19 24" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cy="19" rx="27" ry="33" fill="#849a73" opacity=".35"/></g>`;
    const scene = (i) => {
      if(i===0) return `${arch(44,100,.88)}${tree(176,118,.72)}`;
      if(i===1) return `${arch(16,83,1.15)}${arch(88,83,1.15)}`;
      if(i===2) return `${arch(15,46,1.54)}<path d="M111 190V74M50 163L170 163" stroke="currentColor" opacity=".35"/>`;
      if(i===3) return `<path d="M34 192V39H188V192M34 85H188M34 139H188" fill="none" stroke="currentColor" stroke-width="1.3"/>${arch(34,135,.64)}${arch(112,135,.64)}${[50,90,130,171].map(x=>tree(x,12,.43)).join('')}${arch(34,82,.64)}${arch(112,82,.64)}`;
      if(i===4) return `${[0,1,2].map(n=>arch(6+n*63,83,.92)).join('')}<path d="M0 201H220M0 214H220" stroke="currentColor"/>${tree(19,152,.4)}${tree(198,152,.4)}`;
      return `<path d="M7 191V116H45V191M58 191V49H99V191M111 191V89H150V191M162 191V29H201V191" fill="none" stroke="currentColor" stroke-width="1.2"/>${[0,1,2].map(n=>arch(8+n*67,83,.96)).join('')}${[24,78,137,180].map(x=>tree(x,106,.38)).join('')}`;
    };
    return `<div class="scale-scenes">${['Garden room','Cultural pavilion','Sanctuary','Living building','Planted street','Urban fabric'].map((title,i)=>`<button class="scale-scene" data-scale="${i}" aria-pressed="${i===0}"><span class="scale-order">0${i+1}</span><svg viewBox="0 0 220 235" aria-label="${title}, speculative scale drawing">${scene(i)}<path d="M0 192H220" stroke="currentColor" stroke-width="1"/><circle cx="112" cy="173" r="3" fill="currentColor"/><path d="M112 177V186M108 180H116M112 186L109 193M112 186L115 193" stroke="currentColor"/></svg><span class="scale-title">${title}</span></button>`).join('')}</div>`;
  }

  window.DESIGNX_SLIDES = [
    {
      title: 'Buildings that grow.', act: 'I · The proposition', theme: 'cover image-slide',
      html: `${img('cover.webp','Concept rendering of an inhabited timber Bower with climbing roses and wisteria.','full-image','fetchpriority="high" loading="eager"')}<div class="cover-shade"></div><div class="cover-top"><span class="wordmark">bower</span><p>MIT DesignX × LUMA<br>Creative Intelligence Studio · Arles</p></div><div class="cover-title"><p class="eyebrow">Living architecture.<br>Developing the technology to make it repeatable.</p><h1>Buildings<br>that grow.</h1></div><div class="cover-bottom"><a href="https://www.bowerbuild.org/designx">bowerbuild.org/designx ${arrow}</a><span>Architectural concept / November 2026</span></div>`,
      notes: 'Bower is creating a new category of living architecture and developing the computation and manufacturing capability to make it repeatable. Begin with the desire for the place. The first product is the commissioned Bower; technology serves that architectural ambition.',
      source: 'Existing Bower concept imagery. No completed Bower is represented. Prepared for the MIT–LUMA application, not an indication of selection or endorsement.'
    },
    {
      title: 'The built world. The living world.', act: 'I · The proposition', theme: 'thesis',
      html: `${running('I','The proposition')}<div class="thesis-rule"></div><blockquote><span class="thesis-opening">We mine, pour, and cut; we assemble inert objects that begin decaying the moment they're complete—and we've quietly accepted that</span> <span class="thesis-emphasis">the largest thing our species makes, the built world, is also the most severed from the living one.</span></blockquote>${note('An architectural proposition.')}`,
      notes: 'This is the central provocation, in the founder’s words. It is a cultural thesis about the relationship between architecture and the living world, not a quantified claim about all buildings. Hold here before introducing the alternative.',
      source: 'User-supplied thesis, retained verbatim. The attached positioning essay supplies its context.'
    },
    {
      title: 'Time is a building material.', act: 'I · The proposition', theme: 'growth-slide',
      html: window.DESIGNX_SCENES.growth(),
      notes: "Use the scrubber or play the three illustrative, camera-matched growth states. These existing concept images show the spatial proposition; they are not a simulation or observed botanical performance. Clay’s plant-growth simulation sequence will replace them. The PDF lays out all three states.",
      source: 'Existing Bower library: New Bower, Growing Bower and Mature Bower. None is documentation of a completed building.'
    },
    {
      title: "A structure. Ready for life.", act: 'I · The proposition', theme: 'anatomy-slide',
      html: `${running('I','The proposition')}${head('The structural system','A structure.<br>Ready for life.')}<div class="anatomy-drawing">${img('assembly.webp','Bower One digital assembly drawing.','anatomy-frame')}${anatomyOverlay}</div>${sticky('Bower assembly','Timber members assemble into the Bower. Plants then colonise the frame.','assembly-sticky')}<div class="slide-interaction anatomy-buttons" role="group" aria-label="Anatomy layers"><button data-layer="frame" aria-pressed="false">Structure</button><button data-layer="plants" aria-pressed="false">+ Planting</button><button data-layer="all" aria-pressed="true">+ Life</button></div>${note('Digital assembly study. Timber structure; illustrative planted layer.')}`,
      notes: 'Make the physical product clear. This is an engineered timber spatial structure with an integral planted layer. Plants contribute shade, atmosphere, habitat and additional loads. The current proposition does not assume the plants replace or strengthen the engineered load path. The overlay is illustrative and is not a planting specification.',
      source: 'Bower One assembly model from the repository’s technical page. Plant and human overlays are new explanatory drawings.'
    },
    {
      title: "The first market for living architecture.", act: 'I · The proposition', theme: 'buyers-slide',
      html: `${running('I','The proposition')}${head('The first customers','The first market for living architecture.')}<div class="buyer-triptych">${[['buyer-private.webp','Private gardens','A legacy.'],['higgsfield/cultural-destination.webp','Cultural destinations','A reason to visit.'],['higgsfield/resort-hospitality.webp','Hospitality','Somewhere unforgettable.']].map(([file,title,copy],i)=>`<figure>${img(file,`${title}: Bower concept.`)}${i===2?'<video class="buyer-film" data-customer-film data-src="assets/higgsfield/resort-hospitality.mp4" muted playsinline preload="none" aria-label="Generated resort Bower concept film"></video><button class="film-toggle slide-interaction" data-customer-play aria-label="Play resort concept film" aria-pressed="false">Play film ↗</button>':''}<figcaption><p>${copy}</p><h3>${title}</h3></figcaption></figure>`).join('')}</div>${note('Generated Bower concepts / prospective settings, not commissioned projects.')}`,
      notes: 'The first buyers seek distinct outcomes: private legacy, cultural and educational attraction, and a memorable hospitality or public-realm experience. These are identified customer segments, not proof of repeatable sales. The images explain uses; they do not represent work for the named prospects on slide 10.',
      source: 'Customer categories in the supplied brief. Private garden: existing Bower library. Cultural destination and resort: founder-authorized existing Higgsfield concepts, 12 November 2026. The film is generated concept footage, not a built project or a named client commission.'
    },
    {
      title: 'Make variability manufacturable.', act: 'II · The invention', theme: 'variability-slide',
      html: `${running('II','The invention')}<div class="variability-top"><div><p class="eyebrow">Geometric variation</p><h2>Every piece<br>is different.</h2></div><div><p class="eyebrow">Industrial logic</p><h2>Every process<br>must be repeatable.</h2></div></div><div class="variation-fields"><div class="natural-field">${['01','20','40'].map((n,i)=>`<div>${img(`part-${n}.webp`,`Actual digital timber component CW-${n.padStart(3,'0')}.`)}<span>CW-${n.padStart(3,'0')}</span></div>`).join('')}</div><div class="standard-field" aria-label="Schematic representation of repeated standard stock">${Array.from({length:12},(_,i)=>`<i style="--n:${i}"></i>`).join('')}<span>REPEATABLE STOCK / SCHEMATIC</span></div></div><blockquote>Variability is the essence of nature and the enemy of industry. <em>Bower's bet is to make variability manufacturable.</em></blockquote>${note('Left: distinct parts from the digital Bower One R13 model. The challenge is economical, reliable variation—not the impossibility of bespoke making.')}`,
      notes: 'There are several sources of variability: wood properties, component geometry, site constraints, planting, construction and time. Conventional production makes repetition efficient. Bower is exploring a repeatable process that can produce non-identical parts. These are modelled components, not a photograph of manufactured timber.',
      source: 'Exact technical thesis from the user; CW-001, CW-020 and CW-040 rendered from the Bower One R13 part model.'
    },
    {
      title: "Design the form. Resolve every part.", act: 'II · The invention', theme: 'computation-slide',
      html: `${running('II','The invention')}${head('Our design-to-manufacture engine / in development','Design the form.<br>Resolve every part.')}<div class="computation-model">${img('model-one.webp','Bower One R13 digital assembly.')}</div>${sticky('The engine diagram','Daniel’s geometry, checks and fabrication workflow. Show how they connect.','engine-sticky')}<div class="model-ident"><span>BOWER ONE / R13</span><p>939 model parts · 92 primary timbers</p></div>${note('Existing digital model. Current engine diagram to follow.')}`,
      notes: "This chapter connects architectural intent to computational geometry and fabrication information. The R13 render is an existing digital study with 939 closed model parts and 92 primary timbers. The sticky note reserves the engine diagram for Daniel’s current system work; the render does not stand in for that diagram. Current module status will follow the supplied diagram.",
      source: "Bower One R13 digital model from the repository. Engine diagram pending current material from Daniel; no structural certification or completed manufacturing system is asserted."
    },
    {
      title: 'Design the making.', act: 'II · The invention', theme: 'factory-slide',
      html: `${running('II','The invention')}${head('Factory development','Design the making.')}<p class="factory-deckline">A production system for parts that are never quite the same.</p><div class="factory-sheet">${sticky('Factory floor drawing','Daniel’s live factory plan. Reveal the route from timber to finished component.','factory-sticky')}</div>${note('Factory design in development. Drawing to follow.')}`,
      notes: 'Daniel is actively developing the factory drawings. This scene is reserved for the real plan or section, followed by an intentional animation tracing the manufacturing process. The sticky note marks the exact visual still to integrate. Current design work is meaningful evidence; it is not an assertion that the facility is operating.',
      source: 'Current factory drawing development reported by the founder on 13 November 2026. Awaiting Daniel’s drawing for integration.'
    },
    {
      title: 'Every Bower could teach the next.', act: 'II · The invention', theme: 'learning-slide',
      html: window.DESIGNX_SCENES.technical(),
      notes: 'This slide answers a technical question: what evidence would improve the next design? Geometry and checks already provide digital evidence. Fabrication measurements, plant observations, maintenance and occupation could eventually inform the design rules. The system is deliberately shown open: factory and garden measurement are not deployed.',
      source: 'Intended learning architecture in the supplied brief. Solid node denotes existing digital work; other stages require physical projects and instrumentation.'
    },
    {
      title: "The first conversations.", act: 'III · The first market', theme: 'traction-slide',
      html: `<div class="traction-picture">${img('theatre.webp','Bower theatre concept, not commissioned by the named institutions.')}</div>${running('III','The first market')}${head('Customer discovery','The first<br>conversations.')}<div class="prospects"><p class="eyebrow">In discussion with</p><h3>Eden Project</h3><h3>The Newt</h3><h3>25hours</h3></div>${note('Active discussions, not signed commissions. / Bower concept pictured.')}`,
      notes: 'The user explicitly approved naming the Eden Project, The Newt and 25hours and confirmed the wording “In discussion with”. These are active conversations, not signed deals, awards or commitments. Do not attach an individual’s name or a delivery date. The neighbouring image is a generic Bower cultural concept, not a proposal commissioned by any of these institutions.',
      source: 'Named prospect wording and active-discussion status confirmed by the user on 13 November 2026. No named individuals, endorsements or signed revenue are represented.'
    },
    {
      title: "Commission a Bower.", act: 'III · The first market', theme: 'commercial-model-slide',
      html: `${running('III','The first market')}${head('The commercial offer','Commission a Bower.')}<div class="fee-sequence"><div class="fee-stage active"><span class="fee-order">01 / Find the place</span><h3>Siting study</h3><p class="fee">£65k<span>indicative</span></p></div><span class="fee-arrow" aria-hidden="true">→</span><div class="fee-stage"><span class="fee-order">02 / Develop the design</span><h3>Design development</h3><p class="fee range">£100–250k<span>proposal-specific</span></p></div><span class="fee-arrow" aria-hidden="true">→</span><div class="fee-stage"><span class="fee-order">03 / Make the place</span><h3>Commissioned Bower</h3><div class="fee-mark">${bowerMark}</div><p>Build terms by contract.</p></div></div>${note('Indicative proposal fees. Scope agreed per commission.')}`,
      notes: 'Make the transaction intelligible. The early commercial offer is a paid siting study, followed by project-specific design development and then a commissioned building. The supplied brief proposes £65,000 for the first stage and £100,000–£250,000 for design development. These amounts are indicative and need to be checked against the actual proposal before submission. A Bower commission is the near-term product, rather than a software subscription.',
      source: 'Fee levels and transaction sequence from MASTER_PRESENTATION_BRIEF.md. No revenue or operating margin is asserted.'
    },
    {
      title: 'Proof brings demand. Demand builds capacity.', act: 'IV · The compounding system', theme: 'commercial-loop-slide',
      html: window.DESIGNX_SCENES.commercial(),
      notes: 'This is a commercial hypothesis, distinct from the technical loop. A paid commission creates a place that can be visited and evaluated. A successful building can become a reference for the next customer; project economics could support further capability. Do not imply that a few projects at an assumed margin automatically finance a factory. Working capital, cash conversion and external finance still need validation.',
      source: 'Operating theory from the supplied brief. The full cycle has not yet occurred.'
    },
    {
      title: 'The product supports the tools. The tools improve the product.', act: 'IV · The compounding system', theme: 'coupled-slide',
      html: window.DESIGNX_SCENES.coupled(),
      notes: 'The bridges are the point. Commissioned projects provide real contexts, budgets and future evidence for technical work. Better design-to-manufacture workflows could return quality, more predictable costs and greater buildability to the commercial offering. The actual Bower stays in the centre. Neither a factory nor an abstract software platform replaces the architectural product.',
      source: 'Synthesis of the two intended loops from the supplied brief. “Supports” avoids claiming that realised product margins already finance the tools.'
    },
    {
      title: "Designed together.", act: 'IV · The compounding system', theme: 'team-slide',
      html: `${running('IV','The compounding system')}${head('The founders','Designed together.')}<div class="team-grid"><figure>${img('clay.jpg','Clay Seifert.')}<figcaption><p class="eyebrow">Design + research</p><h3>Clay<br>Seifert</h3><p>Architecture.<br>Computation.<br>Living systems.</p><span>UT Austin / B.Arch</span></figcaption></figure><figure>${img('daniel.jpg','Daniel Guerra.')}<figcaption><p class="eyebrow">Engine + systems</p><h3>Daniel<br>Guerra</h3><p>Software.<br>Fabrication.<br>Project delivery.</p><span>Forsite Studio / project experience</span></figcaption></figure></div>`,
      notes: 'The work needs architecture, computation, material research, fabrication logic and project delivery to develop together. Clay’s background includes a B.Arch at UT Austin and computational / living-systems research. Daniel’s published background includes Forsite Studio projects from concept through permitting to site, alongside Bower’s engine and systems development. Neither founder is described as a licensed architect.',
      source: 'Actual founder portraits and public biographies in the Bower repository, reconciled with the supplied brief. Titles are functional descriptions, not new corporate appointments.'
    },
    {
      title: 'A room is the beginning.', act: 'V · The future', theme: 'future-slide',
      html: `${running('V','The future')}${head('Future architectural possibilities','A room is the beginning.')}<p class="future-standfirst">From a garden room to a living urban fabric.</p>${scaleStudy()}<div class="future-line"><span>FIRST PRODUCT</span><span>LONG-TERM RESEARCH HORIZON ${arrow}</span></div>${note('Speculative scale studies, not engineered designs, committed projects or a delivery roadmap.')}`,
      notes: 'Expand the imagination without inflating the current proof. The current product begins as an inhabitable garden room. The diagrams explore a possible progression to cultural space, sanctuary, building, planted street and urban fabric. Repetition of the same simple architectural vocabulary creates continuity. These drawings do not establish engineering feasibility or imply that city-scale systems are already being developed.',
      source: 'Original schematic drawings for this presentation, explicitly speculative. No invented photorealistic building is passed off as completed or technically validated.'
    },
    {
      title: "Buildings that grow.", act: 'V · The future', theme: 'closing image-slide',
      html: `${img('close.webp','Concept of an inhabited Bower colonised by planting.','full-image')}<div class="closing-shade"></div><div class="closing-top"><span class="wordmark">bower</span><span>MIT DesignX × LUMA</span></div><div class="closing-copy"><p class="eyebrow">A different future for the built world.</p><h2>Buildings<br>that grow.</h2><p class="closing-ask">The first Bower.<br>The means to make many.</p></div><div class="closing-bottom"><a href="https://www.bowerbuild.org/designx">bowerbuild.org/designx ${arrow}</a><span>Architectural concept</span></div>`,
      notes: 'Close on the specific threshold rather than a generic request for support. The Studio’s combination of design, art, research and venture development is relevant to moving from compelling architectural proposition and technical groundwork to a funded full-scale first Bower and a credible repeatable process. The user remains responsible for confirming attendance and application requirements.',
      source: 'Studio fit grounded in the official MIT–LUMA programme description. Application context only: no selection or sponsorship is implied.'
    }
  ];
})();
