/**
 * Mock Resend API responses for testing
 */

export const mockResendEmailSuccess = {
  id: 're_test_123456789',
  from: 'onboarding@resend.dev',
  to: ['test@example.com'],
  subject: 'Order Confirmation - ORD-20260204-1234',
  created_at: '2026-02-04T10:00:00.000Z',
};

export const mockResendEmailError = {
  statusCode: 422,
  message: 'Validation error',
  error: {
    message: "The 'html' field must be a 'string'.",
  },
};

export const mockEmailParams = {
  customerEmail: 'test@example.com',
  customerName: 'John Doe',
  orderNumber: 'ORD-20260204-1234',
  items: [
    {
      name: 'AI Robot Plushie',
      quantity: 2,
      price: 24.99,
    },
  ],
  subtotal: 49.98,
  tax: 0,
  shippingCost: 0,
  total: 49.98,
  shippingAddress: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
  },
};
