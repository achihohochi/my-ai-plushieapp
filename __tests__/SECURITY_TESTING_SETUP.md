# Security Testing Setup - E-commerce

**Last Updated:** February 4, 2026
**Status:** Setup Guide

---

## 📦 Recommended Security Testing Packages

### Package Selection Matrix

| Package | Purpose | Cost | Priority | Integration |
|---------|---------|------|----------|-------------|
| **eslint-plugin-security** | Static code analysis | Free | P0 | Pre-commit |
| **Snyk** | Dependency vulnerabilities | Free tier | P0 | GitHub Actions |
| **@axe-core/playwright** | XSS/accessibility | Free | P0 | E2E tests |
| **helmet** | HTTP security headers | Free | P0 | Runtime (Next.js) |
| **OWASP ZAP** | Full penetration testing | Free | P1 | CI/CD |
| **socket.dev** | Supply chain security | Free tier | P1 | GitHub Actions |

---

## 🚀 Quick Start Installation

### Step 1: Install Packages

```bash
# Static analysis
npm install -D eslint-plugin-security

# Dependency scanning
npm install -D snyk

# E2E security testing
npm install -D @axe-core/playwright

# Runtime security headers
npm install helmet
```

---

## 1️⃣ ESLint Security Plugin (P0)

### Installation

```bash
npm install -D eslint-plugin-security
```

### Configuration

**eslint.config.mjs** (or .eslintrc.js):
```javascript
import security from 'eslint-plugin-security';

export default [
  {
    plugins: {
      security,
    },
    rules: {
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
    },
  },
];
```

### Usage

```bash
# Run security checks
npm run lint

# Auto-fix safe issues
npm run lint -- --fix
```

### What It Catches

✅ **Prevents:**
- SQL injection patterns
- Command injection
- Regex DoS attacks
- Unsafe cryptographic functions
- Eval() usage
- Buffer vulnerabilities

---

## 2️⃣ Snyk - Dependency Scanning (P0)

### Installation

```bash
# Install globally or as dev dependency
npm install -D snyk

# Authenticate
npx snyk auth
```

### Configuration

**package.json:**
```json
{
  "scripts": {
    "security:scan": "snyk test",
    "security:monitor": "snyk monitor",
    "security:fix": "snyk wizard"
  }
}
```

### GitHub Actions Integration

**.github/workflows/security.yml:**
```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### Usage

```bash
# Test for vulnerabilities
npm run security:scan

# Fix vulnerabilities automatically
npm run security:fix

# Monitor project (continuous)
npm run security:monitor
```

### What It Catches

✅ **Prevents:**
- Known CVEs in dependencies
- Vulnerable package versions
- License compliance issues
- Supply chain attacks

---

## 3️⃣ Axe Core - Accessibility + XSS (P0)

### Installation

```bash
npm install -D @axe-core/playwright
```

### Implementation

**__tests__/e2e/security/xss-prevention.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('XSS Prevention', () => {
  test('should sanitize script tags in product search', async ({ page }) => {
    await page.goto('/shop');

    // Try XSS attack in search
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('<script>alert("XSS")</script>');
    await page.keyboard.press('Enter');

    // Wait for results
    await page.waitForTimeout(1000);

    // Verify script didn't execute
    const dialogAppeared = await page.evaluate(() => {
      return document.querySelector('script[src*="alert"]') !== null;
    });

    expect(dialogAppeared).toBe(false);
  });

  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/shop');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### What It Catches

✅ **Prevents:**
- XSS vulnerabilities
- Accessibility violations
- HTML injection
- Script execution

---

## 4️⃣ Helmet - HTTP Security Headers (P0)

### Installation

```bash
npm install helmet
```

### Implementation

**middleware.ts** (Next.js 13+):
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://api.stripe.com; " +
    "frame-src https://js.stripe.com https://hooks.stripe.com;"
  );

  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
```

### What It Provides

✅ **Prevents:**
- Clickjacking
- MIME sniffing attacks
- XSS attacks
- Insecure connections
- Content injection

---

## 5️⃣ OWASP ZAP - Penetration Testing (P1)

### Installation

```bash
# Docker-based
docker pull owasp/zap2docker-stable
```

### Usage

```bash
# Baseline scan (passive)
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3002 \
  -r zap-report.html

# Full scan (active - use in staging only!)
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t http://staging.mysite.com \
  -r zap-report.html
```

### GitHub Actions Integration

**.github/workflows/zap-scan.yml:**
```yaml
name: OWASP ZAP Scan

on:
  schedule:
    - cron: '0 2 * * 0' # Weekly on Sunday 2am

jobs:
  zap_scan:
    runs-on: ubuntu-latest
    steps:
      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'https://staging.mysite.com'
```

### What It Catches

✅ **Prevents:**
- SQL injection
- XSS
- CSRF
- Security misconfigurations
- Sensitive data exposure
- Broken authentication
- All OWASP Top 10

---

## 🧪 Security Test Suite

### Create Security Test Directory

```bash
mkdir -p __tests__/e2e/security
```

### Test Files to Create

1. **xss-prevention.spec.ts** - Cross-site scripting tests
2. **sql-injection.spec.ts** - SQL injection tests
3. **csrf-protection.spec.ts** - CSRF token validation
4. **authentication.spec.ts** - Auth bypass attempts
5. **rate-limiting.spec.ts** - API rate limit tests
6. **idor.spec.ts** - Insecure direct object reference tests

---

## 📝 Example Security Tests

### 1. SQL Injection Test

**__tests__/e2e/security/sql-injection.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('SQL Injection Prevention', () => {
  test('should prevent SQL injection in product search', async ({ page }) => {
    await page.goto('/shop');

    // Try SQL injection
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill("' OR '1'='1");
    await page.keyboard.press('Enter');

    // Should return no results or safe results (not all products)
    const errorMessage = await page.locator('text=/error|invalid/i').isVisible();
    const noResults = await page.locator('text=/no results/i').isVisible();

    expect(errorMessage || noResults).toBe(true);
  });

  test('should sanitize product ID parameter', async ({ page }) => {
    // Try SQL injection in URL parameter
    await page.goto('/products/1; DROP TABLE products--');

    // Should show 404 or error, not crash
    const is404 = page.url().includes('404') ||
                  await page.locator('text=/not found/i').isVisible();

    expect(is404).toBe(true);
  });
});
```

---

### 2. CSRF Protection Test

**__tests__/e2e/security/csrf-protection.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('CSRF Protection', () => {
  test('should reject POST without CSRF token', async ({ page, context }) => {
    // Create order via direct API call (no CSRF token)
    const response = await context.request.post('/api/checkout', {
      data: {
        email: 'test@example.com',
        items: [{ id: 1, quantity: 1 }],
      },
    });

    // Should be rejected (403 or 400)
    expect([400, 403]).toContain(response.status());
  });
});
```

---

### 3. Rate Limiting Test

**__tests__/e2e/security/rate-limiting.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Rate Limiting', () => {
  test('should block excessive API requests', async ({ page, context }) => {
    const promises = [];

    // Fire 100 requests rapidly
    for (let i = 0; i < 100; i++) {
      promises.push(
        context.request.get('/api/products')
      );
    }

    const responses = await Promise.all(promises);

    // At least some should be rate limited (429)
    const rateLimitedCount = responses.filter(r => r.status() === 429).length;

    expect(rateLimitedCount).toBeGreaterThan(0);
  });
});
```

---

### 4. Payment Security Test

**__tests__/e2e/security/payment-security.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Payment Security', () => {
  test('should never expose card data in logs', async ({ page }) => {
    const logs: string[] = [];

    // Capture console logs
    page.on('console', msg => logs.push(msg.text()));

    await page.goto('/checkout');

    // Fill checkout form
    await page.fill('input[name="email"]', 'test@example.com');
    // ... other fields

    // Check if any logs contain card-like patterns
    const hasCardData = logs.some(log =>
      /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/.test(log)
    );

    expect(hasCardData).toBe(false);
  });

  test('should use HTTPS for all payment requests', async ({ page }) => {
    const requests: string[] = [];

    page.on('request', req => {
      if (req.url().includes('stripe') || req.url().includes('payment')) {
        requests.push(req.url());
      }
    });

    await page.goto('/checkout');

    // All payment URLs should be HTTPS
    requests.forEach(url => {
      expect(url).toMatch(/^https:\/\//);
    });
  });
});
```

---

## 📊 Security Testing Checklist

### Pre-Deployment Security Audit

- [ ] ESLint security rules pass
- [ ] No high/critical Snyk vulnerabilities
- [ ] All E2E security tests pass
- [ ] Helmet headers configured
- [ ] OWASP ZAP scan shows no critical issues
- [ ] API keys not exposed in code
- [ ] .env files gitignored
- [ ] Stripe webhook signatures verified
- [ ] Rate limiting configured
- [ ] HTTPS enforced in production

---

## 🎯 Recommended Implementation Order

### Week 1 (P0 - Critical)
1. Install eslint-plugin-security
2. Install Snyk and run first scan
3. Add Helmet security headers
4. Create basic XSS prevention tests

### Week 2 (P0 - Critical)
5. Add SQL injection tests
6. Add CSRF protection tests
7. Add rate limiting tests
8. Configure GitHub Actions for Snyk

### Week 3 (P1 - Important)
9. Add OWASP ZAP to CI/CD
10. Create comprehensive security test suite
11. Document security findings
12. Fix all high-priority vulnerabilities

---

## 🔗 Resources

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [Snyk Docs](https://docs.snyk.io/)
- [ESLint Security Rules](https://github.com/nodesecurity/eslint-plugin-security)
- [Helmet Documentation](https://helmetjs.github.io/)
- [OWASP ZAP Getting Started](https://www.zaproxy.org/getting-started/)

---

**Next Step:** Create security test files in `__tests__/e2e/security/`
