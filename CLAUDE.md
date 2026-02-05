# AI Development Best Practices - E-commerce Project

**Project Type:** Full-stack e-commerce application
**AI Tool:** Claude Code (Sonnet 4.5)
**Methodology:** Phase-by-phase incremental development
**Last Updated:** February 4, 2026
**Status:** ✅ Production Ready - Both payment methods tested and verified

---

## 📋 Table of Contents

1. [Project Approach](#project-approach)
2. [Phase-by-Phase Methodology](#phase-by-phase-methodology)
3. [Testing Strategies](#testing-strategies)
4. [Communication Patterns](#communication-patterns)
5. [Error Handling](#error-handling)
6. [Context Management](#context-management)
7. [Best Practices Summary](#best-practices-summary)

---

## 🎯 Project Approach

### Documentation-First Strategy

**Why:** Prevents rework, ensures security/compliance upfront, provides clear roadmap.

**Process:**
1. **Week 1:** Create comprehensive planning docs (25+ documents)
   - Requirements (PRD, user stories, personas)
   - Architecture (TRD, data flows, scalability)
   - Design (design system, wireframes, mobile-first)
   - Testing (strategy, test cases, benchmarks)
   - Implementation guides

2. **Week 2+:** Build incrementally following the docs
   - Each phase references specific documentation
   - Update docs when decisions change
   - Keep `SESSION_NOTES.md` current

**Key Files:**
- `docs/00_PROJECT_INDEX.md` - Master navigation
- `docs/SESSION_NOTES.md` - Current state, next steps
- `docs/DECISIONS.md` - Architectural decisions (ADR format)

---

## 🔄 Phase-by-Phase Methodology

### Core Principle: Build → Test → Verify → Next

Each phase is **fully complete and working** before moving to the next.

### Phase 1: Foundation (Week 1-2)
**Goal:** Database + API ready

**Steps:**
1. Install dependencies (Prisma, PostgreSQL, TypeScript)
2. Create database schema (all tables, relationships)
3. Seed data (realistic test data)
4. Create basic API routes (`GET /api/products`)
5. **Test:** Query database, API returns data

**Deliverables:**
- ✅ Database with schema migrations
- ✅ Seed script with real data
- ✅ API endpoints tested via curl
- ✅ lib/prisma.ts for database client

**AI Strategy:**
- Autonomous: Schema creation, API routes
- Ask user: Database connection details, port preferences

---

### Phase 2: Product Catalog (Week 2-3)
**Goal:** Users can browse products

**Steps:**
1. Update ProductGrid to fetch from API
2. Create shop page with product grid
3. Create product detail pages
4. Handle 404s gracefully
5. **Test:** Browse shop, click product, see details

**Deliverables:**
- ✅ `/shop` - Product listing page
- ✅ `/products/[id]` - Product details
- ✅ Real data from database displayed
- ✅ Images loading from `/public` folder

**AI Strategy:**
- Autonomous: Page creation, API integration
- Ask user: Design preferences (keep original or new)

---

### Phase 3: Shopping Cart (Week 3-4)
**Goal:** Cart persists across refreshes

**Steps:**
1. Create cart API routes (add, get, update, delete)
2. Implement session-based persistence
3. Update CartContext to sync with API
4. Create full cart page
5. **Test:** Add items, refresh page, cart persists

**Deliverables:**
- ✅ `POST /api/cart` - Add to cart
- ✅ `GET /api/cart` - Fetch cart
- ✅ `PUT /api/cart/[id]` - Update quantity
- ✅ `DELETE /api/cart/[id]` - Remove item
- ✅ Session cookies for guest users
- ✅ `/cart` page with controls

**AI Strategy:**
- Autonomous: API routes, database persistence
- Ask user: UI preferences (button placement)

---

### Phase 4: Checkout & Payments (Week 5-6)
**Goal:** Complete order flow working

**Steps:**
1. Create checkout page with form
2. Build order creation API
3. Generate unique order numbers
4. Update inventory on purchase
5. Clear cart after order
6. Show confirmation page
7. **Test:** Place order, verify in database

**Deliverables:**
- ✅ `/checkout` - Shipping info form
- ✅ `POST /api/checkout` - Create order
- ✅ `/confirmation` - Order success page
- ✅ Inventory management (decrement stock)
- ✅ Order tracking in database

**AI Strategy:**
- Autonomous: Form creation, order API
- Ask user: Payment integration timing (Phase 4 or later)

---

### Phase 5: Admin & Google Sheets (Week 6-7)
**Goal:** Admin dashboard with Google Sheets sync

**Steps:**
1. Install googleapis package
2. Create Google Sheets service functions
3. Build admin API routes (protected with admin key)
4. Create admin authentication context
5. Build admin dashboard pages (dashboard, orders, products)
6. **Test:** Login to admin, sync with Sheets, update products

**Deliverables:**
- ✅ `lib/google-sheets.ts` - Sheets API service
- ✅ Admin API routes (sync, orders, products)
- ✅ Admin authentication (key-based)
- ✅ `/admin/login` - Admin login page
- ✅ `/admin/dashboard` - Stats and sync controls
- ✅ `/admin/orders` - View all orders
- ✅ `/admin/products` - Edit prices/stock
- ✅ `docs/GOOGLE_SHEETS_SETUP.md` - Setup guide

**Technical Details:**
- Google Cloud service account authentication
- Two-way sync: import from Sheets, export to Sheets
- Admin key verification on all admin routes
- Products sheet: ID, Name, Description, Price, Image, Stock, Status
- Orders sheet: Auto-generated with full order details
- Inventory logging for admin stock adjustments

**AI Strategy:**
- Autonomous: API routes, admin pages, Sheets integration
- Ask user: Google Cloud setup (provide setup guide)

---

## 🧪 Testing Strategies

### Test After Every Phase

**API Testing:**
```bash
# Product API
curl http://localhost:3002/api/products | jq '.'

# Single product
curl http://localhost:3002/api/products/1 | jq '.data.name'

# Add to cart
curl -X POST http://localhost:3002/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}' \
  -c /tmp/cookies.txt | jq '.'

# Create order
curl -X POST http://localhost:3002/api/checkout \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt \
  -d '{"email":"test@example.com",...}' | jq '.'
```

**Database Verification:**
```bash
# Check products
psql -U chiho -d plushie_app -c "SELECT * FROM products LIMIT 5;"

# Check orders
psql -U chiho -d plushie_app -c "SELECT * FROM orders;"

# Check inventory changes
psql -U chiho -d plushie_app -c "SELECT * FROM inventory_log;"
```

**Browser Testing:**
1. Open http://localhost:3002/shop
2. Add items to cart
3. View cart, update quantities
4. Checkout and place order
5. Verify confirmation page

---

## 💬 Communication Patterns

### When to Ask User vs. Proceed Autonomously

**Ask User:**
- Design preferences (keep existing or create new)
- External service decisions (Stripe now or later)
- Breaking changes to existing code
- Multiple valid approaches with trade-offs
- Uncertain requirements

**Proceed Autonomously:**
- Standard patterns (API routes, database schemas)
- Error handling and validation
- File structure and organization
- Code following existing patterns
- Bug fixes to code you wrote

### Handling User Feedback

**Pattern:**
1. User: "I don't see X in the UI"
2. Read the file to understand current state
3. Identify the issue
4. Fix and test
5. Confirm with user

**Example:**
```
User: "No continue shopping button in cart sidebar"
AI: *reads cart-sidebar.tsx*
AI: *adds button below checkout button*
AI: "Added! Try it now."
```

---

## ⚠️ Error Handling

### Common Errors and Solutions

**1. Missing UI Components**
```
Error: Module not found: Can't resolve '@/components/ui/input'
Solution: Create the component (Input, Label, etc.)
```

**2. Database Connection**
```
Error: role "postgres" does not exist
Solution: Use correct username (whoami) and update DATABASE_URL
```

**3. Prisma 7 Adapter Requirement**
```
Error: PrismaClient needs to be constructed with options
Solution: Install @prisma/adapter-pg and use PrismaPg adapter
```

**4. Async Function Changes**
```
Error: addItem is not a function
Solution: Update all addItem() calls to await addItem()
```

### Error Handling Pattern

```typescript
try {
  // Operation
  const result = await someOperation()

  return NextResponse.json({
    success: true,
    data: result,
  })
} catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    {
      success: false,
      error: 'User-friendly error message',
    },
    { status: 500 }
  )
}
```

---

## 🧪 Comprehensive Testing Strategy

### Testing Philosophy: Test Integrity Over Coverage

**Core Principle:** Tests must validate REAL user flows, not just achieve green lights.

### 3-Layer Testing Architecture

**1. Unit Tests (Fast - < 500ms)**
- Business logic utilities
- Pure functions (formatCurrency, generateOrderNumber)
- React components in isolation
- **Target:** 80%+ coverage on utilities
- **Run:** On every file save (watch mode)

**2. Integration Tests (Medium - 1-5s)**
- API endpoints with real database
- Session management and cookies
- Payment flow validation
- **Target:** 100% of critical API routes
- **Run:** Before every commit

**3. E2E Tests (Slow - 60-120s)**
- Complete user journeys
- Browser automation (Playwright)
- Cross-browser compatibility
- **Target:** All critical conversion paths
- **Run:** Before deployment

### Critical E-Commerce Test Patterns

#### Pattern 1: Concurrent Purchase Testing
```typescript
// CRITICAL: Test race conditions for limited stock
it('should prevent overselling when 2 users buy last item simultaneously', async () => {
  // Set product stock to 1
  await setStock(productId, 1);

  // Fire 2 simultaneous purchase requests
  const [response1, response2] = await Promise.all([
    createOrder({ productId, quantity: 1 }),
    createOrder({ productId, quantity: 1 }),
  ]);

  // Verify: Only 1 succeeds, other gets "out of stock"
  const successCount = [response1, response2].filter(r => r.status === 200).length;
  expect(successCount).toBe(1);

  // Verify: Stock is 0, never negative
  const product = await getProduct(productId);
  expect(product.stock_quantity).toBe(0);
  expect(product.stock_quantity).toBeGreaterThanOrEqual(0);
});
```

**Why Critical:** Prevents overselling under traffic load, protects revenue.

#### Pattern 2: Idempotency Testing
```typescript
// CRITICAL: Prevent duplicate orders from double-click
it('should prevent duplicate orders from rapid double-click', async () => {
  const orderPayload = { email: 'test@example.com', items: [...] };

  // Simulate user double-clicking "Place Order"
  const [response1, response2] = await Promise.all([
    createOrder(orderPayload),
    createOrder(orderPayload),
  ]);

  // Verify: Both return success (idempotent)
  expect(response1.status).toBe(200);
  expect(response2.status).toBe(200);

  // Verify: Same order number returned (not 2 separate orders)
  const data1 = await response1.json();
  const data2 = await response2.json();
  expect(data1.orderNumber).toBe(data2.orderNumber);
});
```

**Implementation:** Add idempotency_key column to orders table.

#### Pattern 3: Transaction Rollback Testing
```typescript
// CRITICAL: Verify atomic operations (all-or-nothing)
it('should rollback order if inventory update fails', async () => {
  const initialStock = await getStock(productId);

  // Simulate order creation with inventory update failure
  const response = await createOrder({
    items: [{ id: productId, quantity: 1 }],
  });

  if (response.status === 500) {
    // Verify: Stock unchanged (transaction rolled back)
    const finalStock = await getStock(productId);
    expect(finalStock).toBe(initialStock);

    // Verify: No partial order created
    const orders = await getRecentOrders();
    expect(orders.length).toBe(0);
  }
});
```

**Implementation:** Wrap order creation in Prisma $transaction.

#### Pattern 4: Webhook Deduplication Testing
```typescript
// CRITICAL: Prevent duplicate orders from Stripe webhook retries
it('should handle duplicate webhook events', async () => {
  const paymentIntentId = 'pi_test_123';

  // Send same webhook event twice
  await sendWebhook({ payment_intent: paymentIntentId });
  await sendWebhook({ payment_intent: paymentIntentId });

  // Verify: Only 1 order created
  const orders = await prisma.order.findMany({
    where: { payment_intent_id: paymentIntentId },
  });

  expect(orders.length).toBe(1);
});
```

**Implementation:** Check payment_intent_id before creating order.

### Test Integrity Checklist

Before considering tests "production-ready," verify:

- [ ] Tests hit REAL database (not mocked)
- [ ] Tests create actual records (verify with DB query)
- [ ] Tests validate data persistence across requests
- [ ] Tests check error paths, not just happy paths
- [ ] Tests verify business rules (stock limits, pricing)
- [ ] Tests catch race conditions (concurrent requests)
- [ ] Tests validate transaction safety (rollbacks)
- [ ] Tests ensure idempotency (duplicate prevention)

### Testing Anti-Patterns to Avoid

**❌ DON'T: Mock Everything**
```typescript
// BAD: This doesn't test actual database behavior
vi.mock('@/lib/prisma', () => ({
  product: { findUnique: vi.fn().mockResolvedValue({ id: 1 }) },
}));
```

**✅ DO: Use Real Database for Integration Tests**
```typescript
// GOOD: Tests actual Prisma queries and constraints
const product = await prisma.product.findUnique({ where: { id: 1 } });
expect(product).not.toBeNull();
```

**❌ DON'T: Test Only Happy Paths**
```typescript
// BAD: Only tests when everything works
it('should create order', async () => {
  const order = await createOrder(validPayload);
  expect(order.success).toBe(true);
});
```

**✅ DO: Test Error Scenarios**
```typescript
// GOOD: Tests validation, stock limits, errors
it('should reject order with insufficient stock', async () => {
  const response = await createOrder({ quantity: 9999 });
  expect(response.status).toBe(400);
  expect(response.error).toContain('stock');
});
```

### Test Execution Workflow

**Development:**
```bash
npm run test:unit:watch    # Watch mode for TDD
npm run test:integration   # After implementing feature
```

**Pre-Commit:**
```bash
npm run test:unit          # Fast check (< 1s)
npm run test:integration   # Full validation (< 5s)
```

**Pre-Deployment:**
```bash
npm run test:coverage      # Generate coverage report
npm run test:e2e           # Full user flow validation
```

**CI/CD Pipeline:**
```yaml
# GitHub Actions
- run: npm run test:unit
- run: npm run test:integration
- run: npm run test:e2e
- run: npm run test:coverage
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
```

### Database Testing Best Practices

**1. Use Test Database for Integration Tests:**
```typescript
// vitest.setup.ts
process.env.DATABASE_URL = 'postgresql://user@localhost:5432/app_test';
```

**2. Clean Up Test Data:**
```typescript
afterEach(async () => {
  // Delete test orders from last run
  await prisma.order.deleteMany({
    where: {
      customer_email: { contains: '@test.com' },
      created_at: { gte: new Date(Date.now() - 60000) },
    },
  });
});
```

**3. Verify Database State:**
```typescript
it('should decrement inventory on purchase', async () => {
  const initialStock = await getStock(productId);

  await createOrder({ productId, quantity: 2 });

  const finalStock = await getStock(productId);
  expect(finalStock).toBe(initialStock - 2);
});
```

### Test Documentation Standards

**Test Name Format:**
```typescript
// Format: should [action] [condition]
it('should reject quantity exceeding stock', async () => { ... });
it('should create session cookie on first cart add', async () => { ... });
it('should increment quantity for duplicate cart adds', async () => { ... });
```

**Test Structure (AAA Pattern):**
```typescript
it('should update cart item quantity', async () => {
  // Arrange: Set up test data
  const { cartItemId, sessionCookie } = await addItemToCart();

  // Act: Perform operation
  const response = await updateCartQuantity(cartItemId, 5, sessionCookie);

  // Assert: Verify outcome
  expect(response.data.quantity).toBe(5);
});
```

---

## 🧠 Context Management

### Staying Under Token Limits

**Strategies:**
1. **Summarize periodically** - Key accomplishments only
2. **Update SESSION_NOTES.md** - Current state for next session
3. **Use focused searches** - Grep/Glob instead of reading entire files
4. **Reference docs** - Point to files rather than repeating content

### Session Handoff

**End of Session Checklist:**
1. Update `docs/SESSION_NOTES.md` with:
   - What was completed
   - Current phase status
   - Next phase goals
   - Any blockers or notes

2. Update `docs/DECISIONS.md` if:
   - New architectural decisions made
   - Technology choices changed
   - Important trade-offs documented

3. Git commit (if requested):
   ```bash
   git add .
   git commit -m "Complete Phase X: [description]

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

### Starting New Session

**Read these files first:**
1. `docs/SESSION_NOTES.md` - Current state
2. `docs/DECISIONS.md` - Context on why things are the way they are
3. Recent git log - What changed recently

---

## ✅ Best Practices Summary

### Development Workflow

1. **Phase-Based Development**
   - Complete one phase before starting next
   - Test thoroughly at end of each phase
   - Verify database changes after each feature

2. **API-First Approach**
   - Build API routes before UI
   - Test APIs with curl before browser testing
   - Return consistent response format:
     ```json
     { "success": true, "data": {...} }
     { "success": false, "error": "message" }
     ```

3. **Database-Driven Design**
   - All cart/order data persists to database
   - Never rely on client-side storage alone
   - Use sessions for guest users
   - Log important changes (inventory_log)

4. **Incremental Testing**
   - Test API → Test in browser → Test edge cases
   - Verify database after operations
   - Check both success and error paths

### Code Organization

```
project/
├── app/
│   ├── api/              # API routes
│   │   ├── products/     # GET /api/products
│   │   ├── cart/         # Cart CRUD operations
│   │   └── checkout/     # Order creation
│   ├── shop/             # Product listing
│   ├── products/[id]/    # Product details
│   ├── cart/             # Cart page
│   └── checkout/         # Checkout flow
├── components/
│   ├── ui/               # Reusable UI components
│   └── *.tsx             # Feature components
├── lib/
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── docs/                 # Planning documentation
```

### Session Management

**Guest User Pattern:**
```typescript
// Generate session ID
const sessionId = randomUUID()

// Store in HTTP-only cookie
response.cookies.set('session_id', sessionId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 30, // 30 days
})

// Use for cart queries
await prisma.cartItem.findMany({
  where: { session_id: sessionId }
})
```

### Order Creation Pattern

```typescript
// 1. Validate input
// 2. Check stock availability
// 3. Generate unique order number
// 4. Create order with items (transaction)
// 5. Update inventory
// 6. Log inventory changes
// 7. Clear cart
// 8. Return order details
```

---

## 🐛 Common Implementation Bugs & Fixes

### Bug Pattern 1: Authentication Method Mismatch

**Problem:** Admin routes expecting cookies but frontend sending headers
```
Error: Unauthorized (401) even when logged in
```

**Root Cause:** Inconsistent authentication storage
- Frontend: localStorage → sends in headers
- Backend: Checks cookies only

**Solution:** Support both methods in API routes
```typescript
// Check BOTH header and cookie
const adminKeyHeader = request.headers.get('x-admin-key');
const cookieStore = await cookies();
const adminKeyCookie = cookieStore.get('admin_key')?.value;
const adminKey = adminKeyHeader || adminKeyCookie;
```

**Lesson:** When implementing authentication, standardize on ONE method or explicitly support both.

---

### Bug Pattern 2: Parameter Naming Mismatch

**Problem:** Email function fails with "Cannot read properties of undefined (reading 'toFixed')"
```typescript
// Interface expects
shippingCost: number

// Caller provides
shipping: number  // ❌ Wrong name
```

**Solution:** Match parameter names EXACTLY to interface definitions
```typescript
// ✅ Correct
await sendOrderConfirmation({
  shippingCost: Number(order.shipping_cost),
  customerName: order.customer_name,
})
```

**Lesson:** When creating functions with object parameters, use TypeScript interfaces and match names precisely. Don't use abbreviations or shortened names.

---

### Bug Pattern 3: Database Field Name Mismatch

**Problem:** UI shows "$NaN" for prices
```typescript
// Interface expects
item.price

// Database has
item.price_at_time  // ❌ Mismatch
```

**Solution:** Update TypeScript interface to match database schema
```typescript
interface OrderItem {
  price_at_time: string;  // ✅ Match DB column name
  quantity: number;
}

// Display
parseFloat(item.price_at_time).toFixed(2)
```

**Lesson:** Database column names MUST match TypeScript interface field names exactly. Use snake_case in both when working with PostgreSQL.

---

### Bug Pattern 4: Client-Side Only Cart Clearing

**Problem:** Cart reappears after refresh despite clearing
```typescript
// ❌ Client-side only
clearCart()  // Updates React state
```

**Root Cause:** Cart is session-based in database, client state doesn't persist

**Solution:** Clear cart server-side
```typescript
// ✅ Server-side deletion
if (sessionId) {
  await prisma.cartItem.deleteMany({
    where: { session_id: sessionId },
  });
}
```

**Lesson:** For session-based features, ALWAYS update the server state, not just client state. Client state should be derived from server.

---

## 💳 Payment Integration Patterns

### Pattern 1: Dual Payment Methods

**When to use:** Multiple payment processors in one app (Stripe + Venmo)

**Implementation Strategy:**
1. **Payment Method Selection:** Radio buttons on checkout page
2. **Different Order Flows:**
   - Stripe: Redirect to hosted checkout → webhook creates order
   - Venmo: Create order first (need order number) → manual verification
3. **Status Management:**
   - Stripe: `payment_status: 'paid'` immediately (webhook)
   - Venmo: `payment_status: 'pending_payment_verification'` → admin verifies
4. **Cart Clearing:**
   - Both: Server-side deletion
   - Stripe: In webhook after payment success
   - Venmo: Immediately after order creation

**Database Design:**
```sql
orders (
  payment_method VARCHAR(50),  -- 'stripe' or 'venmo'
  payment_status VARCHAR(50),  -- 'paid', 'pending_payment_verification'
  payment_intent_id VARCHAR(255)  -- Stripe payment intent (NULL for Venmo)
)
```

**Admin UI Enhancement:**
```typescript
// Show payment method badge
{order.payment_method === 'stripe' ? '💳 Stripe' : '📱 Venmo'}
```

---

### Pattern 2: Stripe Checkout (Hosted Page)

**Why:** Simplest, most secure Stripe integration (PCI-DSS compliant)

**Flow:**
1. User fills shipping info on your site
2. Create Stripe Checkout session with line items
3. Redirect to Stripe hosted page
4. User completes payment on Stripe
5. Webhook receives `checkout.session.completed` event
6. Create order in database
7. Send confirmation email
8. Redirect user to success page

**Key Files:**
- `lib/stripe.ts` - Stripe client
- `app/api/create-checkout-session/route.ts` - Session creation
- `app/api/webhooks/stripe/route.ts` - Webhook handler
- `app/checkout/success/page.tsx` - Success page

**Webhook Pattern:**
```typescript
// Verify signature first
const sig = headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

// Handle specific event
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  // Create order here
}
```

**Important:** Use `stripe listen --forward-to localhost:3002/api/webhooks/stripe` for local testing

---

### Pattern 3: Venmo QR Code Integration

**Use Case:** Teen-friendly payment option (no credit card needed)

**Flow:**
1. User selects Venmo payment method
2. Order created with `pending_payment_verification` status
3. Generate Venmo deep link: `venmo://paycharge?txn=pay&recipients=USERNAME&amount=TOTAL&note=ORDER_NUMBER`
4. Convert to QR code (qrcode package)
5. Display QR code for scanning
6. User scans → pays in Venmo app
7. Admin manually verifies payment in Venmo
8. Admin clicks "Verify Payment" in dashboard
9. Order status updated to `paid`
10. Confirmation email sent

**Key Files:**
- `lib/venmo.ts` - QR generation utilities
- `app/api/checkout/venmo/route.ts` - Create Venmo orders
- `app/checkout/venmo/page.tsx` - QR display
- `app/admin/venmo/page.tsx` - Admin verification UI

**QR Code Generation:**
```typescript
import QRCode from 'qrcode';

const venmoLink = `venmo://paycharge?txn=pay&recipients=${username}&amount=${amount}&note=${orderNumber}`;
const qrCode = await QRCode.toDataURL(venmoLink, {
  width: 300,
  color: { dark: '#008CFF' }  // Venmo blue
});
```

---

## 📧 Email Integration Pattern

### Resend Setup (Simplest Option)

**Why Resend:** Simple API, generous free tier (100/day), no credit card to start

**Setup:**
1. Sign up at resend.com
2. Get API key
3. Add to `.env`: `RESEND_API_KEY=re_...`
4. `npm install resend`

**Implementation:**
```typescript
// lib/resend.ts
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);

// lib/emails/send-order-confirmation.ts
export async function sendOrderConfirmation(params) {
  const html = generateEmailHTML(params);  // Simple HTML string

  await resend.emails.send({
    from: 'onboarding@resend.dev',  // Dev domain
    to: params.customerEmail,
    subject: `Order Confirmation - ${params.orderNumber}`,
    html: html,
  });
}
```

**Important Lessons:**
1. **Use simple HTML strings** - React Email adds complexity, can cause validation errors
2. **Make emails non-blocking** - Wrap in try/catch, don't fail order if email fails
3. **Development domain** - Use `onboarding@resend.dev` until custom domain configured
4. **Send after database commit** - Only send email after order successfully created

**When to Send:**
- Stripe: In webhook after order creation
- Venmo: After admin verification (not at order creation)

---

## 🎯 Key Takeaways

1. **Documentation first** - Plan before building
2. **Phase-by-phase** - Complete and test each phase
3. **Test everything** - API, database, browser
4. **Session management** - Support guest checkout
5. **Error handling** - Always return user-friendly errors
6. **Context tracking** - Update SESSION_NOTES.md regularly
7. **User communication** - Ask when uncertain, proceed when confident

---

## 📚 Related Files

- `SKILLS.md` - Reusable e-commerce patterns
- `docs/DECISIONS.md` - Architectural decisions
- `docs/SESSION_NOTES.md` - Current project state
- `docs/00_PROJECT_INDEX.md` - Documentation index

---

**Remember:** The goal is to build incrementally, test thoroughly, and maintain clear communication with the user throughout the process.
