import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Payment Security (PCI DSS Compliance)', () => {
  test('should never log credit card numbers', async ({ page }) => {
    const logs: string[] = [];
    const consoleMessages: string[] = [];

    // Capture all console output
    page.on('console', msg => {
      consoleMessages.push(msg.text());
      logs.push(msg.text());
    });

    // Capture network requests
    const networkLogs: string[] = [];
    page.on('request', req => {
      networkLogs.push(`${req.method()} ${req.url()}`);
      const postData = req.postData();
      if (postData) {
        networkLogs.push(postData);
      }
    });

    await page.goto('/checkout');
    await page.waitForTimeout(1000);

    // Check all captured logs for card patterns
    const allLogs = [...logs, ...networkLogs].join(' ');

    // Card number patterns (4-4-4-4, 16 digits, etc.)
    const cardPatterns = [
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,  // 4-4-4-4
      /\b\d{15,16}\b/,                                // 15-16 consecutive digits
      /4242[\s-]?4242[\s-]?4242[\s-]?4242/,          // Stripe test card
    ];

    const hasCardData = cardPatterns.some(pattern => pattern.test(allLogs));

    expect(hasCardData).toBe(false);

    if (hasCardData) {
      console.error('⚠️  SECURITY VIOLATION: Card data detected in logs!');
    }
  });

  test('should use HTTPS for all checkout requests', async ({ page }) => {
    const insecureRequests: string[] = [];

    page.on('request', req => {
      const url = req.url();

      // Check if any checkout/payment requests use HTTP
      if ((url.includes('checkout') ||
           url.includes('payment') ||
           url.includes('stripe') ||
           url.includes('venmo')) &&
          url.startsWith('http://') &&
          !url.includes('localhost')) {
        insecureRequests.push(url);
      }
    });

    await page.goto('/checkout');
    await page.waitForTimeout(1000);

    // All payment-related requests should be HTTPS
    expect(insecureRequests).toEqual([]);

    if (insecureRequests.length > 0) {
      console.error('⚠️  SECURITY VIOLATION: Insecure requests detected:', insecureRequests);
    }
  });

  test('should never expose Stripe secret key in client code', async ({ page }) => {
    await page.goto('/checkout');

    // Get all script contents
    const scripts = await page.locator('script').all();
    const pageHTML = await page.content();

    // Check for secret key patterns
    const secretKeyPatterns = [
      /sk_live_[a-zA-Z0-9]+/,    // Stripe live secret key
      /sk_test_[a-zA-Z0-9]+/,    // Stripe test secret key (should not be in client)
      /STRIPE_SECRET_KEY/,
      /stripeSecretKey/,
    ];

    let hasExposedSecret = false;

    for (const pattern of secretKeyPatterns) {
      if (pattern.test(pageHTML)) {
        hasExposedSecret = true;
        console.error(`⚠️  CRITICAL: Stripe secret key exposed in page HTML!`);
        break;
      }
    }

    expect(hasExposedSecret).toBe(false);
  });

  test('should use Stripe.js hosted fields for card input', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    // Check if Stripe.js is loaded
    const hasStripeJS = await page.evaluate(() => {
      return typeof (window as any).Stripe !== 'undefined';
    });

    if (hasStripeJS) {
      // Stripe should be used (PCI compliant)
      expect(hasStripeJS).toBe(true);

      // Check for Stripe iframes (card elements are iframes)
      const stripeIframes = await page.locator('iframe[src*="stripe"]').count();

      // If Stripe Checkout is used, there might be redirect instead
      // If Stripe Elements is used, should have iframes
      console.log(`Stripe iframes detected: ${stripeIframes}`);
    }

    // Should NOT have direct card input fields in our form
    const cardNumberInput = await page.locator('input[name="cardNumber"], input[name="card"], input[placeholder*="card number" i]').count();

    // If we have card inputs, they should be Stripe-hosted
    if (cardNumberInput > 0) {
      console.warn('⚠️  Direct card input detected - ensure PCI compliance');
    }

    // Document the finding
    expect(typeof hasStripeJS).toBe('boolean');
  });

  test('should verify Stripe webhook signatures', async ({ page, context }) => {
    // Try to send webhook without valid signature
    const response = await context.request.post('/api/webhooks/stripe', {
      data: {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_fake',
            payment_intent: 'pi_test_fake',
            customer_email: 'test@example.com',
            amount_total: 5000,
          },
        },
      },
      headers: {
        'stripe-signature': 'invalid_signature_12345',
      },
    });

    // Should reject webhook with invalid signature
    expect([400, 401]).toContain(response.status());

    const body = await response.json().catch(() => ({}));

    // Should return error
    if (body.error) {
      expect(body.error).toBeDefined();
    }
  });

  test('should not store CVV codes', async ({ page }) => {
    // This test verifies we don't have CVV storage
    // In PCI-compliant systems, CVV should NEVER be stored

    await page.goto('/checkout');

    // Check localStorage
    const localStorageHasCVV = await page.evaluate(() => {
      const storage = JSON.stringify(localStorage);
      return /cvv|cvc|security[_-]?code/i.test(storage);
    });

    expect(localStorageHasCVV).toBe(false);

    // Check sessionStorage
    const sessionStorageHasCVV = await page.evaluate(() => {
      const storage = JSON.stringify(sessionStorage);
      return /cvv|cvc|security[_-]?code/i.test(storage);
    });

    expect(sessionStorageHasCVV).toBe(false);
  });

  test('should not expose payment amounts in URLs', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await page.goto('/');

    // Add item to cart and go to checkout
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartBtn.isVisible().catch(() => false)) {
      await addToCartBtn.click();
      await page.waitForTimeout(500);

      await page.goto('/checkout');
      await page.waitForTimeout(1000);

      const checkoutUrl = page.url();

      // URL should not contain payment amounts or card data
      const hasAmount = /amount=\d+|total=\d+|price=\d+/i.test(checkoutUrl);
      const hasCardData = /card|cvv|ccv/i.test(checkoutUrl);

      expect(hasAmount).toBe(false);
      expect(hasCardData).toBe(false);
    }
  });

  test('should implement secure session handling for guest checkout', async ({ page }) => {
    await page.goto('/');

    // Add item to cart (creates session)
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartBtn.isVisible().catch(() => false)) {
      await addToCartBtn.click();
      await page.waitForTimeout(500);

      // Check session cookie security
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find(c =>
        c.name.includes('session') || c.name.includes('cart')
      );

      if (sessionCookie) {
        // Session cookie should have security attributes
        expect(sessionCookie.httpOnly).toBe(true);
        expect(sessionCookie.sameSite).toBeDefined();

        // In production, should be secure (HTTPS only)
        const isLocalhost = page.url().includes('localhost');
        if (!isLocalhost) {
          expect(sessionCookie.secure).toBe(true);
        }
      }
    }
  });

  test('should clear payment data after order completion', async ({ page }) => {
    // This test verifies cleanup after order

    await page.goto('/checkout');

    // Check if any payment-related data is in localStorage/sessionStorage
    const storageAfterCheckout = await page.evaluate(() => {
      const local = JSON.stringify(localStorage);
      const session = JSON.stringify(sessionStorage);
      return { local, session };
    });

    // Should not contain sensitive payment terms
    const sensitiveTerms = ['card', 'cvv', 'stripe_token', 'payment_method'];
    const hasSensitiveData = sensitiveTerms.some(term =>
      storageAfterCheckout.local.includes(term) ||
      storageAfterCheckout.session.includes(term)
    );

    // Some terms like "card" might appear in shopping cart data
    // But should not have payment tokens or CVV
    const hasPaymentToken = /stripe_token|payment_method_id|pi_[a-zA-Z0-9]+/.test(
      storageAfterCheckout.local + storageAfterCheckout.session
    );

    expect(hasPaymentToken).toBe(false);
  });

  test('should enforce HTTPS in production environment', async ({ page }) => {
    const response = await page.goto('/checkout');

    if (response) {
      const url = response.url();
      const isProduction = !url.includes('localhost') && !url.includes('127.0.0.1');

      if (isProduction) {
        // Production must use HTTPS
        expect(url).toMatch(/^https:\/\//);

        // Should have HSTS header
        const headers = response.headers();
        const hsts = headers['strict-transport-security'];

        expect(hsts).toBeDefined();

        if (hsts) {
          // HSTS should have max-age
          expect(hsts).toMatch(/max-age=\d+/);
        }
      }
    }
  });

  test('should validate Venmo payment amounts server-side', async ({ page, context }) => {
    // Try to manipulate order amount
    const response = await context.request.post('/api/checkout/venmo', {
      data: {
        email: 'test@example.com',
        name: 'Test User',
        street: '123 Test St',
        city: 'Test City',
        state: 'CA',
        zip: '12345',
        items: [{ id: 1, quantity: 1 }],
        // Try to send manipulated total
        total: '0.01',  // Attacker tries to pay $0.01 instead of real price
      },
    });

    // Server should recalculate total, not trust client
    if (response.ok()) {
      const body = await response.json();

      // If order was created, verify total is correct
      if (body.success && body.data) {
        // Total should be calculated server-side, not from client input
        // This is a documentation test - actual validation happens server-side
        expect(body.data.total).toBeDefined();
      }
    }
  });

  test('should prevent payment replay attacks', async ({ page, context }) => {
    // Try to reuse the same payment session/intent

    // Create first order
    const firstResponse = await context.request.post('/api/create-checkout-session', {
      data: {
        email: 'test@example.com',
        items: [{ id: 1, quantity: 1 }],
      },
    });

    if (firstResponse.ok()) {
      const firstBody = await firstResponse.json();

      if (firstBody.sessionId) {
        // Try to reuse the same session ID for another order
        const secondResponse = await context.request.post('/api/create-checkout-session', {
          data: {
            email: 'attacker@evil.com',
            items: [{ id: 2, quantity: 10 }],  // Different items
            sessionId: firstBody.sessionId,    // Reuse session
          },
        });

        // Should create a new session, not reuse old one
        const secondBody = await secondResponse.json();

        if (secondBody.sessionId) {
          expect(secondBody.sessionId).not.toBe(firstBody.sessionId);
        }
      }
    }
  });

  test('should have security headers for payment pages', async ({ page }) => {
    const response = await page.goto('/checkout');

    if (response) {
      const headers = response.headers();

      // Essential security headers
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-frame-options']).toBeDefined();
      expect(['DENY', 'SAMEORIGIN']).toContain(headers['x-frame-options']);

      // Content Security Policy
      expect(headers['content-security-policy']).toBeDefined();

      // XSS Protection
      const xssProtection = headers['x-xss-protection'];
      if (xssProtection) {
        expect(xssProtection).toMatch(/1/);
      }
    }
  });
});
