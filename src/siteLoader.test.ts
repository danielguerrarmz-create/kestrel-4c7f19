import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8');
const html = read('../index.html');
const main = read('./main.tsx');
const imageFrames = read('./ui/installImageLoadingFrames.ts');

describe('asset-free site loader', () => {
  it('is inline, asset-free, and precedes the application module', () => {
    const loader = html.match(/<div id="site-loader"[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? '';
    expect(loader).toContain('A building that grows.');
    expect(loader).not.toMatch(/<(img|svg|video|source)\b/i);
    expect(html.indexOf('id="site-loader"')).toBeLessThan(html.indexOf('src="/src/main.tsx"'));
  });

  it('avoids fast-load flashes and cannot obscure the no-JavaScript fallback', () => {
    expect(html).toContain('preview ? 0 : 180');
    expect(html).toContain("['127.0.0.1', 'localhost'].includes(window.location.hostname)");
    expect(html).toContain('#site-loader { display: none; }');
  });

  it('releases after the app shell and gives the first eager image a finite window', () => {
    expect(main).toContain("image.loading !== 'lazy'");
    expect(main).toContain('window.setTimeout(finish, 3000)');
    expect(main).toContain('window.__bowerReleaseSiteLoader?.()');
  });
});

describe('content image loading frames', () => {
  it('observes images before React renders and excludes brand marks', () => {
    expect(main.indexOf('installImageLoadingFrames(root)')).toBeLessThan(main.indexOf('createRoot(root)'));
    expect(imageFrames).toContain("'header img, footer img, .brand-loading img, [data-no-image-placeholder]'");
    expect(imageFrames).toContain("image.dataset.imageLoading = 'true'");
    expect(imageFrames).toContain("has('image-outline-preview')");
  });
});
