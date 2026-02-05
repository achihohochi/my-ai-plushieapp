/**
 * Mock Stripe API responses for testing
 */

export const mockStripeCheckoutSession = {
  id: 'cs_test_123456789',
  object: 'checkout.session',
  amount_total: 2499,
  currency: 'usd',
  customer_email: 'test@example.com',
  payment_status: 'paid',
  payment_intent: 'pi_test_123456789',
  url: 'https://checkout.stripe.com/test/cs_test_123456789',
  metadata: {
    session_id: 'test-session-123',
    customer_name: 'John Doe',
    shipping_street: '123 Main St',
    shipping_city: 'San Francisco',
    shipping_state: 'CA',
    shipping_zip: '94102',
  },
};

export const mockStripeWebhookEvent = {
  id: 'evt_test_123',
  type: 'checkout.session.completed',
  data: {
    object: mockStripeCheckoutSession,
  },
};

export const mockStripeError = {
  type: 'StripeInvalidRequestError',
  message: 'Invalid API key provided',
  statusCode: 401,
};

export const mockStripeCardDeclined = {
  type: 'StripeCardError',
  message: 'Your card was declined',
  statusCode: 402,
  decline_code: 'generic_decline',
};
