import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - Fetch all active products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
