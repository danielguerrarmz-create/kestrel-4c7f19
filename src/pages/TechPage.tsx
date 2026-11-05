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

function pairs<T>(items: readonly T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
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
          alt="Bower One timber assembly study"
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
          aria-label="Bower One assembly study: steel feet, timber arches, and the curved ribs"
        >
          <source src="/assets/tech/bower-assembly-480.av1.webm" media="(max-width: 640px)" type='video/webm; codecs="av01.0.04M.08"' />
          <source src="/assets/tech/bower-assembly-480.mp4" media="(max-width: 640px)" type="video/mp4" />
          <source src="/assets/tech/bower-assembly-720.av1.webm" type='video/webm; codecs="av01.0.05M.08"' />
          <source src="/assets/tech/bower-assembly-720.mp4" type="video/mp4" />
        </video>
      )}
      <figcaption>Bower One assembly study.</figcaption>
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
            <p className="tech-study">These are design studies. The figures belong to the revisions named here. They are not construction documents.</p>
          </div>
          <AssemblyFilm />
        </section>

        <section id="engine" data-snap-section className="tech-engine" aria-labelledby="tech-engine">
          <div className="tech-engine-copy">
            <p>{engine.summary}</p>
            <h2 id="tech-engine">Every part<br />has a name.</h2>
            {engine.stats && <Facts stats={engine.stats} />}
            {engine.status && <p className="tech-status">{engine.status}</p>}
            <p className="tech-caveat">{engine.body[2]}</p>
            <details className="tech-notes">
              <summary>How a part is closed</summary>
              <p>{engine.body[0]}</p>
              <p>{engine.body[1]}</p>
            </details>
          </div>
        </section>

        <section aria-labelledby="tech-surface">
          <div id="surface" data-snap-section className="tech-prologue">
            <p>{surface.summary}</p>
            <h2 id="tech-surface">Curved<br />both ways.</h2>
          </div>
          {surface.images[0] && (
            <div data-snap-section className="tech-plate">
              <Plate image={surface.images[0]} />
            </div>
          )}
          <div data-snap-section className="tech-reading">
            {surface.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {surface.status && <p className="tech-status">{surface.status}</p>}
          </div>
          {engine.images.map((image) => (
            <div data-snap-section className="tech-plate" key={image.src}>
              <Plate image={image} />
            </div>
          ))}
        </section>

        <section id="stock" data-snap-section className="tech-acts" aria-labelledby="tech-stock">
          <div className="tech-acts-copy">
            <h2 id="tech-stock">One section<br />per family.</h2>
            <p>{stock.summary}</p>
          </div>
          <div>
            <ol>
              {stockRows.map((row) => (
                <li key={row.cells[0]}>
                  <h3>{row.cells[0]}</h3>
                  <p>{stockDetail(row.cells[1], row.cells[2])}</p>
                </li>
              ))}
            </ol>
            <p className="tech-caveat">{stock.body[0]}</p>
            {stock.tables && <Schedules tables={stock.tables} label="The measured schedule" />}
          </div>
        </section>

        <section aria-labelledby="tech-joints">
          <div id="joints" data-snap-section className="tech-prologue tech-prologue--text">
            <div>
              <p>{joints.summary}</p>
              {joints.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <h2 id="tech-joints">Measured<br />sections.</h2>
          </div>
          {pairs(joints.images).map((row) => (
            <div data-snap-section className="tech-joints-row" key={row[0].src}>
              {row.map((image) => <Plate key={image.src} image={image} />)}
            </div>
          ))}
        </section>

        <section id="checks" data-snap-section className="tech-acts" aria-labelledby="tech-checks">
          <div className="tech-acts-copy">
            <h2 id="tech-checks">What geometry<br />can prove.</h2>
            {checks.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {checks.status && <p className="tech-status">{checks.status}</p>}
          </div>
          <div>
            {checks.stats && <Facts stats={checks.stats} />}
            {checks.study && (
              <>
                <h3 className="tech-review-title">{checks.study.title}</h3>
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
                <p className="tech-status">{checks.study.source}</p>
              </>
            )}
          </div>
        </section>

        <section aria-labelledby="tech-structure">
          <div id="structure" data-snap-section className="tech-prologue tech-prologue--text">
            <div>
              <p>{structure.summary}</p>
              {structure.stats && <Facts stats={structure.stats} />}
              {structure.status && <p className="tech-status">{structure.status}</p>}
            </div>
            <h2 id="tech-structure">None solved<br />yet.</h2>
          </div>
          {structure.images[0] && (
            <div data-snap-section className="tech-plate">
              <Plate image={structure.images[0]} />
            </div>
          )}
          <div data-snap-section className="tech-reading">
            {structure.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {structure.tables && <Schedules tables={structure.tables} label="Load cases and combinations" />}
          </div>
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
