import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for /cart page
 * Handles cart operations (view, update, remove, checkout)
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly subtotalText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-testid="cart-item"]');
    this.emptyCartMessage = page.locator('text=/empty|no items/i');
    this.checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Checkout")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping"), a:has-text("Continue Shopping")');
    this.subtotalText = page.locator('text=/subtotal|total/i');
  }

  async goto() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async getCartItemCount(): Promise<number> {
    // Wait for page to fully load
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    // Try counting quantity inputs first
    const quantityInputs = await this.page.locator('input[type="number"]').count();
    if (quantityInputs > 0) return quantityInputs;

    // Fallback: count product images (each cart item has one)
    const images = await this.page.locator('img[alt*="Plushie" i], img[src*="plushie" i]').count();
    if (images > 0) return images;

    // Final fallback: generic cart item selectors
    return await this.page.locator('[data-testid="cart-item"], .cart-item').count();
  }

  async updateQuantity(itemIndex: number, quantity: number) {
    const quantityInput = this.page.locator('input[type="number"]').nth(itemIndex);
    await quantityInput.fill(quantity.toString());
    await quantityInput.blur();
    await this.page.waitForTimeout(500); // Wait for update
  }

  async removeItem(itemIndex: number) {
    const removeButton = this.page.locator('button:has-text("Remove"), button[aria-label*="Remove"]').nth(itemIndex);
    await removeButton.click();
    await this.page.waitForTimeout(500); // Wait for removal
  }

  async proceedToCheckout() {
    await this.checkoutButton.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async continueShopping() {
    await this.continueShoppingButton.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async isCartEmpty(): Promise<boolean> {
    // Check if empty message is visible or no cart items exist
    const emptyVisible = await this.emptyCartMessage.isVisible().catch(() => false);
    const itemCount = await this.getCartItemCount();
    return emptyVisible || itemCount === 0;
  }
}
