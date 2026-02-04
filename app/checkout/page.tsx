"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider, useCart } from "@/components/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

function CheckoutForm() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'venmo'>('stripe')
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (paymentMethod === 'stripe') {
        // Create Stripe checkout session
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            items,
          }),
        })

        const data = await res.json()

        if (data.success && data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url
        } else {
          alert(data.error || "Failed to create checkout session")
          setLoading(false)
        }
      } else if (paymentMethod === 'venmo') {
        // Create Venmo order
        const res = await fetch("/api/checkout/venmo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            items,
          }),
        })

        const data = await res.json()

        if (data.success) {
          // Clear cart if session ID provided
          if (data.sessionId) {
            await clearCart()
          }

          // Redirect to Venmo QR page with order data
          const queryParams = new URLSearchParams({
            data: encodeURIComponent(JSON.stringify(data))
          })
          router.push(`/checkout/venmo?${queryParams.toString()}`)
        } else {
          alert(data.error || "Failed to create Venmo order")
          setLoading(false)
        }
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to create checkout session. Please try again.")
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some plushies before checking out!
          </p>
          <Link href="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-foreground mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Shipping Information
                </h2>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>

                  {/* Street Address */}
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      name="street"
                      type="text"
                      required
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      className="mt-1"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="San Francisco"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="CA"
                        maxLength={2}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      name="zip"
                      type="text"
                      required
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="94102"
                      pattern="[0-9]{5}"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Payment Method
                </h2>

                <div className="space-y-3 mb-4">
                  {/* Stripe Option */}
                  <label
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod('stripe')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold">💳 Credit/Debit Card</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Secure payment via Stripe. All major cards accepted.
                      </p>
                    </div>
                  </label>

                  {/* Venmo Option */}
                  <label
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'venmo'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="venmo"
                      checked={paymentMethod === 'venmo'}
                      onChange={(e) => setPaymentMethod('venmo')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold">📱 Venmo</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Scan QR code with Venmo app. Manual verification required.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Payment Method Info */}
                {paymentMethod === 'stripe' && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Secure Payment:</strong> You'll be redirected to Stripe's secure checkout to complete your payment.
                    </p>
                  </div>
                )}

                {paymentMethod === 'venmo' && (
                  <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                    <p className="text-sm text-purple-900 dark:text-purple-100">
                      <strong>Venmo Payment:</strong> You'll receive a QR code to scan with your Venmo app.
                      Your order will be verified within 1-2 hours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg bg-muted"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6 border-t pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-foreground border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full font-bold text-lg py-6"
                  disabled={loading}
                >
                  {loading
                    ? paymentMethod === 'stripe'
                      ? "Redirecting to Stripe..."
                      : "Creating Venmo order..."
                    : paymentMethod === 'stripe'
                    ? "Continue to Payment"
                    : "Get Venmo QR Code"}
                </Button>

                <Link href="/cart">
                  <Button variant="outline" className="w-full mt-3">
                    Back to Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="min-h-[60vh]">
          <CheckoutForm />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
