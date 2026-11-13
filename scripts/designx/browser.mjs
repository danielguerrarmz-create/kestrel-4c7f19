import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { chromium } from 'playwright';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const DECK_URL = process.env.DESIGNX_URL ?? 'http://127.0.0.1:5333/designx/';
const authored = { window: {} };
for (const script of ['scenes/growth.js', 'scenes/flywheels.js', 'slides.js']) {
  const path = new URL(`../../public/designx/${script}`, import.meta.url);
  if (existsSync(path)) runInNewContext(readFileSync(path, 'utf8'), authored, { filename: script });
}
export const DECK_META = authored.window.DESIGNX_META;
export const SLIDE_COUNT = authored.window.DESIGNX_SLIDES.length;
export const slideNumberFor = theme => {
  const index = authored.window.DESIGNX_SLIDES.findIndex(slide => slide.theme.split(' ').includes(theme));
  if (index < 0) throw new Error(`Missing scene: ${theme}`);
  return index + 1;
};

export async function openBrowser() {
  const candidates = [
    process.env.DESIGNX_BROWSER,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    chromium.executablePath(),
  ].filter(Boolean);
  const executablePath = candidates.find((path) => existsSync(path));
  if (!executablePath) throw new Error('No Chromium browser found. Set DESIGNX_BROWSER to Chrome or Edge.');
  return chromium.launch({ executablePath, headless: true });
}

export function printUrl(url = DECK_URL) {
  const target = new URL(url);
  target.searchParams.set('print', '1');
  target.hash = '';
  return target.href;
}

export async function waitForDeck(page) {
  await page.waitForFunction(() => typeof window.DESIGNX_READY !== 'undefined');
  const expectedSlideCount = await page.evaluate(async () => {
    await window.DESIGNX_READY;
    await document.fonts.ready;
    const images = [...document.images];
    for (const image of images) image.loading = 'eager';
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
    const missing = images.filter((image) => !image.complete || !image.naturalWidth).map((image) => image.currentSrc || image.src);
    // SVG <image> nodes are not in document.images, but carry model evidence in the loops.
    const svgSources = [...document.querySelectorAll('svg image')].map((image) => new URL(image.getAttribute('href') || image.getAttribute('xlink:href'), document.baseURI).href);
    for (const source of svgSources) {
      const image = new Image();
      image.src = source;
      try { await image.decode(); } catch { missing.push(source); }
    }
    if (missing.length) throw new Error(`Missing presentation images: ${missing.join(', ')}`);
    const target = window.DESIGNX_META?.targetSlideCount;
    if (!Number.isInteger(target) || target < 1) throw new Error('The rendered presentation has no valid target slide count.');
    if (window.DESIGNX_SLIDES?.length !== target) throw new Error(`Expected ${target} authored scenes for this edition.`);
    return target;
  });
  if (await page.locator('.slide').count() !== expectedSlideCount) {
    throw new Error(`Expected ${expectedSlideCount} .slide elements for this edition.`);
  }
}

/** Inspect rendered text, not just scrollWidth: fixed stages can otherwise hide clipping. */
export async function inspectSlides(page) {
  return page.locator('.slide').evaluateAll((slides) => slides.map((slide) => {
    const box = slide.getBoundingClientRect();
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
    const overflow = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent?.trim()) continue;
      const parent = node.parentElement;
      if (!parent || parent.closest('[aria-hidden="true"], [data-allow-overflow]')) continue;
      const style = getComputedStyle(parent);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (!rect.width || !rect.height) continue;
        if (rect.left < box.left - 2 || rect.top < box.top - 2 || rect.right > box.right + 2 || rect.bottom > box.bottom + 2) {
          overflow.push(node.textContent.trim().slice(0, 100));
          break;
        }
      }
    }
    return { id: slide.id, width: box.width, height: box.height, overflow };
  }));
}

export function assertPrintSlides(slides) {
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    if (slide.id !== `slide-${String(i + 1).padStart(2, '0')}`) throw new Error(`Unexpected slide order at ${i + 1}: ${slide.id}`);
    if (Math.abs(slide.width - 1600) > 1 || Math.abs(slide.height - 900) > 1) {
      throw new Error(`${slide.id} is ${slide.width} × ${slide.height}; print slides must be 1600 × 900.`);
    }
    if (slide.overflow.length) throw new Error(`${slide.id} has clipped text: ${slide.overflow.join(' / ')}`);
  }
}
