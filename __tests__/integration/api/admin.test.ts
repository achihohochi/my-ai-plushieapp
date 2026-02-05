import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Integration tests for Admin API
 * Tests admin authentication and operations
 */

describe('Admin API Integration', () => {
  const baseUrl = 'http://localhost:3002';
  const adminKey = process.env.ADMIN_KEY || 'test-admin-key';

  describe('Authentication', () => {
    it('should reject requests without admin key', async () => {
      const response = await fetch(`${baseUrl}/api/admin/orders`);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Unauthorized');
    });

    it('should reject requests with invalid admin key', async () => {
      const response = await fetch(`${baseUrl}/api/admin/orders`, {
        headers: { 'x-admin-key': 'invalid-key' },
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should accept requests with valid admin key (header)', async () => {
      const response = await fetch(`${baseUrl}/api/admin/orders`, {
        headers: { 'x-admin-key': adminKey },
      });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/admin/orders', () => {
    it('should return all orders with admin key', async () => {
      const response = await fetch(`${baseUrl}/api/admin/orders`, {
        headers: { 'x-admin-key': adminKey },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should include order items and product details', async () => {
      const response = await fetch(`${baseUrl}/api/admin/orders`, {
        headers: { 'x-admin-key': adminKey },
      });

      const data = await response.json();

      if (data.data.length > 0) {
        const order = data.data[0];
        expect(order).toHaveProperty('order_number');
        expect(order).toHaveProperty('customer_name');
        expect(order).toHaveProperty('total');
        expect(order).toHaveProperty('order_items');
      }
    });
  });

  describe('PUT /api/admin/products/[id]', () => {
    it('should update product with admin key', async () => {
      const response = await fetch(`${baseUrl}/api/admin/products/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          price: 29.99,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('price');
    });

    it('should reject update without admin key', async () => {
      const response = await fetch(`${baseUrl}/api/admin/products/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: 29.99,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should log inventory changes for stock updates', async () => {
      const response = await fetch(`${baseUrl}/api/admin/products/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          stock_quantity: 20,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Inventory log should be created (verified in database tests)
    });

    it('should return 404 for non-existent product', async () => {
      const response = await fetch(`${baseUrl}/api/admin/products/99999`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          price: 29.99,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe('GET /api/admin/venmo/pending', () => {
    it('should return pending Venmo orders', async () => {
      const response = await fetch(`${baseUrl}/api/admin/venmo/pending`, {
        headers: { 'x-admin-key': adminKey },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);

      // All should have pending payment status
      if (data.data.length > 0) {
        const allPending = data.data.every(
          (order: any) =>
            order.payment_status === 'pending_payment_verification'
        );
        expect(allPending).toBe(true);
      }
    });

    it('should include order items', async () => {
      const response = await fetch(`${baseUrl}/api/admin/venmo/pending`, {
        headers: { 'x-admin-key': adminKey },
      });

      const data = await response.json();

      if (data.data.length > 0) {
        expect(data.data[0]).toHaveProperty('order_items');
      }
    });
  });
});
