import { describe, expect, it } from 'vitest';
import { GALLERY_IMAGES, GALLERY_SNAP } from './GalleryPage';

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

  it('snaps firmly on mobile without changing the soft desktop gallery', () => {
    expect(GALLERY_SNAP).toEqual({ strength: 'proximity', mobileStrength: 'mandatory' });
  });
});
