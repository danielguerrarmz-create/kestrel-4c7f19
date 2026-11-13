import { describe, expect, it } from 'vitest';
import { DESIGNX_PDF_ASSET, DESIGNX_V3_PDF_ASSET, designxDocumentUrl, designxPdfUrl, isDesignxDocumentPath } from './documentRoutes';

describe('the standalone presentation document', () => {
  it('keeps print and deep-link query parameters when serving its HTML', () => {
    expect(designxDocumentUrl('/designx')).toBe('/designx/index.html');
    expect(designxDocumentUrl('/designx/')).toBe('/designx/index.html');
    expect(designxDocumentUrl('/designx?print=1&from=pdf')).toBe('/designx/index.html?print=1&from=pdf');
    expect(designxDocumentUrl('/designx/?print=1')).toBe('/designx/index.html?print=1');
  });

  it('serves the second edition independently and preserves its query parameters', () => {
    expect(designxDocumentUrl('/designx/2')).toBe('/designx/2/index.html');
    expect(designxDocumentUrl('/designx/2/')).toBe('/designx/2/index.html');
    expect(designxDocumentUrl('/designx/2?print=1&from=compare')).toBe('/designx/2/index.html?print=1&from=compare');
    expect(designxDocumentUrl('/designx/2/?print=1')).toBe('/designx/2/index.html?print=1');
    expect(isDesignxDocumentPath('/designx/2')).toBe(true);
  });

  it('serves the third edition independently and preserves its query parameters', () => {
    expect(designxDocumentUrl('/designx/3')).toBe('/designx/3/index.html');
    expect(designxDocumentUrl('/designx/3/')).toBe('/designx/3/index.html');
    expect(designxDocumentUrl('/designx/3?print=1&from=compare')).toBe('/designx/3/index.html?print=1&from=compare');
    expect(designxDocumentUrl('/designx/3/?print=1')).toBe('/designx/3/index.html?print=1');
    expect(isDesignxDocumentPath('/designx/3')).toBe(true);
  });

  it('never rewrites presentation media or unrelated routes to HTML', () => {
    for (const url of ['/designx/deck.js', '/designx/assets/cover.webp', '/designx/index.html', '/designx/2/editorial.css', '/designx/2/index.html', '/designx/3/editorial.css', '/designx/3/index.html', '/designx/20', '/designx/30', '/designx/2/pdf', '/designx/3/pdf', '/designx/pdf', '/designx/pdf/', '/designx-other', '/', '/gallery']) {
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

  it('serves the third edition PDF without replacing the original submission', () => {
    expect(designxPdfUrl('/designx/3/pdf')).toBe(DESIGNX_V3_PDF_ASSET);
    expect(designxPdfUrl('/designx/3/pdf/')).toBe(DESIGNX_V3_PDF_ASSET);
    expect(designxPdfUrl('/designx/3/pdf?from=deck')).toBe(`${DESIGNX_V3_PDF_ASSET}?from=deck`);
    expect(designxPdfUrl('/designx/3/pdf/?from=deck')).toBe(`${DESIGNX_V3_PDF_ASSET}?from=deck`);
    expect(isDesignxDocumentPath('/designx/3/pdf')).toBe(true);
    expect(DESIGNX_V3_PDF_ASSET).not.toBe(DESIGNX_PDF_ASSET);
  });

  it('does not turn the interactive deck, nearby paths or PDF assets into aliases', () => {
    for (const url of ['/designx', '/designx/', '/designx/2', '/designx/2/', '/designx/3', '/designx/3/', '/designx/2/pdf', '/designx/3/pdf-notes', '/designx/3/pdf/notes', '/designx/pdf-notes', '/designx/pdf/notes', DESIGNX_PDF_ASSET, DESIGNX_V3_PDF_ASSET, '/', '/gallery']) {
      expect(designxPdfUrl(url), url).toBeNull();
    }
  });
});
