# Performance Benchmarks - AI Plushie E-commerce

**Product:** AI Plushie E-commerce Platform
**Target Audience:** Teenagers on mobile devices
**Last Updated:** February 4, 2026
**Status:** ⏳ Pending Implementation (P2 - Nice to Have)

---

## Purpose of This Document

This document defines performance benchmarks and requirements for the AI Plushie e-commerce platform. Performance is CRITICAL for teenage users who have low tolerance for slow sites (40% abandon after 3 seconds).

**Why Performance Matters:**
- **Conversions:** 1-second delay = 7% reduction in conversions
- **SEO:** Google penalizes slow sites in search rankings
- **User Experience:** Fast site = happy users = repeat customers
- **Mobile:** Teens browse on phones with variable network speeds

---

## 1. Performance Targets

### 1.1 Core Web Vitals (Google's Standards)

| Metric | Target | Maximum | Description |
|--------|--------|---------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 4.0s | Time until largest element is visible |
| **FID** (First Input Delay) | < 100ms | 300ms | Time until page responds to interaction |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.25 | Visual stability (no unexpected shifts) |
| **FCP** (First Contentful Paint) | < 1.8s | 3.0s | Time until first text/image is visible |
| **TTI** (Time to Interactive) | < 3.8s | 7.3s | Time until page is fully interactive |
| **TBT** (Total Blocking Time) | < 200ms | 600ms | Time page is blocked from responding |

**Why These Numbers:**
- **LCP < 2.5s:** Teens expect instant gratification
- **FID < 100ms:** Interactions must feel instant
- **CLS < 0.1:** Layout shifts = frustration (clicking wrong button)

---

### 1.2 Lighthouse Scores

| Category | Target | Minimum | Description |
|----------|--------|---------|-------------|
| **Performance** | 90+ | 80 | Speed and optimization |
| **Accessibility** | 100 | 95 | WCAG compliance |
| **Best Practices** | 90+ | 80 | Security, modern standards |
| **SEO** | 90+ | 80 | Search engine optimization |

**Tool:** Lighthouse CI (automated on every PR)

---

### 1.3 Page Load Targets by Page Type

| Page | Device | Connection | Target LCP | Max Acceptable |
|------|--------|------------|------------|----------------|
| **Homepage** | Mobile | 4G | < 2.0s | 3.0s |
| **Homepage** | Desktop | Cable | < 1.5s | 2.5s |
| **Product Listing** | Mobile | 4G | < 2.5s | 3.5s |
| **Product Detail** | Mobile | 4G | < 2.0s | 3.0s |
| **Cart** | Mobile | 4G | < 1.5s | 2.5s |
| **Checkout** | Mobile | 4G | < 2.5s | 3.5s |
| **Order Confirmation** | Mobile | 4G | < 2.0s | 3.0s |

**Critical:** All pages must meet targets on 4G mobile (primary audience)

---

## 2. Performance Testing Tools

### 2.1 Lighthouse CI (Automated)

**Setup:**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3002
            http://localhost:3002/shop
            http://localhost:3002/products/1
            http://localhost:3002/cart
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

**lighthouserc.json:**
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 1.0}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}]
      }
    }
  }
}
```

**Result:** PR is blocked if performance targets not met

---

### 2.2 WebPageTest (Manual)

**URL:** https://www.webpagetest.org/

**Test Configuration:**
- **Location:** San Francisco (closest to Vercel servers)
- **Device:** Moto G4 (typical mid-range phone)
- **Connection:** 4G LTE
- **Runs:** 3 (median result)

**Key Metrics to Check:**
- Time to First Byte (TTFB)
- Start Render
- Speed Index
- Visual Complete
- Fully Loaded

**Frequency:** Weekly on staging, before major releases

---

### 2.3 Chrome DevTools (Local Testing)

**Throttling Profiles:**

| Profile | Download | Upload | Latency | Use Case |
|---------|----------|--------|---------|----------|
| **Fast 3G** | 1.6 Mbps | 750 Kbps | 562 ms | Worst-case mobile |
| **Fast 4G** | 10 Mbps | 5 Mbps | 40 ms | Typical mobile |
| **WiFi** | 30 Mbps | 15 Mbps | 2 ms | Home/coffee shop |

**How to Test:**
1. Open Chrome DevTools (F12)
2. Click Network tab
3. Select throttling profile (Fast 4G)
4. Reload page (Cmd+R or Ctrl+R)
5. Check LCP in Performance tab

---

## 3. Performance Budgets

### 3.1 Page Weight Budgets

| Resource Type | Homepage | Product Listing | Product Detail | Checkout |
|---------------|----------|-----------------|----------------|----------|
| **HTML** | < 50 KB | < 60 KB | < 70 KB | < 80 KB |
| **CSS** | < 100 KB | < 100 KB | < 100 KB | < 120 KB |
| **JavaScript** | < 300 KB | < 350 KB | < 350 KB | < 400 KB |
| **Images** | < 500 KB | < 800 KB | < 600 KB | < 200 KB |
| **Fonts** | < 100 KB | < 100 KB | < 100 KB | < 100 KB |
| **Total** | < 1 MB | < 1.4 MB | < 1.2 MB | < 900 KB |

**Why These Numbers:**
- 1 MB on 4G = ~1 second to download
- Target: < 2 seconds total load time
- Budget: 50% download, 50% parsing/rendering

---

### 3.2 Request Count Budgets

| Page | Max Requests | Ideal |
|------|--------------|-------|
| Homepage | 30 | 20 |
| Product Listing | 40 | 25 |
| Product Detail | 35 | 22 |
| Checkout | 30 | 20 |

**Why Fewer Requests:**
- Each request = latency overhead (DNS, TCP, TLS)
- Mobile has higher latency than desktop
- HTTP/2 multiplexing helps but not a silver bullet

---

## 4. Optimization Strategies

### 4.1 Image Optimization

**Requirements:**
- **Format:** WebP (30-50% smaller than JPEG)
- **Compression:** 85% quality (imperceptible loss)
- **Lazy Loading:** Load images only when in viewport
- **Responsive:** Serve correct size for device (srcset)
- **Optimization:** Next.js Image component (automatic WebP, sizing)

**Implementation:**
```jsx
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="AI Bunny Plushie"
  width={400}
  height={400}
  sizes="(max-width: 640px) 100vw, 400px"
  quality={85}
  loading="lazy"
  placeholder="blur"
/>
```

**Target:**
- Product images: < 100 KB each
- Hero images: < 200 KB each
- Thumbnails: < 30 KB each

---

### 4.2 Code Splitting

**Strategy:** Load only what's needed per page

**Next.js Automatic Splitting:**
- Each page = separate bundle
- Shared code = common chunk
- Dynamic imports for heavy components

**Example:**
```jsx
// Lazy load cart sidebar (not needed on first load)
import dynamic from 'next/dynamic';

const CartSidebar = dynamic(() => import('./CartSidebar'), {
  loading: () => <p>Loading cart...</p>,
  ssr: false, // Client-side only
});
```

**Target:**
- First load JS: < 300 KB
- Each page's JS: < 100 KB additional

---

### 4.3 Font Optimization

**Strategy:** Load fonts efficiently, avoid FOIT (Flash of Invisible Text)

**Implementation:**
```tsx
// app/layout.tsx
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  weights: ['400', '600', '700', '800'],
  display: 'swap', // Show fallback immediately
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunito.className}>
      <body>{children}</body>
    </html>
  );
}
```

**Target:**
- Font files: < 100 KB total
- Display swap: Show text immediately with fallback font

---

### 4.4 Caching Strategy

**Cache Headers:**

| Resource | Cache Duration | Strategy |
|----------|----------------|----------|
| **HTML** | 0 (revalidate) | Network first |
| **JavaScript** | 1 year | Immutable (hashed filenames) |
| **CSS** | 1 year | Immutable (hashed filenames) |
| **Images** | 1 year | Immutable (CDN cached) |
| **API responses** | 5 minutes | Stale-while-revalidate |

**Next.js Default:** Automatic static optimization

**CDN:** Vercel Edge Network (global caching)

---

### 4.5 Database Query Optimization

**Best Practices:**
- Index frequently queried columns (product_id, status)
- Limit results (pagination: 20 per page)
- Select only needed fields (not SELECT *)
- Use database connection pooling (Prisma default)

**Example:**
```typescript
// Bad: Fetches all columns
const products = await prisma.product.findMany();

// Good: Fetches only needed columns
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    image: true,
  },
  where: {
    status: 'active',
  },
  take: 20, // Pagination
});
```

**Target:** API response time < 200ms (p95)

---

## 5. Performance Monitoring (Production)

### 5.1 Vercel Analytics (Built-in)

**Metrics Tracked:**
- Real User Monitoring (RUM)
- Core Web Vitals per page
- Device/browser breakdown
- Geographic distribution

**Access:** Vercel Dashboard → Analytics

**Alerts:** Email if LCP > 3s for 24 hours

---

### 5.2 Synthetic Monitoring (Optional)

**Tools:**
- Checkly (automated Lighthouse tests every hour)
- Pingdom (uptime + performance monitoring)

**Setup:**
- Run Lighthouse hourly on production
- Alert if score drops below 80

**Cost:** Free tier sufficient for MVP

---

## 6. Performance Testing Checklist

### Before Every Release

- [ ] Run Lighthouse on all pages (90+ score)
- [ ] Test on real iPhone (Safari)
- [ ] Test on real Android (Chrome)
- [ ] Test with Fast 4G throttling
- [ ] Check image sizes (< 100 KB each)
- [ ] Check total page weight (< 1.5 MB)
- [ ] Verify lazy loading works
- [ ] Test with slow 3G (worst case)
- [ ] Check for layout shifts (CLS < 0.1)
- [ ] Verify fonts load with swap

---

### Monthly (Production)

- [ ] Review Vercel Analytics (Core Web Vitals)
- [ ] Run WebPageTest (visual comparison)
- [ ] Check for performance regressions
- [ ] Audit third-party scripts (remove unused)
- [ ] Review bundle sizes (any growth?)
- [ ] Check image optimization (any uncompressed?)

---

## 7. Performance Benchmarking Process

### 7.1 Baseline (Before Optimization)

**Step 1:** Run Lighthouse on all pages
**Step 2:** Record scores in spreadsheet
**Step 3:** Identify worst-performing pages

**Example Baseline:**

| Page | Performance | LCP | FID | CLS |
|------|-------------|-----|-----|-----|
| Homepage | 65 | 3.8s | 120ms | 0.15 |
| Product Listing | 58 | 4.2s | 150ms | 0.20 |
| Product Detail | 72 | 3.1s | 100ms | 0.08 |
| Checkout | 68 | 3.5s | 110ms | 0.12 |

---

### 7.2 Optimization

**Step 1:** Prioritize issues (biggest impact first)
**Step 2:** Implement fixes (image optimization, code splitting, etc.)
**Step 3:** Re-test after each fix

**Example Fixes:**

| Issue | Fix | Impact |
|-------|-----|--------|
| Large hero image (1.2 MB) | Convert to WebP, compress to 150 KB | LCP: 3.8s → 2.9s |
| Unoptimized fonts (300 KB) | Subset fonts, use font-display: swap | FCP: 2.5s → 1.8s |
| Layout shift (CLS 0.15) | Set image dimensions, reserve space | CLS: 0.15 → 0.05 |
| Large JS bundle (800 KB) | Code split, lazy load components | TTI: 5.2s → 3.5s |

---

### 7.3 Post-Optimization Results

**Target:**

| Page | Performance | LCP | FID | CLS |
|------|-------------|-----|-----|-----|
| Homepage | 92 ✅ | 2.1s ✅ | 80ms ✅ | 0.05 ✅ |
| Product Listing | 88 ✅ | 2.4s ✅ | 90ms ✅ | 0.08 ✅ |
| Product Detail | 94 ✅ | 1.9s ✅ | 70ms ✅ | 0.03 ✅ |
| Checkout | 90 ✅ | 2.3s ✅ | 85ms ✅ | 0.06 ✅ |

**Improvement:**
- Performance scores: +20-30 points
- LCP: 30-50% faster
- All pages meet Core Web Vitals

---

## 8. Performance Budget Enforcement

### 8.1 GitHub Action (Block Slow PRs)

**Setup:**
```yaml
# .github/workflows/performance-budget.yml
name: Performance Budget

on: [pull_request]

jobs:
  check-bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          limit: 300 KB # First load JS budget
```

**Result:** PR fails if bundle size exceeds 300 KB

---

### 8.2 Bundle Analysis

**Tool:** @next/bundle-analyzer

**Setup:**
```bash
npm install -D @next/bundle-analyzer
```

**next.config.js:**
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
});
```

**Usage:**
```bash
ANALYZE=true npm run build
open .next/analyze/client.html
```

**Result:** Visual map of bundle size (find large dependencies)

---

## 9. Mobile Performance Considerations

### 9.1 Mobile-Specific Optimizations

**Strategies:**
- Serve smaller images on mobile (srcset)
- Reduce animations (prefers-reduced-motion)
- Simplify layouts (fewer DOM nodes)
- Minimize JavaScript (mobile CPUs are slower)
- Use native inputs (better keyboard support)

---

### 9.2 Connection Awareness

**Detect slow connections:**
```javascript
if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
  // Load ultra-lightweight version
  // Skip non-essential images
  // Disable animations
}
```

**Use sparingly:** Most users have 4G+

---

## 10. Performance Regression Prevention

### 10.1 Continuous Monitoring

**Setup:**
- Lighthouse CI runs on every PR
- Vercel Analytics tracks real users
- Weekly performance reports emailed to team

**Thresholds:**
- Performance score < 85: Warning
- Performance score < 80: Blocked merge
- LCP > 3s: Investigate immediately

---

### 10.2 Performance Review Checklist

**Before merging PR:**
- [ ] Lighthouse CI passed
- [ ] No new large images added (> 200 KB)
- [ ] No new heavy dependencies (check bundle size)
- [ ] Layout shifts avoided (CLS < 0.1)
- [ ] Lazy loading implemented for below-fold images

---

## 11. Common Performance Issues

### Issue 1: Large Images

**Symptom:** LCP > 3s
**Cause:** Unoptimized images (JPEG, PNG, large resolution)
**Fix:** Convert to WebP, compress, use Next.js Image component

---

### Issue 2: Large JavaScript Bundle

**Symptom:** TTI > 5s
**Cause:** Importing large libraries, no code splitting
**Fix:** Dynamic imports, tree shaking, remove unused dependencies

---

### Issue 3: Render-Blocking Resources

**Symptom:** FCP > 2s
**Cause:** CSS/fonts loaded synchronously
**Fix:** Inline critical CSS, use font-display: swap

---

### Issue 4: Layout Shifts

**Symptom:** CLS > 0.1
**Cause:** Images without dimensions, dynamic content
**Fix:** Set image width/height, reserve space for ads/embeds

---

## 12. Performance Metrics Dashboard

**Track over time:**

| Week | Performance | LCP (avg) | FID (avg) | CLS (avg) | Bounce Rate |
|------|-------------|-----------|-----------|-----------|-------------|
| 1 | 65 | 3.8s | 120ms | 0.15 | 45% |
| 2 | 78 | 3.1s | 95ms | 0.10 | 38% |
| 3 | 88 | 2.4s | 80ms | 0.08 | 32% |
| 4 | 92 | 2.1s | 75ms | 0.05 | 28% |

**Goal:** See consistent improvement, correlate with conversions

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial benchmarks |

**Related Documents:**
- [TEST_STRATEGY.md](./TEST_STRATEGY.md) - Overall testing approach
- [MOBILE_FIRST.md](../design/MOBILE_FIRST.md) - Mobile optimization
- [TECHNOLOGY_STACK.md](../architecture/TECHNOLOGY_STACK.md) - Tech choices

---

**End of Performance Benchmarks Document**


## ⚠️ Implementation Note (Feb 4, 2026)

Performance benchmarking is planned but not yet implemented. Current focus is on functional test coverage (E2E, integration, unit tests).

**Current Status:**
- ✅ Functional tests complete (61 tests)
- ⏳ Performance tests pending
- ⏳ Lighthouse CI integration pending

**Next Steps:**
1. Integrate Lighthouse CI in GitHub Actions
2. Set up performance budgets
3. Add performance tests to CI/CD pipeline

**Priority:** P2 (After functional testing complete)

