"use client"

import { ProductCard } from "@/components/product-card"

const products = [
  {
    id: 1,
    name: "Peachy Bear",
    price: 24.99,
    image: "/cute-peach-pink-bear-plushie-kawaii.jpg",
    category: "Bears",
  },
  {
    id: 2,
    name: "Lavender Bunny",
    price: 29.99,
    image: "/cute-lavender-purple-bunny-rabbit-plushie-kawaii.jpg",
    category: "Bunnies",
  },
  {
    id: 3,
    name: "Minty Kitty",
    price: 22.99,
    image: "/cute-mint-green-cat-kitten-plushie-kawaii.jpg",
    category: "Cats",
  },
  {
    id: 4,
    name: "Cotton Candy Puppy",
    price: 27.99,
    image: "/cute-cotton-candy-pink-blue-puppy-dog-plushie-kawa.jpg",
    category: "Dogs",
  },
  {
    id: 5,
    name: "Strawberry Cow",
    price: 32.99,
    image: "/cute-strawberry-pink-cow-plushie-kawaii.jpg",
    category: "Farm Friends",
  },
  {
    id: 6,
    name: "Blueberry Penguin",
    price: 25.99,
    image: "/cute-baby-blue-penguin-plushie-kawaii.jpg",
    category: "Arctic Pals",
  },
  {
    id: 7,
    name: "Honey Bear",
    price: 28.99,
    image: "/cute-yellow-honey-bear-plushie-kawaii-with-bee.jpg",
    category: "Bears",
  },
  {
    id: 8,
    name: "Cloud Unicorn",
    price: 34.99,
    image: "/cute-pastel-rainbow-unicorn-plushie-kawaii.jpg",
    category: "Fantasy",
  },
]

export function ProductGrid() {
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
