import { resend } from '@/lib/resend';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface SendOrderConfirmationParams {
  to: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

function generateEmailHTML(params: SendOrderConfirmationParams): string {
  const itemsHTML = params.items
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 15px 0; font-size: 15px;">${item.name}</td>
          <td style="text-align: center; padding: 15px 0; font-size: 15px;">${item.quantity}</td>
          <td style="text-align: right; padding: 15px 0; font-size: 15px;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; margin-bottom: 10px;">Cuddle Corner</h1>
            <p style="font-size: 24px; margin: 0;">🎉 Order Confirmed!</p>
          </div>

          <!-- Greeting -->
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${params.customerName},</p>
          <p style="font-size: 16px; margin-bottom: 30px;">
            Thank you for your order! We're getting your adorable plushies ready for shipment.
          </p>

          <!-- Order Info -->
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #6B7280;">Order Number</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold;">${params.orderNumber}</p>
          </div>

          <!-- Order Items -->
          <h2 style="font-size: 20px; margin-bottom: 15px;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="border-bottom: 2px solid #E5E7EB;">
                <th style="text-align: left; padding: 10px 0; font-size: 14px; color: #6B7280;">Item</th>
                <th style="text-align: center; padding: 10px 0; font-size: 14px; color: #6B7280;">Qty</th>
                <th style="text-align: right; padding: 10px 0; font-size: 14px; color: #6B7280;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div style="border-top: 2px solid #E5E7EB; padding-top: 15px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 15px;">Subtotal</span>
              <span style="font-size: 15px;">$${params.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 15px;">Tax</span>
              <span style="font-size: 15px;">$${params.tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <span style="font-size: 15px;">Shipping</span>
              <span style="font-size: 15px;">$${params.shippingCost.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #E5E7EB;">
              <span style="font-size: 18px; font-weight: bold;">Total</span>
              <span style="font-size: 18px; font-weight: bold; color: #8B5CF6;">$${params.total.toFixed(2)}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <h2 style="font-size: 20px; margin-bottom: 15px;">Shipping Address</h2>
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0 0 5px 0; font-size: 15px;">${params.customerName}</p>
            <p style="margin: 0 0 5px 0; font-size: 15px;">${params.shippingAddress.street}</p>
            <p style="margin: 0; font-size: 15px;">
              ${params.shippingAddress.city}, ${params.shippingAddress.state} ${params.shippingAddress.zip}
            </p>
            <p style="margin: 5px 0 0 0; font-size: 15px;">${params.shippingAddress.country}</p>
          </div>

          <!-- What's Next -->
          <div style="background-color: #EEF2FF; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #8B5CF6;">📦 What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
              <li style="margin-bottom: 8px;">Your plushies will be carefully packaged</li>
              <li style="margin-bottom: 8px;">We'll send tracking information once shipped</li>
              <li style="margin-bottom: 8px;">Expect delivery within 5-7 business days</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #E5E7EB;">
            <p style="font-size: 14px; color: #6B7280; margin-bottom: 10px;">
              Need help? Contact us at
              <a href="mailto:support@cuddlecorner.com" style="color: #8B5CF6; text-decoration: none;">
                support@cuddlecorner.com
              </a>
            </p>
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              © 2026 Cuddle Corner. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendOrderConfirmation(params: SendOrderConfirmationParams) {
  try {
    // Generate HTML email
    const emailHtml = generateEmailHTML(params);

    // Send the email via Resend
    const data = await resend.emails.send({
      from: 'Cuddle Corner <onboarding@resend.dev>', // Use resend.dev domain for testing
      to: params.to,
      subject: `Order Confirmation - ${params.orderNumber}`,
      html: emailHtml,
    });

    console.log('Order confirmation email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
  }
}
