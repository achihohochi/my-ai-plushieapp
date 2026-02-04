import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// POST /api/admin/venmo/reject - Reject Venmo payment and restore inventory
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

    const { orderId, reason } = await request.json();

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

    // Restore inventory for all items
    for (const item of order.order_items) {
      await prisma.product.update({
        where: { id: item.product_id },
        data: {
          stock_quantity: {
            increment: item.quantity,
          },
        },
      });

      // Log inventory restoration
      await prisma.inventoryLog.create({
        data: {
          product_id: item.product_id,
          change_quantity: item.quantity,
          reason: 'order_cancelled',
          notes: `Order ${order.order_number} (Venmo - Payment Rejected: ${reason || 'No payment received'})`,
        },
      });
    }

    // Update order status to cancelled
    await prisma.order.update({
      where: { id: orderId },
      data: {
        payment_status: 'failed',
        order_status: 'cancelled',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment rejected and inventory restored',
      order: {
        orderNumber: order.order_number,
        status: 'cancelled',
      },
    });
  } catch (error) {
    console.error('Error rejecting Venmo payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reject payment',
      },
      { status: 500 }
    );
  }
}
