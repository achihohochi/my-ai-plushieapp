# Wireframes - Text-Based Layouts

**Product:** AI Plushie E-commerce Platform
**Target:** Teenagers (13-19), Mobile-First
**Last Updated:** February 2, 2026
**Status:** Draft

---

## Purpose of This Document

This document provides text-based wireframes for all major pages and components. These wireframes focus on layout, information hierarchy, and user flow—not visual design (colors, fonts, etc.).

**Why Text-Based Wireframes:**
- Fast to create and iterate
- Focus on structure, not aesthetics
- Easy to share and discuss
- No design tools required

**Note:** Use tools like Figma or Sketch for high-fidelity mockups later.

---

## 1. Homepage

### Desktop (1280px+)

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo]              [Home] [Shop] [About]       [Search] [🛒3] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    HERO SECTION                                │
│              ╔════════════════════════════╗                    │
│              ║                            ║                    │
│              ║     [Pink AI Bunny Image]  ║                    │
│              ║         800x400px          ║                    │
│              ║                            ║                    │
│              ╚════════════════════════════╝                    │
│                                                                │
│            Shop Kawaii AI Plushies                             │
│       Cute, cuddly, and tech-themed!                           │
│                                                                │
│              [Shop Now →]  [Learn More]                        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                   FEATURED PRODUCTS                            │
│                                                                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                      │
│  │      │  │      │  │      │  │      │                      │
│  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │                      │
│  │      │  │      │  │      │  │      │                      │
│  ├──────┤  ├──────┤  ├──────┤  ├──────┤                      │
│  │Name  │  │Name  │  │Name  │  │Name  │                      │
│  │$24.99│  │$29.99│  │$19.99│  │$34.99│                      │
│  │[+🛒] │  │[+🛒] │  │[+🛒] │  │[+🛒] │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                │
│                    [View All Products →]                       │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    WHY SHOP WITH US                            │
│                                                                │
│   🎁 Free Shipping      💝 Easy Returns       🔒 Secure Pay    │
│   Over $50             Within 30 days       SSL Encrypted     │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ [Logo] | About | FAQ | Contact | Returns | Privacy | Terms    │
│ © 2026 My AI Plushie Shop | Made with 💕 for plushie lovers   │
│ [Instagram] [Twitter] [TikTok]                                 │
└────────────────────────────────────────────────────────────────┘
```

---

### Mobile (375px)

```
┌──────────────────────────┐
│ [☰]  [Logo]      [🛒3]  │
├──────────────────────────┤
│                          │
│   ╔══════════════════╗   │
│   ║                  ║   │
│   ║  [Hero Image]    ║   │
│   ║   Full Width     ║   │
│   ║                  ║   │
│   ╚══════════════════╝   │
│                          │
│ Shop Kawaii AI Plushies  │
│ Cute & cuddly!           │
│                          │
│     [Shop Now →]         │
│                          │
├──────────────────────────┤
│   FEATURED PRODUCTS      │
│                          │
│  ┌─────┐    ┌─────┐     │
│  │     │    │     │     │
│  │ IMG │    │ IMG │     │
│  ├─────┤    ├─────┤     │
│  │Name │    │Name │     │
│  │$24  │    │$29  │     │
│  │[+🛒]│    │[+🛒]│     │
│  └─────┘    └─────┘     │
│                          │
│  ┌─────┐    ┌─────┐     │
│  │     │    │     │     │
│  │ IMG │    │ IMG │     │
│  ├─────┤    ├─────┤     │
│  │Name │    │Name │     │
│  │$19  │    │$34  │     │
│  │[+🛒]│    │[+🛒]│     │
│  └─────┘    └─────┘     │
│                          │
│   [View All Products]    │
│                          │
├──────────────────────────┤
│      WHY SHOP HERE       │
│                          │
│  🎁 Free Shipping $50+   │
│  💝 30-Day Returns       │
│  🔒 Secure Payments      │
│                          │
├──────────────────────────┤
│  About | FAQ | Contact   │
│  © 2026 My AI Plushie    │
│  [📷 IG] [🐦 X] [📱 TT] │
└──────────────────────────┘
```

---

## 2. Product Listing Page (/shop)

### Desktop

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo]              [Home] [Shop] [About]       [Search] [🛒3] │
├────────────────────────────────────────────────────────────────┤
│ Home > Shop                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  FILTERS                              SORT BY ▼                │
│  ┌──────────┐                    Price: Low to High           │
│  │ Price    │                                                  │
│  │ [$10-$50]│                                                  │
│  │          │   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │ Category │   │      │  │      │  │      │  │      │       │
│  │ □ Robots │   │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │       │
│  │ □ Animals│   │      │  │      │  │      │  │      │       │
│  │          │   ├──────┤  ├──────┤  ├──────┤  ├──────┤       │
│  │[Apply]   │   │Name  │  │Name  │  │Name  │  │Name  │       │
│  └──────────┘   │$24.99│  │$29.99│  │$19.99│  │SOLD  │       │
│                 │⭐⭐⭐⭐⭐│  │⭐⭐⭐⭐  │  │⭐⭐⭐⭐⭐│  │OUT   │       │
│                 │[+🛒] │  │[+🛒] │  │[+🛒] │  │      │       │
│                 └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                                │
│                 ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│                 │      │  │      │  │      │  │      │       │
│                 │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │       │
│                 │      │  │      │  │      │  │      │       │
│                 ├──────┤  ├──────┤  ├──────┤  ├──────┤       │
│                 │Name  │  │Name  │  │Name  │  │Name  │       │
│                 │$24.99│  │$29.99│  │$19.99│  │$34.99│       │
│                 │⭐⭐⭐⭐  │  │⭐⭐⭐⭐⭐│  │⭐⭐⭐   │  │⭐⭐⭐⭐  │       │
│                 │[+🛒] │  │[+🛒] │  │[+🛒] │  │[+🛒] │       │
│                 └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                                │
│                         [Load More]                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Mobile

```
┌──────────────────────────┐
│ [☰]  [Logo]      [🛒3]  │
├──────────────────────────┤
│ Home > Shop              │
├──────────────────────────┤
│ [🔍 Search] [⚙️ Filters] │
│                          │
│  ┌─────┐    ┌─────┐     │
│  │     │    │     │     │
│  │ IMG │    │ IMG │     │
│  ├─────┤    ├─────┤     │
│  │Name │    │Name │     │
│  │$24  │    │$29  │     │
│  │⭐⭐⭐⭐⭐│    │⭐⭐⭐⭐  │     │
│  │[+🛒]│    │[+🛒]│     │
│  └─────┘    └─────┘     │
│                          │
│  ┌─────┐    ┌─────┐     │
│  │     │    │SOLD │     │
│  │ IMG │    │ OUT │     │
│  ├─────┤    ├─────┤     │
│  │Name │    │Name │     │
│  │$19  │    │ N/A │     │
│  │⭐⭐⭐⭐⭐│    │⭐⭐⭐⭐⭐│     │
│  │[+🛒]│    │     │     │
│  └─────┘    └─────┘     │
│                          │
│    [Load More ↓]         │
│                          │
└──────────────────────────┘
```

---

## 3. Product Detail Page (/products/1)

### Desktop

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo]              [Home] [Shop] [About]       [Search] [🛒3] │
├────────────────────────────────────────────────────────────────┤
│ Home > Shop > AI Robot Plushie                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ╔══════════════════╗         AI Robot Plushie                │
│  ║                  ║         ⭐⭐⭐⭐⭐ (127 reviews)            │
│  ║  [Product Image] ║                                          │
│  ║    600x600px     ║         $24.99                           │
│  ║   [Zoomable]     ║         🟢 In Stock (Only 3 left!)       │
│  ║                  ║                                          │
│  ╚══════════════════╝         What you'll love:                │
│  [📷][📷][📷][📷]              ✨ Super soft plush material      │
│  Thumbnails                   🤖 Adorable AI-themed design     │
│                               📏 12 inches tall                │
│                               💝 Great gift for tech lovers    │
│                               🧼 Machine washable              │
│                                                                │
│                               Quantity: [- 1 +]                │
│                               [Add to Cart - $24.99]           │
│                                                                │
│                               [❤️ Add to Wishlist]             │
│                               [🔗 Share]                        │
│                                                                │
│                               🚚 Free shipping over $50        │
│                               💰 30-day money-back guarantee   │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  CUSTOMER REVIEWS (127)                                        │
│                                                                │
│  ⭐⭐⭐⭐⭐ "Sooo cute!" - Emily, 16                               │
│  Love it! Sits perfectly on my desk. Way softer than expected!│
│                                                                │
│  ⭐⭐⭐⭐  "Pretty good" - Jake, 18                               │
│  Nice quality, shipped fast. A bit smaller than I thought.    │
│                                                                │
│                           [Read All Reviews]                   │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  YOU MIGHT ALSO LIKE                                           │
│                                                                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                      │
│  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Mobile

```
┌──────────────────────────┐
│ [←]   Product    [🛒3]   │
├──────────────────────────┤
│                          │
│  ╔══════════════════╗    │
│  ║                  ║    │
│  ║  [Product Image] ║    │
│  ║   Full Width     ║    │
│  ║   [Pinch Zoom]   ║    │
│  ║                  ║    │
│  ╚══════════════════╝    │
│  [📷][📷][📷][📷][📷]      │
│                          │
├──────────────────────────┤
│ AI Robot Plushie         │
│ ⭐⭐⭐⭐⭐ (127 reviews)     │
│                          │
│ $24.99                   │
│ 🟢 In Stock (Only 3!)    │
│                          │
│ What you'll love:        │
│ ✨ Super soft material   │
│ 🤖 AI-themed design      │
│ 📏 12 inches tall        │
│ 💝 Great gift            │
│ 🧼 Machine washable      │
│                          │
│ Quantity: [- 1 +]        │
│                          │
│ [Add to Cart - $24.99]   │
│                          │
│ [❤️ Wishlist] [🔗 Share] │
│                          │
│ 🚚 Free ship over $50    │
│ 💰 30-day guarantee      │
│                          │
├──────────────────────────┤
│ REVIEWS (127)            │
│                          │
│ ⭐⭐⭐⭐⭐ Emily, 16         │
│ "Sooo cute! Love it!"    │
│                          │
│ ⭐⭐⭐⭐  Jake, 18          │
│ "Pretty good quality"    │
│                          │
│  [Read All Reviews]      │
│                          │
├──────────────────────────┤
│ YOU MIGHT ALSO LIKE      │
│                          │
│  ┌─────┐    ┌─────┐     │
│  │ IMG │    │ IMG │     │
│  └─────┘    └─────┘     │
│                          │
└──────────────────────────┘
```

---

## 4. Shopping Cart Sidebar (Overlay)

### Desktop

```
                            ┌────────────────────────┐
                            │  Cart (3)         [✕] │
                            ├────────────────────────┤
                            │                        │
                            │ ┌──┐ AI Robot         │
                            │ │  │ $24.99           │
                            │ └──┘ Qty: [- 1 +] [🗑]│
                            │                        │
                            │ ┌──┐ Pink Bunny        │
                            │ │  │ $19.99           │
                            │ └──┘ Qty: [- 2 +] [🗑]│
                            │                        │
                            │ ┌──┐ Blue Cat          │
                            │ │  │ $29.99           │
                            │ └──┘ Qty: [- 1 +] [🗑]│
                            │                        │
                            ├────────────────────────┤
                            │ Subtotal      $94.96   │
                            │ Shipping      $5.99    │
                            │ ────────────────────   │
                            │ Total        $100.95   │
                            │                        │
                            │ Add $5 more for        │
                            │ free shipping! 📦       │
                            │ [████░░░░░] 90%        │
                            │                        │
                            │ [Proceed to Checkout]  │
                            │                        │
                            │ [Continue Shopping]    │
                            │                        │
                            └────────────────────────┘
```

---

### Mobile (Full Screen)

```
┌──────────────────────────┐
│ [←] Cart (3)             │
├──────────────────────────┤
│                          │
│ ┌────┐ AI Robot          │
│ │IMG │ $24.99            │
│ └────┘ [- 1 +]      [🗑] │
│                          │
│ ┌────┐ Pink Bunny        │
│ │IMG │ $19.99            │
│ └────┘ [- 2 +]      [🗑] │
│                          │
│ ┌────┐ Blue Cat          │
│ │IMG │ $29.99            │
│ └────┘ [- 1 +]      [🗑] │
│                          │
├──────────────────────────┤
│ Subtotal      $94.96     │
│ Shipping       $5.99     │
│ ──────────────────────   │
│ Total        $100.95     │
│                          │
│ 🎉 Add $5 for free ship! │
│ [████░░░░░░] 90%         │
│                          │
│ [Checkout - $100.95]     │
│                          │
│ [Continue Shopping]      │
│                          │
└──────────────────────────┘
```

---

## 5. Checkout Page (/checkout)

### Step 1: Shipping Information

```
┌──────────────────────────────────────────────────┐
│ [Logo]                            [🛒3]          │
├──────────────────────────────────────────────────┤
│                                                  │
│  Checkout                                        │
│  ● Shipping  ○ Payment  ○ Review                 │
│  ─────────────────────────────────────           │
│                                                  │
│  ┌────────────────────┐    ┌─────────────────┐  │
│  │ SHIPPING INFO      │    │ ORDER SUMMARY   │  │
│  │                    │    │                 │  │
│  │ [Guest Checkout]   │    │ AI Robot $24.99 │  │
│  │ or [Login]         │    │ Pink Bunny x2   │  │
│  │                    │    │        $39.98   │  │
│  │ Email:             │    │ Blue Cat $29.99 │  │
│  │ [____________]     │    │                 │  │
│  │                    │    │ Subtotal $94.96 │  │
│  │ Full Name:         │    │ Shipping  $5.99 │  │
│  │ [____________]     │    │ ───────────────  │  │
│  │                    │    │ Total   $100.95 │  │
│  │ Address:           │    │                 │  │
│  │ [____________]     │    └─────────────────┘  │
│  │ Apt/Suite:         │                         │
│  │ [____________]     │                         │
│  │                    │                         │
│  │ City:              │                         │
│  │ [____________]     │                         │
│  │                    │                         │
│  │ State:  ZIP:       │                         │
│  │ [____]  [_____]    │                         │
│  │                    │                         │
│  │ [Continue to Pay]  │                         │
│  └────────────────────┘                         │
│                                                  │
│  🔒 Secure checkout | 💝 30-day returns          │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### Step 2: Payment

```
┌──────────────────────────────────────────────────┐
│ [Logo]                            [🛒3]          │
├──────────────────────────────────────────────────┤
│                                                  │
│  Checkout                                        │
│  ✓ Shipping  ● Payment  ○ Review                 │
│  ─────────────────────────────────────           │
│                                                  │
│  ┌────────────────────┐    ┌─────────────────┐  │
│  │ PAYMENT METHOD     │    │ ORDER SUMMARY   │  │
│  │                    │    │                 │  │
│  │ ◉ Credit Card      │    │ Total   $100.95 │  │
│  │ ○ Venmo QR         │    │                 │  │
│  │                    │    │ Ship to:        │  │
│  │ [STRIPE IFRAME]    │    │ Test User       │  │
│  │ Card number        │    │ 123 Main St     │  │
│  │ [####-####-####]   │    │ SF, CA 94102    │  │
│  │                    │    │                 │  │
│  │ Expiry     CVC     │    │ [Edit Address]  │  │
│  │ [##/##]  [###]     │    │                 │  │
│  │                    │    └─────────────────┘  │
│  │ Billing ZIP:       │                         │
│  │ [_____]            │                         │
│  │                    │                         │
│  │ [Complete Purchase]│                         │
│  │                    │                         │
│  └────────────────────┘                         │
│                                                  │
│  🔒 Your payment info is encrypted and secure    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 6. Order Confirmation (/orders/confirmation/PLU-20260202-12345)

```
┌──────────────────────────────────────────────────┐
│ [Logo]                            [🛒0]          │
├──────────────────────────────────────────────────┤
│                                                  │
│              ✅ Order Confirmed!                  │
│                                                  │
│      Thanks for your order, Test User!           │
│                                                  │
│      Order #PLU-20260202-12345                   │
│      We sent a confirmation to test@example.com  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ ORDER DETAILS                              │  │
│  │                                            │  │
│  │ ┌──┐ AI Robot Plushie           $24.99   │  │
│  │ │  │ Quantity: 1                         │  │
│  │ └──┘                                      │  │
│  │                                            │  │
│  │ ┌──┐ Pink Bunny Plushie         $39.98   │  │
│  │ │  │ Quantity: 2                         │  │
│  │ └──┘                                      │  │
│  │                                            │  │
│  │ ┌──┐ Blue Cat Plushie            $29.99   │  │
│  │ │  │ Quantity: 1                         │  │
│  │ └──┘                                      │  │
│  │                                            │  │
│  │ Subtotal                         $94.96   │  │
│  │ Shipping                          $5.99   │  │
│  │ ─────────────────────────────────────────  │  │
│  │ Total                           $100.95   │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ SHIPPING ADDRESS                           │  │
│  │ Test User                                  │  │
│  │ 123 Main St                                │  │
│  │ San Francisco, CA 94102                    │  │
│  │                                            │  │
│  │ Estimated Delivery: Feb 9-14, 2026         │  │
│  │ (5-7 business days)                        │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  [Track Your Order]  [Download Receipt]          │
│                                                  │
│  [Continue Shopping]                             │
│                                                  │
│  Questions? Email us at support@example.com      │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 7. My Account Page (/account)

### Desktop

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo]              [Home] [Shop] [About]       [Search] [🛒3] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  MY ACCOUNT                                                    │
│                                                                │
│  ┌───────────┐  ┌───────────────────────────────────────────┐ │
│  │ Sidebar   │  │ ORDER HISTORY                             │ │
│  │           │  │                                           │ │
│  │ Orders    │  │ #PLU-20260202-12345    Feb 2, 2026       │ │
│  │ Addresses │  │ 3 items                $100.95   Delivered │ │
│  │ Settings  │  │ [View Details]                            │ │
│  │ Security  │  │                                           │ │
│  │ Logout    │  │ #PLU-20260125-98765    Jan 25, 2026      │ │
│  │           │  │ 1 item                  $24.99   Shipped  │ │
│  └───────────┘  │ [Track Order]                             │ │
│                 │                                           │ │
│                 │ #PLU-20260110-54321    Jan 10, 2026      │ │
│                 │ 2 items                 $54.98   Delivered │ │
│                 │ [View Details]                            │ │
│                 │                                           │ │
│                 │                          [Load More]       │ │
│                 └───────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Admin Dashboard (/admin)

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] Admin          [Dashboard] [Orders] [Products]  [Logout]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  DASHBOARD                                                     │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ $1,234   │  │    12    │  │    45    │  │    98%   │      │
│  │ Revenue  │  │ Orders   │  │ Products │  │ Uptime   │      │
│  │ (Today)  │  │ (Pending)│  │ (Active) │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                │
│  RECENT ORDERS                                                 │
│                                                                │
│  Order #     | Date      | Customer      | Total   | Status   │
│  ───────────────────────────────────────────────────────────  │
│  PLU-123456  | Feb 2     | test@ex.com   | $100.95 | Pending  │
│  PLU-123455  | Feb 2     | user@ex.com   | $24.99  | Shipped  │
│  PLU-123454  | Feb 1     | jane@ex.com   | $54.98  | Delivered│
│                                                                │
│                                           [View All Orders →]  │
│                                                                │
│  INVENTORY ALERTS                                              │
│                                                                │
│  ⚠️ AI Robot - Only 2 left in stock                            │
│  ⚠️ Pink Bunny - Low stock (4 remaining)                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 9. Component: Empty State

### Empty Cart

```
┌──────────────────────────┐
│                          │
│      [🛒 Icon]           │
│                          │
│ Your cart is empty!      │
│                          │
│ Let's find you the       │
│ perfect plushie 🧸       │
│                          │
│  [Browse Products]       │
│                          │
└──────────────────────────┘
```

### No Search Results

```
┌──────────────────────────┐
│                          │
│      [🔍 Icon]           │
│                          │
│ No results for           │
│ "purple dragon"          │
│                          │
│ Try searching for:       │
│ • Bunny                  │
│ • Robot                  │
│ • Cat                    │
│                          │
│ or [Browse All]          │
│                          │
└──────────────────────────┘
```

---

## 10. Responsive Breakpoints

**Wireframes adjust at:**
- **Mobile:** < 640px (single column)
- **Tablet:** 640-1024px (2-3 columns)
- **Desktop:** > 1024px (4 columns, sidebars)

**Mobile-First Approach:**
- Design mobile wireframes first
- Add complexity for larger screens
- Never hide critical content on mobile

---

## 11. Interaction Notes

### Hover States (Desktop)
- **Product Cards:** Scale 1.05x, add shadow
- **Buttons:** Darken by 10%
- **Links:** Underline appears

### Touch Gestures (Mobile)
- **Swipe Right:** Close cart sidebar, go back
- **Pinch:** Zoom product image
- **Pull Down:** Refresh product listing

### Loading States
- **Skeleton Screens:** Show gray placeholder boxes while loading
- **Spinners:** Use for < 2 second waits
- **Progress Bars:** Use for multi-step processes (checkout)

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial wireframes |

**Related Documents:**
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Visual design tokens
- [MOBILE_FIRST.md](./MOBILE_FIRST.md) - Responsive strategy
- [USABILITY_GUIDELINES.md](./USABILITY_GUIDELINES.md) - Teen UX patterns

---

**End of Wireframes Document**
