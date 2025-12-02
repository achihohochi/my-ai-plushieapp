import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"] })

export const metadata: Metadata = {
  title: "Cuddle Corner - Adorable Plushies",
  description: "Find your perfect cuddle buddy! Soft, huggable plushies for everyone.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${nunito.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
