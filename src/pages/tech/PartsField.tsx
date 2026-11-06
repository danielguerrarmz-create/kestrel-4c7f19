import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../../ui/useReducedMotion';
import parts from './parts.generated.json';
import { observeIntroduction } from './introduction';

const drawing = (id: string, thumbnail = false) => '/assets/tech/timbers-r13/' + id + (thumbnail ? '-thumb' : '') + '.webp';
const introduction = 'Each curve has its own geometry. Each timber has a name, a position and connections to its neighbours.';
const presentation = [
  { id: 'EA-01', hold: 3000, text: 'The arches carry the canopy. Each is cut to receive the ribs that meet it.' },
  { id: 'OR-01-Q1', hold: 4400, text: 'The ring gathers the ribs around the opening. Removable caps follow its curve.' },
  { id: 'CW-014', hold: 3200, text: 'Every rib follows its own curve. Its cuts are placed to meet the surrounding timbers.' },
  { id: 'CW-014', hold: 3400, text: introduction },
];
// The cue and selection changes share one clock, so the fill always leads to the next view.
const presentationSteps = presentation.map((_, index) => presentation.slice(0, index).reduce((time, part) => time + part.hold, 0));
const presentationDuration = presentation.reduce((time, part) => time + part.hold, 0);
// Keep every position reserved. New groups fill the sheet without moving earlier parts.
const arrivalGroup = (id: string) => id.startsWith('EA-') ? 0
  : id.startsWith('OR-') || id.startsWith('OC-') ? 1
  : id.startsWith('CW-') && Number(id.slice(3)) <= 16 ? 2 : 3;
const arrivals = parts.map(id => {
  const group = arrivalGroup(id);
  const members = parts.filter(part => arrivalGroup(part) === group);
  const position = members.indexOf(id) / Math.max(1, members.length - 1);
  return { group, delay: Math.round([300, 650, 1000, 2400][group] * Math.pow(position, .65)) };
});
const description = (id: string) => id.startsWith('EA-')
  ? 'Curved arch with local receivers and connections at its feet.'
  : id.startsWith('OR-') ? 'Ring sector with local scarf cuts and receivers for the ribs.'
  : id.startsWith('OC-') ? 'Removable cap following the curve of the central ring.'
  : 'An individually curved rib with local cuts for its connections.';

export function PartsField() {
  const grid = useRef<HTMLDivElement>(null);
  const layout = useRef<HTMLDivElement>(null);
  const introduced = useRef(false);
  const stopIntroduction = useRef<() => void>(() => {});
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState('EA-01');
  const [instant, setInstant] = useState(false);
  const [tour, setTour] = useState(false);
  const [beat, setBeat] = useState(0);
  const [complete, setComplete] = useState(reduced);

  useEffect(() => {
    if (!layout.current || reduced || introduced.current) { introduced.current ||= reduced; setTour(false); setComplete(true); return; }
    // Preload the three presentation images so a change never reveals an empty inspector.
    presentation.forEach(part => { const image = new Image(); image.src = drawing(part.id); });
    const intro = observeIntroduction(layout.current, {
      duration: presentationDuration, steps: presentationSteps,
      onStart: () => { introduced.current = true; setTour(true); },
      onStep: index => { setInstant(false); setBeat(index); setSelected(presentation[index].id); },
      onFinish: () => { setTour(false); setComplete(true); },
    });
    stopIntroduction.current = intro.stop;
    return intro.dispose;
  }, [reduced]);
  function takeControl() { introduced.current = true; setInstant(true); setComplete(true); stopIntroduction.current(); }
  function choose(id: string, keyboard: boolean) { setInstant(keyboard); setSelected(id); }
  function navigate(event: KeyboardEvent, index: number) {
    const columns = grid.current ? getComputedStyle(grid.current).gridTemplateColumns.split(' ').length : 4;
    const shift = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns }[event.key];
    if (shift === undefined && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault(); event.stopPropagation();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? parts.length - 1 : Math.max(0, Math.min(parts.length - 1, index + (shift ?? 0)));
    choose(parts[next], true);
    grid.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus({ preventScroll: true });
    grid.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }

  return <section data-snap-section className="tech-parts" id="parts" aria-label="Individual timber geometry"
    onPointerDownCapture={takeControl} onFocusCapture={takeControl} onKeyDownCapture={takeControl}>
    <div className="tech-parts-sheet tech-section">
      <div className="tech-parts-heading">
        {instant || reduced ? <p>{introduction}</p> : <AnimatePresence initial={false} mode="popLayout">
          <motion.p key={tour ? beat : 'introduction'}
            initial={{ opacity: 0, transform: 'translateY(4px)' }} animate={{ opacity: 1, transform: 'translateY(0)' }} exit={{ opacity: 0 }}
            transition={{ duration: .22, ease: [.23, 1, .32, 1] }}>{tour ? presentation[beat].text : introduction}</motion.p>
        </AnimatePresence>}
        {!complete && !reduced && <div className="tech-parts-progress" data-playing={tour} aria-hidden="true">
          {presentation.map((part, index) => <span key={index} data-current={index === beat} data-finished={index < beat}>
            <i style={{ animationDuration: part.hold + 'ms' }} />
          </span>)}
        </div>}
      </div>
      <div ref={layout} className="tech-parts-layout" data-intro={complete ? 'complete' : tour ? 'playing' : 'ready'}>
        <div ref={grid} className="tech-parts-grid" role="group" aria-label="Individual timber geometry from Bower One R13"
          onWheelCapture={() => { if (grid.current && grid.current.scrollHeight > grid.current.clientHeight) takeControl(); }}>
          {parts.map((id, index) => <button key={id} aria-label={'Inspect ' + id} aria-pressed={selected === id} aria-controls="part-inspector"
            className="tech-part-arrival" data-revealed={complete || arrivals[index].group <= beat}
            disabled={!complete && arrivals[index].group > beat}
            style={{ animationDelay: arrivals[index].delay + 'ms' } as CSSProperties}
            tabIndex={selected === id ? 0 : -1} onClick={event => choose(id, event.detail === 0)} onKeyDown={event => navigate(event, index)}>
            <img src={drawing(id, true)} width="400" height="167" loading="lazy" decoding="async" alt="" />
            <span>{id}</span>
          </button>)}
        </div>
        <div className="tech-part-inspector" id="part-inspector" aria-live={tour ? 'off' : 'polite'} aria-atomic="true">
          <div className="tech-part-enlargement">
            {instant || reduced ? <img src={drawing(selected)} alt={'Enlarged geometry of ' + selected} /> : <AnimatePresence initial={false} mode="popLayout">
              <motion.img key={selected} src={drawing(selected)} alt={'Enlarged geometry of ' + selected}
                initial={{ opacity: 0, transform: 'translateY(8px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} exit={{ opacity: 0 }}
                transition={{ duration: .22, ease: [.23, 1, .32, 1] }} />
            </AnimatePresence>}
          </div>
          <div className="tech-part-description"><h3>{selected}</h3><p>{description(selected)}</p></div>
        </div>
      </div>
      {complete && <motion.a className="tech-parts-next" href="#stock" aria-label="Continue to timber and material"
        initial={instant || reduced ? false : { opacity: 0, transform: 'translateY(-6px)' }}
        animate={{ opacity: 1, transform: 'translateY(0)' }} transition={{ duration: .22, ease: [.23, 1, .32, 1] }}>
        <svg viewBox="0 0 24 32" width="24" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M12 3v25M4 20l8 8 8-8" /></svg>
      </motion.a>}
    </div>
  </section>;
}
