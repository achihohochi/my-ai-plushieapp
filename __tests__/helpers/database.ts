import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

/**
 * Test database helper functions
 */

// Create test database client
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
export const testDb = new PrismaClient({ adapter });

/**
 * Clean up test data created during tests
 * Preserves seed data (products) but removes test orders, cart items, etc.
 */
export async function cleanupTestData() {
  await testDb.cartItem.deleteMany({
    where: {
      created_at: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  });

  await testDb.orderItem.deleteMany({
    where: {
      order: {
        created_at: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    },
  });

  await testDb.order.deleteMany({
    where: {
      created_at: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  });

  await testDb.inventoryLog.deleteMany({
    where: {
      created_at: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  });
}

/**
 * Reset product stock to default values
 */
export async function resetProductStock() {
  await testDb.product.updateMany({
    data: {
      stock_quantity: 20,
    },
  });
}

/**
 * Full database reset - use sparingly
 * Deletes ALL data and re-seeds
 */
export async function fullDatabaseReset() {
  // Delete all data in correct order (respecting foreign keys)
  await testDb.inventoryLog.deleteMany();
  await testDb.orderItem.deleteMany();
  await testDb.order.deleteMany();
  await testDb.cartItem.deleteMany();
  await testDb.address.deleteMany();
  await testDb.user.deleteMany();
  await testDb.product.deleteMany();

  // Note: You'd need to re-run the seed script after this
  // or manually insert test data
}

/**
 * Get a test product by ID
 */
export async function getTestProduct(id: number) {
  return testDb.product.findUnique({
    where: { id },
  });
}

/**
 * Create a test order
 */
export async function createTestOrder(data: {
  email: string;
  name: string;
  items: { productId: number; quantity: number }[];
}) {
  const products = await Promise.all(
    data.items.map(item => testDb.product.findUnique({ where: { id: item.productId } }))
  );

  const total = data.items.reduce((sum, item, idx) => {
    const product = products[idx];
    return sum + (product ? Number(product.price) * item.quantity : 0);
  }, 0);

  return testDb.order.create({
    data: {
      order_number: `TEST-${Date.now()}`,
      customer_email: data.email,
      customer_name: data.name,
      shipping_street: '123 Test St',
      shipping_city: 'Test City',
      shipping_state: 'CA',
      shipping_zip: '12345',
      shipping_country: 'US',
      subtotal: total,
      tax: 0,
      shipping_cost: 0,
      total,
      payment_method: 'test',
      payment_status: 'paid',
      order_status: 'processing',
      order_items: {
        create: data.items.map((item, idx) => ({
          product_id: item.productId,
          quantity: item.quantity,
          price_at_time: products[idx]?.price || 0,
        })),
      },
    },
  });
}

/**
 * Close database connection
 */
export async function closeTestDb() {
  await testDb.$disconnect();
  await pool.end();
}
