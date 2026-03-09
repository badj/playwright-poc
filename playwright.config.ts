import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";
import * as fs from 'fs';
const storageStatePath = 'playwright/.auth/cloudflare.json';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 1,
    // Retry on CI only
    // retries: process.env.CI ? 2 : 0,
    // Opt out of parallel tests on CI.
    workers: process.env.CI ? 1 : undefined,
    timeout: 60_000,

    reporter: [
        ['html', { open: 'never' }],
        ['line'],
        ['allure-playwright', { outputFolder: 'allure-results', environmentInfo: { OS: os.platform(), NodeVersion: process.version } }],
        ['monocart-reporter', { name: "Playwright POC Test Report", outputFile: './monocart-report/index.html'}]
    ],

    use: {
        baseURL: 'https://testautomation.bigcartel.com/',
        screenshot: 'on',
        // screenshot: 'only-on-failure',
        video: 'on',
        // video: 'retain-on-failure',
        // video: 'on-first-retry',
        // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
        trace: 'on',
        // trace: 'retain-on-failure',
        // trace: 'on-first-retry',
        headless: false,
        locale: 'en-NZ',
        timezoneId: 'Pacific/Auckland',
        storageState: fs.existsSync(storageStatePath) ? storageStatePath : undefined
    },

    projects: [

        /***************************************************************************************************************
         * Cloudflare warmup step
         * Saves cf_clearance cookie
         * Required to spoof Cloudflare security checks for: "Add to cart" AJAX/XHR POST that gets blocked
         * Required to spoof Cloudflare security turnstiles loaded for Cart and Checkout pages
         **************************************************************************************************************/

        {
            name: 'setup',
            testMatch: /cloudflare.setup.ts/,
        },

        /***************************************************************************************************************
         * CHROME (Cloudflare hardened)
         * userAgent and launchOptions required to spoof Cloudflare security checks for:
         * "Add to cart" AJAX/XHR POST that gets blocked by Cloudflare and turnstiles loaded for Cart and Checkout pages
         **************************************************************************************************************/

        {
            name: 'chromium',
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Chrome'],

                userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',

                launchOptions: {
                    args: [
                        '--disable-blink-features=AutomationControlled',
                        '--no-sandbox'
                    ]
                }
            }
        },

        /***************************************************************************************************************
         * FIREFOX (Cloudflare hardened)
         * userAgent, launchOptions and firefoxUserPrefs required to spoof Cloudflare security checks for:
         * "Add to cart" AJAX/XHR POST that gets blocked by Cloudflare and turnstiles loaded for Cart and Checkout pages
         **************************************************************************************************************/

        {
            name: 'firefox',
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Firefox'],

                userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0',

                launchOptions: {
                    args: ['--no-sandbox'],

                    firefoxUserPrefs: {
                        'dom.webdriver.enabled': false,
                        'useAutomationExtension': false,
                        'media.navigator.enabled': true,
                        'privacy.resistFingerprinting': false,
                        'general.platform.override': 'Win64',
                        'network.http.referer.XOriginPolicy': 0
                    }
                }
            }
        }
        // Webkit disabled - add to cart test step failures since 25 February 2026
        // TODO: Cloudflare security check bypass for Webkit - fix still being investigated/WIP!

        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
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

        // Run your local dev server before starting the tests
        // webServer: {
        //   command: 'npm run start',
        //   url: 'http://127.0.0.1:3000',
        //   reuseExistingServer: !process.env.CI,
        // },
    ]
});
