import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:4177',
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
    launchOptions: { args: ['--no-sandbox'] },
  },
  webServer: {
    command: 'CI=1 npx vite --host 127.0.0.1 --port 4177 --strictPort',
    url: 'http://127.0.0.1:4177/tech',
    reuseExistingServer: false,
  },
});
