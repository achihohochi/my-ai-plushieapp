import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/emails/send-order-confirmation';
import Stripe from 'stripe';

// Helper to generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

// POST /api/webhooks/stripe - Handle Stripe webhooks
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve full session with line items
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'line_items.data.price.product'],
        });

        // Extract shipping information from metadata
        const metadata = session.metadata || {};
        const {
          customer_name,
          shipping_street,
          shipping_city,
          shipping_state,
          shipping_zip,
          shipping_country = 'US',
          session_id: cartSessionId,
        } = metadata;

        // Calculate totals
        const subtotal = (session.amount_total || 0) / 100; // Convert from cents

        // Get line items to create order items
        const lineItems = fullSession.line_items?.data || [];
        const orderItems = [];

        // Process each line item and update inventory
        for (const item of lineItems) {
          const productName = typeof item.price?.product === 'object'
            ? item.price.product.name
            : '';

          // Find product by name (we'll need to match by name since Stripe doesn't have our product IDs)
          const product = await prisma.product.findFirst({
            where: { name: productName },
          });

          if (!product) {
            console.error(`Product not found: ${productName}`);
            continue;
          }

          // Check stock availability
          if (product.stock_quantity < (item.quantity || 0)) {
            console.error(`Not enough stock for ${product.name}`);
            continue;
          }

          orderItems.push({
            product_id: product.id,
            quantity: item.quantity || 0,
            price_at_time: (item.amount_total || 0) / 100 / (item.quantity || 1),
          });

          // Update product stock
          await prisma.product.update({
            where: { id: product.id },
            data: {
              stock_quantity: {
                decrement: item.quantity || 0,
              },
            },
          });
        }

        // Generate order number
        const orderNumber = generateOrderNumber();

        // Create order in database
        const order = await prisma.order.create({
          data: {
            order_number: orderNumber,
            customer_email: session.customer_email || session.customer_details?.email || '',
            customer_name: customer_name || session.customer_details?.name || '',
            shipping_street: shipping_street || '',
            shipping_city: shipping_city || '',
            shipping_state: shipping_state || '',
            shipping_zip: shipping_zip || '',
            shipping_country: shipping_country,
            subtotal,
            tax: 0,
            shipping_cost: 0,
            total: subtotal,
            payment_method: 'stripe',
            payment_status: 'paid',
            payment_intent_id: session.payment_intent as string,
            order_status: 'processing',
            order_items: {
              create: orderItems,
            },
          },
        });

        // Log inventory changes
        for (const item of orderItems) {
          await prisma.inventoryLog.create({
            data: {
              product_id: item.product_id,
              change_quantity: -item.quantity,
              reason: 'sale',
              notes: `Order ${orderNumber} (Stripe)`,
            },
          });
        }

        // Clear cart if session ID exists
        if (cartSessionId) {
          await prisma.cartItem.deleteMany({
            where: { session_id: cartSessionId },
          });
        }

        console.log(`Order created: ${orderNumber} for payment ${session.payment_intent}`);

        // Send order confirmation email
        try {
          // Fetch the complete order with items for the email
          const orderWithItems = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
              order_items: {
                include: {
                  product: true,
                },
              },
            },
          });

          if (orderWithItems) {
            await sendOrderConfirmation({
              to: orderWithItems.customer_email,
              orderNumber: orderWithItems.order_number,
              customerName: orderWithItems.customer_name,
              items: orderWithItems.order_items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: Number(item.price_at_time),
              })),
              subtotal: Number(orderWithItems.subtotal),
              tax: Number(orderWithItems.tax),
              shippingCost: Number(orderWithItems.shipping_cost),
              total: Number(orderWithItems.total),
              shippingAddress: {
                street: orderWithItems.shipping_street,
                city: orderWithItems.shipping_city,
                state: orderWithItems.shipping_state,
                zip: orderWithItems.shipping_zip,
                country: orderWithItems.shipping_country,
              },
            });

            console.log(`Order confirmation email sent to ${orderWithItems.customer_email}`);
          }
        } catch (emailError) {
          // Don't fail the webhook if email fails - just log the error
          console.error('Failed to send order confirmation email:', emailError);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment failed: ${paymentIntent.id}`);

        // You could update order status to 'failed' here if you track pending orders
        // For now, we only create orders on successful payment
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
