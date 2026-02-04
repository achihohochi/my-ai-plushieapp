'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface VenmoCheckoutData {
  order: {
    orderNumber: string;
    total: number;
  };
  venmo: {
    username: string;
    amount: number;
    qrCodeDataUrl: string;
  };
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  customerEmail?: string;
  sessionId?: string;
}

export default function VenmoCheckoutPage() {
  const searchParams = useSearchParams();
  const [checkoutData, setCheckoutData] = useState<VenmoCheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setCheckoutData(parsed);
      } catch (err) {
        setError('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    } else {
      setError('No checkout data found');
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !checkoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Something went wrong'}</p>
          <Link
            href="/shop"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const { order, venmo } = checkoutData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📱</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pay with Venmo</h1>
            <p className="text-gray-600">Order #{order.orderNumber}</p>
          </div>

          {/* Amount */}
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-900">${venmo.amount.toFixed(2)}</p>
          </div>

          {/* QR Code */}
          <div className="bg-white border-4 border-blue-500 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Scan to Pay</p>
              <div className="inline-block bg-white p-4 rounded-xl">
                <Image
                  src={venmo.qrCodeDataUrl}
                  alt="Venmo QR Code"
                  width={300}
                  height={300}
                  className="mx-auto"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Pay to:</p>
              <p className="text-lg font-bold text-blue-600">@{venmo.username}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">How to Pay:</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>Open the <strong>Venmo app</strong> on your phone</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>
                  Tap the <strong>camera icon</strong> and scan this QR code
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>
                  Verify the amount is <strong>${venmo.amount.toFixed(2)}</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span>
                  Complete the payment in Venmo
                </span>
              </li>
            </ol>
          </div>

          {/* Important Note */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-800 mb-1">Important</p>
                <p className="text-sm text-yellow-700">
                  Your order <strong>#{order.orderNumber}</strong> will be processed after we
                  verify your payment. You'll receive a confirmation email once verified.
                </p>
              </div>
            </div>
          </div>

          {/* Completed Payment Button */}
          <div className="mt-6">
            <Link
              href={`/checkout/venmo/success?data=${encodeURIComponent(
                JSON.stringify({
                  orderNumber: order.orderNumber,
                  total: order.total,
                  items: checkoutData.items || [],
                  customerEmail: checkoutData.customerEmail || '',
                })
              )}`}
              className="block w-full bg-green-600 text-white text-center px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
            >
              ✓ I've Completed Payment
            </Link>
            <p className="text-xs text-gray-500 text-center mt-2">
              Click after you've sent payment via Venmo
            </p>
          </div>

          {/* Alternative Option */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">
              Don't have the Venmo app?
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/checkout"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                ← Back to Checkout
              </Link>
              <a
                href="https://venmo.com/download"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Download Venmo
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Common Questions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                How long does verification take?
              </p>
              <p className="text-gray-600">
                Usually within 1-2 hours during business hours. You'll receive an email
                confirmation once verified.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                What if I sent the wrong amount?
              </p>
              <p className="text-gray-600">
                Contact us immediately at support@cuddlecorner.com with your order number and
                we'll help resolve it.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Can I cancel my order?</p>
              <p className="text-gray-600">
                If you haven't sent payment yet, you can cancel. Once payment is sent and
                verified, cancellations are subject to our refund policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
