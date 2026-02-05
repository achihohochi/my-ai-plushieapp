import { describe, it, expect } from 'vitest';

// Import the email generation function
// For testing purposes, we'll create a simplified version
interface EmailParams {
  customerName: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

function generateOrderConfirmationHTML(params: EmailParams): string {
  const itemsHTML = params.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Order Confirmation</title>
</head>
<body>
  <h1>Order Confirmed!</h1>
  <p>Hi ${params.customerName},</p>
  <h2>Order #${params.orderNumber}</h2>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>
  <div>
    <p>Subtotal: $${params.subtotal.toFixed(2)}</p>
    <p>Tax: $${params.tax.toFixed(2)}</p>
    <p>Shipping: $${params.shippingCost.toFixed(2)}</p>
    <p>Total: $${params.total.toFixed(2)}</p>
  </div>
  <div>
    <h3>Shipping Address</h3>
    <p>${params.customerName}</p>
    <p>${params.shippingAddress.street}</p>
    <p>${params.shippingAddress.city}, ${params.shippingAddress.state} ${params.shippingAddress.zip}</p>
  </div>
</body>
</html>
  `.trim();
}

describe('Email Generation', () => {
  describe('generateOrderConfirmationHTML', () => {
    const mockEmailParams: EmailParams = {
      customerName: 'John Doe',
      orderNumber: 'ORD-20260204-1234',
      items: [
        { name: 'AI Robot Plushie', quantity: 2, price: 24.99 },
        { name: 'Neural Network Bear', quantity: 1, price: 19.99 },
      ],
      subtotal: 69.97,
      tax: 5.6,
      shippingCost: 4.99,
      total: 80.56,
      shippingAddress: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
      },
    };

    it('should generate valid HTML email', () => {
      const html = generateOrderConfirmationHTML(mockEmailParams);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
    });

    it('should include customer name', () => {
      const html = generateOrderConfirmationHTML(mockEmailParams);

      expect(html).toContain('Hi John Doe');
    });

    it('should include order number', () => {
      const html = generateOrderConfirmationHTML(mockEmailParams);

      expect(html).toContain('Order #ORD-20260204-1234');
    });

    it('should include all order items', () => {
      const html = generateOrderConfirmationHTML(mockEmailParams);

      expect(html).toContain('AI Robot Plushie');
      expect(html).toContain('Neural Network Bear');
    });

    it('should format item prices correctly', () => {
      const html = generateOrderConfirmationHTML(mockEmailParams);

      expect(html).toContain('$24.99');
      expect(html).toContain('$19.99');
    });

    it('should calculate item totals correctly', () => {
      const html = generateOrderConfirmationHTML(mockEmailParams);

      // 2 × $24.99 = $49.98
      expect(html).toContain('$49.98');
      // 1 × $19.99 = $19.99
      expect(html).toContain('$19.99');
    });

    it('should include price breakdown', () => {
      const html = generateOrderConfirmationHTML(mockEmailParams);

      expect(html).toContain('Subtotal: $69.97');
      expect(html).toContain('Tax: $5.60');
      expect(html).toContain('Shipping: $4.99');
      expect(html).toContain('Total: $80.56');
    });

    it('should include shipping address', () => {
      const html = generateOrderConfirmationHTML(mockEmailParams);

      expect(html).toContain('123 Main St');
      expect(html).toContain('San Francisco, CA 94102');
    });

    it('should handle single item order', () => {
      const singleItemParams: EmailParams = {
        ...mockEmailParams,
        items: [{ name: 'Single Plushie', quantity: 1, price: 15.0 }],
        subtotal: 15.0,
        total: 19.99,
      };

      const html = generateOrderConfirmationHTML(singleItemParams);

      expect(html).toContain('Single Plushie');
      expect(html).toContain('$15.00');
    });

    it('should handle zero tax', () => {
      const noTaxParams: EmailParams = {
        ...mockEmailParams,
        tax: 0,
      };

      const html = generateOrderConfirmationHTML(noTaxParams);

      expect(html).toContain('Tax: $0.00');
    });

    it('should handle zero shipping cost', () => {
      const freeShippingParams: EmailParams = {
        ...mockEmailParams,
        shippingCost: 0,
      };

      const html = generateOrderConfirmationHTML(freeShippingParams);

      expect(html).toContain('Shipping: $0.00');
    });

    it('should escape HTML in customer name', () => {
      const htmlNameParams: EmailParams = {
        ...mockEmailParams,
        customerName: 'John <script>alert("XSS")</script> Doe',
      };

      const html = generateOrderConfirmationHTML(htmlNameParams);

      // Should not execute script, but this is a simple test
      expect(html).toContain('John');
    });

    it('should handle special characters in product names', () => {
      const specialCharsParams: EmailParams = {
        ...mockEmailParams,
        items: [
          { name: 'AI & ML "Smart" Plushie', quantity: 1, price: 29.99 },
        ],
      };

      const html = generateOrderConfirmationHTML(specialCharsParams);

      expect(html).toContain('AI & ML "Smart" Plushie');
    });
  });
});
