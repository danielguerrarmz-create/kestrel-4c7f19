import { useEffect, useRef, useState } from "react";
import { EditorialHeader } from "../ui/EditorialHeader";
import { Footer } from "../ui/Footer";
import { useReducedMotion } from "../ui/useReducedMotion";
import { routes } from "../routing";
import { FoundingInvitation } from "../ui/FoundingInvitation";
import { BowerLoading } from "./splash/BowerLoading";
import "./bower-direction.css";
import { srcSetFor } from "../ui/responsiveImg";

export const studies = [
  [
    "wisteria-walk",
    "Lights of leaves",
    "To sit beneath the leaves. To watch the light move.",
  ],
  [
    "summer-borders",
    "A room in the garden",
    "An open edge between shelter and the summer border.",
  ],
  [
    "stained-glass-cliff",
    "A little ceremony",
    "Colour, timber and planting gather around a view.",
  ],
  [
    "valley-dawn",
    "Before the day begins",
    "A place to pause at the threshold of a landscape.",
  ],
  [
    "oculus-portrait",
    "Open to the sky",
    "Weather and changing light are part of the room.",
  ],
  [
    "garden-room-gathering",
    "Room for one. Room for many.",
    "An intimate shelter becomes a place to come together.",
  ],
  [
    "living-interior",
    "Between inside and outside",
    "The garden reaches into the timber frame.",
  ],
  [
    "winter-canopy",
    "When the garden is quiet",
    "A different presence in the winter landscape.",
  ],
  [
    "pondside-pavilion",
    "At the water’s edge",
    "Somewhere to linger on the way around the garden.",
  ],
  [
    "garden-performance",
    "An occasion, outdoors",
    "Gathering, listening and performing in the landscape.",
  ],
  [
    "stained-glass-garden-canopy",
    "A change in the light",
    "A study in colour, shelter and an open edge.",
  ],
  [
    "sunset-flower-garden",
    "Stay a little longer",
    "An evening destination at the end of the garden.",
  ],
] as const;
const studySrc = (slug: string) => `/assets/studies/${slug}.webp`;

const arrivalSlides = [
  { slug: "pondside-pavilion", name: "Pondside Pavilion", alt: "Design study of a planted timber pavilion beside a garden pond", position: "60% center" },
  { slug: "summer-borders", name: "Summer Borders", alt: "Design study of a flowering timber Bower with open arches in a garden", position: "58% center" },
  { slug: "wisteria-walk", name: "Wisteria Walk", alt: "Design study looking through timber arches beneath flowering wisteria", position: "52% center" },
];
function ArrivalImages() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState<number[]>([0]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reduced || !visible) return;
    const timer = window.setTimeout(() => {
      const next = (active + 1) % arrivalSlides.length;
      if (ready.includes(next)) setActive(next);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [reduced, visible, active, ready]);
  return <>
    <div ref={ref} className="arrival-slides">
      {arrivalSlides.map((slide, index) => <img key={slide.slug}
        className={`arrival-image arrival-slide ${index === active ? "is-current" : ""}`}
        src={studySrc(slide.slug)} srcSet={srcSetFor(studySrc(slide.slug))}
        sizes="(max-width: 767px) 120svh, 100vw" alt={slide.alt} aria-hidden={index !== active}
        style={{ objectPosition: slide.position }} loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "low"}
        onLoad={() => setReady(current => current.includes(index) ? current : [...current, index])} />)}
    </div>
    <div className="arrival-shade" aria-hidden="true" />
    <div className="arrival-caption">
      <h1>Living architecture.</h1>
      <div className="arrival-gallery-controls">
        <a className="overture-enter" href={routes.gallery}>View the gallery <span aria-hidden="true">&#8599;</span></a>
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
  return <div className="bower-site bower-v2">
    <BowerLoading />
    <EditorialHeader tone="white" />
    <main>
      <section className="overture overture--arrival arrival-quiet" aria-label="A Bower in the garden"><ArrivalImages /></section>
      <section className="inhabit" aria-labelledby="inhabit-title">
        <div className="inhabit-title"><h2 id="inhabit-title">Somewhere to be.</h2><p className="inhabit-introduction">A living timber pavilion, shaped for your garden. Shelter for gathering, with the landscape always close.</p></div>
        <figure className="wide-scene"><img src={studySrc("garden-room-gathering")} srcSet={srcSetFor(studySrc("garden-room-gathering"))} sizes="(max-width: 767px) 100vw, 80vw" alt="Design study of people gathered beneath an open timber pavilion" loading="lazy" /><figcaption>Gathering beneath a Bower / design study</figcaption></figure>
        <div className="inhabit-copy"><p>A long lunch.<br />An hour alone.<br />A reason to stay outside.</p><div><p>A Bower makes room for the intimate, inhabited life of a landscape. Somewhere between the individual and the group, ordinary experience and ceremony.</p><a className="text-link" href={routes.contact}>A place in mind? Contact Bower &#8599;</a></div></div>
      </section>
      <div className="growth-threshold"><p>A place to gather.</p><span aria-hidden="true" /><p>A place that grows.</p></div>
      <section className="becoming" aria-labelledby="becoming-title">
        <div className="becoming-heading"><h2 id="becoming-title">The garden makes it more.</h2><p>Plants find a way through.<br />Light changes. Habitats form.<br />The room keeps becoming.</p></div>
        <div className="season-view"><img src={studySrc("growth-03-mature")} srcSet={srcSetFor(studySrc("growth-03-mature"))} sizes="(max-width: 767px) 100vw, 90vw" alt="Illustrative study of a mature Bower with planting growing through its timber frame" loading="lazy" /></div>
      </section>
      <section className="bower-belief" id="how-it-works"><h2>Nature becomes one of the authors.</h2><div>
        <p>We do not use nature to make architecture look organic; we build architecture that gives living systems agency in determining what it becomes.</p>
        <p>Founded in 2026, Bower is a building technology company with a developed computational design system for unique timber buildings that grow into their landscapes. Engineering, manufacturing and delivery partnerships for the first permanent works are forming.</p>
      </div></section>
      <section className="making-door"><figure><img src={studySrc("rib-to-arch-joint")} srcSet={srcSetFor(studySrc("rib-to-arch-joint"))} sizes="(max-width: 767px) 100vw, 80vw" alt="Illustrative timber connection study with a round peg" loading="lazy" /><figcaption>Connection image study / not an issued fabrication detail</figcaption></figure><div><h2>From possibility to the part.</h2><p>Geometry, timber, connections and robotic making. See the system we are developing to bring a Bower into the world.</p><a className="text-link" href={routes.process}>See how it is made &#8599;</a></div></section>
      <FoundingInvitation showEyebrow={false} quiet />
      <Footer />
    </main>
  </div>;
}
