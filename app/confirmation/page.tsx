"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

  if (!orderNumber) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Order Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find your order confirmation.
        </p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-foreground mb-2">
          Order Confirmed! 🎉
        </h1>
        <p className="text-xl text-muted-foreground">
          Thank you for your purchase!
        </p>
      </div>

      {/* Order Details */}
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Order Number
                </h2>
                <p className="text-2xl font-mono font-bold text-primary">
                  {orderNumber}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please save this number for your records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  What's Next?
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Order confirmation saved
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-600">○</span>
                    Email confirmation will be sent (Phase 4+)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-600">○</span>
                    Your plushies will be shipped soon!
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Note */}
        <Card className="border-2 border-dashed border-primary/30">
          <CardContent className="p-6">
            <h3 className="font-bold text-foreground mb-2">
              💡 Phase 4 Demo Note
            </h3>
            <p className="text-sm text-muted-foreground">
              This is a demo order. In production:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              <li>Payment would be processed via Stripe</li>
              <li>Confirmation email would be sent</li>
              <li>You could track your order status</li>
              <li>Admin would receive order notification</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/shop" className="flex-1">
            <Button className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="min-h-[60vh]">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-16 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          }
        >
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
