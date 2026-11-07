import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { usePageSnap } from '../ui/usePageSnap';
import { Film, Garden } from './tech/media';
import { Narrative } from './tech/Narrative';
import './bower-direction.css';
import './tech/tech.css';

export function TechPage() {
  usePageSnap({ strength: 'proximity' });
  return <div className="technology-page editorial-page">
    <a className="tech-skip" href="#assembly">Skip to the assembly</a>
    <EditorialHeader tone="white" />
    <main>
      <section data-snap-section className="tech-garden" aria-labelledby="tech-title">
        <Garden slug="21-woodland-bower" eager sizes="max(100vw, 180svh)" />
        <div className="tech-garden-copy">
          <h1 id="tech-title">Technology<br />at Bower.</h1>
          <p>A place that feels natural.</p>
        </div>
      </section>
      <section data-snap-section className="tech-assembly tech-section tech-frame" id="assembly" aria-labelledby="assembly-title">
        <div className="tech-section-heading">
          <h2 id="assembly-title">Every piece<br />has to fit.</h2>
          <p>A Bower is made of curves that depend on one another. Change the canopy and its ribs, crossings and connections have to change with it.</p>
        </div>
        <figure className="tech-assembly-visual">
          <Film />
          <figcaption className="tech-caption">Digital Assembly Study; September 2026</figcaption>
        </figure>
      </section>
      <Narrative />
    </main>
    <Footer />
  </div>;
}
