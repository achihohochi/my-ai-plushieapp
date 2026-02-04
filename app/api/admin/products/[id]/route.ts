import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

// PUT: Update product details
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin key
    const isAuthorized = await verifyAdminKey();
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, image_url, price, stock_quantity, status } = body;

    // Get current product for inventory logging
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(image_url && { image_url }),
        ...(price && { price: parseFloat(price) }),
        ...(stock_quantity !== undefined && { stock_quantity: parseInt(stock_quantity) }),
        ...(status && { status }),
      },
    });

    // Log inventory change if stock quantity changed
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

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
