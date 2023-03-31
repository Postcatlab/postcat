import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: process.env.CI ? 2 : 10,
  use: {
    baseURL: 'http://localhost:4200',
    // baseURL: 'https://postcat.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry'
  },
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  projects: [
    // {
    //   name: 'setup',
    //   testMatch: '**/*.setup.ts'
    // },
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome']
      }
    }
    // {
    //   name: 'remote',
    //   use: {
    //     ...devices['Desktop Chrome']
    //   },
    //   dependencies: ['setup']
    // }
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] }
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] }
    // }
  ]
  // webServer: {
  //   command: 'cd ../../&&yarn start:web',
  //   url: 'http://localhost:4200',
  //   reuseExistingServer: !process.env.CI
  // }
});
