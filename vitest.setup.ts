import { expect, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { config } from 'dotenv';
import path from 'path';
import { cleanupTestData, resetProductStock, closeTestDb } from './__tests__/helpers/database';

// Load .env file for integration tests
config({ path: path.resolve(__dirname, '.env') });

// IMPORTANT: Always use test database for tests
process.env.DATABASE_URL = 'postgresql://chiho@localhost:5432/plushie_app_test';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test (React components only)
afterEach(() => {
  cleanup();
});

// Close database connection after all tests
afterAll(async () => {
  if (process.env.DATABASE_URL?.includes('test')) {
    try {
      // Final cleanup before closing
      await resetProductStock();
      await closeTestDb();
    } catch (error) {
      console.error('Failed to close test database:', error);
    }
  }
});
if (!process.env.STRIPE_SECRET_KEY) {
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
}
if (!process.env.RESEND_API_KEY) {
  process.env.RESEND_API_KEY = 're_mock';
}
if (!process.env.VENMO_USERNAME) {
  process.env.VENMO_USERNAME = 'test-venmo';
}
if (!process.env.NEXT_PUBLIC_BASE_URL) {
  process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3002';
}

// Mock Next.js specific modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
  headers: vi.fn(() => ({
    get: vi.fn(),
  })),
}));
