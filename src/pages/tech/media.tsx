import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../ui/useReducedMotion';
import { selectedImage, selectedStudy, type SelectedStudy } from '../../data/selectedImages';
import { srcSetFor } from '../../ui/responsiveImg';

// Cover crops need enough pixels for the source's full 1.8:1 width, including the cropped area.
export function Garden({ slug, eager = false, sizes = 'max(100vw, 1350px, 153svh)' }: { slug: SelectedStudy['slug']; eager?: boolean; sizes?: string }) {
  const src = selectedImage(slug);
  return <img src={src} srcSet={srcSetFor(src)} sizes={sizes} alt={selectedStudy(slug).alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

export function Film() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    return observeAssemblyPlayback(video, reduced);
  }, [reduced]);
  return <div className="study-film">
    <div className="study-film-crop">
      <video ref={ref} muted loop playsInline preload="none" poster="/assets/tech/bower-assembly-sharp.webp"
        aria-label="Earlier Bower One digital assembly study, September 2026">
        <source src="/assets/tech/bower-assembly-480.mp4" media="(max-width: 640px)" type="video/mp4" />
        <source src="/assets/tech/bower-assembly-720.mp4" type="video/mp4" />
      </video>
    </div>
  </div>;
}

/** Viewport autoplay, explicitly requested for this explanatory film. */
export function observeAssemblyPlayback(video: HTMLVideoElement, reduced: boolean) {
  let visible = false;
  let disposed = false;
  const canPlay = () => visible && !document.hidden && !reduced && !disposed;
  const sync = () => {
    if (!canPlay()) { video.pause(); return; }
    void video.play().then(() => {
      // A pending play must not restart the film after scrolling away.
      if (!canPlay()) video.pause();
    }).catch(() => { /* The poster remains when autoplay is unavailable. */ });
  };
  video.pause();
  if (reduced) return () => video.pause();
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .35;
    sync();
  }, { threshold: .35 });
  observer.observe(video);
  document.addEventListener('visibilitychange', sync);
  return () => {
    disposed = true;
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    video.pause();
  };
}
