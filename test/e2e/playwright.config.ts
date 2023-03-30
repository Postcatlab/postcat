import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  workers: process.env.CI ? 2 : 10,
  use: {
    // baseURL: 'http://localhost:4200',
    baseURL: 'https://postcat.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry'
  },
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
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
  // webServer: {
  //   command: 'yarn start:web',
  //   url: 'http://localhost:4200',
  //   reuseExistingServer: !process.env.CI
  // }
});
