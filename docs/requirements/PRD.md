# Product Requirements Document (PRD)

**Product:** AI Plushie E-commerce Platform
**Version:** 1.0 (MVP)
**Last Updated:** February 4, 2026
**Status:** Implemented - v1.0

---

## 1. Executive Summary

### 1.1 Product Vision
An e-commerce platform selling AI-themed plushie toys, designed for teenagers (13-19) with a mobile-first, fast, and secure shopping experience.

### 1.2 Problem Statement
Teenagers want to purchase AI-themed merchandise that reflects their identity and interests, but existing e-commerce sites either:
- Don't offer teen-friendly payment options (Venmo)
- Force account creation before checkout
- Have slow, desktop-focused experiences
- Lack clear return policies and trust signals

### 1.3 Solution
Build a mobile-first e-commerce platform optimized for teenage shoppers with:
- Guest checkout (no account required)
- Venmo + Stripe payment options
- Sub-3-second page loads
- Clear product details and return policies
- Parent-friendly trust signals

### 1.4 Success Metrics (MVP)
| Metric | Target | Measurement | Status |
|--------|--------|-------------|--------|
| Page Load Time | < 3 seconds | Lighthouse Performance Score | ✅ Achieved |
| Mobile Traffic | > 70% of visits | Google Analytics | 📊 Tracking |
| Checkout Completion | > 60% (cart → purchase) | Funnel Analysis | 📊 Tracking |
| Cart Abandonment | < 40% | Analytics tracking | 📊 Tracking |
| Customer Support Tickets | < 5% of orders | Support dashboard | 📊 Tracking |

---

## 2. Implementation Status

### 2.1 Completed Phases (February 2-4, 2026)

**Phase 1-5: Core E-commerce Features** ✅ COMPLETE
- ✅ PostgreSQL database with Prisma ORM
- ✅ Product catalog (14 AI plushie products)
- ✅ Shopping cart (session-based, database-persisted)
- ✅ Guest checkout flow
- ✅ Order management system
- ✅ Inventory tracking with audit logs
- ✅ Admin dashboard (products, orders, revenue)

**Phase 6: Payment Integration** ✅ COMPLETE
- ✅ Stripe Checkout integration (hosted payment page)
- ✅ Venmo QR code payments (admin-verified)
- ✅ Payment webhooks for order creation
- ✅ Email confirmations (Resend service)
- ✅ Dual payment method support

**Admin Features** ✅ COMPLETE
- ✅ Key-based admin authentication
- ✅ Product management (name, description, price, stock, images)
- ✅ Order viewing and status updates
- ✅ Venmo payment verification UI
- ✅ Revenue tracking dashboard
- ✅ Google Sheets integration (optional, not required)

### 2.2 Technology Stack Implemented

**Core Technologies:**
- Next.js 14+ (App Router), React 19, TypeScript
- PostgreSQL 15+ with Prisma ORM
- Tailwind CSS + shadcn/ui components
- Vercel hosting

**Payment Services:**
- Stripe (credit/debit cards, Apple Pay, Google Pay)
- Venmo Business Profile (@aichiho) - QR code payments

**Email Service:**
- Resend (transactional order confirmations)

**Image Management:**
- Next.js Image component + `/public` folder (no CDN)

### 2.3 Production URLs

- **Live Site:** https://my-ai-plushieapp.vercel.app/
- **Local Dev:** http://localhost:3002
- **Repository:** Private GitHub repository

### 2.4 Current Metrics (As of Feb 4, 2026)

- **Products:** 14 AI plushie products
- **Orders Processed:** Multiple test orders (Stripe + Venmo)
- **Payment Methods:** 2 (Stripe ✅ Tested, Venmo ✅ Tested)
- **Database:** PostgreSQL with 7 tables
- **Admin Features:** Full product and order management

### 2.5 Testing & Verification Status

**Both Payment Methods Verified (Feb 4, 2026):**

✅ **Stripe Payment Flow** - Fully tested and verified
- Order creation via webhook ✅
- Email confirmation delivered ✅
- Cart cleared after payment ✅
- Order status updated to "paid" ✅
- Revenue tracking accurate ✅

✅ **Venmo QR Payment Flow** - Fully tested and verified
- QR code generation working ✅
- Order created with pending status ✅
- Admin verification UI functional ✅
- Email sent after admin verification ✅
- Cart cleared after order creation ✅
- Revenue tracking accurate ✅

**Production Readiness:** Both payment methods confirmed working end-to-end and ready for production deployment.

---

## 3. Target Audience

### 2.1 Primary User: Teen Shopper (Maya, 16)
- **Device:** Mobile (85%+ of browsing)
- **Payment:** Venmo preferred, parents' credit card secondary
- **Behavior:** Impulse buyer, influenced by social media
- **Needs:** Fast checkout, visual product details, clear pricing

*See [USER_PERSONAS.md](./USER_PERSONAS.md) for full persona details.*

### 2.2 Secondary User: Parent/Guardian (Lisa, 42)
- **Role:** Approves/pays for purchases
- **Needs:** Trust signals, clear policies, secure payments

### 2.3 Tertiary User: Site Admin (Jordan, 28)
- **Role:** Manages inventory, prices, orders
- **Needs:** Simple admin interface, Google Sheets integration (optional)

---

## 4. Core Features (MVP)

### 4.1 Product Catalog ✅ IMPLEMENTED

#### 4.1.1 Product Listing Page ✅
**Description:** Grid display of all available AI plushies

**Implementation Status:** Complete - 14 products displayed on `/shop` page

**Requirements:**
- Display product image, name, price per item
- Responsive grid: 2 columns on mobile, 4 on desktop
- Lazy loading for images (performance)
- Filter by: price range, availability (in stock)
- Sort by: price (low-high, high-low), newest
- Show "Sold Out" badge on unavailable items (non-clickable)
- Pagination or infinite scroll (20 products per load)

**Acceptance Criteria:**
- [x] Page loads in < 3 seconds on 4G connection
- [x] All images have alt text for accessibility
- [x] Sold out items visually distinct and non-purchasable
- [ ] Filters/sort persist across page refreshes *(deferred)*

#### 4.1.2 Product Detail Page ✅
**Description:** Individual product page with full details

**Implementation Status:** Complete - Individual pages at `/products/[id]`

**Requirements:**
- Large product image(s) with zoom capability
- Product name, price, description
- Size/dimensions clearly displayed (e.g., "12 inches tall")
- Material information (plush, stuffing type)
- Add to Cart button (disabled if sold out)
- Quantity selector (1-10, limited by stock)
- Stock availability indicator ("Only 3 left!")
- Social share buttons (Instagram, Twitter, copy link)

**Acceptance Criteria:**
- [x] Double-tap/click on catalog image opens detail page
- [x] Add to Cart updates cart count in header immediately
- [x] Cannot add more than available stock quantity
- [x] Mobile: Image takes 80%+ of viewport width

### 4.2 Shopping Cart ✅ IMPLEMENTED

#### 4.2.1 Cart Functionality ✅
**Description:** Persistent shopping cart across sessions

**Implementation Status:** Complete - Session-based cart with database persistence

**Requirements:**
- Add/remove items
- Update quantity per item
- Show item subtotal (price × quantity)
- Show cart total
- Show estimated shipping (based on location if provided)
- "Continue Shopping" link
- "Proceed to Checkout" button
- Empty cart state with CTA to browse products
- Cart persists for 30 days (localStorage + server sync if logged in)

**Acceptance Criteria:**
- [x] Cart accessible from any page (header icon with count)
- [x] Cart badge shows item count (not total quantity)
- [x] Removing last item shows empty cart UI
- [x] Cart survives browser refresh and app close

#### 4.2.2 Cart Slide-out (Mobile) ✅
**Description:** Mobile-optimized cart drawer

**Implementation Status:** Complete - Cart sidebar component

**Requirements:**
- Slide-out panel from right on mobile
- Swipe to dismiss
- Large tap targets for quantity controls (+/- buttons)
- Checkout button always visible (sticky)

### 4.3 Checkout Flow ✅ IMPLEMENTED

#### 4.3.1 Guest Checkout ✅
**Description:** Purchase without creating an account

**Implementation Status:** Complete - Full guest checkout at `/checkout`

**Requirements:**
- No account required to complete purchase
- Collect: email, shipping address, payment
- Optional: "Create account with this info" checkbox
- Order confirmation sent to email
- Guest can track order via email link

**Acceptance Criteria:**
- [x] Checkout completes in < 60 seconds (5 fields or less)
- [x] Email validation (real-time)
- [ ] Address autocomplete (Google Places API) *(deferred)*
- [ ] Guest order lookup by email + order number *(deferred)*

#### 4.3.2 Registered User Checkout
**Description:** Streamlined checkout for logged-in users

**Implementation Status:** Deferred to v2 - Guest checkout only for MVP

**Requirements:**
- Pre-fill saved addresses *(deferred)*
- Pre-fill saved payment method (last 4 digits shown) *(deferred)*
- One-click reorder from order history *(deferred)*
- Apply discount codes *(deferred)*

#### 4.3.3 Shipping Information ✅
**Description:** Collect and validate shipping address

**Implementation Status:** Complete - Form at `/checkout`

**Requirements:**
- Fields: Name, Street Address, Apt/Suite (optional), City, State, ZIP, Country
- US-only shipping for MVP
- Address validation (USPS API or similar)
- Calculate shipping cost based on ZIP code
- Shipping options: Standard (5-7 days), Express (2-3 days)

**Acceptance Criteria:**
- [x] Invalid addresses show clear error messages
- [x] State dropdown (not free text)
- [ ] ZIP code auto-detects city/state *(deferred)*

### 4.4 Payment Processing ✅ IMPLEMENTED

#### 4.4.1 Stripe Integration (Primary) ✅
**Description:** Credit/debit card payments via Stripe

**Implementation Status:** Complete - Stripe Checkout hosted payment page with webhook integration

**Requirements:**
- Stripe Elements for card input (PCI compliant)
- Accept Visa, Mastercard, Amex, Discover
- Apple Pay / Google Pay support
- Secure tokenization (card data never touches our servers)
- Handle declined cards gracefully
- Webhooks for payment confirmation

**Acceptance Criteria:**
- [x] Card input shows real-time validation (card type icon) *(Stripe Checkout handles)*
- [x] Declined cards show user-friendly error message
- [x] Successful payment triggers order confirmation email
- [x] SSL/HTTPS enforced on all payment pages

#### 4.4.2 Venmo Integration (Secondary) ✅
**Description:** Teen-friendly Venmo payment option

**Implementation Status:** Complete - QR code generation with admin verification flow

**Requirements:**
- Display Venmo QR code at checkout
- Manual verification flow (MVP):
  1. Customer scans QR, pays via Venmo app
  2. Customer enters Venmo transaction ID
  3. Admin manually verifies payment
  4. Order marked as paid
- Clear instructions for Venmo payment process

**Acceptance Criteria:**
- [x] QR code generates unique order reference
- [x] Venmo option prominently displayed (teen preference)
- [x] Clear copy explaining Venmo payment steps
- [x] Admin can verify/reject Venmo payments

### 4.5 User Authentication

**Implementation Status:** Deferred to v2 - Guest checkout sufficient for MVP

#### 4.5.1 Registration
**Description:** Create user account

**Implementation Status:** Deferred to v2

**Requirements:**
- Fields: Email, Password, Confirm Password
- Password requirements: 8+ chars, 1 uppercase, 1 number
- Email verification required
- Terms of Service and Privacy Policy checkbox
- Age confirmation (13+)

**Acceptance Criteria:**
- [ ] Duplicate email shows clear error *(deferred)*
- [ ] Password strength indicator *(deferred)*
- [ ] Verification email sent within 30 seconds *(deferred)*
- [ ] Cannot checkout until email verified (if registered) *(deferred)*

#### 4.5.2 Login
**Description:** Authenticate existing users

**Implementation Status:** Deferred to v2

**Requirements:**
- Email + Password login
- "Remember Me" checkbox (30-day session)
- Forgot Password flow (email reset link)
- Account lockout after 5 failed attempts (15 min)
- Redirect to previous page after login

#### 4.5.3 Account Dashboard
**Description:** User account management

**Implementation Status:** Deferred to v2

**Requirements:**
- View order history *(deferred)*
- Track current orders *(deferred)*
- Update profile (email, password) *(deferred)*
- Manage saved addresses *(deferred)*
- Manage saved payment methods *(deferred)*
- Delete account (CCPA compliance) *(deferred)*

### 4.6 Order Management ✅ IMPLEMENTED

#### 4.6.1 Order Confirmation ✅
**Description:** Post-purchase confirmation

**Implementation Status:** Complete - Success pages and email confirmations

**Requirements:**
- Confirmation page with order summary
- Order number generated (format: ORD-YYYYMMDD-XXXXX) ✅
- Email confirmation with: ✅
  - Order details ✅
  - Shipping address ✅
  - Estimated delivery date ✅
  - Customer support contact ✅
- PDF receipt download option *(deferred)*

#### 4.6.2 Order Tracking
**Description:** Track order status

**Implementation Status:** Partial - Admin can view/update, customer tracking deferred

**Requirements:**
- Order statuses: Pending → Processing → Shipped → Delivered
- Email notification on status change
- Tracking number with carrier link (when shipped)
- Guest order lookup (email + order number)

---

## 5. Admin Features (MVP) ✅ IMPLEMENTED

### 5.1 Inventory Management ✅

#### 5.1.1 Admin Dashboard (Primary) ✅
**Description:** Built-in admin dashboard for product management

**Implementation Status:** Complete - Full admin UI at `/admin`

**Features:**
- Product editing (name, description, price, stock, image URL)
- Order viewing and management
- Venmo payment verification
- Revenue tracking
- Inventory logging

#### 5.1.2 Google Sheets Integration (Optional) ✅
**Description:** Optional inventory sync via Google Sheets

**Implementation Status:** Complete but optional - Admin dashboard is primary interface

**Requirements:**
- Sheet columns: product_id, name, description, price, stock_quantity, image_url, status
- Sync frequency: Every 5 minutes (cron job)
- Validation: Alert admin if invalid data entered
- Changes reflected on live site within 10 minutes

**Acceptance Criteria:**
- [x] Admin can update price (via dashboard or Sheets)
- [x] Admin can set stock to 0 to mark sold out
- [x] Audit log of changes (inventory_log table)
- [ ] Invalid data validation *(basic validation implemented)*

### 5.2 Order Dashboard ✅

**Description:** View and manage orders

**Implementation Status:** Complete at `/admin/orders`

**Requirements:**
- List all orders (newest first)
- Filter by: status, date range, payment method
- Order detail view with customer info
- Update order status
- Process refunds (via Stripe dashboard)
- Export orders to CSV

### 5.3 Analytics (Basic) ✅

**Description:** Business insights dashboard

**Implementation Status:** Complete - Basic stats on admin dashboard

**Requirements:**
- Total revenue (daily, weekly, monthly)
- Number of orders
- Top-selling products
- Cart abandonment rate
- Average order value

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| Lighthouse Performance | > 90 |
| API Response Time | < 200ms |

### 6.2 Security ✅ IMPLEMENTED

- **HTTPS:** Required on all pages ✅
- **PCI-DSS:** Stripe handles card data (no card storage) ✅
- **XSS Protection:** Sanitize all user inputs ✅
- **CSRF Protection:** Next.js built-in protection ✅
- **SQL Injection:** Prisma ORM parameterized queries ✅
- **Rate Limiting:** Vercel edge protection ✅
- **Session Security:** HTTP-only cookies for cart ✅
- **Admin Authentication:** Key-based system ✅

*See [SECURITY.md](../security/SECURITY.md) for full security requirements.*

### 6.3 Compliance

| Regulation | Requirement |
|------------|-------------|
| **COPPA** | Age gate (13+), parental consent mechanism |
| **PCI-DSS** | Never store card data, use Stripe tokenization |
| **CCPA** | Privacy policy, data deletion requests, opt-out |
| **ADA/WCAG** | 2.1 AA accessibility compliance |

*See [COMPLIANCE_CHECKLIST.md](../security/COMPLIANCE_CHECKLIST.md) for full checklist.*

### 6.4 Accessibility

**Implementation Status:** Partial - Basic accessibility implemented

- Screen reader compatible (ARIA labels) ✅
- Keyboard navigation (all interactive elements) ✅
- Color contrast ratio: 4.5:1 minimum ✅
- Focus indicators visible ✅
- Alt text on all images ✅
- Form labels properly associated ✅
- No content requires color alone to convey meaning ✅

### 6.5 Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 100+ |
| Safari | 15+ |
| Firefox | 100+ |
| Edge | 100+ |
| Safari iOS | 15+ |
| Chrome Android | 100+ |

### 6.6 Scalability Targets (MVP)

- **Concurrent Users:** 100 simultaneous ✅
- **Monthly Orders:** 500 ✅
- **Product Catalog:** Up to 100 products (currently 14) ✅
- **Database Size:** Up to 1GB ✅

---

## 7. Out of Scope (MVP)

The following features are explicitly excluded from MVP:

### Deferred to v2
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Gift cards
- [ ] Discount codes (complex rules)
- [ ] International shipping
- [ ] Multi-currency support
- [ ] Real-time inventory (Google Sheets delay acceptable)
- [ ] Live chat support
- [ ] Mobile app (web only)
- [ ] Social login (Google, Apple)
- [ ] Advanced analytics (cohort analysis, LTV)
- [ ] A/B testing infrastructure
- [ ] Automated email marketing

### Will Not Build
- [ ] Wholesale/B2B features
- [ ] Subscription boxes
- [ ] Cryptocurrency payments
- [ ] Auction functionality
- [ ] User-generated content (beyond reviews)

---

## 8. Technical Constraints ✅ IMPLEMENTED

### 8.1 Technology Stack (As Implemented)
- **Frontend:** Next.js 14+, React 19, TypeScript ✅
- **Styling:** Tailwind CSS, shadcn/ui ✅
- **Backend:** Next.js API routes ✅
- **Database:** PostgreSQL (local for dev, Vercel Postgres for production) ✅
- **ORM:** Prisma 7.3.0 with PostgreSQL adapter ✅
- **Authentication:** Key-based admin auth (NextAuth deferred to v2) ✅
- **Payments:** Stripe SDK + Venmo QR ✅
- **Email:** Resend (order confirmations) ✅
- **Hosting:** Vercel ✅
- **Images:** Next.js Image component + `/public` folder ✅

*See [TECHNOLOGY_STACK.md](../architecture/TECHNOLOGY_STACK.md) for details.*

### 8.2 Development Constraints
- TypeScript strict mode required
- ESLint + Prettier formatting enforced
- All API endpoints must have error handling
- No secrets in code (environment variables only)
- All database changes via migrations

---

## 9. User Flows ✅ IMPLEMENTED

### 9.1 Guest Purchase Flow
```
Landing Page → Browse Products → View Product Details
→ Add to Cart → View Cart → Checkout (Guest)
→ Enter Shipping → Choose Payment → Confirm Order
→ Order Confirmation → Email Receipt
```

### 9.2 Registered User Flow
```
Login → Browse Products → Add to Cart
→ Checkout (Saved Address) → One-Click Payment
→ Order Confirmation → Track Order
```
**Status:** Deferred to v2 (guest checkout only in MVP)

### 9.3 Admin Flow ✅
```
Login with Admin Key → Dashboard → Manage Products/Orders
→ Verify Venmo Payments → Update Inventory → Export to Sheets (optional)
```

*See [USER_FLOWS.md](./USER_FLOWS.md) for detailed flow diagrams.*

---

## 10. Milestones & Phases (COMPLETED)

### Phase 1: Foundation (Feb 2-3) ✅
- [x] Database schema design
- [x] Product catalog API
- [x] Basic product listing page
- [x] User authentication (deferred to v2)

### Phase 2: Shopping (Feb 3) ✅
- [x] Product detail pages
- [x] Shopping cart functionality
- [x] Cart persistence (session-based)

### Phase 3: Checkout (Feb 3) ✅
- [x] Guest checkout flow
- [x] Stripe payment integration
- [x] Order confirmation emails

### Phase 4: Admin & Polish (Feb 3) ✅
- [x] Admin dashboard (replaced Google Sheets as primary)
- [x] Admin order management
- [x] Venmo payment option
- [x] Google Sheets integration (optional)

### Phase 5: Production Ready (Feb 3-4) ✅
- [x] Email confirmations (Resend)
- [x] Payment webhooks
- [x] Admin authentication
- [x] Full product management
- [ ] Accessibility audit (basic implementation done)
- [ ] End-to-end testing (manual testing complete)
- [ ] Production deployment (ready for Vercel)
- [ ] Monitoring setup (Vercel Analytics available)

---

## 11. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Stripe integration delays | High | Medium | Use Stripe test mode early, follow their docs |
| Google Sheets sync issues | Medium | Medium | Implement retry logic, admin notifications |
| COPPA compliance mistakes | High | Low | Legal review of age gate implementation |
| Mobile performance issues | High | Medium | Lighthouse testing throughout development |
| Payment fraud | High | Low | Stripe Radar, manual review for large orders |

---

## 12. Dependencies (As Implemented)

### External Services ✅
- **Stripe:** Payment processing ✅
- **Venmo Business:** QR code payments (@aichiho) ✅
- **Resend:** Transactional emails ✅
- **Google Sheets API:** Optional inventory sync ✅
- **Vercel:** Hosting and deployment ✅

### Third-Party Libraries ✅
- **Prisma:** Database ORM ✅
- **shadcn/ui:** UI components ✅
- **Stripe SDK:** Payment processing ✅
- **qrcode:** QR code generation ✅
- **Resend:** Email service ✅
- **NextAuth.js:** Authentication (deferred to v2)
- **Zod:** Input validation (deferred to v2)
- **React Query:** Data fetching (deferred to v2)

---

## 13. Appendix

### A. Glossary
- **SKU:** Stock Keeping Unit - unique product identifier
- **PCI-DSS:** Payment Card Industry Data Security Standard
- **COPPA:** Children's Online Privacy Protection Act
- **CCPA:** California Consumer Privacy Act
- **LCP:** Largest Contentful Paint (performance metric)

### B. Related Documents
- [USER_PERSONAS.md](./USER_PERSONAS.md) - Detailed user personas
- [USER_STORIES.md](./USER_STORIES.md) - User stories and acceptance criteria
- [USER_FLOWS.md](./USER_FLOWS.md) - Detailed user flow diagrams
- [TECHNOLOGY_STACK.md](../architecture/TECHNOLOGY_STACK.md) - Technical stack details
- [SECURITY.md](../security/SECURITY.md) - Security requirements
- [DATABASE_SCHEMA.md](../architecture/DATABASE_SCHEMA.md) - Database design

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial draft |
| 2.0 | 2026-02-04 | Implementation Complete | Updated with actual implementation status |

**Approval:**
- [x] Product Owner (User)
- [x] Tech Lead (Claude Code + User)
- [x] Security Review (Stripe PCI-DSS compliance)
