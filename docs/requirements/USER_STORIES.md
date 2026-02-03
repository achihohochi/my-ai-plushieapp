# User Stories

**Product:** AI Plushie E-commerce Platform
**Version:** 1.0 (MVP)
**Last Updated:** February 2, 2026
**Related Documents:** [USER_PERSONAS.md](./USER_PERSONAS.md), [PRD.md](./PRD.md)

---

## Story Format

Each story follows the format:
```
As a [persona], I want to [action], so that [benefit].
```

**Priority Levels:**
- **P0 (Critical):** Must have for MVP launch
- **P1 (High):** Should have for MVP, can delay if necessary
- **P2 (Medium):** Nice to have for MVP
- **P3 (Low):** Deferred to post-MVP

**Story Point Estimates:**
- 1 point = ~2 hours
- 2 points = ~half day
- 3 points = ~1 day
- 5 points = ~2-3 days
- 8 points = ~1 week

---

## Epic 1: Product Discovery

### US-1.1: Browse Product Catalog
**Priority:** P0 | **Points:** 5

**As a** teen shopper (Maya),
**I want to** see all available AI plushies in a grid layout,
**So that** I can quickly browse what's available without clicking around.

**Acceptance Criteria:**
- [ ] Products displayed in responsive grid (2 cols mobile, 4 cols desktop)
- [ ] Each product shows: image, name, price
- [ ] Page loads in < 3 seconds on 4G connection
- [ ] "Sold Out" badge visible on unavailable items
- [ ] Lazy loading for images below the fold
- [ ] 20 products per page (pagination or infinite scroll)

**Notes:**
- Mobile layout is priority (Maya uses phone 85% of time)
- Large tap targets for product cards (44px minimum)

---

### US-1.2: View Product Details
**Priority:** P0 | **Points:** 3

**As a** teen shopper (Maya),
**I want to** tap/click a product to see full details,
**So that** I can decide if I want to buy it.

**Acceptance Criteria:**
- [ ] Product detail page shows: large image, name, price, description
- [ ] Product dimensions clearly displayed (e.g., "12 inches tall")
- [ ] Material/care information visible
- [ ] Stock availability shown ("In Stock" or "Only 3 left!")
- [ ] "Add to Cart" button prominent (disabled if sold out)
- [ ] Back button returns to previous scroll position in catalog

**Notes:**
- Image should take 80%+ of viewport width on mobile
- Consider image zoom on tap for detail viewing

---

### US-1.3: Filter Products
**Priority:** P1 | **Points:** 3

**As a** teen shopper (Maya),
**I want to** filter products by price and availability,
**So that** I can find items within my budget that I can actually buy.

**Acceptance Criteria:**
- [ ] Filter options: price range (slider or presets), in-stock only
- [ ] Filters apply immediately without page reload
- [ ] "Clear filters" button to reset
- [ ] Filter state persists when navigating back from product detail
- [ ] Show count of matching products

**Notes:**
- Keep filter UI simple (teens won't use complex filters)
- Consider "Under $30" quick filter button

---

### US-1.4: Sort Products
**Priority:** P1 | **Points:** 2

**As a** teen shopper (Maya),
**I want to** sort products by price or newness,
**So that** I can find the cheapest option or see what's new.

**Acceptance Criteria:**
- [ ] Sort options: Price (Low to High), Price (High to Low), Newest First
- [ ] Default sort: Newest First
- [ ] Sort selection persists during session
- [ ] Mobile: dropdown or segmented control

---

### US-1.5: Search Products
**Priority:** P2 | **Points:** 5

**As a** teen shopper (Maya),
**I want to** search for products by name or keyword,
**So that** I can find a specific plushie I saw somewhere.

**Acceptance Criteria:**
- [ ] Search bar in header (always visible)
- [ ] Search as you type (debounced, 300ms)
- [ ] Show results in dropdown (top 5 matches)
- [ ] Full results page for complete search
- [ ] "No results" message with suggestions

**Notes:**
- MVP: Simple text matching (not AI/semantic search)
- Consider search by product description too

---

## Epic 2: Shopping Cart

### US-2.1: Add to Cart
**Priority:** P0 | **Points:** 3

**As a** teen shopper (Maya),
**I want to** add a product to my cart from the detail page,
**So that** I can buy it later without losing it.

**Acceptance Criteria:**
- [ ] "Add to Cart" button on product detail page
- [ ] Quantity selector (1-10, limited by stock)
- [ ] Cart icon in header updates immediately (shows item count)
- [ ] Success feedback (button changes to "Added!" briefly)
- [ ] Cannot add more than available stock

**Notes:**
- Consider "Added to Cart" toast notification with "View Cart" link

---

### US-2.2: View Cart
**Priority:** P0 | **Points:** 3

**As a** teen shopper (Maya),
**I want to** view all items in my cart,
**So that** I can review what I'm about to buy.

**Acceptance Criteria:**
- [ ] Cart page/slide-out shows all items
- [ ] Each item shows: image (small), name, price, quantity, subtotal
- [ ] Cart total displayed at bottom
- [ ] "Continue Shopping" link to return to catalog
- [ ] "Proceed to Checkout" button (prominent)
- [ ] Empty cart shows message with CTA to browse products

**Notes:**
- Mobile: Consider slide-out drawer from right (swipe to close)
- Desktop: Full cart page

---

### US-2.3: Update Cart Quantity
**Priority:** P0 | **Points:** 2

**As a** teen shopper (Maya),
**I want to** change the quantity of items in my cart,
**So that** I can buy more or fewer of something.

**Acceptance Criteria:**
- [ ] +/- buttons to adjust quantity
- [ ] Large tap targets for +/- (44px minimum)
- [ ] Cannot exceed available stock
- [ ] Cart total updates immediately
- [ ] Setting quantity to 0 removes item (with confirmation)

---

### US-2.4: Remove from Cart
**Priority:** P0 | **Points:** 1

**As a** teen shopper (Maya),
**I want to** remove items from my cart,
**So that** I can change my mind without buying everything.

**Acceptance Criteria:**
- [ ] "Remove" button/link per item
- [ ] Swipe to delete on mobile (optional enhancement)
- [ ] Undo option (5 second window) - optional for MVP
- [ ] Cart updates immediately after removal

---

### US-2.5: Persistent Cart
**Priority:** P0 | **Points:** 3

**As a** teen shopper (Maya),
**I want to** come back later and still have my cart saved,
**So that** I don't have to re-add items after thinking about it.

**Acceptance Criteria:**
- [ ] Cart persists across browser sessions (localStorage)
- [ ] Cart syncs to server if user logs in
- [ ] Cart persists for 30 days minimum
- [ ] Sold out items in cart show warning at checkout
- [ ] Price changes reflected with notification

**Notes:**
- Critical for teen shopping behavior (add to cart → return days later)
- Consider: "Prices may have changed since you added items"

---

## Epic 3: Checkout

### US-3.1: Guest Checkout
**Priority:** P0 | **Points:** 5

**As a** teen shopper (Maya),
**I want to** checkout without creating an account,
**So that** I can buy quickly without remembering another password.

**Acceptance Criteria:**
- [ ] "Checkout as Guest" option prominently displayed
- [ ] Collect only: email, shipping address, payment info
- [ ] Email used for order confirmation (not marketing)
- [ ] Optional "Create account with this info" checkbox
- [ ] Checkout completes in < 5 form fields

**Notes:**
- Guest checkout is critical for conversion (Maya quote: "I'm leaving if I need an account")
- Guest orders still get order number and email tracking

---

### US-3.2: Enter Shipping Address
**Priority:** P0 | **Points:** 3

**As a** teen shopper (Maya),
**I want to** enter my shipping address,
**So that** my plushie gets delivered to my home.

**Acceptance Criteria:**
- [ ] Fields: Name, Street, Apt/Suite (optional), City, State, ZIP
- [ ] US-only shipping for MVP
- [ ] State as dropdown (not free text)
- [ ] ZIP auto-fills City and State when possible
- [ ] Address validation (basic format check)
- [ ] Error messages clear and specific ("Please enter a valid ZIP code")

**Notes:**
- Consider address autocomplete (Google Places API)
- Large input fields for mobile typing

---

### US-3.3: Choose Shipping Method
**Priority:** P0 | **Points:** 2

**As a** teen shopper (Maya),
**I want to** choose how fast I get my order,
**So that** I can pay less for slower shipping or more for faster.

**Acceptance Criteria:**
- [ ] Shipping options: Standard (5-7 days), Express (2-3 days)
- [ ] Show price for each option
- [ ] Show estimated delivery date for each
- [ ] Default: Standard selected
- [ ] Order total updates when shipping changes

**Notes:**
- Shipping prices calculated by ZIP code (MVP: flat rate by tier)

---

### US-3.4: Pay with Credit Card (Stripe)
**Priority:** P0 | **Points:** 5

**As a** teen shopper (Maya) or parent (Lisa),
**I want to** pay with a credit or debit card,
**So that** I can complete my purchase securely.

**Acceptance Criteria:**
- [ ] Stripe Elements embedded card form
- [ ] Accepts: Visa, Mastercard, Amex, Discover
- [ ] Real-time card validation (shows card type icon)
- [ ] Apple Pay / Google Pay buttons when available
- [ ] Declined card shows friendly error message
- [ ] Loading state during payment processing
- [ ] Success redirects to confirmation page

**Security Requirements:**
- [ ] Card data never touches our servers (Stripe tokenization)
- [ ] HTTPS required (mixed content blocked)
- [ ] CSP headers configured for Stripe

---

### US-3.5: Pay with Venmo
**Priority:** P1 | **Points:** 5

**As a** teen shopper (Maya),
**I want to** pay with Venmo,
**So that** I can use my preferred payment method without my parents' card.

**Acceptance Criteria:**
- [ ] Venmo option visible alongside credit card
- [ ] Display Venmo QR code with order reference
- [ ] Instructions: "Scan with Venmo app → Pay $XX.XX → Enter confirmation"
- [ ] Input field for Venmo transaction ID
- [ ] Order marked as "Pending Verification" until admin confirms
- [ ] Timeout warning if not confirmed within 24 hours

**Notes:**
- MVP: Manual verification by admin
- v2: Automated Venmo business account integration

---

### US-3.6: Apply Discount Code
**Priority:** P2 | **Points:** 3

**As a** teen shopper (Maya),
**I want to** enter a discount code,
**So that** I can save money on my order.

**Acceptance Criteria:**
- [ ] "Have a discount code?" expandable section
- [ ] Input field + "Apply" button
- [ ] Success: Show discount amount, update total
- [ ] Error: "Invalid code" or "Code expired"
- [ ] Remove applied code with "X" button

**Notes:**
- MVP: Simple percentage off (e.g., 10OFF = 10% off)
- Admin creates codes in database (no admin UI needed)

---

### US-3.7: Review Order Before Payment
**Priority:** P0 | **Points:** 2

**As a** parent (Lisa),
**I want to** see a summary before paying,
**So that** I can verify the order is correct before entering my card.

**Acceptance Criteria:**
- [ ] Order summary shows: items, quantities, prices
- [ ] Shipping address displayed
- [ ] Shipping method and cost displayed
- [ ] Subtotal, shipping, tax, total breakdown
- [ ] Edit links to go back and modify
- [ ] "Place Order" button (requires summary review)

---

## Epic 4: User Accounts

### US-4.1: Register Account
**Priority:** P1 | **Points:** 3

**As a** teen shopper (Maya),
**I want to** create an account,
**So that** I can track my orders and checkout faster next time.

**Acceptance Criteria:**
- [ ] Fields: Email, Password, Confirm Password
- [ ] Password requirements shown (8+ chars, 1 uppercase, 1 number)
- [ ] Password strength indicator
- [ ] Terms of Service and Privacy Policy checkboxes
- [ ] Age confirmation checkbox ("I am 13 or older")
- [ ] Email verification required before first purchase
- [ ] Success: Redirect to account dashboard

**Security:**
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] Email verification link expires in 24 hours

---

### US-4.2: Login
**Priority:** P1 | **Points:** 2

**As a** registered user,
**I want to** login to my account,
**So that** I can access my order history and saved info.

**Acceptance Criteria:**
- [ ] Email + Password login form
- [ ] "Remember me" checkbox (30-day session)
- [ ] "Forgot password?" link
- [ ] Error: "Invalid email or password" (don't reveal which)
- [ ] Success: Redirect to previous page or dashboard
- [ ] Account locked after 5 failed attempts (15 min lockout)

---

### US-4.3: Reset Password
**Priority:** P1 | **Points:** 2

**As a** registered user,
**I want to** reset my password if I forget it,
**So that** I can regain access to my account.

**Acceptance Criteria:**
- [ ] "Forgot password" → Enter email → Receive reset link
- [ ] Reset link expires in 1 hour
- [ ] Reset link single-use (invalidated after use)
- [ ] New password must meet requirements
- [ ] Success: Auto-login and redirect to dashboard

---

### US-4.4: View Order History
**Priority:** P1 | **Points:** 3

**As a** registered user,
**I want to** see my past orders,
**So that** I can track what I've bought and when.

**Acceptance Criteria:**
- [ ] List of orders (newest first)
- [ ] Each shows: order number, date, status, total
- [ ] Click to view order details
- [ ] Order detail shows: items, shipping address, tracking info
- [ ] Reorder button (adds items to cart)

---

### US-4.5: Manage Addresses
**Priority:** P2 | **Points:** 2

**As a** registered user,
**I want to** save multiple shipping addresses,
**So that** I can ship to different places easily.

**Acceptance Criteria:**
- [ ] Add new address
- [ ] Edit existing address
- [ ] Delete address
- [ ] Set default address
- [ ] Addresses appear as options at checkout

---

### US-4.6: Delete Account
**Priority:** P1 | **Points:** 2

**As a** registered user,
**I want to** delete my account,
**So that** my data is removed (CCPA compliance).

**Acceptance Criteria:**
- [ ] "Delete Account" button in settings
- [ ] Confirmation dialog with warning
- [ ] Enter password to confirm
- [ ] Account and personal data deleted within 30 days
- [ ] Order history anonymized (not deleted for business records)

---

## Epic 5: Order Management

### US-5.1: Order Confirmation
**Priority:** P0 | **Points:** 2

**As a** customer,
**I want to** see confirmation after my order,
**So that** I know my purchase was successful.

**Acceptance Criteria:**
- [ ] Confirmation page with order summary
- [ ] Order number prominently displayed
- [ ] Estimated delivery date shown
- [ ] "Continue Shopping" and "Track Order" buttons
- [ ] Social share option ("Share your purchase!")
- [ ] Print-friendly version available

---

### US-5.2: Order Confirmation Email
**Priority:** P0 | **Points:** 3

**As a** customer,
**I want to** receive an email confirmation,
**So that** I have a record of my purchase.

**Acceptance Criteria:**
- [ ] Email sent within 2 minutes of order
- [ ] Contains: order number, items, shipping address, total
- [ ] Contains: estimated delivery date
- [ ] Contains: customer support contact
- [ ] Mobile-friendly email design
- [ ] Unsubscribe link (for future marketing, not transactional)

---

### US-5.3: Track Order
**Priority:** P1 | **Points:** 3

**As a** customer,
**I want to** track my order status,
**So that** I know when my plushie will arrive.

**Acceptance Criteria:**
- [ ] Order statuses: Pending → Processing → Shipped → Delivered
- [ ] Status timeline/progress indicator
- [ ] Tracking number with carrier link (when available)
- [ ] Email notification on status changes
- [ ] Guest tracking via email + order number lookup

---

### US-5.4: Guest Order Lookup
**Priority:** P1 | **Points:** 2

**As a** guest customer,
**I want to** look up my order without logging in,
**So that** I can track it even though I didn't create an account.

**Acceptance Criteria:**
- [ ] "Track Order" page with email + order number inputs
- [ ] Shows order status and details on match
- [ ] "Order not found" error if no match
- [ ] Rate limited to prevent enumeration attacks

---

## Epic 6: Admin (Site Owner)

### US-6.1: View All Orders
**Priority:** P0 | **Points:** 3

**As a** site admin (Jordan),
**I want to** see all customer orders,
**So that** I can process and ship them.

**Acceptance Criteria:**
- [ ] Orders list with: order number, date, customer name, total, status
- [ ] Sort by date (newest first default)
- [ ] Filter by status (Pending, Processing, Shipped, Delivered)
- [ ] Filter by date range
- [ ] Search by order number or customer email
- [ ] Click to view full order details

---

### US-6.2: Update Order Status
**Priority:** P0 | **Points:** 2

**As a** site admin (Jordan),
**I want to** update order status and add tracking info,
**So that** customers know when their order ships.

**Acceptance Criteria:**
- [ ] Status dropdown to change order status
- [ ] Add tracking number field (when marking as Shipped)
- [ ] Carrier dropdown (USPS, UPS, FedEx)
- [ ] Save triggers customer email notification
- [ ] Status history log (who changed what, when)

---

### US-6.3: Verify Venmo Payments
**Priority:** P1 | **Points:** 2

**As a** site admin (Jordan),
**I want to** verify Venmo payments,
**So that** I can confirm the customer paid before shipping.

**Acceptance Criteria:**
- [ ] List of orders with "Venmo Pending" status
- [ ] Customer-provided Venmo transaction ID visible
- [ ] "Verify" button to mark as paid
- [ ] "Reject" button with reason (sends customer email)
- [ ] Order moves to "Processing" on verification

---

### US-6.4: Update Inventory (Google Sheets)
**Priority:** P0 | **Points:** 5

**As a** site admin (Jordan),
**I want to** update product info in Google Sheets,
**So that** I can manage inventory without developer help.

**Acceptance Criteria:**
- [ ] Google Sheet with columns: product_id, name, description, price, stock_quantity, image_url, status
- [ ] Changes sync to website within 10 minutes
- [ ] Invalid data triggers error notification (not silent failure)
- [ ] Audit log of changes in sheet (via formula or add-on)
- [ ] Setting stock to 0 shows "Sold Out" on website

---

### US-6.5: Export Orders
**Priority:** P2 | **Points:** 2

**As a** site admin (Jordan),
**I want to** export orders to CSV,
**So that** I can import them to my accounting software.

**Acceptance Criteria:**
- [ ] "Export" button on orders list
- [ ] Filter applied before export (or export all)
- [ ] CSV includes: order number, date, customer, items, total, status
- [ ] Download starts immediately

---

### US-6.6: View Basic Analytics
**Priority:** P2 | **Points:** 3

**As a** site admin (Jordan),
**I want to** see basic sales analytics,
**So that** I know how my business is doing.

**Acceptance Criteria:**
- [ ] Dashboard shows: total revenue (day/week/month)
- [ ] Number of orders (day/week/month)
- [ ] Top selling products
- [ ] Average order value
- [ ] Simple charts (bar/line)

---

## Epic 7: Security & Compliance

### US-7.1: Age Verification
**Priority:** P0 | **Points:** 2

**As a** teen user,
**I want to** confirm I'm 13 or older,
**So that** the site complies with COPPA.

**Acceptance Criteria:**
- [ ] Age confirmation on registration
- [ ] Cannot create account if under 13
- [ ] Date of birth collected (optional for better verification)
- [ ] Clear messaging about age requirement

---

### US-7.2: Privacy Policy Access
**Priority:** P0 | **Points:** 1

**As a** parent (Lisa),
**I want to** read the privacy policy,
**So that** I know how my family's data is used.

**Acceptance Criteria:**
- [ ] Privacy policy link in footer (always visible)
- [ ] Privacy policy page with clear sections
- [ ] Covers: data collection, usage, sharing, retention, deletion
- [ ] CCPA-compliant language
- [ ] Last updated date visible

---

### US-7.3: Request Data Deletion
**Priority:** P1 | **Points:** 2

**As a** registered user,
**I want to** request deletion of my data,
**So that** I can exercise my CCPA rights.

**Acceptance Criteria:**
- [ ] "Request Data Deletion" in account settings
- [ ] Or: email request to support (link in privacy policy)
- [ ] Confirmation email sent
- [ ] Data deleted within 30 days
- [ ] Confirmation when deletion complete

---

### US-7.4: Secure Connection Indicator
**Priority:** P1 | **Points:** 1

**As a** parent (Lisa),
**I want to** see that the site is secure,
**So that** I trust entering my credit card.

**Acceptance Criteria:**
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] Valid SSL certificate
- [ ] "Secure Checkout" badge on payment page
- [ ] Stripe badge/logo visible

---

## Epic 8: Performance & Accessibility

### US-8.1: Fast Page Load
**Priority:** P0 | **Points:** 5

**As a** teen shopper (Maya),
**I want to** pages to load quickly on my phone,
**So that** I don't get frustrated and leave.

**Acceptance Criteria:**
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Performance score > 90
- [ ] Works on 4G connection

---

### US-8.2: Screen Reader Support
**Priority:** P1 | **Points:** 3

**As a** visually impaired user,
**I want to** use a screen reader to shop,
**So that** I can buy plushies like everyone else.

**Acceptance Criteria:**
- [ ] All images have descriptive alt text
- [ ] Form inputs have associated labels
- [ ] ARIA labels on interactive elements
- [ ] Skip navigation link
- [ ] Tested with VoiceOver (iOS) and NVDA (Windows)

---

### US-8.3: Keyboard Navigation
**Priority:** P1 | **Points:** 2

**As a** user who can't use a mouse,
**I want to** navigate with keyboard only,
**So that** I can complete a purchase.

**Acceptance Criteria:**
- [ ] All interactive elements focusable with Tab
- [ ] Focus order follows visual order
- [ ] Focus indicator visible (not browser default alone)
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and dropdowns

---

## Summary by Priority

### P0 - Critical (MVP Must-Have): 24 stories
| ID | Story | Points |
|----|-------|--------|
| US-1.1 | Browse Product Catalog | 5 |
| US-1.2 | View Product Details | 3 |
| US-2.1 | Add to Cart | 3 |
| US-2.2 | View Cart | 3 |
| US-2.3 | Update Cart Quantity | 2 |
| US-2.4 | Remove from Cart | 1 |
| US-2.5 | Persistent Cart | 3 |
| US-3.1 | Guest Checkout | 5 |
| US-3.2 | Enter Shipping Address | 3 |
| US-3.3 | Choose Shipping Method | 2 |
| US-3.4 | Pay with Credit Card | 5 |
| US-3.7 | Review Order Before Payment | 2 |
| US-5.1 | Order Confirmation | 2 |
| US-5.2 | Order Confirmation Email | 3 |
| US-6.1 | View All Orders (Admin) | 3 |
| US-6.2 | Update Order Status (Admin) | 2 |
| US-6.4 | Update Inventory (Admin) | 5 |
| US-7.1 | Age Verification | 2 |
| US-7.2 | Privacy Policy Access | 1 |
| US-8.1 | Fast Page Load | 5 |

**P0 Total: ~60 story points**

### P1 - High Priority: 13 stories (~35 points)
### P2 - Medium Priority: 5 stories (~13 points)

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial draft |
