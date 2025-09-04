"use client"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Heart, Sparkles, Gem, Crown } from "lucide-react"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useWishlist } from "@/lib/wishlist/wishlist-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false)
  const { toggleItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product._id)

  const productSlug = useMemo(
    () =>
      product.slug?.current ||
      product.name?.toLowerCase().replace(/\s+/g, "-") ||
      "product",
    [product.slug, product.name]
  )

  const firstMedia = useMemo(() => product.media?.[0], [product.media])

  const mediaUrl = useMemo(() => {
    if (!firstMedia) return "/fallback-product.png"

    try {
      if (firstMedia._type === "image") {
        return (
          urlFor(firstMedia.asset)?.width(400)?.height(400)?.url() ??
          "/fallback-product.png"
        )
      }
      if (firstMedia._type === "file") {
        return urlFor(firstMedia.asset)?.url() ?? "/fallback-product.png"
      }
    } catch {
      return "/fallback-product.png"
    }
  }, [firstMedia])

  const hasDiscount = useMemo(
    () => product.originalPrice && product.originalPrice !== product.price,
    [product.originalPrice, product.price]
  )

  const discountPercent = useMemo(
    () =>
      hasDiscount && product.originalPrice
        ? Math.round(
            (Math.abs(product.originalPrice - product.price) /
              Math.max(product.originalPrice, product.price)) *
              100
          )
        : 0,
    [hasDiscount, product.originalPrice, product.price]
  )

  const isPriceIncreased = useMemo(
    () => product.originalPrice && product.originalPrice < product.price,
    [product.originalPrice, product.price]
  )

  const productTier = useMemo(
    () =>
      product.price > 1000
        ? "luxury"
        : product.price > 500
        ? "premium"
        : "standard",
    [product.price]
  )

  return (
    <motion.div
      className="group relative h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <div className="relative bg-white dark:bg-black rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col h-full">
        {/* Media Section */}
        <div className="relative aspect-square overflow-hidden">
          {firstMedia?._type === "image" ? (
            <Image
              src={mediaUrl ?? "/fallback-product.png"}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${
                isMediaLoaded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              } group-hover:scale-110`}
              onLoad={() => setIsMediaLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={product.featured}
            />
          ) : firstMedia?._type === "file" ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsMediaLoaded(true)}
            />
          ) : (
            <Image
              src="/fallback-product.png"
              alt={product.name}
              fill
              className="object-cover"
            />
          )}

          {!isMediaLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
          )}

          {/* ✅ Hide quick actions on mobile */}
          <div className="absolute top-2 right-2 gap-1 hidden md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md"
              asChild
            >
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full shadow-md ${
                isWishlisted
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/80 hover:bg-white text-gray-700"
              }`}
              onClick={() =>
                toggleItem({
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  slug: productSlug,
                  image: mediaUrl,
                })
              }
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
              />
            </Button>
          </div>

          {/* ✅ Hide badges on mobile */}
          <div className="absolute top-2 left-2 space-y-1 hidden md:block">
          {hasDiscount && (
  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black text-white">
    {discountPercent}% Off
  </span>
)}

            {product.inventory === 0 && (
              <span className="bg-gray-600 text-white px-2 py-1 text-xs font-semibold rounded-full">
                Sold Out
              </span>
            )}
            
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-2 flex-grow">
          {/* ✅ Hide category/desc on mobile */}
          <span className="text-xs text-gray-500 uppercase tracking-wide hidden md:block">
            {product.category?.name}
          </span>

          <Link href={`/products/${productSlug}`}>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-2 min-h-[2rem]">
              {product.name}
            </h3>
          </Link>

          

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              {hasDiscount ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Rs.
                      {isPriceIncreased
                        ? product.originalPrice
                        : product.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      Rs.
                      {isPriceIncreased
                        ? product.price
                        : product.originalPrice}
                    </span>
                  </div>
                  {!isPriceIncreased && (
                    <span className="text-xs text-green-600">
                      Save Rs. {product.originalPrice! - product.price}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Rs. {product.price}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-0">
          <AddToCartButton
            product={product}
            disabled={product.inventory === 0 || !product.inStock}
            className="w-full py-2 bg-black text-white hover:bg-gray-800 rounded-md text-sm font-medium transition-colors"
          />
        </div>
      </div>
    </motion.div>
  )
}
