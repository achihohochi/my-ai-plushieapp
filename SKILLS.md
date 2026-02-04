# Reusable E-commerce Patterns & Skills

**Domain:** E-commerce / Online Store Applications
**Tech Stack:** Next.js, PostgreSQL, Prisma, TypeScript, Stripe, Venmo, Resend
**Patterns:** Guest checkout, session-based cart, order management, dual payment methods
**Last Updated:** February 4, 2026
**Status:** ✅ Production-tested patterns from real implementation

---

## 📋 Table of Contents

1. [Database Schema Patterns](#database-schema-patterns)
2. [API Route Patterns](#api-route-patterns)
3. [Session Management](#session-management)
4. [Cart Persistence](#cart-persistence)
5. [Order Creation Workflow](#order-creation-workflow)
6. [Stripe Checkout (Hosted Page) Pattern](#stripe-checkout-hosted-page-pattern) ⭐ NEW
7. [Venmo QR Code Payment Pattern](#venmo-qr-code-payment-pattern) ⭐ NEW
8. [Resend Email Integration Pattern](#resend-email-integration-pattern) ⭐ NEW
9. [Dual Payment Method Pattern](#dual-payment-method-pattern) ⭐ NEW
10. [Inventory Management](#inventory-management)
11. [Tech Stack Setup](#tech-stack-setup)
12. [Common Utilities](#common-utilities)
13. [Google Sheets Integration](#google-sheets-integration)
14. [Admin Dashboard Patterns](#admin-dashboard-patterns)

---

## 🗄️ Database Schema Patterns

### Core E-commerce Tables

```sql
-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table (optional for guest checkout)
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,  -- CUID
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart items (session-based for guest checkout)
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),  -- NULL for guests
  session_id VARCHAR(50),  -- For guest users
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),  -- NULL for guests
  order_number VARCHAR(50) UNIQUE NOT NULL,

  -- Customer info (stored for guests)
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,

  -- Shipping address
  shipping_address_id INTEGER REFERENCES addresses(id),
  shipping_street VARCHAR(255) NOT NULL,
  shipping_city VARCHAR(255) NOT NULL,
  shipping_state VARCHAR(10) NOT NULL,
  shipping_zip VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(2) DEFAULT 'US',

  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Payment
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_intent_id VARCHAR(255),

  -- Order status
  order_status VARCHAR(50) DEFAULT 'processing',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items (line items)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL,  -- Price when ordered
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customer addresses (optional)
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(10) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  country VARCHAR(2) DEFAULT 'US',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inventory log (audit trail)
CREATE TABLE inventory_log (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  change_quantity INTEGER NOT NULL,  -- Positive or negative
  reason VARCHAR(100) NOT NULL,  -- 'sale', 'restock', 'adjustment'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Prisma Schema Pattern

```prisma
model Product {
  id              Int       @id @default(autoincrement())
  name            String
  description     String?   @db.Text
  price           Decimal   @db.Decimal(10, 2)
  image_url       String
  stock_quantity  Int       @default(0)
  status          String    @default("active")
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  order_items     OrderItem[]
  cart_items      CartItem[]
  inventory_logs  InventoryLog[]

  @@map("products")
}

model CartItem {
  id         Int      @id @default(autoincrement())
  user_id    String?  // Nullable for guest users
  session_id String?  // For guest checkout
  product_id Int
  quantity   Int      @default(1)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  user       User?    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  product    Product  @relation(fields: [product_id], references: [id])

  @@map("cart_items")
}
```

---

## 🔌 API Route Patterns

### 1. Product Listing API

```typescript
// GET /api/products
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### 2. Add to Cart API

```typescript
// POST /api/cart
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json();

    // Get or create session ID
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) {
      sessionId = randomUUID();
    }

    // Check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.stock_quantity < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { session_id: sessionId, product_id: productId },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: { session_id: sessionId, product_id: productId, quantity },
        include: { product: true },
      });
    }

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      data: cartItem,
    });

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
```

### 3. Checkout / Create Order API

```typescript
// POST /api/checkout
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Generate unique order number
function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, street, city, state, zip, items, totalPrice } = body;

    // Validation
    if (!email || !name || !items?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate stock and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product || product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product?.name}` },
          { status: 400 }
        );
      }

      subtotal += parseFloat(product.price.toString()) * item.quantity;
      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_time: product.price,
      });
    }

    const orderNumber = generateOrderNumber();

    // Create order (transaction)
    const order = await prisma.order.create({
      data: {
        order_number: orderNumber,
        customer_email: email,
        customer_name: name,
        shipping_street: street,
        shipping_city: city,
        shipping_state: state,
        shipping_zip: zip,
        subtotal,
        tax: 0,
        shipping_cost: 0,
        total: subtotal,
        payment_method: 'pending',
        payment_status: 'pending',
        order_status: 'processing',
        order_items: {
          create: orderItems,
        },
      },
    });

    // Update inventory
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock_quantity: { decrement: item.quantity } },
      });

      await prisma.inventoryLog.create({
        data: {
          product_id: item.id,
          change_quantity: -item.quantity,
          reason: 'sale',
          notes: `Order ${orderNumber}`,
        },
      });
    }

    // Clear cart
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    if (sessionId) {
      await prisma.cartItem.deleteMany({
        where: { session_id: sessionId },
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

---

## 🔐 Session Management

### Guest User Pattern

```typescript
// lib/session.ts
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function getOrCreateSession(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    sessionId = randomUUID();
  }

  return sessionId;
}

export function setSessionCookie(sessionId: string, response: NextResponse) {
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,  // Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
    sameSite: 'lax',  // CSRF protection
    maxAge: 60 * 60 * 24 * 30,  // 30 days
  });
}
```

---

## 🛒 Cart Persistence

### Client-Side Cart Context

```typescript
// components/cart-context.tsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  cartItemId?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => Promise<void>
  removeItem: (id: number) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  clearCart: () => void
  totalItems: number
  totalPrice: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load cart on mount
  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch('/api/cart')
        const data = await res.json()
        if (data.success) setItems(data.data)
      } catch (error) {
        console.error('Failed to load cart:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [])

  const addItem = async (product: Product) => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    })

    const data = await res.json()
    if (data.success) {
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id)
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        }
        return [...prev, data.data]
      })
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, loading }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
```

---

## 📦 Order Creation Workflow

### Complete Order Flow

```typescript
async function createOrder(orderData) {
  // 1. Validate input
  validateOrderInput(orderData)

  // 2. Check stock availability for all items
  for (const item of orderData.items) {
    const product = await checkStock(item.productId, item.quantity)
    if (!product) throw new Error('Out of stock')
  }

  // 3. Generate unique order number
  const orderNumber = generateOrderNumber()

  // 4. Create order with items (use transaction)
  const order = await prisma.order.create({
    data: {
      order_number: orderNumber,
      // ... customer info
      order_items: {
        create: orderItems,
      },
    },
  })

  // 5. Update product inventory
  for (const item of orderData.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock_quantity: { decrement: item.quantity } },
    })
  }

  // 6. Create inventory log entries
  for (const item of orderData.items) {
    await prisma.inventoryLog.create({
      data: {
        product_id: item.productId,
        change_quantity: -item.quantity,
        reason: 'sale',
        notes: `Order ${orderNumber}`,
      },
    })
  }

  // 7. Clear customer's cart
  await clearCart(sessionId)

  // 8. Return order details
  return order
}
```

---

## 💳 Stripe Checkout (Hosted Page) Pattern

### Why Use Stripe Checkout

**Benefits:**
- Zero PCI compliance burden (Stripe handles all card data)
- Pre-built, mobile-optimized payment page
- Built-in Apple Pay, Google Pay support
- Automatic SCA (Strong Customer Authentication) handling
- No frontend payment form needed

### Implementation Files

```
lib/stripe.ts                          # Stripe client
app/api/create-checkout-session/       # Create session
  └── route.ts
app/api/webhooks/stripe/               # Handle webhooks
  └── route.ts
app/checkout/success/page.tsx          # Success redirect
app/checkout/cancel/page.tsx           # Cancel redirect
```

### Step 1: Initialize Stripe Client

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',  // Use latest API version
});
```

### Step 2: Create Checkout Session

```typescript
// app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, name, street, city, state, zip } = await request.json();

    // Get cart from session
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No cart found' },
        { status: 400 }
      );
    }

    // Fetch cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { session_id: sessionId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${item.product.name}` },
          { status: 400 }
        );
      }
    }

    // Create Stripe line items
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
          images: item.product.image_url ? [item.product.image_url] : undefined,
        },
        unit_amount: Math.round(parseFloat(item.product.price.toString()) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      customer_email: email,
      metadata: {
        session_id: sessionId,
        customer_name: name,
        shipping_street: street,
        shipping_city: city,
        shipping_state: state,
        shipping_zip: zip,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

### Step 3: Handle Webhook (Create Order)

```typescript
// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/emails/send-order-confirmation';

// Generate unique order number
function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not set');
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      // Get cart items
      const sessionId = session.metadata.session_id;
      const cartItems = await prisma.cartItem.findMany({
        where: { session_id: sessionId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        console.error('No cart items found for session:', sessionId);
        return NextResponse.json({ received: true });
      }

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price.toString()) * item.quantity,
        0
      );

      // Generate order number
      const orderNumber = generateOrderNumber();

      // Create order
      const order = await prisma.order.create({
        data: {
          order_number: orderNumber,
          email: session.customer_email,
          customer_name: session.metadata.customer_name,
          shipping_street: session.metadata.shipping_street,
          shipping_city: session.metadata.shipping_city,
          shipping_state: session.metadata.shipping_state,
          shipping_zip: session.metadata.shipping_zip,
          shipping_country: 'US',
          subtotal,
          tax: 0,
          shipping_cost: 0,
          total: subtotal,
          payment_method: 'stripe',
          payment_status: 'paid',
          payment_intent_id: session.payment_intent,
          order_status: 'processing',
          order_items: {
            create: cartItems.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price_at_time: item.product.price,
            })),
          },
        },
        include: { order_items: { include: { product: true } } },
      });

      // Update inventory
      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: { decrement: item.quantity } },
        });

        await prisma.inventoryLog.create({
          data: {
            product_id: item.product_id,
            change_quantity: -item.quantity,
            reason: 'sale',
            notes: `Order ${orderNumber}`,
          },
        });
      }

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { session_id: sessionId },
      });

      // Send confirmation email (non-blocking)
      try {
        await sendOrderConfirmation({
          customerEmail: order.email,
          customerName: order.customer_name,
          orderNumber: order.order_number,
          items: order.order_items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: parseFloat(item.price_at_time.toString()),
          })),
          subtotal,
          tax: 0,
          shippingCost: 0,
          total: subtotal,
          shippingAddress: {
            street: order.shipping_street,
            city: order.shipping_city,
            state: order.shipping_state,
            zip: order.shipping_zip,
          },
        });
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
```

### Step 4: Redirect to Stripe

```typescript
// app/checkout/page.tsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStripeCheckout = async (formData: any) => {
    setLoading(true);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ... form rendering
}
```

### Local Testing Setup

```bash
# Terminal 1: Run dev server
npm run dev -- --port 3002

# Terminal 2: Run Stripe CLI webhook listener
stripe listen --forward-to localhost:3002/api/webhooks/stripe

# Copy the webhook signing secret (whsec_...) to .env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Environment Variables

```bash
# .env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # From stripe listen command
NEXT_PUBLIC_BASE_URL="http://localhost:3002"  # Dev
# NEXT_PUBLIC_BASE_URL="https://yourdomain.com"  # Production
```

### Production Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy signing secret to production environment variables

---

## 📱 Venmo QR Code Payment Pattern

### Why Venmo for Teen Audiences

**Benefits:**
- No credit card required (teens often don't have cards)
- Popular payment method among 13-19 age group
- Familiar app they already use
- Parent-friendly (parents can send money to teens' Venmo)

**Trade-off:** Manual verification required (Venmo API doesn't support automated verification)

### Implementation Files

```
lib/venmo.ts                           # QR code utilities
app/api/checkout/venmo/                # Create Venmo orders
  └── route.ts
app/checkout/venmo/page.tsx            # QR display page
app/checkout/venmo/success/page.tsx    # Success confirmation
app/admin/venmo/page.tsx               # Admin verification UI
app/api/admin/venmo/pending/route.ts   # Fetch pending orders
app/api/admin/venmo/verify/route.ts    # Verify payments
```

### Step 1: Venmo QR Code Utilities

```typescript
// lib/venmo.ts
import QRCode from 'qrcode';

/**
 * Generate Venmo deep link for payment
 */
export function generateVenmoLink(
  username: string,
  amount: number,
  note: string
): string {
  const venmoLink = `venmo://paycharge?txn=pay&recipients=${username}&amount=${amount.toFixed(
    2
  )}&note=${encodeURIComponent(note)}`;
  return venmoLink;
}

/**
 * Generate QR code as data URL
 */
export async function generateVenmoQRCode(
  username: string,
  amount: number,
  note: string
): Promise<string> {
  const venmoLink = generateVenmoLink(username, amount, note);

  const qrCodeDataUrl = await QRCode.toDataURL(venmoLink, {
    width: 300,
    margin: 2,
    color: {
      dark: '#008CFF', // Venmo blue
      light: '#FFFFFF',
    },
  });

  return qrCodeDataUrl;
}

/**
 * Get Venmo username from environment
 */
export function getVenmoUsername(): string {
  const username = process.env.VENMO_USERNAME;
  if (!username || username === 'your-venmo-username') {
    throw new Error('VENMO_USERNAME not configured');
  }
  return username;
}
```

### Step 2: Create Venmo Order API

```typescript
// app/api/checkout/venmo/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { generateVenmoQRCode, getVenmoUsername } from '@/lib/venmo';

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${random}`;
}

export async function POST(request: Request) {
  try {
    const { email, name, street, city, state, zip } = await request.json();

    // Validate Venmo is configured
    try {
      getVenmoUsername();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Venmo payment not available' },
        { status: 503 }
      );
    }

    // Get cart
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No cart found' },
        { status: 400 }
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { session_id: sessionId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${item.product.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const subtotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.product.price.toString()) * item.quantity,
      0
    );

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order with pending payment status
    const order = await prisma.order.create({
      data: {
        order_number: orderNumber,
        email,
        customer_name: name,
        shipping_street: street,
        shipping_city: city,
        shipping_state: state,
        shipping_zip: zip,
        shipping_country: 'US',
        subtotal,
        tax: 0,
        shipping_cost: 0,
        total: subtotal,
        payment_method: 'venmo',
        payment_status: 'pending_payment_verification',
        order_status: 'pending_payment',
        order_items: {
          create: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_time: item.product.price,
          })),
        },
      },
    });

    // Generate QR code
    const venmoUsername = getVenmoUsername();
    const qrCode = await generateVenmoQRCode(venmoUsername, subtotal, orderNumber);

    // Clear cart from database
    if (sessionId) {
      await prisma.cartItem.deleteMany({
        where: { session_id: sessionId },
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
      qrCode,
      amount: subtotal,
      venmoUsername,
    });
  } catch (error) {
    console.error('Venmo checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Venmo order' },
      { status: 500 }
    );
  }
}
```

### Step 3: QR Code Display Page

```typescript
// app/checkout/venmo/page.tsx
"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function VenmoCheckoutPage() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Get order data from URL params or localStorage
    const qrCode = searchParams.get('qrCode');
    const orderNumber = searchParams.get('orderNumber');
    const amount = searchParams.get('amount');

    if (qrCode && orderNumber && amount) {
      setOrderData({ qrCode, orderNumber, amount });
    }
  }, [searchParams]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Complete Payment with Venmo</h1>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
        <div className="text-center">
          <p className="text-lg mb-4">
            Order: <strong>{orderData.orderNumber}</strong>
          </p>
          <p className="text-2xl font-bold mb-6">${parseFloat(orderData.amount).toFixed(2)}</p>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg inline-block mb-6">
            <Image
              src={orderData.qrCode}
              alt="Venmo QR Code"
              width={300}
              height={300}
            />
          </div>

          {/* Instructions */}
          <div className="text-left bg-white p-6 rounded-lg">
            <h3 className="font-bold mb-4">How to Pay:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the Venmo app on your phone</li>
              <li>Tap the "Scan" button at the top</li>
              <li>Scan this QR code</li>
              <li>Confirm the payment amount</li>
              <li>Complete payment in Venmo</li>
            </ol>
          </div>

          <button
            onClick={() => window.location.href = '/checkout/venmo/success?orderNumber=' + orderData.orderNumber}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
          >
            I've Completed Payment
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Admin Verification UI

```typescript
// app/admin/venmo/page.tsx
"use client"

import { useEffect, useState } from 'react';
import { useAdmin } from '@/components/admin-context';

export default function AdminVenmoPage() {
  const { adminKey } = useAdmin();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingOrders = async () => {
    try {
      const res = await fetch('/api/admin/venmo/pending', {
        headers: { 'x-admin-key': adminKey || '' },
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId: number) => {
    if (!confirm('Confirm you received payment in Venmo?')) return;

    try {
      const res = await fetch('/api/admin/venmo/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || '',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Payment verified! Confirmation email sent.');
        fetchPendingOrders(); // Refresh list
      } else {
        alert(data.error || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Verify error:', error);
      alert('Failed to verify payment');
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Pending Venmo Payments</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No pending Venmo payments</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">{order.order_number}</h3>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                  <p className="text-sm text-gray-600">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${parseFloat(order.total).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => verifyPayment(order.id)}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
              >
                ✓ Verify Payment Received
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 5: Verification API

```typescript
// app/api/admin/venmo/verify/route.ts
import { NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/emails/send-order-confirmation';

async function verifyAdminKey(): Promise<boolean> {
  const headersList = await headers();
  const adminKeyHeader = headersList.get('x-admin-key');

  const cookieStore = await cookies();
  const adminKeyCookie = cookieStore.get('admin_key')?.value;

  const adminKey = adminKeyHeader || adminKeyCookie;
  return adminKey === process.env.ADMIN_KEY;
}

export async function POST(request: Request) {
  const isAuthorized = await verifyAdminKey();

  if (!isAuthorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await request.json();

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { order_items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.payment_method !== 'venmo') {
      return NextResponse.json(
        { success: false, error: 'Not a Venmo order' },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        payment_status: 'paid',
        order_status: 'processing',
      },
    });

    // Send confirmation email
    try {
      await sendOrderConfirmation({
        customerEmail: order.email,
        customerName: order.customer_name,
        orderNumber: order.order_number,
        items: order.order_items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.price_at_time.toString()),
        })),
        subtotal: parseFloat(order.subtotal.toString()),
        tax: parseFloat(order.tax.toString()),
        shippingCost: parseFloat(order.shipping_cost.toString()),
        total: parseFloat(order.total.toString()),
        shippingAddress: {
          street: order.shipping_street,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip,
        },
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the verification if email fails
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
```

### Environment Variables

```bash
# .env
VENMO_USERNAME="your-business-venmo-username"  # No @ symbol
```

**Important:** Must use Venmo Business Profile (personal accounts can't accept QR code payments)

---

## 📧 Resend Email Integration Pattern

### Why Resend

**Benefits:**
- Simple API (easier than SendGrid/AWS SES)
- Generous free tier (100 emails/day, 3,000/month)
- No credit card required to start
- Great deliverability
- Built-in email template support

**Trade-off:** React Email can cause validation errors - use simple HTML instead

### Installation

```bash
npm install resend
```

### Step 1: Initialize Resend Client

```typescript
// lib/resend.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
```

### Step 2: Create Email Template (Simple HTML)

```typescript
// lib/emails/send-order-confirmation.ts
import { resend } from '../resend';

interface OrderConfirmationParams {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

function generateEmailHTML(params: OrderConfirmationParams): string {
  const itemsHTML = params.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>Hi ${params.customerName},</p>
    <p>Thank you for your order! We're excited to get your plushies to you.</p>

    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0;">Order #${params.orderNumber}</h2>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div style="text-align: right; padding-top: 15px; border-top: 2px solid #e5e7eb;">
        <p style="margin: 5px 0;">Subtotal: <strong>$${params.subtotal.toFixed(2)}</strong></p>
        <p style="margin: 5px 0;">Tax: <strong>$${params.tax.toFixed(2)}</strong></p>
        <p style="margin: 5px 0;">Shipping: <strong>$${params.shippingCost.toFixed(2)}</strong></p>
        <p style="margin: 10px 0 0 0; font-size: 1.2em;">Total: <strong>$${params.total.toFixed(2)}</strong></p>
      </div>
    </div>

    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Shipping Address</h3>
      <p style="margin: 5px 0;">${params.customerName}</p>
      <p style="margin: 5px 0;">${params.shippingAddress.street}</p>
      <p style="margin: 5px 0;">${params.shippingAddress.city}, ${params.shippingAddress.state} ${params.shippingAddress.zip}</p>
    </div>

    <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <h3 style="margin-top: 0;">What's Next?</h3>
      <p>Your order is being processed and will ship within 2-3 business days. You'll receive a tracking number once it ships.</p>
    </div>

    <p style="margin-top: 30px; font-size: 0.9em; color: #6b7280;">
      Questions? Reply to this email or contact us at support@example.com
    </p>
  </div>
</body>
</html>
  `;
}

export async function sendOrderConfirmation(params: OrderConfirmationParams) {
  try {
    const html = generateEmailHTML(params);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Development domain (free)
      // from: 'orders@yourdomain.com', // Production (requires domain verification)
      to: params.customerEmail,
      subject: `Order Confirmation - ${params.orderNumber}`,
      html: html,
    });

    if (error) {
      throw error;
    }

    console.log('Order confirmation email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
}
```

### Step 3: Send Email (Non-Blocking Pattern)

```typescript
// In webhook or order creation API
try {
  await sendOrderConfirmation({ ...orderData });
} catch (emailError) {
  console.error('Failed to send email:', emailError);
  // Don't fail the order if email fails
  // Order is still created successfully
}
```

### Environment Variables

```bash
# .env
RESEND_API_KEY="re_..."  # Get from resend.com dashboard
```

### Important Lessons

1. **Don't use React Email** - Can cause validation errors with Resend API
2. **Use simple HTML strings** - More reliable, easier to debug
3. **Make emails non-blocking** - Order shouldn't fail if email fails
4. **Development domain** - Use `onboarding@resend.dev` until you verify a custom domain
5. **Send after database commit** - Only send email after order is saved to database

---

## 🔐 Dual Payment Method Pattern

### Implementation Strategy

**Checkout Page:**
- Radio buttons for payment method selection
- Different button text based on selection
- Different API endpoints based on payment method

```typescript
// app/checkout/page.tsx
"use client"

import { useState } from 'react';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'venmo'>('stripe');

  const handleSubmit = async (formData: any) => {
    if (paymentMethod === 'stripe') {
      // Redirect to Stripe Checkout
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } else {
      // Create Venmo order and show QR
      const res = await fetch('/api/checkout/venmo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/checkout/venmo?qrCode=${encodeURIComponent(
          data.qrCode
        )}&orderNumber=${data.orderNumber}&amount=${data.amount}`;
      }
    }
  };

  return (
    <div>
      {/* Payment method selection */}
      <div className="space-y-4 mb-6">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer">
          <input
            type="radio"
            checked={paymentMethod === 'stripe'}
            onChange={() => setPaymentMethod('stripe')}
            className="mr-3"
          />
          <div>
            <div className="font-bold">💳 Credit/Debit Card</div>
            <div className="text-sm text-gray-600">Visa, Mastercard, Amex, Discover</div>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer">
          <input
            type="radio"
            checked={paymentMethod === 'venmo'}
            onChange={() => setPaymentMethod('venmo')}
            className="mr-3"
          />
          <div>
            <div className="font-bold">📱 Venmo</div>
            <div className="text-sm text-gray-600">Pay with your Venmo account</div>
          </div>
        </label>
      </div>

      {/* Submit button with dynamic text */}
      <button
        onClick={() => handleSubmit(formData)}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg"
      >
        {paymentMethod === 'stripe' ? 'Continue to Payment' : 'Get Venmo QR Code'}
      </button>
    </div>
  );
}
```

**Database Status Management:**
```sql
-- Stripe orders
payment_method = 'stripe'
payment_status = 'paid'  (set by webhook immediately)
order_status = 'processing'

-- Venmo orders (before verification)
payment_method = 'venmo'
payment_status = 'pending_payment_verification'
order_status = 'pending_payment'

-- Venmo orders (after admin verification)
payment_method = 'venmo'
payment_status = 'paid'
order_status = 'processing'
```

---

## 📊 Inventory Management

### Stock Tracking Pattern

```typescript
// Decrement stock on purchase
await prisma.product.update({
  where: { id: productId },
  data: {
    stock_quantity: {
      decrement: quantity,
    },
  },
})

// Log inventory change
await prisma.inventoryLog.create({
  data: {
    product_id: productId,
    change_quantity: -quantity,
    reason: 'sale',
    notes: `Order ${orderNumber}`,
  },
})

// Check low stock
const lowStockProducts = await prisma.product.findMany({
  where: {
    stock_quantity: { lt: 10 },
    status: 'active',
  },
})
```

---

## 🛠️ Tech Stack Setup

### Prisma + PostgreSQL Setup

```bash
# Install dependencies
npm install prisma @prisma/client @prisma/adapter-pg pg

# Initialize Prisma
npx prisma init

# Update .env
DATABASE_URL="postgresql://username@localhost:5432/database_name"

# Create schema in prisma/schema.prisma
# Then migrate
npx prisma migrate dev --name init

# Generate client
npx prisma generate

# Seed data
npx tsx prisma/seed.ts
```

### Prisma Client (Prisma 7)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

const pool = globalForPrisma.pool;
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 🧰 Common Utilities

### Order Number Generator

```typescript
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
}
```

### Price Formatting

```typescript
function formatPrice(price: number | Decimal): string {
  return `$${parseFloat(price.toString()).toFixed(2)}`;
}
```

### Stock Validation

```typescript
async function validateStock(items: CartItem[]): Promise<boolean> {
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.id },
    });

    if (!product || product.stock_quantity < item.quantity) {
      return false;
    }
  }
  return true;
}
```

---

## 📊 Google Sheets Integration

### Setup Google Sheets API

```typescript
// lib/google-sheets.ts
import { google } from 'googleapis';

export function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
      : undefined,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export function getSpreadsheetId(): string {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not set');
  }
  return spreadsheetId;
}
```

### Import Products from Google Sheets

```typescript
// Import products from Google Sheets to database
export async function syncProductsFromSheets(prisma: any) {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  // Read from Products sheet (skip header row)
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Products!A2:G',  // ID, Name, Description, Price, Image, Stock, Status
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return { success: true, message: 'No products found', synced: 0 };
  }

  let syncedCount = 0;

  for (const row of rows) {
    const [id, name, description, price, imageUrl, stockQuantity, status] = row;

    if (!id || !name || !price) continue;

    await prisma.product.upsert({
      where: { id: parseInt(id) },
      update: {
        name,
        description: description || null,
        price: parseFloat(price),
        image_url: imageUrl || '',
        stock_quantity: parseInt(stockQuantity) || 0,
        status: status || 'active',
      },
      create: {
        id: parseInt(id),
        name,
        description: description || null,
        price: parseFloat(price),
        image_url: imageUrl || '',
        stock_quantity: parseInt(stockQuantity) || 0,
        status: status || 'active',
      },
    });

    syncedCount++;
  }

  return { success: true, message: `Synced ${syncedCount} products`, synced: syncedCount };
}
```

### Export Products to Google Sheets

```typescript
// Export products from database to Google Sheets
export async function exportProductsToSheets(prisma: any) {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  // Fetch all products
  const products = await prisma.product.findMany({
    orderBy: { id: 'asc' },
  });

  // Prepare data (header + rows)
  const values = [
    ['ID', 'Name', 'Description', 'Price', 'Image URL', 'Stock Quantity', 'Status'],
    ...products.map((p: any) => [
      p.id,
      p.name,
      p.description || '',
      p.price.toString(),
      p.image_url,
      p.stock_quantity,
      p.status,
    ]),
  ];

  // Update the sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Products!A1',
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  return { success: true, exported: products.length };
}
```

### Export Orders to Google Sheets

```typescript
// Export orders to Google Sheets for reporting
export async function exportOrdersToSheets(prisma: any) {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const orders = await prisma.order.findMany({
    include: {
      order_items: { include: { product: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  const values = [
    ['Order Number', 'Customer Name', 'Email', 'Total', 'Status', 'Payment', 'Date', 'Items'],
    ...orders.map((order: any) => [
      order.order_number,
      order.customer_name,
      order.customer_email,
      order.total.toString(),
      order.order_status,
      order.payment_status,
      order.created_at.toISOString(),
      order.order_items.map((item: any) => `${item.product.name} (${item.quantity})`).join(', '),
    ]),
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Orders!A1',
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  return { success: true, exported: orders.length };
}
```

### Environment Variables

```bash
# .env
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"
```

---

## 🔐 Admin Dashboard Patterns

### Admin Authentication (Key-Based)

```typescript
// components/admin-context.tsx
"use client"

import { createContext, useContext, useState, useEffect } from 'react'

interface AdminContextType {
  adminKey: string | null
  isAuthenticated: boolean
  login: (key: string) => void
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedKey = localStorage.getItem('admin_key')
    if (storedKey) {
      setAdminKey(storedKey)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (key: string) => {
    setAdminKey(key)
    setIsAuthenticated(true)
    localStorage.setItem('admin_key', key)
  }

  const logout = () => {
    setAdminKey(null)
    setIsAuthenticated(false)
    localStorage.removeItem('admin_key')
  }

  return (
    <AdminContext.Provider value={{ adminKey, isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) throw new Error('useAdmin must be used within AdminProvider')
  return context
}
```

### Protected Admin API Routes

**IMPORTANT:** Check BOTH headers AND cookies to support different authentication methods

```typescript
// app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function verifyAdminKey(): Promise<boolean> {
  // Check BOTH header and cookie
  const headersList = await headers();
  const adminKeyHeader = headersList.get('x-admin-key');

  const cookieStore = await cookies();
  const adminKeyCookie = cookieStore.get('admin_key')?.value;

  // Accept either method
  const adminKey = adminKeyHeader || adminKeyCookie;
  const envAdminKey = process.env.ADMIN_KEY;

  if (!envAdminKey) return false;
  return adminKey === envAdminKey;
}

// Why check both?
// - Frontend may store key in localStorage and send via header
// - OR frontend may store key in cookies
// - Supporting both prevents authentication mismatch bugs

export async function GET(request: Request) {
  const isAuthorized = await verifyAdminKey();

  if (!isAuthorized) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const orders = await prisma.order.findMany({
    include: {
      order_items: { include: { product: true } },
      shipping_address: true,
    },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ success: true, data: orders, count: orders.length });
}
```

### Admin Product Update with Inventory Logging

```typescript
// app/api/admin/products/[id]/route.ts
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthorized = await verifyAdminKey();
  if (!isAuthorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);
  const body = await request.json();
  const { name, description, price, stock_quantity, status } = body;

  // Get current product for comparison
  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!currentProduct) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  // Update product
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price && { price: parseFloat(price) }),
      ...(stock_quantity !== undefined && { stock_quantity: parseInt(stock_quantity) }),
      ...(status && { status }),
    },
  });

  // Log inventory change if stock changed
  if (stock_quantity !== undefined && stock_quantity !== currentProduct.stock_quantity) {
    const changeQuantity = parseInt(stock_quantity) - currentProduct.stock_quantity;

    await prisma.inventoryLog.create({
      data: {
        product_id: productId,
        change_quantity: changeQuantity,
        reason: 'admin_update',
        notes: 'Manual inventory adjustment via admin dashboard',
      },
    });
  }

  return NextResponse.json({ success: true, data: updatedProduct });
}
```

### Admin Dashboard Stats

```typescript
// Fetch admin dashboard statistics
async function fetchAdminStats(adminKey: string) {
  // Fetch orders
  const ordersRes = await fetch('/api/admin/orders', {
    headers: { 'x-admin-key': adminKey },
  });
  const ordersData = await ordersRes.json();

  // Fetch products
  const productsRes = await fetch('/api/products');
  const productsData = await productsRes.json();

  // Calculate revenue
  const totalRevenue = ordersData.data.reduce(
    (sum: number, order: any) => sum + parseFloat(order.total),
    0
  );

  return {
    totalOrders: ordersData.count,
    totalProducts: productsData.count,
    totalRevenue,
  };
}
```

### Environment Variable Setup

```bash
# Generate secure admin key
openssl rand -base64 32

# Add to .env
ADMIN_KEY="your-secure-random-key-here"
```

---

## 📚 Related Files

- `CLAUDE.md` - AI development best practices
- `docs/architecture/TRD.md` - Technical requirements
- `docs/DECISIONS.md` - Architectural decisions
- `prisma/schema.prisma` - Full database schema

---

**Remember:** These patterns are reusable across any e-commerce application. Adapt database schema, API routes, and business logic to fit your specific product domain.
