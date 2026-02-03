import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Helper to get session ID
async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('session_id')?.value || null;
}

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const cartItemId = parseInt(id, 10);

    if (isNaN(cartItemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart item ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Verify cart item belongs to this session
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        session_id: sessionId,
      },
      include: { product: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Check stock
    if (cartItem.product.stock_quantity < quantity) {
      return NextResponse.json(
        {
          success: false,
          error: `Only ${cartItem.product.stock_quantity} items available`,
        },
        { status: 400 }
      );
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedItem.product.id,
        name: updatedItem.product.name,
        price: parseFloat(updatedItem.product.price.toString()),
        image: updatedItem.product.image_url,
        category: 'Plushies',
        quantity: updatedItem.quantity,
        cartItemId: updatedItem.id,
      },
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const cartItemId = parseInt(id, 10);

    if (isNaN(cartItemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart item ID' },
        { status: 400 }
      );
    }

    // Verify cart item belongs to this session
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        session_id: sessionId,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
