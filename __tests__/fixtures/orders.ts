/**
 * Mock order data for testing
 */

export const mockOrder = {
  id: 1,
  order_number: 'ORD-20260204-1234',
  email: 'test@example.com',
  customer_name: 'John Doe',
  shipping_street: '123 Main St',
  shipping_city: 'San Francisco',
  shipping_state: 'CA',
  shipping_zip: '94102',
  shipping_country: 'US',
  subtotal: 24.99,
  tax: 0,
  shipping_cost: 0,
  total: 24.99,
  payment_method: 'stripe',
  payment_status: 'paid',
  payment_intent_id: 'pi_test_123',
  order_status: 'processing',
  created_at: new Date('2026-02-04T10:00:00Z'),
  updated_at: new Date('2026-02-04T10:00:00Z'),
};

export const mockOrderWithItems = {
  ...mockOrder,
  order_items: [
    {
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 2,
      price_at_time: 24.99,
      created_at: new Date('2026-02-04T10:00:00Z'),
      product: {
        id: 1,
        name: 'AI Robot Plushie',
        image_url: '/robot-plushie.jpg',
      },
    },
  ],
};

export const mockVenmoOrder = {
  ...mockOrder,
  id: 2,
  order_number: 'ORD-20260204-5678',
  payment_method: 'venmo',
  payment_status: 'pending_payment_verification',
  payment_intent_id: null,
  order_status: 'pending_payment',
};

export const mockOrderCheckoutData = {
  email: 'test@example.com',
  name: 'John Doe',
  street: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  zip: '94102',
  items: [
    {
      id: 1,
      quantity: 2,
    },
  ],
};
