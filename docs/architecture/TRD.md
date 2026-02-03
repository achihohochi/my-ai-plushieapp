# Technical Requirements Document (TRD)

**Product:** AI Plushie E-commerce Platform
**Version:** 1.0 (MVP)
**Last Updated:** February 2, 2026
**Status:** Draft

---

## 1. Executive Summary

This Technical Requirements Document (TRD) defines the technical specifications, architecture, and implementation requirements for the AI Plushie e-commerce platform. It serves as the blueprint for developers to build the system.

**Key Technologies:**
- **Frontend:** Next.js 15+, React 19, TypeScript
- **Backend:** Next.js API Routes (serverless)
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Auth.js)
- **Payments:** Stripe API
- **Hosting:** Vercel
- **Images:** Next.js Image component + `/public` folder

---

## 2. System Architecture Overview

### 2.1 Architecture Pattern

**Pattern:** Monolithic Next.js application with API routes (serverless backend)

```
┌─────────────────────────────────────────────────────┐
│                    VERCEL EDGE                      │
│              (Global CDN + Edge Functions)          │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              NEXT.JS APPLICATION                    │
│  ┌────────────────┐         ┌──────────────────┐   │
│  │   Frontend     │◄───────►│  API Routes      │   │
│  │   (React)      │         │  (Serverless)    │   │
│  │                │         │                  │   │
│  │ • Pages        │         │ • /api/products  │   │
│  │ • Components   │         │ • /api/cart      │   │
│  │ • State        │         │ • /api/checkout  │   │
│  └────────────────┘         └──────────────────┘   │
│         │                            │              │
│         │                            │              │
│         ▼                            ▼              │
│  ┌────────────────┐         ┌──────────────────┐   │
│  │  Client State  │         │   Prisma ORM     │   │
│  │  (React Query) │         │   (Type-safe)    │   │
│  └────────────────┘         └──────────────────┘   │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │     PostgreSQL Database           │
         │     (Vercel Postgres or Supabase) │
         └───────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Stripe API     │
                │  (Payments)     │
                └─────────────────┘

Note: Product images served from /public folder via Next.js
```

---

## 3. Technology Stack Details

### 3.1 Frontend

**Framework:** Next.js 15+ (App Router)
- **Why:** Server-side rendering, excellent performance, React 19 support
- **Routing:** File-based routing (`app/` directory)
- **Data Fetching:** Server Components + React Query for client state

**UI Library:** React 19
- **Why:** Latest features (Server Components, Actions), industry standard
- **State Management:** React Context (cart), React Query (server data)

**Styling:** Tailwind CSS 4
- **Why:** Utility-first, fast development, small bundle size
- **Component Library:** shadcn/ui (accessible, customizable)

**Language:** TypeScript (Strict Mode)
- **Why:** Type safety, better IDE support, catches errors at compile time
- **Config:** `"strict": true` in tsconfig.json

**Icons:** Lucide React
- **Why:** Modern, lightweight, tree-shakeable

---

### 3.2 Backend

**Runtime:** Node.js 18+
- **Why:** LTS version, stable, great ecosystem

**Framework:** Next.js API Routes
- **Why:** Collocated with frontend, serverless by default, easy deployment
- **Pattern:** RESTful API

**API Routes Structure:**
```
/api
├── products
│   ├── route.ts              (GET all products)
│   └── [id]
│       └── route.ts          (GET single product)
├── cart
│   ├── route.ts              (GET cart, POST add item)
│   └── [itemId]
│       └── route.ts          (PUT update, DELETE remove)
├── checkout
│   ├── stripe/route.ts       (POST create payment intent)
│   ├── venmo/route.ts        (POST submit Venmo transaction)
│   └── confirm/route.ts      (POST confirm order)
├── auth
│   └── [...nextauth]
│       └── route.ts          (NextAuth handlers)
└── admin
    ├── orders/route.ts       (GET orders, PUT update status)
    └── inventory/route.ts    (POST sync from Google Sheets)
```

---

### 3.3 Database

**Database:** PostgreSQL 15+
- **Why:** ACID compliance (critical for payments), relational data fits e-commerce
- **Hosting Options:**
  - Vercel Postgres (recommended for MVP - easy integration)
  - Supabase (more features, good alternative)
  - AWS RDS (production scale)

**ORM:** Prisma 5+
- **Why:** Type-safe queries, migrations, excellent DX
- **Features:** Auto-complete, type checking, connection pooling

**Connection Pooling:** PgBouncer (via Prisma)
- **Why:** Serverless functions need efficient connections
- **Config:** `?pgbouncer=true` in connection string

---

### 3.4 Authentication

**Library:** NextAuth.js (Auth.js) v5
- **Why:** Next.js-native, supports multiple providers, secure by default
- **Strategy:** JWT tokens (stateless, scales well)

**Providers:**
- Email/Password (Credentials provider)
- OAuth (future: Google, Apple)

**Session Management:**
- **Token Type:** JWT (JSON Web Token)
- **Storage:** HTTP-only cookies (prevents XSS)
- **Expiration:** 1 hour (refresh on activity)
- **"Remember Me":** 30-day expiration

---

### 3.5 Payment Processing

**Provider:** Stripe
- **SDK:** @stripe/stripe-js (client), stripe (server)
- **Integration:** Stripe Checkout + Payment Intents API
- **Test Mode:** Yes (toggle via env var)

**Venmo Integration:**
- **Method:** QR code generation
- **Verification:** Manual admin approval (MVP)
- **Library:** qrcode.js for QR generation

---

### 3.6 File Storage & CDN

**Image Storage (MVP):** `/public` folder
- **Why:** Zero setup, no external dependencies, perfect for MVP
- **Component:** Next.js Image component (built-in optimization)
- **Features:** Lazy loading, responsive images, automatic sizing
- **Location:** Product images in `/public/*.jpg`
- **Future:** Can migrate to Cloudinary or Vercel Blob post-MVP if CDN needed

**Static Assets:** Vercel CDN
- **Why:** Automatic, globally distributed, fast
- **Assets:** JS, CSS, fonts, images

---

### 3.7 Email Service

**Provider:** Resend (recommended) or SendGrid
- **Why Resend:** Modern API, React Email templates, generous free tier
- **Use Cases:** Order confirmations, password resets, shipping notifications

**Template Engine:** React Email
- **Why:** Write email templates in React (JSX)
- **Preview:** Local development preview

---

## 4. Database Schema

### 4.1 Tables

**Users**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**Products**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_status ON products(status);
```

**Orders**
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

**Order Items**
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

**Cart Items** (for logged-in users)
```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
```

**Addresses** (saved addresses for users)
```sql
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  street_address VARCHAR(500) NOT NULL,
  apt_suite VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'United States',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
```

---

## 5. API Specifications

### 5.1 Products API

**GET /api/products**
- **Description:** Get all active products
- **Query Params:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 20)
  - `sort` (optional): `price_asc`, `price_desc`, `newest`
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
- **Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "AI Robot Plushie",
      "description": "Cute metallic robot...",
      "price": 24.99,
      "stock_quantity": 10,
      "image_url": "https://cloudinary.com/...",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

**GET /api/products/[id]**
- **Description:** Get single product by ID
- **Response:**
```json
{
  "id": 1,
  "name": "AI Robot Plushie",
  "description": "Cute metallic robot...",
  "price": 24.99,
  "stock_quantity": 10,
  "image_url": "https://cloudinary.com/...",
  "dimensions": "12 inches tall",
  "material": "Plush polyester",
  "status": "active"
}
```

---

### 5.2 Cart API

**GET /api/cart**
- **Description:** Get cart items for logged-in user
- **Auth:** Required
- **Response:**
```json
{
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "AI Robot",
      "product_price": 24.99,
      "quantity": 2,
      "subtotal": 49.98
    }
  ],
  "subtotal": 49.98,
  "shipping": 5.99,
  "total": 55.97
}
```

**POST /api/cart**
- **Description:** Add item to cart
- **Auth:** Optional (guest cart in localStorage, user cart in DB)
- **Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```
- **Response:**
```json
{
  "success": true,
  "cart": { ... }
}
```

---

### 5.3 Checkout API

**POST /api/checkout/stripe**
- **Description:** Create Stripe payment intent
- **Body:**
```json
{
  "items": [{"product_id": 1, "quantity": 2}],
  "shipping_address": {
    "name": "Test User",
    "street_address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94102"
  }
}
```
- **Response:**
```json
{
  "client_secret": "pi_xxx_secret_yyy",
  "order_id": "PLU-20260202-12345"
}
```

**POST /api/checkout/confirm**
- **Description:** Confirm order after successful payment
- **Body:**
```json
{
  "payment_intent_id": "pi_xxx",
  "order_id": "PLU-20260202-12345"
}
```
- **Response:**
```json
{
  "success": true,
  "order": { ... }
}
```

---

## 6. Security Requirements

### 6.1 Authentication & Authorization

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- Hashed with bcrypt (10 rounds)

**JWT Tokens:**
- Algorithm: HS256
- Expiration: 1 hour (default), 30 days (remember me)
- Stored in: HTTP-only cookies
- Includes: user_id, email, role

**API Authorization:**
- Public: Products, product details
- User: Cart, orders, profile
- Admin: Admin dashboard, inventory management

---

### 6.2 Input Validation

**Library:** Zod (TypeScript-first schema validation)

**Example:**
```typescript
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  address: z.string().min(5),
  zip_code: z.string().regex(/^\d{5}$/),
});
```

**Validation Points:**
- Client-side (immediate feedback)
- Server-side (security, never trust client)

---

### 6.3 Security Headers

**Next.js Config:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
        ],
      },
    ];
  },
};
```

---

## 7. Performance Requirements

### 7.1 Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| **API Response Time** | < 200ms (p95) | 500ms |
| **Page Load (LCP)** | < 2.5s | 4.0s |
| **Database Query** | < 50ms (p95) | 100ms |
| **Image Load** | < 1s | 2s |

---

### 7.2 Optimization Strategies

**Code Splitting:**
- Automatic route-based splitting (Next.js default)
- Dynamic imports for heavy components

**Image Optimization:**
- Next.js Image component (automatic WebP, lazy loading, responsive sizing)
- Images served from `/public` folder via Vercel CDN

**Caching:**
- Static pages: ISR (Incremental Static Regeneration)
- API responses: 5-minute cache (stale-while-revalidate)
- CDN: Vercel Edge caching

**Database:**
- Connection pooling (Prisma + PgBouncer)
- Indexed queries
- Select only needed fields

---

## 8. Deployment Architecture

### 8.1 Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| **Development** | localhost:3002 | - | Local development |
| **Staging** | staging.vercel.app | develop | Pre-production testing |
| **Production** | myaiplushieshop.com | main | Live site |

---

### 8.2 CI/CD Pipeline

**GitHub Actions:**
1. **Lint & Type Check** (2 min)
2. **Unit Tests** (3 min)
3. **Build Check** (4 min)
4. **E2E Tests** (10 min)
5. **Deploy to Vercel** (2 min)

**Total:** ~20 minutes per deployment

**Automatic Deployments:**
- `main` branch → Production
- `develop` branch → Staging
- Feature branches → Preview deployments

---

## 9. Monitoring & Logging

### 9.1 Application Monitoring

**Tool:** Vercel Analytics (built-in)
- Real user monitoring (RUM)
- Core Web Vitals
- Error tracking

**Logs:**
- Vercel function logs (serverless)
- Database logs (Vercel Postgres dashboard)

**Alerts:**
- Email on critical errors
- Slack notification on deployment failures

---

## 10. Error Handling

### 10.1 Client-Side

**Strategy:** Try-catch with user-friendly messages

```typescript
try {
  await addToCart(productId);
  toast.success('Added to cart!');
} catch (error) {
  toast.error('Oops! Something went wrong. Please try again.');
  console.error(error); // Log for debugging
}
```

---

### 10.2 Server-Side

**Strategy:** Standardized error responses

```typescript
// app/api/products/route.ts
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

---

## 11. Third-Party Integrations

### 11.1 Google Sheets API (Inventory Sync)

**Setup:**
- Create service account
- Share sheet with service account email
- Use `googleapis` npm package

**Sync Frequency:** Every 5 minutes (cron job via Vercel Cron)

**Error Handling:** Email admin on sync failure

---

### 11.2 Stripe Webhooks

**Endpoint:** `/api/webhooks/stripe`

**Events:**
- `payment_intent.succeeded` → Create order
- `payment_intent.payment_failed` → Notify customer

**Security:** Verify webhook signature

---

## 12. Development Environment Setup

### 12.1 Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Git
- Code editor (VS Code recommended)

### 12.2 Setup Steps

```bash
# Clone repo
git clone https://github.com/username/my-ai-plushieapp.git
cd my-ai-plushieapp

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

---

## 13. Environment Variables

**.env.local:**
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/plushie_dev"

# NextAuth
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Email
RESEND_API_KEY="re_xxx"

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL="xxx@xxx.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxx\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="xxx"
```

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Initial TRD |

**Related Documents:**
- [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md) - Detailed tech choices
- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) - Architecture diagrams
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Full schema details
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - Complete API reference
- [SECURITY.md](../security/SECURITY.md) - Security requirements

---

**End of Technical Requirements Document**
