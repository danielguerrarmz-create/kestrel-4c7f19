import { routes } from "../routing";
import "./EditorialHeader.css";

const LINKS = [
  { href: routes.gallery, label: "Gallery" },
  { href: routes.process, label: "Process" },
  { href: routes.practice, label: "Practice" },
  { href: routes.contact, label: "Contact Bower ↗" },
] as const;

/** The quiet navigation shared by every public-facing editorial page. */
export function EditorialHeader({ tone = "ink", logoSrc = "/assets/brand/bower-logo-evergreen-horizontal.png" }: { tone?: "ink" | "white"; logoSrc?: string }) {
  const colour = tone === "white" ? "text-white" : "text-[#11110e]";
  const muted = tone === "white" ? "text-white/74" : "text-black/55";
  const line =
    tone === "white" ? "hover:border-white/70" : "hover:border-black/55";

  return (
    <header
      className={`editorial-header absolute inset-x-0 top-0 z-30 ${colour}`}
    >
      <div className="editorial-header-inner">
        <a
          data-intro-logo
          href={routes.home}
          aria-label="Bower, home"
          className="editorial-header-logo focus-visible:outline-current"
        >
          <img
            src={logoSrc}
            className={tone === "white" ? "brand-on-image" : undefined}
            width="148"
            height="37"
            alt="Bower"
          />
        </a>
        <nav
          aria-label="Primary"
          className={`${muted}`}
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`border-b border-transparent pb-1 transition-colors ${line} hover:text-current focus-visible:outline-current`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
