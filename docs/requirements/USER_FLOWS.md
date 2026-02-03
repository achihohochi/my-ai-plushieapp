# User Flows

**Product:** AI Plushie E-commerce Platform
**Version:** 1.0 (MVP)
**Last Updated:** February 2, 2026
**Related Documents:** [USER_PERSONAS.md](./USER_PERSONAS.md), [USER_STORIES.md](./USER_STORIES.md)

---

## Overview

This document defines the key user flows for the AI Plushie e-commerce platform. Each flow is designed for the primary persona (Maya, 16-year-old teen shopper) with considerations for secondary personas.

**Flow Priority:**
- **Critical:** Must work flawlessly for MVP launch
- **Important:** Should work well, minor issues acceptable
- **Nice-to-have:** Can be simplified for MVP

---

## Flow 1: Guest Purchase (Critical)

**Description:** Complete purchase without creating an account
**Persona:** Maya (Teen Shopper)
**Goal:** Buy a plushie in < 3 minutes

### Flow Diagram

```
┌─────────────────┐
│   Landing Page  │
│  (Home/Catalog) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Browse Products│────►│ Filter/Sort     │
│    (Grid View)  │◄────│ (Optional)      │
└────────┬────────┘     └─────────────────┘
         │
         │ Tap product
         ▼
┌─────────────────┐
│  Product Detail │
│     Page        │
└────────┬────────┘
         │
         │ "Add to Cart"
         ▼
┌─────────────────┐
│   Cart Updated  │──────────────────┐
│   (Toast/Badge) │                  │
└────────┬────────┘                  │
         │                           │
         │ Continue shopping         │ Go to cart
         ▼                           │
┌─────────────────┐                  │
│  Browse More    │◄─────────────────┘
│   (Optional)    │
└────────┬────────┘
         │
         │ Ready to checkout
         ▼
┌─────────────────┐
│   View Cart     │
│   (Slide-out)   │
└────────┬────────┘
         │
         │ "Proceed to Checkout"
         ▼
┌─────────────────┐
│    Checkout:    │
│  Guest or Login │
└────────┬────────┘
         │
         │ "Continue as Guest"
         ▼
┌─────────────────┐
│    Shipping     │
│   Information   │
└────────┬────────┘
         │
         │ Enter address, continue
         ▼
┌─────────────────┐
│    Shipping     │
│     Method      │
└────────┬────────┘
         │
         │ Select method, continue
         ▼
┌─────────────────┐
│    Payment      │
│    Method       │
└────────┬────────┘
         │
         │ Enter payment
         ▼
┌─────────────────┐
│  Order Review   │
│   (Summary)     │
└────────┬────────┘
         │
         │ "Place Order"
         ▼
┌─────────────────┐
│   Processing    │
│   (Loading)     │
└────────┬────────┘
         │
         │ Payment successful
         ▼
┌─────────────────┐
│  Confirmation   │
│     Page        │
└─────────────────┘
         │
         │ (Async)
         ▼
┌─────────────────┐
│  Confirmation   │
│     Email       │
└─────────────────┘
```

### Step Details

| Step | Screen | Actions | Success Criteria |
|------|--------|---------|------------------|
| 1 | Landing | View products | Products visible < 3s |
| 2 | Product Detail | Tap product card | Detail page loads < 1s |
| 3 | Product Detail | Tap "Add to Cart" | Cart badge updates immediately |
| 4 | Cart | Review items | All items, prices correct |
| 5 | Checkout Choice | Tap "Continue as Guest" | No account required |
| 6 | Shipping | Enter address | Address validates |
| 7 | Shipping Method | Select option | Price updates |
| 8 | Payment | Enter card/Venmo | Payment form loads |
| 9 | Review | Verify order | All details visible |
| 10 | Confirm | Tap "Place Order" | Order created |
| 11 | Success | View confirmation | Order number shown |
| 12 | Email | Receive confirmation | Email within 2 min |

### Error Handling

| Error | User Message | Recovery |
|-------|--------------|----------|
| Item sold out during checkout | "Sorry, [item] is no longer available" | Remove item, continue or return to catalog |
| Card declined | "Payment could not be processed. Please try a different card." | Re-enter card or use different payment |
| Address invalid | "We couldn't verify this address. Please check and try again." | Edit address fields |
| Network error | "Connection lost. Your cart is saved." | Retry button, cart persisted |

---

## Flow 2: Registered User Purchase (Important)

**Description:** Purchase with saved information
**Persona:** Returning customer (Maya with account)
**Goal:** Checkout in < 90 seconds with saved info

### Flow Diagram

```
┌─────────────────┐
│     Login       │
│     Page        │
└────────┬────────┘
         │
         │ Enter email/password
         ▼
┌─────────────────┐
│   Dashboard     │
│  (or redirect)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Browse/Add Cart │
│  (Same as Flow 1)│
└────────┬────────┘
         │
         │ "Proceed to Checkout"
         ▼
┌─────────────────┐
│    Checkout     │
│  (Pre-filled)   │
└────────┬────────┘
         │
         │ Select saved address
         ▼
┌─────────────────┐
│  Saved Address  │
│   Selection     │
└────────┬────────┘
         │
         │ Select shipping method
         ▼
┌─────────────────┐
│    Payment      │
│ (Saved or New)  │
└────────┬────────┘
         │
         │ Confirm payment
         ▼
┌─────────────────┐
│  Order Review   │
│   & Confirm     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Confirmation   │
└─────────────────┘
```

### Key Differences from Guest

- Pre-filled shipping from saved addresses
- One-click address selection
- Order history accessible
- Cart synced across devices

---

## Flow 3: User Registration (Important)

**Description:** Create new account
**Persona:** Maya (after first purchase, wants to track order)
**Goal:** Register in < 2 minutes

### Flow Diagram

```
┌─────────────────┐
│  Registration   │
│     Link        │
└────────┬────────┘
         │ (From checkout, header, or post-purchase)
         ▼
┌─────────────────┐
│   Registration  │
│      Form       │
│                 │
│ • Email         │
│ • Password      │
│ • Confirm PW    │
│ • Age checkbox  │
│ • Terms checkbox│
└────────┬────────┘
         │
         │ Submit
         ▼
┌─────────────────┐
│   Validation    │
│                 │
│ • Duplicate?    │
│ • PW strength?  │
│ • Age >= 13?    │
└────────┬────────┘
         │
         │ Valid
         ▼
┌─────────────────┐
│ Account Created │
│ (Verify Email)  │
└────────┬────────┘
         │
         │ Email sent
         ▼
┌─────────────────┐
│  Check Email    │
│   Message       │
└────────┬────────┘
         │
         │ User clicks link
         ▼
┌─────────────────┐
│  Email Verified │
│    Success      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Redirect     │
│  (Dashboard)    │
└─────────────────┘
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Valid format, not taken | "Please enter a valid email" / "Email already registered" |
| Password | 8+ chars, 1 upper, 1 number | "Password must be at least 8 characters with 1 uppercase and 1 number" |
| Confirm | Matches password | "Passwords don't match" |
| Age | Must be checked | "You must be 13 or older to create an account" |
| Terms | Must be checked | "Please accept the Terms of Service" |

---

## Flow 4: Password Reset (Important)

**Description:** Recover access to account
**Persona:** Any registered user
**Goal:** Reset password in < 5 minutes

### Flow Diagram

```
┌─────────────────┐
│   Login Page    │
│                 │
│ "Forgot Password?"
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Enter Email    │
│                 │
│ [email field]   │
│ [Submit]        │
└────────┬────────┘
         │
         │ (Always show success, even if email not found)
         ▼
┌─────────────────┐
│  Check Email    │
│    Message      │
└────────┬────────┘
         │
         │ User clicks reset link
         ▼
┌─────────────────┐
│  Reset Form     │
│                 │
│ • New Password  │
│ • Confirm PW    │
└────────┬────────┘
         │
         │ Submit
         ▼
┌─────────────────┐
│    Success      │
│  (Auto-login)   │
└─────────────────┘
```

### Security Considerations

- Reset link expires in 1 hour
- Reset link is single-use
- Don't reveal if email exists (prevents enumeration)
- Rate limit requests (3 per hour per email)

---

## Flow 5: Venmo Payment (Important)

**Description:** Pay using Venmo QR code
**Persona:** Maya (prefers Venmo over card)
**Goal:** Complete Venmo payment with manual verification

### Flow Diagram

```
┌─────────────────┐
│  Payment Step   │
│                 │
│ ○ Credit Card   │
│ ● Venmo         │
└────────┬────────┘
         │
         │ Select Venmo
         ▼
┌─────────────────┐
│  Venmo Screen   │
│                 │
│ ┌─────────────┐ │
│ │   QR CODE   │ │
│ │             │ │
│ │  [SCAN ME]  │ │
│ │             │ │
│ └─────────────┘ │
│                 │
│ Order: PLU-123  │
│ Amount: $35.99  │
│                 │
│ Instructions:   │
│ 1. Scan QR      │
│ 2. Pay $35.99   │
│ 3. Enter ID below│
└────────┬────────┘
         │
         │ User pays in Venmo app
         ▼
┌─────────────────┐
│  Enter Venmo    │
│  Transaction ID │
│                 │
│ [______________]│
│ [I've Paid]     │
└────────┬────────┘
         │
         │ Submit
         ▼
┌─────────────────┐
│ Order Pending   │
│  Verification   │
│                 │
│ "Your order is  │
│ awaiting payment│
│ verification."  │
└────────┬────────┘
         │
         │ Email sent
         ▼
┌─────────────────┐
│  Confirmation   │
│    Email        │
│                 │
│ "We're verifying│
│ your Venmo pay."│
└─────────────────┘
         │
         │ (Admin verifies - async)
         ▼
┌─────────────────┐
│  Verification   │
│    Complete     │
│                 │
│ "Payment        │
│ confirmed!"     │
└─────────────────┘
```

### Admin Verification Flow

```
┌─────────────────┐
│  Admin Dashboard│
│                 │
│ Pending Venmo:  │
│ • PLU-123 $35.99│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Order Detail   │
│                 │
│ Venmo ID: xxxxx │
│                 │
│ [Verify] [Reject]
└────────┬────────┘
         │
         ├─── Verify ────────┐
         │                   ▼
         │          ┌─────────────────┐
         │          │ Order moves to  │
         │          │  "Processing"   │
         │          └─────────────────┘
         │
         └─── Reject ────────┐
                             ▼
                    ┌─────────────────┐
                    │ Customer email: │
                    │ "Payment issue" │
                    └─────────────────┘
```

---

## Flow 6: Order Tracking (Important)

**Description:** Check order status
**Persona:** Maya (waiting for delivery)
**Goal:** Know when plushie arrives

### Guest Tracking

```
┌─────────────────┐
│   Footer Link   │
│ "Track Order"   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Order Lookup   │
│                 │
│ Email: [______] │
│ Order#: [______]│
│                 │
│ [Track Order]   │
└────────┬────────┘
         │
         │ Submit
         ▼
┌─────────────────┐
│  Order Status   │
│                 │
│ ●───○───○───○   │
│ Pending         │
│                 │
│ Order: PLU-123  │
│ Placed: Feb 2   │
│ Est: Feb 9-11   │
│                 │
│ Items:          │
│ • Claude Plush  │
└─────────────────┘
```

### Registered User Tracking

```
┌─────────────────┐
│    Dashboard    │
│                 │
│ Recent Orders:  │
│ • PLU-123 ────► │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Order Detail   │
│                 │
│ Status Timeline │
│ Tracking Info   │
│ Delivery Est    │
│ Order Items     │
│ Shipping Addr   │
│                 │
│ [Reorder]       │
└─────────────────┘
```

### Status Timeline

```
●──────────────●──────────────○──────────────○
Pending      Processing     Shipped       Delivered
Feb 2         Feb 3           --             --

Current Status: Processing
"Your order is being prepared for shipment"
```

---

## Flow 7: Admin Inventory Update (Important)

**Description:** Update product info via Google Sheets
**Persona:** Jordan (Site Admin)
**Goal:** Change price/stock in < 2 minutes

### Flow Diagram

```
┌─────────────────┐
│  Google Sheets  │
│                 │
│ product_id|name │
│ 001|Claude|29.99│
│ 002|GPT|  |24.99│
└────────┬────────┘
         │
         │ Edit cell (price: 24.99 → 19.99)
         ▼
┌─────────────────┐
│   Auto-Save     │
│  (Google Sheet) │
└────────┬────────┘
         │
         │ 5-minute sync interval
         ▼
┌─────────────────┐
│   Cron Job      │
│  Reads Sheet    │
└────────┬────────┘
         │
         │ Validate data
         ├────── Invalid ────────┐
         │                       ▼
         │              ┌─────────────────┐
         │              │ Admin Email:    │
         │              │ "Invalid data   │
         │              │  in row 5"      │
         │              └─────────────────┘
         │
         │ Valid
         ▼
┌─────────────────┐
│  Database       │
│  Updated        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Website        │
│  Reflects Change│
│                 │
│ GPT Plush: $19.99
└─────────────────┘
```

### Sheet Schema

| Column | Type | Required | Validation |
|--------|------|----------|------------|
| product_id | string | Yes | Unique, alphanumeric |
| name | string | Yes | Max 100 chars |
| description | string | No | Max 500 chars |
| price | number | Yes | > 0 |
| stock_quantity | integer | Yes | >= 0 |
| image_url | string | Yes | Valid URL |
| status | string | Yes | "active" or "inactive" |

---

## Flow 8: Cart Recovery (Nice-to-have)

**Description:** Return to abandoned cart
**Persona:** Maya (added items, left, came back)
**Goal:** Resume shopping seamlessly

### Flow Diagram

```
┌─────────────────┐
│  Day 1: Add     │
│  items to cart  │
└────────┬────────┘
         │
         │ Close browser
         ▼
┌─────────────────┐
│  Cart saved to  │
│  localStorage   │
└────────┬────────┘
         │
         │ Days pass...
         ▼
┌─────────────────┐
│  Day 3: Return  │
│  to website     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cart Restored  │
│                 │
│ "Welcome back!  │
│  You have 2     │
│  items in cart" │
└────────┬────────┘
         │
         │ Click cart icon
         ▼
┌─────────────────┐
│  Cart View      │
│                 │
│ ⚠ Price changed │
│ for "GPT Plush" │
│ Was: $29.99     │
│ Now: $24.99     │
│                 │
│ ✓ All items     │
│   in stock      │
└─────────────────┘
```

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Item now sold out | Show warning, offer to remove |
| Price increased | Show notification, allow proceed |
| Price decreased | Show "Good news!" notification |
| Item discontinued | Remove from cart, notify user |

---

## Flow 9: Mobile Navigation (Critical)

**Description:** Navigate site on mobile device
**Persona:** Maya (on iPhone)
**Goal:** Reach any page in < 3 taps

### Navigation Structure

```
┌─────────────────────────────────────────┐
│  ☰        AI PLUSHIES          🛒 (2)  │
└─────────────────────────────────────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
    ┌────▼────┐ ┌───▼───┐ ┌────▼────┐
    │ Hamburger│ │ Logo  │ │  Cart   │
    │  Menu    │ │(Home) │ │ Icon    │
    └────┬────┘ └───────┘ └────┬────┘
         │                     │
         ▼                     ▼
    ┌─────────┐           ┌─────────┐
    │ Shop    │           │  Cart   │
    │ Account │           │ Drawer  │
    │ Track   │           │(Slide-in│
    │ Help    │           └─────────┘
    └─────────┘
```

### Bottom Navigation (Alternative)

```
┌─────────────────────────────────────────┐
│                                         │
│            [Page Content]               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   🏠        🛍        👤        🛒      │
│  Home     Shop    Account    Cart      │
│                                         │
└─────────────────────────────────────────┘
```

### Tap Targets

- Minimum size: 44x44 pixels
- Spacing between targets: 8px minimum
- Active state feedback: immediate (< 100ms)

---

## Flow 10: Error Recovery (Critical)

**Description:** Handle errors gracefully
**Persona:** All users
**Goal:** Never leave user stranded

### Network Error

```
┌─────────────────┐
│  User Action    │
│ (Any request)   │
└────────┬────────┘
         │
         │ Network fails
         ▼
┌─────────────────┐
│  Error Screen   │
│                 │
│ 📡              │
│ "Connection Lost"│
│                 │
│ Your cart is    │
│ saved. We'll    │
│ retry when      │
│ you're back     │
│ online.         │
│                 │
│ [Retry Now]     │
└─────────────────┘
```

### Payment Error

```
┌─────────────────┐
│  Payment Submit │
└────────┬────────┘
         │
         │ Stripe error
         ▼
┌─────────────────┐
│  Error Message  │
│                 │
│ ⚠ Payment Issue │
│                 │
│ "Your card was  │
│ declined."      │
│                 │
│ Please try:     │
│ • Different card│
│ • Contact bank  │
│ • Use Venmo     │
│                 │
│ [Try Again]     │
└─────────────────┘
```

### 404 Not Found

```
┌─────────────────┐
│  Invalid URL    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  404 Page       │
│                 │
│  🔍             │
│ "Page not found"│
│                 │
│ The page you're │
│ looking for     │
│ doesn't exist.  │
│                 │
│ [Browse Products]│
│ [Go Home]       │
└─────────────────┘
```

---

## Mobile Interaction Patterns

### Swipe Gestures

| Gesture | Context | Action |
|---------|---------|--------|
| Swipe left on cart item | Cart drawer | Remove item (with undo) |
| Swipe right | Cart drawer | Close drawer |
| Swipe down | Product images | Refresh |
| Pull up | Product listing | Load more |

### Tap vs Long Press

| Interaction | Action |
|-------------|--------|
| Single tap on product | Open product detail |
| Long press on product | Quick add to cart (v2) |
| Single tap on cart icon | Open cart drawer |
| Double tap on image | Zoom (product detail) |

---

## Accessibility Flows

### Screen Reader Flow

```
Page Load → Skip to main content link → Header navigation
→ Main product grid → Product cards (announced: "Claude Plushie, $29.99, In Stock")
→ Tab to product → Enter to open detail → Tab through details
→ Add to Cart button → Cart updated announcement
```

### Keyboard-Only Flow

```
Tab: Navigate forward through focusable elements
Shift+Tab: Navigate backward
Enter/Space: Activate buttons/links
Escape: Close modals/drawers
Arrow keys: Navigate within menus/dropdowns
```

---

## Performance Targets by Flow

| Flow | Target Time | Metric |
|------|-------------|--------|
| Landing → First Product Visible | < 2s | LCP |
| Tap Product → Detail Loaded | < 1s | TTI |
| Add to Cart → Badge Updated | < 200ms | Interaction |
| Checkout Form → Validation | < 100ms | Response |
| Place Order → Confirmation | < 3s | Total |
| Guest Purchase (Total) | < 3 min | User time |
| Registered Purchase (Total) | < 90s | User time |

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial draft |
