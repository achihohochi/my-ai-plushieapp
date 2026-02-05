import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for /admin/login page
 * Handles admin authentication
 */
export class AdminLoginPage {
  readonly page: Page;
  readonly adminKeyInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminKeyInput = page.locator('input[name="adminKey"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('text=/error|invalid|incorrect/i');
  }

  async goto() {
    await this.page.goto('/admin/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(adminKey: string) {
    await this.adminKeyInput.fill(adminKey);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginAndExpectError(adminKey: string) {
    await this.adminKeyInput.fill(adminKey);
    await this.loginButton.click();
    await this.page.waitForTimeout(1000);
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/admin/login');
  }
}
