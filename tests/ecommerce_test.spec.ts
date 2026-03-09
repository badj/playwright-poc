import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

function randomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function humanFill(page: any, locator: any, text: string) {
    await locator.click({ force: true });
    await locator.clear({ force: true });
    for (const char of text) {
        await page.keyboard.type(char);
        await page.waitForTimeout(randomDelay(40, 150));
    }
}

async function isCloudflareChallenge(page: any): Promise<boolean> {
    try {
        const title = await page.title();
        if (title.includes('Just a moment')
            || title.includes('Attention Required')
            || title.includes('Checking your browser')
        ) {
            return true;
        }

        const hasTurnstile = await page
            .locator('iframe[src*="challenges.cloudflare.com"]')
            .isVisible()
            .catch(() => false);

        return hasTurnstile;
    }
    catch {
        return false;
    }
}

async function waitForCloudflareChallenge(page: any, timeoutMs = 30000) {
    if (!(await isCloudflareChallenge(page))) return;
    console.log('⏳ Cloudflare challenge detected...');
    try {
        await page.waitForFunction(() => {
            const title = document.title;
            return !title.includes('Just a moment')
                && !title.includes('Attention Required');
            },
            { timeout: timeoutMs });

        await page.waitForTimeout(randomDelay(1500, 3000));
        console.log('✅ Cloudflare challenge resolved');
    }
    catch {
        console.warn('⚠️ Cloudflare challenge timeout');
    }
}

test.describe('E-commerce Store Automation (Cloudflare-bypassed)', () => {

    test.beforeEach(async ({ page }) => {

        /***************************************************************************************************************
         * Firefox stealth patch
         * Required to spoof Cloudflare security checks for: "Add to cart" AJAX/XHR POST that gets blocked
         * Required to spoof Cloudflare security turnstiles loaded for Cart and Checkout pages
         **************************************************************************************************************/


        await page.addInitScript(() => {

            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });

            Object.defineProperty(navigator, 'platform', {
                get: () => 'Win32'
            });

            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-NZ', 'en']
            });

        });

        await page.setExtraHTTPHeaders({
            'Cache-Control': 'no-cache',
            'Accept-Language': 'en-NZ,en;q=0.9'
        });

        await page.goto('/');
        await waitForCloudflareChallenge(page);
    });

    test('Search for item → View item → Select options → Add to cart → Verify cart → Proceed to checkout', async ({ page }) => {

        const productName = 'Light Spotted Tabby Cat';
        const colourOption = 'Colour: Grey';
        const ageOption = 'Age: 5YRS';
        const itemPriceWithoutCurrency = '$300.00';
        const quantity = '2';
        const cartTotalPriceWithoutCurrency = '$600.00';
        const productLink = page.getByRole('link', { name: productName });
        const productColourSelected = page.getByRole('combobox', { name: 'Select Colours' }).getByText(colourOption);
        const productAgeSelected = page.getByRole('combobox', { name: 'Select Age' }).getByText(ageOption);
        const quantityInput = page.getByRole('spinbutton', { name: 'QTY' });
        const resetSelection = page.getByRole('button', { name: 'RESET SELECTION' });
        const addToCartButton = page.getByRole('button', { name: 'ADD TO CART' });
        const goToCartButton = page.getByRole('link', { name: 'GO TO CART' });
        const cartPageHeading = page.getByRole('heading', { name: 'CART' });
        const cartLineItemDetailsName = page.locator('.cart-item-details-name');
        const cartLineItemDetailsOptions = page.locator('.cart-item-details-option');
        const cartLineItemUnitPrice = page.locator('.cart-item-details-unit-price-inline');
        const cartLineItemQuantity = page.getByRole('textbox', { name: 'Quantity' });
        const cartLineItemTotalPrice = page.locator('.cart-item-details-price');
        const cartLineItemProductLink = page.getByRole('link', { name: 'View Light Spotted Tabby Cat' });
        const cartContinueShoppingLink = page.getByRole('link', { name: 'Continue shopping' });
        const cartSubtotalLabel = page.locator('.cart-subtotal-label');
        const subtotalAmount = page.locator('.cart-subtotal-amount');
        const checkoutButton = page.getByRole('button', { name: 'Checkout' });
        const checkoutPaymentsNotConfigured = page.getByRole('heading');
        await page.getByRole('textbox', { name: 'SEARCH PRODUCTS' }).click();

        // Test Case 1: Search for an item and view product
        // Locate search button/icon and click to open search
        // Fill search input and submit
        await humanFill(
            page,
            page.getByRole('textbox', { name: 'SEARCH PRODUCTS' }),
            'Tabby'
        );
        await page.keyboard.press('Enter');

        // Wait for search results and click the first product
        await page.waitForLoadState('networkidle');
        await expect(productLink).toBeVisible();
        await productLink.click();

        // Test Case 2: Select product options
        // Verify we're on the product page
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('https://testautomation.bigcartel.com/product/white-tabby-cat');

        // Select the color option 'Grey'
        await page
            .getByRole('combobox', { name: 'Select Colours' })
            .selectOption(colourOption);
        await productColourSelected.isVisible();

        // Select age option '5YRS'
        await page
            .getByRole('combobox', { name: 'Select Age' })
            .selectOption(ageOption);
        await productAgeSelected.isVisible();

        // Update quantity to 2 items
        await quantityInput.waitFor({ state: 'visible' });
        await humanFill(page, quantityInput, quantity);
        await expect(quantityInput).toHaveValue(quantity);

        // Option to reset selection is available
        await expect(resetSelection).toBeVisible();
        await expect(resetSelection).toBeEnabled();

        // Test Case 3: Add to cart and verify cart details
        // Add item to cart

        await expect(addToCartButton).toBeVisible();
        await expect(addToCartButton).toBeEnabled();
        await expect(addToCartButton).toContainText(cartTotalPriceWithoutCurrency);

        /***************************************************************************************************************
         * Important delay for Firefox CF detection
         * Required to spoof Cloudflare security checks for: "Add to cart" AJAX/XHR POST that gets blocked
         * Required to spoof Cloudflare security turnstiles loaded for Cart and Checkout pages
         **************************************************************************************************************/

        await page.waitForTimeout(1500);

        const responsePromise = page.waitForResponse(r =>
            r.url().includes('/cart.js')
        );

        await addToCartButton.click();

        const response = await responsePromise;

        // Cloudflare sometimes returns 304 for cached cart responses!
        expect([200, 304]).toContain(response.status());
        await page.waitForLoadState('networkidle');

        // Navigate to cart
        await expect(goToCartButton).toBeVisible();
        await expect(goToCartButton).toBeEnabled();
        await goToCartButton.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/cart/);
        await expect(cartPageHeading).toBeVisible();

        // Verify cart details
        // Verify line item details: product image link, product name, colour option, age option, item price, quantity and cart total price

        await expect(cartLineItemDetailsName).toHaveText(productName);
        await expect(cartLineItemDetailsOptions).toHaveText('Colour: Grey / Age: 5YRS');
        await expect(cartLineItemUnitPrice).toHaveText(itemPriceWithoutCurrency);
        await expect(cartLineItemQuantity).toHaveValue(quantity);
        await expect(cartLineItemTotalPrice).toHaveText(cartTotalPriceWithoutCurrency);
        await expect(cartLineItemProductLink).toBeVisible();

        // Verify subtotal line details: link back to shopping available with the correct subtotal amount
        // Assert the "Continue shopping" link exists
        await expect(cartContinueShoppingLink).toBeVisible();

        // Assert the cart subtotal is correct
        await expect(cartSubtotalLabel).toHaveText('Subtotal');
        await expect(subtotalAmount).toHaveText(cartTotalPriceWithoutCurrency);

        // Test Case 4: Proceed to check out
        await expect(checkoutButton).toBeVisible();
        await expect(checkoutButton).toBeEnabled();
        await checkoutButton.click();

        // Checkout page loads with information that payments are not set up
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/checkout/);
        await expect(page).toHaveTitle('Payment Gateway Required (402)');
        await expect(checkoutPaymentsNotConfigured).toHaveText('We’re not set up to take payments.');
    });
});
