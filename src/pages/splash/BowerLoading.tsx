import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../ui/useReducedMotion";

/** Motion study interpretation: emblem unfurls, settles beside the intact wordmark.
 * No fake progress meter; the short overture can always be skipped. */
export function BowerLoading({ replay = 0 }: { replay?: number }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const movingLogo = useRef<SVGSVGElement>(null);
  const motion = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const finish = () => {
    setActive(false);
    try {
      sessionStorage.setItem("bower.brand-intro.v3", "seen");
    } catch {
      /* optional storage */
    }
  };
  useEffect(() => {
    if (reduced) return;
    try {
      if (!replay && sessionStorage.getItem("bower.brand-intro.v3")) return;
    } catch {
      /* private browsing */
    }
    setActive(true);
    return undefined;
  }, [reduced, replay]);
  useEffect(() => {
    if (!active || reduced) return;
    dialog.current?.showModal();
    let completion: number | undefined;
    const timer = window.setTimeout(() => {
      const source = motion.current?.querySelector(".brand-wordmark");
      const target = document.querySelector<HTMLImageElement>("[data-intro-logo] img");
      const logo = movingLogo.current;
      const overlay = dialog.current;
      if (!source || !target || !logo || !overlay) { finish(); return; }
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      logo.style.left = `${from.left}px`;
      logo.style.top = `${from.top}px`;
      logo.style.width = `${from.width}px`;
      logo.style.height = `${from.height}px`;
      overlay.classList.add("brand-loading--docking");
      const timing = { duration: 1500, easing: "cubic-bezier(.65,0,.2,1)", fill: "forwards" as const };
      logo.animate([
        { transform: "translate(0,0) scale(1)" },
        { transform: `translate(${to.left - from.left}px,${to.top - from.top}px) scale(${to.width / from.width})` },
      ], timing);
      overlay.animate([{ backgroundColor: "#fff" }, { backgroundColor: "transparent" }], timing);
      completion = window.setTimeout(finish, 1500);
    }, 5200);
    return () => { window.clearTimeout(timer); window.clearTimeout(completion); };
  }, [active, reduced]);
  if (!active || reduced) return null;
  return (
    <dialog
      ref={dialog}
      className="brand-loading"
      aria-label="Bower opening"
      onCancel={finish}
    >
      <div ref={motion} className="brand-motion" aria-hidden="true">
        <img
          className="brand-emblem"
          src="/assets/brand/bower-logo-evergreen-emblem.png"
          alt=""
        />
        <img
          className="brand-wordmark"
          src="/assets/brand/bower-logo-evergreen-horizontal.png"
          alt=""
        />
      </div>
      <svg ref={movingLogo} className="brand-docking-logo" viewBox="0 0 148 36.75" aria-hidden="true">
        <defs>
          <mask id="intro-mark" style={{ maskType: "luminance" }}>
            <image href="/assets/brand/bower-logo-evergreen-horizontal.png" width="148" height="36.75" style={{ filter: "grayscale(1) invert(1) brightness(2)" }} />
          </mask>
        </defs>
        <rect className="brand-docking-ink" width="148" height="36.75" fill="#354d40" mask="url(#intro-mark)" />
      </svg>
      <p>A building that grows.</p>
      <button autoFocus onClick={finish}>
        Skip animation ↗
      </button>
    </dialog>
  );
}
