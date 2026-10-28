import { routes } from "../routing";

export function FoundingInvitation({ showEyebrow = true, quiet = false }: { showEyebrow?: boolean; quiet?: boolean }) {
  return (
    <section data-snap-section className={`founding-invitation${quiet ? " founding-invitation--quiet" : ""}`} id="register">
      {showEyebrow && <p className="kicker">Three founding commissions</p>}
      <h2>
        {quiet ? "Begin." : "Every Bower begins with a place."}
      </h2>
      <div className="invitation-bottom">
        <p>
          {quiet ? "These are the first Bowers. Yours could be among them." : <>We are selecting three sites for the system’s founding commissions.
          Tell us about your landscape, and the life you imagine there.</>}
        </p>
        <a href={routes.contact}>Contact Bower{quiet && <span aria-hidden="true">→</span>}</a>
      </div>
      {!quiet && <p className="stage-note">
        Founded in 2026. Our computational and architectural proposition is
        developed; structural, manufacturing and delivery partnerships for the
        first permanent works are forming.
      </p>}
    </section>
  );
}
