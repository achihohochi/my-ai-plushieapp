# Design System - AI Plushie E-commerce

**Product:** AI Plushie E-commerce Platform
**Design Philosophy:** Kawaii, Teen-Friendly, Mobile-First
**Last Updated:** February 2, 2026
**Status:** Draft

---

## Purpose of This Document

This design system establishes the visual language, UI patterns, and component library for the AI Plushie e-commerce platform. It ensures consistency across all pages and provides clear guidelines for developers and designers.

**Design Principles:**
1. **Playful but Professional:** Fun kawaii aesthetics with e-commerce credibility
2. **Mobile-First:** Optimized for teenage mobile users
3. **Speed Matters:** Visual hierarchy guides quick decisions
4. **Accessible:** WCAG 2.1 AA compliant colors and patterns
5. **Scalable:** Component-based system for easy updates

---

## 1. Color System

### 1.1 Primary Palette

**Brand Colors:**

| Color Name | Hex Code | RGB | Use Case | Accessibility |
|------------|----------|-----|----------|---------------|
| **AI Pink** | `#FF69B4` | rgb(255, 105, 180) | Primary CTAs, links, accents | AA compliant on white |
| **AI Blue** | `#4A90E2` | rgb(74, 144, 226) | Secondary buttons, info badges | AA compliant on white |
| **AI Purple** | `#9B59B6` | rgb(155, 89, 182) | Tertiary accents, hover states | AA compliant on white |

**Neutrals:**

| Color Name | Hex Code | Use Case |
|------------|----------|----------|
| **Charcoal** | `#2D3748` | Body text, headings |
| **Slate** | `#4A5568` | Secondary text |
| **Silver** | `#A0AEC0` | Disabled text, borders |
| **Cloud** | `#F7FAFC` | Backgrounds, cards |
| **White** | `#FFFFFF` | Page background, cards |

**Semantic Colors:**

| Purpose | Color | Hex Code | Use Case |
|---------|-------|----------|----------|
| **Success** | Green | `#48BB78` | Order confirmed, payment success |
| **Warning** | Yellow | `#ECC94B` | Low stock, cart expiring |
| **Error** | Red | `#F56565` | Form errors, payment failed |
| **Info** | Blue | `#4299E1` | Shipping info, help tips |

---

### 1.2 Color Contrast Ratios (WCAG Compliance)

| Combination | Contrast Ratio | WCAG Level | Pass |
|-------------|----------------|------------|------|
| Charcoal (#2D3748) on White (#FFFFFF) | 12.1:1 | AAA | ✅ |
| AI Pink (#FF69B4) on White (#FFFFFF) | 3.2:1 | AA (large text only) | ⚠️ Use for headers, not body |
| AI Blue (#4A90E2) on White (#FFFFFF) | 4.6:1 | AA | ✅ |
| White (#FFFFFF) on AI Pink (#FF69B4) | 3.2:1 | AA (large text only) | ✅ (buttons OK) |

**Best Practices:**
- Body text: Use Charcoal or Slate on White
- Buttons: White text on AI Pink (large enough for AA compliance)
- Links: AI Pink text with underline on hover (for color-blind users)

---

### 1.3 Gradients

**Primary Gradient (Hero Background):**
```css
background: linear-gradient(135deg, #FF69B4 0%, #9B59B6 100%);
```

**Soft Gradient (Cards, Highlights):**
```css
background: linear-gradient(180deg, #FFF0F7 0%, #F7FAFC 100%);
```

---

## 2. Typography

### 2.1 Font Families

**Primary Font:** [Nunito](https://fonts.google.com/specimen/Nunito) (Google Fonts)
- **Reason:** Rounded, friendly, excellent readability on mobile
- **Weights Used:** 400 (Regular), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)

**Fallback Stack:**
```css
font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

**Monospace (for Order Numbers, Codes):**
```css
font-family: 'Courier New', Courier, monospace;
```

---

### 2.2 Type Scale (Mobile-First)

#### Mobile (< 640px)

| Element | Size | Weight | Line Height | Example Use |
|---------|------|--------|-------------|-------------|
| **H1** | 32px (2rem) | 800 | 1.2 | Page titles |
| **H2** | 24px (1.5rem) | 700 | 1.3 | Section headings |
| **H3** | 20px (1.25rem) | 600 | 1.4 | Product names |
| **Body** | 16px (1rem) | 400 | 1.6 | Paragraphs, descriptions |
| **Small** | 14px (0.875rem) | 400 | 1.5 | Labels, captions |
| **Tiny** | 12px (0.75rem) | 400 | 1.4 | Legal text, footnotes |

#### Desktop (≥ 1024px)

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| **H1** | 48px (3rem) | 800 | 1.2 |
| **H2** | 36px (2.25rem) | 700 | 1.3 |
| **H3** | 24px (1.5rem) | 600 | 1.4 |
| **Body** | 18px (1.125rem) | 400 | 1.6 |
| **Small** | 16px (1rem) | 400 | 1.5 |
| **Tiny** | 14px (0.875rem) | 400 | 1.4 |

**Implementation (Tailwind CSS):**
```jsx
<h1 className="text-3xl md:text-5xl font-extrabold">
  Shop Kawaii AI Plushies
</h1>

<p className="text-base md:text-lg leading-relaxed">
  Cute and cuddly AI-themed plushies for tech lovers!
</p>
```

---

### 2.3 Font Styles

**Emphasis:**
- **Bold:** Important text, CTAs, product names
- *Italic:* Subtle emphasis, sale prices

**Text Decoration:**
- Underline: Links on hover (accessibility)
- Strikethrough: Original price when on sale

**Example:**
```jsx
<p>
  <span className="line-through text-gray-500">$29.99</span>
  <span className="text-xl font-bold text-pink-500 ml-2">$24.99</span>
</p>
```

---

## 3. Spacing System

### 3.1 Spacing Scale (8px Base Unit)

| Token | Value | Use Case |
|-------|-------|----------|
| `space-0` | 0px | Reset margins |
| `space-1` | 4px (0.25rem) | Tight spacing (icon gaps) |
| `space-2` | 8px (0.5rem) | Small spacing (form field padding) |
| `space-3` | 12px (0.75rem) | Medium spacing (button padding) |
| `space-4` | 16px (1rem) | Base spacing (paragraphs, card padding) |
| `space-6` | 24px (1.5rem) | Large spacing (section gaps) |
| `space-8` | 32px (2rem) | Extra-large spacing (page sections) |
| `space-12` | 48px (3rem) | Huge spacing (hero sections) |
| `space-16` | 64px (4rem) | Massive spacing (page dividers) |

**Consistency Rule:** Use multiples of 4px for all spacing to maintain visual rhythm.

---

### 3.2 Component Padding

| Component | Mobile Padding | Desktop Padding |
|-----------|---------------|-----------------|
| **Button** | 12px 24px | 16px 32px |
| **Card** | 16px | 24px |
| **Container** | 16px | 32px |
| **Modal** | 24px | 32px |

---

## 4. Layout System

### 4.1 Breakpoints

| Breakpoint | Width | Device | Use Case |
|------------|-------|--------|----------|
| **xs** | < 640px | Mobile | Default (mobile-first) |
| **sm** | ≥ 640px | Large mobile | Adjust spacing |
| **md** | ≥ 768px | Tablet | 2-column layouts |
| **lg** | ≥ 1024px | Desktop | 3-4 column layouts, sidebars |
| **xl** | ≥ 1280px | Large desktop | Max content width |

**Tailwind CSS Breakpoints:**
```jsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

---

### 4.2 Max Content Width

**Container Max Width:** 1280px (prevents excessive line length on ultra-wide screens)

```jsx
<div className="container mx-auto max-w-7xl px-4">
  {/* Content */}
</div>
```

**Reading Width (Text Content):** 65-75 characters per line (optimal readability)

---

### 4.3 Grid System

**Product Grid:**
- Mobile (< 640px): 2 columns
- Tablet (640-1024px): 3 columns
- Desktop (> 1024px): 4 columns

**Gap:**
- Mobile: 16px (1rem)
- Desktop: 24px (1.5rem)

```jsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
  <ProductCard />
  <ProductCard />
  {/* ... */}
</div>
```

---

## 5. Components

### 5.1 Buttons

#### Primary Button (Call-to-Action)
**Use:** Add to Cart, Checkout, Buy Now

```jsx
<button className="
  bg-pink-500 hover:bg-pink-600
  text-white font-semibold
  px-6 py-3 rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
">
  Add to Cart
</button>
```

**Visual:**
- Background: AI Pink (#FF69B4)
- Hover: Darker pink (#E85DA2)
- Text: White, 600 weight
- Border Radius: 8px
- Padding: 12px 24px (mobile), 16px 32px (desktop)
- Shadow: `0 2px 8px rgba(255, 105, 180, 0.3)` on hover

---

#### Secondary Button
**Use:** Cancel, Go Back, Secondary actions

```jsx
<button className="
  bg-white hover:bg-gray-100
  text-gray-700 font-semibold
  px-6 py-3 rounded-lg
  border-2 border-gray-300
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
">
  Cancel
</button>
```

---

#### Tertiary Button (Ghost Button)
**Use:** Browse, Learn More, non-critical actions

```jsx
<button className="
  bg-transparent hover:bg-pink-50
  text-pink-600 hover:text-pink-700 font-semibold
  px-4 py-2 rounded-lg
  transition-colors duration-200
">
  Learn More
</button>
```

---

#### Icon Button
**Use:** Cart, Wishlist, Close modals

```jsx
<button
  aria-label="Shopping cart"
  className="
    relative p-2 rounded-full
    hover:bg-pink-100
    focus:outline-none focus:ring-2 focus:ring-pink-400
  "
>
  <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
    3
  </span>
</button>
```

---

#### Disabled State
**Use:** Out of stock, form not valid

```jsx
<button disabled className="
  bg-gray-300 text-gray-500
  px-6 py-3 rounded-lg
  cursor-not-allowed opacity-60
">
  Out of Stock
</button>
```

---

### 5.2 Forms

#### Text Input

```jsx
<div className="mb-4">
  <label
    htmlFor="email"
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Email Address
  </label>
  <input
    type="email"
    id="email"
    className="
      w-full px-4 py-3
      border-2 border-gray-300 rounded-lg
      focus:border-pink-500 focus:ring-2 focus:ring-pink-200
      outline-none transition-colors
    "
    placeholder="name@example.com"
  />
</div>
```

**States:**
- Default: Gray border
- Focus: Pink border, subtle pink ring
- Error: Red border, red ring
- Success: Green border (optional)

---

#### Error State

```jsx
<div className="mb-4">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    aria-invalid="true"
    aria-describedby="email-error"
    className="
      w-full px-4 py-3
      border-2 border-red-500 rounded-lg
      focus:border-red-600 focus:ring-2 focus:ring-red-200
      outline-none
    "
  />
  <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
    <AlertIcon className="w-4 h-4" />
    Email is required
  </p>
</div>
```

---

#### Checkbox & Radio Buttons

```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="
      w-5 h-5 text-pink-500
      border-gray-300 rounded
      focus:ring-2 focus:ring-pink-400
    "
  />
  <span className="text-gray-700">I agree to the Terms of Service</span>
</label>
```

---

### 5.3 Cards

#### Product Card

```jsx
<article className="
  bg-white rounded-lg overflow-hidden
  border-2 border-gray-200 hover:border-pink-300
  transition-all duration-300
  hover:shadow-lg
">
  <img
    src="/bunny.jpg"
    alt="Pink AI Bunny Plushie"
    className="w-full h-64 object-cover"
  />
  <div className="p-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Pink AI Bunny
    </h3>
    <p className="text-2xl font-bold text-pink-600 mb-4">
      $24.99
    </p>
    <button className="
      w-full bg-pink-500 hover:bg-pink-600
      text-white font-semibold py-3 rounded-lg
      transition-colors duration-200
    ">
      Add to Cart
    </button>
  </div>
</article>
```

**Card Elevation:**
- Default: 1px border
- Hover: 8px shadow + colored border

---

### 5.4 Badges

#### Stock Status Badge

```jsx
<span className="
  inline-flex items-center gap-1
  px-3 py-1 rounded-full
  bg-green-100 text-green-800
  text-sm font-medium
">
  <CheckIcon className="w-4 h-4" />
  In Stock
</span>

<span className="
  inline-flex items-center gap-1
  px-3 py-1 rounded-full
  bg-red-100 text-red-800
  text-sm font-medium
">
  <XIcon className="w-4 h-4" />
  Sold Out
</span>
```

---

#### Discount Badge

```jsx
<span className="
  absolute top-2 right-2
  px-3 py-1 rounded-full
  bg-yellow-400 text-gray-900
  text-xs font-bold
  shadow-md
">
  20% OFF
</span>
```

---

### 5.5 Notifications (Toast)

#### Success Toast

```jsx
<div
  role="status"
  aria-live="polite"
  className="
    fixed bottom-4 right-4
    bg-green-500 text-white
    px-6 py-4 rounded-lg shadow-lg
    flex items-center gap-3
    animate-slide-in
  "
>
  <CheckCircleIcon className="w-6 h-6" />
  <p className="font-medium">Added to cart!</p>
</div>
```

**Variants:**
- Success: Green background
- Error: Red background
- Warning: Yellow background
- Info: Blue background

**Animation:**
```css
@keyframes slide-in {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

### 5.6 Modal / Dialog

```jsx
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
  className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black bg-opacity-50
  "
>
  <div className="
    bg-white rounded-lg
    max-w-md w-full mx-4
    p-6 shadow-2xl
  ">
    <div className="flex items-center justify-between mb-4">
      <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
        Confirm Delete
      </h2>
      <button
        aria-label="Close modal"
        className="text-gray-500 hover:text-gray-700"
      >
        <XIcon className="w-6 h-6" />
      </button>
    </div>

    <p className="text-gray-700 mb-6">
      Are you sure you want to remove this item from your cart?
    </p>

    <div className="flex gap-3">
      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg">
        Cancel
      </button>
      <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg">
        Delete
      </button>
    </div>
  </div>
</div>
```

---

### 5.7 Loading States

#### Spinner

```jsx
<div
  role="status"
  aria-label="Loading"
  className="
    inline-block w-8 h-8
    border-4 border-gray-200 border-t-pink-500
    rounded-full animate-spin
  "
/>
```

#### Skeleton Loader (Product Card)

```jsx
<div className="bg-white rounded-lg overflow-hidden border-2 border-gray-200 animate-pulse">
  <div className="w-full h-64 bg-gray-200" />
  <div className="p-4">
    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
    <div className="h-8 bg-gray-200 rounded mb-4 w-1/2" />
    <div className="h-12 bg-gray-200 rounded w-full" />
  </div>
</div>
```

---

## 6. Icons

### 6.1 Icon Library

**Recommended:** [Lucide React](https://lucide.dev/) (modern, clean, MIT license)

**Installation:**
```bash
npm install lucide-react
```

**Usage:**
```jsx
import { ShoppingCart, Heart, Search, User } from 'lucide-react';

<ShoppingCart className="w-6 h-6" />
```

---

### 6.2 Icon Sizes

| Use Case | Size (px) | Tailwind Class |
|----------|-----------|----------------|
| Small icons (inline) | 16px | `w-4 h-4` |
| Medium icons (buttons) | 24px | `w-6 h-6` |
| Large icons (hero) | 32px | `w-8 h-8` |
| Extra-large icons (empty states) | 64px | `w-16 h-16` |

---

### 6.3 Common Icons

| Icon | Name | Use Case |
|------|------|----------|
| 🛒 | ShoppingCart | Cart button, add to cart |
| ❤️ | Heart | Wishlist, favorites |
| 🔍 | Search | Search bar |
| 👤 | User | Account, login |
| ⚙️ | Settings | Account settings |
| 📦 | Package | Orders, shipping |
| ✓ | Check | Success, confirmed |
| ✕ | X | Close, remove |
| ⚠️ | AlertTriangle | Warnings, low stock |
| ℹ️ | Info | Help, information |

---

## 7. Imagery

### 7.1 Image Specifications

| Image Type | Dimensions | Format | Max Size |
|------------|------------|--------|----------|
| Product thumbnail | 400x400px | WebP | 50KB |
| Product detail | 1200x1200px | WebP | 200KB |
| Hero banner | 1920x800px | WebP | 300KB |
| Logo | 200x50px | SVG or PNG | 20KB |

**Aspect Ratios:**
- Product images: 1:1 (square)
- Hero images: 2.4:1 (wide)
- Thumbnails: 1:1

---

### 7.2 Image Optimization

**Tools:**
- **Next.js Image component:** Automatic WebP conversion, lazy loading, responsive sizing
- **Images served from:** `/public` folder (MVP), can migrate to CDN later if needed

**Implementation:**
```jsx
import Image from 'next/image';

<Image
  src="/bunny.jpg"
  alt="Pink AI Bunny Plushie"
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/bunny-blur.jpg"
/>
```

---

### 7.3 Image Placeholders

**Blur Placeholder:** Low-res version (10-20KB) shown while loading

**Empty State Image:**
```jsx
<div className="flex flex-col items-center justify-center p-12">
  <Image
    src="/empty-cart.svg"
    alt="Empty cart illustration"
    width={200}
    height={200}
  />
  <p className="mt-4 text-gray-600 text-lg">Your cart is empty</p>
</div>
```

---

## 8. Animation & Motion

### 8.1 Animation Principles

1. **Subtle:** Enhance UX, don't distract
2. **Fast:** 150-300ms for most animations
3. **Purposeful:** Every animation has a reason
4. **Performant:** Use `transform` and `opacity` (GPU-accelerated)

---

### 8.2 Transition Durations

| Use Case | Duration | Easing |
|----------|----------|--------|
| Hover effects | 150ms | ease-in-out |
| Page transitions | 300ms | ease-out |
| Modal open/close | 250ms | ease-out |
| Loading spinners | 1000ms | linear |

---

### 8.3 Common Animations

#### Hover Scale (Product Cards)

```css
.product-card {
  transition: transform 200ms ease-in-out;
}

.product-card:hover {
  transform: scale(1.05);
}
```

**Tailwind:**
```jsx
<div className="transition-transform duration-200 hover:scale-105">
  {/* Product card */}
</div>
```

---

#### Slide In (Modal, Sidebar)

```css
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.cart-sidebar {
  animation: slide-in-right 300ms ease-out;
}
```

**Tailwind with Framer Motion:**
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ duration: 0.3 }}
  className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl"
>
  {/* Cart sidebar */}
</motion.div>
```

---

#### Fade In (Toast Notifications)

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast {
  animation: fade-in 300ms ease-out;
}
```

---

### 8.4 Loading Animations

**Skeleton Pulse:**
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 9. Shadows & Depth

### 9.1 Shadow Scale

| Level | Use Case | CSS |
|-------|----------|-----|
| **None** | Flat elements | `box-shadow: none;` |
| **Small** | Subtle elevation (cards at rest) | `box-shadow: 0 1px 3px rgba(0,0,0,0.1);` |
| **Medium** | Hover state, dropdowns | `box-shadow: 0 4px 12px rgba(0,0,0,0.15);` |
| **Large** | Modals, important CTAs | `box-shadow: 0 10px 40px rgba(0,0,0,0.2);` |
| **Extra-Large** | Overlays, pop-ups | `box-shadow: 0 20px 60px rgba(0,0,0,0.3);` |

**Tailwind Classes:**
```jsx
<div className="shadow-sm hover:shadow-lg transition-shadow duration-300">
  {/* Card */}
</div>
```

---

## 10. Responsive Design Patterns

### 10.1 Navigation (Header)

**Mobile (< 768px):**
- Hamburger menu (collapsible)
- Logo center or left
- Cart icon top-right

**Desktop (≥ 768px):**
- Full horizontal nav
- Logo left
- Menu center
- Cart + Account right

---

### 10.2 Product Grid

**Responsive Columns:**
```jsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Products */}
</div>
```

---

### 10.3 Typography Scaling

**Headers:**
```jsx
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
  Welcome to My AI Plushie Shop!
</h1>
```

**Body Text:**
```jsx
<p className="text-base lg:text-lg leading-relaxed">
  Description text scales up slightly on larger screens.
</p>
```

---

## 11. Dark Mode (Future Enhancement)

**Note:** MVP uses light mode only. Dark mode can be added post-launch.

**Future Implementation:**
- Use Tailwind's `dark:` variant
- Store preference in localStorage
- Toggle in header

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Content adapts to dark mode */}
</div>
```

---

## 12. Design Tokens (Tailwind Config)

**tailwind.config.js:**

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'ai-pink': '#FF69B4',
        'ai-blue': '#4A90E2',
        'ai-purple': '#9B59B6',
        'charcoal': '#2D3748',
        'slate': '#4A5568',
        'silver': '#A0AEC0',
        'cloud': '#F7FAFC',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'pink': '0 4px 12px rgba(255, 105, 180, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

---

## 13. Component Library (shadcn/ui)

**Installation:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

**Why shadcn/ui?**
- Copy-paste components (no black box)
- Built on Radix UI (accessible)
- Tailwind CSS compatible
- Customizable

---

## 14. Accessibility Design Guidelines

### 14.1 Color Contrast

✅ **Do:**
- Charcoal text on white background (12.1:1 ratio)
- AI Blue links with underline on hover

❌ **Don't:**
- Light gray text on white (fails WCAG)
- Pink text for body copy (hard to read)

---

### 14.2 Touch Targets

**Minimum Size:** 44x44 pixels

```jsx
<button className="min-w-[44px] min-h-[44px] p-3">
  {/* Accessible touch target */}
</button>
```

---

### 14.3 Focus Indicators

**Visible outline on focus:**
```css
*:focus {
  outline: 2px solid #FF69B4;
  outline-offset: 2px;
}
```

**Tailwind:**
```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
  Click Me
</button>
```

---

## 15. Design Checklist

Before shipping a new component:

- [ ] Follows color palette (AI Pink, Blue, Purple)
- [ ] Uses Nunito font with correct weights
- [ ] Spacing uses 4px/8px increments
- [ ] Mobile-first responsive design
- [ ] Touch targets are 44x44px minimum
- [ ] Color contrast is WCAG AA compliant
- [ ] Focus indicators are visible
- [ ] Animations are subtle (150-300ms)
- [ ] Images are optimized (WebP, lazy loading)
- [ ] Component is reusable (not hardcoded)
- [ ] Hover states are defined
- [ ] Loading states are defined
- [ ] Error states are defined

---

## 16. Design Tools

**Recommended:**
- **Figma:** UI design and prototyping
- **Coolors:** Color palette generator
- **WebAIM Contrast Checker:** Verify accessibility
- **shadcn/ui:** Component library

**Resources:**
- Tailwind CSS Docs: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- Google Fonts (Nunito): https://fonts.google.com/specimen/Nunito

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial draft |

**Related Documents:**
- [MOBILE_FIRST.md](./MOBILE_FIRST.md) - Mobile design strategy
- [ACCESSIBILITY.md](../requirements/ACCESSIBILITY.md) - WCAG compliance
- [USABILITY_GUIDELINES.md](./USABILITY_GUIDELINES.md) - Teen UX patterns

---

**End of Design System Document**
