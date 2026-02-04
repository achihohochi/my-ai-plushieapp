'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, Mail, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OrderData {
  orderNumber: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  customerEmail: string;
}

export default function VenmoSuccessPage() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setOrderData(parsed);
      } catch (err) {
        console.error('Failed to parse order data:', err);
      }
    }
  }, [searchParams]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Received!</h1>
          <p className="text-xl text-gray-600">Thank you for your order</p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Payment Pending Verification</h3>
                <p className="text-sm text-blue-800">
                  We've received your order! Please complete payment via Venmo if you haven't already.
                  Your order will be processed once we verify your payment (usually within 1-2 hours during business hours).
                </p>
              </div>
            </div>

            {/* Order Number */}
            <div className="mb-6 pb-6 border-b">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">{orderData.orderNumber}</p>
            </div>

            {/* Email Notification Info */}
            <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">
                  <strong>Email notifications will be sent to:</strong>
                </p>
                <p className="text-sm text-gray-600">{orderData.customerEmail}</p>
                <p className="text-xs text-gray-500 mt-1">
                  You'll receive a confirmation email once we verify your payment
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
              <p className="text-lg font-semibold text-gray-900">Total</p>
              <p className="text-2xl font-bold text-primary">${orderData.total.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* What's Next Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">What happens next?</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>
                  <strong>Complete Venmo Payment</strong> - If you haven't already, use the QR code or pay @aichiho manually
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>
                  <strong>We Verify Payment</strong> - Our team will check Venmo for your payment (1-2 hours)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>
                  <strong>Order Confirmed</strong> - You'll receive a confirmation email and we'll start preparing your order
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <span>
                  <strong>Shipping</strong> - Your plushies will be shipped within 2-3 business days
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg" variant="outline">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Questions about your order?{' '}
            <a href="mailto:support@cuddlecorner.com" className="text-primary hover:underline font-semibold">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
