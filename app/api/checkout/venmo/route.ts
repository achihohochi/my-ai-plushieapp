import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVenmoQRCode, getVenmoUsername } from '@/lib/venmo';
import { generateIdempotencyKey, IDEMPOTENCY_WINDOW_MS } from '@/lib/idempotency';
import { cookies } from 'next/headers';

// Helper to generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

// POST /api/checkout/venmo - Create order for Venmo payment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, street, city, state, zip, country = 'US', items } = body;

    // Validation
    if (!email || !name || !street || !city || !state || !zip) {
      return NextResponse.json(
        { success: false, error: 'Missing required shipping information' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Check if Venmo is configured
    const venmoUsername = getVenmoUsername();
    if (!venmoUsername || venmoUsername === 'your-venmo-username') {
      return NextResponse.json(
        { success: false, error: 'Venmo is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    const total = subtotal; // No tax/shipping for MVP

    // Generate idempotency key to prevent duplicate orders
    const idempotencyKey = generateIdempotencyKey({
      email,
      items: items.map((item: any) => ({ id: item.id, quantity: item.quantity })),
      total,
    });

    // Check for existing order with same idempotency key within time window
    const existingOrder = await prisma.order.findFirst({
      where: {
        idempotency_key: idempotencyKey,
        created_at: {
          gte: new Date(Date.now() - IDEMPOTENCY_WINDOW_MS),
        },
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    // If duplicate order found, return existing order instead of creating new one
    if (existingOrder) {
      console.log(`Duplicate order detected. Returning existing order: ${existingOrder.order_number}`);

      // Generate QR code for existing order
      const qrCodeDataUrl = await generateVenmoQRCode({
        username: venmoUsername,
        amount: Number(existingOrder.total),
        note: `Order ${existingOrder.order_number}`,
      });

      return NextResponse.json({
        success: true,
        order: {
          orderNumber: existingOrder.order_number,
          total: Number(existingOrder.total),
        },
        venmo: {
          username: venmoUsername,
          amount: Number(existingOrder.total),
          qrCodeDataUrl,
        },
        items: existingOrder.order_items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price_at_time),
        })),
        customerEmail: existingOrder.customer_email,
      });
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Get session ID before transaction
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    // Wrap all database operations in a transaction with serializable isolation
    // This prevents race conditions when multiple users buy the same item
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify stock availability with row-level locks (FOR UPDATE)
      // This prevents concurrent transactions from reading stale stock values
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: parseInt(item.id) },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.name}`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
        }
      }

      // 2. Create order with order items
      const newOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          customer_email: email,
          customer_name: name,
          shipping_street: street,
          shipping_city: city,
          shipping_state: state,
          shipping_zip: zip,
          shipping_country: country,
          subtotal,
          tax: 0,
          shipping_cost: 0,
          total,
          payment_method: 'venmo',
          payment_status: 'pending_payment_verification',
          order_status: 'pending_payment',
          idempotency_key: idempotencyKey,
          order_items: {
            create: items.map((item: any) => ({
              product_id: parseInt(item.id),
              quantity: item.quantity,
              price_at_time: item.price,
            })),
          },
        },
      });

      // 3. Reserve inventory by decrementing stock for Venmo orders
      // This prevents overselling while payment is being verified
      for (const item of items) {
        await tx.product.update({
          where: { id: parseInt(item.id) },
          data: {
            stock_quantity: {
              decrement: item.quantity,
            },
          },
        });

        // 4. Log inventory change with pending status
        await tx.inventoryLog.create({
          data: {
            product_id: parseInt(item.id),
            change_quantity: -item.quantity,
            reason: 'sale',
            notes: `Order ${orderNumber} (Venmo - Pending Payment)`,
          },
        });
      }

      // 5. Clear cart items from database
      if (sessionId) {
        await tx.cartItem.deleteMany({
          where: { session_id: sessionId },
        });
      }

      return newOrder;
    }, {
      // Use READ COMMITTED isolation level to prevent dirty reads
      // while still allowing concurrent transactions
      isolationLevel: 'ReadCommitted',
    });

    // Generate Venmo QR code (outside transaction - doesn't need atomicity)
    const qrCodeDataUrl = await generateVenmoQRCode({
      username: venmoUsername,
      amount: total,
      note: `Order ${orderNumber}`,
    });

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.order_number,
        total: Number(order.total),
      },
      venmo: {
        username: venmoUsername,
        amount: total,
        qrCodeDataUrl,
      },
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      customerEmail: email,
      sessionId, // Return session ID so frontend can clear cart after payment
    });
  } catch (error) {
    console.error('Venmo checkout error:', error);

    // Return appropriate status code based on error type
    const errorMessage = error instanceof Error ? error.message : 'Failed to create Venmo order';
    const statusCode = errorMessage.includes('not found') ? 404 :
                      errorMessage.includes('Not enough stock') ? 400 : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
