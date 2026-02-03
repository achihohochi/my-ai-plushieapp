# Acceptance Criteria - AI Plushie E-commerce

**Product:** AI Plushie E-commerce Platform
**Version:** 1.0 (MVP)
**Last Updated:** February 2, 2026
**Status:** Draft

---

## Purpose of This Document

This document defines the **Definition of Done** for all features in the AI Plushie e-commerce platform. Each feature must meet its acceptance criteria before being considered complete.

**Acceptance Criteria Format:**
```
GIVEN [initial context/state]
WHEN [action/event occurs]
THEN [expected outcome]
AND [additional expected outcome]
```

---

## 1. Product Catalog Features

### 1.1 Product Listing Page

**Feature:** Browse all available plushies

**Acceptance Criteria:**

#### AC 1.1.1: Page Load Performance
- **GIVEN** a user on 4G mobile network
- **WHEN** they navigate to the product listing page
- **THEN** the page loads in under 3 seconds
- **AND** the Lighthouse Performance score is 90+

#### AC 1.1.2: Product Display
- **GIVEN** the product listing page
- **WHEN** the page loads
- **THEN** all products display with:
  - Product image (optimized WebP format)
  - Product name
  - Price formatted as $X.XX
  - Stock status indicator
- **AND** images have descriptive alt text for screen readers

#### AC 1.1.3: Responsive Grid Layout
- **GIVEN** a user on different devices
- **WHEN** they view the product listing
- **THEN** products display in:
  - 2 columns on mobile (< 640px width)
  - 3 columns on tablet (640-1024px)
  - 4 columns on desktop (> 1024px)
- **AND** all touch targets are minimum 44x44 pixels

#### AC 1.1.4: Sold Out Products
- **GIVEN** a product with 0 stock quantity
- **WHEN** displayed on the listing page
- **THEN** the product shows "Sold Out" badge
- **AND** the product image has 50% opacity
- **AND** clicking the product does NOT navigate to detail page
- **AND** the "Add to Cart" action is disabled

#### AC 1.1.5: Price Filter
- **GIVEN** a user on the product listing page
- **WHEN** they apply a price range filter (e.g., $10-$25)
- **THEN** only products within that range display
- **AND** the filter persists across page refreshes
- **AND** the URL updates to reflect the filter (e.g., ?price_min=10&price_max=25)

#### AC 1.1.6: Sort Functionality
- **GIVEN** a user on the product listing page
- **WHEN** they select "Price: Low to High"
- **THEN** products reorder by ascending price
- **AND** the sort preference persists across navigation
- **AND** the sort indicator shows the current selection

---

### 1.2 Product Detail Page

**Feature:** View full details of a specific plushie

**Acceptance Criteria:**

#### AC 1.2.1: Navigation to Detail Page
- **GIVEN** a user on the product listing page
- **WHEN** they double-click/tap a product image
- **THEN** they navigate to the product detail page
- **AND** the browser back button returns to the listing page at the same scroll position

#### AC 1.2.2: Product Information Display
- **GIVEN** a product detail page
- **WHEN** the page loads
- **THEN** it displays:
  - Large product image (zoomable)
  - Product name (H1 heading)
  - Price (prominent display)
  - Full description (minimum 50 words)
  - Dimensions (height, width, depth in inches)
  - Material information (fabric, stuffing type)
  - Stock availability ("In Stock" or "Only X left!")
  - Quantity selector (1-10, max = available stock)

#### AC 1.2.3: Image Zoom Functionality
- **GIVEN** a product image on the detail page
- **WHEN** a user hovers (desktop) or pinches (mobile)
- **THEN** the image zooms to 2x size
- **AND** users can pan around the zoomed image
- **AND** clicking outside dismisses the zoom

#### AC 1.2.4: Add to Cart - Success Case
- **GIVEN** an in-stock product with 5 items available
- **WHEN** a user selects quantity 2 and clicks "Add to Cart"
- **THEN** the cart badge updates to show +2 items
- **AND** a success toast notification displays "Added to cart!"
- **AND** the cart sidebar auto-opens for 3 seconds
- **AND** the user remains on the product detail page

#### AC 1.2.5: Add to Cart - Out of Stock
- **GIVEN** a product with 0 stock
- **WHEN** the detail page loads
- **THEN** the "Add to Cart" button is disabled and grayed out
- **AND** it displays "Out of Stock" instead of "Add to Cart"
- **AND** the quantity selector is hidden

#### AC 1.2.6: Add to Cart - Exceeds Stock
- **GIVEN** a product with 3 items in stock
- **WHEN** a user tries to select quantity 5
- **THEN** the quantity selector caps at 3
- **AND** a warning message displays "Only 3 available"
- **AND** the "Add to Cart" button remains enabled for quantity 3

#### AC 1.2.7: Social Sharing
- **GIVEN** a product detail page
- **WHEN** a user clicks the "Share" button
- **THEN** they see options for:
  - Copy link (clipboard)
  - Share to Instagram (mobile only)
  - Share to Twitter/X
- **AND** the copied link includes product ID for direct navigation

---

## 2. Shopping Cart Features

### 2.1 Cart Management

**Feature:** Add, update, and remove items from cart

**Acceptance Criteria:**

#### AC 2.1.1: Add First Item to Cart
- **GIVEN** an empty cart
- **WHEN** a user adds their first product
- **THEN** the cart badge appears with "1"
- **AND** the cart sidebar slides in from the right
- **AND** the cart displays the product with image, name, price, quantity
- **AND** the cart total shows the item price + estimated shipping

#### AC 2.1.2: Cart Badge Counter
- **GIVEN** a user with items in cart
- **WHEN** viewing any page
- **THEN** the header cart icon shows a badge with total item count (NOT total quantity)
- **Example:** 2 units of Product A + 1 unit of Product B = badge shows "2"

#### AC 2.1.3: Update Quantity in Cart
- **GIVEN** a product in the cart with quantity 2
- **WHEN** the user clicks the "+" button
- **THEN** the quantity increases to 3
- **AND** the item subtotal updates immediately
- **AND** the cart total updates immediately
- **AND** the change persists across page refreshes

#### AC 2.1.4: Update Quantity - Stock Limit
- **GIVEN** a product in cart with quantity 3 (max stock = 5)
- **WHEN** the user tries to increase quantity beyond 5
- **THEN** the quantity caps at 5
- **AND** a tooltip displays "Maximum available: 5"
- **AND** the "+" button becomes disabled

#### AC 2.1.5: Remove Item from Cart
- **GIVEN** a product in the cart
- **WHEN** the user clicks the trash/remove icon
- **THEN** a confirmation dialog appears "Remove [Product Name]?"
- **AND** clicking "Yes" removes the item immediately
- **AND** the cart total recalculates
- **AND** if it's the last item, the empty cart state displays

#### AC 2.1.6: Empty Cart State
- **GIVEN** a cart with no items
- **WHEN** the user opens the cart sidebar
- **THEN** it displays:
  - Illustration or icon
  - "Your cart is empty" message
  - "Browse Products" button linking to catalog
- **AND** the cart badge is hidden

#### AC 2.1.7: Cart Persistence - Logged Out
- **GIVEN** a guest user (not logged in) with items in cart
- **WHEN** they close the browser tab
- **AND** return within 30 days
- **THEN** their cart items are restored via localStorage
- **AND** stock availability is re-validated

#### AC 2.1.8: Cart Persistence - Logged In
- **GIVEN** a logged-in user with items in cart
- **WHEN** they log out and log back in (or switch devices)
- **THEN** their cart items are restored from the database
- **AND** stock availability is re-validated

#### AC 2.1.9: Cart Sync on Login
- **GIVEN** a guest user with 2 items in localStorage cart
- **AND** a saved cart with 1 item in database for their account
- **WHEN** they log in
- **THEN** the carts merge to show all 3 unique items
- **AND** if duplicate items exist, quantities are summed (capped by stock)

---

### 2.2 Cart Sidebar (Mobile)

**Feature:** Slide-out cart drawer optimized for mobile

**Acceptance Criteria:**

#### AC 2.2.1: Open Cart Sidebar
- **GIVEN** any page on mobile
- **WHEN** a user taps the cart icon in the header
- **THEN** the cart sidebar slides in from the right
- **AND** the page content dims with a backdrop overlay
- **AND** scrolling is disabled on the main page

#### AC 2.2.2: Close Cart Sidebar
- **GIVEN** an open cart sidebar
- **WHEN** a user:
  - Swipes right on the sidebar, OR
  - Taps the backdrop overlay, OR
  - Taps the X close button
- **THEN** the sidebar slides out to the right
- **AND** page scrolling is re-enabled

#### AC 2.2.3: Mobile Touch Targets
- **GIVEN** the cart sidebar on mobile
- **WHEN** viewing the cart
- **THEN** all interactive elements (quantity +/-, remove, checkout) are minimum 44x44 pixels
- **AND** there is 8px spacing between tap targets

#### AC 2.2.4: Sticky Checkout Button
- **GIVEN** a cart with 5+ items (requiring scroll)
- **WHEN** a user scrolls within the cart sidebar
- **THEN** the "Proceed to Checkout" button remains sticky at the bottom
- **AND** the cart total is always visible above the button

---

## 3. Checkout Features

### 3.1 Guest Checkout

**Feature:** Purchase without creating an account

**Acceptance Criteria:**

#### AC 3.1.1: Guest Checkout Entry
- **GIVEN** a user on the cart page (not logged in)
- **WHEN** they click "Proceed to Checkout"
- **THEN** they see two options:
  - "Checkout as Guest" (primary CTA)
  - "Log In" (secondary link)
- **AND** the guest flow requires no password

#### AC 3.1.2: Guest Email Collection
- **GIVEN** a guest checkout flow
- **WHEN** they enter an email address
- **THEN** real-time validation checks:
  - Valid email format (regex)
  - Email not already registered (if it is, suggest login)
- **AND** a checkbox "Create account with this email" is available

#### AC 3.1.3: Guest Checkout Form Fields
- **GIVEN** a guest checkout
- **WHEN** on the shipping information step
- **THEN** the form collects:
  - Email (required)
  - Full Name (required)
  - Street Address (required)
  - Apt/Suite (optional)
  - City (auto-filled from ZIP)
  - State (dropdown, required)
  - ZIP Code (required, validated as 5 digits)
- **AND** the form takes maximum 60 seconds to complete
- **AND** all fields have clear placeholder text

#### AC 3.1.4: Guest Order Tracking
- **GIVEN** a guest who completed checkout
- **WHEN** they receive the order confirmation email
- **THEN** the email contains:
  - Order tracking link: `/orders/track?email=[email]&order=[orderID]`
  - No login required to view order status
  - Option to create account to save order to profile

---

### 3.2 Registered User Checkout

**Feature:** Streamlined checkout for logged-in users

**Acceptance Criteria:**

#### AC 3.2.1: Saved Address Pre-Fill
- **GIVEN** a logged-in user with saved shipping addresses
- **WHEN** they proceed to checkout
- **THEN** their default address is pre-filled
- **AND** they can select from saved addresses dropdown
- **AND** they can add a new address

#### AC 3.2.2: One-Click Checkout
- **GIVEN** a logged-in user with:
  - Saved shipping address
  - Saved payment method
- **WHEN** they click "Checkout"
- **THEN** they can complete purchase in 1 click (skip form filling)
- **AND** they see an order review screen before final confirmation

---

### 3.3 Shipping Information

**Feature:** Collect and validate shipping address

**Acceptance Criteria:**

#### AC 3.3.1: Address Validation
- **GIVEN** a user entering a shipping address
- **WHEN** they enter a ZIP code
- **THEN** the system validates it against USPS API
- **AND** invalid addresses show error: "Please verify your address"
- **AND** suggested corrections are offered (if available)

#### AC 3.3.2: ZIP Code Auto-Complete
- **GIVEN** a user on the shipping form
- **WHEN** they enter a valid 5-digit ZIP code
- **THEN** the City and State fields auto-populate
- **AND** the user can override if incorrect

#### AC 3.3.3: Shipping Cost Calculation
- **GIVEN** a validated shipping address
- **WHEN** the ZIP code is confirmed
- **THEN** the shipping cost displays within 2 seconds
- **AND** options shown:
  - Standard Shipping (5-7 business days) - $5.99
  - Express Shipping (2-3 business days) - $12.99
- **AND** free shipping applies for orders over $50 (if applicable)

#### AC 3.3.4: US-Only Validation
- **GIVEN** the shipping form
- **WHEN** displayed to the user
- **THEN** the Country field is locked to "United States"
- **AND** a message displays "International shipping coming soon"

---

## 4. Payment Features

### 4.1 Stripe Payment Integration

**Feature:** Secure credit/debit card payments

**Acceptance Criteria:**

#### AC 4.1.1: Payment Form Display
- **GIVEN** a user on the payment step
- **WHEN** the page loads
- **THEN** Stripe Elements renders securely
- **AND** card input fields display:
  - Card number (with card type icon)
  - Expiration date (MM/YY format)
  - CVC (3-4 digits)
  - ZIP code (billing)
- **AND** all inputs are in an iframe (PCI compliant)

#### AC 4.1.2: Real-Time Card Validation
- **GIVEN** a user entering card details
- **WHEN** they type the card number
- **THEN** the card type icon updates (Visa, Mastercard, etc.)
- **AND** invalid formats show inline error immediately
- **AND** the CVC field adjusts (3 digits for Visa, 4 for Amex)

#### AC 4.1.3: Successful Payment Processing
- **GIVEN** valid payment details entered
- **WHEN** the user clicks "Complete Purchase"
- **THEN** a loading indicator displays "Processing payment..."
- **AND** the button is disabled to prevent double-click
- **AND** upon success (within 5 seconds), user sees:
  - Order confirmation page
  - Order number displayed
  - Email sent within 30 seconds
- **AND** cart is cleared
- **AND** order saved to database

#### AC 4.1.4: Declined Card Handling
- **GIVEN** a payment that is declined by Stripe
- **WHEN** the decline occurs
- **THEN** the user sees a user-friendly error:
  - "Your card was declined. Please try another payment method."
  - NOT the raw Stripe error code
- **AND** the user can retry with a different card
- **AND** the order is NOT created in the database

#### AC 4.1.5: Payment Security
- **GIVEN** any payment transaction
- **WHEN** card data is entered
- **THEN** the card number NEVER touches our servers (Stripe tokenization)
- **AND** all payment requests go over HTTPS
- **AND** HTTPS is enforced (HTTP redirects to HTTPS)

#### AC 4.1.6: Apple Pay / Google Pay Support
- **GIVEN** a user on a supported device (iPhone with Apple Pay, Android with Google Pay)
- **WHEN** they reach the payment step
- **THEN** Apple Pay or Google Pay button displays as an option
- **AND** clicking it opens the native wallet
- **AND** completing payment processes the order identically to card payments

---

### 4.2 Venmo Payment Integration

**Feature:** Teen-friendly Venmo payment option

**Acceptance Criteria:**

#### AC 4.2.1: Venmo Payment Option Display
- **GIVEN** a user on the payment step
- **WHEN** selecting payment method
- **THEN** "Pay with Venmo" is prominently displayed
- **AND** it shows the Venmo logo
- **AND** it explains "Scan QR code in Venmo app"

#### AC 4.2.2: Venmo QR Code Generation
- **GIVEN** a user selects "Pay with Venmo"
- **WHEN** they click to proceed
- **THEN** a unique QR code generates containing:
  - Venmo merchant username
  - Order total amount
  - Order reference ID (e.g., PLU-20260202-12345)
- **AND** the QR code displays clearly (minimum 200x200 pixels)
- **AND** instructions show: "1. Open Venmo app 2. Scan QR code 3. Complete payment 4. Enter transaction ID below"

#### AC 4.2.3: Venmo Transaction ID Submission
- **GIVEN** a user who paid via Venmo
- **WHEN** they complete payment in the Venmo app
- **THEN** they return to our site and enter the Venmo transaction ID
- **AND** the format is validated (Venmo IDs are alphanumeric, 12-20 chars)
- **AND** upon submission, order status is set to "Payment Pending Verification"
- **AND** admin is notified to verify payment

#### AC 4.2.4: Venmo Manual Verification (Admin)
- **GIVEN** an order with Venmo payment pending
- **WHEN** the admin views the order in the dashboard
- **THEN** they see:
  - Venmo transaction ID submitted by customer
  - Order total amount expected
  - Button to "Verify Payment" or "Reject Payment"
- **AND** clicking "Verify" marks order as paid and triggers fulfillment
- **AND** clicking "Reject" notifies customer to re-submit or use another method

---

## 5. User Authentication Features

### 5.1 Registration

**Feature:** Create a new user account

**Acceptance Criteria:**

#### AC 5.1.1: Registration Form Validation
- **GIVEN** a user on the registration page
- **WHEN** they submit the form
- **THEN** the following validations apply:
  - Email: Valid format (regex) and not already registered
  - Password: Minimum 8 characters, 1 uppercase, 1 number
  - Confirm Password: Matches password exactly
  - Age: Checkbox "I am 13 or older" is required
  - Terms: Checkbox "I agree to Terms & Privacy Policy" is required
- **AND** errors display inline in real-time (as user types)

#### AC 5.1.2: Password Strength Indicator
- **GIVEN** a user typing a password
- **WHEN** they type each character
- **THEN** a visual strength meter updates (Weak / Medium / Strong)
- **AND** color changes (red / yellow / green)
- **AND** requirements checklist shows which criteria are met

#### AC 5.1.3: Duplicate Email Handling
- **GIVEN** a user trying to register with an existing email
- **WHEN** they submit the form
- **THEN** an error displays: "This email is already registered. Log in instead?"
- **AND** a "Log In" link is provided

#### AC 5.1.4: Email Verification
- **GIVEN** a successful registration
- **WHEN** the user submits valid details
- **THEN** a verification email is sent within 30 seconds
- **AND** the user is redirected to a "Verify your email" page
- **AND** the email contains a verification link valid for 24 hours
- **AND** clicking the link activates the account
- **AND** unverified users cannot checkout (only browse)

#### AC 5.1.5: Age Gate (COPPA Compliance)
- **GIVEN** a user under 13 tries to register
- **WHEN** they uncheck "I am 13 or older" (if they're honest)
- **THEN** the form displays: "You must be 13 or older to create an account. Please ask a parent for help."
- **AND** the submit button is disabled
- **NOTE:** Actual age verification beyond checkbox is out of scope for MVP

---

### 5.2 Login

**Feature:** Authenticate existing users

**Acceptance Criteria:**

#### AC 5.2.1: Login Form
- **GIVEN** a user on the login page
- **WHEN** they enter email and password
- **THEN** real-time validation checks format (not authentication)
- **AND** clicking "Log In" submits the form

#### AC 5.2.2: Successful Login
- **GIVEN** valid credentials entered
- **WHEN** the user clicks "Log In"
- **THEN** authentication succeeds within 2 seconds
- **AND** user is redirected to their previous page (or homepage)
- **AND** a session cookie is set (HTTP-only)
- **AND** the header updates to show "My Account" instead of "Log In"

#### AC 5.2.3: Failed Login
- **GIVEN** incorrect email or password
- **WHEN** the user attempts login
- **THEN** a generic error displays: "Invalid email or password"
- **AND** the error does NOT reveal which field is wrong (security)
- **AND** the user can retry

#### AC 5.2.4: Account Lockout (Brute Force Protection)
- **GIVEN** a user with 5 consecutive failed login attempts
- **WHEN** they try a 6th time
- **THEN** the account is locked for 15 minutes
- **AND** an error displays: "Too many failed attempts. Try again in 15 minutes."
- **AND** a password reset link is offered

#### AC 5.2.5: Remember Me
- **GIVEN** a user checks "Remember Me" during login
- **WHEN** they close the browser and return
- **THEN** they remain logged in for 30 days
- **AND** the session cookie has a 30-day expiration

#### AC 5.2.6: Forgot Password Flow
- **GIVEN** a user clicks "Forgot Password?"
- **WHEN** they enter their email
- **THEN** a password reset email is sent (if email exists in system)
- **AND** the email contains a reset link valid for 1 hour
- **AND** clicking the link allows them to set a new password
- **AND** all active sessions for that user are invalidated

---

### 5.3 Account Dashboard

**Feature:** User account management

**Acceptance Criteria:**

#### AC 5.3.1: Dashboard Navigation
- **GIVEN** a logged-in user
- **WHEN** they click "My Account" in the header
- **THEN** they see a dashboard with sections:
  - Order History
  - Saved Addresses
  - Account Settings
  - Security (change password)
  - Delete Account

#### AC 5.3.2: Order History Display
- **GIVEN** a user with past orders
- **WHEN** they view Order History
- **THEN** all orders display in reverse chronological order
- **AND** each order shows:
  - Order number
  - Date placed
  - Total amount
  - Status (Pending / Processing / Shipped / Delivered)
  - "View Details" link
- **AND** clicking "View Details" shows full order breakdown

#### AC 5.3.3: Saved Addresses Management
- **GIVEN** a logged-in user
- **WHEN** they view Saved Addresses
- **THEN** all saved addresses display
- **AND** they can:
  - Add new address
  - Edit existing address
  - Delete address (except if it's the only one)
  - Set a default address (marked with badge)

#### AC 5.3.4: Change Password
- **GIVEN** a user in Account Settings
- **WHEN** they change their password
- **THEN** they must enter:
  - Current password (to verify identity)
  - New password (meeting strength requirements)
  - Confirm new password
- **AND** upon success, all other sessions are logged out
- **AND** a confirmation email is sent

#### AC 5.3.5: Delete Account (CCPA Compliance)
- **GIVEN** a user wants to delete their account
- **WHEN** they click "Delete Account"
- **THEN** a confirmation modal displays:
  - "Are you sure? This action cannot be undone."
  - "Your order history will be anonymized but retained for legal purposes."
  - Require password confirmation
- **AND** upon confirmation:
  - Personal data (email, name, address) is deleted
  - Order history is anonymized (replaced with "Deleted User")
  - Account cannot be reactivated

---

## 6. Order Management Features

### 6.1 Order Confirmation

**Feature:** Post-purchase confirmation

**Acceptance Criteria:**

#### AC 6.1.1: Order Confirmation Page
- **GIVEN** a successful payment
- **WHEN** the user completes checkout
- **THEN** they are redirected to `/orders/confirmation/[orderID]`
- **AND** the page displays:
  - "Order Confirmed!" headline
  - Order number (format: PLU-YYYYMMDD-XXXXX)
  - Order summary (items, quantities, prices)
  - Shipping address
  - Estimated delivery date (5-7 days for standard, 2-3 for express)
  - "Download Receipt" button (PDF)
- **AND** a "Continue Shopping" button links to the catalog

#### AC 6.1.2: Order Confirmation Email
- **GIVEN** a successful order
- **WHEN** payment processes
- **THEN** an email is sent within 30 seconds to the customer's email
- **AND** the email contains:
  - Order number
  - Itemized order details (product names, quantities, prices)
  - Shipping address
  - Estimated delivery date
  - Order tracking link
  - Customer support contact (email/phone)
- **AND** the email is mobile-responsive

#### AC 6.1.3: PDF Receipt Generation
- **GIVEN** a user on the order confirmation page
- **WHEN** they click "Download Receipt"
- **THEN** a PDF generates containing:
  - Business name and logo
  - Order date and number
  - Itemized list (products, prices, tax, shipping, total)
  - Billing and shipping addresses
  - Payment method (last 4 digits of card)
- **AND** the PDF is properly formatted for printing

---

### 6.2 Order Tracking

**Feature:** Track order fulfillment status

**Acceptance Criteria:**

#### AC 6.2.1: Order Status Progression
- **GIVEN** a placed order
- **WHEN** the order is processed
- **THEN** the status progresses through:
  1. **Pending:** Payment confirmed, awaiting processing (0-24 hours)
  2. **Processing:** Being packed (24-48 hours)
  3. **Shipped:** En route to customer (tracking number assigned)
  4. **Delivered:** Confirmed delivery
- **AND** the customer receives email notifications for each status change

#### AC 6.2.2: Order Tracking Page (Logged-In User)
- **GIVEN** a logged-in user with an order
- **WHEN** they navigate to "My Orders" and click an order
- **THEN** they see:
  - Current status (with progress bar visualization)
  - Status history with timestamps
  - Tracking number (when shipped)
  - Carrier link (USPS, UPS, etc.)
- **AND** estimated delivery date

#### AC 6.2.3: Guest Order Tracking
- **GIVEN** a guest order (no account)
- **WHEN** the guest visits `/orders/track`
- **THEN** they enter:
  - Email address used at checkout
  - Order number (from confirmation email)
- **AND** upon submission, they see the same tracking page as logged-in users
- **AND** the page is accessible without login

#### AC 6.2.4: Email Status Notifications
- **GIVEN** an order status change
- **WHEN** the status updates in the database
- **THEN** an email is sent within 5 minutes with:
  - New status (e.g., "Your order has shipped!")
  - Tracking number (if status = Shipped)
  - Estimated delivery date
  - Link to full tracking page

---

## 7. Admin Features

### 7.1 Google Sheets Inventory Management (MVP)

**Feature:** Admin manages inventory via Google Sheets

**Acceptance Criteria:**

#### AC 7.1.1: Google Sheets Structure
- **GIVEN** the admin's Google Sheet
- **WHEN** the sheet is configured
- **THEN** it has columns:
  - `product_id` (unique identifier, read-only)
  - `name` (product name)
  - `description` (product description)
  - `price` (decimal, e.g., 24.99)
  - `stock_quantity` (integer, 0 = sold out)
  - `image_url` (path to image, e.g., /cute-pink-bunny.jpg)
  - `status` (active / inactive)
- **AND** the first row is frozen as a header

#### AC 7.1.2: Sync Frequency
- **GIVEN** changes made to the Google Sheet
- **WHEN** the admin saves the sheet
- **THEN** changes sync to the live website within 5 minutes (cron job every 5 min)
- **AND** the sync runs successfully without errors

#### AC 7.1.3: Price Update Workflow
- **GIVEN** an admin wants to change a product price
- **WHEN** they edit the `price` cell in Google Sheets
- **THEN** the new price reflects on the website within 10 minutes
- **AND** orders placed before the sync use the old price (no retroactive changes)

#### AC 7.1.4: Stock Update Workflow
- **GIVEN** a product with 10 units in stock
- **WHEN** the admin changes `stock_quantity` to 0
- **THEN** the product shows "Sold Out" on the website within 10 minutes
- **AND** users cannot add it to cart
- **AND** users with the item in cart see a notification: "This item is no longer available"

#### AC 7.1.5: Data Validation
- **GIVEN** an admin enters invalid data (e.g., negative price)
- **WHEN** the sync runs
- **THEN** the invalid entry is flagged
- **AND** an error email is sent to the admin
- **AND** the product retains its previous valid data (no change applied)

#### AC 7.1.6: Audit Log
- **GIVEN** any change in the Google Sheet
- **WHEN** the sync occurs
- **THEN** a log entry is created with:
  - Timestamp
  - Product ID
  - Field changed (e.g., price)
  - Old value → New value
  - Admin email (from Google account)
- **AND** the log is viewable in the admin dashboard

---

### 7.2 Order Dashboard (Admin)

**Feature:** Admin views and manages orders

**Acceptance Criteria:**

#### AC 7.2.1: Order List View
- **GIVEN** an admin logged into the admin dashboard
- **WHEN** they navigate to "Orders"
- **THEN** all orders display in a table with columns:
  - Order number
  - Customer name
  - Order date
  - Total amount
  - Payment method (Stripe / Venmo)
  - Status (Pending / Processing / Shipped / Delivered)
  - Actions (View / Update Status)
- **AND** orders are sorted by newest first (default)

#### AC 7.2.2: Order Filtering
- **GIVEN** the admin order list
- **WHEN** the admin applies filters
- **THEN** they can filter by:
  - Status (e.g., show only "Pending" orders)
  - Date range (e.g., orders from last 7 days)
  - Payment method (Stripe or Venmo)
- **AND** filters can be combined (e.g., Venmo orders from last week)

#### AC 7.2.3: Order Detail View
- **GIVEN** an admin viewing an order
- **WHEN** they click "View" on an order
- **THEN** they see:
  - Full customer details (name, email, shipping address)
  - Itemized order breakdown
  - Payment method and status
  - Current order status
  - Option to update status
  - Option to process refund (if paid via Stripe)
  - Notes field (for internal comments)

#### AC 7.2.4: Update Order Status
- **GIVEN** an admin viewing an order detail
- **WHEN** they change the status from "Processing" to "Shipped"
- **THEN** they are prompted to enter a tracking number
- **AND** upon saving:
  - Status updates in database
  - Customer receives email notification with tracking number
  - Status timestamp is logged

#### AC 7.2.5: Export Orders to CSV
- **GIVEN** an admin on the order list page
- **WHEN** they click "Export to CSV"
- **THEN** a CSV file downloads with columns:
  - Order number, date, customer name, email, items, total, status
- **AND** respects current filters (e.g., if filtered to last 7 days, only those orders export)

---

## 8. Non-Functional Acceptance Criteria

### 8.1 Performance

**Acceptance Criteria:**

#### AC 8.1.1: Page Load Speed
- **GIVEN** a user on a 4G mobile connection
- **WHEN** they navigate to any page
- **THEN** First Contentful Paint (FCP) occurs in < 1.5 seconds
- **AND** Largest Contentful Paint (LCP) occurs in < 2.5 seconds
- **AND** Time to Interactive (TTI) occurs in < 3 seconds
- **AND** Lighthouse Performance score is 90+

#### AC 8.1.2: API Response Time
- **GIVEN** a user making a request to any API endpoint
- **WHEN** the request is made
- **THEN** the response is received in < 200ms (p95)
- **AND** critical endpoints (checkout, payment) respond in < 100ms (p95)

---

### 8.2 Security

**Acceptance Criteria:**

#### AC 8.2.1: HTTPS Enforcement
- **GIVEN** a user accessing the site via HTTP
- **WHEN** they navigate to any page
- **THEN** they are redirected to HTTPS
- **AND** all assets (images, scripts) load over HTTPS

#### AC 8.2.2: Input Sanitization
- **GIVEN** any user input field (forms, search, etc.)
- **WHEN** a user submits data
- **THEN** all inputs are sanitized server-side
- **AND** XSS attack vectors (e.g., `<script>`) are escaped or rejected

#### AC 8.2.3: CSRF Protection
- **GIVEN** any form submission (login, checkout, etc.)
- **WHEN** the form is submitted
- **THEN** a CSRF token is validated
- **AND** requests without valid tokens are rejected

#### AC 8.2.4: SQL Injection Prevention
- **GIVEN** any database query
- **WHEN** user input is involved
- **THEN** parameterized queries or ORM (Prisma) are used
- **AND** raw SQL is never concatenated with user input

#### AC 8.2.5: Rate Limiting
- **GIVEN** any API endpoint
- **WHEN** a user makes requests
- **THEN** they are limited to 100 requests per minute
- **AND** exceeding the limit returns HTTP 429 "Too Many Requests"

---

### 8.3 Accessibility

**Acceptance Criteria:**

#### AC 8.3.1: Screen Reader Compatibility
- **GIVEN** a user with a screen reader (NVDA, JAWS, VoiceOver)
- **WHEN** they navigate the site
- **THEN** all interactive elements have descriptive ARIA labels
- **AND** all images have meaningful alt text
- **AND** form labels are properly associated with inputs

#### AC 8.3.2: Keyboard Navigation
- **GIVEN** a user navigating via keyboard only (no mouse)
- **WHEN** they press Tab
- **THEN** focus moves through all interactive elements in logical order
- **AND** focus indicators are visible (outline or highlight)
- **AND** all functionality is accessible via keyboard (no mouse-only actions)

#### AC 8.3.3: Color Contrast
- **GIVEN** any text on the site
- **WHEN** viewed by users with vision impairments
- **THEN** the contrast ratio is at least 4.5:1 (WCAG AA)
- **AND** no meaning is conveyed by color alone (e.g., errors also have icons)

---

### 8.4 Compliance

**Acceptance Criteria:**

#### AC 8.4.1: COPPA Compliance (Age Gate)
- **GIVEN** a user under 13 tries to register
- **WHEN** they attempt to create an account
- **THEN** they must check "I am 13 or older"
- **AND** parental consent is required (MVP: checkbox, Future: email verification)
- **NOTE:** Full COPPA compliance requires legal review

#### AC 8.4.2: PCI-DSS Compliance
- **GIVEN** any payment transaction
- **WHEN** card data is collected
- **THEN** it is handled entirely by Stripe (tokenization)
- **AND** our servers never see or store card numbers
- **AND** SSL/HTTPS is enforced on all payment pages

#### AC 8.4.3: CCPA Compliance (Data Deletion)
- **GIVEN** a user requests account deletion
- **WHEN** they confirm deletion
- **THEN** all personal data (email, name, address) is deleted within 30 days
- **AND** order history is anonymized (not deleted, for legal purposes)
- **AND** the user receives confirmation email

---

## 9. Browser Support Acceptance Criteria

**Acceptance Criteria:**

#### AC 9.1: Supported Browsers
- **GIVEN** a user on a modern browser
- **WHEN** they access the site
- **THEN** all features work on:
  - Chrome 100+
  - Safari 15+
  - Firefox 100+
  - Edge 100+
  - Safari iOS 15+
  - Chrome Android 100+
- **AND** a graceful fallback message displays for unsupported browsers (e.g., IE 11)

---

## 10. Testing Checklist

### Before Marking a Feature as "Done":

- [ ] All acceptance criteria pass
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E test for critical flow written and passing
- [ ] Manual testing on mobile device completed
- [ ] Accessibility audit passed (axe DevTools or Lighthouse)
- [ ] Security review completed (no XSS, CSRF, SQL injection vulnerabilities)
- [ ] Performance benchmarks met (Lighthouse 90+)
- [ ] Code reviewed by at least one peer
- [ ] Documentation updated (if applicable)
- [ ] Deployment to staging environment successful
- [ ] Product Owner approval obtained

---

## Appendix: Definition of "Done"

A feature is considered **Done** when:
1. All acceptance criteria pass ✅
2. No critical or high-severity bugs remain 🐛
3. Code is reviewed and approved 👥
4. Automated tests are written and passing 🧪
5. Manual testing confirms expected behavior ✔️
6. Performance and accessibility standards are met ⚡
7. Security review is complete 🔒
8. Product Owner accepts the feature ✅

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial draft |

**Related Documents:**
- [PRD.md](./PRD.md) - Product Requirements
- [USER_STORIES.md](./USER_STORIES.md) - User stories
- [TEST_PLAN.md](../testing/TEST_PLAN.md) - Testing strategy

---

**End of Acceptance Criteria Document**
