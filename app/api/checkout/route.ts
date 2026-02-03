import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

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

// POST /api/checkout - Create order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, street, city, state, zip, country = 'US', items, totalPrice } = body;

    // Validation
    if (!email || !name || !street || !city || !state || !zip) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Get session ID
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    // Validate items and check stock
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.name} not found` },
          { status: 404 }
        );
      }

      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Not enough stock for ${product.name}. Only ${product.stock_quantity} available.`,
          },
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

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
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
        tax: 0, // Can add tax calculation later
        shipping_cost: 0, // Free shipping
        total: subtotal,
        payment_method: 'pending', // Will be updated when Stripe is integrated
        payment_status: 'pending',
        order_status: 'processing',
        order_items: {
          create: orderItems,
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

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock_quantity: {
            decrement: item.quantity,
          },
        },
      });

      // Log inventory change
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
    if (sessionId) {
      await prisma.cartItem.deleteMany({
        where: {
          session_id: sessionId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
      total: parseFloat(order.total.toString()),
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
      },
      { status: 500 }
    );
  }
}
