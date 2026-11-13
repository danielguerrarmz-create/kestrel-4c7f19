/** Standalone documents have their own HTML and must bypass the marketing SPA. */
export const DESIGNX_ROOT = '/designx';
export const DESIGNX_PDF_ASSET = '/designx/downloads/Bower_DesignX_Buildings_That_Grow.pdf';

export function isDesignxDocumentPath(pathname: string): boolean {
  return pathname === DESIGNX_ROOT || pathname.startsWith(`${DESIGNX_ROOT}/`);
}

/** Vite's public directory needs an explicit index document at the extensionless URL. */
export function designxDocumentUrl(requestUrl: string): string | null {
  const queryIndex = requestUrl.indexOf('?');
  const pathname = queryIndex === -1 ? requestUrl : requestUrl.slice(0, queryIndex);
  if (pathname !== DESIGNX_ROOT && pathname !== `${DESIGNX_ROOT}/`) return null;
  return `${DESIGNX_ROOT}/index.html${queryIndex === -1 ? '' : requestUrl.slice(queryIndex)}`;
}

/** The PDF alias serves a file, never the interactive document or the marketing SPA. */
export function designxPdfUrl(requestUrl: string): string | null {
  const queryIndex = requestUrl.indexOf('?');
  const pathname = queryIndex === -1 ? requestUrl : requestUrl.slice(0, queryIndex);
  if (pathname !== `${DESIGNX_ROOT}/pdf` && pathname !== `${DESIGNX_ROOT}/pdf/`) return null;
  return `${DESIGNX_PDF_ASSET}${queryIndex === -1 ? '' : requestUrl.slice(queryIndex)}`;
}
