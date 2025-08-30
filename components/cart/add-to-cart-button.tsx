"use client"

import { useState, useCallback } from "react"
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
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle")
  const { addItem, trackActivity, state } = useCart()
  const { toast } = useToast()

  const getImageUrl = useCallback(() => {
    if (!product.images?.[0]) return "/fallback-product.png"
    
    const image = product.images[0]
    if (typeof image === "string") return image
    
    try {
      return urlFor(image).width(200).height(200).url() ?? "/fallback-product.png"
    } catch {
      return "/fallback-product.png"
    }
  }, [product.images])

  const handleAddToCart = useCallback(async () => {
    if (disabled || status !== "idle") return

    setStatus("adding")

    try {
      const imageUrl = getImageUrl()

      // Add item to cart
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        slug: product.slug?.current || product.name.toLowerCase().replace(/\s+/g, '-'),
        image: imageUrl,
      })

      // Track cart activity
      trackActivity()

      // Show success toast
      setStatus("added")
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        className: "bg-green-50 border-green-200 text-green-900",
        duration: 3000,
      })

      // Send analytics
      try {
        await fetch("/api/analytics/add-to-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      }

      // Reset status after 2 seconds
      setTimeout(() => setStatus("idle"), 2000)

    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
      setStatus("idle")
    }
  }, [disabled, status, addItem, trackActivity, state, product, toast, getImageUrl])

  const buttonContent = {
    idle: {
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      text: disabled ? "Out of Stock" : "Add to Cart",
    },
    adding: {
      icon: <Loader2 className="h-4 w-4 mr-2 animate-spin" />,
      text: "Adding...",
    },
    added: {
      icon: <Check className="h-4 w-4 mr-2" />,
      text: "Added",
    },
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || status !== "idle"}
      className={cn(
        "w-full py-3 rounded-lg font-medium transition-all duration-200",
        "bg-gradient-to-r from-gray-900 to-gray-800 text-white",
        "hover:from-gray-800 hover:to-gray-700",
        "disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
        status === "added" && "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600",
        "shadow-sm hover:shadow-md active:shadow-sm",
        className
      )}
      size="lg"
      aria-label={buttonContent[status].text}
    >
      {buttonContent[status].icon}
      {buttonContent[status].text}
    </Button>
  )
}