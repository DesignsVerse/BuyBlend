"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, trackActivity, state } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      let imageUrl: string | undefined

      if (product.images?.[0]) {
        const image = product.images[0]

        // Check if it's a regular file path (mock data) or Sanity asset
        if (typeof image === "string" && image.startsWith("/")) {
          // Regular file path from mock data
          imageUrl = image
        } else {
          // Sanity asset reference
          try {
            imageUrl = urlFor(image).width(200).height(200).url()
          } catch (error) {
            console.warn("Failed to process Sanity image, using fallback:", error)
            imageUrl = "/diverse-products-still-life.png"
          }
        }
      }

      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        slug: product.slug.current,
        image: imageUrl,
      })

      // Track activity
      trackActivity()

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })

      await fetch("/api/analytics/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: state.sessionId,
          userId: state.userId,
          productId: product._id,
          productName: product.name,
          price: product.price,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={disabled || isAdding} className="w-full">
      {isAdding ? "Adding..." : disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
}
