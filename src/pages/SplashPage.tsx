import { useEffect, useRef, useState, type CSSProperties } from "react";
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
const burst = [3, 2, 5, 0];
const places = [
  [19, 25, 62],
  [2, 4, 27],
  [73, 0, 25],
  [1, 70, 28],
  [81, 46, 15],
  [64, 77, 33],
];
const seasons = [
  [
    "growth-01-installation",
    "The open frame",
    "Timber, light, and room for what comes next.",
  ],
  [
    "growth-02-establishing",
    "Finding its way",
    "Climbers begin to change the edges of the room.",
  ],
  [
    "growth-03-mature",
    "A living enclosure",
    "Shade deepens. The garden becomes one of its authors.",
  ],
];

export function SplashPage() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"arrival" | "dark" | "pop" | "gallery">(
    "arrival",
  );
  const [frame, setFrame] = useState(0);
  const [introReplay, setIntroReplay] = useState(0);
  const [grid, setGrid] = useState(false);
  const [selected, setSelected] = useState(0);
  const [season, setSeason] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const galleryHeading = useRef<HTMLHeadingElement>(null);
  const enter = () => {
    setFrame(0);
    setPhase(reduced ? "gallery" : "dark");
  };

  useEffect(() => {
    if (phase === "arrival" || phase === "gallery") return;
    if (reduced) {
      setPhase("gallery");
      return;
    }
    const timer = window.setTimeout(
      () => {
        if (phase === "dark") setPhase("pop");
        else if (frame < burst.length - 1) setFrame(frame + 1);
        else setPhase("gallery");
      },
      phase === "dark" ? 550 : 550,
    );
    return () => window.clearTimeout(timer);
  }, [phase, frame, reduced]);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (phase !== "gallery") document.body.style.overflow = "hidden";
    else galleryHeading.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);
  const show = (index: number) => {
    setSelected(index);
    dialog.current?.showModal();
  };

  return (
    <div className={`bower-site bower-v2 phase-${phase}`}>
      <BowerLoading replay={introReplay} />
      <EditorialHeader
        tone={phase === "dark" || phase === "pop" ? "white" : "ink"}
      />
      {phase !== "gallery" ? (
        <main className={`overture overture--${phase}`}>
          {phase === "arrival" && (
            <>
              <div className="overture-top">
                <span>A building that grows.</span>
                <span>For life in the landscape.</span>
              </div>
              <h1 className="overture-poem">
                We dream of a world
                <br />
                of <em>lights of leaves…</em>
                <br />
                of buildings like <em>waves and caves.</em>
                <span>A world full of</span>
                <strong>Bowers.</strong>
              </h1>
              <button
                className="overture-enter"
                onClick={enter}
                aria-label="Enter the world of Bower"
              >
                Enter the world <span>↗</span>
              </button>
            </>
          )}
          {phase === "pop" && (
            <div
              className={`overture-flash overture-flash--${frame}`}
              key={frame}
            >
              <img
                src={studySrc(studies[burst[frame]][0])}
                srcSet={srcSetFor(studySrc(studies[burst[frame]][0]))}
                sizes="(max-width: 767px) 100vw, 80vw"
                alt="Bower pavilion design study"
              />
              <span>
                {String(frame + 1).padStart(2, "0")} / A world of possibilities
              </span>
            </div>
          )}
          <div className="overture-bottom">
            <span>
              {phase === "arrival"
                ? "Bower / Living architecture"
                : "Design studies · Not completed buildings"}
            </span>
            <button onClick={() => setPhase("gallery")}>
              Skip to gallery ↗
            </button>
          </div>
          <div className="preload" aria-hidden="true">
            {burst.map((i) => (
              <img key={i} src={studySrc(studies[i][0])} alt="" />
            ))}
          </div>
        </main>
      ) : null}
      <main hidden={phase !== "gallery"}>
        <section className="atlas" aria-labelledby="gallery-title">
          <div className="atlas-top">
            <span>01 / An inhabited landscape</span>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                setPhase("arrival");
                setIntroReplay((n) => n + 1);
              }}
            >
              Replay the opening ↗
            </button>
          </div>
          <h1 ref={galleryHeading} tabIndex={-1} id="gallery-title">
            A world full of <em>Bowers.</em>
          </h1>
          <div className="atlas-intro">
            <p>
              Places to gather.
              <br />
              Places to simply be.
            </p>
            <p>
              Site-specific living pavilions for exceptional gardens.
              <br />
              Design studies, not photographs of completed buildings.
            </p>
          </div>
          <div className={grid ? "atlas-grid" : "atlas-field"}>
            {(grid ? studies : studies.slice(0, 6)).map(([slug, title], i) => (
              <button
                key={slug}
                className={`atlas-image atlas-image--${i}`}
                style={
                  {
                    "--left": `${places[i % 6][0]}%`,
                    "--top": `${places[i % 6][1]}%`,
                    "--width": `${places[i % 6][2]}%`,
                    "--delay": `${i * 70}ms`,
                    "--dx": `${(50 - places[i % 6][0]) * 0.8}vw`,
                    "--dy": `${(45 - places[i % 6][1]) * 0.5}vw`,
                  } as CSSProperties
                }
                onClick={() => show(i)}
                aria-label={`Explore ${title}`}
              >
                <img
                  src={studySrc(slug)}
                  srcSet={srcSetFor(studySrc(slug))}
                  sizes="(max-width: 767px) 100vw, 80vw"
                  alt={`${title}, Bower design study`}
                  loading={i < 6 ? "eager" : "lazy"}
                />
                <span>
                  <span>
                    {String(i + 1).padStart(2, "0")} / {title}
                  </span>
                  <span>Open ↗</span>
                </span>
              </button>
            ))}
          </div>
          <div className="atlas-bottom">
            <span>Select a scene. Imagine being there.</span>
            <button aria-pressed={grid} onClick={() => setGrid(!grid)}>
              {grid ? "Return to free gallery" : "View all 12 studies"}{" "}
              <span>↗</span>
            </button>
          </div>
        </section>

        <section className="inhabit" aria-labelledby="inhabit-title">
          <div className="inhabit-title">
            <p className="kicker">
              02 / Ordinary life. Extraordinary presence.
            </p>
            <h2 id="inhabit-title">
              Somewhere
              <br />
              <em>to be.</em>
            </h2>
          </div>
          <figure className="wide-scene">
            <img
              src={studySrc("garden-room-gathering")}
              srcSet={srcSetFor(studySrc("garden-room-gathering"))}
              sizes="(max-width: 767px) 100vw, 80vw"
              alt="Design study of people gathered beneath an open timber pavilion"
              loading="lazy"
            />
            <figcaption>Gathering beneath a Bower / design study</figcaption>
          </figure>
          <div className="inhabit-copy">
            <p>
              A long lunch.
              <br />
              An hour alone.
              <br />A reason to stay outside.
            </p>
            <div>
              <p>
                A Bower makes room for the intimate, inhabited life of a
                landscape. Somewhere between the individual and the group,
                ordinary experience and ceremony.
              </p>
              <a className="text-link" href={routes.contact}>
                A place in mind? Contact Bower ↗
              </a>
            </div>
          </div>
        </section>

        <section className="becoming" aria-labelledby="becoming-title">
          <div className="becoming-heading">
            <p className="kicker">03 / Time is part of the design</p>
            <h2 id="becoming-title">
              The garden
              <br />
              <em>makes it more.</em>
            </h2>
            <p>
              Plants find a way through.
              <br />
              Light changes. Habitats form.
              <br />
              The room keeps becoming.
            </p>
          </div>
          <div className="season-view">
            <img
              src={studySrc(seasons[season][0])}
              srcSet={srcSetFor(studySrc(seasons[season][0]))}
              sizes="(max-width: 767px) 100vw, 80vw"
              alt={`${seasons[season][1]}, illustrative Bower growth study`}
              loading="lazy"
            />
            <div
              className="season-controls"
              aria-label="Explore growth studies"
            >
              {seasons.map((s, i) => (
                <button
                  key={s[0]}
                  aria-pressed={season === i}
                  onClick={() => setSeason(i)}
                >
                  <span>0{i + 1}</span> {s[1]}
                </button>
              ))}
            </div>
            <p className="season-caption" aria-live="polite">
              {seasons[season][2]}
            </p>
            <p className="study-disclaimer">
              Illustrative growth studies. Planting, timing and coverage depend
              on species, site and care.
            </p>
          </div>
        </section>

        <section className="bower-belief" id="how-it-works">
          <p className="kicker">
            The natural, made possible through the digital.
          </p>
          <h2>
            Nature becomes
            <br />
            <em>one of the authors.</em>
          </h2>
          <div>
            <p>
              We do not use nature to make architecture look organic; we build
              architecture that gives living systems agency in determining what
              it becomes.
            </p>
            <p>
              Bower is a building technology company developing a repeatable
              system for geometrically unique timber buildings that grow into
              their landscapes.
            </p>
          </div>
        </section>
        <section className="making-door">
          <figure>
            <img
              src={studySrc("rib-to-arch-joint")}
              srcSet={srcSetFor(studySrc("rib-to-arch-joint"))}
              sizes="(max-width: 767px) 100vw, 80vw"
              alt="Illustrative timber connection study with a round peg"
              loading="lazy"
            />
            <figcaption>
              Connection image study / not an issued fabrication detail
            </figcaption>
          </figure>
          <div>
            <p className="kicker">04 / Behind the living building</p>
            <h2>
              From possibility
              <br />
              <em>to the part.</em>
            </h2>
            <p>
              Geometry, timber, connections and robotic making. See the system
              we are developing to bring a Bower into the world.
            </p>
            <a className="text-link" href={routes.process}>
              See how it is made ↗
            </a>
          </div>
        </section>
        <FoundingInvitation />
        <Footer />
      </main>

      <dialog
        ref={dialog}
        className="scene-dialog"
        aria-labelledby="study-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight")
            setSelected((selected + 1) % studies.length);
          if (e.key === "ArrowLeft")
            setSelected((selected + studies.length - 1) % studies.length);
        }}
      >
        <div className="scene-dialog-top">
          <span>
            Bower / Design study {String(selected + 1).padStart(2, "0")}
          </span>
          <button onClick={() => dialog.current?.close()} autoFocus>
            Close ×
          </button>
        </div>
        <img
          src={studySrc(studies[selected][0])}
          srcSet={srcSetFor(studySrc(studies[selected][0]))}
          sizes="(max-width: 767px) 100vw, 80vw"
          alt={studies[selected][2]}
        />
        <div className="scene-dialog-copy">
          <div>
            <h2 id="study-title">{studies[selected][1]}</h2>
            <p>{studies[selected][2]}</p>
          </div>
          <a href={routes.contact}>Imagine a Bower on your land ↗</a>
        </div>
        <div className="scene-dialog-nav">
          <button
            onClick={() =>
              setSelected((selected + studies.length - 1) % studies.length)
            }
          >
            ← Previous
          </button>
          <span>Design study, not a completed building.</span>
          <button onClick={() => setSelected((selected + 1) % studies.length)}>
            Next →
          </button>
        </div>
      </dialog>
    </div>
  );
}
