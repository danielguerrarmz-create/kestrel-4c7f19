import { useEffect, useRef, useState } from 'react';

type Image = { src: string; alt: string; title: string; n: string };

/** A modal image canvas: gestures are captured here only, never on the page. */
export function ImageViewer({ images, initial, onClose }: { images: readonly Image[]; initial: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(initial);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ x: 0, y: 0, distance: 0, scale: 1, panX: 0, panY: 0 });
  const lastTap = useRef(0);
  const image = images[index];
  const reset = () => setView({ scale: 1, x: 0, y: 0 });
  const move = (delta: number) => { setIndex(i => (i + delta + images.length) % images.length); reset(); };
  const zoom = (scale: number, x = view.x, y = view.y) => {
    const s = Math.max(1, Math.min(4, scale));
    const rect = canvas.current?.getBoundingClientRect();
    const img = canvas.current?.querySelector('img');
    const width = rect?.width ?? 0;
    const height = rect?.height ?? 0;
    const fit = img?.naturalWidth ? Math.min(width / img.naturalWidth, height / img.naturalHeight) : 1;
    const boundX = Math.max(0, ((img?.naturalWidth ?? width) * fit * s - width) / 2);
    const boundY = Math.max(0, ((img?.naturalHeight ?? height) * fit * s - height) / 2);
    setView({ scale: s, x: Math.max(-boundX, Math.min(boundX, x)), y: Math.max(-boundY, Math.min(boundY, y)) });
  };
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const modal = dialog.current;
    modal?.showModal();
    return () => { modal?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  return (
    <dialog ref={dialog} className="image-viewer" aria-label="Image viewer" onCancel={onClose} onKeyDown={e => {
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    }}>
      <div className="viewer-toolbar">
        <span aria-live="polite">{image.n} / {String(images.length).padStart(2, '0')}</span>
        <button onClick={onClose} aria-label="Close image viewer">Close ×</button>
      </div>
      <div ref={canvas} className="viewer-canvas"
        onPointerDown={e => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          const pts = [...pointers.current.values()];
          gesture.current = { x: e.clientX, y: e.clientY, distance: pts.length === 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0, scale: view.scale, panX: view.x, panY: view.y };
        }}
        onPointerMove={e => {
          if (!pointers.current.has(e.pointerId)) return;
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          const pts = [...pointers.current.values()];
          const g = gesture.current;
          if (pts.length === 2 && g.distance) zoom(g.scale * Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) / g.distance);
          else if (pts.length === 1 && view.scale > 1) zoom(view.scale, g.panX + e.clientX - g.x, g.panY + e.clientY - g.y);
        }}
        onPointerUp={e => {
          const g = gesture.current;
          const dx = e.clientX - g.x;
          const dy = e.clientY - g.y;
          if (pointers.current.size === 1 && !g.distance) {
            if (view.scale === 1 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
            else if (Math.hypot(dx, dy) < 10) {
              const now = Date.now();
              if (now - lastTap.current < 300) { zoom(view.scale > 1 ? 1 : 2.5); lastTap.current = 0; }
              else lastTap.current = now;
            }
          }
          pointers.current.delete(e.pointerId);
          // A remaining finger starts a fresh pan after a pinch, without becoming a swipe.
          const remaining = [...pointers.current.values()][0];
          if (remaining) gesture.current = { x: remaining.x, y: remaining.y, distance: 1, scale: view.scale, panX: view.x, panY: view.y };
        }}
        onPointerCancel={() => pointers.current.clear()}>
        <img src={image.src} alt={image.alt} draggable={false} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }} />
      </div>
      <div className="viewer-details">
        <p aria-live="polite">{image.title}</p>
        <div className="viewer-controls">
          <button onClick={() => move(-1)} aria-label="Previous image">←</button>
          <button onClick={() => zoom(view.scale - .5)} aria-label="Zoom out" disabled={view.scale === 1}>−</button>
          <button onClick={reset} aria-label="Reset zoom">{Math.round(view.scale * 100)}%</button>
          <button onClick={() => zoom(view.scale + .5)} aria-label="Zoom in" disabled={view.scale === 4}>+</button>
          <button onClick={() => move(1)} aria-label="Next image">→</button>
        </div>
        <p className="viewer-hint">Pinch or double-tap to zoom · Swipe to browse</p>
      </div>
    </dialog>
  );
}
