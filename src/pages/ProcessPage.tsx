import { EditorialHeader } from "../ui/EditorialHeader";
import { Footer } from "../ui/Footer";
import { FoundingInvitation } from "../ui/FoundingInvitation";
import { ProcessSpecimen } from "./ProcessSpecimen";
import { srcSetFor } from "../ui/responsiveImg";
import "./bower-direction.css";

const study = (name: string) => `/assets/studies/${name}.webp`;
const robotics = "/assets/projects/06-kuka-robotics/kuka-robotics";
export const PROCESS_STEPS = [
  {
    title: "Read the landscape",
    body: "Begin with people, light, terrain and the life already there. Establish the purpose of the Bower and the permissions the site needs.",
  },
  {
    title: "Develop the system",
    body: "Bring geometry, structural design, timber and planting into conversation. Resolve the proposal with specialist partners before committing to manufacture.",
  },
  {
    title: "Prove the making",
    body: "Test connections, material behaviour and machine operations. Prototype, measure and refine before producing a building’s components.",
  },
  {
    title: "Assemble and establish",
    body: "Plan transport, access, foundations and assembly together. Planting and long-term care are part of the commission from the beginning.",
  },
];

export function ProcessPage() {
  return (
    <div className="bower-v2">
      <EditorialHeader />
      <main>
        <section className="process-opening">
          <div>
            <p className="kicker">
              Process / Craft · Computation · Living systems
            </p>
            <h1>
              The natural.
              <br />
              Made through
              <br />
              <em>the digital.</em>
            </h1>
            <p>
              A unique building should not require us to invent how to build it
              from the beginning, every time.
            </p>
          </div>
          <ProcessSpecimen />
        </section>
        <section className="process-principle">
          <p className="kicker">
            A repeatable system.
            <br />
            An unrepeatable place.
          </p>
          <p>
            We are developing the connection between a landscape, a geometric
            idea and the individual pieces of timber that make it real.
          </p>
        </section>
        <section className="making-chapter">
          <div className="chapter-heading">
            <p className="kicker">01 / Computation</p>
            <div>
              <h2>
                Think in systems.
                <br />
                <em>Make for a place.</em>
              </h2>
              <p>
                Computation lets us work with complex relationships: how a form
                opens to a view, how its parts meet, where light enters and
                where planting might take hold.
              </p>
            </div>
          </div>
          <div className="process-pair">
            <figure>
              <img
                src={study("growth-01-installation")}
                srcSet={srcSetFor(study("growth-01-installation"))}
                sizes="(max-width:767px) 90vw,45vw"
                alt="Design study of a bare timber Bower in a garden"
                loading="lazy"
              />
              <figcaption>
                Timber frame / design study, not a completed building
              </figcaption>
            </figure>
            <div>
              <h3>From the whole to the part.</h3>
              <p>
                The proposition is a family of buildings with shared rules,
                rather than identical forms. Geometry must become identifiable
                components, workable connections and a sequence of making. The
                computational prototype above exposes that relationship;
                engineering and fabrication validation remain ahead.
              </p>
            </div>
          </div>
        </section>
        <section className="making-chapter robotic-chapter">
          <div className="chapter-heading">
            <p className="kicker">02 / Robotic fabrication</p>
            <div>
              <h2>
                A different way
                <br />
                <em>to make difference.</em>
              </h2>
              <p>
                Robotic fabrication is central to the system we are developing.
                The ambition is to translate geometric variation into controlled
                machine operations, so complexity can be handled through a
                repeatable process.
              </p>
            </div>
          </div>
          <figure>
            <video
              controls
              playsInline
              preload="none"
              poster={`${robotics}-robot-loop-poster.webp`}
              aria-label="Prior KUKA robotics research footage"
            >
              <source src={`${robotics}-robot-loop.webm`} type="video/webm" />
              <source src={`${robotics}-robot-loop.mp4`} type="video/mp4" />
              Your browser does not support this video.
            </video>
            <figcaption>
              Prior robotics research / accelerated silent footage. This is not
              a Bower production line.
            </figcaption>
          </figure>
          <div className="robotic-notes">
            <div>
              <h3>Geometry → instructions</h3>
              <p>
                Define each component and translate its geometry into proposed
                cutting and machining operations.
              </p>
            </div>
            <div>
              <h3>Instructions → trials</h3>
              <p>
                Check tool access, fixturing, tolerances and timber behaviour
                through physical trials with manufacturing partners.
              </p>
            </div>
            <div>
              <h3>Trials → repeatability</h3>
              <p>
                Use what is measured to refine the system. Precision, waste and
                production time must be demonstrated, not assumed.
              </p>
            </div>
          </div>
        </section>
        <section className="making-chapter">
          <div className="chapter-heading">
            <p className="kicker">03 / Craft and connection</p>
            <div>
              <h2>
                The intelligence
                <br />
                <em>is in the meeting.</em>
              </h2>
              <p>
                A beautiful form is only the beginning. The connection brings
                material, force, making and assembly into one small place.
              </p>
            </div>
          </div>
          <div className="process-pair">
            <figure>
              <img
                src={study("rib-to-arch-joint")}
                srcSet={srcSetFor(study("rib-to-arch-joint"))}
                sizes="(max-width:767px) 90vw,45vw"
                alt="Illustrative timber connection study with a round peg"
                loading="lazy"
              />
              <figcaption>
                Connection image study / not an issued fabrication detail
              </figcaption>
            </figure>
            <div>
              <h3>
                Digital precision.
                <br />
                Material judgement.
              </h3>
              <p>
                Robots do not remove the need for craft. Grain, moisture,
                finish, weathering and the fit of a joint still demand
                judgement. Structural review, connection testing and fabrication
                trials will shape the details of the first permanent works.
              </p>
            </div>
          </div>
        </section>
        <section className="making-steps">
          <p className="kicker">From a first conversation to a living place</p>
          <h2>
            How a commission
            <br />
            <em>takes shape.</em>
          </h2>
          <ol>
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.title}>
                <span>0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>
        <figure className="wide-scene">
          <img
            src={study("growth-03-mature")}
            srcSet={srcSetFor(study("growth-03-mature"))}
            sizes="100vw"
            alt="Illustrative study of planting growing through a mature Bower"
            loading="lazy"
          />
          <figcaption>
            The garden continues the architecture / illustrative growth study.
            Planting, timing and coverage depend on species, site and care.
          </figcaption>
        </figure>
        <FoundingInvitation />
      </main>
      <Footer />
    </div>
  );
}
