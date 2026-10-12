import './bower-direction.css';
import './practice-garden.css';
import { routes } from '../routing';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';

const FOUNDERS = [
  {
    name: 'Clay Seifert',
    role: 'Cofounder · design',
    image: '/assets/about/clay-seifert.jpg',
    bio: 'Clay works across design and the geometry of timber structures, bringing a patient interest in how materials, plants and buildings shape one another.',
  },
  {
    name: 'Daniel Guerra',
    role: 'Cofounder · systems',
    image: '/assets/about/daniel-guerra.jpg',
    bio: 'Daniel works across design, building systems and computational tools, connecting an idea for a place with the practical path toward making it real.',
  },
] as const;

export function PracticeEditorial() {
  return (
    <div className="practice-minimal editorial-page">
      <EditorialHeader logoSrc="/assets/brand/bower-logo-evergreen-horizontal-transparent.png" />
      <main>
        <section className="practice-minimal-opening" aria-labelledby="practice-title">
          <h1 id="practice-title">A shared belief in living architecture.</h1>
        </section>

        <section className="practice-minimal-founders" aria-labelledby="founders-title">
          <header>
            <h2 id="founders-title">Two ways of seeing,<br />one direction.</h2>
          </header>
          <div className="practice-minimal-founder-grid">
            {FOUNDERS.map((founder) => (
              <article key={founder.name}>
                <img src={founder.image} alt={founder.name} loading="lazy" />
                <div>
                  <h3>{founder.name}</h3>
                  <p className="practice-minimal-role">{founder.role}</p>
                  <p>{founder.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="practice-minimal-mission" aria-labelledby="mission-title">
          <div className="practice-minimal-mission-statement">
            <p className="practice-minimal-kicker">Our mission</p>
            <h2 id="mission-title">One Bower team,<br />assembled for<br />one place.</h2>
            <p>Bower leads the commission from the first site conversation through design, making and stewardship. For each landscape, we assemble the appropriate engineering, fabrication, planning and landscape specialists; each role and appointment is defined around the site and the work it must support.</p>
            <a href={routes.contact}>Contact Bower</a>
          </div>
          <ul className="practice-minimal-mission-list">
            <li><strong>Engineering</strong><p>Structure, foundations, weather and public use</p></li>
            <li><strong>Fabrication</strong><p>Timber development, prototyping and assembly</p></li>
            <li><strong>Landscape</strong><p>Planting design, establishment and stewardship</p></li>
            <li><strong>Planning</strong><p>Consent strategy and project-specific advice</p></li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
