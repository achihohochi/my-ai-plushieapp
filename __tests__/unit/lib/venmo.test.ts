import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateVenmoLink,
  generateVenmoQRCode,
  getVenmoUsername,
} from '@/lib/venmo';

// Mock QRCode library
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn((link: string, options: any) => {
      return Promise.resolve(`data:image/png;base64,mockQRCode_${link}`);
    }),
  },
}));

describe('Venmo Utilities', () => {
  describe('generateVenmoLink', () => {
    it('should generate correct Venmo link format', () => {
      const link = generateVenmoLink({
        username: 'testuser',
        amount: 24.99,
        note: 'ORD-20260204-1234',
      });

      expect(link).toBe(
        'https://venmo.com/testuser?txn=pay&amount=24.99&note=ORD-20260204-1234'
      );
    });

    it('should encode special characters in note', () => {
      const link = generateVenmoLink({
        username: 'user',
        amount: 10.0,
        note: 'Order #123 & Test',
      });

      expect(link).toContain('note=Order%20%23123%20%26%20Test');
    });

    it('should format amount with 2 decimal places', () => {
      const link = generateVenmoLink({
        username: 'user',
        amount: 15,
        note: 'ORD-123',
      });

      expect(link).toContain('amount=15.00');
    });

    it('should handle decimal amounts correctly', () => {
      const link = generateVenmoLink({
        username: 'user',
        amount: 99.95,
        note: 'ORD-456',
      });

      expect(link).toContain('amount=99.95');
    });

    it('should handle username with special characters', () => {
      const link = generateVenmoLink({
        username: 'test-user_123',
        amount: 20.0,
        note: 'ORD-789',
      });

      expect(link).toContain('test-user_123');
      expect(link).toContain('amount=20.00');
    });

    it('should round amount to 2 decimal places', () => {
      const link = generateVenmoLink({
        username: 'user',
        amount: 19.999,
        note: 'ORD-111',
      });

      expect(link).toContain('amount=20.00');
    });

    it('should handle zero amount', () => {
      const link = generateVenmoLink({
        username: 'user',
        amount: 0,
        note: 'ORD-000',
      });

      expect(link).toContain('amount=0.00');
    });
  });

  describe('generateVenmoQRCode', () => {
    it('should generate QR code data URL', async () => {
      const qrCode = await generateVenmoQRCode({
        username: 'testuser',
        amount: 50.0,
        note: 'ORD-999',
      });

      expect(qrCode).toBeDefined();
      expect(qrCode).toContain('data:image/png;base64');
    });

    it('should call QRCode.toDataURL with correct Venmo link', async () => {
      const QRCode = await import('qrcode');
      const spy = vi.spyOn(QRCode.default, 'toDataURL');

      await generateVenmoQRCode({
        username: 'user',
        amount: 25.0,
        note: 'ORD-ABC',
      });

      expect(spy).toHaveBeenCalledWith(
        'https://venmo.com/user?txn=pay&amount=25.00&note=ORD-ABC',
        expect.objectContaining({
          width: 300,
          margin: 2,
          color: {
            dark: '#008CFF', // Venmo blue
            light: '#FFFFFF',
          },
        })
      );
    });

    it('should handle QR code generation errors gracefully', async () => {
      const QRCode = await import('qrcode');
      vi.spyOn(QRCode.default, 'toDataURL').mockRejectedValueOnce(
        new Error('QR generation failed')
      );

      await expect(
        generateVenmoQRCode({
          username: 'user',
          amount: 10.0,
          note: 'ORD-ERR',
        })
      ).rejects.toThrow('QR generation failed');
    });
  });

  describe('getVenmoUsername', () => {
    beforeEach(() => {
      // Reset environment variable before each test
      delete process.env.VENMO_USERNAME;
    });

    it('should return Venmo username from environment', () => {
      process.env.VENMO_USERNAME = 'aichiho';

      const username = getVenmoUsername();
      expect(username).toBe('aichiho');
    });

    it('should return null if VENMO_USERNAME not set', () => {
      const username = getVenmoUsername();
      expect(username).toBeNull();
    });

    it('should accept valid Venmo usernames', () => {
      const validUsernames = [
        'testuser',
        'test-user',
        'test_user',
        'test123',
        'aichiho',
      ];

      validUsernames.forEach((username) => {
        process.env.VENMO_USERNAME = username;
        expect(getVenmoUsername()).toBe(username);
      });
    });
  });
});
