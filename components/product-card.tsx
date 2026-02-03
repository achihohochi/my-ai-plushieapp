"use client"

import { Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart, type Product } from "@/components/cart-context"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    await addItem(product)
    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <Card className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-gradient-to-br from-secondary/50 to-accent/30 overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${isLiked ? "fill-primary text-primary" : "text-muted-foreground"}`}
            />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-bold text-foreground mb-1 truncate">{product.name}</h4>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-primary">${product.price.toFixed(2)}</span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className={`rounded-full font-semibold transition-all ${isAdding ? "scale-110 bg-accent" : ""}`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
