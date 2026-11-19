import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DESIGNX_PDF_ASSET, DESIGNX_V3_PDF_ASSET, DESIGNX_RETAIL_PDF_ASSET, designxDocumentUrl, designxPdfUrl, isDesignxDocumentPath, isArchivedDesignxDocument } from './documentRoutes';

describe('the standalone presentation document', () => {
  it('publishes the selected deck in the physical root index before filesystem routing', () => {
    const main = readFileSync(new URL('../public/designx/index.html', import.meta.url), 'utf8');
    const v8 = readFileSync(new URL('../archive/designx/2026-11-19/v8/index.html', import.meta.url), 'utf8');
    const original = readFileSync(new URL('../archive/designx/2026-11-19/1/index.html', import.meta.url), 'utf8');
    expect(main).toContain("'v8/canopy-orbit.js'");
    expect(main.replace("new URL('./', location.href)", "new URL('../', location.href)")).toBe(v8);
    expect(original).toContain('<title>Buildings That Grow — Bower × MIT–LUMA</title>');
    expect(original).not.toContain('v8/canopy-orbit.js');
  });

  it('keeps print and deep-link query parameters when serving its HTML', () => {
    expect(designxDocumentUrl('/designx')).toBe('/designx/index.html');
    expect(designxDocumentUrl('/designx/')).toBe('/designx/index.html');
    expect(designxDocumentUrl('/designx?print=1&from=pdf')).toBe('/designx/index.html?print=1&from=pdf');
    expect(designxDocumentUrl('/designx/?print=1')).toBe('/designx/index.html?print=1');
  });

  it('serves Version 10 and retires older entry routes while preserving shared resources', () => {
    expect(designxDocumentUrl('/designx/v10')).toBe('/designx/v10/index.html');
    expect(designxDocumentUrl('/designx/v10/?print=1')).toBe('/designx/v10/index.html?print=1');
    for (const edition of ['1', '2', '3', '4', '5', '6', 'v7', 'v8']) {
      for (const suffix of ['', '/', '/index.html', '/pdf']) {
        const path = '/designx/' + edition + suffix;
        expect(isArchivedDesignxDocument(path)).toBe(true);
        expect(designxDocumentUrl(path)).toBeNull();
        expect(designxPdfUrl(path)).toBeNull();
      }
    }
    for (const path of ['/designx', '/designx/v10/', '/cre-retail', '/designx/retail', '/designx/5/factory/07-scan.html', '/designx/4/assets/fonts/safiro-regular-webfont.woff2']) {
      expect(isArchivedDesignxDocument(path)).toBe(false);
    }
  });

  it('serves the CRE retail edition independently, including print and PDF aliases', () => {
    expect(designxDocumentUrl('/cre-retail')).toBe('/designx/retail/index.html');
    expect(designxDocumentUrl('/cre-retail/')).toBe('/designx/retail/index.html');
    expect(designxDocumentUrl('/cre-retail?print=1&from=pdf')).toBe('/designx/retail/index.html?print=1&from=pdf');
    expect(designxDocumentUrl('/cre-retail/?print=1')).toBe('/designx/retail/index.html?print=1');
    expect(isDesignxDocumentPath('/cre-retail')).toBe(true);
    expect(isDesignxDocumentPath('/cre-retail/pdf')).toBe(true);
    expect(isDesignxDocumentPath('/cre-retailer')).toBe(false);
    expect(designxDocumentUrl('/designx/retail')).toBe('/designx/retail/index.html');
    expect(designxDocumentUrl('/designx/retail/')).toBe('/designx/retail/index.html');
    expect(designxDocumentUrl('/designx/retail?print=1&from=pdf')).toBe('/designx/retail/index.html?print=1&from=pdf');
    expect(designxDocumentUrl('/designx/retail/?print=1')).toBe('/designx/retail/index.html?print=1');
    expect(isDesignxDocumentPath('/designx/retail')).toBe(true);
    for (const alias of ['/cre-retail/pdf', '/cre-retail/pdf/', '/designx/retail/pdf', '/designx/retail/pdf/']) {
      expect(designxPdfUrl(alias)).toBe(DESIGNX_RETAIL_PDF_ASSET);
      expect(designxPdfUrl(`${alias}?from=deck`)).toBe(`${DESIGNX_RETAIL_PDF_ASSET}?from=deck`);
      expect(designxDocumentUrl(alias)).toBeNull();
    }
    for (const path of ['/cre-retailer', '/cre-retail/pdf/notes', '/designx/retail/deck.js', '/designx/retail/index.html', '/designx/retailer', '/designx/retail/pdf/notes', DESIGNX_RETAIL_PDF_ASSET]) {
      expect(designxDocumentUrl(path), path).toBeNull();
      expect(designxPdfUrl(path), path).toBeNull();
    }
  });

  it('keeps the CRE retail production rewrites and PDF headers aligned with local routing', () => {
    const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
    for (const path of ['/cre-retail', '/cre-retail/', '/designx/retail', '/designx/retail/']) {
      expect(config.rewrites).toContainEqual({ source: path, destination: designxDocumentUrl(path) });
    }
    for (const path of ['/cre-retail/pdf', '/cre-retail/pdf/', '/designx/retail/pdf', '/designx/retail/pdf/']) {
      expect(config.rewrites).toContainEqual({ source: path, destination: designxPdfUrl(path) });
      expect(config.headers).toContainEqual({ source: path, headers: [
        { key: 'Content-Type', value: 'application/pdf' },
        { key: 'Content-Disposition', value: 'inline; filename="Bower_CRE_Retail.pdf"' },
      ] });
    }
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

  it('does not turn the interactive deck, nearby paths or PDF assets into aliases', () => {
    for (const url of ['/designx', '/designx/', '/designx/2', '/designx/2/', '/designx/3', '/designx/3/', '/designx/2/pdf', '/designx/3/pdf-notes', '/designx/3/pdf/notes', '/designx/pdf-notes', '/designx/pdf/notes', DESIGNX_PDF_ASSET, DESIGNX_V3_PDF_ASSET, '/', '/gallery']) {
      expect(designxPdfUrl(url), url).toBeNull();
    }
  });
});
