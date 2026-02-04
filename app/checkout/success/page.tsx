"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-24 w-24 mx-auto text-green-500" />
            </div>

            <h1 className="text-4xl font-extrabold text-foreground mb-4">
              Payment Successful! 🎉
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              Thank you for your order! Your payment has been processed successfully.
            </p>

            {sessionId && (
              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Session ID:</strong> {sessionId}
                </p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mb-8">
              <Package className="h-12 w-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                What's Next?
              </h2>
              <ul className="text-left text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>✉️ You'll receive an order confirmation email shortly</li>
                <li>📦 Your plushies will be carefully packaged</li>
                <li>🚚 We'll send tracking information once shipped</li>
                <li>💝 Expect delivery within 5-7 business days</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Contact us at{" "}
                <a href="mailto:support@example.com" className="text-primary hover:underline">
                  support@example.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="min-h-[60vh]">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">Loading...</div>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
