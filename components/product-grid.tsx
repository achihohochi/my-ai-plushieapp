"use client"

import { ProductCard } from "@/components/product-card"
import { useEffect, useState } from "react"
import type { Product } from "@/components/cart-context"

// Helper function to derive category from product name
function getCategoryFromName(name: string): string {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('bear')) return 'Bears'
  if (nameLower.includes('bunny') || nameLower.includes('rabbit')) return 'Bunnies'
  if (nameLower.includes('cat') || nameLower.includes('kitten')) return 'Cats'
  if (nameLower.includes('dog') || nameLower.includes('puppy')) return 'Dogs'
  if (nameLower.includes('cow')) return 'Farm Friends'
  if (nameLower.includes('penguin')) return 'Arctic Pals'
  if (nameLower.includes('unicorn')) return 'Fantasy'
  if (nameLower.includes('owl')) return 'Birds'
  if (nameLower.includes('duck')) return 'Birds'
  return 'Plushies'
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()

        if (data.success) {
          // Map API data to Product type expected by ProductCard
          const mappedProducts: Product[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            image: item.image_url,
            category: getCategoryFromName(item.name),
          }))
          setProducts(mappedProducts)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Our Cutest Plushies 💕</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Each plushie is handpicked for maximum softness and adorableness. Perfect for cuddling, collecting, or
            gifting!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading our adorable plushies...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
