import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';

/**
 * Concurrency Testing for Checkout
 * Tests race conditions when multiple users attempt to purchase limited stock
 *
 * CRITICAL: Prevents overselling when 2+ users buy last item simultaneously
 */

describe('Concurrent Purchase Handling', () => {
  const baseUrl = 'http://localhost:3002';
  let testProductId: number;
  const originalStock = 2; // Start with 2 units for testing

  beforeEach(async () => {
    // Find a product with low stock for testing
    const product = await prisma.product.findFirst({
      where: { stock_quantity: { gte: 2 } },
    });

    if (!product) {
      throw new Error('No product with sufficient stock for testing');
    }

    testProductId = product.id;

    // Set stock to exactly 2 for controlled testing
    await prisma.product.update({
      where: { id: testProductId },
      data: { stock_quantity: originalStock },
    });
  });

  it('should prevent overselling when 2 users buy last 2 items simultaneously', async () => {
    // Scenario: Product has 2 units in stock
    // User A wants 2 units
    // User B wants 2 units
    // Both submit orders at the same time
    // Expected: Only 1 order succeeds (first to acquire lock)

    const createOrder = async (quantity: number, userEmail: string) => {
      return fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: 'Concurrent Test User',
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [
            {
              id: testProductId,
              name: 'Test Product',
              price: 25.0,
              quantity: quantity,
            },
          ],
        }),
      });
    };

    // Fire 2 requests simultaneously
    const [response1, response2] = await Promise.all([
      createOrder(2, 'user-a@test.com'),
      createOrder(2, 'user-b@test.com'),
    ]);

    const data1 = await response1.json();
    const data2 = await response2.json();

    // One should succeed (200), one should fail (400 - not enough stock)
    const responses = [
      { status: response1.status, success: data1.success },
      { status: response2.status, success: data2.success },
    ];

    const successfulOrders = responses.filter(r => r.status === 200 && r.success);
    const failedOrders = responses.filter(r => r.status === 400 && !r.success);

    // Verify exactly 1 succeeded and 1 failed
    expect(successfulOrders.length).toBe(1);
    expect(failedOrders.length).toBe(1);

    // Verify stock is now 0, not negative
    const product = await prisma.product.findUnique({
      where: { id: testProductId },
    });

    expect(product?.stock_quantity).toBe(0);
    expect(product?.stock_quantity).toBeGreaterThanOrEqual(0); // Never negative
  });

  it('should handle 5 concurrent purchases of 1 item each when only 2 in stock', async () => {
    // Scenario: Product has 2 units
    // 5 users each want 1 unit simultaneously
    // Expected: 2 succeed, 3 fail

    const createOrder = (userNum: number) => {
      return fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user-${userNum}@test.com`,
          name: `User ${userNum}`,
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [
            {
              id: testProductId,
              name: 'Test Product',
              price: 25.0,
              quantity: 1,
            },
          ],
        }),
      });
    };

    // Fire 5 concurrent requests
    const responses = await Promise.all([
      createOrder(1),
      createOrder(2),
      createOrder(3),
      createOrder(4),
      createOrder(5),
    ]);

    // Parse all responses
    const results = await Promise.all(
      responses.map(async (r) => ({
        status: r.status,
        data: await r.json(),
      }))
    );

    const successCount = results.filter(r => r.status === 200 && r.data.success).length;
    const failureCount = results.filter(r => r.status === 400 && !r.data.success).length;

    // Exactly 2 should succeed (we had 2 in stock)
    expect(successCount).toBe(2);
    // Exactly 3 should fail (out of stock)
    expect(failureCount).toBe(3);

    // Verify all failures mention stock
    const failures = results.filter(r => !r.data.success);
    failures.forEach(f => {
      expect(f.data.error).toMatch(/stock|available/i);
    });

    // Verify final stock is 0
    const product = await prisma.product.findUnique({
      where: { id: testProductId },
    });

    expect(product?.stock_quantity).toBe(0);
  });

  it('should maintain inventory integrity under concurrent updates', async () => {
    // This test verifies that concurrent purchases don't cause:
    // 1. Negative inventory
    // 2. Lost inventory decrements
    // 3. Incorrect inventory log counts

    const initialStock = 3;
    await prisma.product.update({
      where: { id: testProductId },
      data: { stock_quantity: initialStock },
    });

    // Get initial inventory log count
    const initialLogCount = await prisma.inventoryLog.count({
      where: { product_id: testProductId },
    });

    // Create 3 concurrent orders for 1 item each
    const responses = await Promise.all([
      fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'inv-test-1@test.com',
          name: 'Inventory Test 1',
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [{ id: testProductId, name: 'Test', price: 25, quantity: 1 }],
        }),
      }),
      fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'inv-test-2@test.com',
          name: 'Inventory Test 2',
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [{ id: testProductId, name: 'Test', price: 25, quantity: 1 }],
        }),
      }),
      fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'inv-test-3@test.com',
          name: 'Inventory Test 3',
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [{ id: testProductId, name: 'Test', price: 25, quantity: 1 }],
        }),
      }),
    ]);

    // All 3 should succeed (we had 3 in stock)
    const successCount = responses.filter(r => r.status === 200).length;
    expect(successCount).toBe(3);

    // Verify final stock is exactly 0
    const product = await prisma.product.findUnique({
      where: { id: testProductId },
    });
    expect(product?.stock_quantity).toBe(0);

    // Verify inventory logs were created for each sale
    const finalLogCount = await prisma.inventoryLog.count({
      where: { product_id: testProductId },
    });
    const newLogs = finalLogCount - initialLogCount;
    expect(newLogs).toBe(3); // One log per successful order

    // Verify sum of inventory changes equals stock decrease
    const logs = await prisma.inventoryLog.findMany({
      where: {
        product_id: testProductId,
        created_at: { gte: new Date(Date.now() - 10000) }, // Last 10 seconds
      },
    });

    const totalChange = logs.reduce((sum, log) => sum + log.change_quantity, 0);
    expect(totalChange).toBe(-3); // 3 units sold
  });

  it('should reject concurrent purchases that exceed stock by 1 unit', async () => {
    // Edge case: Product has 2 units
    // User A wants 1 unit
    // User B wants 2 units
    // Both fire simultaneously
    // Expected: Both could theoretically succeed if perfectly timed,
    // but total should never exceed 2 units sold

    await prisma.product.update({
      where: { id: testProductId },
      data: { stock_quantity: 2 },
    });

    const [response1, response2] = await Promise.all([
      fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'edge-test-1@test.com',
          name: 'Edge Test 1',
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [{ id: testProductId, name: 'Test', price: 25, quantity: 1 }],
        }),
      }),
      fetch(`${baseUrl}/api/checkout/venmo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'edge-test-2@test.com',
          name: 'Edge Test 2',
          street: '123 Test St',
          city: 'Test City',
          state: 'CA',
          zip: '12345',
          items: [{ id: testProductId, name: 'Test', price: 25, quantity: 2 }],
        }),
      }),
    ]);

    const data1 = await response1.json();
    const data2 = await response2.json();

    // At least one must fail (can't sell 3 when only 2 in stock)
    const successCount = [data1, data2].filter(d => d.success).length;
    expect(successCount).toBeLessThanOrEqual(1);

    // Verify stock is 0 or 1, never negative
    const product = await prisma.product.findUnique({
      where: { id: testProductId },
    });
    expect(product?.stock_quantity).toBeGreaterThanOrEqual(0);
    expect(product?.stock_quantity).toBeLessThanOrEqual(1);
  });
});
