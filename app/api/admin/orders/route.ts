import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exportOrdersToSheets } from '@/lib/google-sheets';
import { headers } from 'next/headers';

// Simple admin key check
async function verifyAdminKey(): Promise<boolean> {
  const headersList = await headers();
  const adminKey = headersList.get('x-admin-key');
  const envAdminKey = process.env.ADMIN_KEY;

  if (!envAdminKey) {
    console.warn('ADMIN_KEY not set in environment variables');
    return false;
  }

  return adminKey === envAdminKey;
}

// GET: Fetch all orders with details
export async function GET(request: Request) {
  try {
    // Verify admin key
    const isAuthorized = await verifyAdminKey();
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
        shipping_address: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Export orders to Google Sheets
export async function POST(request: Request) {
  try {
    // Verify admin key
    const isAuthorized = await verifyAdminKey();
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await exportOrdersToSheets(prisma);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error exporting orders to Google Sheets:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export orders to Google Sheets',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
