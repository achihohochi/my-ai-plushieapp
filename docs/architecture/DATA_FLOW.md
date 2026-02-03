# Data Flow Diagrams

**Product:** AI Plushie E-commerce Platform
**Last Updated:** February 2, 2026
**Status:** Draft

---

## Purpose of This Document

This document visualizes how data flows through the system for key user journeys. It helps developers understand the sequence of operations, data transformations, and system interactions.

---

## 1. Guest Checkout Flow (Complete Purchase)

```
┌──────────┐
│  User    │
│ (Guest)  │
└────┬─────┘
     │
     │ 1. Browse products
     ▼
┌─────────────────┐
│  GET /shop      │◄──────── Next.js Server Component
└────┬────────────┘
     │ 2. Query products
     ▼
┌─────────────────┐
│  PostgreSQL     │
│  products table │
└────┬────────────┘
     │ 3. Return product list
     ▼
┌─────────────────┐
│  User sees      │
│  product grid   │
└────┬────────────┘
     │
     │ 4. Click "Add to Cart"
     ▼
┌─────────────────┐
│  localStorage   │◄──────── Guest cart (no account)
│  cart_items     │
└────┬────────────┘
     │ 5. Cart updated
     ▼
┌─────────────────┐
│  Cart badge     │
│  updates: 🛒 1  │
└────┬────────────┘
     │
     │ 6. Click "Checkout"
     ▼
┌─────────────────────────┐
│  /checkout page loads   │
│  (Shipping form)        │
└────┬────────────────────┘
     │ 7. Fill shipping info
     ▼
┌─────────────────────────┐
│  Client validation      │
│  (Zod schema)           │
└────┬────────────────────┘
     │ 8. Submit shipping
     ▼
┌─────────────────────────┐
│  POST /api/checkout/    │
│  stripe                 │
└────┬────────────────────┘
     │ 9. Create payment intent
     ▼
┌─────────────────────────┐
│  Stripe API             │
│  paymentIntents.create()│
└────┬────────────────────┘
     │ 10. Return client_secret
     ▼
┌─────────────────────────┐
│  Stripe Elements UI     │
│  (Card input iframe)    │
└────┬────────────────────┘
     │ 11. Enter card: 4242...
     ▼
┌─────────────────────────┐
│  stripe.confirmPayment()│
└────┬────────────────────┘
     │ 12. Process payment
     ▼
┌─────────────────────────┐
│  Stripe processes       │
│  (payment succeeds)     │
└────┬────────────────────┘
     │ 13. Webhook: payment_intent.succeeded
     ▼
┌─────────────────────────┐
│  POST /api/webhooks/    │
│  stripe                 │
└────┬────────────────────┘
     │ 14. Create order in DB
     ▼
┌─────────────────────────┐
│  PostgreSQL             │
│  INSERT INTO orders     │
│  INSERT INTO order_items│
│  UPDATE products stock  │
└────┬────────────────────┘
     │ 15. Order created
     ▼
┌─────────────────────────┐
│  Send confirmation email│
│  (Resend API)           │
└────┬────────────────────┘
     │ 16. Email sent
     ▼
┌─────────────────────────┐
│  Redirect to            │
│  /orders/confirmation/  │
│  PLU-20260202-12345     │
└────┬────────────────────┘
     │ 17. Display order summary
     ▼
┌─────────────────────────┐
│  User sees:             │
│  ✅ Order Confirmed!    │
│  Order #PLU-20260202-..│
└─────────────────────────┘
```

**Key Points:**
- Guest cart stored in `localStorage` (client-side)
- Payment processed by Stripe (PCI compliant)
- Order created only after successful payment (via webhook)
- Email sent asynchronously

---

## 2. Registered User Checkout (With Saved Address)

```
┌──────────┐
│  User    │
│ (Logged) │
└────┬─────┘
     │
     │ 1. Login (NextAuth)
     ▼
┌─────────────────────────┐
│  POST /api/auth/        │
│  callback/credentials   │
└────┬────────────────────┘
     │ 2. Verify password
     ▼
┌─────────────────────────┐
│  PostgreSQL users       │
│  (bcrypt.compare)       │
└────┬────────────────────┘
     │ 3. Generate JWT token
     ▼
┌─────────────────────────┐
│  Set HTTP-only cookie   │
│  (session token)        │
└────┬────────────────────┘
     │ 4. User logged in
     │
     │ 5. Merge cart: localStorage → DB
     ▼
┌─────────────────────────┐
│  POST /api/cart/sync    │
└────┬────────────────────┘
     │ 6. Merge cart items
     ▼
┌─────────────────────────┐
│  PostgreSQL cart_items  │
│  (upsert user cart)     │
└────┬────────────────────┘
     │ 7. Clear localStorage
     │
     │ 8. Click "Checkout"
     ▼
┌─────────────────────────┐
│  GET /api/addresses     │
└────┬────────────────────┘
     │ 9. Fetch saved addresses
     ▼
┌─────────────────────────┐
│  PostgreSQL addresses   │
│  WHERE user_id = X      │
└────┬────────────────────┘
     │ 10. Return addresses
     ▼
┌─────────────────────────┐
│  Pre-fill shipping form │
│  (default address)      │
└────┬────────────────────┘
     │ 11. Click "Continue to Payment"
     │
     │ [Same as guest flow: steps 8-17 above]
     │
     ▼
┌─────────────────────────┐
│  Order confirmed        │
│  (saved to user account)│
└─────────────────────────┘
```

**Key Points:**
- Guest cart merges with user cart on login
- Saved addresses pre-fill checkout form
- Faster checkout (fewer form fields)

---

## 3. Product Browsing & Filtering

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Navigate to /shop
     ▼
┌──────────────────────────────┐
│  GET /shop                   │
│  (Server Component)          │
└────┬─────────────────────────┘
     │ 2. Server-side data fetch
     ▼
┌──────────────────────────────┐
│  Prisma query:               │
│  products.findMany({         │
│    where: { status: 'active' }│
│    orderBy: { name: 'asc' }  │
│  })                          │
└────┬─────────────────────────┘
     │ 3. Return products
     ▼
┌──────────────────────────────┐
│  HTML with products          │
│  (streamed to client)        │
└────┬─────────────────────────┘
     │ 4. User sees products
     │
     │ 5. Apply filter: Price $20-$30
     ▼
┌──────────────────────────────┐
│  URL updates:                │
│  /shop?minPrice=20&maxPrice=30│
└────┬─────────────────────────┘
     │ 6. Client-side navigation
     ▼
┌──────────────────────────────┐
│  GET /shop?minPrice=20&...   │
└────┬─────────────────────────┘
     │ 7. Server re-queries with filter
     ▼
┌──────────────────────────────┐
│  Prisma query:               │
│  products.findMany({         │
│    where: {                  │
│      status: 'active',       │
│      price: { gte: 20, lte: 30 }│
│    }                         │
│  })                          │
└────┬─────────────────────────┘
     │ 8. Return filtered products
     ▼
┌──────────────────────────────┐
│  Page re-renders with        │
│  filtered products           │
└──────────────────────────────┘
```

**Key Points:**
- Server Components for initial load (fast)
- URL-based filtering (shareable, SEO-friendly)
- No client-side JavaScript required for basic browsing

---

## 4. Inventory Sync (Google Sheets → Database)

```
┌──────────────────────┐
│  Admin               │
└────┬─────────────────┘
     │
     │ 1. Edit Google Sheet
     │    (update price: $24.99 → $19.99)
     ▼
┌──────────────────────────────┐
│  Google Sheets               │
│  (product_id | name | price) │
│  (1 | AI Robot | 19.99)      │
└────┬─────────────────────────┘
     │ 2. Auto-saved to Google
     │
     │ [5 minutes pass]
     │
     │ 3. Vercel Cron triggers
     ▼
┌──────────────────────────────┐
│  GET /api/admin/inventory/   │
│  sync                        │
│  (Cron: every 5 min)         │
└────┬─────────────────────────┘
     │ 4. Fetch sheet data
     ▼
┌──────────────────────────────┐
│  Google Sheets API           │
│  spreadsheets.values.get()   │
└────┬─────────────────────────┘
     │ 5. Return rows
     ▼
┌──────────────────────────────┐
│  Parse & validate data       │
│  (Zod schema)                │
└────┬─────────────────────────┘
     │ 6. Validation passes
     ▼
┌──────────────────────────────┐
│  PostgreSQL                  │
│  UPDATE products             │
│  SET price = 19.99           │
│  WHERE id = 1                │
└────┬─────────────────────────┘
     │ 7. Price updated
     ▼
┌──────────────────────────────┐
│  Create audit log            │
│  (who, what, when)           │
└────┬─────────────────────────┘
     │ 8. Log saved
     ▼
┌──────────────────────────────┐
│  Website reflects new price  │
│  (within 10 minutes)         │
└──────────────────────────────┘
```

**Key Points:**
- Cron job runs every 5 minutes
- Validation prevents bad data
- Audit trail tracks all changes

---

## 5. Admin Order Management

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ 1. Login to /admin
     ▼
┌────────────────────────────┐
│  NextAuth checks role      │
│  (must be 'admin')         │
└────┬───────────────────────┘
     │ 2. Access granted
     ▼
┌────────────────────────────┐
│  GET /api/admin/orders     │
└────┬───────────────────────┘
     │ 3. Query orders
     ▼
┌────────────────────────────┐
│  PostgreSQL                │
│  SELECT * FROM orders      │
│  ORDER BY created_at DESC  │
└────┬───────────────────────┘
     │ 4. Return orders
     ▼
┌────────────────────────────┐
│  Display orders table      │
│  (Order #, Date, Status)   │
└────┬───────────────────────┘
     │
     │ 5. Admin clicks "Mark as Shipped"
     ▼
┌────────────────────────────┐
│  PUT /api/admin/orders/123 │
│  { status: "shipped",      │
│    tracking: "1Z999AA..." }│
└────┬───────────────────────┘
     │ 6. Update order
     ▼
┌────────────────────────────┐
│  PostgreSQL                │
│  UPDATE orders             │
│  SET status = 'shipped'    │
│  WHERE id = 123            │
└────┬───────────────────────┘
     │ 7. Order updated
     ▼
┌────────────────────────────┐
│  Trigger email             │
│  (Resend API)              │
└────┬───────────────────────┘
     │ 8. Send "Order Shipped" email
     ▼
┌────────────────────────────┐
│  Customer receives email   │
│  with tracking number      │
└────────────────────────────┘
```

**Key Points:**
- Admin authentication required
- Order status triggers customer notifications
- Tracking number included in email

---

## 6. User Registration Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Navigate to /register
     ▼
┌─────────────────────────────┐
│  Registration form          │
│  (Email, Password, Confirm) │
└────┬────────────────────────┘
     │ 2. Fill form
     ▼
┌─────────────────────────────┐
│  Client-side validation     │
│  (Zod schema, real-time)    │
└────┬────────────────────────┘
     │ 3. Valid, submit
     ▼
┌─────────────────────────────┐
│  POST /api/auth/register    │
│  { email, password }        │
└────┬────────────────────────┘
     │ 4. Server validation
     ▼
┌─────────────────────────────┐
│  Check if email exists      │
│  (Prisma query)             │
└────┬────────────────────────┘
     │ 5. Email unique ✅
     ▼
┌─────────────────────────────┐
│  Hash password              │
│  (bcrypt, 10 rounds)        │
└────┬────────────────────────┘
     │ 6. Hashed
     ▼
┌─────────────────────────────┐
│  PostgreSQL                 │
│  INSERT INTO users          │
│  (email, password_hash)     │
└────┬────────────────────────┘
     │ 7. User created
     ▼
┌─────────────────────────────┐
│  Generate verification token│
│  (JWT, 24hr expiry)         │
└────┬────────────────────────┘
     │ 8. Token generated
     ▼
┌─────────────────────────────┐
│  Send verification email    │
│  (Resend API)               │
│  Link: /verify?token=xxx    │
└────┬────────────────────────┘
     │ 9. Email sent
     ▼
┌─────────────────────────────┐
│  User checks email          │
│  (clicks verification link) │
└────┬────────────────────────┘
     │ 10. GET /verify?token=xxx
     ▼
┌─────────────────────────────┐
│  Verify JWT token           │
└────┬────────────────────────┘
     │ 11. Valid ✅
     ▼
┌─────────────────────────────┐
│  PostgreSQL                 │
│  UPDATE users               │
│  SET email_verified = true  │
└────┬────────────────────────┘
     │ 12. Account activated
     ▼
┌─────────────────────────────┐
│  Redirect to login          │
│  "Account verified! Login"  │
└─────────────────────────────┘
```

**Key Points:**
- Email uniqueness checked before insert
- Password never stored in plain text
- Email verification required

---

## 7. Search Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Type in search: "pink bunny"
     ▼
┌─────────────────────────────┐
│  Debounced input            │
│  (300ms delay)              │
└────┬────────────────────────┘
     │ 2. After 300ms of no typing
     ▼
┌─────────────────────────────┐
│  GET /api/search?q=pink+bunny│
└────┬────────────────────────┘
     │ 3. Query database
     ▼
┌─────────────────────────────┐
│  PostgreSQL                 │
│  SELECT * FROM products     │
│  WHERE name ILIKE '%pink%'  │
│    OR name ILIKE '%bunny%'  │
│  LIMIT 10                   │
└────┬────────────────────────┘
     │ 4. Return matches
     ▼
┌─────────────────────────────┐
│  Display autocomplete       │
│  dropdown:                  │
│  • Pink AI Bunny ($24.99)   │
│  • Bunny Trio Set ($44.99)  │
└────┬────────────────────────┘
     │ 5. User clicks result
     ▼
┌─────────────────────────────┐
│  Navigate to product detail │
│  /products/1                │
└─────────────────────────────┘
```

**Key Points:**
- Debounced to reduce API calls
- Case-insensitive search (ILIKE)
- Limited to 10 results (performance)

---

## 8. Session Management (JWT)

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Login successful
     ▼
┌─────────────────────────────┐
│  Generate JWT token         │
│  Payload: { userId, email } │
│  Secret: NEXTAUTH_SECRET    │
│  Expires: 1 hour            │
└────┬────────────────────────┘
     │ 2. Token signed
     ▼
┌─────────────────────────────┐
│  Set HTTP-only cookie       │
│  next-auth.session-token    │
│  (secure, sameSite: lax)    │
└────┬────────────────────────┘
     │ 3. Cookie stored in browser
     │
     │ 4. User makes authenticated request
     ▼
┌─────────────────────────────┐
│  GET /api/orders            │
│  (cookie auto-sent)         │
└────┬────────────────────────┘
     │ 5. Middleware extracts token
     ▼
┌─────────────────────────────┐
│  Verify JWT signature       │
│  (using NEXTAUTH_SECRET)    │
└────┬────────────────────────┘
     │ 6. Valid ✅ (not expired)
     ▼
┌─────────────────────────────┐
│  Decode token               │
│  Get userId from payload    │
└────┬────────────────────────┘
     │ 7. Query user's orders
     ▼
┌─────────────────────────────┐
│  PostgreSQL                 │
│  SELECT * FROM orders       │
│  WHERE user_id = X          │
└────┬────────────────────────┘
     │ 8. Return orders
     ▼
┌─────────────────────────────┐
│  User sees their orders     │
└─────────────────────────────┘
```

**Key Points:**
- Stateless (no session store needed)
- HTTP-only cookies (XSS protection)
- Short expiration (1 hour)

---

## Data Flow Principles

1. **Security First:** Validate on client AND server
2. **Idempotency:** Operations can be repeated safely
3. **Atomicity:** Database transactions for multi-step operations
4. **Async Operations:** Use queues for non-critical tasks (emails)
5. **Error Handling:** Graceful degradation, user-friendly messages

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial data flows |

**Related Documents:**
- [TRD.md](./TRD.md) - Technical requirements
- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) - Architecture diagrams
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - API endpoints

---

**End of Data Flow Document**
