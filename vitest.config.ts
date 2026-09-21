/**
 * vitest.config.ts — pure-function unit tests only.
 *
 * The engine (src/engine) is a pipeline of pure functions with no React or
 * three.js, so tests run in the default node environment with no jsdom, no
 * plugins, no DOM. Fast on purpose. Nothing here renders a component.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // `qa/` is the Puppeteer harness, not the app, but its pure helpers (budget arithmetic) belong
    // under the same "pure functions, node env, no DOM" rule as everything else here — and one of
    // them shipped a bug that a comment could not have caught. Only `*.test.mjs` is collected; the
    // probes themselves drive a real browser and are run by hand.
    // `api/` is the Vercel serverless surface (2026-07-31, the contact endpoint). Vercel builds it
    // separately from the Vite app, so it is easy to forget it is code at all — and it is the one
    // place where a bug is INVISIBLE from the site, because a form that silently fails still shows
    // a confirmation. Its decision table is pure and belongs under the same rule as everything else.
    include: ['src/**/*.test.ts', 'qa/**/*.test.mjs', 'api/**/*.test.ts'],
    environment: 'node',
  },
});
