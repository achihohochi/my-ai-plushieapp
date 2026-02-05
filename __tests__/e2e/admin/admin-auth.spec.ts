import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

test.describe('Admin Authentication', () => {
  const VALID_ADMIN_KEY = process.env.ADMIN_KEY || 'test-admin-key-12345';
  const INVALID_ADMIN_KEY = 'wrong-key-123';

  test('should login successfully with valid admin key', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboardPage = new AdminDashboardPage(page);

    await loginPage.goto();

    // Login with valid key
    await loginPage.login(VALID_ADMIN_KEY);

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Verify dashboard loads
    const isOnDashboard = await dashboardPage.isOnDashboard();
    expect(isOnDashboard).toBe(true);
  });

  test('should reject login with invalid admin key', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await loginPage.goto();

    // Try login with invalid key
    await loginPage.loginAndExpectError(INVALID_ADMIN_KEY);

    // Verify error message or still on login page
    const isOnLoginPage = await loginPage.isOnLoginPage();
    const hasError = await loginPage.isErrorVisible();

    expect(isOnLoginPage || hasError).toBe(true);
  });

  test('should reject login with empty admin key', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await loginPage.goto();

    // Try login with empty key
    await loginPage.loginAndExpectError('');

    // Verify still on login page or error shown
    const isOnLoginPage = await loginPage.isOnLoginPage();
    expect(isOnLoginPage).toBe(true);
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/admin/dashboard');

    // Wait for redirect
    await page.waitForTimeout(1000);

    // Verify redirected to login
    const currentUrl = page.url();
    const redirectedToLogin = currentUrl.includes('/admin/login') || currentUrl.includes('/login');

    expect(redirectedToLogin).toBe(true);
  });

  test('should redirect to login when accessing orders without auth', async ({ page }) => {
    // Try to access orders page without logging in
    await page.goto('/admin/orders');

    // Wait for redirect
    await page.waitForTimeout(1000);

    // Verify redirected to login or blocked
    const currentUrl = page.url();
    const redirectedOrBlocked = currentUrl.includes('/login') || currentUrl.includes('/admin/login');

    expect(redirectedOrBlocked).toBe(true);
  });

  test('should redirect to login when accessing products without auth', async ({ page }) => {
    // Try to access products page without logging in
    await page.goto('/admin/products');

    // Wait for redirect
    await page.waitForTimeout(1000);

    // Verify redirected to login
    const currentUrl = page.url();
    const redirectedToLogin = currentUrl.includes('/login') || currentUrl.includes('/admin/login');

    expect(redirectedToLogin).toBe(true);
  });

  test('should redirect to login when accessing venmo without auth', async ({ page }) => {
    // Try to access Venmo verification page without logging in
    await page.goto('/admin/venmo');

    // Wait for redirect
    await page.waitForTimeout(1000);

    // Verify redirected to login
    const currentUrl = page.url();
    const redirectedToLogin = currentUrl.includes('/login') || currentUrl.includes('/admin/login');

    expect(redirectedToLogin).toBe(true);
  });

  test('should persist admin session after page refresh', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(VALID_ADMIN_KEY);
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify still authenticated (not redirected to login)
    const currentUrl = page.url();
    const stillOnDashboard = currentUrl.includes('/admin/dashboard');
    const notOnLogin = !currentUrl.includes('/login');

    expect(stillOnDashboard && notOnLogin).toBe(true);
  });

  test('should allow navigation between admin pages when authenticated', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboardPage = new AdminDashboardPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(VALID_ADMIN_KEY);
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Navigate to orders
    await dashboardPage.goToOrders();
    await expect(page).toHaveURL(/\/admin\/orders/);

    // Navigate to products
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/\/admin\/products/);

    // Navigate to venmo
    await page.goto('/admin/venmo');
    await expect(page).toHaveURL(/\/admin\/venmo/);
  });
});
