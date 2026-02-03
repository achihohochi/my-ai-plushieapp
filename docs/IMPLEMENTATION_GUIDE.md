# Implementation Guide - Comprehensive Reference

**Product:** AI Plushie E-commerce Platform
**Purpose:** Consolidated implementation guide covering security, payments, operations, admin, and development
**Last Updated:** February 2, 2026
**Status:** Draft

---

## Document Purpose

This consolidated guide provides essential implementation details for remaining system components. It covers security protocols, payment integration, operations procedures, admin features, and development skills needed to build the platform.

---

# PART 1: SECURITY IMPLEMENTATION

## 1. Threat Model & Mitigation

### Critical Threats

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|------------|------------|
| **SQL Injection** | High | Medium | Prisma ORM (parameterized queries), input validation |
| **XSS (Cross-Site Scripting)** | High | Medium | React auto-escaping, Content Security Policy |
| **CSRF** | Medium | Medium | SameSite cookies, CSRF tokens on forms |
| **Payment Card Theft** | Critical | Low | Stripe handles cards (never touch our servers) |
| **Session Hijacking** | High | Low | HTTP-only cookies, secure flag, short expiration |
| **Brute Force Login** | Medium | High | Rate limiting (5 attempts), account lockout (15 min) |
| **Data Breach** | Critical | Low | Encryption at rest/transit, minimal data collection |

### Security Implementation Checklist

**Authentication & Authorization:**
```typescript
// Password hashing (registration)
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds

// Password verification (login)
const isValid = await bcrypt.compare(password, user.password_hash);

// JWT token generation
import jwt from 'jsonwebtoken';
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.NEXTAUTH_SECRET,
  { expiresIn: '1h' }
);

// Middleware: Protect API routes
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  try {
    jwt.verify(token.value, process.env.NEXTAUTH_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

**Input Validation:**
```typescript
import { z } from 'zod';

// Email validation
const emailSchema = z.string().email();
emailSchema.parse(userInput); // Throws if invalid

// Checkout form validation
const checkoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  zip_code: z.string().regex(/^\d{5}$/),
});

// Server-side validation (ALWAYS required)
export async function POST(request: Request) {
  const body = await request.json();
  const result = checkoutSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: result.error }, { status: 400 });
  }
  // Process validated data
}
```

**Rate Limiting:**
```typescript
// Using Upstash Redis
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  // Process request
}
```

---

## 2. Data Protection & Privacy

### GDPR/CCPA Compliance

**User Rights Implementation:**
```typescript
// Data export (GDPR Article 15)
export async function GET(request: Request) {
  const userId = await getUserId(request);
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: true,
      addresses: true,
      cart_items: true,
    },
  });
  return NextResponse.json(userData); // User downloads their data
}

// Data deletion (GDPR Article 17, CCPA)
export async function DELETE(request: Request) {
  const userId = await getUserId(request);

  await prisma.$transaction([
    // Anonymize orders (keep for legal/tax purposes)
    prisma.order.updateMany({
      where: { user_id: userId },
      data: { email: 'deleted@example.com', user_id: null },
    }),
    // Delete personal data
    prisma.address.deleteMany({ where: { user_id: userId } }),
    prisma.cart_item.deleteMany({ where: { user_id: userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return NextResponse.json({ success: true });
}
```

**Privacy Policy Requirements:**
- What data we collect (email, name, address, payment info)
- Why we collect it (order fulfillment, customer support)
- Who we share with (Stripe for payments)
- How long we keep it (7 years for orders/tax, indefinite for anonymized)
- User rights (access, delete, opt-out)
- Contact: privacy@myaiplushieshop.com

---

# PART 2: PAYMENT INTEGRATION

## 3. Stripe Implementation

### Payment Flow

```typescript
// Step 1: Create payment intent (server-side)
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const { items, shipping_address } = await request.json();

  // Calculate total
  const total = calculateTotal(items);

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100), // Stripe uses cents
    currency: 'usd',
    metadata: {
      items: JSON.stringify(items),
      shipping: JSON.stringify(shipping_address),
    },
  });

  return NextResponse.json({ client_secret: paymentIntent.client_secret });
}

// Step 2: Confirm payment (client-side)
import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: 'Test User' },
  },
});

if (error) {
  // Show error to customer
  toast.error(error.message);
} else {
  // Payment succeeded
  router.push('/orders/confirmation');
}

// Step 3: Handle webhook (server-side)
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Create order in database
    await prisma.order.create({
      data: {
        order_number: generateOrderNumber(),
        email: paymentIntent.receipt_email,
        total: paymentIntent.amount / 100,
        payment_status: 'paid',
        // ... more fields
      },
    });

    // Send confirmation email
    await sendOrderConfirmation(order);
  }

  return NextResponse.json({ received: true });
}
```

### Venmo QR Code Payment

```typescript
import QRCode from 'qrcode';

export async function POST(request: Request) {
  const { order_id, total } = await request.json();

  // Generate Venmo payment link
  const venmoLink = `venmo://paycharge?txn=pay&recipients=@myplushieshop&amount=${total}&note=Order ${order_id}`;

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(venmoLink);

  return NextResponse.json({ qr_code: qrCodeDataUrl, order_id });
}

// Manual verification (admin reviews)
export async function PUT(request: Request) {
  const { order_id, venmo_transaction_id, verified } = await request.json();

  if (verified) {
    await prisma.order.update({
      where: { id: order_id },
      data: {
        payment_status: 'paid',
        payment_method: 'venmo',
        venmo_transaction_id,
      },
    });

    // Send confirmation email
    await sendOrderConfirmation(order);
  }

  return NextResponse.json({ success: true });
}
```

---

# PART 3: OPERATIONS

## 4. Monitoring & Alerts

### Error Tracking Setup (Sentry)

```typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
});

// Usage in API route
export async function POST(request: Request) {
  try {
    // Process request
  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: '/api/checkout' },
      user: { id: userId, email: userEmail },
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Uptime Monitoring

**Tool:** UptimeRobot
**Monitors:**
- Homepage: https://myaiplushieshop.com (every 5 minutes)
- API health: https://myaiplushieshop.com/api/health (every 5 minutes)

**Alerts:**
- Email + Slack if down > 3 minutes
- SMS for critical (main site down)

**Health Check Endpoint:**
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Stripe API
    await stripe.paymentIntents.list({ limit: 1 });

    return NextResponse.json({ status: 'healthy' });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy' }, { status: 500 });
  }
}
```

---

## 5. Backup & Recovery

### Database Backups

**Automatic (Vercel Postgres):**
- Daily backups (retained 7-30 days)
- Point-in-time recovery

**Manual Backups (weekly):**
```bash
# Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup-20260202.sql
```

### Code Backups

**Git (GitHub):**
- Every commit backed up
- Protected branches (main, develop)
- Require PR reviews before merge

### Environment Variables Backup

**1Password Vault:**
- Store all `.env` variables
- Export quarterly to encrypted file
- Document access: Only 2 team members have master password

---

# PART 4: ADMIN FEATURES

## 6. Inventory Management (Google Sheets Integration)

### Setup

```typescript
// lib/googleSheets.ts
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function syncInventory() {
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Products!A2:F', // Skip header row
  });

  const rows = response.data.values;

  for (const row of rows) {
    const [id, name, description, price, stock, image_url] = row;

    // Validate
    if (parseFloat(price) < 0 || parseInt(stock) < 0) {
      console.error(`Invalid data for product ${id}`);
      continue;
    }

    // Update database
    await prisma.product.upsert({
      where: { id: parseInt(id) },
      update: { name, description, price: parseFloat(price), stock_quantity: parseInt(stock), image_url },
      create: { id: parseInt(id), name, description, price: parseFloat(price), stock_quantity: parseInt(stock), image_url, status: 'active' },
    });
  }
}
```

### Cron Job (Vercel)

```javascript
// vercel.json
{
  "crons": [{
    "path": "/api/cron/sync-inventory",
    "schedule": "*/5 * * * *" // Every 5 minutes
  }]
}

// app/api/cron/sync-inventory/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await syncInventory();
  return NextResponse.json({ success: true });
}
```

---

## 7. Order Management (Admin Dashboard)

```typescript
// app/api/admin/orders/route.ts
export async function GET(request: Request) {
  // Check admin role
  const session = await getServerSession();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: { order_items: true },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ orders });
}

// Update order status
export async function PUT(request: Request) {
  const { order_id, status, tracking_number } = await request.json();

  const order = await prisma.order.update({
    where: { id: order_id },
    data: { status, tracking_number },
  });

  // Send email notification
  if (status === 'shipped') {
    await sendShippingNotification(order);
  }

  return NextResponse.json({ order });
}
```

---

# PART 5: DEVELOPMENT SKILLS & BEST PRACTICES

## 8. Database Design Patterns

### Prisma Schema Best Practices

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id              Int      @id @default(autoincrement())
  name            String   @db.VarChar(255)
  description     String?  @db.Text
  price           Decimal  @db.Decimal(10, 2)
  stock_quantity  Int      @default(0)
  image_url       String?  @db.VarChar(500)
  status          String   @default("active") @db.VarChar(50)
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  order_items     OrderItem[]
  cart_items      CartItem[]

  @@index([status])
  @@index([created_at])
}

model Order {
  id                Int       @id @default(autoincrement())
  order_number      String    @unique @db.VarChar(50)
  user_id           Int?
  email             String    @db.VarChar(255)
  status            String    @default("pending") @db.VarChar(50)
  payment_status    String    @default("pending") @db.VarChar(50)
  subtotal          Decimal   @db.Decimal(10, 2)
  shipping_cost     Decimal   @db.Decimal(10, 2)
  total             Decimal   @db.Decimal(10, 2)
  shipping_address  Json
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  user              User?     @relation(fields: [user_id], references: [id])
  order_items       OrderItem[]

  @@index([user_id])
  @@index([status])
  @@index([created_at(sort: Desc)])
}
```

### Common Query Patterns

```typescript
// Efficient pagination
const products = await prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
  where: { status: 'active' },
  orderBy: { created_at: 'desc' },
});

// Transaction (atomic operations)
await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.product.update({
    where: { id: productId },
    data: { stock_quantity: { decrement: quantity } },
  }),
]);

// Aggregation
const totalRevenue = await prisma.order.aggregate({
  where: { payment_status: 'paid' },
  _sum: { total: true },
});
```

---

## 9. API Development Best Practices

### RESTful API Design

```typescript
// GET /api/products - List all products
// GET /api/products/:id - Get single product
// POST /api/products - Create product (admin only)
// PUT /api/products/:id - Update product (admin only)
// DELETE /api/products/:id - Delete product (admin only)

// Standard response format
type ApiResponse<T> = {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

// Error handling middleware
export function withErrorHandling(handler: Function) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
```

---

## 10. Frontend Component Patterns

### Server Components (Default)

```typescript
// app/shop/page.tsx - Server Component
export default async function ShopPage() {
  // Fetch data on server (no loading state needed)
  const products = await prisma.product.findMany({
    where: { status: 'active' },
  });

  return (
    <div>
      <h1>Shop Plushies</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

### Client Components (Interactive)

```typescript
'use client';

import { useState } from 'react';

export function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: product.id, quantity }),
    });
    toast.success('Added to cart!');
  };

  return (
    <div>
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        min={1}
        max={product.stock_quantity}
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

---

## Quick Reference: Environment Variables

```bash
# .env.local (NEVER commit to git)
DATABASE_URL="postgresql://user:pass@localhost:5432/plushie_dev"
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
RESEND_API_KEY="re_..."
GOOGLE_SERVICE_ACCOUNT_EMAIL="...@....iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="..."
CRON_SECRET="generate-random-secret"
SENTRY_DSN="..."
```

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-02 | Planning Session | Consolidated implementation guide |

**Related Documents:**
- All phase-specific documents in `/docs` directory
- See `00_PROJECT_INDEX.md` for complete navigation

---

**End of Implementation Guide**
