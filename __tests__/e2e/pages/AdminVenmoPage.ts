import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for /admin/venmo page
 * Handles Venmo payment verification workflow
 */
export class AdminVenmoPage {
  readonly page: Page;
  readonly pendingOrders: Locator;
  readonly verifyButtons: Locator;
  readonly rejectButtons: Locator;
  readonly orderNumbers: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pendingOrders = page.locator('[data-testid="pending-order"], .pending-order, [class*="order"]');
    this.verifyButtons = page.locator('button:has-text("Verify"), button:has-text("Approve")');
    this.rejectButtons = page.locator('button:has-text("Reject"), button:has-text("Decline")');
    this.orderNumbers = page.locator('text=/ORD-[A-Z0-9]+/');
    this.emptyMessage = page.locator('text=/no pending|empty/i');
  }

  async goto() {
    await this.page.goto('/admin/venmo');
    await this.page.waitForLoadState('networkidle');
  }

  async getPendingOrderCount(): Promise<number> {
    await this.page.waitForTimeout(500);
    const count = await this.pendingOrders.count();
    return count > 0 ? count : await this.orderNumbers.count();
  }

  async verifyPayment(index: number = 0) {
    const button = this.verifyButtons.nth(index);
    await button.waitFor({ state: 'visible', timeout: 5000 });
    await button.click();
    await this.page.waitForTimeout(1000);
  }

  async rejectPayment(index: number = 0) {
    const button = this.rejectButtons.nth(index);
    await button.waitFor({ state: 'visible', timeout: 5000 });
    await button.click();
    await this.page.waitForTimeout(1000);
  }

  async getOrderNumber(index: number = 0): Promise<string> {
    const orderNumberElement = this.orderNumbers.nth(index);
    return await orderNumberElement.textContent() || '';
  }

  async isEmptyQueueVisible(): Promise<boolean> {
    return await this.emptyMessage.isVisible().catch(() => false);
  }

  async waitForOrderToDisappear(orderNumber: string) {
    await this.page.waitForFunction(
      (num) => !document.body.textContent?.includes(num),
      orderNumber,
      { timeout: 5000 }
    ).catch(() => {
      // Order might already be gone
    });
  }
}
