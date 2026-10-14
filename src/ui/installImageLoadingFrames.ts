const EXCLUDED_IMAGE = 'header img, footer img, .brand-loading img, [data-no-image-placeholder]';
const OUTLINE_PREVIEW = ['127.0.0.1', 'localhost'].includes(window.location.hostname) &&
  new URLSearchParams(window.location.search).has('image-outline-preview');

function watchImage(image: HTMLImageElement): void {
  if (image.matches(EXCLUDED_IMAGE)) return;

  image.dataset.imageLoading = 'true';
  if (OUTLINE_PREVIEW) {
    image.removeAttribute('srcset');
    image.alt = '';
    image.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    return;
  }
  if (image.complete && image.naturalWidth > 0) {
    delete image.dataset.imageLoading;
    return;
  }
  const settle = (state: 'ready' | 'error') => {
    delete image.dataset.imageLoading;
    image.dataset.imageState = state;
    window.setTimeout(() => delete image.dataset.imageState, 360);
  };
  image.addEventListener('load', () => settle('ready'), { once: true });
  image.addEventListener('error', () => settle('error'), { once: true });
}

function scan(node: Node): void {
  if (node instanceof HTMLImageElement) watchImage(node);
  if (node instanceof Element) node.querySelectorAll('img').forEach(watchImage);
}

/**
 * Adds a zero-asset outline while content images are waiting for their bytes.
 * Installed before React renders, so it also catches the first image nodes and
 * continues to cover route changes and lazy sections added later.
 */
export function installImageLoadingFrames(root: HTMLElement): () => void {
  scan(root);
  const observer = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach(scan));
  });
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}
