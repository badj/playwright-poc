import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";

/****************************************************
 * See https://playwright.dev/docs/test-configuration.
 * ****************************************************/

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
        headless: false,  // Keep this temporarily for debugging (run with --headed)
    },

    /*********************************************************************************************************************************
     * Cloudflare security check triggered for Chrome bypassed - issue has been fixed
     * Bypassing Cloudflare security check - hack as per BrowserStack article:
     * https://www.browserstack.com/guide/playwright-cloudflare with stealth evasions (including userAgentData for sec-ch-ua on POSTs)
     * TODO: Cloudflare security check bypass for Firefox - fix still being investigated/WIP!
     * *********************************************************************************************************************************/

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                locale: 'en-NZ',
                timezoneId: 'Pacific/Auckland',
                launchOptions: {
                    args: [
                        '--disable-blink-features=AutomationControlled',
                        '--no-sandbox'
                    ]
                }
            },
        },

        // Firefox disabled - add to cart test step failures since 25 February 2026
        // TODO: Cloudflare security check bypass for Firefox - fix still being investigated/WIP!

        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox'],
        //         userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0',
        //         locale: 'en-NZ',
        //         timezoneId: 'Pacific/Auckland',
        //         launchOptions: {
        //             args: [
        //                 '--no-sandbox'  // Only this; no Blink flags
        //             ],
        //             ignoreDefaultArgs: ['--headless'],
        //             firefoxUserPrefs: {  // ← Firefox-specific prefs to reduce automation fingerprints
        //                 'dom.webdriver.enabled': false,  // Disables Selenium-like webdriver flag (though Playwright doesn't use it)
        //                 'useAutomationExtension': false,  // Prevents automation extensions
        //                 'general.appname.override': 'Netscape',  // Spoofs app name (minor fingerprint tweak)
        //                 'general.appversion.override': '5.0 (Windows)',  // Matches UA
        //                 'general.platform.override': 'Win64',  // Platform spoof
        //                 'general.useragent.override': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0'  // Reinforces UA (Playwright sets it, but this ensures consistency)
        //             }
        //         }
        //     },
        // },

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
    ],
});
