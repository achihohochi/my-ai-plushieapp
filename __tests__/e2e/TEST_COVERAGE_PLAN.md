# E2E Test Coverage Plan

## Current State
- 3 test files with 15 tests
- Coverage: Products ✅ | Cart ✅ | Basic Checkout ⚠️
- Missing: Admin, Payment Completion, Post-Purchase Flows

---

## Reorganization Plan

### 1. products/ (EXISTING - 4 tests)
- `product-browsing.spec.ts` (move here)
  - Display products on shop page
  - Navigate to product detail page
  - Show product images
  - Navigate back to shop

**Gaps to Fill:**
- [ ] Out of stock product handling
- [ ] Product filtering/sorting (if implemented)
- [ ] Product search (if implemented)

---

### 2. cart/ (EXISTING - 6 tests)
- `cart-operations.spec.ts` (move here)
  - Add product to cart
  - Persist cart after refresh
  - Update quantity
  - Remove item
  - Navigate to checkout
  - Continue shopping

**Gaps to Fill:**
- [ ] Add to cart with quantity > stock (should fail)
- [ ] Cart price calculations (subtotal, shipping, total)
- [ ] Multiple items in cart
- [ ] Cart persistence across sessions

---

### 3. guest-checkout/ (EXISTING - 5 tests)
- `guest-checkout.spec.ts` (move here)
  - Complete checkout to Stripe redirect
  - Create Venmo order with QR
  - Validate required fields
  - Handle empty cart

**Needs Enhancement:**
- Current tests only check redirects, not completion
- Need full end-to-end payment flows

---

### 4. payment/ (NEW - 0 tests currently)

**Tests to Create:**

#### `stripe-checkout.spec.ts` (CRITICAL)
- [ ] Complete Stripe purchase flow with webhook simulation
- [ ] Verify order created in database after payment
- [ ] Verify inventory decremented
- [ ] Verify cart cleared after payment
- [ ] Verify confirmation email sent
- [ ] Verify order appears in admin panel
- [ ] Test Stripe webhook duplicate handling
- [ ] Test failed payment handling

#### `venmo-checkout.spec.ts` (CRITICAL)
- [ ] Complete Venmo order creation
- [ ] Verify QR code displayed
- [ ] Verify order status is 'pending_payment_verification'
- [ ] Verify cart cleared after order creation
- [ ] Verify order appears in admin Venmo queue
- [ ] Deep link generation
- [ ] Expired payment handling (if implemented)

---

### 5. admin/ (NEW - 0 tests currently)

**Tests to Create:**

#### `admin-auth.spec.ts`
- [ ] Login with valid admin key
- [ ] Login with invalid admin key
- [ ] Access protected routes without login (should redirect)
- [ ] Logout functionality
- [ ] Session persistence

#### `admin-dashboard.spec.ts`
- [ ] View dashboard stats (total orders, revenue)
- [ ] Google Sheets sync button works
- [ ] Recent orders displayed
- [ ] Navigation to other admin pages

#### `admin-orders.spec.ts`
- [ ] View all orders list
- [ ] Filter orders by status
- [ ] View individual order details
- [ ] Search orders by customer email/order number
- [ ] Export orders (if implemented)

#### `admin-products.spec.ts`
- [ ] View all products
- [ ] Edit product price
- [ ] Edit product stock
- [ ] Changes persist after refresh
- [ ] Changes reflected on shop page

#### `admin-venmo.spec.ts` (CRITICAL)
- [ ] View pending Venmo payments
- [ ] Verify Venmo payment (updates order status to 'paid')
- [ ] Reject Venmo payment (updates order status)
- [ ] Verified payment sends confirmation email
- [ ] Verified payment decrements inventory
- [ ] Order disappears from pending queue after verification

---

## Priority Matrix

### 🔥 P0 - Critical (Block Production)
1. `payment/stripe-checkout.spec.ts` - Full Stripe flow
2. `payment/venmo-checkout.spec.ts` - Full Venmo flow
3. `admin/admin-venmo.spec.ts` - Payment verification
4. `admin/admin-auth.spec.ts` - Security testing

### 🟡 P1 - Important (Launch Blockers)
5. `admin/admin-orders.spec.ts` - Order management
6. `admin/admin-products.spec.ts` - Inventory management
7. Enhanced cart tests (stock limits, price calculations)

### 🟢 P2 - Nice to Have
8. `admin/admin-dashboard.spec.ts` - Dashboard features
9. Enhanced product tests (filters, search)
10. Performance tests (load testing)

---

## Estimated Test Count After Completion

- products/: 4 → 7 tests
- cart/: 6 → 10 tests
- guest-checkout/: 5 → 5 tests (already good)
- payment/: 0 → 12 tests (NEW)
- admin/: 0 → 18 tests (NEW)

**Total: 15 → 52 E2E tests**

---

## Next Steps

1. Reorganize existing tests into folders ✅
2. Create payment/ tests (P0)
3. Create admin/ tests (P0-P1)
4. Enhance existing tests (P1-P2)
5. Add integration with CI/CD
6. Set up test coverage reporting

---

## Notes

- All admin tests require seeded admin key in .env.test
- Payment tests need Stripe test mode webhook secrets
- Consider using Playwright's `test.use()` for admin authentication
- Use Page Object Models for all new tests
- Follow existing naming convention: `feature-name.spec.ts`
