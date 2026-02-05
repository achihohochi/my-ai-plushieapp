# Testing Suite Documentation

**Project:** AI Plushie E-commerce Platform
**Test Framework:** Vitest (Unit/Integration) + Playwright (E2E)
**Status:** Phase 1 Complete - Unit Tests ✅
**Last Updated:** February 4, 2026

---

## 📊 Test Coverage Status

### Unit Tests - ✅ COMPLETE
- **Test Files:** 6 files
- **Total Tests:** 86 tests
- **Status:** All passing ✅
- **Coverage Target:** 80%+ (statements, branches, functions, lines)

---

## 🗂️ Test Directory Structure

```
__tests__/
├── unit/                          # Unit tests (✅ Complete)
│   ├── components/                # React component tests
│   │   └── cart-context.test.tsx     (14 tests)
│   ├── lib/                       # Library/utility tests
│   │   ├── email-generator.test.ts   (13 tests)
│   │   ├── stripe.test.ts            (16 tests)
│   │   └── venmo.test.ts             (13 tests)
│   └── utils/                     # Helper function tests
│       ├── order-number.test.ts      (10 tests)
│       └── price-formatter.test.ts   (20 tests)
│
├── integration/                   # Integration tests (⏳ Next)
│   ├── api/
│   ├── database/
│   └── webhooks/
│
├── e2e/                           # E2E tests (⏳ Future)
│   ├── guest-checkout/
│   ├── cart/
│   ├── products/
│   ├── admin/
│   └── payment/
│
├── fixtures/                      # Test data (✅ Created)
│   ├── products.ts
│   ├── orders.ts
│   └── cart-items.ts
│
├── mocks/                         # Mock services (✅ Created)
│   ├── stripe.ts
│   └── resend.ts
│
└── helpers/                       # Test utilities (⏳ Future)
```

---

## 🧪 Test Suites

### 1. Order Number Generation (`order-number.test.ts`)
**Tests:** 10 | **Status:** ✅ Passing

- ✅ Correct format validation (ORD-YYYYMMDD-XXXX)
- ✅ Date formatting (YYYYMMDD)
- ✅ 4-digit random number generation
- ✅ Leading zero padding
- ✅ Uniqueness testing (high probability)
- ✅ Date change handling
- ✅ Single-digit month/day padding
- ✅ End of year handling
- ✅ Leap year support

**Coverage:** Order number utility functions

---

### 2. Price Formatting (`price-formatter.test.ts`)
**Tests:** 20 | **Status:** ✅ Passing

**Price Formatting (8 tests):**
- ✅ Whole number formatting ($25.00)
- ✅ Decimal precision (2 places)
- ✅ String to number conversion
- ✅ Zero price handling
- ✅ Rounding behavior
- ✅ Large numbers
- ✅ Negative numbers
- ✅ Decimal padding

**Subtotal Calculation (6 tests):**
- ✅ Single item calculation
- ✅ Multiple quantities
- ✅ Multiple items
- ✅ Empty cart (0)
- ✅ Zero quantity handling
- ✅ Decimal price calculations

**Total Calculation (6 tests):**
- ✅ Subtotal only
- ✅ Subtotal + tax
- ✅ Subtotal + shipping
- ✅ Subtotal + tax + shipping
- ✅ Decimal values
- ✅ Zero subtotal

**Coverage:** Cart and pricing utilities

---

### 3. Venmo Utilities (`venmo.test.ts`)
**Tests:** 13 | **Status:** ✅ Passing

**Link Generation (7 tests):**
- ✅ Correct Venmo link format
- ✅ Special character encoding
- ✅ Amount formatting (2 decimals)
- ✅ Decimal amount handling
- ✅ Username special characters
- ✅ Amount rounding
- ✅ Zero amount

**QR Code Generation (3 tests):**
- ✅ QR data URL generation
- ✅ Correct Venmo link encoding
- ✅ Error handling

**Configuration (3 tests):**
- ✅ Environment variable retrieval
- ✅ Null handling (not set)
- ✅ Valid username acceptance

**Coverage:** Venmo payment integration utilities

---

### 4. Stripe Integration (`stripe.test.ts`)
**Tests:** 16 | **Status:** ✅ Passing

**Client Initialization (2 tests):**
- ✅ Missing key error handling
- ✅ API key format validation

**Checkout Session (4 tests):**
- ✅ Dollar to cents conversion
- ✅ Decimal price handling
- ✅ Line item structure
- ✅ Multiple line items

**Webhook Verification (3 tests):**
- ✅ Event type validation
- ✅ Session data extraction
- ✅ Missing signature handling

**Price Calculation (5 tests):**
- ✅ Single item total
- ✅ Multiple quantities
- ✅ Multiple items
- ✅ Stripe amount conversion (cents)
- ✅ Rounding correctness

**Metadata (2 tests):**
- ✅ Metadata structure
- ✅ Special character handling

**Coverage:** Stripe payment processing utilities

---

### 5. Email Generation (`email-generator.test.ts`)
**Tests:** 13 | **Status:** ✅ Passing

- ✅ Valid HTML structure
- ✅ Customer name inclusion
- ✅ Order number display
- ✅ All items listed
- ✅ Item price formatting
- ✅ Item total calculation
- ✅ Price breakdown (subtotal, tax, shipping, total)
- ✅ Shipping address display
- ✅ Single item order
- ✅ Zero tax handling
- ✅ Zero shipping handling
- ✅ HTML escaping (XSS prevention)
- ✅ Special characters in product names

**Coverage:** Order confirmation email generation

---

### 6. Cart Context (`cart-context.test.tsx`)
**Tests:** 14 | **Status:** ✅ Passing

**State Management (3 tests):**
- ✅ Empty cart initialization
- ✅ Total items calculation
- ✅ Total price calculation

**Add Item (3 tests):**
- ✅ New item addition
- ✅ Quantity increment for existing items
- ✅ API error handling

**Remove Item (1 test):**
- ✅ Item removal from cart

**Update Quantity (3 tests):**
- ✅ Quantity update
- ✅ Negative quantity validation
- ✅ Zero quantity handling

**Clear Cart (1 test):**
- ✅ Cart clearing

**Calculations (3 tests):**
- ✅ Empty cart calculations
- ✅ Decimal price handling
- ✅ Large quantity handling

**Coverage:** React cart context and state management

---

## 🚀 Running Tests

### Commands

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run all tests (unit + integration + e2e)
npm test
```

### Example Output

```
Test Files  6 passed (6)
     Tests  86 passed (86)
  Start at  10:45:54
  Duration  457ms
```

---

## 📁 Test Fixtures

### Products (`fixtures/products.ts`)
- `mockProduct` - Single product
- `mockProducts` - Array of 4 products
- `mockProductOutOfStock` - Out of stock product
- `mockProductInactive` - Inactive product

### Orders (`fixtures/orders.ts`)
- `mockOrder` - Basic order
- `mockOrderWithItems` - Order with line items
- `mockVenmoOrder` - Pending Venmo order
- `mockOrderCheckoutData` - Checkout form data

### Cart Items (`fixtures/cart-items.ts`)
- `mockCartItem` - Single cart item with product
- `mockCartItems` - Array of cart items
- `mockEmptyCart` - Empty cart state

---

## 🎭 Test Mocks

### Stripe (`mocks/stripe.ts`)
- `mockStripeCheckoutSession` - Completed checkout session
- `mockStripeWebhookEvent` - Webhook event payload
- `mockStripeError` - API error response
- `mockStripeCardDeclined` - Card declined error

### Resend (`mocks/resend.ts`)
- `mockResendEmailSuccess` - Successful email send
- `mockResendEmailError` - Email validation error
- `mockEmailParams` - Email template parameters

---

## ⚙️ Configuration

### `vitest.config.ts`
- **Environment:** jsdom (for React components)
- **Setup Files:** vitest.setup.ts
- **Coverage Provider:** v8
- **Coverage Thresholds:**
  - Statements: 80%
  - Branches: 75%
  - Functions: 80%
  - Lines: 80%

### `vitest.setup.ts`
- jest-dom matchers
- Automatic cleanup after each test
- Mock environment variables
- Next.js module mocks (navigation, headers, cookies)

---

## 📈 Next Steps

### Phase 2: Integration Tests (Next)
- [ ] API route tests (products, cart, checkout)
- [ ] Database operation tests
- [ ] Webhook handler tests
- [ ] Authentication middleware tests
- [ ] Payment flow integration tests (mocked)

### Phase 3: E2E Tests (Future)
- [ ] Guest checkout flow (Stripe)
- [ ] Guest checkout flow (Venmo)
- [ ] Cart operations
- [ ] Product browsing
- [ ] Admin workflows

### Phase 4: Coverage & CI/CD
- [ ] Achieve 80%+ coverage thresholds
- [ ] Setup GitHub Actions workflow
- [ ] Add pre-commit hooks
- [ ] Configure coverage reporting

---

## 🎯 Testing Best Practices Followed

1. ✅ **Isolated Tests** - Each test is independent
2. ✅ **Descriptive Names** - Clear test descriptions
3. ✅ **AAA Pattern** - Arrange, Act, Assert
4. ✅ **Mock External Dependencies** - No real API calls
5. ✅ **Edge Case Testing** - Zero, negative, large values
6. ✅ **Error Handling** - Test failure paths
7. ✅ **Fixtures & Mocks** - Reusable test data
8. ✅ **Fast Execution** - < 1 second total runtime

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Playwright Documentation](https://playwright.dev)

---

**Status Summary:**
- ✅ Unit Tests: 86/86 passing
- ⏳ Integration Tests: 0 (next phase)
- ⏳ E2E Tests: 0 (future phase)
- 🎯 Total Coverage: TBD (after integration tests)
