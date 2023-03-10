import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  workers: process.env.CI ? 2 : 10,
  use: {
    baseURL: 'http://localhost:4200',
    // baseURL: 'https://postcat.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});
