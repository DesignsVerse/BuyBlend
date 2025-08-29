"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"
import { ShoppingBag, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
  className?: string
}

export function AddToCartButton({ product, disabled, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem, trackActivity, state } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (disabled || isAdding || isAdded) return
    
    setIsAdding(true)

    try {
      let imageUrl: string | undefined

      // Handle image processing
      if (product.images?.[0]) {
        const image = product.images[0]

        if (typeof image === "string") {
          // Regular file path from mock data
          imageUrl = image
        } else if (image && typeof image === "object") {
          // Sanity asset reference
          try {
            imageUrl = urlFor(image).width(200).height(200).url()
          } catch (error) {
            console.warn("Failed to process Sanity image, using fallback:", error)
            imageUrl = "/diverse-products-still-life.png"
          }
        }
      } else {
        // Fallback if no image
        imageUrl = "/diverse-products-still-life.png"
      }

      // Add item to cart
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        slug: product.slug.current,
        image: imageUrl,
      })

      // Track activity
      trackActivity()

      // Show success feedback
      setIsAdded(true)
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your shopping cart.`,
        className: "bg-green-50 border-green-200 text-green-900"
      })

      // Send analytics (if applicable)
      try {
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
        console.error("Analytics error:", error)
        // Don't show error to user for analytics failures
      }

      // Reset added state after 2 seconds
      setTimeout(() => setIsAdded(false), 2000)

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

  const getButtonContent = () => {
    if (isAdded) {
      return (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added
        </>
      )
    }
    
    if (isAdding) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Adding...
        </>
      )
    }
    
    if (disabled) {
      return (
        <>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Out of Stock
        </>
      )
    }
    
    return (
      <>
        <ShoppingBag className="h-4 w-4 mr-2" />
        Add to Cart
      </>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding || isAdded}
      className={cn(
        "w-full rounded-lg py-3.5 transition-all duration-300 font-medium",
        "bg-gradient-to-r from-gray-900 to-black text-white",
        "hover:from-gray-800 hover:to-gray-900",
        "disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed",
        "shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0",
        "border border-gray-800/30",
        isAdded && "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
        className
      )}
      size="lg"
    >
      {getButtonContent()}
    </Button>
  )
}