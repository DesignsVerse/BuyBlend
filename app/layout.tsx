
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { CartProvider } from "@/lib/cart/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "react-day-picker"
import Head from "next/head"
import { SiteFooter } from "@/components/Home/footer"
import { SiteHeader } from "@/components/Home/header"
import { WishlistProvider } from "@/lib/wishlist/wishlist-context"
import PageLoader from "@/components/ui/page-loader"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "BuyBlend.in",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased" cz-shortcut-listen="true">
        <CartProvider >
          <WishlistProvider>
            <Suspense fallback={null}>
            </Suspense>
            <SiteHeader/>
            <PageLoader />

            {children}
            <Toaster />
            <SiteFooter/>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
