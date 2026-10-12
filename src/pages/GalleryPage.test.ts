import { describe, expect, it } from 'vitest';
import { COLLECTION_IMAGES, COLLECTION_SLUGS, FEATURED_SLUGS, GALLERY_IMAGES, GALLERY_SNAP } from './GalleryPage';
import { resolveSnapStrength } from '../ui/usePageSnap';

describe('GalleryPage curation', () => {
  it('keeps the gallery tightly edited', () => {
    expect(GALLERY_IMAGES.length).toBeGreaterThan(0);
    expect(GALLERY_IMAGES).toHaveLength(20);
    expect(COLLECTION_IMAGES).toHaveLength(20);
    expect(new Set(GALLERY_IMAGES.map((image) => image.src)).size).toBe(GALLERY_IMAGES.length);
    expect(COLLECTION_IMAGES.map((image) => image.src)).not.toEqual(expect.arrayContaining([
      '/assets/selected/02-timber-joint.webp',
      '/assets/selected/08-winter-family.webp',
      '/assets/selected/09-summer-family.webp',
      '/assets/selected/19-floral-canopy.webp',
      '/assets/selected/20-autumn-canopy.webp',
      '/assets/selected/25-new-bower.webp',
      '/assets/selected/26-growing-bower.webp',
      '/assets/selected/27-mature-bower.webp',
      '/assets/selected/28-winter-bower.webp',
      '/assets/selected/10-estate-aerial.webp',
      '/assets/selected/13-grape-oculus.webp',
    ]));
    expect(COLLECTION_SLUGS).toEqual([
      '14-rose-wisteria', '06-wedding-speech', '21-woodland-bower', '30-ancient-bower',
      '15-rose-reading', '29-wisteria-theatre', '05-walled-garden', '31-family-supper',
      '22-wisteria-banquet', '12-orchard-approach', '16-romantic-dinner', '04-garden-exhibition',
      '17-memorial-garden', '01-meadow-tea', '23-white-wisteria', '11-autumn-retreat',
      '07-charity-dinner', '03-wisteria-walk', '24-candlelit-canopy', '18-autumn-dinner',
    ]);
    expect(FEATURED_SLUGS).toEqual([
      '14-rose-wisteria', '24-candlelit-canopy', '05-walled-garden', '18-autumn-dinner',
      '03-wisteria-walk', '29-wisteria-theatre', '15-rose-reading', '06-wedding-speech',
      '12-orchard-approach', '31-family-supper',
    ]);
  });

  it('labels every imagined work honestly and accessibly', () => {
    for (const image of GALLERY_IMAGES) {
      expect(image.alt.length).toBeGreaterThan(20);
      expect(image.title).not.toMatch(/^\d/);
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
