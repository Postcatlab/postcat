import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry'
  }
});
