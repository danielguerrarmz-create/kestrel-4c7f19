import { useEffect, useRef, useState } from "react";
import { EditorialHeader } from "../ui/EditorialHeader";
import { Footer } from "../ui/Footer";
import { useReducedMotion } from "../ui/useReducedMotion";
import { useMobileLayout } from "../ui/useMobileLayout";
import { routes } from "../routing";
import { FoundingInvitation } from "../ui/FoundingInvitation";
import { BowerLoading } from "./splash/BowerLoading";
import "./bower-direction.css";
import { srcSetFor } from "../ui/responsiveImg";
import { SELECTED_STUDIES, selectedImage } from "../data/selectedImages";
import { useViewportSequence } from "../ui/useViewportPlayback";

export const studies = SELECTED_STUDIES.map(({ slug, title, alt }) => [slug, title, alt] as const);

const arrivalSlides = [
  { slug: "04-garden-exhibition", name: "Garden Exhibition", alt: SELECTED_STUDIES[3].alt, position: "50% center" },
  { slug: "19-floral-canopy", name: "Floral Canopy", alt: SELECTED_STUDIES[18].alt, position: "50% center" },
  { slug: "01-meadow-tea", name: "Meadow Tea", alt: SELECTED_STUDIES[0].alt, position: "50% center", mobilePosition: "34% center" },
];

const objectInTime = [
  {
    image: selectedImage("25-new-bower"),
    alt: "Concept visualisation at installation: a timber Bower among young trees and newly planted borders",
    caption: "At installation",
  },
  {
    image: selectedImage("26-growing-bower"),
    alt: "Concept visualisation after 20 years: trees and borders have grown around a Bower with roses and wisteria",
    caption: "After 20 years",
  },
  {
    image: selectedImage("27-mature-bower"),
    alt: "Concept visualisation after 60 years: mature trees and layered planting surround a weathered Bower with roses and wisteria",
    caption: "After 60 years",
  },
] as const;

function ArrivalImages() {
  const reduced = useReducedMotion();
  const mobile = useMobileLayout();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState<number[]>([0]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (mobile) setActive(0); }, [mobile]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reduced || mobile || !visible) return;
    const timer = window.setTimeout(() => {
      const next = (active + 1) % arrivalSlides.length;
      if (ready.includes(next)) setActive(next);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [reduced, mobile, visible, active, ready]);
  return <>
    <div ref={ref} className="arrival-slides">
      {arrivalSlides.map((slide, index) => <img key={slide.slug}
        className={`arrival-image arrival-slide ${index === active ? "is-current" : ""}`}
        src={selectedImage(slide.slug)} srcSet={srcSetFor(selectedImage(slide.slug))}
        sizes="(max-width: 767px) 120svh, 100vw" alt={slide.alt} aria-hidden={index !== active}
        style={{ objectPosition: mobile && 'mobilePosition' in slide ? slide.mobilePosition : slide.position }} loading={index === 0 ? "eager" : "lazy"}
        onLoad={() => setReady(current => current.includes(index) ? current : [...current, index])} />)}
    </div>
    <div className="arrival-shade" aria-hidden="true" />
    <div className="arrival-caption">
      <h1>Living architecture.</h1>
      <div className="arrival-gallery-controls">
        <a className="overture-enter" href={routes.gallery}>View the gallery</a>
        <div className="arrival-dots" role="group" aria-label="Choose a garden image">
          {arrivalSlides.map((slide, index) => <button key={slide.slug} type="button"
            aria-label={`Show ${slide.name}`} aria-pressed={active === index}
            onClick={() => setActive(index)}><span aria-hidden="true" /></button>)}
        </div>
      </div>
    </div>
  </>;
}
export function SplashPage() {
  const seasonal = useViewportSequence<HTMLElement>();
  useEffect(() => {
    const panorama = seasonal.ref.current;
    if (!panorama || !window.matchMedia("(max-width: 767px)").matches) return;
    const centrePanorama = () => {
      panorama.scrollLeft = (panorama.scrollWidth - panorama.clientWidth) / 2;
    };
    const frame = window.requestAnimationFrame(centrePanorama);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(centrePanorama);
    observer?.observe(panorama);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [seasonal.ref]);
  return <div className="bower-site bower-v2">
    <BowerLoading />
    <EditorialHeader tone="white" />
    <main>
      <section data-snap-spread className="overture overture--arrival arrival-quiet viewport-spread" aria-label="A Bower in the garden"><ArrivalImages /></section>
      <section className="inhabit" aria-labelledby="object-in-time-title">
        <div id="object-in-time" className="object-in-time" aria-labelledby="object-in-time-title">
          <div className="object-in-time-heading">
            <h2 id="object-in-time-title">A Bower begins when building ends.</h2>
          </div>
          <div className="object-in-time-sequence">
            {objectInTime.map((study) => <figure key={study.image}>
              <div className="object-in-time-image">
                <img src={study.image} srcSet={srcSetFor(study.image)} sizes="(max-width: 767px) 82vw, 33vw" alt={study.alt} loading="lazy" />
              </div>
              <figcaption>{study.caption}</figcaption>
            </figure>)}
          </div>
        </div>
        <div id="inhabit-copy" className="inhabit-copy"><p>A long lunch.<br />An hour alone.<br />A reason to stay outside.</p><div><p>A Bower makes room for the intimate, inhabited life of a landscape. Somewhere between the individual and the group, ordinary experience and ceremony.</p></div></div>
        <figure ref={seasonal.ref} id="seasonal-family-scene" data-snap-spread tabIndex={0} aria-label="Seasonal Bower panorama. Swipe horizontally to explore." className={`wide-scene seasonal-morph viewport-spread${seasonal.active ? " is-active" : ""}`}>
          <div className="seasonal-morph-track">
            <img className="seasonal-morph-summer" src={selectedImage("09-summer-family")} srcSet={srcSetFor(selectedImage("09-summer-family"))} sizes="(max-width: 767px) 182vh, 100vw" alt={SELECTED_STUDIES[8].alt} loading="lazy" />
            <img className="seasonal-morph-winter" src={selectedImage("08-winter-family")} srcSet={srcSetFor(selectedImage("08-winter-family"))} sizes="(max-width: 767px) 182vh, 100vw" alt="" aria-hidden="true" loading="lazy" />
          </div>
        </figure>
      </section>
      <section className="bower-belief" id="how-it-works"><h2>Nature becomes one of the authors.</h2><div>
        <p>We do not use nature to make architecture look organic; we build architecture that gives living systems agency in determining what it becomes.</p>
        <p>Founded in 2026, Bower is a building technology company creating timber structures that grow into their landscapes; partnerships for the first permanent works are forming.</p>
      </div></section>
      <section id="life-around" className="making-door"><figure><img src={selectedImage("10-estate-aerial")} srcSet={srcSetFor(selectedImage("10-estate-aerial"))} sizes="(max-width: 767px) 100vw, 58vw" alt={SELECTED_STUDIES[9].alt} loading="lazy" /></figure><div><h2>A room for the life around it.</h2><p>For celebrations of love, performances that linger after the final note and ideas passed from one generation to the next. A Bower gives the garden a centre, then lets life and landscape make it their own.</p><a className="text-link" href={routes.gallery}>View the gallery</a></div></section>
      <figure id="knoll-study" data-snap-spread className="knoll-study viewport-spread">
        <img src="/assets/gallery/week-3/valley-bower-at-dawn.webp" srcSet="/assets/gallery/week-3/valley-bower-at-dawn-400w.webp 400w, /assets/gallery/week-3/valley-bower-at-dawn-800w.webp 800w, /assets/gallery/week-3/valley-bower-at-dawn-1280w.webp 1280w, /assets/gallery/week-3/valley-bower-at-dawn-1920w.webp 1920w, /assets/gallery/week-3/valley-bower-at-dawn.webp 2560w" sizes="100vw" alt="Concept visualisation of a timber Bower on a green knoll above a river valley" loading="lazy" />
      </figure>
      <FoundingInvitation showEyebrow={false} quiet />
      <Footer />
    </main>
  </div>;
}
