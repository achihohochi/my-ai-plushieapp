"use client"

import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { FeaturedSection } from "@/components/featured-section"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"

export default function ShopPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <ProductGrid />
          <FeaturedSection />
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  )
}
