/**
 * Mock cart item data for testing
 */

export const mockCartItem = {
  id: 1,
  session_id: 'test-session-123',
  user_id: null,
  product_id: 1,
  quantity: 2,
  created_at: new Date('2026-02-04T10:00:00Z'),
  updated_at: new Date('2026-02-04T10:00:00Z'),
  product: {
    id: 1,
    name: 'AI Robot Plushie',
    price: 24.99,
    image_url: '/robot-plushie.jpg',
    stock_quantity: 10,
  },
};

export const mockCartItems = [
  {
    id: 1,
    session_id: 'test-session-123',
    user_id: null,
    product_id: 1,
    quantity: 2,
    created_at: new Date('2026-02-04T10:00:00Z'),
    updated_at: new Date('2026-02-04T10:00:00Z'),
    product: {
      id: 1,
      name: 'AI Robot Plushie',
      price: 24.99,
      image_url: '/robot-plushie.jpg',
      stock_quantity: 10,
    },
  },
  {
    id: 2,
    session_id: 'test-session-123',
    user_id: null,
    product_id: 2,
    quantity: 1,
    created_at: new Date('2026-02-04T10:00:00Z'),
    updated_at: new Date('2026-02-04T10:00:00Z'),
    product: {
      id: 2,
      name: 'Neural Network Bear',
      price: 19.99,
      image_url: '/neural-bear.jpg',
      stock_quantity: 15,
    },
  },
];

export const mockEmptyCart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};
