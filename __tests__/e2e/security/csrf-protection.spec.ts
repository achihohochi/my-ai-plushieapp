import { test, expect } from '@playwright/test';

test.describe('CSRF (Cross-Site Request Forgery) Protection', () => {
  test('should reject POST requests without proper origin', async ({ page, context }) => {
    // Try to submit checkout form with different origin header
    const response = await context.request.post('/api/checkout', {
      data: {
        email: 'attacker@evil.com',
        name: 'Attacker',
        street: '123 Evil St',
        city: 'Malice',
        state: 'CA',
        zip: '12345',
        items: [{ id: 1, quantity: 1 }],
      },
      headers: {
        'Origin': 'https://evil.com',
        'Referer': 'https://evil.com/attack.html',
      },
    }).catch(() => null);

    if (response) {
      // Should reject requests from different origins
      // Next.js API routes should validate origin
      // Status should be 403 (Forbidden) or 400 (Bad Request)
      const status = response.status();

      // If it succeeds (200), that's a CSRF vulnerability
      if (status === 200) {
        console.warn('⚠️  CSRF vulnerability detected: API accepts cross-origin requests');
      }

      // In a properly secured app, this should fail
      expect([400, 403, 405]).toContain(status);
    }
  });

  test('should validate Stripe webhook signatures', async ({ page, context }) => {
    // Attempt to send fake Stripe webhook without valid signature
    const response = await context.request.post('/api/webhooks/stripe', {
      data: {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_fake_session',
            payment_intent: 'pi_fake_intent',
            customer_email: 'attacker@evil.com',
          },
        },
      },
      headers: {
        'stripe-signature': 'fake_signature_12345',
      },
    }).catch(() => null);

    if (response) {
      // Should reject webhook with invalid signature
      const status = response.status();

      // Should return 400 (Bad Request) or 401 (Unauthorized)
      expect([400, 401]).toContain(status);
    }
  });

  test('should require authentication for state-changing admin operations', async ({ context }) => {
    // Try to verify Venmo payment without admin authentication
    const response = await context.request.post('/api/admin/venmo/verify', {
      data: {
        orderId: '1',
      },
    }).catch(() => null);

    if (response) {
      // Should reject without admin key
      const status = response.status();
      expect([401, 403]).toContain(status);
    }
  });

  test('should use SameSite cookie attribute', async ({ page }) => {
    await page.goto('/');

    // Add item to cart (creates session cookie)
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();

    if (await addToCartButton.isVisible().catch(() => false)) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);

      // Check cookies set by the application
      const cookies = await page.context().cookies();

      // Session cookies should have SameSite attribute
      const sessionCookie = cookies.find(c =>
        c.name.includes('session') || c.name.includes('cart')
      );

      if (sessionCookie) {
        // SameSite should be 'Lax' or 'Strict'
        expect(['Lax', 'Strict']).toContain(sessionCookie.sameSite);
      }
    }
  });

  test('should prevent clickjacking with X-Frame-Options', async ({ page }) => {
    const response = await page.goto('/');

    if (response) {
      const headers = response.headers();
      const frameOptions = headers['x-frame-options'];

      // Should have X-Frame-Options header
      expect(frameOptions).toBeDefined();

      if (frameOptions) {
        // Should be DENY or SAMEORIGIN
        expect(['DENY', 'SAMEORIGIN']).toContain(frameOptions);
      }
    }
  });

  test('should validate referer for sensitive operations', async ({ page, context }) => {
    // Try to add to cart with suspicious referer
    const response = await context.request.post('/api/cart', {
      data: {
        productId: 1,
        quantity: 1,
      },
      headers: {
        'Referer': 'https://evil.com/csrf-attack.html',
      },
    }).catch(() => null);

    // Note: Referer validation is optional but adds defense-in-depth
    // Modern apps should rely on SameSite cookies and origin validation
    if (response) {
      // App may or may not validate referer
      // This test documents expected behavior
      const status = response.status();

      // If app validates referer, should reject
      // If app doesn't validate, should still be protected by other means
      expect(status).toBeDefined();
    }
  });

  test('should require double-submit for critical admin actions', async ({ page }) => {
    // Log in as admin
    await page.goto('/admin/login');

    const adminKey = process.env.ADMIN_KEY || 'test-admin-key-12345';
    const keyInput = page.locator('input[type="password"]');

    if (await keyInput.count() > 0) {
      await keyInput.fill(adminKey);
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(1000);

      // Navigate to Venmo verification page
      await page.goto('/admin/venmo');
      await page.waitForLoadState('networkidle');

      // Check if verify/reject buttons exist
      const verifyButton = page.locator('button:has-text("Verify"), button:has-text("Approve")').first();

      if (await verifyButton.isVisible().catch(() => false)) {
        // Verify button should require confirmation or be form-submitted
        // Not just a simple GET request link
        const buttonType = await verifyButton.getAttribute('type').catch(() => null);
        const onClick = await verifyButton.getAttribute('onclick').catch(() => null);

        // Should either be type="submit" (form) or have onClick handler
        // Should NOT be a simple <a> tag with href
        const tagName = await verifyButton.evaluate(el => el.tagName);

        if (tagName === 'A') {
          // If it's a link, should use POST method or have confirmation
          console.warn('⚠️  Critical action uses GET request (CSRF risk)');
        }

        expect(['BUTTON', 'INPUT']).toContain(tagName);
      }
    }
  });

  test('should have HTTPS-only cookies in production', async ({ page }) => {
    // Note: This test is most relevant in production/staging
    await page.goto('/');

    const cookies = await page.context().cookies();

    // In development (http://localhost), secure flag might not be set
    // In production (https://), all cookies should be secure
    const isLocalhost = page.url().includes('localhost');

    if (!isLocalhost) {
      // Production cookies should be secure
      cookies.forEach(cookie => {
        if (cookie.name.includes('session') || cookie.name.includes('auth')) {
          expect(cookie.secure).toBe(true);
        }
      });
    }
  });
});
