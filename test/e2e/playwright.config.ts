import { defineConfig } from '@playwright/test';
export default defineConfig({
  workers: process.env.CI ? 2 : 10,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry'
  }
});
