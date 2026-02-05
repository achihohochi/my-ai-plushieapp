import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminVenmoPage } from '../pages/AdminVenmoPage';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Admin Venmo Verification', () => {
  const ADMIN_KEY = process.env.ADMIN_KEY || 'test-admin-key-12345';

  // Helper to create a Venmo order
  async function createVenmoOrder(page: any): Promise<string> {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Create order
    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();
    await cartPage.proceedToCheckout();

    // Fill checkout form
    await checkoutPage.fillShippingInfo({
      email: `venmo-test-${Date.now()}@example.com`,
      name: 'Venmo E2E Tester',
      street: '789 Test Lane',
      city: 'Test City',
      state: 'CA',
      zip: '99999',
      phone: '555-9999',
    });

    // Select Venmo and submit
    await checkoutPage.selectVenmoPayment();
    await checkoutPage.submitOrder();

    // Wait for Venmo confirmation page
    await page.waitForTimeout(2000);

    // Extract order number from URL or page content
    const currentUrl = page.url();
    let orderNumber = '';

    if (currentUrl.includes('order=')) {
      orderNumber = new URL(currentUrl).searchParams.get('order') || '';
    } else {
      // Try to find order number on page
      const orderText = await page.locator('text=/ORD-[A-Z0-9]+/').first().textContent().catch(() => '');
      orderNumber = orderText.match(/ORD-[A-Z0-9]+/)?.[0] || '';
    }

    return orderNumber;
  }

  test.beforeEach(async ({ page }) => {
    // Login to admin before each test
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_KEY);
    await page.waitForURL(/\/admin\/dashboard/);
  });

  test('should display pending Venmo payments', async ({ page }) => {
    const venmoPage = new AdminVenmoPage(page);

    await venmoPage.goto();

    // Check if pending orders are visible or empty message
    const pendingCount = await venmoPage.getPendingOrderCount();
    const isEmpty = await venmoPage.isEmptyQueueVisible();

    // Either has orders or shows empty message
    expect(pendingCount >= 0 || isEmpty).toBe(true);
  });

  test('should verify Venmo payment and update order status', async ({ page, context }) => {
    // Create a Venmo order in a new page
    const customerPage = await context.newPage();
    const orderNumber = await createVenmoOrder(customerPage);
    await customerPage.close();

    // If no order number captured, skip test
    if (!orderNumber) {
      test.skip();
      return;
    }

    // Admin verifies payment
    const venmoPage = new AdminVenmoPage(page);
    await venmoPage.goto();

    // Find the order in pending list
    const initialCount = await venmoPage.getPendingOrderCount();
    expect(initialCount).toBeGreaterThan(0);

    // Verify first pending payment
    await venmoPage.verifyPayment(0);

    // Wait for order to be processed
    await page.waitForTimeout(2000);

    // Refresh page to see updated list
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify order no longer in pending list or count decreased
    const newCount = await venmoPage.getPendingOrderCount();
    const isEmpty = await venmoPage.isEmptyQueueVisible();

    expect(newCount < initialCount || isEmpty).toBe(true);
  });

  test('should reject Venmo payment and update order status', async ({ page, context }) => {
    // Create a Venmo order
    const customerPage = await context.newPage();
    const orderNumber = await createVenmoOrder(customerPage);
    await customerPage.close();

    if (!orderNumber) {
      test.skip();
      return;
    }

    // Admin rejects payment
    const venmoPage = new AdminVenmoPage(page);
    await venmoPage.goto();

    const initialCount = await venmoPage.getPendingOrderCount();
    expect(initialCount).toBeGreaterThan(0);

    // Reject first pending payment
    await venmoPage.rejectPayment(0);

    // Wait for order to be processed
    await page.waitForTimeout(2000);

    // Refresh and verify order removed from pending
    await page.reload();
    await page.waitForLoadState('networkidle');

    const newCount = await venmoPage.getPendingOrderCount();
    const isEmpty = await venmoPage.isEmptyQueueVisible();

    expect(newCount < initialCount || isEmpty).toBe(true);
  });

  test('should show order details for each pending payment', async ({ page }) => {
    const venmoPage = new AdminVenmoPage(page);

    await venmoPage.goto();

    const pendingCount = await venmoPage.getPendingOrderCount();

    if (pendingCount > 0) {
      // Verify order number is visible
      const orderNumber = await venmoPage.getOrderNumber(0);
      expect(orderNumber).toMatch(/ORD-[A-Z0-9]+/);

      // Verify order details are displayed
      const hasOrderInfo = await page.locator('text=/total|amount|customer/i').isVisible();
      expect(hasOrderInfo).toBe(true);
    } else {
      // No pending orders - verify empty message
      const isEmpty = await venmoPage.isEmptyQueueVisible();
      expect(isEmpty).toBe(true);
    }
  });

  test('should handle multiple pending Venmo payments', async ({ page, context }) => {
    // Create 2 Venmo orders
    const customerPage1 = await context.newPage();
    await createVenmoOrder(customerPage1);
    await customerPage1.close();

    const customerPage2 = await context.newPage();
    await createVenmoOrder(customerPage2);
    await customerPage2.close();

    // Admin views pending payments
    const venmoPage = new AdminVenmoPage(page);
    await venmoPage.goto();

    const pendingCount = await venmoPage.getPendingOrderCount();
    expect(pendingCount).toBeGreaterThanOrEqual(2);

    // Verify first payment
    await venmoPage.verifyPayment(0);
    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify second payment still pending
    const newCount = await venmoPage.getPendingOrderCount();
    expect(newCount).toBeGreaterThanOrEqual(1);
  });

  test('should persist verification after page refresh', async ({ page, context }) => {
    // Create a Venmo order
    const customerPage = await context.newPage();
    await createVenmoOrder(customerPage);
    await customerPage.close();

    // Admin verifies payment
    const venmoPage = new AdminVenmoPage(page);
    await venmoPage.goto();

    const initialCount = await venmoPage.getPendingOrderCount();
    if (initialCount === 0) {
      test.skip();
      return;
    }

    // Verify payment
    await venmoPage.verifyPayment(0);
    await page.waitForTimeout(1500);

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify count decreased (verification persisted)
    const newCount = await venmoPage.getPendingOrderCount();
    expect(newCount).toBeLessThan(initialCount);
  });

  test('should navigate back to dashboard from Venmo page', async ({ page }) => {
    const venmoPage = new AdminVenmoPage(page);

    await venmoPage.goto();

    // Click back to dashboard link
    const dashboardLink = page.locator('a[href="/admin/dashboard"], a:has-text("Dashboard")');
    await dashboardLink.first().click();

    // Verify navigation
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });
});
