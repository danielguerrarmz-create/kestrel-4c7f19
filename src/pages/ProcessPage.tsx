import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import { selectedImage, selectedStudy, type SelectedStudy } from '../data/selectedImages';
import './bower-direction.css';
import './process-journey.css';

function ProcessImage({ slug, eager = false, sizes = '100vw' }: {
  slug: SelectedStudy['slug'];
  eager?: boolean;
  sizes?: string;
}) {
  const study = selectedStudy(slug);
  const src = selectedImage(slug);
  return <img src={src} srcSet={srcSetFor(src)} sizes={sizes} alt={study.alt} loading={eager ? 'eager' : 'lazy'} />;
}

const closingFrames = ['25-new-bower', '26-growing-bower', '27-mature-bower', '28-winter-bower'] as const;

const acts = [
  ['Conversation', 'Landscape, people, purpose.'],
  ['Founding Site Study', 'Four weeks · £65,000 GBP plus approved travel and project expenses.'],
  ['Design', 'Geometry, structure, planting.'],
  ['Making', 'Fabrication and assembly.'],
  ['Stewardship', 'Training, growth, care.'],
] as const;

export function ProcessPage() {
  return <div className="process-editorial editorial-page">
    <EditorialHeader />
    <main>
      <section className="process-editorial-hero" aria-labelledby="process-title">
        <div className="process-editorial-hero-copy">
          <h1 id="process-title">From landscape<br />to Bower.</h1>
          <p>The structure is finished once. The garden never is.</p>
        </div>
      </section>

      <section className="process-editorial-prologue" aria-labelledby="process-alive-title">
        <div className="process-editorial-prologue-copy">
          <p>Ask anyone for the most beautiful place they have ever stood in and they rarely name a building. They name a hollow under a beech. A cave mouth above a beach. A path where the hedge grew over into a tunnel.</p>
          <h2 id="process-alive-title">None of them<br />finished. All of<br />them alive.</h2>
        </div>
        <figure>
          <ProcessImage slug="30-ancient-bower" sizes="100vw" eager />
        </figure>
      </section>

      <section className="process-editorial-evolution" aria-labelledby="process-growth-title">
        <div className="process-editorial-evolution-copy">
          <p>The same Bower: a lattice, leaves in the weave, then a room of blossom and eaves.</p>
          <h2 id="process-growth-title">The garden continues<br />the architecture.</h2>
        </div>
        <video className="process-editorial-growth-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/process/bower-growth-transition-poster.webp" aria-label="A Bower changing as its planting becomes established">
          <source src="/assets/process/bower-growth-transition-mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/assets/process/bower-growth-transition.mp4" type="video/mp4" />
        </video>
      </section>

      <section className="process-editorial-acts" aria-labelledby="process-acts-title">
        <div>
          <h2 id="process-acts-title"><span>Five acts of</span><br />making.</h2>
        </div>
        <ol>
          {acts.map(([title, description], index) => <li key={title}>
            <h3><span>{index + 1}.</span>{title}</h3>
            <p>{description}</p>
          </li>)}
        </ol>
      </section>

      <section id="process-transition" className="process-editorial-close" aria-label="A Bower through four seasons">
        <div className="process-editorial-transition">
          {closingFrames.map((slug, index) => <ProcessImage key={slug} slug={slug} sizes="100vw" eager={index === 0} />)}
        </div>
        <div className="process-editorial-close-copy">
          <h2>Every<br />landscape asks<br />for a different<br />answer.</h2>
          <a href="/contact">Begin with a conversation <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
