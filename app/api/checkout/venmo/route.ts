import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVenmoQRCode, getVenmoUsername } from '@/lib/venmo';
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

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Verify stock availability for all items
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.id) },
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }

      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Not enough stock for ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Create order with pending_payment_verification status
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
        tax: 0,
        shipping_cost: 0,
        total,
        payment_method: 'venmo',
        payment_status: 'pending_payment_verification',
        order_status: 'pending_payment',
        order_items: {
          create: items.map((item: any) => ({
            product_id: parseInt(item.id),
            quantity: item.quantity,
            price_at_time: item.price,
          })),
        },
      },
    });

    // Generate Venmo QR code
    const qrCodeDataUrl = await generateVenmoQRCode({
      username: venmoUsername,
      amount: total,
      note: `Order ${orderNumber}`,
    });

    // Get session ID and clear cart from database
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    // Clear cart items from database
    if (sessionId) {
      await prisma.cartItem.deleteMany({
        where: { session_id: sessionId },
      });
    }

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
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create Venmo order',
      },
      { status: 500 }
    );
  }
}
