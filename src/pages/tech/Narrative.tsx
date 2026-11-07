import { Garden } from './media';
import { imageSizes } from './imageSizes';
import { PartsField } from './PartsField';
import { LoadDiagram } from './LoadDiagram';
import { LoadDirections } from './LoadDirections';
import { ChecksTimeline } from './ChecksTimeline';

const drawings = [
  {
    id: 'surface', heading: ['The whole', 'in view.'],
    src: '/assets/tech/bower-engine-one-perspective.webp',
    alt: 'Historical Bower One R13 perspective, showing the doubly curved canopy, crossing ribs, ring and feet',
    description: 'The canopy curves in two directions. Two families of ribs follow that surface, meeting the arches below and the ring above. Their geometry is coordinated in one model.',
    caption: 'Bower One R13, perspective. September 2026.',
  },
  {
    id: 'joint', heading: ['Down to', 'the joint.'],
    src: '/assets/tech/bower-engine-section-rib-to-arch.webp',
    alt: 'Historical section study of a timber rib meeting an arch with a tongue and peg',
    description: 'A rib meets an arch. The section lets us examine the joint and its allowances.',
    caption: 'September 2026',
  },
  {
    id: 'foot', heading: ['At the', 'ground.'],
    src: '/assets/tech/bower-engine-section-foot.webp',
    alt: 'Historical arch foot study with timber heel, knife plates and base plate',
    description: 'The foot study brings the timber heel, steel plates and fixings into one section for engineering review.',
    caption: 'September 2026',
  },
] as const;

export function Narrative() {
  return <>
    <section data-snap-section className="tech-material tech-section tech-frame" id="method" aria-labelledby="material-title">
      <h2 id="material-title">We believe<br />timber is limitless.</h2>
      <div>
        <p>Our design engine checks how much each rib must bend and twist. It identifies where a proposed form exceeds the assumptions for the timber and the forming process.</p>
        <p>In the current demo model, we can hold the crown height and entrance clearance while comparing different forms and groups of forming jigs. We can see what a change asks of the timber before committing to it.</p>
      </div>
    </section>
    {drawings.slice(0, 1).map((drawing) => <section key={drawing.id} data-snap-section
      className={'tech-drawing-frame tech-section tech-frame tech-drawing-frame--' + drawing.id}
      id={drawing.id} aria-labelledby={drawing.id + '-title'}>
      <div className="tech-section-heading">
        <h2 id={drawing.id + '-title'}>{drawing.heading[0]}<br />{drawing.heading[1]}</h2>
        <p>{drawing.description}</p>
      </div>
      <figure>
        <img src={drawing.src} alt={drawing.alt} width={imageSizes[drawing.src][0]} height={imageSizes[drawing.src][1]} loading="lazy" decoding="async" />
        <figcaption className="tech-caption">{drawing.caption}</figcaption>
      </figure>
    </section>)}
    <section data-snap-section className="tech-detail-pair tech-section tech-frame" id="joint" aria-label="Rib and ground connections">
      {drawings.slice(1).map(drawing => <figure key={drawing.id} id={drawing.id === 'foot' ? 'foot' : undefined}>
        <img src={drawing.src} alt={drawing.alt} width={imageSizes[drawing.src][0]} height={imageSizes[drawing.src][1]} loading="lazy" decoding="async" />
        <figcaption>
          <p>{drawing.description}</p>
          <p className="tech-caption">{drawing.caption}</p>
        </figcaption>
      </figure>)}
    </section>
    <section data-snap-section className="tech-detail-pair tech-section tech-frame" id="connections" aria-label="Ring and rib connections">
        <figure className="tech-ring-detail">
          <img src="/assets/tech/bower-engine-section-rib-to-ring.webp" width="786" height="678" loading="lazy" decoding="async" alt="Section through the ring with two tiers of rib tongues, headed keys and keepers" />
          <figcaption><p>At the crown, tongues, keys and keepers connect the ribs to the ring.</p><p className="tech-caption">September 2026</p></figcaption>
        </figure>
        <figure>
          <img src="/assets/tech/bower-engine-section-rib-crossing.webp" width="898" height="616" loading="lazy" decoding="async" alt="Measured section of a fitted timber key passing through two crossing ribs" />
          <figcaption><p>Where ribs cross, a fitted timber key joins them. The connection is modelled and examined in section.</p><p className="tech-caption">September 2026</p></figcaption>
        </figure>
    </section>
    <PartsField />
    <section data-snap-section className="tech-stock tech-section tech-frame" id="stock" aria-label="Timber and material specification">
      <div className="tech-section-heading">
        <p>In the earlier jointed model, each family of timber keeps a constant section. Its shape follows the canopy; local cuts form the connections.</p>
        <p>The model records timber volumes and steel parts. Species, grade, moisture, and production tolerances are chosen for the site's rainfall, humidity, temperature range, and wind exposure. These decisions are resolved with our engineers and fabricators.</p>
      </div>
      <div className="tech-stock-parts">
        {[
          ['EA-01', 'Arch', 'A curved member with local receivers and cuts at its feet.'],
          ['CW-014', 'Rib', 'A constant section, with its own curve and joint positions.'],
          ['OR-01-Q1', 'Ring sector', 'Curved stock with local scarf cuts at the seams.'],
        ].map(([id, title, text]) => <figure key={id}>
          <img src={'/assets/tech/timbers-r13/' + id + '.webp'} width="1200" height="500" loading="lazy" decoding="async" alt={title + ' geometry from Bower One R13'} />
          <figcaption><h3>{title}</h3><p>{text}</p></figcaption>
        </figure>)}
        <p className="tech-caption">September 2026</p>
      </div>
    </section>
    <section data-snap-section className="tech-checks tech-section" id="checks" aria-labelledby="checks-title">
      <div className="tech-section-heading">
        <h2 id="checks-title">How we check a design</h2>
        <p>We turn a design into questions that can be tested: how the timber bends, how parts meet, and what still needs to be resolved.</p>
      </div>
      <ChecksTimeline />
    </section>
    <section data-snap-section className="tech-structure tech-drawing-frame tech-section tech-frame" id="structure" aria-label="Plant loading">
      <div className="tech-section-heading">
        <p>Plant growth changes what the structure carries. Wind acts differently on bare timber and on a canopy in leaf.</p>
        <p>We set up structural load cases and combinations, and distributed plant loads across the model. This work prepared the inputs for further analysis and review.</p>
      </div>
      <figure>
        <LoadDiagram />
        <figcaption className="tech-caption">Plant-load application, earlier gridshell study; 3 September 2026.</figcaption>
      </figure>
    </section>
    <section data-snap-section className="tech-loads tech-section tech-frame" id="loads" aria-label="Structural load assumptions">
      <div className="tech-section-heading">
        <p>The structural test setup considers the life of the planted canopy. Its assumptions and unresolved inputs travel with the model for engineering review.</p>
      </div>
      <LoadDirections />
      <dl>
        <div><dt>Timber and planting</dt><dd>The structure's own weight, initial planting and mature growth. Dead load remained unresolved in this study.</dd></div>
        <div><dt>Wind and uplift</dt><dd>Bare and leafy canopy scenarios, including uneven loading. Wind assumptions and support restraint require engineering verification.</dd></div>
        <div><dt>Snow, ice and time</dt><dd>Seasonal loads and long-term behaviour. Snow and ice were not yet quantified; load combinations awaited a confirmed dead load.</dd></div>
      </dl>
    </section>
    <section data-snap-section className="tech-close" aria-labelledby="close-title">
      <Garden slug="13-grape-oculus" sizes="max(100vw, 80svh)" />
      <div>
        <h2 id="close-title">The garden<br />does the rest.</h2>
        <p className="tech-close-purpose">A framework for climbing plants, and a place for people to gather.</p>
      </div>
    </section>
  </>;
}
