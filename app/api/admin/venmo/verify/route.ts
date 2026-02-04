import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { sendOrderConfirmation } from '@/lib/emails/send-order-confirmation';

// POST /api/admin/venmo/verify - Verify Venmo payment and send confirmation
export async function POST(request: Request) {
  try {
    // Verify admin authentication - check both header and cookie
    const adminKeyHeader = request.headers.get('x-admin-key');
    const cookieStore = await cookies();
    const adminKeyCookie = cookieStore.get('admin_key')?.value;
    const adminKey = adminKeyHeader || adminKeyCookie;

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order is pending Venmo payment
    if (
      order.payment_method !== 'venmo' ||
      order.payment_status !== 'pending_payment_verification'
    ) {
      return NextResponse.json(
        { success: false, error: 'Order is not pending Venmo verification' },
        { status: 400 }
      );
    }

    // Update order status to paid and processing
    await prisma.order.update({
      where: { id: orderId },
      data: {
        payment_status: 'paid',
        order_status: 'processing',
      },
    });

    // Send confirmation email
    try {
      console.log('Attempting to send confirmation email to:', order.customer_email);
      await sendOrderConfirmation({
        to: order.customer_email,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        items: order.order_items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price_at_time),
        })),
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shippingCost: Number(order.shipping_cost),
        total: Number(order.total),
        shippingAddress: {
          street: order.shipping_street,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip,
          country: order.shipping_country,
        },
      });
      console.log('✅ Email sent successfully to:', order.customer_email);
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, null, 2));
      // Don't fail the verification if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and confirmation email sent',
      order: {
        orderNumber: order.order_number,
        status: 'processing',
      },
    });
  } catch (error) {
    console.error('Error verifying Venmo payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify payment',
      },
      { status: 500 }
    );
  }
}
