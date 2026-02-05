import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for /shop page
 * Handles product listing and navigation
 */
export class ShopPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly addToCartButtons: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('[data-testid="product-card"]');
    this.addToCartButtons = page.locator('button:has-text("Add")');
    this.cartIcon = page.locator('[data-testid="cart-icon"], a[href="/cart"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async getProductCount(): Promise<number> {
    // Wait for products to load
    await this.page.waitForSelector('[data-testid="product-card"], .product-card, [class*="grid"]', {
      timeout: 5000,
    }).catch(() => null);

    return await this.addToCartButtons.count();
  }

  async addProductToCart(index: number = 0) {
    const button = this.addToCartButtons.nth(index);
    await button.waitFor({ state: 'visible', timeout: 5000 });
    await button.click();

    // Wait for cart update
    await this.page.waitForTimeout(500);
  }

  async clickProduct(index: number = 0) {
    const products = await this.page.locator('a[href^="/products/"], [data-testid="product-link"]').all();
    if (products.length > index) {
      await products[index].click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async goToCart() {
    await this.cartIcon.first().click();
    await this.page.waitForLoadState('networkidle');
  }
}
