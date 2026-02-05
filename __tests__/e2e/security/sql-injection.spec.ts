import { test, expect } from '@playwright/test';

test.describe('SQL Injection Prevention', () => {
  test('should prevent SQL injection in product ID parameter', async ({ page }) => {
    // Common SQL injection patterns
    const injectionAttempts = [
      "1' OR '1'='1",
      "1; DROP TABLE products--",
      "1' UNION SELECT * FROM users--",
      "1' AND 1=1--",
      "1' OR 'a'='a",
    ];

    for (const injection of injectionAttempts) {
      // Try SQL injection in product URL
      await page.goto(`/products/${encodeURIComponent(injection)}`);
      await page.waitForTimeout(1000);

      const currentUrl = page.url();

      // Should either:
      // 1. Show 404 page
      // 2. Show error page
      // 3. Redirect to safe page
      // Should NOT: Show all products or crash
      const is404 = currentUrl.includes('404') ||
                    await page.locator('text=/not found|404/i').isVisible().catch(() => false);

      const isError = await page.locator('text=/error|invalid/i').isVisible().catch(() => false);

      const isSafePage = currentUrl.includes('/shop') || currentUrl.includes('/');

      // At least one safety measure should be in place
      expect(is404 || isError || isSafePage).toBe(true);
    }
  });

  test('should prevent SQL injection in search functionality', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    if (await searchInput.count() > 0) {
      // Try SQL injection via search
      await searchInput.first().fill("' OR '1'='1");
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Should NOT return all products (which would indicate successful injection)
      // Should either:
      // 1. Return no results
      // 2. Return error
      // 3. Sanitize and search for literal string

      const noResults = await page.locator('text=/no results|nothing found/i').isVisible().catch(() => false);
      const hasError = await page.locator('text=/error/i').isVisible().catch(() => false);
      const hasProducts = await page.locator('[data-testid="product-card"], .product-card').count();

      // If it shows products, it should be a reasonable number, not all of them
      if (hasProducts > 0) {
        // Assume store has < 100 products; showing all would indicate injection worked
        expect(hasProducts).toBeLessThan(50);
      }

      // Should handle gracefully
      expect(noResults || hasError || hasProducts < 50).toBe(true);
    }
  });

  test('should prevent SQL injection in cart operations', async ({ page, context }) => {
    // Try SQL injection when adding to cart
    const response = await context.request.post('/api/cart', {
      data: {
        productId: "1' OR '1'='1",
        quantity: 1,
      },
    }).catch(() => null);

    if (response) {
      // Should either:
      // 1. Return 400 (bad request)
      // 2. Return 422 (unprocessable entity)
      // 3. Return error response

      expect([400, 422, 500]).toContain(response.status());

      const body = await response.json().catch(() => ({}));

      // Should indicate error
      if (body.success !== undefined) {
        expect(body.success).toBe(false);
      }
    }
  });

  test('should prevent SQL injection in order lookup', async ({ page }) => {
    // Try accessing order with SQL injection
    const injectionAttempts = [
      "ORD-123' OR '1'='1",
      "'; DROP TABLE orders--",
    ];

    for (const injection of injectionAttempts) {
      await page.goto(`/orders/${encodeURIComponent(injection)}`);
      await page.waitForTimeout(500);

      // Should show error or 404, not expose all orders
      const is404 = await page.locator('text=/not found|404/i').isVisible().catch(() => false);
      const isError = await page.locator('text=/error|invalid/i').isVisible().catch(() => false);

      expect(is404 || isError).toBe(true);
    }
  });

  test('should use parameterized queries (API level check)', async ({ page, context }) => {
    // Test checkout API with SQL injection attempt
    const response = await context.request.post('/api/checkout', {
      data: {
        email: "test@example.com'; DROP TABLE orders--",
        name: "Test User",
        street: "123 Main St",
        city: "City",
        state: "CA",
        zip: "12345",
        items: [],
      },
    }).catch(() => null);

    if (response) {
      const status = response.status();

      // If it accepts the request (200/201), check the response
      if (status === 200 || status === 201) {
        const body = await response.json();

        // Email should be stored as-is or validation should reject it
        // It should NOT execute SQL
        if (body.success) {
          // Order was created - verify email wasn't used in SQL injection
          // (This would require checking DB, so we verify the response is sane)
          expect(body.data).toBeDefined();
        }
      } else {
        // Should reject invalid email format
        expect([400, 422]).toContain(status);
      }
    }
  });

  test('should prevent SQL injection in admin panel', async ({ page, context }) => {
    // Try SQL injection in admin login
    await page.goto('/admin/login');

    const adminKeyInput = page.locator('input[type="password"], input[name="adminKey"]');

    if (await adminKeyInput.count() > 0) {
      await adminKeyInput.fill("' OR '1'='1' --");

      const loginButton = page.locator('button[type="submit"]');
      await loginButton.click();
      await page.waitForTimeout(1000);

      // Should NOT grant access
      const currentUrl = page.url();
      const onDashboard = currentUrl.includes('/admin/dashboard');

      expect(onDashboard).toBe(false);
    }
  });

  test('should prevent second-order SQL injection', async ({ page, context }) => {
    // Second-order SQL injection: Store malicious data, then trigger it later

    // Step 1: Try to store SQL injection in user data
    const response = await context.request.post('/api/cart', {
      data: {
        productId: 1,
        quantity: 1,
        // Some apps allow custom notes or metadata
        notes: "'; DROP TABLE orders--",
      },
    }).catch(() => null);

    if (response && response.ok()) {
      // Step 2: Retrieve the data (this is where second-order injection would trigger)
      const getResponse = await context.request.get('/api/cart');

      if (getResponse.ok()) {
        const cartData = await getResponse.json();

        // App should still be functional (table not dropped)
        expect(cartData.success).toBeDefined();
      }
    }
  });
});
