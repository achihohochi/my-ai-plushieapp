"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { XCircle, ShoppingCart } from "lucide-react"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="min-h-[60vh]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <XCircle className="h-24 w-24 mx-auto text-orange-500" />
                </div>

                <h1 className="text-4xl font-extrabold text-foreground mb-4">
                  Checkout Cancelled
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  Your payment was cancelled. No charges were made to your account.
                </p>

                <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 p-6 rounded-lg mb-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-2">
                    Your Cart is Safe
                  </h2>
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    Don't worry! Your items are still in your cart. You can return to checkout whenever you're ready.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/cart">
                    <Button size="lg" className="w-full sm:w-auto">
                      Return to Cart
                    </Button>
                  </Link>
                  <Link href="/shop">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Having trouble checking out?{" "}
                    <a href="mailto:support@example.com" className="text-primary hover:underline">
                      Contact support
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
