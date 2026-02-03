import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncProductsFromSheets, exportProductsToSheets } from '@/lib/google-sheets';
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

// POST: Import products from Google Sheets to database
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

    const result = await syncProductsFromSheets(prisma);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error syncing from Google Sheets:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync from Google Sheets',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Export products from database to Google Sheets
export async function PUT(request: Request) {
  try {
    // Verify admin key
    const isAuthorized = await verifyAdminKey();
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await exportProductsToSheets(prisma);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error exporting to Google Sheets:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export to Google Sheets',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
