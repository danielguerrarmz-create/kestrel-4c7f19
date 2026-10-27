import './bower-direction.css';
import './practice-garden.css';
import { routes } from '../routing';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { usePageSnap } from '../ui/usePageSnap';
import { TEAM } from './about/projects';

export function PracticeEditorial() {
  usePageSnap();
  return (
    <div className="practice-minimal editorial-page">
      <EditorialHeader logoSrc="/assets/brand/bower-logo-evergreen-horizontal-transparent.png" />
      <main>
        <section data-snap-section className="practice-minimal-opening" aria-labelledby="practice-title">
          <div className="practice-minimal-opening-copy">
            <h1 id="practice-title">The obsession is old.</h1>
            <p>How can architecture be grown, not only built?</p>
          </div>
        </section>

        <section data-snap-section className="practice-minimal-founders" aria-labelledby="founders-title">
          <header>
            <h2 id="founders-title">Two founders.<br />One practice.</h2>
          </header>
          <div className="practice-minimal-founder-grid">
            {TEAM.map((founder) => {
              // The approved short bios are the Built facts, as on the September page.
              const bio = founder.facts.find((fact) => fact.label === 'Built');
              return (
                <article key={founder.id}>
                  {founder.image && <img src={founder.image} alt={founder.name} loading="lazy" />}
                  <div>
                    <h3>{founder.name}</h3>
                    <p className="practice-minimal-role">{founder.role}</p>
                    {bio && <p className="practice-minimal-founder-bio">{bio.value}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section data-snap-section className="practice-minimal-mission" aria-labelledby="mission-title">
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
