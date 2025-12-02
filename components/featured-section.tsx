"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeaturedSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary to-accent/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/cute-pastel-pink-fluffy-cat-plushie-kawaii.jpg"
                alt="Fluffy cat plushie"
                className="rounded-2xl shadow-lg hover:scale-105 transition-transform"
              />
              <img
                src="/cute-pastel-blue-bunny-plushie-kawaii-sleeping.jpg"
                alt="Sleeping bunny plushie"
                className="rounded-2xl shadow-lg mt-8 hover:scale-105 transition-transform"
              />
              <img
                src="/cute-pastel-yellow-duck-plushie-kawaii.jpg"
                alt="Yellow duck plushie"
                className="rounded-2xl shadow-lg -mt-4 hover:scale-105 transition-transform"
              />
              <img
                src="/cute-pastel-purple-owl-plushie-kawaii.jpg"
                alt="Purple owl plushie"
                className="rounded-2xl shadow-lg mt-4 hover:scale-105 transition-transform"
              />
            </div>
          </div>

          <div className="text-center md:text-left order-1 md:order-2">
            <div className="flex items-center gap-1 justify-center md:justify-start mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm font-semibold text-muted-foreground ml-2">4.9 (2,847 reviews)</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 text-balance">
              Why Everyone Loves Our Plushies 🥹
            </h3>
            <ul className="space-y-4 text-left mb-8">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🌟</span>
                <div>
                  <strong className="text-foreground">Super Soft Materials</strong>
                  <p className="text-sm text-muted-foreground">
                    Made with premium plush fabric that{"'"}s gentle on skin
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">💝</span>
                <div>
                  <strong className="text-foreground">Perfect for All Ages</strong>
                  <p className="text-sm text-muted-foreground">Safe, durable, and loved by kids and adults alike</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <strong className="text-foreground">Gift-Ready Packaging</strong>
                  <p className="text-sm text-muted-foreground">Beautiful packaging that makes gifting extra special</p>
                </div>
              </li>
            </ul>
            <Button size="lg" className="rounded-full font-bold text-lg px-8">
              See All Reviews ⭐
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
