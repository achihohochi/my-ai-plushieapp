import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for /admin/dashboard page
 * Handles dashboard navigation and stats
 */
export class AdminDashboardPage {
  readonly page: Page;
  readonly statsCards: Locator;
  readonly syncButton: Locator;
  readonly ordersLink: Locator;
  readonly productsLink: Locator;
  readonly venmoLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.statsCards = page.locator('[data-testid="stat-card"], .stat-card, [class*="stat"]');
    this.syncButton = page.locator('button:has-text("Sync"), button:has-text("Google Sheets")');
    this.ordersLink = page.locator('a[href="/admin/orders"]');
    this.productsLink = page.locator('a[href="/admin/products"]');
    this.venmoLink = page.locator('a[href="/admin/venmo"]');
    this.logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
  }

  async goto() {
    await this.page.goto('/admin/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getStatsCount(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.statsCards.count();
  }

  async clickSync() {
    await this.syncButton.click();
    await this.page.waitForTimeout(1000);
  }

  async goToOrders() {
    await this.ordersLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToProducts() {
    await this.productsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToVenmo() {
    await this.venmoLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isOnDashboard(): Promise<boolean> {
    return this.page.url().includes('/admin/dashboard');
  }
}
