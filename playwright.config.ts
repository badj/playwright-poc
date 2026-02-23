import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Give failing tests 3 retry attempts
  retries: 1,
  // Retry on CI only
  // retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
      // Serve HTML report command 'npx playwright show-report'
      ['html', { open: 'never' }],
      // Default line reporter for console output
      ['line'],
      // Allure reporter: Generate and clean command 'allure generate allure-results -o allure-report --clean'
      ['allure-playwright', { outputFolder: 'allure-results', environmentInfo: { OS: os.platform(), NodeVersion: process.version } }],
      ['monocart-reporter', { name: "Playwright POC Test Report", outputFile: './monocart-report/index.html'}]
  ],
    use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'https://testautomation.bigcartel.com/',
    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    screenshot: 'on',
    // screenshot: 'only-on-failure',
    video: 'on',
    // video: 'retain-on-failure',
    // video: 'on-first-retry',
    trace: 'on',
    // trace: 'retain-on-failure',
    // trace: 'on-first-retry',
    },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
// TODO: Disabled cross-browser runners due to Cloudflare security checks triggered on the cart and checkout pages
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Test against mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // Test against branded browsers
    // Enable this to run tests against Edge as well
     // {
     //   name: 'Microsoft Edge',
     //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
     // },
     // {
     //   name: 'Google Chrome',
     //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
     // },
  ],

  // Run your local dev server before starting the tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
