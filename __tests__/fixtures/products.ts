/**
 * Mock product data for testing
 */

export const mockProduct = {
  id: 1,
  name: 'AI Robot Plushie',
  description: 'Cute metallic robot with LED eyes',
  price: 24.99,
  image_url: '/robot-plushie.jpg',
  stock_quantity: 10,
  status: 'active',
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
};

export const mockProducts = [
  {
    id: 1,
    name: 'AI Robot Plushie',
    description: 'Cute metallic robot with LED eyes',
    price: 24.99,
    image_url: '/robot-plushie.jpg',
    stock_quantity: 10,
    status: 'active',
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
  {
    id: 2,
    name: 'Neural Network Bear',
    description: 'Adorable bear with circuit patterns',
    price: 19.99,
    image_url: '/neural-bear.jpg',
    stock_quantity: 15,
    status: 'active',
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
  {
    id: 3,
    name: 'Deep Learning Dragon',
    description: 'Majestic dragon plushie',
    price: 29.99,
    image_url: '/dragon-plushie.jpg',
    stock_quantity: 5,
    status: 'active',
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
  {
    id: 4,
    name: 'Machine Learning Cat',
    description: 'Smart kitty with data patterns',
    price: 22.99,
    image_url: '/ml-cat.jpg',
    stock_quantity: 0, // Out of stock
    status: 'active',
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  },
];

export const mockProductOutOfStock = {
  ...mockProduct,
  id: 99,
  name: 'Sold Out Plushie',
  stock_quantity: 0,
};

export const mockProductInactive = {
  ...mockProduct,
  id: 100,
  name: 'Inactive Plushie',
  status: 'inactive',
};
