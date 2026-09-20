import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../ui/useReducedMotion";

/** Motion study interpretation: emblem unfurls, settles beside the intact wordmark.
 * No fake progress meter; the short overture can always be skipped. */
export function BowerLoading({ replay = 0 }: { replay?: number }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const finish = () => {
    setActive(false);
    try {
      sessionStorage.setItem("bower.brand-intro.v2", "seen");
    } catch {
      /* optional storage */
    }
  };
  useEffect(() => {
    if (reduced) return;
    try {
      if (!replay && sessionStorage.getItem("bower.brand-intro.v2")) return;
    } catch {
      /* private browsing */
    }
    setActive(true);
    const timer = window.setTimeout(finish, 3200);
    return () => window.clearTimeout(timer);
  }, [reduced, replay]);
  useEffect(() => {
    if (active && !reduced) dialog.current?.showModal();
  }, [active, reduced]);
  if (!active || reduced) return null;
  return (
    <dialog
      ref={dialog}
      className="brand-loading"
      aria-label="Bower opening"
      onCancel={finish}
    >
      <div className="brand-motion" aria-hidden="true">
        <img
          className="brand-unfurl"
          src="/assets/brand/bower-logo-evergreen-emblem.png"
          alt=""
        />
        <img
          className="brand-resolve"
          src="/assets/brand/bower-logo-evergreen-horizontal.png"
          alt=""
        />
      </div>
      <p>A building that grows.</p>
      <button autoFocus onClick={finish}>
        Skip opening ↗
      </button>
    </dialog>
  );
}
