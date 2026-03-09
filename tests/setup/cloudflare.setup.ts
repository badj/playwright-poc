import { test as setup } from '@playwright/test';

/***************************************************************************************************************
 * Cloudflare warmup step
 * Saves cf_clearance cookie
 * Required to spoof Cloudflare security checks for: "Add to cart" AJAX/XHR POST that gets blocked
 * Required to spoof Cloudflare security turnstiles loaded for Cart and Checkout pages
 **************************************************************************************************************/

setup('Cloudflare Warmup', async ({ page }) => {

    console.log('🌐 Performing Cloudflare warm-up...');

    await page.goto('https://testautomation.bigcartel.com/');

    // Wait for a potential Cloudflare challenge
    try {

        await page.waitForFunction(() => {

            const title = document.title;

            return !title.includes('Just a moment')
                && !title.includes('Checking your browser')
                && !title.includes('Attention Required');

        }, { timeout: 30000 });

    } catch {

        console.warn('⚠️ Cloudflare challenge timeout — continuing');

    }

    await page.waitForTimeout(5000);

    await page.context().storageState({
        path: 'playwright/.auth/cloudflare.json'
    });

    console.log('✅ Cloudflare cookies stored');

});
