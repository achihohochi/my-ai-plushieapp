import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { cookies } from 'next/headers';

// POST /api/create-checkout-session - Create Stripe checkout session
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

    // Get session ID to attach to metadata
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    // Format line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.category || 'AI Plushie',
          images: item.image ? [`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}${item.image}`] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/checkout/cancel`,
      customer_email: email,
      metadata: {
        customer_name: name,
        shipping_street: street,
        shipping_city: city,
        shipping_state: state,
        shipping_zip: zip,
        shipping_country: country,
        session_id: sessionId || '',
      },
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}
