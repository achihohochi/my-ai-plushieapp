import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

// Helper to get or create session ID for guest users
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    sessionId = randomUUID();
  }

  return sessionId;
}

// GET /api/cart - Fetch cart items for current session/user
export async function GET() {
  try {
    const sessionId = await getSessionId();

    const cartItems = await prisma.cartItem.findMany({
      where: {
        session_id: sessionId,
      },
      include: {
        product: true,
      },
    });

    // Map to frontend format
    const items = cartItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: parseFloat(item.product.price.toString()),
      image: item.product.image_url,
      category: 'Plushies', // Default category
      quantity: item.quantity,
      cartItemId: item.id,
    }));

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cart',
      },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: Request) {
  try {
    const sessionId = await getSessionId();
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    if (product.stock_quantity < quantity) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not enough stock available',
        },
        { status: 400 }
      );
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        session_id: sessionId,
        product_id: productId,
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock_quantity < newQuantity) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not enough stock available',
          },
          { status: 400 }
        );
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          session_id: sessionId,
          product_id: productId,
          quantity,
        },
        include: { product: true },
      });
    }

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      data: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        price: parseFloat(cartItem.product.price.toString()),
        image: cartItem.product.image_url,
        category: 'Plushies',
        quantity: cartItem.quantity,
        cartItemId: cartItem.id,
      },
    });

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add to cart',
      },
      { status: 500 }
    );
  }
}
