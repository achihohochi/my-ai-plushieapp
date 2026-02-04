# 🔒 Security Setup Guide

This guide will help you set up security best practices for your AI Plushie E-commerce application.

## 🚨 URGENT: If You've Exposed API Keys

If you've accidentally committed API keys to GitHub, follow these steps **immediately**:

### 1. Revoke All Exposed Keys

#### Resend API Key
1. Go to https://resend.com/api-keys
2. Find the exposed key (starts with `re_`)
3. Click "Delete" or "Revoke"
4. Create a new API key
5. Update your local `.env` file with the new key

#### Stripe API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Click "Roll" or "Regenerate" for:
   - Secret key (`sk_test_...`)
   - Publishable key (`pk_test_...`)
3. Update your local `.env` file with new keys
4. Re-run webhook setup: `stripe listen --forward-to localhost:3002/api/webhooks/stripe`
5. Update `STRIPE_WEBHOOK_SECRET` in `.env`

#### Admin Key
1. Generate a new secure key:
   ```bash
   openssl rand -base64 32
   ```
2. Update `ADMIN_KEY` in your `.env` file

### 2. Remove Secrets from Git History

**Option A: Simple (Future Commits Only)**
```bash
# Remove .env from current commit
git rm --cached .env
git commit -m "Remove .env file from repository"

# Update .gitignore to prevent future commits
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Update .gitignore to exclude .env"

# Push changes
git push origin main
```

**Option B: Advanced (Clean History)**
```bash
# Install BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror git@github.com:yourusername/my-ai-plushieapp.git

# Remove .env from history
bfg --delete-files .env my-ai-plushieapp.git

# Clean up
cd my-ai-plushieapp.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: Rewrites history)
git push --force
```

### 3. Verify Removal
```bash
# Check if .env is still tracked
git ls-files | grep .env

# Should only show .env.example, not .env
```

## 🛡️ Initial Security Setup

### 1. Environment Variables

Copy the example file and configure your secrets:

```bash
# Copy example file
cp .env.example .env

# Generate secure admin key
openssl rand -base64 32

# Edit .env and add your real credentials
nano .env
```

**Required variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe test secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe test publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `ADMIN_KEY` - Secure random key (use openssl command above)
- `RESEND_API_KEY` - Resend API key for emails
- `NEXT_PUBLIC_BASE_URL` - Your app URL

### 2. Verify .gitignore

Ensure `.env` is properly ignored:

```bash
# Check .gitignore
cat .gitignore | grep .env

# Should show:
# .env*
# !.env.example
```

### 3. Install Security Tools

```bash
# Install Husky for git hooks
npm install

# Make pre-commit hook executable
chmod +x .husky/pre-commit
chmod +x .husky/_/husky.sh

# Initialize Husky
npx husky install
```

### 4. Test Security Scanner

```bash
# Run manual secret scan
npm run security:check

# Should show: ✅ No secrets detected in codebase
```

### 5. Test Pre-commit Hook

```bash
# Try to commit .env (should be blocked)
git add .env
git commit -m "test"

# Should show: ❌ ERROR: .env file in staged changes!
```

## 🔐 Security Features Implemented

### 1. Environment Variable Validation

**File:** `lib/env-validation.ts`

Validates that all required environment variables are present at startup:

```typescript
import { validateEnvironmentOrThrow } from '@/lib/env-validation';

// In your app startup
validateEnvironmentOrThrow();
```

### 2. Security Middleware

**File:** `lib/security-middleware.ts`

Provides security layers for API routes:

```typescript
import { withSecurity } from '@/lib/security-middleware';

export const GET = withSecurity(
  async (request) => {
    // Your handler code
  },
  {
    rateLimit: { windowMs: 60000, maxRequests: 100 },
    requireHttps: true,
  }
);
```

**Features:**
- Rate limiting (100 requests per minute default)
- CORS protection
- Security headers (X-Frame-Options, CSP, etc.)
- Request validation
- Admin authentication

### 3. Pre-commit Hooks

**File:** `.husky/pre-commit`

Prevents committing secrets:
- Scans staged files for API keys
- Blocks commits with `.env` files
- Checks for common secret patterns

### 4. Secret Scanner

**File:** `scripts/check-secrets.js`

Manual security scanning:

```bash
# Run security scan
npm run security:check
```

Detects:
- Resend API keys (`re_...`)
- Stripe keys (`sk_...`, `pk_...`)
- Admin keys
- Passwords
- Generic API keys and secrets

### 5. GitHub Actions

**File:** `.github/workflows/security.yml`

Automated security checks:
- Secret scanning with GitLeaks
- Dependency vulnerability audit
- Environment variable checks
- Security header verification
- License compliance

### 6. Enhanced .gitignore

Blocks sensitive files:
```
.env*
!.env.example
**/credentials.json
**/service-account*.json
**/*.pem
**/*.key
**/secrets.json
```

## 🎯 Security Checklist

### Daily Development
- [ ] Never hardcode secrets in code
- [ ] Always use environment variables
- [ ] Keep `.env` file local only
- [ ] Don't share secrets in chat/email

### Before Every Commit
- [ ] Run `npm run security:check`
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] `.env` is not staged

### Before Deployment
- [ ] All secrets in Vercel dashboard
- [ ] Using test keys for staging
- [ ] Production keys for production only
- [ ] Admin key is strong (32+ chars)
- [ ] CORS configured correctly
- [ ] HTTPS enforced

### Monthly Maintenance
- [ ] Rotate development keys
- [ ] Review access logs
- [ ] Run `npm audit`
- [ ] Update dependencies
- [ ] Check for exposed secrets on GitHub

### Quarterly Review
- [ ] Rotate production keys
- [ ] Security audit
- [ ] Review team access
- [ ] Update security documentation
- [ ] Compliance check

## 🚀 Production Deployment

### Vercel Setup

1. **Add environment variables in Vercel dashboard:**

```bash
# Or use Vercel CLI
vercel env add DATABASE_URL
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add RESEND_API_KEY
vercel env add ADMIN_KEY
```

2. **Configure environment per deployment:**
   - **Development**: Test keys, development database
   - **Preview**: Test keys, preview database
   - **Production**: Live keys, production database

3. **Never commit production keys to git**

### Environment-Specific Configuration

**Development:**
```bash
STRIPE_SECRET_KEY="sk_test_..."  # Test mode
DATABASE_URL="postgresql://localhost:5432/plushie_dev"
NEXT_PUBLIC_BASE_URL="http://localhost:3002"
```

**Production:**
```bash
STRIPE_SECRET_KEY="sk_live_..."  # Live mode (in Vercel only!)
DATABASE_URL="postgresql://production-host/plushie_prod"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

## 📚 Additional Resources

- [SECURITY.md](../SECURITY.md) - Full security policy
- [Vercel Security](https://vercel.com/docs/security)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Stripe Security](https://stripe.com/docs/security)

## 🆘 Need Help?

If you discover a security vulnerability:
1. **Do not** open a public issue
2. Revoke any exposed credentials immediately
3. Contact the security team
4. Follow incident response in [SECURITY.md](../SECURITY.md)

---

**Last Updated:** February 3, 2026
