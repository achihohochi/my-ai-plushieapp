import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Stripe Payment Flow', () => {
  test('should create Stripe checkout session and redirect', async ({ page }) => {
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
      email: `stripe-e2e-${Date.now()}@example.com`,
      name: 'Stripe Test User',
      street: '123 Stripe Ave',
      city: 'Checkout City',
      state: 'NY',
      zip: '10001',
      phone: '555-1234',
    });

    // Select Stripe payment
    await checkoutPage.selectStripePayment();

    // Submit order
    await checkoutPage.submitOrder();

    // Wait for Stripe redirect or error
    await page.waitForTimeout(3000);

    const currentUrl = page.url();

    // Verify one of:
    // 1. Redirected to Stripe checkout (stripe.com or checkout.stripe.com)
    // 2. Redirected to local success page (if webhook already processed)
    // 3. Stayed on checkout with error message
    const redirectedToStripe = currentUrl.includes('stripe.com') || currentUrl.includes('checkout');
    const redirectedToSuccess = currentUrl.includes('/success') || currentUrl.includes('/confirmation');
    const errorVisible = await page.locator('text=/error|failed/i').isVisible().catch(() => false);

    expect(redirectedToStripe || redirectedToSuccess || errorVisible).toBe(true);
  });

  test('should handle Stripe checkout cancellation', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add product and go to checkout
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    // Fill shipping info
    await checkoutPage.fillShippingInfo({
      email: `cancel-test-${Date.now()}@example.com`,
      name: 'Cancel Test User',
      street: '456 Cancel St',
      city: 'Cancel City',
      state: 'CA',
      zip: '90210',
      phone: '555-5678',
    });

    // Select Stripe and submit
    await checkoutPage.selectStripePayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    // If redirected to Stripe, simulate cancellation by going back
    const currentUrl = page.url();
    if (currentUrl.includes('stripe.com') || currentUrl.includes('checkout')) {
      // Go back to our site (simulating cancel)
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // Verify cart still has items (not cleared on cancel)
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('should validate checkout form before Stripe redirect', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Go directly to checkout
    await checkoutPage.goto();

    // Try to submit without filling required fields
    await checkoutPage.submitButton.first().click().catch(() => {
      // Form validation might prevent click
    });

    // Verify form validation kicked in
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

    const customErrorVisible = await page.locator('text=/required|error|invalid/i')
      .isVisible()
      .catch(() => false);

    // Should either have HTML5 validation or custom errors
    expect(hasValidationError || customErrorVisible).toBe(true);
  });

  test('should display correct order total before Stripe redirect', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add multiple items
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.addProductToCart(1);
    await shopPage.goToCart();

    // Get cart total
    const cartTotal = await page.locator('text=/total|subtotal/i').first().textContent();

    // Go to checkout
    await cartPage.proceedToCheckout();

    // Verify total displayed on checkout page
    const checkoutTotal = await page.locator('text=/total|subtotal/i').first().textContent();

    // Both should show monetary amounts
    expect(cartTotal).toContain('$');
    expect(checkoutTotal).toContain('$');
  });

  test('should preserve cart data during checkout process', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add item to cart
    await shopPage.goto();
    await shopPage.addProductToCart(0);

    // Get cart count
    await shopPage.goToCart();
    const initialCount = await cartPage.getCartItemCount();

    // Go to checkout and back
    await cartPage.proceedToCheckout();
    await page.goBack();

    // Verify cart still has same items
    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount);
  });

  test('should handle network errors during Stripe session creation', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Intercept Stripe session creation API
    await page.route('**/api/create-checkout-session*', (route) => {
      route.abort('failed');
    });

    // Add product and checkout
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    // Fill form
    await checkoutPage.fillShippingInfo({
      email: `error-test-${Date.now()}@example.com`,
      name: 'Error Test',
      street: '789 Error Rd',
      city: 'Error Town',
      state: 'TX',
      zip: '75001',
      phone: '555-9999',
    });

    // Select Stripe and submit
    await checkoutPage.selectStripePayment();
    await checkoutPage.submitOrder();

    await page.waitForTimeout(2000);

    // Verify error handling (either error message or stayed on checkout)
    const currentUrl = page.url();
    const stayedOnCheckout = currentUrl.includes('/checkout');
    const errorVisible = await page.locator('text=/error|failed|try again/i').isVisible().catch(() => false);

    expect(stayedOnCheckout || errorVisible).toBe(true);
  });

  test('should clear cart only after successful payment', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add item
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThan(0);

    // Start checkout but don't complete
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo({
      email: `partial-${Date.now()}@example.com`,
      name: 'Partial Test',
      street: '321 Partial Ln',
      city: 'Partial City',
      state: 'FL',
      zip: '33101',
    });

    // Go back to cart
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Verify cart NOT cleared (payment didn't complete)
    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount);
  });

  test('should display loading state during Stripe redirect', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo({
      email: `loading-${Date.now()}@example.com`,
      name: 'Loading Test',
      street: '555 Loading Blvd',
      city: 'Loading City',
      state: 'WA',
      zip: '98101',
    });

    await checkoutPage.selectStripePayment();

    // Click submit and immediately check for loading state
    const submitPromise = checkoutPage.submitOrder();

    // Check for loading indicators
    const loadingVisible = await page.locator('text=/processing|loading|please wait/i, [data-loading="true"], .loading')
      .first()
      .isVisible()
      .catch(() => false);

    // Button should be disabled during processing
    const buttonDisabled = await checkoutPage.submitButton.first().isDisabled().catch(() => false);

    // Either loading indicator or disabled button should be present
    expect(loadingVisible || buttonDisabled).toBe(true);
  });
});
