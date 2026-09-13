import { describe, expect, it } from 'vitest';
import { GALLERY_IMAGES, GALLERY_SNAP } from './GalleryPage';
import { resolveSnapStrength } from '../ui/usePageSnap';

describe('GalleryPage curation', () => {
  it('keeps the gallery tightly edited', () => {
    expect(GALLERY_IMAGES.length).toBeGreaterThan(0);
    expect(GALLERY_IMAGES.length).toBeLessThanOrEqual(10);
    expect(new Set(GALLERY_IMAGES.map((image) => image.src)).size).toBe(GALLERY_IMAGES.length);
  });

  it('labels every imagined work honestly and accessibly', () => {
    for (const image of GALLERY_IMAGES) {
      expect(image.alt.length).toBeGreaterThan(20);
      expect(image.n).toMatch(/^\d{2}$/);
    }
  });

  /**
   * PINNED THROUGH THE RESOLVER, NOT AS A LITERAL (2026-09-13). The old assert was
   * `toEqual({ strength: 'proximity', mobileStrength: 'mandatory' })`, which pins the shape of a
   * config object and says nothing about what the page DOES with it: `resolveSnapStrength` could
   * invert tomorrow and this would stay green. Asserting through the resolver binds the two, so
   * either half changing is caught.
   *
   * The property, not the value: a phone must never be snapped harder than a desktop. `mandatory`
   * cancels flick momentum on a 13,849px page of eight full-screen plates, and it is the reason
   * the gallery felt worse under a finger than the home page does.
   */
  it('never snaps a phone harder than a desktop', () => {
    const onPhone = resolveSnapStrength(GALLERY_SNAP.strength, GALLERY_SNAP.mobileStrength, true);
    const onDesktop = resolveSnapStrength(GALLERY_SNAP.strength, GALLERY_SNAP.mobileStrength, false);
    expect(onPhone).toBe('proximity');
    expect(onDesktop).toBe('proximity');
    expect(onPhone).not.toBe('mandatory');
  });
});
