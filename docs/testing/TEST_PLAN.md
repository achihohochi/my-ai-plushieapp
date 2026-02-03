# Test Plan - AI Plushie E-commerce

**Product:** AI Plushie E-commerce Platform
**Test Framework:** Vitest + Playwright
**Last Updated:** February 2, 2026
**Status:** Draft

---

## Purpose of This Document

This document provides a detailed test plan outlining WHAT to test, WHEN to test it, and WHO is responsible. It breaks down testing by development phase and feature area.

---

## 1. Testing Phases

### Phase 1: Foundation (Weeks 1-2)

**Features to Test:**
- Database schema and migrations
- User authentication (registration, login)
- Product catalog API
- Basic product listing page

#### Unit Tests
| Component | Test Cases | Owner | Status |
|-----------|------------|-------|--------|
| Database models | CRUD operations | Backend Dev | ⏳ Pending |
| Validation utilities | Email, password, address | Backend Dev | ⏳ Pending |
| Auth API routes | Register, login, logout | Backend Dev | ⏳ Pending |
| Product API routes | GET /api/products | Backend Dev | ⏳ Pending |
| ProductCard component | Renders name, price, image | Frontend Dev | ⏳ Pending |
| ProductGrid component | Grid layout, responsive | Frontend Dev | ⏳ Pending |

#### Integration Tests
| Feature | Test Scenario | Owner | Status |
|---------|---------------|-------|--------|
| User registration | POST /api/auth/register creates user in DB | Backend Dev | ⏳ Pending |
| User login | POST /api/auth/login returns valid JWT | Backend Dev | ⏳ Pending |
| Product listing | GET /api/products returns active products from DB | Backend Dev | ⏳ Pending |

#### E2E Tests
| User Flow | Test Steps | Owner | Status |
|-----------|------------|-------|--------|
| Browse products | Navigate to /shop, see products | QA | ⏳ Pending |
| View product details | Click product, see details page | QA | ⏳ Pending |

**Exit Criteria:**
- [ ] All unit tests pass
- [ ] 80%+ code coverage
- [ ] Integration tests pass with test database
- [ ] E2E smoke tests pass
- [ ] Manual testing: Can browse products

---

### Phase 2: Shopping (Weeks 3-4)

**Features to Test:**
- Product detail pages
- Shopping cart functionality
- Cart persistence (localStorage + database)

#### Unit Tests
| Component | Test Cases | Owner | Status |
|-----------|------------|-------|--------|
| CartContext | Add item, remove item, update quantity | Frontend Dev | ⏳ Pending |
| CartSidebar component | Displays items, totals | Frontend Dev | ⏳ Pending |
| Cart API routes | POST /api/cart, GET /api/cart | Backend Dev | ⏳ Pending |
| ProductDetail component | Quantity selector, add to cart button | Frontend Dev | ⏳ Pending |

#### Integration Tests
| Feature | Test Scenario | Owner | Status |
|---------|---------------|-------|--------|
| Add to cart | POST /api/cart saves item to DB | Backend Dev | ⏳ Pending |
| Cart sync | Guest cart merges with user cart on login | Backend Dev | ⏳ Pending |
| Cart persistence | Cart survives page refresh | Frontend Dev | ⏳ Pending |

#### E2E Tests
| User Flow | Test Steps | Owner | Status |
|-----------|------------|-------|--------|
| Add to cart | Click "Add to Cart", see cart badge update | QA | ⏳ Pending |
| Update cart | Change quantity, remove item | QA | ⏳ Pending |
| Cart persists | Add item, close browser, reopen, cart still has item | QA | ⏳ Pending |

**Exit Criteria:**
- [ ] All cart operations work correctly
- [ ] Cart persists across sessions
- [ ] Cart syncs on login (guest → user)
- [ ] Mobile cart sidebar swipes closed

---

### Phase 3: Checkout (Weeks 5-6)

**Features to Test:**
- Guest checkout flow
- Stripe payment integration
- Order confirmation emails
- Venmo QR payment option

#### Unit Tests
| Component | Test Cases | Owner | Status |
|-----------|------------|-------|--------|
| Checkout form components | Validation, error messages | Frontend Dev | ⏳ Pending |
| Order creation logic | Calculate totals, tax, shipping | Backend Dev | ⏳ Pending |
| Payment API routes | POST /api/checkout/stripe | Backend Dev | ⏳ Pending |
| Email templates | Order confirmation HTML | Backend Dev | ⏳ Pending |

#### Integration Tests
| Feature | Test Scenario | Owner | Status |
|-----------|------------|-------|--------|
| Guest checkout | Complete checkout without login | Backend Dev | ⏳ Pending |
| Stripe payment | Create payment intent, process payment | Backend Dev | ⏳ Pending |
| Order creation | Order saved to DB with line items | Backend Dev | ⏳ Pending |
| Email sending | Confirmation email sent via SendGrid | Backend Dev | ⏳ Pending |

#### E2E Tests
| User Flow | Test Steps | Owner | Status |
|-----------|------------|-------|--------|
| **Guest checkout (CRITICAL)** | Add to cart → Checkout → Fill shipping → Pay with Stripe → Confirm | QA | ⏳ Pending |
| Registered user checkout | Login → Checkout with saved address → Pay → Confirm | QA | ⏳ Pending |
| Venmo payment | Select Venmo → Scan QR → Enter transaction ID → Confirm | QA | ⏳ Pending |
| Invalid card | Enter invalid card → See error message | QA | ⏳ Pending |

#### Security Tests
| Test Case | Description | Owner | Status |
|-----------|-------------|-------|--------|
| SQL injection | Try SQL in form fields | Security | ⏳ Pending |
| XSS attack | Try `<script>` tags in inputs | Security | ⏳ Pending |
| CSRF protection | Verify CSRF tokens on forms | Security | ⏳ Pending |
| Payment security | Verify card data never touches our servers | Security | ⏳ Pending |

**Exit Criteria:**
- [ ] Guest checkout works end-to-end
- [ ] Stripe payments process successfully
- [ ] Order confirmation emails arrive within 30 seconds
- [ ] Security tests pass (no vulnerabilities)
- [ ] PCI compliance verified (card data tokenized)

---

### Phase 4: Admin & Polish (Weeks 7-8)

**Features to Test:**
- Google Sheets inventory sync
- Admin order dashboard
- Venmo payment verification
- Performance optimization
- Accessibility audit

#### Unit Tests
| Component | Test Cases | Owner | Status |
|-----------|------------|-------|--------|
| Google Sheets API client | Fetch rows, parse data | Backend Dev | ⏳ Pending |
| Inventory sync logic | Update products from sheet | Backend Dev | ⏳ Pending |
| Admin API routes | GET /api/admin/orders | Backend Dev | ⏳ Pending |

#### Integration Tests
| Feature | Test Scenario | Owner | Status |
|---------|---------------|-------|--------|
| Inventory sync | Cron job updates products every 5 min | Backend Dev | ⏳ Pending |
| Admin authentication | Only admins can access /admin | Backend Dev | ⏳ Pending |
| Order updates | Admin changes order status, customer gets email | Backend Dev | ⏳ Pending |

#### E2E Tests
| User Flow | Test Steps | Owner | Status |
|-----------|------------|-------|--------|
| Admin login | Login as admin, see dashboard | QA | ⏳ Pending |
| Update inventory | Change price in Google Sheet, verify on site | QA | ⏳ Pending |
| Process order | View order, mark as shipped, add tracking | QA | ⏳ Pending |

#### Performance Tests
| Page | Target | Metric | Owner | Status |
|------|--------|--------|-------|--------|
| Homepage | < 2s | LCP | DevOps | ⏳ Pending |
| Product listing | < 3s | LCP | DevOps | ⏳ Pending |
| Product detail | < 2s | LCP | DevOps | ⏳ Pending |
| Checkout | < 3s | LCP | DevOps | ⏳ Pending |

**Performance Testing Tool:** Lighthouse CI

#### Accessibility Tests
| Page | Tool | Target | Owner | Status |
|------|------|--------|-------|--------|
| All pages | axe DevTools | 0 violations | QA | ⏳ Pending |
| All pages | Lighthouse | 100 score | QA | ⏳ Pending |
| Checkout flow | Screen reader (NVDA) | Fully navigable | QA | ⏳ Pending |
| Mobile pages | TalkBack | Fully navigable | QA | ⏳ Pending |

**Exit Criteria:**
- [ ] Inventory syncs from Google Sheets every 5 minutes
- [ ] Admin can manage orders
- [ ] All pages load in < 3 seconds
- [ ] Lighthouse Performance score 90+
- [ ] 0 accessibility violations

---

### Phase 5: Launch Prep (Week 9)

**Features to Test:**
- Accessibility final audit
- End-to-end regression testing
- Production deployment
- Monitoring and alerts

#### Regression Tests
| Test Suite | Description | Owner | Status |
|------------|-------------|-------|--------|
| Full E2E suite | Run all E2E tests on staging | QA | ⏳ Pending |
| Smoke tests | Test critical paths on production | QA | ⏳ Pending |
| Cross-browser | Test on Chrome, Safari, Firefox, Edge | QA | ⏳ Pending |
| Mobile devices | Test on iPhone, Android | QA | ⏳ Pending |

#### Load Tests
| Test | Description | Tool | Owner | Status |
|------|-------------|------|-------|--------|
| Homepage under load | 100 concurrent users | k6 or Artillery | DevOps | ⏳ Pending |
| Checkout under load | 50 concurrent checkouts | k6 | DevOps | ⏳ Pending |
| Database performance | Query performance under load | pgBench | DevOps | ⏳ Pending |

**Exit Criteria:**
- [ ] All regression tests pass
- [ ] Site works on all target browsers
- [ ] Site works on all target devices
- [ ] Load tests pass (no errors at 100 concurrent users)
- [ ] Monitoring and alerts configured
- [ ] Rollback plan tested

---

## 2. Test Execution Schedule

### Daily (During Development)
- **Unit tests:** Run automatically on file save (watch mode)
- **Lint checks:** Pre-commit hook runs ESLint
- **Type checks:** Pre-commit hook runs TypeScript compiler

### On Every Pull Request
- **Unit tests:** All unit tests must pass (GitHub Actions)
- **Integration tests:** All integration tests must pass
- **Code coverage:** Must meet 80% threshold
- **Lint & format:** ESLint + Prettier checks
- **Build check:** Next.js build must succeed

### Before Merging to Main
- **E2E tests:** Critical paths must pass
- **Code review:** At least 1 approval required
- **Manual testing:** QA spot-checks feature

### Weekly (Staging Environment)
- **Full E2E suite:** All E2E tests on staging
- **Performance tests:** Lighthouse audit
- **Accessibility tests:** axe full scan
- **Security scan:** Dependency vulnerabilities check

### Before Production Deployment
- **Smoke tests:** Test critical paths on production
- **Rollback test:** Verify rollback procedure works
- **Monitoring check:** Verify alerts are working

---

## 3. Test Coverage by Feature

### 3.1 Product Catalog

**Unit Tests:**
```typescript
// Product listing
✅ Displays products in grid
✅ Filters by price range
✅ Sorts by price (high/low)
✅ Shows "Sold Out" badge for out-of-stock items
✅ Lazy loads images
✅ Pagination works (20 products per page)

// Product detail
✅ Displays product name, price, description
✅ Shows product images (zoomable)
✅ Quantity selector (min 1, max = stock)
✅ Add to cart button disabled when out of stock
✅ Shows stock availability ("Only 3 left!")
```

**Integration Tests:**
```typescript
✅ GET /api/products returns products from database
✅ GET /api/products/:id returns single product
✅ Products filter by status (active only)
✅ Out-of-stock products cannot be added to cart
```

**E2E Tests:**
```typescript
✅ User can browse products
✅ User can view product details
✅ User can add product to cart
```

---

### 3.2 Shopping Cart

**Unit Tests:**
```typescript
// Cart context
✅ Add item to cart
✅ Remove item from cart
✅ Update item quantity
✅ Calculate cart subtotal
✅ Calculate cart total (with shipping)
✅ Clear cart
✅ Get item count

// Cart sidebar
✅ Displays cart items
✅ Shows item image, name, price, quantity
✅ Shows cart total
✅ "Proceed to Checkout" button
✅ Empty cart state
✅ Swipe to close (mobile)
```

**Integration Tests:**
```typescript
✅ POST /api/cart adds item to database (logged-in user)
✅ Cart persists across sessions (localStorage for guests)
✅ Cart syncs on login (merge guest cart with user cart)
✅ Cart validates stock availability
✅ Cart updates when product price changes
```

**E2E Tests:**
```typescript
✅ User adds item to cart, sees badge update
✅ User updates quantity in cart
✅ User removes item from cart
✅ Cart persists after page refresh
✅ Guest cart merges with user cart on login
```

---

### 3.3 Checkout & Payment

**Unit Tests:**
```typescript
// Checkout forms
✅ Email validation (format, required)
✅ Address validation (required fields, ZIP format)
✅ Credit card validation (via Stripe)
✅ Error messages display correctly
✅ Form submits only when valid

// Order creation
✅ Calculate order total (subtotal + tax + shipping)
✅ Generate order number (PLU-YYYYMMDD-XXXXX)
✅ Save order to database
✅ Reduce product stock quantity
✅ Send order confirmation email
```

**Integration Tests:**
```typescript
✅ POST /api/checkout/stripe creates payment intent
✅ POST /api/checkout/stripe processes payment
✅ Stripe webhooks update order status
✅ Order confirmation email sent via SendGrid
✅ Failed payments do not create orders
✅ Orders saved with line items
```

**E2E Tests:**
```typescript
✅ Guest completes checkout with Stripe
✅ Registered user checks out with saved address
✅ User checks out with Venmo QR
✅ Declined card shows error message
✅ User receives order confirmation email
✅ Order appears in user's order history
```

---

### 3.4 User Authentication

**Unit Tests:**
```typescript
// Registration
✅ Email validation (format, uniqueness)
✅ Password validation (length, strength)
✅ Password hashing (bcrypt)
✅ Email verification token generation
✅ Age confirmation (13+)

// Login
✅ Email/password authentication
✅ JWT token generation
✅ Session creation
✅ Account lockout after 5 failed attempts
✅ "Remember me" extends session to 30 days
```

**Integration Tests:**
```typescript
✅ POST /api/auth/register creates user in database
✅ POST /api/auth/login returns valid JWT
✅ POST /api/auth/logout invalidates session
✅ POST /api/auth/forgot-password sends reset email
✅ Duplicate email registration fails
```

**E2E Tests:**
```typescript
✅ User registers new account
✅ User verifies email
✅ User logs in
✅ User logs out
✅ User resets password
✅ User updates profile
✅ User deletes account
```

---

### 3.5 Admin Features

**Unit Tests:**
```typescript
// Google Sheets sync
✅ Fetch rows from Google Sheets
✅ Parse row data (product_id, name, price, stock)
✅ Validate data (price > 0, stock >= 0)
✅ Update products in database
✅ Send alert email on invalid data

// Admin dashboard
✅ Display orders (newest first)
✅ Filter orders by status, date, payment method
✅ Update order status
✅ Export orders to CSV
```

**Integration Tests:**
```typescript
✅ Cron job syncs inventory every 5 minutes
✅ Admin authentication required for /api/admin/*
✅ PUT /api/admin/orders/:id updates order
✅ Admin updates trigger customer notification emails
```

**E2E Tests:**
```typescript
✅ Admin logs in to dashboard
✅ Admin views orders
✅ Admin updates order status to "Shipped"
✅ Admin updates product price in Google Sheet
✅ Price change reflects on site within 10 minutes
```

---

## 4. Test Data Management

### 4.1 Test Fixtures

**Location:** `__tests__/fixtures/`

**Files:**
- `products.ts` - Mock product data
- `users.ts` - Mock user data
- `orders.ts` - Mock order data

**Usage:**
```typescript
import { mockProduct, mockProducts } from '@/__tests__/fixtures/products';
```

---

### 4.2 Database Seeding

**Seed Script:** `prisma/seed-test.ts`

**Run:**
```bash
DATABASE_URL=postgresql://localhost:5432/plushie_test node prisma/seed-test.ts
```

**Seeds:**
- 10 sample products
- 3 sample users (1 admin)
- 5 sample orders

---

### 4.3 Cleanup Between Tests

**Strategy:** Clear all tables before each test suite

```typescript
beforeEach(async () => {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});
```

---

## 5. Test Environment Setup

### 5.1 Local Development

**Requirements:**
- Node.js 18+
- PostgreSQL 15+
- npm packages installed

**Setup:**
```bash
# Install dependencies
npm install

# Create test database
createdb plushie_test

# Run migrations
DATABASE_URL=postgresql://localhost:5432/plushie_test npx prisma migrate dev

# Install Playwright browsers
npx playwright install

# Run tests
npm run test:unit
npm run test:e2e
```

---

### 5.2 CI/CD (GitHub Actions)

**Triggers:**
- On push to any branch
- On pull request creation/update

**Test Jobs:**
1. **Lint & Type Check** (fastest, runs first)
2. **Unit Tests** (parallel with integration)
3. **Integration Tests** (with PostgreSQL service)
4. **E2E Tests** (slowest, runs last)
5. **Build Check** (verify production build works)

**Caching:**
- npm dependencies cached
- Playwright browsers cached
- Next.js build cache cached

**Artifacts:**
- Test coverage reports
- Playwright HTML reports
- Screenshots on failure

---

## 6. Roles & Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Frontend Developer** | Write unit tests for React components, E2E tests for UI flows |
| **Backend Developer** | Write unit tests for API routes, integration tests for database |
| **QA Engineer** | Write E2E tests for critical paths, manual exploratory testing |
| **DevOps Engineer** | Configure CI/CD, performance tests, load tests |
| **Security Engineer** | Penetration testing, security audits before launch |
| **Product Manager** | Define test scenarios, acceptance criteria, usability testing |

---

## 7. Test Reporting

### 7.1 Daily Reports (Automated)

**Slack Notifications:**
- ✅ All tests passed on PR
- ❌ Tests failed on PR (with link to logs)
- 📊 Coverage decreased by > 1%

**GitHub PR Comments:**
- Test results summary
- Coverage diff
- Lighthouse scores

---

### 7.2 Weekly Reports (Manual)

**QA sends report every Friday:**
- Total tests run this week
- Pass/fail rate
- New tests added
- Flaky tests identified
- Bugs found in testing

---

## 8. Bug Tracking

### 8.1 Bug Severity Levels

| Severity | Description | Example | Timeline |
|----------|-------------|---------|----------|
| **Critical** | Blocks core functionality | Checkout broken, site down | Fix immediately |
| **High** | Major feature broken | Cart not saving, login fails | Fix within 24 hours |
| **Medium** | Minor feature issue | Image not loading, typo | Fix within 1 week |
| **Low** | Cosmetic issue | Alignment off, color mismatch | Fix when convenient |

---

### 8.2 Bug Workflow

1. **Discovered** - QA finds bug during testing
2. **Reported** - Create GitHub issue with reproduction steps
3. **Triaged** - Product manager assigns severity/priority
4. **Assigned** - Developer takes ownership
5. **Fixed** - Developer fixes and writes regression test
6. **Verified** - QA verifies fix on staging
7. **Closed** - Merged to production

---

## 9. Definition of Done (Testing)

A feature is **done** when:

- [ ] All unit tests written and passing
- [ ] All integration tests written and passing
- [ ] E2E test for critical path written and passing
- [ ] Code coverage meets 80% threshold
- [ ] Accessibility test passes (0 violations)
- [ ] Manual testing completed by QA
- [ ] Edge cases tested (errors, empty states, loading)
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed
- [ ] Performance benchmarks met (if applicable)
- [ ] Security review completed (for sensitive features)
- [ ] Product owner approves

---

## 10. Risk Mitigation

### High-Risk Areas (Extra Testing Required)

| Area | Risk | Mitigation |
|------|------|------------|
| **Payment processing** | Lost revenue, security breach | 100% test coverage, manual testing with real cards in staging, security audit |
| **Inventory sync** | Overselling (bad customer experience) | Integration tests for stock updates, manual testing of Google Sheets sync |
| **User authentication** | Unauthorized access | Security tests (SQL injection, XSS), penetration testing before launch |
| **Order emails** | Customers don't receive confirmations | Integration tests for email sending, monitor email delivery rate in production |

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial draft |

**Related Documents:**
- [TEST_STRATEGY.md](./TEST_STRATEGY.md) - Overall testing approach
- [TEST_CASES.md](./TEST_CASES.md) - Detailed test cases
- [ACCEPTANCE_CRITERIA.md](../requirements/ACCEPTANCE_CRITERIA.md) - Feature requirements

---

**End of Test Plan Document**
