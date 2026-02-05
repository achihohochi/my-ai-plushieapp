import { describe, it, expect } from 'vitest';

/**
 * Format price as USD currency string
 */
function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `$${numPrice.toFixed(2)}`;
}

/**
 * Calculate subtotal for cart items
 */
function calculateSubtotal(
  items: Array<{ price: number; quantity: number }>
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Calculate total with tax and shipping
 */
function calculateTotal(
  subtotal: number,
  tax: number = 0,
  shipping: number = 0
): number {
  return subtotal + tax + shipping;
}

describe('Price Formatting Utilities', () => {
  describe('formatPrice', () => {
    it('should format whole number as USD', () => {
      expect(formatPrice(25)).toBe('$25.00');
    });

    it('should format decimal number with 2 decimal places', () => {
      expect(formatPrice(24.99)).toBe('$24.99');
    });

    it('should format number string as USD', () => {
      expect(formatPrice('19.99')).toBe('$19.99');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should round to 2 decimal places', () => {
      expect(formatPrice(19.999)).toBe('$20.00');
      expect(formatPrice(19.995)).toBe('$20.00');
      expect(formatPrice(19.994)).toBe('$19.99');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(9999.99)).toBe('$9999.99');
    });

    it('should handle negative numbers', () => {
      expect(formatPrice(-10.5)).toBe('$-10.50');
    });

    it('should pad single decimal place', () => {
      expect(formatPrice(5.5)).toBe('$5.50');
    });
  });

  describe('calculateSubtotal', () => {
    it('should calculate subtotal for single item', () => {
      const items = [{ price: 24.99, quantity: 1 }];
      expect(calculateSubtotal(items)).toBe(24.99);
    });

    it('should calculate subtotal for multiple quantities', () => {
      const items = [{ price: 10.0, quantity: 3 }];
      expect(calculateSubtotal(items)).toBe(30.0);
    });

    it('should calculate subtotal for multiple items', () => {
      const items = [
        { price: 10.0, quantity: 2 },
        { price: 15.5, quantity: 1 },
        { price: 5.99, quantity: 3 },
      ];
      expect(calculateSubtotal(items)).toBe(53.47);
    });

    it('should return 0 for empty cart', () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it('should handle items with zero quantity', () => {
      const items = [
        { price: 10.0, quantity: 0 },
        { price: 20.0, quantity: 1 },
      ];
      expect(calculateSubtotal(items)).toBe(20.0);
    });

    it('should handle decimal prices and quantities', () => {
      const items = [
        { price: 9.99, quantity: 2 },
        { price: 15.49, quantity: 3 },
      ];
      expect(calculateSubtotal(items)).toBeCloseTo(66.45, 2);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total with no tax or shipping', () => {
      expect(calculateTotal(100.0)).toBe(100.0);
    });

    it('should calculate total with tax', () => {
      expect(calculateTotal(100.0, 8.5)).toBe(108.5);
    });

    it('should calculate total with shipping', () => {
      expect(calculateTotal(100.0, 0, 5.99)).toBe(105.99);
    });

    it('should calculate total with tax and shipping', () => {
      expect(calculateTotal(100.0, 8.5, 5.99)).toBe(114.49);
    });

    it('should handle decimal values correctly', () => {
      expect(calculateTotal(24.99, 2.12, 4.99)).toBeCloseTo(32.1, 2);
    });

    it('should handle zero subtotal', () => {
      expect(calculateTotal(0, 0, 0)).toBe(0);
    });
  });
});
