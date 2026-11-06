import { useEffect } from 'react';

/**
 * Opt editorial pages into native section snapping. CSS owns the snap geometry
 * and reduced-motion override; the browser owns scrolling and input gestures.
 */
type SnapStrength = 'mandatory' | 'proximity';

export function resolveSnapStrength(
  strength: SnapStrength,
  mobileStrength: SnapStrength | undefined,
  isMobile: boolean,
): SnapStrength {
  return isMobile && mobileStrength ? mobileStrength : strength;
}

export function usePageSnap({
  strength = 'mandatory',
  mobileStrength,
}: {
  strength?: SnapStrength;
  mobileStrength?: SnapStrength;
} = {}): void {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-page-snap');

    const mobile = window.matchMedia('(max-width: 767px)');
    const applyStrength = () => {
      const activeStrength = resolveSnapStrength(strength, mobileStrength, mobile.matches);
      root.setAttribute('data-page-snap', activeStrength);
    };

    applyStrength();
    if (typeof mobile.addEventListener === 'function') mobile.addEventListener('change', applyStrength);
    else mobile.addListener(applyStrength);

    return () => {
      if (typeof mobile.removeEventListener === 'function') mobile.removeEventListener('change', applyStrength);
      else mobile.removeListener(applyStrength);
      if (previous === null) root.removeAttribute('data-page-snap');
      else root.setAttribute('data-page-snap', previous);
    };
  }, [mobileStrength, strength]);
}
