"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/components/admin-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  total: string
  order_status: string
  payment_status: string
  payment_method: string
  created_at: string
  order_items: Array<{
    id: number
    quantity: number
    price_at_time: string
    product: {
      name: string
      image_url: string
    }
  }>
  shipping_address: {
    address_line1: string
    city: string
    state: string
    postal_code: string
  } | null
}

export default function AdminOrdersPage() {
  const { adminKey, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchOrders()
    }
  }, [isAuthenticated, adminKey])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-key': adminKey || '' },
      })

      const data = await res.json()

      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Orders will appear here when customers make purchases</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">
                        Order #{order.order_number}
                      </CardTitle>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <span className="font-semibold">Customer:</span> {order.customer_name}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span> {order.customer_email}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{' '}
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {order.shipping_address && (
                          <p>
                            <span className="font-semibold">Shipping:</span>{' '}
                            {order.shipping_address.address_line1}, {order.shipping_address.city},{' '}
                            {order.shipping_address.state} {order.shipping_address.postal_code}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-2">
                        ${parseFloat(order.total).toFixed(2)}
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.order_status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                              : order.order_status === 'processing'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                          }`}
                        >
                          {order.order_status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.payment_status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                              : order.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                          }`}
                        >
                          Payment: {order.payment_status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.payment_method === 'stripe'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
                              : order.payment_method === 'venmo'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                          }`}
                        >
                          {order.payment_method === 'stripe' ? '💳 Stripe' : order.payment_method === 'venmo' ? '📱 Venmo' : order.payment_method}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-foreground mb-3">Order Items:</h4>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                      >
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${parseFloat(item.price_at_time).toFixed(2)}
                          </p>
                        </div>
                        <div className="font-bold text-foreground">
                          ${(parseFloat(item.price_at_time) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
