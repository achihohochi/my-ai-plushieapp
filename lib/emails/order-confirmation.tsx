import * as React from 'react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailProps {
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

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderNumber,
  customerName,
  items,
  subtotal,
  tax,
  shippingCost,
  total,
  shippingAddress,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#8B5CF6', marginBottom: '10px' }}>Cuddle Corner</h1>
          <p style={{ fontSize: '24px', margin: '0' }}>🎉 Order Confirmed!</p>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          Hi {customerName},
        </p>
        <p style={{ fontSize: '16px', marginBottom: '30px' }}>
          Thank you for your order! We're getting your adorable plushies ready for shipment.
        </p>

        {/* Order Info */}
        <div style={{ backgroundColor: '#F3F4F6', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#6B7280' }}>Order Number</p>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>{orderNumber}</p>
        </div>

        {/* Order Items */}
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Order Details</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              <th style={{ textAlign: 'left', padding: '10px 0', fontSize: '14px', color: '#6B7280' }}>Item</th>
              <th style={{ textAlign: 'center', padding: '10px 0', fontSize: '14px', color: '#6B7280' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '14px', color: '#6B7280' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '15px 0', fontSize: '15px' }}>{item.name}</td>
                <td style={{ textAlign: 'center', padding: '15px 0', fontSize: '15px' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '15px 0', fontSize: '15px' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Order Summary */}
        <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '15px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '15px' }}>Subtotal</span>
            <span style={{ fontSize: '15px' }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '15px' }}>Tax</span>
            <span style={{ fontSize: '15px' }}>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontSize: '15px' }}>Shipping</span>
            <span style={{ fontSize: '15px' }}>${shippingCost.toFixed(2)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '15px',
            borderTop: '2px solid #E5E7EB'
          }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#8B5CF6' }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Shipping Address</h2>
        <div style={{ backgroundColor: '#F3F4F6', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{customerName}</p>
          <p style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{shippingAddress.street}</p>
          <p style={{ margin: '0', fontSize: '15px' }}>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '15px' }}>{shippingAddress.country}</p>
        </div>

        {/* What's Next */}
        <div style={{ backgroundColor: '#EEF2FF', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#8B5CF6' }}>
            📦 What's Next?
          </h3>
          <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '15px' }}>
            <li style={{ marginBottom: '8px' }}>Your plushies will be carefully packaged</li>
            <li style={{ marginBottom: '8px' }}>We'll send tracking information once shipped</li>
            <li style={{ marginBottom: '8px' }}>Expect delivery within 5-7 business days</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '10px' }}>
            Need help? Contact us at{' '}
            <a href="mailto:support@cuddlecorner.com" style={{ color: '#8B5CF6', textDecoration: 'none' }}>
              support@cuddlecorner.com
            </a>
          </p>
          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0' }}>
            © 2026 Cuddle Corner. All rights reserved.
          </p>
        </div>
      </div>
    </body>
  </html>
);
