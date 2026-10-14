import { routes, useRoute } from "../routing";
import "./EditorialHeader.css";

const LINKS = [
  { href: routes.gallery, label: "Works", mobileLabel: "Works" },
  { href: routes.process, label: "Process", mobileLabel: "Process" },
  { href: routes.practice, label: "Practice", mobileLabel: "Practice" },
  { href: routes.contact, label: "Contact", mobileLabel: "Contact" },
] as const;

/** The quiet navigation shared by every public-facing editorial page. */
export function EditorialHeader({ tone = "ink", logoSrc }: { tone?: "ink" | "white"; logoSrc?: string }) {
  const currentRoute = useRoute();
  const imageSrc = logoSrc ?? "/assets/brand/bower-logo-evergreen-horizontal-transparent.png";
  const colour = tone === "white" ? "text-white" : "text-[#11110e]";
  const muted = tone === "white" ? "text-white/74" : "text-black/55";

  return (
    <header
      className={`editorial-header absolute inset-x-0 top-0 z-30 ${colour}`}
    >
      <div className="editorial-header-inner">
        <a
          data-intro-logo
          href={routes.home}
          aria-label="Bower, home"
          className={`editorial-header-logo editorial-header-logo--${tone} focus-visible:outline-current`}
        >
          <img
            src={imageSrc}
            className={tone === "white" ? "brand-on-image" : undefined}
            width="148"
            height="37"
            alt="Bower"
          />
        </a>
        <nav
          aria-label="Primary"
          className={`editorial-desktop-nav ${muted}`}
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={currentRoute === link.href ? "page" : undefined}
              className="editorial-nav-link focus-visible:outline-current"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <details className="editorial-mobile-nav" data-agent-hidden="true">
          <summary aria-label="Toggle menu">
            <span className="menu-open-label">Menu</span><span className="menu-close-label">Close</span>
            <span className="menu-bars" aria-hidden="true"><span /><span /><span /></span>
          </summary>
          <nav aria-label="Mobile primary">
            {LINKS.map((link) => <a key={link.href} href={link.href} aria-current={currentRoute === link.href ? "page" : undefined}>{link.mobileLabel}</a>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
