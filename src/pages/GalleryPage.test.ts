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

  // Exercise the resolver as well as the page configuration so either can catch regressions.
  it('never snaps a phone harder than a desktop', () => {
    const onPhone = resolveSnapStrength(GALLERY_SNAP.strength, GALLERY_SNAP.mobileStrength, true);
    const onDesktop = resolveSnapStrength(GALLERY_SNAP.strength, GALLERY_SNAP.mobileStrength, false);
    expect(onPhone).toBe('proximity');
    expect(onDesktop).toBe('proximity');
    expect(onPhone).not.toBe('mandatory');
  });
});
