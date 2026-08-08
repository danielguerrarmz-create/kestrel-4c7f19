import { useEffect } from 'react';

/**
 * Native section snapping for editorial pages. The browser owns the gesture:
 * there is no wheel interception or `snap-stop: always`, so tall sections remain
 * readable and the footer can still be reached as an end-aligned snap target.
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
  wheel?: boolean;
  strength?: SnapStrength;
  mobileStrength?: SnapStrength;
} = {}): void {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previous = {
      rootSnap: root.style.scrollSnapType,
      rootPadding: root.style.scrollPaddingTop,
      bodySnap: body.style.scrollSnapType,
    };

    root.style.scrollPaddingTop = '0px';
    const mobile = window.matchMedia('(max-width: 767px)');
    const applyStrength = () => {
      const activeStrength = resolveSnapStrength(strength, mobileStrength, mobile.matches);
      root.style.scrollSnapType = `y ${activeStrength}`;
      body.style.scrollSnapType = `y ${activeStrength}`;
    };

    applyStrength();
    if (typeof mobile.addEventListener === 'function') mobile.addEventListener('change', applyStrength);
    else mobile.addListener(applyStrength);

    return () => {
      if (typeof mobile.removeEventListener === 'function') mobile.removeEventListener('change', applyStrength);
      else mobile.removeListener(applyStrength);
      root.style.scrollSnapType = previous.rootSnap;
      root.style.scrollPaddingTop = previous.rootPadding;
      body.style.scrollSnapType = previous.bodySnap;
    };
  }, [mobileStrength, strength]);
}
