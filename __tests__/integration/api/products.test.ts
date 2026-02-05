import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * Integration tests for Products API
 * Tests the actual API routes with mock data
 */

describe('Products API Integration', () => {
  const baseUrl = 'http://localhost:3002';

  describe('GET /api/products', () => {
    it('should return all active products', async () => {
      const response = await fetch(`${baseUrl}/api/products`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });

    it('should return products with correct structure', async () => {
      const response = await fetch(`${baseUrl}/api/products`);
      const data = await response.json();

      const product = data.data[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('image_url');
      expect(product).toHaveProperty('stock_quantity');
      expect(product).toHaveProperty('status');
    });

    it('should only return active products', async () => {
      const response = await fetch(`${baseUrl}/api/products`);
      const data = await response.json();

      const allActive = data.data.every(
        (product: any) => product.status === 'active'
      );
      expect(allActive).toBe(true);
    });

    it('should return products in descending order by creation date', async () => {
      const response = await fetch(`${baseUrl}/api/products`);
      const data = await response.json();

      if (data.data.length > 1) {
        const dates = data.data.map((p: any) => new Date(p.created_at).getTime());
        const sortedDates = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sortedDates);
      }
    });
  });

  describe('GET /api/products/[id]', () => {
    it('should return a single product by ID', async () => {
      const response = await fetch(`${baseUrl}/api/products/1`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id', 1);
      expect(data.data).toHaveProperty('name');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await fetch(`${baseUrl}/api/products/99999`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await fetch(`${baseUrl}/api/products/invalid`);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});
