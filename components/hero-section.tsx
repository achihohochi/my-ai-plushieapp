"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent/30 py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: "0s" }}>
          ✨
        </div>
        <div className="absolute top-20 right-20 text-4xl animate-bounce" style={{ animationDelay: "0.5s" }}>
          💖
        </div>
        <div className="absolute bottom-20 left-1/4 text-5xl animate-bounce" style={{ animationDelay: "1s" }}>
          🌸
        </div>
        <div className="absolute bottom-10 right-1/3 text-4xl animate-bounce" style={{ animationDelay: "1.5s" }}>
          ⭐
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              New Collection Dropped!
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight text-balance">
              Find Your Perfect <span className="text-primary">Cuddle Buddy</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto md:mx-0 text-pretty">
              Super soft, super cute, and ready for endless hugs! Our plushies are made with love for maximum snuggle
              power. 🥰
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="text-lg px-8 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow"
              >
                Shop Now 🛍️
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 rounded-full font-bold border-2 bg-transparent"
              >
                View Collections
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
              <img
                src="/cute-kawaii-pink-teddy-bear-plushie-with-bow.jpg"
                alt="Adorable pink teddy bear plushie"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
