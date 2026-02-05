import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';

/**
 * Integration tests for Cart API
 * Tests session-based cart operations
 */

describe('Cart API Integration', () => {
  const baseUrl = 'http://localhost:3002';
  let sessionCookie: string;

  describe('POST /api/cart', () => {
    it('should add item to cart and create session', async () => {
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 2,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.data.quantity).toBe(2);

      // Should set session cookie
      const setCookie = response.headers.get('set-cookie');
      expect(setCookie).toContain('session_id');
    });

    it('should reject invalid product ID', async () => {
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 99999,
          quantity: 1,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should reject quantity exceeding stock', async () => {
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 9999,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('stock');
    });

    it('should reject negative quantity', async () => {
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: -1,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should increment quantity for existing cart item', async () => {
      // First add
      const response1 = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 1,
        }),
      });

      const sessionCookie = response1.headers.get('set-cookie');

      // Second add with same session
      const response2 = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie || '',
        },
        body: JSON.stringify({
          productId: 1,
          quantity: 1,
        }),
      });

      const data = await response2.json();

      expect(data.success).toBe(true);
      expect(data.data.quantity).toBe(2);
    });
  });

  describe('GET /api/cart', () => {
    it('should return empty cart for new session', async () => {
      const response = await fetch(`${baseUrl}/api/cart`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return cart items with product details', async () => {
      // Add item first
      const addResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 2,
        }),
      });

      const sessionCookie = addResponse.headers.get('set-cookie');

      // Get cart
      const response = await fetch(`${baseUrl}/api/cart`, {
        headers: { Cookie: sessionCookie || '' },
      });

      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data[0]).toHaveProperty('name');
      expect(data.data[0]).toHaveProperty('price');
      expect(data.data[0]).toHaveProperty('quantity');
      expect(data.data[0]).toHaveProperty('cartItemId');
    });
  });

  describe('PUT /api/cart/[id]', () => {
    it('should update cart item quantity', async () => {
      // Add item first
      const addResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 1,
        }),
      });

      const addData = await addResponse.json();
      const cartItemId = addData.data.cartItemId;
      const sessionCookie = addResponse.headers.get('set-cookie');

      // Update quantity
      const response = await fetch(`${baseUrl}/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie || '',
        },
        body: JSON.stringify({ quantity: 5 }),
      });

      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.quantity).toBe(5);
    });

    it('should reject update exceeding stock', async () => {
      // Add item first
      const addResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 1,
        }),
      });

      const addData = await addResponse.json();
      const sessionCookie = addResponse.headers.get('set-cookie');

      // Try to update to exceed stock
      const response = await fetch(`${baseUrl}/api/cart/${addData.data.cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie || '',
        },
        body: JSON.stringify({ quantity: 9999 }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('DELETE /api/cart/[id]', () => {
    it('should remove cart item', async () => {
      // Add item first
      const addResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 1,
        }),
      });

      const addData = await addResponse.json();
      const sessionCookie = addResponse.headers.get('set-cookie');

      // Delete item
      const response = await fetch(`${baseUrl}/api/cart/${addData.data.cartItemId}`, {
        method: 'DELETE',
        headers: { Cookie: sessionCookie || '' },
      });

      const data = await response.json();

      expect(data.success).toBe(true);
    });

    it('should return 404 for non-existent cart item', async () => {
      // Create a session first by adding an item
      const addResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 1,
        }),
      });
      const sessionCookie = addResponse.headers.get('set-cookie');

      // Try to delete non-existent cart item with valid session
      const response = await fetch(`${baseUrl}/api/cart/99999`, {
        method: 'DELETE',
        headers: { Cookie: sessionCookie || '' },
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });
});
