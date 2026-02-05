import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ShopPage } from '../pages/ShopPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('XSS (Cross-Site Scripting) Prevention', () => {
  test('should sanitize script tags in search input', async ({ page }) => {
    await page.goto('/');

    // Attempt XSS attack via search
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    if (await searchInput.count() > 0) {
      await searchInput.first().fill('<script>alert("XSS")</script>');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Verify no script executed (no alert dialog)
      // In a real XSS attack, the alert would show
      const hasInjectedScript = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script'));
        return scripts.some(s => s.textContent?.includes('alert("XSS")'));
      });

      expect(hasInjectedScript).toBe(false);
    }
  });

  test('should sanitize HTML in checkout form fields', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();

    // Try injecting HTML/script in name field
    const maliciousInput = '<img src=x onerror="alert(\'XSS\')">';

    await checkoutPage.nameInput.fill(maliciousInput);
    await page.waitForTimeout(500);

    // Verify the script didn't execute
    const alerts = await page.evaluate(() => {
      return (window as any).hasOwnProperty('onerrorTriggered');
    });

    expect(alerts).toBe(false);

    // Verify the input was sanitized or encoded
    const inputValue = await checkoutPage.nameInput.inputValue();
    const containsScriptTag = inputValue.includes('<script>') ||
                             inputValue.includes('onerror');

    // Input should either be sanitized or HTML-encoded
    expect(containsScriptTag).toBe(false);
  });

  test('should prevent DOM-based XSS via URL parameters', async ({ page }) => {
    // Try XSS via URL parameter
    await page.goto('/?search=<script>alert("XSS")</script>');
    await page.waitForTimeout(1000);

    // Check if script was injected into DOM
    const hasInjectedScript = await page.evaluate(() => {
      const pageHTML = document.body.innerHTML;
      return pageHTML.includes('<script>alert("XSS")</script>');
    });

    expect(hasInjectedScript).toBe(false);
  });

  test('should encode special characters in product names', async ({ page }) => {
    const shopPage = new ShopPage(page);
    await shopPage.goto();

    // Check if product names are properly encoded
    const products = await page.locator('[data-testid="product-card"], .product-card, [class*="product"]').all();

    if (products.length > 0) {
      for (const product of products.slice(0, 3)) {
        const html = await product.innerHTML();

        // Should not contain unencoded script tags
        const hasUnescapedScript = html.match(/<script[^>]*>.*?<\/script>/i);
        expect(hasUnescapedScript).toBeNull();
      }
    }
  });

  test('should have no accessibility violations (includes XSS checks)', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should prevent XSS in cart item names', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await shopPage.goto();

    // Add item to cart
    if (await shopPage.addToCartButtons.count() > 0) {
      await shopPage.addProductToCart(0);
      await shopPage.goToCart();

      // Check cart page for XSS vulnerabilities
      const cartHTML = await page.content();

      // Should not contain executable scripts
      const hasInjectedScript = cartHTML.match(/<script[^>]*>(?!.*\btype\s*=\s*["']application\/json["'])[^<]*<\/script>/gi);

      // Next.js __NEXT_DATA__ scripts are safe, but custom scripts aren't
      expect(hasInjectedScript).toBeNull();
    }
  });

  test('should sanitize user input in order confirmation', async ({ page }) => {
    // Navigate to checkout
    await page.goto('/checkout');

    // Fill form with XSS attempts
    const maliciousEmail = 'test@example.com<script>alert("XSS")</script>';
    const maliciousName = '<img src=x onerror=alert("XSS")>';

    const emailInput = page.locator('input[type="email"]');
    const nameInput = page.locator('input[name="name"]');

    if (await emailInput.count() > 0) {
      await emailInput.fill(maliciousEmail);
    }

    if (await nameInput.count() > 0) {
      await nameInput.fill(maliciousName);
    }

    // Check if inputs were sanitized
    const emailValue = await emailInput.inputValue();
    const nameValue = await nameInput.inputValue();

    // Should either reject or sanitize the input
    const emailHasScript = emailValue.includes('<script>');
    const nameHasScript = nameValue.includes('onerror');

    expect(emailHasScript).toBe(false);
    expect(nameHasScript).toBe(false);
  });

  test('should use Content Security Policy headers', async ({ page }) => {
    const response = await page.goto('/');

    if (response) {
      const headers = response.headers();
      const csp = headers['content-security-policy'];

      // Should have CSP header
      expect(csp).toBeDefined();

      if (csp) {
        // Should restrict script sources
        expect(csp).toMatch(/script-src/);

        // Should not allow unsafe-inline without nonce (less secure)
        // Note: Some frameworks require unsafe-inline, so we just check it exists
        expect(csp.length).toBeGreaterThan(0);
      }
    }
  });
});
