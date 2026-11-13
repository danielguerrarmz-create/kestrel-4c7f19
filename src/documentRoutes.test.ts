import { describe, expect, it } from 'vitest';
import { DESIGNX_PDF_ASSET, designxDocumentUrl, designxPdfUrl, isDesignxDocumentPath } from './documentRoutes';

describe('the standalone presentation document', () => {
  it('keeps print and deep-link query parameters when serving its HTML', () => {
    expect(designxDocumentUrl('/designx')).toBe('/designx/index.html');
    expect(designxDocumentUrl('/designx/')).toBe('/designx/index.html');
    expect(designxDocumentUrl('/designx?print=1&from=pdf')).toBe('/designx/index.html?print=1&from=pdf');
    expect(designxDocumentUrl('/designx/?print=1')).toBe('/designx/index.html?print=1');
  });

  it('never rewrites presentation media or unrelated routes to HTML', () => {
    for (const url of ['/designx/deck.js', '/designx/assets/cover.webp', '/designx/index.html', '/designx/pdf', '/designx/pdf/', '/designx-other', '/', '/gallery']) {
      expect(designxDocumentUrl(url), url).toBeNull();
    }
    expect(isDesignxDocumentPath('/designx')).toBe(true);
    expect(isDesignxDocumentPath('/designx/assets/cover.webp')).toBe(true);
    expect(isDesignxDocumentPath('/designx-other')).toBe(false);
  });

  it('serves both PDF aliases as a PDF file and preserves query parameters', () => {
    expect(designxPdfUrl('/designx/pdf')).toBe(DESIGNX_PDF_ASSET);
    expect(designxPdfUrl('/designx/pdf/')).toBe(DESIGNX_PDF_ASSET);
    expect(designxPdfUrl('/designx/pdf?from=deck')).toBe(`${DESIGNX_PDF_ASSET}?from=deck`);
    expect(designxPdfUrl('/designx/pdf/?from=deck')).toBe(`${DESIGNX_PDF_ASSET}?from=deck`);
    expect(isDesignxDocumentPath('/designx/pdf')).toBe(true);
  });

  it('does not turn the interactive deck, nearby paths or PDF assets into aliases', () => {
    for (const url of ['/designx', '/designx/', '/designx/pdf-notes', '/designx/pdf/notes', DESIGNX_PDF_ASSET, '/', '/gallery']) {
      expect(designxPdfUrl(url), url).toBeNull();
    }
  });
});
