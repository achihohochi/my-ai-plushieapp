# Test Strategy - AI Plushie E-commerce

**Product:** AI Plushie E-commerce Platform
**Testing Approach:** Automated + Manual
**Last Updated:** February 4, 2026
**Status:** ✅ Active (P0 Tests Implemented)

---

## Purpose of This Document

This document defines the overall testing strategy for the AI Plushie e-commerce platform. It outlines what types of tests we'll write, which tools we'll use, and how testing integrates into the development workflow.

**Testing Philosophy:**
- **Test early, test often** - Catch bugs before production
- **Automate repetitive tests** - Free up humans for exploratory testing
- **Test what matters** - Focus on critical user paths (checkout, payments)
- **Fast feedback** - Tests run in < 5 minutes on PR

---

## 1. Testing Pyramid

```
        /\
       /  \
      / E2E \          ← Few (slow, expensive, realistic)
     /______\
    /        \
   / Integra- \       ← Some (medium speed, API + DB)
  /    tion    \
 /_____________ \
/               \
/  Unit Tests    \    ← Many (fast, cheap, isolated)
/_________________\
```

**Distribution:**
- **70% Unit Tests** - Fast, isolated component/function tests
- **20% Integration Tests** - API + Database interactions
- **10% E2E Tests** - Critical user flows only

**Current Implementation Status (Feb 4, 2026):**
- ✅ **E2E Tests: 42 tests** - Products, Cart, Checkout, Admin, Payment flows
- ✅ **Integration Tests: 14 tests** - API routes, webhooks, concurrency, idempotency
- ✅ **Unit Tests: 5 tests** - Utilities, formatters, generators
- 📊 **Total: 61 automated tests** covering critical revenue paths

**For detailed breakdown, see:** [__tests__/e2e/TEST_COMPLETION_SUMMARY.md](../../__tests__/e2e/TEST_COMPLETION_SUMMARY.md)

---

## 2. Testing Tools & Framework

### 2.1 Tech Stack

| Test Type | Framework | Purpose | Speed |
|-----------|-----------|---------|-------|
| **Frontend Unit** | Vitest + React Testing Library | Test React components | ⚡ Very Fast |
| **Backend Unit** | Vitest | Test API logic, utilities | ⚡ Very Fast |
| **Integration** | Vitest + Test Database | Test API + DB together | 🐢 Medium |
| **E2E** | Playwright | Test full user flows | 🐢 Slow |
| **Accessibility** | jest-axe + Playwright | WCAG compliance | ⚡ Fast |
| **Performance** | Lighthouse CI | Page speed metrics | 🐢 Medium |

---

### 2.2 Why These Tools?

#### **Vitest** (Unit & Integration)
- ⚡ **5-10x faster than Jest** - Hot module reloading
- 🎯 **Drop-in Jest replacement** - Same API, easy migration
- 🔥 **Native ESM support** - Works perfectly with Next.js App Router
- 📊 **Built-in coverage** - No extra plugins needed
- 🎨 **UI Mode** - Interactive test runner

**Installation:**
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

---

#### **Playwright** (E2E)
- 🌐 **Cross-browser testing** - Chrome, Firefox, Safari
- 📱 **Mobile emulation** - Test on iPhone, Android
- 🎥 **Video recording** - Auto-record failures
- 📸 **Screenshots** - Capture state at each step
- 🤖 **Auto-waiting** - No more flaky tests (waits for elements)
- 🔍 **Network interception** - Mock API calls, test edge cases

**Installation:**
```bash
npm install -D @playwright/test
npx playwright install
```

---

## 3. Test Environments

### 3.1 Local Development
```bash
# Run unit tests (watch mode)
npm run test:unit:watch

# Run all tests
npm run test:all

# Run E2E tests
npm run test:e2e
```

**Environment:**
- **Database:** Local PostgreSQL or Docker container
- **API:** `http://localhost:3002`
- **Browser:** Headless (can toggle to headed for debugging)

---

### 3.2 CI/CD (GitHub Actions)
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: plushie_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/plushie_test

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

**Environment:**
- **Database:** PostgreSQL Docker container (isolated)
- **API:** Temporary Next.js server
- **Browser:** Chromium (headless)
- **Runs on:** Every push, every PR

---

### 3.3 Test Database Strategy

**Separate Test Database:**
```
Production:  plushie_db
Development: plushie_dev
Testing:     plushie_test  ← Isolated, safe to wipe
```

**Setup:**
```bash
# Create test database
createdb plushie_test

# Run migrations
DATABASE_URL=postgresql://localhost:5432/plushie_test npx prisma migrate dev
```

**Before Each Test:**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
  // Clear all tables
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

---

## 4. Test Coverage Goals

### 4.1 Coverage Targets

| Code Area | Coverage Goal | Priority | Rationale |
|-----------|---------------|----------|-----------|
| **Payment logic** | 100% | Critical | Money involved, zero tolerance for bugs |
| **API routes** | 90%+ | Critical | Backend logic must be bulletproof |
| **Database queries** | 90%+ | Critical | Data integrity is critical |
| **React components** | 80%+ | High | UI bugs affect user experience |
| **Utilities** | 90%+ | High | Shared code used everywhere |
| **Config files** | 50%+ | Low | Less critical, mostly static |

**How to Check Coverage:**
```bash
npm run test:unit -- --coverage
open coverage/index.html
```

---

### 4.2 What NOT to Test

**Skip testing:**
- ❌ Third-party libraries (Stripe, NextAuth - assume they work)
- ❌ Next.js internals (routing, image optimization)
- ❌ Simple getters/setters (e.g., `getPrice() { return this.price; }`)
- ❌ Trivial type definitions
- ❌ Configuration files (unless complex logic)

**Why?**
- Wastes time testing code you don't own
- Slows down test suite
- False sense of security

---

## 5. Types of Tests

### 5.1 Unit Tests (70% of tests)

**What:** Test individual functions/components in isolation

**Example: Testing a utility function**
```typescript
// app/utils/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// __tests__/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import { isValidEmail } from '@/utils/validation';

describe('isValidEmail', () => {
  it('returns true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('returns false for email without @', () => {
    expect(isValidEmail('testexample.com')).toBe(false);
  });

  it('returns false for email without domain', () => {
    expect(isValidEmail('test@')).toBe(false);
  });
});
```

**Example: Testing a React component**
```typescript
// components/ProductCard.tsx
export function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'AI Bunny',
    price: 24.99,
    image: '/bunny.jpg',
  };

  it('displays product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('AI Bunny')).toBeInTheDocument();
  });

  it('displays product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$24.99')).toBeInTheDocument();
  });

  it('has add to cart button', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });
});
```

**Speed:** < 1 second for 100 tests

---

### 5.2 Integration Tests (20% of tests)

**What:** Test multiple units working together (API + Database)

**Example: API route with database**
```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: 'active' },
  });
  return NextResponse.json({ products });
}

// __tests__/api/products.test.ts
import { GET } from '@/app/api/products/route';
import prisma from '@/lib/prisma';

describe('GET /api/products', () => {
  beforeEach(async () => {
    // Seed test data
    await prisma.product.create({
      data: {
        name: 'Test Plushie',
        price: 19.99,
        status: 'active',
      },
    });
  });

  afterEach(async () => {
    await prisma.product.deleteMany();
  });

  it('returns active products', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Test Plushie');
  });

  it('excludes inactive products', async () => {
    await prisma.product.create({
      data: {
        name: 'Inactive Plushie',
        price: 15.99,
        status: 'inactive',
      },
    });

    const response = await GET();
    const data = await response.json();

    expect(data.products).toHaveLength(1); // Only active product
  });
});
```

**Speed:** 1-5 seconds per test (database I/O)

---

### 5.3 E2E Tests (10% of tests)

**What:** Test entire user flows from browser perspective

**Example: Checkout flow**
```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('guest can complete purchase', async ({ page }) => {
  // 1. Browse products
  await page.goto('http://localhost:3002/shop');
  await expect(page.locator('h1')).toContainText('Shop Plushies');

  // 2. View product details
  await page.click('text=AI Bunny');
  await expect(page.locator('h1')).toContainText('AI Bunny');

  // 3. Add to cart
  await page.click('button:has-text("Add to Cart")');
  await expect(page.locator('[aria-label="Cart"]')).toContainText('1');

  // 4. Go to checkout
  await page.click('[aria-label="Cart"]');
  await page.click('button:has-text("Checkout")');

  // 5. Fill shipping info
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="address"]', '123 Main St');
  await page.fill('input[name="city"]', 'San Francisco');
  await page.selectOption('select[name="state"]', 'CA');
  await page.fill('input[name="zip"]', '94102');

  await page.click('button:has-text("Continue to Payment")');

  // 6. Fill payment (Stripe test card)
  const stripeFrame = page.frameLocator('iframe[name*="stripe"]');
  await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
  await stripeFrame.locator('input[name="exp-date"]').fill('12/30');
  await stripeFrame.locator('input[name="cvc"]').fill('123');
  await stripeFrame.locator('input[name="postal"]').fill('94102');

  // 7. Complete purchase
  await page.click('button:has-text("Complete Purchase")');

  // 8. Verify order confirmation
  await expect(page.locator('h1')).toContainText('Order Confirmed', { timeout: 10000 });
  await expect(page.locator('text=/Order #PLU-/')).toBeVisible();
});
```

**Speed:** 30-60 seconds per test (real browser, network requests)

**Critical Paths Implemented:**
- ✅ **Guest checkout** - Stripe & Venmo flows (18 tests)
- ✅ **Product browsing** - View products, navigate details (4 tests)
- ✅ **Shopping cart** - Add, update, remove, persist (6 tests)
- ✅ **Admin authentication** - Login, session, protected routes (8 tests)
- ✅ **Admin Venmo verification** - Verify/reject payments (9 tests)
- ⏳ User login → checkout with saved address (P1 - Future)
- ⏳ Apply discount code (P1 - Future)
- ⏳ Order tracking (P1 - Future)

---

### 5.4 Accessibility Tests

**What:** Automated WCAG compliance checks

**Example: Component accessibility**
```typescript
// __tests__/components/ProductCard.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProductCard } from '@/components/ProductCard';

expect.extend(toHaveNoViolations);

describe('ProductCard accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Example: Page accessibility (E2E)**
```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('http://localhost:3002');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

### 5.5 Performance Tests

**What:** Measure page load speed, Lighthouse scores

**GitHub Action:**
```yaml
- name: Run Lighthouse
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      http://localhost:3002
      http://localhost:3002/shop
      http://localhost:3002/cart
    uploadArtifacts: true
    temporaryPublicStorage: true
```

**Target Scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 90+
- SEO: 90+

---

## 6. Test Organization

### 6.1 Directory Structure

```
my-ai-plushieapp/
├── __tests__/                           # All tests
│   ├── unit/                            # Unit tests
│   │   ├── utils/
│   │   │   ├── order-number.test.ts
│   │   │   └── price-formatter.test.ts
│   │   └── lib/
│   │       ├── stripe.test.ts
│   │       ├── venmo.test.ts
│   │       └── email-generator.test.ts
│   ├── integration/                     # Integration tests (API + DB)
│   │   ├── api/
│   │   │   ├── products.test.ts
│   │   │   ├── cart.test.ts
│   │   │   ├── checkout.test.ts
│   │   │   ├── checkout-concurrency.test.ts
│   │   │   ├── checkout-idempotency.test.ts
│   │   │   ├── transaction-safety.test.ts
│   │   │   └── admin.test.ts
│   │   └── webhooks/
│   │       ├── stripe-webhook.test.ts
│   │       └── stripe-webhook-duplicates.test.ts
│   └── e2e/                             # E2E tests (42 tests)
│       ├── products/
│       │   └── product-browsing.spec.ts (4 tests)
│       ├── cart/
│       │   └── cart-operations.spec.ts  (6 tests)
│       ├── guest-checkout/
│       │   └── guest-checkout.spec.ts   (5 tests)
│       ├── admin/                       ✅ NEW
│       │   ├── admin-auth.spec.ts       (8 tests)
│       │   └── admin-venmo.spec.ts      (9 tests)
│       ├── payment/                     ✅ NEW
│       │   ├── stripe-checkout.spec.ts  (8 tests)
│       │   └── venmo-checkout.spec.ts   (10 tests)
│       ├── pages/                       # Page Object Models
│       │   ├── ShopPage.ts
│       │   ├── CartPage.ts
│       │   ├── CheckoutPage.ts
│       │   ├── AdminLoginPage.ts        ✅ NEW
│       │   ├── AdminDashboardPage.ts    ✅ NEW
│       │   └── AdminVenmoPage.ts        ✅ NEW
│       ├── TEST_COVERAGE_PLAN.md        ✅ NEW
│       └── TEST_COMPLETION_SUMMARY.md   ✅ NEW
├── vitest.config.ts                     # Vitest configuration
├── vitest.setup.ts                      # Vitest setup
├── playwright.config.ts                 # Playwright configuration
├── test-results/                        # Test execution results
└── coverage/                            # Generated coverage reports
```

**Key Changes from Planning:**
- ✅ **42 E2E tests implemented** (up from 0)
- ✅ **Admin tests added** - Authentication & Venmo verification
- ✅ **Payment tests added** - Complete Stripe & Venmo flows
- ✅ **Page Object Models** - 6 reusable page classes
- ✅ **Integration tests** - 14 API + DB tests with concurrency/idempotency
- ✅ **Unit tests** - 5 utility/lib tests

---

### 6.2 Naming Conventions

**Unit/Integration Tests:**
- Pattern: `<filename>.test.ts` or `<filename>.test.tsx`
- Example: `ProductCard.test.tsx`

**E2E Tests:**
- Pattern: `<feature>.spec.ts`
- Example: `checkout.spec.ts`

**Accessibility Tests:**
- Pattern: `<filename>.a11y.test.tsx`
- Example: `ProductCard.a11y.test.tsx`

---

## 7. Configuration Files

### 7.1 Vitest Config

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '__tests__/',
        'e2e/',
        '*.config.ts',
        '.next/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
```

**vitest.setup.ts:**
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

---

### 7.2 Playwright Config

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

---

## 8. NPM Scripts

**package.json:**
```json
{
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "test": "npm run test:all",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:unit:ui": "vitest --ui",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:unit && npm run test:e2e",
    "test:coverage": "vitest run --coverage",
    "playwright:install": "playwright install --with-deps"
  }
}
```

---

## 9. Testing Workflow

### 9.1 Developer Workflow

**Step 1: Write feature code**
```bash
# Create new component
touch components/ProductCard.tsx
```

**Step 2: Write tests (TDD preferred)**
```bash
# Create test file
touch __tests__/components/ProductCard.test.tsx

# Run in watch mode (auto-rerun on save)
npm run test:unit:watch
```

**Step 3: Verify coverage**
```bash
npm run test:coverage
open coverage/index.html
```

**Step 4: Run E2E tests (if touched critical paths)**
```bash
npm run test:e2e
```

**Step 5: Push to GitHub**
```bash
git add .
git commit -m "feat: add ProductCard component"
git push origin feature/product-card
```

**Step 6: CI runs automatically**
- GitHub Actions runs all tests
- PR blocked if tests fail
- Merge when green ✅

---

### 9.2 Pre-commit Hooks (Optional)

**Install Husky:**
```bash
npm install -D husky lint-staged
npx husky init
```

**.husky/pre-commit:**
```bash
#!/bin/sh
npm run test:unit -- --changed
```

**Result:** Tests run automatically before every commit

---

## 10. Test Data Management

### 10.1 Fixtures (Reusable Test Data)

**__tests__/fixtures/products.ts:**
```typescript
export const mockProduct = {
  id: 1,
  name: 'AI Bunny Plushie',
  description: 'Cute and cuddly AI-themed bunny',
  price: 24.99,
  stock: 10,
  image: '/bunny.jpg',
  status: 'active',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

export const mockProducts = [
  mockProduct,
  {
    id: 2,
    name: 'Robot Plushie',
    description: 'Metallic robot plushie',
    price: 29.99,
    stock: 5,
    image: '/robot.jpg',
    status: 'active',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
];
```

**Usage:**
```typescript
import { mockProduct } from '@/__tests__/fixtures/products';

describe('ProductCard', () => {
  it('displays product', () => {
    render(<ProductCard product={mockProduct} />);
    // ...
  });
});
```

---

### 10.2 Database Seeding

**prisma/seed-test.ts:**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedTestDatabase() {
  // Create test products
  await prisma.product.createMany({
    data: [
      {
        name: 'Test Product 1',
        price: 19.99,
        stock: 10,
        status: 'active',
      },
      {
        name: 'Test Product 2',
        price: 24.99,
        stock: 5,
        status: 'active',
      },
    ],
  });

  // Create test user
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashedpassword123',
      name: 'Test User',
    },
  });
}

export async function clearTestDatabase() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
}
```

---

## 11. Mocking Strategies

### 11.1 Mock External APIs (Stripe)

**__tests__/mocks/stripe.ts:**
```typescript
import { vi } from 'vitest';

export const mockStripe = {
  paymentIntents: {
    create: vi.fn().mockResolvedValue({
      id: 'pi_test_123',
      client_secret: 'pi_test_123_secret',
      status: 'succeeded',
    }),
  },
};

vi.mock('stripe', () => ({
  default: vi.fn(() => mockStripe),
}));
```

---

### 11.2 Mock Next.js Router

```typescript
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/shop',
}));
```

---

## 12. Debugging Tests

### 12.1 Vitest UI Mode

```bash
npm run test:unit:ui
```

**Opens:** http://localhost:51204/__vitest__/

**Features:**
- See all tests in browser
- Click to run individual tests
- Inspect test results
- View coverage

---

### 12.2 Playwright Debug Mode

```bash
npm run test:e2e:debug
```

**Features:**
- Step through test line by line
- Pause at breakpoints
- Inspect DOM
- View network requests

---

### 12.3 Console Logs in Tests

```typescript
it('debugs component state', () => {
  const { debug } = render(<ProductCard product={mockProduct} />);

  // Print current DOM
  debug();

  // Or use console.log
  console.log(screen.getByText('AI Bunny'));
});
```

---

## 13. Continuous Monitoring

### 13.1 Test Metrics to Track

| Metric | Tool | Goal |
|--------|------|------|
| **Code coverage** | Codecov | 80%+ |
| **Test execution time** | GitHub Actions | < 5 min |
| **Flaky test rate** | Playwright report | < 1% |
| **PR test failures** | GitHub Actions | 0 (blocking) |

---

### 13.2 Codecov Integration

**Automatic Coverage Tracking:**
- Every PR shows coverage diff
- Blocks merge if coverage drops > 1%
- Shows which lines are uncovered

**Setup:**
1. Sign up at codecov.io
2. Add repo
3. GitHub Action uploads coverage automatically

---

## 14. Testing Best Practices

### ✅ Do's

- ✅ **Write tests before code (TDD)** - Clarifies requirements
- ✅ **Test behavior, not implementation** - Tests survive refactoring
- ✅ **Use descriptive test names** - "it displays product name and price"
- ✅ **One assertion per test (when possible)** - Easier to debug
- ✅ **Mock external dependencies** - Tests are isolated and fast
- ✅ **Test edge cases** - Empty arrays, null values, errors
- ✅ **Test user flows, not internal APIs** - E2E tests mimic real users

---

### ❌ Don'ts

- ❌ **Don't test implementation details** - `expect(component.state.count).toBe(5)` → Bad
- ❌ **Don't use snapshots excessively** - Hard to maintain, brittle
- ❌ **Don't skip tests with `test.skip`** - Either fix or delete
- ❌ **Don't test third-party libraries** - Trust they work
- ❌ **Don't write slow tests** - Mock API calls, use test DB
- ❌ **Don't ignore flaky tests** - Fix root cause or delete

---

## 15. Definition of "Tested"

A feature is considered **fully tested** when:

- [ ] Unit tests cover all functions/components (80%+ coverage)
- [ ] Integration tests cover API + database interactions
- [ ] E2E test covers happy path (critical flow only)
- [ ] Accessibility test passes (0 violations)
- [ ] All tests pass on CI (green PR)
- [ ] Manual testing completed (if complex UI)
- [ ] Edge cases tested (errors, empty states, loading)
- [ ] Performance benchmarks met (if applicable)

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial draft |
| 2.0 | 2026-02-04 | Implementation | ✅ Added actual test implementation details, updated structure |

**Related Documents:**
- [TEST_PLAN.md](./TEST_PLAN.md) - Detailed test plan by phase
- [TEST_CASES.md](./TEST_CASES.md) - Specific test scenarios
- [PERFORMANCE_BENCHMARKS.md](./PERFORMANCE_BENCHMARKS.md) - Performance requirements
- [../../__tests__/e2e/TEST_COMPLETION_SUMMARY.md](../../__tests__/e2e/TEST_COMPLETION_SUMMARY.md) - ✅ **Actual implemented tests (42 tests)**
- [../../__tests__/e2e/TEST_COVERAGE_PLAN.md](../../__tests__/e2e/TEST_COVERAGE_PLAN.md) - Full coverage roadmap (P0/P1/P2)

---

**End of Test Strategy Document**
