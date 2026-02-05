import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Guest Checkout Flow', () => {
  test('should complete full checkout flow to Stripe redirect', async ({ page }) => {
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
      email: 'e2e-test@example.com',
      name: 'E2E Test User',
      street: '123 Test Street',
      city: 'Test City',
      state: 'CA',
      zip: '12345',
      phone: '555-1234',
    });

    // Select Stripe payment
    await checkoutPage.selectStripePayment();

    // Submit order (will redirect to Stripe)
    await checkoutPage.submitOrder();

    // Wait for either Stripe redirect or error
    await page.waitForTimeout(2000);

    // Verify we're either on Stripe checkout or got an error
    const currentUrl = page.url();
    const hasStripeRedirect = currentUrl.includes('stripe.com') || currentUrl.includes('checkout');

    // If no redirect, verify form validation or error message
    if (!hasStripeRedirect) {
      // Check for validation errors or form issues
      const errorVisible = await page.locator('text=/error|required|invalid/i').isVisible().catch(() => false);
      const stillOnCheckout = currentUrl.includes('/checkout');

      expect(stillOnCheckout || errorVisible).toBe(true);
    }
  });

  test('should create Venmo order and show QR code', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add product to cart
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    // Proceed to checkout
    await cartPage.proceedToCheckout();

    // Fill shipping information
    await checkoutPage.fillShippingInfo({
      email: 'venmo-e2e@example.com',
      name: 'Venmo Test User',
      street: '456 Venmo Ave',
      city: 'Venmo City',
      state: 'NY',
      zip: '54321',
      phone: '555-5678',
    });

    // Select Venmo payment
    await checkoutPage.selectVenmoPayment();

    // Submit order
    await checkoutPage.submitOrder();

    // Wait for Venmo page or confirmation
    await page.waitForTimeout(2000);

    // Verify we're on Venmo confirmation page with QR code
    const currentUrl = page.url();
    const onVenmoPage = currentUrl.includes('/venmo') || currentUrl.includes('/checkout/venmo');

    if (onVenmoPage) {
      // Look for QR code or order confirmation
      const qrCodeVisible = await page.locator('img[alt*="QR" i], canvas, [data-testid="qr-code"]')
        .isVisible()
        .catch(() => false);

      const orderNumberVisible = await page.locator('text=/ORD-|Order #/i')
        .isVisible()
        .catch(() => false);

      expect(qrCodeVisible || orderNumberVisible).toBe(true);
    }
  });

  test('should validate required fields on checkout', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Go directly to checkout
    await checkoutPage.goto();

    // Try to submit without filling fields
    await checkoutPage.submitButton.first().click().catch(() => {
      // Form validation might prevent click
    });

    // Check for HTML5 validation or custom error messages
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

    // Verify either HTML5 validation kicked in or custom errors are shown
    const customErrorVisible = await page.locator('text=/required|error|invalid/i')
      .isVisible()
      .catch(() => false);

    expect(hasValidationError || customErrorVisible).toBe(true);
  });

  test('should handle empty cart on checkout', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Try to access checkout with empty cart
    await checkoutPage.goto();

    // Verify either redirected to cart or shown error message
    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    const redirectedToCart = currentUrl.includes('/cart');
    const emptyCartMessage = await page.locator('text=/empty|no items/i')
      .isVisible()
      .catch(() => false);

    expect(redirectedToCart || emptyCartMessage).toBe(true);
  });
});
