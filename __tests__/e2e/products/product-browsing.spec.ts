import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';

test.describe('Product Browsing', () => {
  test('should display products on shop page', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await shopPage.goto();

    // Verify page loaded
    await expect(page).toHaveURL('/');

    // Verify products are displayed
    const productCount = await shopPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should navigate to product detail page', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await shopPage.goto();

    // Click first product
    await shopPage.clickProduct(0);

    // Verify navigation to product detail page
    await expect(page).toHaveURL(/\/products\/\d+/);

    // Verify product details are visible
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should show product images', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await shopPage.goto();

    // Wait for images to load
    const images = page.locator('img[alt*="plushie" i], img[src*="/plushies/"]');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Verify first image is loaded
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();

      // Check if image loaded successfully (has natural dimensions)
      const hasNaturalDimensions = await firstImage.evaluate((img: any) => {
        return img.naturalWidth > 0 && img.naturalHeight > 0;
      });

      expect(hasNaturalDimensions).toBe(true);
    }
  });

  test('should navigate back to shop from product page', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await shopPage.goto();
    await shopPage.clickProduct(0);

    // Verify we're on product page
    await expect(page).toHaveURL(/\/products\/\d+/);

    // Go back
    await page.goBack();

    // Verify we're back on shop page
    await expect(page).toHaveURL('/');
  });
});
