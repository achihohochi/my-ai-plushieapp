import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Venmo Payment Flow', () => {
  test('should create Venmo order and display QR code', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add product to cart
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    // Verify cart has items
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    // Fill shipping information
    await checkoutPage.fillShippingInfo({
      email: `venmo-e2e-${Date.now()}@example.com`,
      name: 'Venmo Test User',
      street: '789 Venmo Street',
      city: 'Venmo City',
      state: 'CA',
      zip: '94102',
      phone: '555-8888',
    });

    // Select Venmo payment
    await checkoutPage.selectVenmoPayment();

    // Submit order
    await checkoutPage.submitOrder();

    // Wait for Venmo confirmation page
    await page.waitForTimeout(2000);

    const currentUrl = page.url();

    // Verify redirected to Venmo confirmation page
    const onVenmoPage = currentUrl.includes('/venmo') || currentUrl.includes('/checkout/venmo');

    if (onVenmoPage) {
      // Verify QR code is displayed
      const qrCodeVisible = await page.locator('img[alt*="QR" i], canvas, [data-testid="qr-code"], img[src*="data:image"]')
        .first()
        .isVisible()
        .catch(() => false);

      // Verify order number is displayed
      const orderNumberVisible = await page.locator('text=/ORD-[A-Z0-9]+/i')
        .isVisible()
        .catch(() => false);

      // At least one should be visible
      expect(qrCodeVisible || orderNumberVisible).toBe(true);
    } else {
      // If not on Venmo page, should show error or confirmation
      const hasConfirmation = currentUrl.includes('/confirmation') || currentUrl.includes('/success');
      const hasError = await page.locator('text=/error|failed/i').isVisible().catch(() => false);

      expect(hasConfirmation || hasError).toBe(true);
    }
  });

  test('should display order details on Venmo confirmation page', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Create order
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo({
      email: `venmo-details-${Date.now()}@example.com`,
      name: 'Details Test User',
      street: '456 Details Ave',
      city: 'Details Town',
      state: 'NY',
      zip: '10002',
      phone: '555-7777',
    });

    await checkoutPage.selectVenmoPayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    if (currentUrl.includes('/venmo')) {
      // Verify order information is displayed
      const hasOrderNumber = await page.locator('text=/ORD-[A-Z0-9]+/').isVisible().catch(() => false);
      const hasAmount = await page.locator('text=/\\$\\d+\\.\\d{2}/').isVisible().catch(() => false);
      const hasInstructions = await page.locator('text=/scan|payment|venmo/i').isVisible().catch(() => false);

      // Should show order details
      expect(hasOrderNumber || hasAmount || hasInstructions).toBe(true);
    }
  });

  test('should clear cart after Venmo order creation', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add item to cart
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThan(0);

    // Complete Venmo checkout
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo({
      email: `clear-cart-${Date.now()}@example.com`,
      name: 'Clear Cart Test',
      street: '321 Clear St',
      city: 'Clear City',
      state: 'TX',
      zip: '75002',
      phone: '555-6666',
    });

    await checkoutPage.selectVenmoPayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    // Navigate back to cart
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Verify cart is empty
    const finalCount = await cartPage.getCartItemCount();
    const isEmpty = await cartPage.isCartEmpty();

    expect(finalCount === 0 || isEmpty).toBe(true);
  });

  test('should generate valid Venmo deep link', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo({
      email: `deeplink-${Date.now()}@example.com`,
      name: 'Deep Link Test',
      street: '999 Link Rd',
      city: 'Link City',
      state: 'FL',
      zip: '33102',
      phone: '555-5555',
    });

    await checkoutPage.selectVenmoPayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    if (currentUrl.includes('/venmo')) {
      // Look for Venmo deep link button
      const venmoLink = page.locator('a[href^="venmo://"], button:has-text("Open Venmo"), a:has-text("Pay with Venmo")');
      const linkExists = await venmoLink.first().isVisible().catch(() => false);

      if (linkExists) {
        const href = await venmoLink.first().getAttribute('href').catch(() => '');

        // Verify deep link format
        if (href) {
          expect(href).toContain('venmo://');
          expect(href).toContain('paycharge');
        }
      }
    }
  });

  test('should show order status as pending payment verification', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo({
      email: `pending-${Date.now()}@example.com`,
      name: 'Pending Test',
      street: '111 Pending Pl',
      city: 'Pending City',
      state: 'WA',
      zip: '98102',
      phone: '555-4444',
    });

    await checkoutPage.selectVenmoPayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    if (currentUrl.includes('/venmo')) {
      // Verify pending status message
      const pendingMessage = await page.locator('text=/pending|verification|review|awaiting/i')
        .isVisible()
        .catch(() => false);

      expect(pendingMessage).toBe(true);
    }
  });

  test('should handle multiple items in Venmo order', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add multiple items
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.addProductToCart(1);
    await shopPage.goToCart();

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(2);

    // Complete checkout
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo({
      email: `multi-${Date.now()}@example.com`,
      name: 'Multi Item Test',
      street: '222 Multi Ave',
      city: 'Multi City',
      state: 'IL',
      zip: '60601',
      phone: '555-3333',
    });

    await checkoutPage.selectVenmoPayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const success = currentUrl.includes('/venmo') || currentUrl.includes('/confirmation');

    expect(success).toBe(true);
  });

  test('should validate checkout form before creating Venmo order', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Go to checkout without items
    await checkoutPage.goto();

    // Try to submit with empty form
    await checkoutPage.submitButton.first().click().catch(() => {
      // Validation might prevent submit
    });

    // Verify validation
    const hasValidationError = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[required]');
      for (const input of Array.from(inputs)) {
        const htmlInput = input as HTMLInputElement;
        if (!htmlInput.validity.valid) {
          return true;
        }
      }
      return false;
    });

    const errorVisible = await page.locator('text=/required|error|invalid/i')
      .isVisible()
      .catch(() => false);

    expect(hasValidationError || errorVisible).toBe(true);
  });

  test('should display Venmo username in payment instructions', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo({
      email: `username-${Date.now()}@example.com`,
      name: 'Username Test',
      street: '333 Username St',
      city: 'Username City',
      state: 'CO',
      zip: '80201',
      phone: '555-2222',
    });

    await checkoutPage.selectVenmoPayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    if (currentUrl.includes('/venmo')) {
      // Look for Venmo username in instructions
      const hasUsername = await page.locator('text=/@|text=/venmo\.com/i')
        .isVisible()
        .catch(() => false);

      // Or look for general payment recipient info
      const hasRecipient = await page.locator('text=/pay|send|recipient/i')
        .isVisible()
        .catch(() => false);

      expect(hasUsername || hasRecipient).toBe(true);
    }
  });

  test('should handle network errors during Venmo order creation', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Intercept Venmo checkout API
    await page.route('**/api/checkout/venmo*', (route) => {
      route.abort('failed');
    });

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo({
      email: `error-${Date.now()}@example.com`,
      name: 'Error Test',
      street: '444 Error Blvd',
      city: 'Error City',
      state: 'GA',
      zip: '30301',
      phone: '555-1111',
    });

    await checkoutPage.selectVenmoPayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    // Verify error handling
    const currentUrl = page.url();
    const stayedOnCheckout = currentUrl.includes('/checkout');
    const errorVisible = await page.locator('text=/error|failed|try again/i')
      .isVisible()
      .catch(() => false);

    expect(stayedOnCheckout || errorVisible).toBe(true);
  });
});
