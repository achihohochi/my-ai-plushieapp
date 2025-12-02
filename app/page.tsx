"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { FeaturedSection } from "@/components/featured-section"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <ProductGrid />
          <FeaturedSection />
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  )
}
