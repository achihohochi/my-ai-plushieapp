'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface VenmoOrder {
  id: number;
  order_number: string;
  customer_email: string;
  customer_name: string;
  total: string;
  created_at: string;
  order_items: {
    quantity: number;
    product: {
      name: string;
      price: string;
    };
  }[];
}

export default function AdminVenmoPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<VenmoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get admin key from localStorage
      const adminKey = localStorage.getItem('admin_key');

      const res = await fetch('/api/admin/venmo/pending', {
        headers: {
          'x-admin-key': adminKey || '',
        },
      });
      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch pending orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId: number) => {
    if (!confirm('Confirm that you received payment in your Venmo account?')) {
      return;
    }

    try {
      setVerifying(orderId);

      // Get admin key from localStorage
      const adminKey = localStorage.getItem('admin_key');

      const res = await fetch('/api/admin/venmo/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || '',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Payment verified! Confirmation email sent to customer.');
        // Remove from list
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        alert(data.error || 'Failed to verify payment');
      }
    } catch (err) {
      alert('Failed to verify payment');
      console.error(err);
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading pending orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">Pending Venmo Payments</h1>
          <p className="text-muted-foreground">
            Verify payments received in your Venmo account
          </p>
        </div>
        <Button onClick={() => router.push('/admin/dashboard')} variant="outline">
          ← Back to Dashboard
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Pending Payments
            </h2>
            <p className="text-muted-foreground">
              All Venmo payments have been verified!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Order Info */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          Order #{order.order_number}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${Number(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Items</p>
                      <div className="space-y-1">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {item.product.name} × {item.quantity}
                            </span>
                            <span className="font-semibold">
                              ${(Number(item.product.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Verification Section */}
                  <div className="flex flex-col">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex-1">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-600 text-xl">⚠️</span>
                        <div>
                          <p className="font-semibold text-yellow-800 mb-2">
                            Awaiting Payment Verification
                          </p>
                          <p className="text-sm text-yellow-700 mb-3">
                            Check your Venmo app for a payment of{' '}
                            <strong>${Number(order.total).toFixed(2)}</strong> with note:{' '}
                            <strong>Order {order.order_number}</strong>
                          </p>
                          <ol className="text-xs text-yellow-700 space-y-1 ml-4 list-decimal">
                            <li>Open Venmo app</li>
                            <li>Check for payment from {order.customer_name}</li>
                            <li>Verify amount matches</li>
                            <li>Click "Verify Payment" below</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleVerifyPayment(order.id)}
                      disabled={verifying === order.id}
                      className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      {verifying === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        '✓ Verify Payment Received'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button onClick={fetchPendingOrders} variant="outline">
          🔄 Refresh List
        </Button>
      </div>
    </div>
  );
}
