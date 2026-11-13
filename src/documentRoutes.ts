/** Standalone documents have their own HTML and must bypass the marketing SPA. */
export const DESIGNX_ROOT = '/designx';
export const DESIGNX_PDF_ASSET = '/designx/downloads/Bower_DesignX_Buildings_That_Grow.pdf';
export const DESIGNX_V3_PDF_ASSET = '/designx/3/downloads/Bower_DesignX_Buildings_That_Grow_03.pdf';
export const DESIGNX_V4_PDF_ASSET = '/designx/4/downloads/Bower_DesignX_Buildings_That_Grow_04.pdf';

export function isDesignxDocumentPath(pathname: string): boolean {
  return pathname === DESIGNX_ROOT || pathname.startsWith(`${DESIGNX_ROOT}/`);
}

/** Vite's public directory needs an explicit index document at the extensionless URL. */
export function designxDocumentUrl(requestUrl: string): string | null {
  const queryIndex = requestUrl.indexOf('?');
  const pathname = queryIndex === -1 ? requestUrl : requestUrl.slice(0, queryIndex);
  const documentRoot = [DESIGNX_ROOT, `${DESIGNX_ROOT}/2`, `${DESIGNX_ROOT}/3`, `${DESIGNX_ROOT}/4`]
    .find(root => pathname === root || pathname === `${root}/`);
  if (!documentRoot) return null;
  return `${documentRoot}/index.html${queryIndex === -1 ? '' : requestUrl.slice(queryIndex)}`;
}

/** The PDF alias serves a file, never the interactive document or the marketing SPA. */
export function designxPdfUrl(requestUrl: string): string | null {
  const queryIndex = requestUrl.indexOf('?');
  const pathname = queryIndex === -1 ? requestUrl : requestUrl.slice(0, queryIndex);
  const aliases: Record<string, string> = {
    [`${DESIGNX_ROOT}/pdf`]: DESIGNX_PDF_ASSET,
    [`${DESIGNX_ROOT}/pdf/`]: DESIGNX_PDF_ASSET,
    [`${DESIGNX_ROOT}/3/pdf`]: DESIGNX_V3_PDF_ASSET,
    [`${DESIGNX_ROOT}/3/pdf/`]: DESIGNX_V3_PDF_ASSET,
    [`${DESIGNX_ROOT}/4/pdf`]: DESIGNX_V4_PDF_ASSET,
    [`${DESIGNX_ROOT}/4/pdf/`]: DESIGNX_V4_PDF_ASSET,
  };
  const asset = aliases[pathname];
  if (!asset) return null;
  return `${asset}${queryIndex === -1 ? '' : requestUrl.slice(queryIndex)}`;
}
