import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXX (e.g., ORD-20260204-1234)
 */
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

describe('generateOrderNumber', () => {
  beforeEach(() => {
    // Use fake timers for date testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it('should generate order number with correct format', () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^ORD-\d{8}-\d{4}$/);
  });

  it('should include current date in YYYYMMDD format', () => {
    const mockDate = new Date('2026-02-04T10:00:00Z');
    vi.setSystemTime(mockDate);

    const orderNumber = generateOrderNumber();
    expect(orderNumber).toContain('20260204');
  });

  it('should generate 4-digit random number', () => {
    const orderNumber = generateOrderNumber();
    const randomPart = orderNumber.split('-')[2];
    expect(randomPart).toHaveLength(4);
    expect(randomPart).toMatch(/^\d{4}$/);
  });

  it('should pad random number with leading zeros', () => {
    // Mock Math.random to return small number (e.g., 0.005 = 50)
    vi.spyOn(Math, 'random').mockReturnValue(0.005);

    const orderNumber = generateOrderNumber();
    const randomPart = orderNumber.split('-')[2];
    expect(randomPart).toBe('0050');

    vi.restoreAllMocks();
  });

  it('should generate unique order numbers (high probability)', () => {
    // Use real timers for this test to get real randomness
    vi.useRealTimers();

    const orderNumbers = new Set();
    for (let i = 0; i < 50; i++) {
      orderNumbers.add(generateOrderNumber());
    }

    // Should have at least 48 unique numbers (allowing for rare collisions)
    expect(orderNumbers.size).toBeGreaterThan(45);

    vi.useFakeTimers(); // Restore fake timers
  });

  it('should handle date changes correctly', () => {
    // Set date to Feb 4, 2026
    vi.setSystemTime(new Date('2026-02-04T10:00:00Z'));
    const order1 = generateOrderNumber();
    expect(order1).toContain('20260204');

    // Change to Feb 5, 2026
    vi.setSystemTime(new Date('2026-02-05T10:00:00Z'));
    const order2 = generateOrderNumber();
    expect(order2).toContain('20260205');

    // Date parts should be different
    expect(order1.substring(4, 12)).not.toBe(order2.substring(4, 12));
  });

  it('should handle single-digit months with padding', () => {
    vi.setSystemTime(new Date('2026-01-15T10:00:00Z'));
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toContain('20260115'); // 01 for January
  });

  it('should handle single-digit days with padding', () => {
    vi.setSystemTime(new Date('2026-12-05T10:00:00Z'));
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toContain('20261205'); // 05 for 5th day
  });

  it('should handle end of year correctly', () => {
    vi.setSystemTime(new Date('2026-12-31T23:59:59Z'));
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toContain('20261231');
  });

  it('should handle leap year correctly', () => {
    vi.setSystemTime(new Date('2024-02-29T10:00:00Z')); // 2024 is a leap year
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toContain('20240229');
  });
});
