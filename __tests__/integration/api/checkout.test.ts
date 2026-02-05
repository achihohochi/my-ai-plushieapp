import { describe, it, expect } from 'vitest';

/**
 * Integration tests for Checkout API
 * Tests Stripe checkout session creation and Venmo order creation
 */

describe('Checkout API Integration', () => {
  const baseUrl = 'http://localhost:3002';

  describe('POST /api/create-checkout-session (Stripe)', () => {
    it('should create Stripe checkout session with cart items', async () => {
      // Create checkout session with items
      const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [
            {
              name: 'Test Plushie',
              price: 25.0,
              quantity: 2,
              category: 'Plushies',
              image: '/plushies/bunny.jpg',
            },
          ],
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.url).toBeDefined();
      expect(data.url).toContain('checkout.stripe.com');
      expect(data.sessionId).toBeDefined();
    });

    it('should reject checkout without cart items', async () => {
      // Create checkout with empty items array
      const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [], // Empty items array
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('empty');
    });

    it('should reject checkout with missing required fields', async () => {
      const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          items: [{ name: 'Test', price: 10, quantity: 1 }],
          // Missing name, street, city, state, zip
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('required');
    });
  });

  describe('POST /api/checkout/venmo (Venmo)', () => {
    it('should create Venmo order with QR code', async () => {
      // Create Venmo order
      const response = await fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'venmo-test@example.com',
          name: 'Venmo Test User',
          street: '456 Venmo St',
          city: 'Venmo City',
          state: 'NY',
          zip: '54321',
          items: [
            {
              id: 1,
              name: 'Test Plushie',
              price: 25.0,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.order).toBeDefined();
      expect(data.order.orderNumber).toBeDefined();
      expect(data.order.orderNumber).toMatch(/^ORD-\d+-\d+$/); // Format: ORD-20260204-1234
      expect(data.venmo).toBeDefined();
      expect(data.venmo.qrCodeDataUrl).toBeDefined();
      expect(data.venmo.amount).toBeDefined();
      expect(data.venmo.username).toBeDefined();
    });

    it('should create order with pending_payment_verification status', async () => {
      // Create Venmo order
      const response = await fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'status-test@example.com',
          name: 'Status Test',
          street: '789 Status Ave',
          city: 'Status City',
          state: 'TX',
          zip: '67890',
          items: [
            {
              id: 2,
              name: 'Another Plushie',
              price: 30.0,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify order was created with correct status by fetching admin orders
      const adminKey = process.env.ADMIN_KEY || 'test-admin-key';
      const ordersResponse = await fetch(`${baseUrl}/api/admin/venmo/pending`, {
        headers: { 'x-admin-key': adminKey },
      });

      const ordersData = await ordersResponse.json();
      expect(ordersData.success).toBe(true);

      // Find our order in the pending list
      const ourOrder = ordersData.data.find((order: any) =>
        order.order_number === data.order.orderNumber
      );

      expect(ourOrder).toBeDefined();
      expect(ourOrder.payment_status).toBe('pending_payment_verification');
      expect(ourOrder.payment_method).toBe('venmo');
    });

    it('should reject Venmo checkout without cart items', async () => {
      const response = await fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'empty-cart@example.com',
          name: 'Empty Cart User',
          street: '999 Empty St',
          city: 'Empty City',
          state: 'FL',
          zip: '99999',
          items: [], // Empty items array
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('empty');
    });
  });

  describe('Order Number Generation', () => {
    it('should generate unique order numbers for each order', async () => {
      const orderNumbers = new Set();

      // Create 5 Venmo orders and verify unique order numbers
      for (let i = 0; i < 5; i++) {
        // Create order
        const response = await fetch(`${baseUrl}/api/checkout/venmo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: `unique-${i}@example.com`,
            name: `Test User ${i}`,
            street: `${i} Test St`,
            city: 'Test City',
            state: 'CA',
            zip: '12345',
            items: [
              {
                id: 1,
                name: 'Test Plushie',
                price: 20.0,
                quantity: 1,
              },
            ],
          }),
        });

        const data = await response.json();
        expect(data.success).toBe(true);

        // Verify uniqueness
        expect(orderNumbers.has(data.order.orderNumber)).toBe(false);
        orderNumbers.add(data.order.orderNumber);
      }

      // Verify we got 5 unique order numbers
      expect(orderNumbers.size).toBe(5);
    });
  });
});
