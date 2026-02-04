# 🔒 SECURITY POLICY

## 🚨 CRITICAL: API Keys Exposed in Git History

**This repository previously committed sensitive API keys to GitHub.** 

### Immediate Actions Required

1. **Revoke ALL exposed keys immediately:**
   - ✅ RESEND API Key: Go to https://resend.com/api-keys and delete/revoke the exposed key
   - ✅ Stripe Test Keys: Go to https://dashboard.stripe.com/test/apikeys and roll/regenerate keys
   - ✅ Admin Key: Generate a new secure key (see below)

2. **Generate new credentials:**
   ```bash
   # Generate new admin key
   openssl rand -base64 32
   
   # Update your .env file with NEW keys only
   ```

3. **Clean git history** (ADVANCED - optional but recommended):
   ```bash
   # Use BFG Repo-Cleaner to remove sensitive data from history
   # Download from: https://rtyley.github.io/bfg-repo-cleaner/
   
   bfg --replace-text passwords.txt my-ai-plushieapp.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

## 🛡️ Security Measures Implemented

### 1. Enhanced .gitignore
- All `.env*` files blocked (except `.env.example`)
- Credential files blocked (JSON, PEM, KEY files)
- Local config files blocked
- Vercel deployment configs protected

### 2. Environment Variable Validation
- Runtime validation ensures all required secrets are present
- Application fails fast if secrets are missing
- Clear error messages for missing configuration

### 3. API Key Rotation Policy
- **Development keys**: Rotate monthly
- **Production keys**: Rotate quarterly
- **Compromised keys**: Rotate immediately

### 4. Secret Management Best Practices

#### Local Development
```bash
# Never commit .env file
# Keep secrets in .env (gitignored)
# Use .env.example as template
cp .env.example .env
# Then add your real keys to .env
```

#### Production Deployment (Vercel)
```bash
# Use Vercel dashboard or CLI for secrets
vercel env add RESEND_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add ADMIN_KEY
```

#### CI/CD Pipelines
- Use GitHub Secrets for CI/CD
- Never echo secrets in logs
- Use masked variables

### 5. API Key Protection Layers

#### Layer 1: Environment Variables
- All secrets in environment variables
- Never hardcode in source code
- Use process.env for access

#### Layer 2: Runtime Validation
```typescript
// All API routes validate keys exist at startup
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY not configured');
}
```

#### Layer 3: Rate Limiting
- API routes have rate limiting
- Prevents brute force attacks
- Protects against abuse

#### Layer 4: CORS Protection
- API routes restricted to same origin
- Prevents unauthorized domains
- Configurable for production

#### Layer 5: API Key Scoping
- Use test keys in development
- Separate keys per environment
- Minimal permissions per key

## 🔐 Security Checklist

### Before Every Commit
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No secrets in comments
- [ ] .env is gitignored
- [ ] Only .env.example committed

### Before Deployment
- [ ] All secrets in Vercel dashboard
- [ ] Test keys for staging
- [ ] Production keys for prod
- [ ] Admin key is strong (32+ chars)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled

### Monthly Review
- [ ] Rotate development keys
- [ ] Review access logs
- [ ] Check for exposed secrets
- [ ] Update dependencies
- [ ] Security audit

### Quarterly Review
- [ ] Rotate production keys
- [ ] Security penetration test
- [ ] Review team access
- [ ] Update security docs
- [ ] Compliance check

## 🚫 What NEVER to Commit

```bash
# NEVER commit these files
.env
.env.local
.env.production
credentials.json
service-account.json
*.pem
*.key
secrets.json

# NEVER commit API keys
RESEND_API_KEY=re_xxx
STRIPE_SECRET_KEY=sk_xxx
ADMIN_KEY=xxx

# NEVER commit passwords
DATABASE_URL=postgresql://user:password@host/db
```

## ✅ What IS Safe to Commit

```bash
# Safe to commit
.env.example          # Template without real values
public/*              # Public assets
NEXT_PUBLIC_*         # Public environment variables (non-sensitive)
```

## 🔍 How to Check for Exposed Secrets

### Before Committing
```bash
# Check what you're about to commit
git diff --cached

# Search for common secret patterns
git diff --cached | grep -i "api_key\|secret\|password\|token"

# Use git-secrets tool (recommended)
git secrets --scan
```

### After Committing (Undo)
```bash
# If you accidentally committed secrets
git reset HEAD~1           # Undo last commit
git checkout -- .env       # Restore .env
# Then revoke the exposed keys immediately!
```

## 📞 Security Incident Response

### If Keys Are Exposed
1. **Immediately revoke** all exposed keys
2. **Generate new keys** in service dashboards
3. **Update .env** with new keys locally
4. **Update Vercel** with new keys for production
5. **Monitor logs** for unauthorized usage
6. **Consider git history cleanup** (advanced)

### If Breach Suspected
1. Revoke ALL API keys immediately
2. Check service dashboards for unusual activity
3. Review application logs
4. Contact service providers (Stripe, Resend)
5. Generate new keys after investigation

## 🎯 Security Goals

- ✅ Zero secrets in git history
- ✅ All secrets in environment variables
- ✅ Runtime validation of required secrets
- ✅ Regular key rotation policy
- ✅ Clear security documentation
- ✅ Automated security scanning
- ✅ Team security training

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security Best Practices](https://vercel.com/docs/security)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Stripe Security](https://stripe.com/docs/security/stripe)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## 🆘 Support

For security concerns, contact:
- **Developer:** [Your Contact]
- **Security Team:** [Security Email]
- **Emergency:** [Emergency Contact]

---

**Last Updated:** February 3, 2026  
**Next Review:** March 3, 2026
