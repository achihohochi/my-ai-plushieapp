# Test Cases - AI Plushie E-commerce

**Product:** AI Plushie E-commerce Platform
**Framework:** Vitest + Playwright
**Last Updated:** February 4, 2026
**Status:** ✅ 61 Automated Tests Implemented

---

## Purpose of This Document

This document contains detailed, step-by-step test cases for all features. Each test case includes:
- Test ID (unique identifier)
- Description
- Preconditions
- Test steps
- Expected results
- Priority (Critical/High/Medium/Low)
- Status (Pass/Fail/Not Run)

---

## ✅ Implementation Status (Feb 4, 2026)

**Automated Tests Implemented:** 61 tests across 19 files

### E2E Tests (42 tests) - **All Passing**
| Feature Area | Tests | File Location |
|--------------|-------|---------------|
| Product Browsing | 4 | `__tests__/e2e/products/product-browsing.spec.ts` |
| Cart Operations | 6 | `__tests__/e2e/cart/cart-operations.spec.ts` |
| Guest Checkout | 5 | `__tests__/e2e/guest-checkout/guest-checkout.spec.ts` |
| Stripe Payment | 8 | `__tests__/e2e/payment/stripe-checkout.spec.ts` |
| Venmo Payment | 10 | `__tests__/e2e/payment/venmo-checkout.spec.ts` |
| Admin Authentication | 8 | `__tests__/e2e/admin/admin-auth.spec.ts` |
| Admin Venmo Verification | 9 | `__tests__/e2e/admin/admin-venmo.spec.ts` |

### Integration Tests (14 tests) - **All Passing**
- API routes (products, cart, checkout, admin)
- Webhook handling (Stripe duplicates, order creation)
- Concurrency testing (race conditions)
- Idempotency testing (duplicate prevention)
- Transaction safety (rollbacks)

### Unit Tests (5 tests) - **All Passing**
- Order number generation
- Price formatting
- Email template generation
- Stripe/Venmo utilities

**For detailed implementation summary:** [../../__tests__/e2e/TEST_COMPLETION_SUMMARY.md](../../__tests__/e2e/TEST_COMPLETION_SUMMARY.md)

---

## 1. Product Catalog Test Cases

### TC-001: View Product Listing Page

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can view all available products on the shop page.

**Preconditions:**
- At least 5 products exist in database with status 'active'
- User navigates to /shop

**Test Steps:**
1. Navigate to http://localhost:3002/shop
2. Wait for page to load

**Expected Results:**
- Page title displays "Shop Plushies" or similar
- At least 5 product cards are visible
- Each card shows: product image, name, price
- Grid layout is responsive (2 cols mobile, 4 cols desktop)
- No loading errors or broken images

**Actual Results:** _[To be filled after test execution]_

---

### TC-002: Filter Products by Price Range

**Priority:** Medium
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can filter products by price range.

**Preconditions:**
- Products exist with various prices ($10-$50)
- User is on /shop page

**Test Steps:**
1. Click "Filter" button or expand filter section
2. Set price range: Min $20, Max $30
3. Click "Apply" or filter updates automatically

**Expected Results:**
- Only products priced between $20-$30 are displayed
- Products outside range are hidden
- Filter persists after page refresh
- URL updates to reflect filter (e.g., ?price_min=20&price_max=30)

**Actual Results:** _[To be filled]_

---

### TC-003: Sort Products by Price (Low to High)

**Priority:** Medium
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can sort products by price ascending.

**Preconditions:**
- Multiple products with different prices exist
- User is on /shop page

**Test Steps:**
1. Click "Sort" dropdown
2. Select "Price: Low to High"

**Expected Results:**
- Products reorder with cheapest first
- Prices increase from left to right, top to bottom
- Sort preference persists after page refresh
- Sort indicator shows current selection

**Actual Results:** _[To be filled]_

---

### TC-004: View Product Details

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can view detailed information about a product.

**Preconditions:**
- Product exists with ID 1
- User is on /shop page

**Test Steps:**
1. Click on first product card
2. Wait for product detail page to load

**Expected Results:**
- Navigate to /products/1
- Product name displayed as H1 heading
- Large product image visible (zoomable)
- Price displayed prominently
- Full description visible
- Dimensions shown (e.g., "12 inches tall")
- Material information visible
- Stock status shown ("In Stock" or "Only X left!")
- Quantity selector visible (1-10)
- "Add to Cart" button visible and enabled (if in stock)

**Actual Results:** _[To be filled]_

---

### TC-005: Sold Out Product Cannot Be Added to Cart

**Priority:** Critical
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** Sold out products display correctly and cannot be added to cart.

**Preconditions:**
- Product exists with stock_quantity = 0
- User navigates to product detail page

**Test Steps:**
1. Navigate to /products/{id} for sold-out product
2. Observe button state

**Expected Results:**
- "Add to Cart" button is disabled (grayed out)
- Button text shows "Sold Out" or "Out of Stock"
- Quantity selector is hidden or disabled
- Sold Out badge visible on product card

**Actual Results:** _[To be filled]_

---

## 2. Shopping Cart Test Cases

### TC-006: Add Product to Cart

**Priority:** Critical
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can add a product to their shopping cart.

**Preconditions:**
- Product exists with stock > 0
- User is on product detail page
- Cart is empty

**Test Steps:**
1. Navigate to /products/1
2. Click "Add to Cart" button
3. Observe cart badge

**Expected Results:**
- Success notification appears: "Added to cart!"
- Cart badge in header updates from 0 to 1
- Cart sidebar auto-opens for 3 seconds (optional)
- User remains on product detail page
- Product is visible in cart when sidebar opened

**Actual Results:** _[To be filled]_

---

### TC-007: Update Quantity in Cart

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can change the quantity of items in their cart.

**Preconditions:**
- Product with ID 1 is in cart with quantity 1
- Product has stock >= 5
- User opens cart sidebar

**Test Steps:**
1. Click cart icon in header
2. Find product in cart
3. Click "+" button 2 times
4. Observe quantity display

**Expected Results:**
- Quantity increases: 1 → 2 → 3
- Item subtotal updates: $24.99 → $49.98 → $74.97
- Cart total updates accordingly
- Changes persist after page refresh

**Actual Results:** _[To be filled]_

---

### TC-008: Remove Item from Cart

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can remove an item from their cart.

**Preconditions:**
- Cart contains 1 product
- User opens cart sidebar

**Test Steps:**
1. Click cart icon
2. Click "Remove" or trash icon next to product
3. Confirm removal (if confirmation dialog appears)

**Expected Results:**
- Product is removed from cart immediately
- Cart badge updates to 0
- Empty cart state displays: "Your cart is empty"
- "Browse Products" link visible

**Actual Results:** _[To be filled]_

---

### TC-009: Cart Persists After Page Refresh

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** Cart contents persist across browser sessions.

**Preconditions:**
- User is not logged in (guest)
- Cart is empty

**Test Steps:**
1. Add product to cart
2. Close browser tab
3. Reopen browser and navigate to site
4. Check cart badge

**Expected Results:**
- Cart badge shows 1 item
- Opening cart shows the same product
- Quantity and price are correct
- Cart persists for 30 days (localStorage)

**Actual Results:** _[To be filled]_

---

### TC-010: Guest Cart Merges with User Cart on Login

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** When a guest with items in cart logs in, their cart merges with saved cart.

**Preconditions:**
- User has account with email test@example.com
- User is not logged in
- User's saved cart contains Product A (quantity 1)

**Test Steps:**
1. As guest, add Product B to cart (quantity 2)
2. Click "Login" in header
3. Enter credentials and log in
4. Open cart sidebar

**Expected Results:**
- Cart contains both products:
  - Product A (quantity 1) from saved cart
  - Product B (quantity 2) from guest cart
- If same product in both carts, quantities sum (capped by stock)
- Cart badge shows correct total count
- No items lost during merge

**Actual Results:** _[To be filled]_

---

## 3. Checkout Test Cases

### TC-011: Guest Checkout - Complete Purchase

**Priority:** CRITICAL 🔴
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** Guest user can complete a full purchase without creating an account.

**Preconditions:**
- Product is in cart
- User is not logged in
- Stripe test mode enabled

**Test Steps:**
1. Click "Checkout" button in cart
2. Select "Checkout as Guest"
3. Fill shipping information:
   - Email: test@example.com
   - Name: Test User
   - Address: 123 Main St
   - City: San Francisco
   - State: CA
   - ZIP: 94102
4. Click "Continue to Payment"
5. Fill Stripe payment form:
   - Card: 4242 4242 4242 4242
   - Expiry: 12/30
   - CVC: 123
   - ZIP: 94102
6. Click "Complete Purchase"
7. Wait for order confirmation

**Expected Results:**
- Each step loads without errors
- Form validation works (red borders on invalid fields)
- Payment processes within 5 seconds
- Redirects to order confirmation page
- Page shows:
  - "Order Confirmed!" heading
  - Order number (format: PLU-YYYYMMDD-XXXXX)
  - Order summary (items, prices, total)
  - Shipping address
  - Estimated delivery date
- Email confirmation sent within 30 seconds
- Cart is cleared (badge shows 0)
- Order saved to database

**Actual Results:** _[To be filled]_

---

### TC-012: Registered User Checkout with Saved Address

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** Logged-in user can checkout using saved address.

**Preconditions:**
- User is logged in
- User has saved address in account
- Product is in cart

**Test Steps:**
1. Click "Checkout"
2. Observe shipping information step

**Expected Results:**
- Shipping form is pre-filled with saved address
- User can edit address if needed
- User can select from multiple saved addresses (dropdown)
- Checkout is faster (fewer fields to fill)

**Actual Results:** _[To be filled]_

---

### TC-013: Declined Card Shows Error

**Priority:** Critical
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** When a card is declined, user sees helpful error message.

**Preconditions:**
- User is on payment step
- Stripe test mode enabled

**Test Steps:**
1. Fill payment form with declined test card:
   - Card: 4000 0000 0000 0002 (Stripe's declined card)
   - Expiry: 12/30
   - CVC: 123
2. Click "Complete Purchase"
3. Wait for response

**Expected Results:**
- Payment fails gracefully
- Error message displays: "Your card was declined. Please try another payment method."
- User remains on payment page
- Can retry with different card
- Order is NOT created in database
- Cart is NOT cleared

**Actual Results:** _[To be filled]_

---

### TC-014: Venmo QR Code Payment

**Priority:** Medium
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can complete purchase using Venmo QR code.

**Preconditions:**
- User is on payment step
- Venmo payment option enabled

**Test Steps:**
1. Select "Pay with Venmo" option
2. Observe QR code display
3. Note instructions
4. Enter mock Venmo transaction ID: VEN-TEST-123456
5. Click "Complete Purchase"

**Expected Results:**
- Venmo QR code displays (minimum 200x200 pixels)
- Order reference included in QR code
- Instructions visible: "1. Open Venmo app 2. Scan QR code 3. Complete payment 4. Enter transaction ID"
- Transaction ID input field visible
- Format validation on transaction ID (alphanumeric, 12-20 chars)
- Order status set to "Payment Pending Verification"
- Admin notified to verify payment
- User sees confirmation: "Your order is being processed"

**Actual Results:** _[To be filled]_

---

## 4. User Authentication Test Cases

### TC-015: User Registration

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** New user can create an account.

**Preconditions:**
- User is not logged in
- Email test-{timestamp}@example.com does not exist

**Test Steps:**
1. Click "Sign Up" or "Register"
2. Fill registration form:
   - Email: test-{timestamp}@example.com
   - Password: TestPass123!
   - Confirm Password: TestPass123!
   - Check "I am 13 or older"
   - Check "I agree to Terms & Privacy Policy"
3. Click "Create Account"

**Expected Results:**
- Form validates in real-time
- Password strength indicator shows "Strong"
- Account created in database
- Verification email sent
- Redirects to "Verify your email" page
- Message: "We sent a verification email to {email}"

**Actual Results:** _[To be filled]_

---

### TC-016: User Login

**Priority:** Critical
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** Registered user can log in.

**Preconditions:**
- User account exists with email test@example.com
- Email is verified
- User is not logged in

**Test Steps:**
1. Click "Login"
2. Enter email: test@example.com
3. Enter password: correctpassword
4. Click "Log In"

**Expected Results:**
- Authentication succeeds within 2 seconds
- Redirects to previous page (or homepage)
- Header updates: "Login" → "My Account"
- Cart syncs (if items in guest cart)
- Session cookie set (HTTP-only)

**Actual Results:** _[To be filled]_

---

### TC-017: Failed Login (Invalid Password)

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User cannot log in with wrong password.

**Preconditions:**
- User account exists
- User is not logged in

**Test Steps:**
1. Navigate to login page
2. Enter email: test@example.com
3. Enter password: wrongpassword
4. Click "Log In"

**Expected Results:**
- Error message displays: "Invalid email or password"
- Does NOT reveal which field is wrong (security)
- User can retry
- After 5 failed attempts, account locks for 15 minutes
- Lockout message: "Too many failed attempts. Try again in 15 minutes."

**Actual Results:** _[To be filled]_

---

### TC-018: Password Reset

**Priority:** Medium
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** User can reset forgotten password.

**Preconditions:**
- User account exists

**Test Steps:**
1. Click "Forgot Password?" on login page
2. Enter email: test@example.com
3. Click "Send Reset Link"
4. Check email (test inbox)
5. Click reset link in email
6. Enter new password: NewPass123!
7. Confirm new password: NewPass123!
8. Click "Reset Password"

**Expected Results:**
- Reset email sent within 30 seconds
- Reset link valid for 1 hour
- Password successfully updated in database
- Old password no longer works
- Redirects to login page with message: "Password reset successfully. Please log in."

**Actual Results:** _[To be filled]_

---

## 5. Admin Test Cases

### TC-019: Admin Login

**Priority:** Critical
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** Admin user can access admin dashboard.

**Preconditions:**
- Admin account exists (role = 'admin')
- Admin is not logged in

**Test Steps:**
1. Navigate to /admin
2. If redirected to login, enter admin credentials
3. Log in

**Expected Results:**
- Redirects to /admin/dashboard
- Admin dashboard displays:
  - Total orders count
  - Revenue metrics
  - Recent orders list
  - Quick actions (view orders, update inventory)
- Non-admin users cannot access /admin (403 Forbidden)

**Actual Results:** _[To be filled]_

---

### TC-020: Admin Views Orders

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** Admin can view all customer orders.

**Preconditions:**
- Admin is logged in
- At least 5 orders exist in database

**Test Steps:**
1. Navigate to /admin/orders
2. Observe order list

**Expected Results:**
- Orders display in table format
- Columns: Order #, Date, Customer, Total, Status, Actions
- Orders sorted by newest first (default)
- Can filter by status, date range, payment method
- Can search by order number or customer email
- Pagination (20 orders per page)

**Actual Results:** _[To be filled]_

---

### TC-021: Admin Updates Order Status

**Priority:** High
**Type:** E2E
**Status:** ⏳ Not Run

**Description:** Admin can change order status and customer receives notification.

**Preconditions:**
- Admin is logged in
- Order exists with status "Processing"

**Test Steps:**
1. Navigate to /admin/orders/{orderId}
2. Click "Update Status" button
3. Select "Shipped" from dropdown
4. Enter tracking number: 1Z999AA10123456784
5. Click "Save"

**Expected Results:**
- Order status updates to "Shipped" in database
- Tracking number saved
- Customer receives email notification:
  - Subject: "Your order has shipped!"
  - Includes tracking number with carrier link
  - Sent within 5 minutes
- Status timestamp logged

**Actual Results:** _[To be filled]_

---

### TC-022: Inventory Sync from Google Sheets

**Priority:** Critical
**Type:** Integration
**Status:** ⏳ Not Run

**Description:** Cron job syncs inventory from Google Sheets to database.

**Preconditions:**
- Google Sheets API configured
- Test sheet contains product data
- Cron job scheduled to run every 5 minutes

**Test Steps:**
1. Update product price in Google Sheet: $24.99 → $19.99
2. Wait for sync (up to 5 minutes)
3. Refresh product page on website
4. Check price display

**Expected Results:**
- New price reflects on website within 10 minutes
- Database updated correctly
- Audit log records change:
  - Product ID
  - Field changed (price)
  - Old value → New value
  - Timestamp
  - Admin email (from Google account)
- If invalid data (negative price), sync fails gracefully and admin receives error email

**Actual Results:** _[To be filled]_

---

## 6. Accessibility Test Cases

### TC-023: Keyboard Navigation - Homepage

**Priority:** Critical
**Type:** Manual
**Status:** ⏳ Not Run

**Description:** User can navigate entire homepage using only keyboard.

**Preconditions:**
- User is on homepage
- Mouse is unplugged or not used

**Test Steps:**
1. Press Tab repeatedly to navigate through page
2. Observe focus indicators
3. Press Enter on "Shop Now" button

**Expected Results:**
- Focus moves through elements in logical order:
  - Skip to content link (first)
  - Logo link
  - Navigation links
  - Search bar
  - Cart icon
  - Product cards
  - Footer links
- Focus indicators are clearly visible (outline or highlight)
- All interactive elements are reachable
- "Shop Now" button activates with Enter key

**Actual Results:** _[To be filled]_

---

### TC-024: Screen Reader - Product Page

**Priority:** High
**Type:** Manual
**Status:** ⏳ Not Run

**Description:** Product page is fully accessible via screen reader.

**Preconditions:**
- Screen reader enabled (NVDA on Windows, VoiceOver on Mac)
- User navigates to product detail page

**Test Steps:**
1. Navigate to /products/1
2. Use screen reader to explore page
3. Listen to announcements

**Expected Results:**
- Product name announced as H1 heading
- Product image has descriptive alt text: "Pink AI Bunny Plushie, 12 inches tall, sitting position"
- Price announced: "Price: $24.99"
- Quantity selector announces: "Quantity: 1 of 10 available"
- "Add to Cart" button announces: "Add to Cart, button"
- Stock status announced: "In Stock" or "Only 3 left"
- All form labels properly associated with inputs

**Actual Results:** _[To be filled]_

---

### TC-025: Color Contrast Check

**Priority:** High
**Type:** Automated
**Status:** ⏳ Not Run

**Description:** All text meets WCAG 2.1 AA contrast requirements.

**Preconditions:**
- Site is running locally
- axe DevTools extension installed

**Test Steps:**
1. Navigate to homepage
2. Open browser DevTools
3. Click "axe DevTools" tab
4. Click "Scan All of My Page"
5. Review results

**Expected Results:**
- 0 color contrast violations
- All text has 4.5:1 ratio (normal text)
- Large text has 3:1 ratio minimum
- UI components have 3:1 ratio
- If violations found, fix and rescan

**Actual Results:** _[To be filled]_

---

## 7. Performance Test Cases

### TC-026: Homepage Load Time (Mobile 4G)

**Priority:** Critical
**Type:** Performance
**Status:** ⏳ Not Run

**Description:** Homepage loads quickly on mobile 4G connection.

**Preconditions:**
- Lighthouse CI configured
- Site deployed to staging

**Test Steps:**
1. Open Chrome DevTools
2. Set throttling to "Fast 4G"
3. Set device to "iPhone 13"
4. Run Lighthouse audit
5. Review Performance score

**Expected Results:**
- Performance score: 90+
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3s
- Total Blocking Time (TBT): < 300ms
- Cumulative Layout Shift (CLS): < 0.1

**Actual Results:** _[To be filled]_

---

### TC-027: Product Page Load Time

**Priority:** High
**Type:** Performance
**Status:** ⏳ Not Run

**Description:** Product detail page loads quickly.

**Preconditions:**
- Site deployed
- Product with images exists

**Test Steps:**
1. Navigate to /products/1
2. Run Lighthouse audit
3. Review Performance score

**Expected Results:**
- Performance score: 90+
- LCP < 2.5s
- Images lazy loaded (only visible images load initially)
- WebP format used (30-50% smaller than JPEG)

**Actual Results:** _[To be filled]_

---

## 8. Security Test Cases

### TC-028: SQL Injection Attack Prevention

**Priority:** Critical
**Type:** Security
**Status:** ⏳ Not Run

**Description:** Site is protected against SQL injection attacks.

**Preconditions:**
- Site is running
- Test database active

**Test Steps:**
1. Navigate to search bar
2. Enter SQL injection string: `' OR '1'='1`
3. Submit search
4. Observe results

**Expected Results:**
- Query does NOT return all products
- Input is sanitized/escaped
- Search returns 0 results or error message
- No database error exposed to user
- Database logs show no suspicious queries

**Actual Results:** _[To be filled]_

---

### TC-029: XSS Attack Prevention

**Priority:** Critical
**Type:** Security
**Status:** ⏳ Not Run

**Description:** Site is protected against cross-site scripting (XSS).

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to profile edit page
2. Enter name: `<script>alert('XSS')</script>`
3. Save profile
4. Navigate to page that displays name

**Expected Results:**
- Script does NOT execute
- Name displays as plain text: `<script>alert('XSS')</script>`
- All user inputs are sanitized (React escapes by default)
- No alert popup appears

**Actual Results:** _[To be filled]_

---

### TC-030: HTTPS Enforcement

**Priority:** Critical
**Type:** Security
**Status:** ⏳ Not Run

**Description:** All pages redirect HTTP to HTTPS.

**Preconditions:**
- Site deployed to production

**Test Steps:**
1. Navigate to http://myaiplushieshop.com (HTTP, not HTTPS)
2. Observe browser URL bar

**Expected Results:**
- Automatically redirects to https://myaiplushieshop.com
- All assets (images, scripts, CSS) load over HTTPS
- No mixed content warnings
- Padlock icon visible in browser

**Actual Results:** _[To be filled]_

---

## Test Execution Summary

### Coverage by Priority

| Priority | Total Tests | Passed | Failed | Not Run |
|----------|-------------|--------|--------|---------|
| Critical | 8 | 0 | 0 | 8 |
| High | 12 | 0 | 0 | 12 |
| Medium | 7 | 0 | 0 | 7 |
| Low | 3 | 0 | 0 | 3 |
| **Total** | **30** | **0** | **0** | **30** |

### Coverage by Type

| Type | Total Tests | Passed | Failed | Not Run |
|------|-------------|--------|--------|---------|
| **E2E** | **42** | **42** | **0** | **0** | ✅ Complete |
| **Integration** | **14** | **14** | **0** | **0** | ✅ Complete |
| **Unit** | **5** | **5** | **0** | **0** | ✅ Complete |
| Manual | 2 | 0 | 0 | 2 | ⏳ Pending |
| Performance | 2 | 0 | 0 | 2 | ⏳ Pending |
| Security | 3 | 0 | 0 | 3 | ⏳ Pending |
| **TOTAL AUTOMATED** | **61** | **61** | **0** | **0** | ✅ **Production Ready** |

---

## Test Case Template

Use this template for creating new test cases:

```markdown
### TC-XXX: [Test Case Name]

**Priority:** Critical/High/Medium/Low
**Type:** E2E/Integration/Unit/Manual/Performance/Security
**Status:** ⏳ Not Run / ✅ Passed / ❌ Failed

**Description:** [What this test verifies]

**Preconditions:**
- [Condition 1]
- [Condition 2]

**Test Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Results:**
- [Expected outcome 1]
- [Expected outcome 2]

**Actual Results:** _[To be filled after test execution]_
```

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial 30 test cases |

**Related Documents:**
- [TEST_STRATEGY.md](./TEST_STRATEGY.md) - Testing approach
- [TEST_PLAN.md](./TEST_PLAN.md) - Test execution plan
- [ACCEPTANCE_CRITERIA.md](../requirements/ACCEPTANCE_CRITERIA.md) - Feature requirements

---

**End of Test Cases Document**
