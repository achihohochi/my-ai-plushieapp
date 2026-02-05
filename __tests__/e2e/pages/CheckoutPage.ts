import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for /checkout page
 * Handles checkout form and payment method selection
 */
export class CheckoutPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly nameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly phoneInput: Locator;
  readonly stripeRadio: Locator;
  readonly venmoRadio: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"], input[type="email"]');
    this.nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
    this.streetInput = page.locator('input[name="street"], input[name="address"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateInput = page.locator('input[name="state"], select[name="state"]');
    this.zipInput = page.locator('input[name="zip"], input[name="zipCode"]');
    this.phoneInput = page.locator('input[name="phone"], input[type="tel"]');
    this.stripeRadio = page.locator('input[value="stripe"], label:has-text("Stripe")');
    this.venmoRadio = page.locator('input[value="venmo"], label:has-text("Venmo")');
    this.submitButton = page.locator('button[type="submit"]:has-text("Place Order"), button:has-text("Complete")');
  }

  async goto() {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('networkidle');
  }

  async fillShippingInfo(data: {
    email: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  }) {
    await this.emailInput.fill(data.email);
    await this.nameInput.fill(data.name);
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);

    // Handle both input and select for state
    const stateElement = await this.stateInput.first();
    const tagName = await stateElement.evaluate((el) => el.tagName.toLowerCase());
    if (tagName === 'select') {
      await this.stateInput.selectOption(data.state);
    } else {
      await this.stateInput.fill(data.state);
    }

    await this.zipInput.fill(data.zip);

    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
  }

  async selectStripePayment() {
    await this.stripeRadio.first().click();
  }

  async selectVenmoPayment() {
    await this.venmoRadio.first().click();
  }

  async submitOrder() {
    await this.submitButton.first().click();
    // Don't wait for navigation here, let the test handle it
  }
}
