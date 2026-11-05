import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { useReducedMotion } from '../ui/useReducedMotion';
import { usePageSnap } from '../ui/usePageSnap';
import { useViewportVideo } from '../ui/useViewportPlayback';
import { routes } from '../routing';
import { chapters, type TechChapter, type TechImage, type TechStat, type TechTable } from './tech/content';
import { imageSizes } from './tech/imageSizes';
import './bower-direction.css';
import './tech/tech.css';

function chapter(id: string): TechChapter {
  const found = chapters.find((item) => item.id === id);
  if (!found) throw new Error(`Missing technology chapter ${id}`);
  return found;
}

function stockDetail(count: string, section: string) {
  if (section.endsWith(' long')) return `${count}. ${section.replace(/ long$/, '')} mm long`;
  const radial = section.match(/^(\d+)\s+radial\s+x\s+(\d+)\s+normal$/);
  if (radial) return `${count}. ${radial[1]} mm radial, ${radial[2]} mm normal`;
  return `${count}. ${section} mm`;
}

/** A drawing at its own size, opened at full resolution. Linework is never cropped. */
function Plate({ image }: { image: TechImage }) {
  const size = imageSizes[image.src];
  return (
    <figure>
      <a href={image.src} target="_blank" rel="noopener" aria-label={`Open full size: ${image.alt}`}>
        <img
          src={image.src}
          alt={image.alt}
          width={size?.[0]}
          height={size?.[1]}
          loading="lazy"
          decoding="async"
        />
      </a>
      <figcaption>{image.caption}</figcaption>
    </figure>
  );
}

function AssemblyFilm() {
  const ref = useViewportVideo();
  const reduced = useReducedMotion();
  const size = imageSizes['/assets/tech/bower-assembly-sharp.webp'];
  return (
    <figure className="tech-film">
      {reduced ? (
        <img
          src="/assets/tech/bower-assembly-sharp.webp"
          alt="Bower One, with steel feet and timber arches"
          width={size?.[0]}
          height={size?.[1]}
        />
      ) : (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/tech/bower-assembly-sharp.webp"
          width={size?.[0]}
          height={size?.[1]}
          aria-label="Steel feet, timber arches, and curved ribs in the Bower One model"
        >
          <source src="/assets/tech/bower-assembly-480.av1.webm" media="(max-width: 640px)" type='video/webm; codecs="av01.0.04M.08"' />
          <source src="/assets/tech/bower-assembly-480.mp4" media="(max-width: 640px)" type="video/mp4" />
          <source src="/assets/tech/bower-assembly-720.av1.webm" type='video/webm; codecs="av01.0.05M.08"' />
          <source src="/assets/tech/bower-assembly-720.mp4" type="video/mp4" />
        </video>
      )}
    </figure>
  );
}

function Facts({ stats }: { stats: readonly TechStat[] }) {
  return (
    <div className="tech-facts">
      {stats.map((stat) => (
        <p key={stat.value}>
          {stat.value} {stat.label}.{stat.note ? ` ${stat.note}.` : ''}
        </p>
      ))}
    </div>
  );
}

function Schedules({ tables, label }: { tables: readonly TechTable[]; label: string }) {
  return (
    <details className="tech-schedules">
      <summary>{label}</summary>
      <div className="tech-table-grid">
        {tables.map((table) => (
          <div className="tech-table-wrap" key={table.caption} role="region" aria-label={table.caption} tabIndex={0}>
            <table>
              <caption>{table.caption}</caption>
              <thead>
                <tr>{table.columns.map((col) => <th key={col} scope="col">{col}</th>)}</tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.cells.join('|')}>
                    {row.cells.map((cell, index) => (
                      index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </details>
  );
}

export function TechPage() {
  usePageSnap();
  const engine = chapter('engine');
  const surface = chapter('surface');
  const stock = chapter('stock');
  const joints = chapter('joints');
  const checks = chapter('checks');
  const structure = chapter('structure');
  const stockRows = stock.tables?.flatMap((table) => table.rows) ?? [];

  return (
    <div className="tech-editorial editorial-page">
      <EditorialHeader />
      <main>
        <section data-snap-section className="tech-hero" aria-labelledby="tech-title">
          <div className="tech-hero-copy">
            <h1 id="tech-title">Technology<br />at Bower.</h1>
            <p>We model a curved timber lattice. The garden grows through it.</p>
          </div>
          <AssemblyFilm />
        </section>

        <section id="engine" data-snap-section className="tech-band" aria-labelledby="tech-engine">
          <div className="tech-band-copy">
            <h2 id="tech-engine">Every part<br />has a name.</h2>
            <div>
              <p>{engine.summary} {engine.body[2]} These studies are not construction documents.</p>
              {engine.stats && <Facts stats={engine.stats} />}
              {engine.status && <p className="tech-status">{engine.status}</p>}
              <details className="tech-notes">
                <summary>How a part is closed</summary>
                <p>{engine.body[0]}</p>
                <p>{engine.body[1]}</p>
              </details>
            </div>
          </div>
          <div className="tech-band-figures">
            {engine.images.map((image) => <Plate key={image.src} image={image} />)}
          </div>
        </section>

        <section id="surface" data-snap-section className="tech-with" aria-labelledby="tech-surface">
          {surface.images[0] && <Plate image={surface.images[0]} />}
          <div>
            <h2 id="tech-surface">Curved<br />both ways.</h2>
            {surface.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {surface.status && <p className="tech-status">{surface.status}</p>}
            <div id="stock" className="tech-stock">
              <h3 id="tech-stock">One section per family.</h3>
              <p>{stock.body[0]}</p>
              <ol>
                {stockRows.map((row) => (
                  <li key={row.cells[0]}>
                    <h3>{row.cells[0]}</h3>
                    <p>{stockDetail(row.cells[1], row.cells[2])}</p>
                  </li>
                ))}
              </ol>
              {stock.tables && <Schedules tables={stock.tables} label="The measured schedule" />}
            </div>
          </div>
        </section>

        <section id="joints" data-snap-section className="tech-band" aria-labelledby="tech-joints">
          <div className="tech-band-copy">
            <h2 id="tech-joints">Measured<br />sections.</h2>
            <div>
              {joints.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="tech-quad">
            {joints.images.map((image) => <Plate key={image.src} image={image} />)}
          </div>
        </section>

        <section id="checks" data-snap-section className="tech-checks" aria-labelledby="tech-checks">
          <div>
            <h2 id="tech-checks">What geometry<br />can prove.</h2>
            {checks.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {checks.status && <p className="tech-status">{checks.status}</p>}
          </div>
          <div>
            {checks.stats && <Facts stats={checks.stats} />}
            {checks.study && (
              <ol>
                {checks.study.points.map((point) => {
                  const split = point.indexOf(': ');
                  const title = split === -1 ? point : point.slice(0, split);
                  const rest = split === -1 ? '' : point.slice(split + 2);
                  return (
                    <li key={point}>
                      <h3>{title}</h3>
                      {rest && <p>{rest}</p>}
                    </li>
                  );
                })}
              </ol>
            )}
            {checks.study && <p className="tech-status">{checks.study.source}</p>}
          </div>
        </section>

        <section id="structure" data-snap-section className="tech-with tech-with--copy-first" aria-labelledby="tech-structure">
          <div>
            <h2 id="tech-structure">None solved<br />yet.</h2>
            <p>{structure.summary} On this earlier gridshell of 263 timber laths, the model also writes 5 combinations. It runs 11 forming checks over 43,239 points: 7 pass, 3 fail and 1 is retired. The combinations stay pending until the dead load is fixed.</p>
            {structure.stats && <Facts stats={structure.stats} />}
            {structure.status && <p className="tech-status">{structure.status}</p>}
            {structure.tables && <Schedules tables={structure.tables} label="Load cases and combinations" />}
          </div>
          {structure.images[0] && <Plate image={structure.images[0]} />}
        </section>

        <section data-snap-section className="tech-close" aria-labelledby="tech-close">
          <h2 id="tech-close">The garden<br />does the rest.</h2>
          <a href={routes.contact}>Begin with a conversation <span aria-hidden="true">→</span></a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
