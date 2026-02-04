# Stripe Payment Integration Setup Guide

**Date:** February 3, 2026
**Phase:** Phase 6 - Stripe Integration
**Estimated Setup Time:** 15-20 minutes

---

## 📋 Overview

This guide walks you through setting up Stripe payment processing for the AI Plushie e-commerce app. By the end, you'll have:

- ✅ Stripe test account configured
- ✅ API keys added to your environment
- ✅ Webhooks configured for order processing
- ✅ Test payments working in development

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Sign up for Stripe (if you don't have an account)
# Visit: https://dashboard.stripe.com/register

# 2. Get your test API keys
# Visit: https://dashboard.stripe.com/test/apikeys

# 3. Add keys to .env file
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# 4. Install Stripe CLI and set up webhooks
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3002/api/webhooks/stripe

# 5. Add webhook secret to .env
STRIPE_WEBHOOK_SECRET="whsec_..."

# 6. Test the integration
npm run dev -- --port 3002
# Visit: http://localhost:3002/shop
# Add items, checkout, use test card: 4242 4242 4242 4242
```

---

## 📝 Step-by-Step Setup

### Step 1: Create Stripe Account

1. **Visit Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/register
   - Sign up with your email

2. **Skip Onboarding (for now)**
   - You can skip business details for testing
   - Make sure you're in **Test Mode** (toggle in top-right corner)

---

### Step 2: Get Your API Keys

1. **Navigate to API Keys**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Or: Dashboard → Developers → API keys

2. **Copy Your Keys**
   - **Publishable key:** Starts with `pk_test_...`
   - **Secret key:** Click "Reveal test key" → Starts with `sk_test_...`

3. **Add to `.env` File**
   ```bash
   STRIPE_SECRET_KEY="sk_test_51abc123..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51abc123..."
   ```

   **IMPORTANT:**
   - ❌ **NEVER commit these keys to git**
   - ✅ Use test keys (sk_test_...) for development
   - ✅ Keep production keys (sk_live_...) in secure environment variables only

---

### Step 3: Install Stripe CLI

The Stripe CLI allows you to test webhooks locally.

**macOS (Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows (Scoop):**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux:**
```bash
# Download from: https://github.com/stripe/stripe-cli/releases/latest
wget https://github.com/stripe/stripe-cli/releases/download/vX.X.X/stripe_X.X.X_linux_x86_64.tar.gz
tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

**Verify Installation:**
```bash
stripe --version
```

---

### Step 4: Authenticate Stripe CLI

```bash
stripe login
```

- This will open your browser
- Click "Allow access" to pair the CLI with your Stripe account
- You should see: "Done! The Stripe CLI is configured for [your account]"

---

### Step 5: Set Up Webhook Forwarding

Webhooks allow Stripe to notify your app when payments succeed or fail.

1. **Start Webhook Listener**
   ```bash
   stripe listen --forward-to localhost:3002/api/webhooks/stripe
   ```

2. **Copy Webhook Signing Secret**
   - You'll see output like:
     ```
     > Ready! Your webhook signing secret is whsec_abc123...
     ```
   - Copy the `whsec_...` value

3. **Add to `.env` File**
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_abc123..."
   ```

4. **Keep the Terminal Open**
   - The webhook listener must run while testing
   - Open a new terminal tab for running `npm run dev`

---

### Step 6: Configure Base URL

The base URL is used for Stripe redirects after payment.

**Development (.env):**
```bash
NEXT_PUBLIC_BASE_URL="http://localhost:3002"
```

**Production (.env.production):**
```bash
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
```

---

### Step 7: Start Development Server

```bash
npm run dev -- --port 3002
```

Visit: http://localhost:3002

---

## 🧪 Testing the Integration

### Test Card Numbers

Stripe provides test card numbers for different scenarios:

| Card Number          | Scenario                     |
|---------------------|------------------------------|
| `4242 4242 4242 4242` | **Success** (use this!)     |
| `4000 0025 0000 3155` | 3D Secure authentication    |
| `4000 0000 0000 9995` | Declined (insufficient funds)|
| `4000 0000 0000 0069` | Expired card                |

**Other Test Details:**
- **Expiration:** Any future date (e.g., 12/25)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

### Test Payment Flow

1. **Add Items to Cart**
   - Visit: http://localhost:3002/shop
   - Click "Add to Cart" on any plushie

2. **Go to Checkout**
   - Click cart icon → View Cart
   - Click "Proceed to Checkout"

3. **Fill Shipping Info**
   - Email: test@example.com
   - Name: Test User
   - Address: 123 Main St, San Francisco, CA, 94102

4. **Click "Continue to Payment"**
   - You'll be redirected to Stripe Checkout

5. **Enter Test Card**
   - Card: `4242 4242 4242 4242`
   - Expiration: `12/25`
   - CVC: `123`
   - ZIP: `12345`

6. **Complete Payment**
   - Click "Pay"
   - You'll be redirected to success page

7. **Verify in Database**
   ```bash
   psql -U chiho -d plushie_app -c "SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;"
   ```

   You should see:
   - `payment_method: 'stripe'`
   - `payment_status: 'paid'`
   - `payment_intent_id: 'pi_...'`

8. **Check Webhook Terminal**
   - Your `stripe listen` terminal should show:
     ```
     [200] POST /api/webhooks/stripe [evt_abc123]
     ```

---

## 🔍 Monitoring Payments

### Stripe Dashboard

View all test payments:
- https://dashboard.stripe.com/test/payments

### Webhook Events

View webhook delivery attempts:
- https://dashboard.stripe.com/test/webhooks

### Local Logs

Check your terminal running `npm run dev` for:
- Order creation logs
- Inventory updates
- Cart clearing

---

## 🐛 Troubleshooting

### Problem: "STRIPE_SECRET_KEY is not set"

**Solution:**
1. Check `.env` file has `STRIPE_SECRET_KEY="sk_test_..."`
2. Restart dev server: `npm run dev -- --port 3002`
3. Environment variables are loaded on server start

### Problem: "Invalid signature" in webhook

**Solution:**
1. Make sure `STRIPE_WEBHOOK_SECRET` matches `stripe listen` output
2. Restart `stripe listen` if it was stopped
3. Check `.env` has correct `whsec_...` value

### Problem: Payment succeeds but order not created

**Solution:**
1. Check webhook terminal - is event received?
2. Check dev server logs - any errors?
3. Verify product names match between Stripe and database
4. Check database connection is working

### Problem: Redirect fails after payment

**Solution:**
1. Verify `NEXT_PUBLIC_BASE_URL` in `.env` matches your dev server
2. Should be `http://localhost:3002` (no trailing slash)
3. Restart dev server after changing environment variables

### Problem: Can't find products after webhook

**Solution:**
The webhook matches products by name. Ensure:
1. Product names in Stripe match database exactly
2. Run seed script if products are missing:
   ```bash
   npx prisma db seed
   ```

---

## 🚀 Production Deployment

### Production Webhook Setup

1. **Create Production Webhook**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events to send: Select "checkout.session.completed" and "payment_intent.payment_failed"

2. **Get Webhook Signing Secret**
   - After creating endpoint, click "Reveal signing secret"
   - Add to Vercel environment variables (not .env file!)

3. **Add Production Keys to Vercel**
   ```bash
   # In Vercel dashboard → Settings → Environment Variables
   STRIPE_SECRET_KEY=sk_live_...  # LIVE key, not test!
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...  # From production webhook
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   ```

4. **Test Production Webhooks**
   - Use "Send test webhook" button in Stripe dashboard
   - Verify events appear in your app logs

### Security Checklist

Before going live:

- [ ] Using live keys (sk_live_..., pk_live_...) in production only
- [ ] Test keys (sk_test_...) only in development
- [ ] No keys committed to git (check `.gitignore` includes `.env`)
- [ ] Webhook signature verification working (check logs)
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] Error handling for failed payments
- [ ] Stock validation before charging customers

---

## 📊 Key Files Created

### Backend Files
- `lib/stripe.ts` - Stripe client initialization
- `app/api/create-checkout-session/route.ts` - Creates Stripe checkout session
- `app/api/webhooks/stripe/route.ts` - Handles payment webhooks

### Frontend Files
- `app/checkout/page.tsx` - Updated to use Stripe Checkout
- `app/checkout/success/page.tsx` - Payment success page
- `app/checkout/cancel/page.tsx` - Payment cancelled page

### Configuration
- `.env` - Environment variables (not committed to git)
- `docs/STRIPE_SETUP.md` - This setup guide

---

## 🔗 Useful Links

- **Stripe Dashboard:** https://dashboard.stripe.com
- **API Keys:** https://dashboard.stripe.com/test/apikeys
- **Webhooks:** https://dashboard.stripe.com/test/webhooks
- **Test Cards:** https://stripe.com/docs/testing
- **Stripe CLI:** https://stripe.com/docs/stripe-cli
- **Checkout Docs:** https://stripe.com/docs/payments/checkout
- **Webhook Docs:** https://stripe.com/docs/webhooks

---

## 📞 Support

**Stripe Support:**
- Documentation: https://stripe.com/docs
- Community: https://stripe.com/community
- Email: support@stripe.com

**App Issues:**
- Check server logs for errors
- Verify all environment variables are set
- Test with Stripe test cards first
- Review webhook event logs in Stripe dashboard

---

**Setup Complete! 🎉**

You now have a fully functional Stripe payment integration. Test thoroughly before going live!
