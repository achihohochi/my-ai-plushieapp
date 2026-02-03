# Reusable E-commerce Patterns & Skills

**Domain:** E-commerce / Online Store Applications
**Tech Stack:** Next.js, PostgreSQL, Prisma, TypeScript
**Patterns:** Guest checkout, session-based cart, order management
**Last Updated:** February 3, 2026

---

## 📋 Table of Contents

1. [Database Schema Patterns](#database-schema-patterns)
2. [API Route Patterns](#api-route-patterns)
3. [Session Management](#session-management)
4. [Cart Persistence](#cart-persistence)
5. [Order Creation Workflow](#order-creation-workflow)
6. [Inventory Management](#inventory-management)
7. [Tech Stack Setup](#tech-stack-setup)
8. [Common Utilities](#common-utilities)
9. [Google Sheets Integration](#google-sheets-integration)
10. [Admin Dashboard Patterns](#admin-dashboard-patterns)

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

```typescript
// app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function verifyAdminKey(): Promise<boolean> {
  const headersList = await headers();
  const adminKey = headersList.get('x-admin-key');
  const envAdminKey = process.env.ADMIN_KEY;

  if (!envAdminKey) return false;
  return adminKey === envAdminKey;
}

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
