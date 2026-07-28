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
    include: ['src/**/*.test.ts', 'qa/**/*.test.mjs'],
    environment: 'node',
  },
});
