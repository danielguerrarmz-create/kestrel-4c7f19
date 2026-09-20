import { routes } from "../routing";

export function FoundingInvitation() {
  return (
    <section className="founding-invitation" id="register">
      <p className="kicker">Three founding commissions</p>
      <h2>
        Every Bower begins
        <br />
        with <em>a place.</em>
      </h2>
      <div className="invitation-bottom">
        <p>
          We are selecting three sites for the system’s founding commissions.
          Tell us about your landscape, and the life you imagine there.
        </p>
        <a href={routes.contact}>
          Contact Bower <span>↗</span>
        </a>
      </div>
      <p className="stage-note">
        Founded in 2026. Our computational and architectural proposition is
        developed; structural, manufacturing and delivery partnerships for the
        first permanent works are forming.
      </p>
    </section>
  );
}
