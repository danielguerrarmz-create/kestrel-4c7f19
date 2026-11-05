import { useEffect, useRef, useState } from 'react';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { useReducedMotion } from '../ui/useReducedMotion';
import { usePageSnap } from '../ui/usePageSnap';
import { chapters } from './tech/content';
import { imageSizes } from './tech/imageSizes';
import './bower-direction.css';
import './tech/tech.css';

/** The portfolio's dated research record, presented in Bower's own editorial voice. */
function AssemblyFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced || paused) { video.pause(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: 0.2 });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, [reduced, paused]);
  return <figure className="tech-film">
    {reduced ? <img src="/assets/tech/bower-assembly-sharp.webp" alt="Bower One timber assembly study" /> :
      <video ref={ref} muted loop playsInline preload="none" poster="/assets/tech/bower-assembly-sharp.webp" aria-label="Bower One study assembling from steel feet and timber arches to its curved ribs">
        <source src="/assets/tech/bower-assembly-480.av1.webm" media="(max-width: 640px)" type='video/webm; codecs="av01.0.04M.08"' />
        <source src="/assets/tech/bower-assembly-480.mp4" media="(max-width: 640px)" type="video/mp4" />
        <source src="/assets/tech/bower-assembly-720.av1.webm" type='video/webm; codecs="av01.0.05M.08"' />
        <source src="/assets/tech/bower-assembly-720.mp4" type="video/mp4" />
      </video>}
    <figcaption>{!reduced && <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play assembly study' : 'Pause assembly study'}>{paused ? 'Play' : 'Pause'}</button>}</figcaption>
  </figure>;
}

export function TechPage() {
  usePageSnap();
  return <div className="tech-page editorial-page">
    <EditorialHeader />
    <main id="tech-main">
      <section data-snap-section className="tech-opening" aria-labelledby="tech-title">
        <div className="tech-opening-copy">
          <h1 id="tech-title">Technology at Bower</h1>
          <p className="tech-intro">Our design engine turns the form of a Bower into named timber parts, detailed joints and a model for engineering review.</p>
          <a className="tech-link" href="#engine">Explore the engine <span aria-hidden="true">↓</span></a>
        </div>
        <AssemblyFilm />
      </section>
      <div className="tech-index-wrap">
        <nav className="tech-index" aria-label="Technology chapters">{chapters.map(c => <a key={c.id} href={`#${c.id}`}>{c.kicker}</a>)}</nav>
        <p className="tech-study-note">A record of our design studies. Model dimensions and quantities refer to the revisions shown. These are not built structures or construction documents.</p>
      </div>
      {chapters.map(chapter => <section data-snap-section key={chapter.id} id={chapter.id} className={`tech-chapter tech-chapter--${chapter.id}`} aria-labelledby={`tech-${chapter.id}`}>
        <div className="tech-copy">
          <h2 id={`tech-${chapter.id}`}>{chapter.heading}</h2>
          <p>{chapter.summary}</p>
          {chapter.stats && <dl className="tech-stats">{chapter.stats.map(stat => <div key={stat.value}><dt>{stat.value}</dt><dd>{stat.label}{stat.note && <small>{stat.note}</small>}</dd></div>)}</dl>}
          {chapter.status && <p className="tech-revision">{chapter.status}</p>}
        </div>
        <div className="tech-evidence">
          {chapter.images.length > 0 && <div className={`tech-images tech-images--${chapter.id}`}>
            {chapter.images.map(img => <figure key={img.src} className={'span' in img && img.span === 'wide' ? 'tech-image-wide' : undefined}>
              <a href={img.src} target="_blank" rel="noopener" aria-label={`Open full size: ${img.alt}`}><img src={img.src} alt={img.alt} width={imageSizes[img.src]?.[0]} height={imageSizes[img.src]?.[1]} loading="lazy" decoding="async" /></a>
              <figcaption>{img.caption}</figcaption>
            </figure>)}
          </div>}
          {chapter.tables && <details className="tech-schedules" open={chapter.id === 'stock'}><summary>Load schedules</summary><div className="tech-table-grid">{chapter.tables.map(table => <div className="tech-table-wrap" key={table.caption} role="region" aria-label={table.caption} tabIndex={0}>
            <table><caption>{table.caption}</caption><thead><tr>{table.columns.map(col => <th key={col} scope="col">{col}</th>)}</tr></thead>
              <tbody>{table.rows.map((row,i) => <tr key={i}>{row.cells.map((cell,j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>)}</div></details>}
          {chapter.study && <aside className="tech-review"><h3>{chapter.study.title}</h3><ul>{chapter.study.points.map(point => <li key={point}>{point}</li>)}</ul><p className="tech-revision">{chapter.study.source}</p></aside>}
          {chapter.body.some(p => p !== chapter.summary) && <details className="tech-detail"><summary>Technical notes</summary>{chapter.body.filter(p => p !== chapter.summary).map(p => <p key={p}>{p}</p>)}</details>}
        </div>
      </section>)}

    </main>
    <Footer />
  </div>;
}
