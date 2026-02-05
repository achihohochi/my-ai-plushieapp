import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Operations', () => {
  test('should add product to cart from shop page', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.goto();

    // Add first product to cart
    await shopPage.addProductToCart(0);

    // Wait for cart sidebar to appear
    await page.waitForTimeout(1000);

    // Navigate to cart page (cart sidebar auto-opens, so go directly)
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Verify item in cart
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should persist cart after page refresh', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    // Get initial cart count
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThan(0);

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify cart still has items
    const afterRefreshCount = await cartPage.getCartItemCount();
    expect(afterRefreshCount).toBe(initialCount);
  });

  test('should update quantity in cart', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    // Update quantity
    await cartPage.updateQuantity(0, 3);

    // Refresh to verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify quantity was updated
    const quantityInput = page.locator('input[type="number"]').first();
    const value = await quantityInput.inputValue();
    expect(parseInt(value)).toBe(3);
  });

  test('should remove item from cart', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThan(0);

    // Remove first item
    await cartPage.removeItem(0);

    // Wait for removal animation/update
    await page.waitForTimeout(1000);

    // Verify item was removed
    const afterCount = await cartPage.getCartItemCount();
    expect(afterCount).toBe(initialCount - 1);
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    // Click checkout button
    await cartPage.proceedToCheckout();

    // Verify navigation to checkout page
    await expect(page).toHaveURL(/\/checkout/);
  });

  test('should continue shopping from cart', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.goto();
    await shopPage.addProductToCart(0);
    await shopPage.goToCart();

    // Click continue shopping
    await cartPage.continueShopping();

    // Verify navigation back to shop
    await expect(page).toHaveURL('/');
  });
});
