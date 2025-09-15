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
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void // ✅ added support
}

export function AddToCartButton({ product, disabled, className, onClick }: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle")
  const { addItem, trackActivity, state } = useCart()
  const { toast } = useToast()

  // ✅ Product ka image URL nikalna
  const getImageUrl = useCallback(() => {
    const firstMedia = product.media?.[0]
    if (!firstMedia) return "/fallback-product.png"

    try {
      if (firstMedia._type === "image") {
        return urlFor(firstMedia.asset)?.width(200)?.height(200)?.url() ?? "/fallback-product.png"
      }

      if (firstMedia._type === "file") {
        return urlFor(firstMedia.asset)?.url() ?? "/fallback-product.png"
      }

      return "/fallback-product.png"
    } catch (error) {
      console.error("Error generating image URL:", error)
      return "/fallback-product.png"
    }
  }, [product.media])

  // ✅ Add to cart handler
  const handleAddToCart = useCallback(
    async (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e as React.MouseEvent<HTMLButtonElement>) // custom click bhi chalega
      if (disabled || status !== "idle") return

      setStatus("adding")

      try {
        const imageUrl = getImageUrl()

        // add item to cart
        addItem({
          id: product._id,
          name: product.name || "Unnamed Product",
          price: product.price || 0,
          slug:
            product.slug?.current ||
            product.name?.toLowerCase().replace(/\s+/g, "-") ||
            product._id,
          image: imageUrl,
        })

        // track activity
        trackActivity()

        setStatus("added")
        toast({
          title: "Added to Cart",
          description: `${product.name || "Item"} has been added to your cart.`,
          className: "bg-gray-50 border-gray-200 text-black",
          duration: 3000,
        })

        // send analytics
        try {
          await fetch("/api/analytics/add-to-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: state.sessionId,
              userId: state.userId,
              productId: product._id,
              productName: product.name || "Unnamed Product",
              price: product.price || 0,
              timestamp: new Date().toISOString(),
            }),
          })
        } catch (error) {
          console.error("Analytics error:", error)
        }

        // reset after delay
        setTimeout(() => setStatus("idle"), 2000)
      } catch (error) {
        console.error("Error adding to cart:", error)
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          className: "bg-red-50 border-red-200 text-red-900",
          duration: 3000,
        })
        setStatus("idle")
      }
    },
    [disabled, status, addItem, trackActivity, state, product, toast, getImageUrl, onClick]
  )

  // ✅ Button UI states
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
        "w-full py-3 rounded-sm font-medium transition-all duration-200",
        "bg-black text-white hover:bg-gray-800",
        "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
        status === "added" && "bg-gray-700 hover:bg-gray-600",
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
