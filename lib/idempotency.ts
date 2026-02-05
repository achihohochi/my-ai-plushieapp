import { createHash } from 'crypto';

/**
 * Generate idempotency key from request data
 * Prevents duplicate orders from rapid double-clicks
 */
export function generateIdempotencyKey(data: {
  email: string;
  items: { id: string | number; quantity: number }[];
  total: number;
}): string {
  // Create deterministic hash of order details
  const payload = JSON.stringify({
    email: data.email.toLowerCase().trim(),
    items: data.items
      .map(item => ({ id: item.id, quantity: item.quantity }))
      .sort((a, b) => String(a.id).localeCompare(String(b.id))), // Sort for consistency
    total: data.total,
  });

  return createHash('sha256').update(payload).digest('hex').substring(0, 32);
}

/**
 * Time window for idempotency check (5 minutes)
 * Orders with same key within this window are considered duplicates
 */
export const IDEMPOTENCY_WINDOW_MS = 5 * 60 * 1000;
