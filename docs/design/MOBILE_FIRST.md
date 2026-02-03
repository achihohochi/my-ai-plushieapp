# Mobile-First Design Strategy

**Product:** AI Plushie E-commerce Platform
**Target:** 70%+ mobile traffic from teenage users
**Last Updated:** February 2, 2026
**Status:** Draft

---

## Purpose of This Document

This document outlines the mobile-first design approach for the AI Plushie e-commerce platform. Since 70%+ of our target audience (teenagers) browse and shop on mobile devices, we design for mobile screens first, then progressively enhance for larger screens.

**Why Mobile-First:**
1. **Audience Behavior:** Teens spend 7-9 hours/day on phones
2. **Purchase Intent:** 60%+ of teen purchases happen on mobile
3. **Google Rankings:** Mobile-first indexing prioritizes mobile UX
4. **Performance:** Designing for constraints (small screens, slower connections) forces efficiency

**Constraints of Mobile:**
- Small screen (320-428px width)
- Touch input (fingers, not precise mouse)
- Variable connection speeds (3G, 4G, WiFi)
- One-handed use (thumb zone)
- Distractions (notifications, multitasking)

---

## 1. Mobile Screen Sizes

### 1.1 Target Devices

| Device | Screen Width | Viewport | Market Share | Priority |
|--------|--------------|----------|--------------|----------|
| **iPhone SE (small)** | 375px | 320px min | 15% | High |
| **iPhone 14/15** | 393px | Common | 35% | Critical |
| **iPhone 14/15 Plus** | 430px | Large | 20% | High |
| **Samsung Galaxy S23** | 360px | Common | 15% | High |
| **Tablet (iPad)** | 768px | Desktop-like | 10% | Medium |

**Design for:** 320px minimum width (ensures compatibility with all devices)

**Test on:**
- iPhone SE (2nd gen) - 375x667px
- iPhone 14 Pro - 393x852px
- Samsung Galaxy S23 - 360x760px

---

### 1.2 Safe Zones & Thumb Reach

**Thumb Zone (One-Handed Use):**

```
┌─────────────────┐
│                 │ ← Hard to reach
│                 │
│     [Logo]      │ ← Medium reach
│                 │
│  [Navigation]   │ ← Easy reach (thumb zone)
│                 │
│   [Products]    │ ← Easy reach
│                 │
│  [Add to Cart]  │ ← Critical action zone
│                 │
└─────────────────┘
```

**Golden Rule:** Place critical actions (Add to Cart, Checkout, Navigation) in the bottom 50% of the screen.

**Avoid:** Top corners (hard to reach with one hand)

---

## 2. Mobile-First Layout Patterns

### 2.1 Single Column Layout

**Mobile screens are too narrow for multiple columns.**

❌ **Don't:** Side-by-side columns
```
┌──────────┬──────────┐
│ Product  │ Details  │ ← Cramped
└──────────┴──────────┘
```

✅ **Do:** Stacked vertical layout
```
┌────────────────────┐
│   Product Image    │
├────────────────────┤
│   Product Details  │
├────────────────────┤
│   Add to Cart      │
└────────────────────┘
```

**Implementation:**
```jsx
<div className="flex flex-col gap-4">
  <img src="/product.jpg" alt="Product" className="w-full" />
  <div className="px-4">
    <h1>Product Name</h1>
    <p>Description...</p>
  </div>
  <button className="mx-4">Add to Cart</button>
</div>
```

---

### 2.2 Product Grid (Mobile)

**2 columns maximum on mobile.**

```jsx
<div className="grid grid-cols-2 gap-3 px-3">
  <ProductCard />
  <ProductCard />
  <ProductCard />
  <ProductCard />
</div>
```

**Why 2 columns?**
- Each card is ~160px wide (readable)
- Images are large enough to see details
- Reduces endless scrolling

❌ **Don't:** 3+ columns on mobile (cards too small)

---

### 2.3 Sticky Header (Always Visible)

**Mobile users need persistent navigation.**

```jsx
<header className="sticky top-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between">
  <button aria-label="Menu" className="p-2">
    <MenuIcon className="w-6 h-6" />
  </button>

  <img src="/logo.svg" alt="My AI Plushie Shop" className="h-8" />

  <button aria-label="Cart" className="p-2 relative">
    <ShoppingCartIcon className="w-6 h-6" />
    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      3
    </span>
  </button>
</header>
```

**Why Sticky:**
- Cart always accessible (reduces friction)
- Menu always reachable (no scrolling back)
- Shows brand logo (trust)

**Height:** Keep under 60px (don't waste vertical space)

---

### 2.4 Bottom Navigation (Optional for MVP)

**Alternative:** Fixed bottom bar for key actions

```jsx
<nav className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50">
  <div className="flex justify-around py-2">
    <button className="flex flex-col items-center gap-1 p-2">
      <HomeIcon className="w-6 h-6" />
      <span className="text-xs">Home</span>
    </button>
    <button className="flex flex-col items-center gap-1 p-2">
      <SearchIcon className="w-6 h-6" />
      <span className="text-xs">Search</span>
    </button>
    <button className="flex flex-col items-center gap-1 p-2">
      <ShoppingCartIcon className="w-6 h-6" />
      <span className="text-xs">Cart</span>
    </button>
    <button className="flex flex-col items-center gap-1 p-2">
      <UserIcon className="w-6 h-6" />
      <span className="text-xs">Account</span>
    </button>
  </div>
</nav>
```

**Pros:**
- Thumb-friendly (easy to reach)
- Always visible
- Common pattern (familiar to users)

**Cons:**
- Takes vertical space
- Can conflict with browser UI

**Recommendation:** Test with users, may add post-MVP

---

## 3. Touch-Optimized Interactions

### 3.1 Tap Target Size

**WCAG Minimum:** 44x44 pixels

```jsx
<button className="min-w-[44px] min-h-[44px] px-6 py-3">
  Add to Cart
</button>
```

**Why?**
- Average finger pad: 40-45px
- Prevents accidental taps
- Easier for users with motor impairments

**Common Mistakes:**
❌ Small icons without padding (20x20px)
❌ Close-together buttons (no spacing)

✅ **Do:**
```jsx
<div className="flex gap-2">
  <button className="min-w-[44px] min-h-[44px]">+</button>
  <input className="w-16 text-center" />
  <button className="min-w-[44px] min-h-[44px]">-</button>
</div>
```

---

### 3.2 Swipe Gestures

#### Cart Sidebar (Swipe to Dismiss)

```jsx
import { motion, useDragControls } from 'framer-motion';

<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 300 }}
  onDragEnd={(e, { offset }) => {
    if (offset.x > 150) {
      closeCart();
    }
  }}
  className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl"
>
  {/* Cart content */}
</motion.div>
```

**Use Cases:**
- Close cart/modal (swipe right)
- Dismiss notifications (swipe away)
- Navigate image gallery (swipe left/right)

---

#### Image Zoom (Pinch to Zoom)

```jsx
<TransformWrapper>
  <TransformComponent>
    <img src="/product.jpg" alt="Product" className="w-full" />
  </TransformComponent>
</TransformWrapper>
```

**Library:** `react-zoom-pan-pinch`

---

### 3.3 Pull to Refresh (Native Feel)

**Optional enhancement:**
```jsx
import PullToRefresh from 'react-simple-pull-to-refresh';

<PullToRefresh onRefresh={loadNewProducts}>
  <ProductGrid products={products} />
</PullToRefresh>
```

**Use Case:** Refresh product listing for new inventory

---

## 4. Mobile Typography

### 4.1 Readable Font Sizes

**Body Text:** 16px minimum (iOS Safari won't zoom if < 16px)

```jsx
<p className="text-base leading-relaxed">
  This text is readable on mobile without zooming.
</p>
```

**Headings:** Scale appropriately

| Element | Mobile Size | Desktop Size |
|---------|-------------|--------------|
| H1 | 32px | 48px |
| H2 | 24px | 36px |
| H3 | 20px | 24px |
| Body | 16px | 18px |
| Small | 14px | 16px |

---

### 4.2 Line Length

**Optimal:** 50-75 characters per line

**Mobile:** Naturally constrained by screen width (no issue)
**Desktop:** Use `max-width` to prevent overly long lines

```jsx
<p className="max-w-prose">
  {/* Text wraps at ~65 characters */}
</p>
```

---

### 4.3 Line Height

**Mobile:** Slightly larger line height for better readability

```jsx
<p className="leading-relaxed"> {/* line-height: 1.625 */}
  Description text with comfortable spacing between lines.
</p>
```

**Why:** Touch screens make it harder to track lines

---

## 5. Mobile Navigation Patterns

### 5.1 Hamburger Menu

**Use:** For secondary navigation (About, FAQ, Contact)

```jsx
<button
  onClick={toggleMenu}
  aria-label="Menu"
  aria-expanded={isMenuOpen}
  className="p-2"
>
  <MenuIcon className="w-6 h-6" />
</button>

{isMenuOpen && (
  <nav className="fixed inset-0 z-50 bg-white">
    <div className="flex flex-col gap-4 p-6">
      <a href="/about">About</a>
      <a href="/faq">FAQ</a>
      <a href="/contact">Contact</a>
    </div>
  </nav>
)}
```

**Slide-In Animation:**
```jsx
<motion.nav
  initial={{ x: '-100%' }}
  animate={{ x: 0 }}
  exit={{ x: '-100%' }}
  transition={{ duration: 0.3 }}
  className="fixed inset-0 z-50 bg-white"
>
  {/* Menu items */}
</motion.nav>
```

---

### 5.2 Tab Bar Navigation (Alternative)

**Use:** For primary navigation (Home, Shop, Cart, Account)

```jsx
<nav className="flex justify-around border-t border-gray-200 py-2">
  {[
    { icon: HomeIcon, label: 'Home', href: '/' },
    { icon: ShoppingBagIcon, label: 'Shop', href: '/shop' },
    { icon: ShoppingCartIcon, label: 'Cart', href: '/cart' },
    { icon: UserIcon, label: 'Account', href: '/account' },
  ].map(({ icon: Icon, label, href }) => (
    <a key={label} href={href} className="flex flex-col items-center gap-1">
      <Icon className="w-6 h-6" />
      <span className="text-xs">{label}</span>
    </a>
  ))}
</nav>
```

---

## 6. Mobile Forms

### 6.1 Input Types (Optimized Keyboards)

**Use correct input types to show appropriate keyboards:**

| Field | Input Type | Keyboard |
|-------|------------|----------|
| Email | `type="email"` | @ key visible |
| Phone | `type="tel"` | Numeric keypad |
| Number | `type="number"` | Numeric keypad |
| Search | `type="search"` | Search button |
| URL | `type="url"` | .com shortcut |

```jsx
<input
  type="email"
  inputMode="email"
  autoComplete="email"
  placeholder="name@example.com"
/>
```

---

### 6.2 Auto-Fill (Reduce Typing)

**Use autocomplete attributes:**

```jsx
<input type="text" autoComplete="name" />
<input type="email" autoComplete="email" />
<input type="tel" autoComplete="tel" />
<input type="text" autoComplete="street-address" />
<input type="text" autoComplete="postal-code" />
```

**Why:** Typing on mobile is slow and error-prone

---

### 6.3 Large Input Fields

**Mobile inputs should be easy to tap:**

```jsx
<input
  type="text"
  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg"
/>
```

**Minimum height:** 44px (touch target)
**Font size:** 16px+ (prevents iOS zoom on focus)

---

### 6.4 Inline Validation (Real-Time Feedback)

**Show errors as user types (debounced):**

```jsx
<div>
  <input
    type="email"
    value={email}
    onChange={validateEmail}
    className={`w-full px-4 py-3 border-2 rounded-lg ${
      emailError ? 'border-red-500' : 'border-gray-300'
    }`}
  />
  {emailError && (
    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
      <AlertIcon className="w-4 h-4" />
      {emailError}
    </p>
  )}
</div>
```

**Why:** Immediate feedback prevents form submission errors

---

## 7. Mobile Performance

### 7.1 Page Load Speed

**Target:** < 3 seconds on 4G (CRITICAL for teens)

**Why Teens Abandon Slow Sites:**
- **3 seconds:** 40% abandonment
- **5 seconds:** 90% abandonment

**How to Achieve:**
- Lazy load images below the fold
- Use WebP format (30-50% smaller than JPEG)
- Minimize JavaScript bundles
- Use Next.js Image component (automatic optimization)
- Server-side rendering (Next.js)

---

### 7.2 Image Optimization

**Responsive Images:**

```jsx
<img
  src="/product-400.webp"
  srcSet="
    /product-400.webp 400w,
    /product-800.webp 800w,
    /product-1200.webp 1200w
  "
  sizes="(max-width: 640px) 400px, 800px"
  alt="Product"
  loading="lazy"
/>
```

**Next.js Automatic Optimization:**

```jsx
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={400}
  loading="lazy"
  quality={85}
/>
```

---

### 7.3 Code Splitting

**Load only what's needed:**

```jsx
import dynamic from 'next/dynamic';

const CartSidebar = dynamic(() => import('./CartSidebar'), {
  loading: () => <p>Loading cart...</p>,
});
```

**Why:** Reduces initial bundle size

---

### 7.4 Minimize Third-Party Scripts

**Avoid:** Heavy analytics, chat widgets, unnecessary fonts

**Use:**
- Vercel Analytics (lightweight)
- Defer non-critical scripts

```html
<script src="/analytics.js" defer></script>
```

---

## 8. Mobile-Specific Features

### 8.1 Click-to-Call (Phone Numbers)

```jsx
<a href="tel:+1234567890" className="text-pink-600 underline">
  Call us: (123) 456-7890
</a>
```

**Mobile:** Opens phone dialer
**Desktop:** Does nothing (or shows popup)

---

### 8.2 Native Share (Share Products)

```jsx
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: 'Pink AI Bunny Plushie',
      text: 'Check out this cute plushie!',
      url: window.location.href,
    });
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(window.location.href);
  }
};

<button onClick={handleShare} className="flex items-center gap-2">
  <ShareIcon className="w-5 h-5" />
  Share
</button>
```

**Platforms:**
- iOS: Native share sheet (Messages, Instagram, etc.)
- Android: Native share dialog

---

### 8.3 Add to Home Screen (PWA)

**Progressive Web App features (Post-MVP):**
- Install prompt (Add to Home Screen)
- Offline support (Service Worker)
- Push notifications

**Implementation:**
```json
// manifest.json
{
  "name": "My AI Plushie Shop",
  "short_name": "Plushie Shop",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#FF69B4",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 9. Mobile Testing Checklist

### 9.1 Before Launch

- [ ] Test on real iPhone (not just simulator)
- [ ] Test on real Android device
- [ ] Test in portrait and landscape
- [ ] Test with slow network (Chrome DevTools → Network throttling)
- [ ] Verify all tap targets are 44x44px
- [ ] Verify text is 16px+ (no auto-zoom)
- [ ] Test forms (keyboard doesn't cover inputs)
- [ ] Test cart sidebar (swipe to close)
- [ ] Test image zoom (pinch gesture)
- [ ] Run Lighthouse mobile audit (score 90+)

---

### 9.2 Real Device Testing

**Minimum Test Matrix:**

| Device | Browser | Screen Size | Priority |
|--------|---------|-------------|----------|
| iPhone 14 | Safari | 393x852px | Critical |
| iPhone SE | Safari | 375x667px | High |
| Samsung Galaxy S23 | Chrome | 360x760px | High |
| iPad | Safari | 768x1024px | Medium |

**Testing Tools:**
- Chrome DevTools → Device toolbar
- BrowserStack (real device cloud)
- Physical devices (borrow from friends/family)

---

## 10. Mobile vs Desktop Differences

### 10.1 Layout Changes

| Component | Mobile | Desktop |
|-----------|--------|---------|
| **Navigation** | Hamburger menu | Full horizontal nav |
| **Product Grid** | 2 columns | 4 columns |
| **Cart** | Full-screen sidebar | Sidebar or dropdown |
| **Forms** | Stacked labels | Inline labels |
| **Images** | Full-width | Constrained width |

---

### 10.2 Hidden on Mobile

**Hide non-essential content on mobile:**

```jsx
<p className="hidden md:block">
  This detailed description is only visible on desktop.
</p>
```

**Why:** Reduce visual clutter, improve focus

---

### 10.3 Mobile-Only Features

**Show only on mobile:**

```jsx
<button className="md:hidden" onClick={openMobileMenu}>
  <MenuIcon />
</button>
```

---

## 11. Mobile Accessibility

### 11.1 Zoom Support

**Allow users to zoom (don't disable):**

❌ **Don't:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

✅ **Do:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Why:** Vision-impaired users need zoom

---

### 11.2 Screen Reader (VoiceOver, TalkBack)

**Test with mobile screen readers:**
- iOS: VoiceOver (Settings → Accessibility → VoiceOver)
- Android: TalkBack (Settings → Accessibility → TalkBack)

**Gestures:**
- Swipe right: Next element
- Double-tap: Activate
- Two-finger swipe: Scroll

---

## 12. Mobile E-commerce Best Practices

### 12.1 Quick Add to Cart

**One-tap add (no intermediate pages):**

```jsx
<button
  onClick={() => addToCart(product)}
  className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg"
>
  Add to Cart
</button>
```

**With toast confirmation:**
```jsx
const addToCart = (product) => {
  cart.add(product);
  toast.success('Added to cart!');
  openCart(); // Auto-open cart for 3 seconds
};
```

**Why:** Reduces friction, increases conversions

---

### 12.2 Persistent Cart Icon (Badge)

```jsx
<button className="relative p-2">
  <ShoppingCartIcon className="w-6 h-6" />
  {cart.count > 0 && (
    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {cart.count}
    </span>
  )}
</button>
```

**Why:** Always visible, reminds users of cart contents

---

### 12.3 Express Checkout (Apple Pay, Google Pay)

**One-tap checkout:**

```jsx
<button className="w-full py-3 bg-black text-white rounded-lg flex items-center justify-center gap-2">
  <ApplePayIcon />
  Buy with Apple Pay
</button>
```

**Why:** Teens use mobile wallets, reduces checkout friction

---

## 13. Progressive Enhancement

### 13.1 Start with Mobile

**Development Order:**
1. Design mobile layout
2. Implement mobile-first CSS
3. Test on mobile devices
4. Add desktop enhancements (wider columns, sidebars)
5. Test on desktop

**CSS Approach:**

```css
/* Mobile-first (default) */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Desktop enhancement */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}
```

---

### 13.2 Tailwind Mobile-First

```jsx
<div className="
  grid grid-cols-2        /* Mobile: 2 columns */
  md:grid-cols-3          /* Tablet: 3 columns */
  lg:grid-cols-4          /* Desktop: 4 columns */
  gap-4 lg:gap-6          /* Larger gap on desktop */
">
  {/* Products */}
</div>
```

---

## 14. Mobile Analytics

### 14.1 Track Mobile Behavior

**Key Metrics:**
- Mobile vs desktop traffic split
- Mobile conversion rate
- Mobile average order value
- Mobile cart abandonment rate
- Page load time on mobile

**Tools:**
- Vercel Analytics (performance)
- Google Analytics 4 (behavior)

---

### 14.2 Mobile Heatmaps (Post-MVP)

**See where users tap:**
- Hotjar
- Crazy Egg

**Insights:**
- Are users finding the cart icon?
- Are tap targets large enough?
- Do users scroll to see products?

---

## 15. Mobile Design Principles Summary

| Principle | Implementation |
|-----------|----------------|
| **Single Column** | Stack content vertically |
| **Large Touch Targets** | 44x44px minimum |
| **Readable Text** | 16px+ font size |
| **Fast Loading** | < 3 seconds |
| **Thumb-Friendly** | Critical actions at bottom |
| **Minimal Typing** | Autocomplete, large inputs |
| **Visual Hierarchy** | Important content first |
| **Progressive Disclosure** | Hide secondary content |
| **Gesture Support** | Swipe, pinch, pull |
| **Offline Graceful Degradation** | Show cached content |

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial draft |

**Related Documents:**
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Visual design tokens
- [USABILITY_GUIDELINES.md](./USABILITY_GUIDELINES.md) - Teen UX patterns
- [ACCESSIBILITY.md](../requirements/ACCESSIBILITY.md) - Mobile accessibility
- [PERFORMANCE_BENCHMARKS.md](../testing/PERFORMANCE_BENCHMARKS.md) - Speed requirements

---

**End of Mobile-First Design Document**
