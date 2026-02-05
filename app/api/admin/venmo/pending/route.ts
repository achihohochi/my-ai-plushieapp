import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET /api/admin/venmo/pending - Fetch all pending Venmo orders
export async function GET(request: Request) {
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

    // Fetch all orders with pending Venmo payment verification
    const orders = await prisma.order.findMany({
      where: {
        payment_method: 'venmo',
        payment_status: 'pending_payment_verification',
        order_status: 'pending_payment',
      },
      include: {
        order_items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching pending Venmo orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pending orders',
      },
      { status: 500 }
    );
  }
}
