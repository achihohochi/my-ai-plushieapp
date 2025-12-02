"use client"

import { ShoppingBag, Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-context"

export function Header() {
  const { setIsOpen, totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧸</span>
            <h1 className="text-2xl font-extrabold tracking-tight text-primary">Cuddle Corner</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">
              Shop All
            </a>
            <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">
              New Arrivals
            </a>
            <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">
              Best Sellers
            </a>
            <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">
              Collections
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full relative" onClick={() => setIsOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
