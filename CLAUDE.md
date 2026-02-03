# AI Development Best Practices - E-commerce Project

**Project Type:** Full-stack e-commerce application
**AI Tool:** Claude Code (Sonnet 4.5)
**Methodology:** Phase-by-phase incremental development
**Last Updated:** February 3, 2026

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
