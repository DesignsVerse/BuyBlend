"use client"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Eye, Heart, Sparkles, Gem, Crown } from "lucide-react"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useWishlist } from "@/lib/wishlist/wishlist-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { toggleItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product._id)

  // Memoized values
  const productSlug = useMemo(() => 
    product.slug?.current || 
    product.name?.toLowerCase().replace(/\s+/g, '-') || 
    'product',
    [product.slug, product.name]
  )

  const imageUrl = useMemo(() => {
    if (!product.images?.[0]) return "/fallback-product.png"
    
    const image = product.images[0]
    if (typeof image === "string") return image
    
    try {
      return urlFor(image)?.width(400)?.height(400)?.url() ?? "/fallback-product.png"
    } catch {
      return "/fallback-product.png"
    }
  }, [product.images])

  const hasDiscount = useMemo(() => 
    product.originalPrice && product.originalPrice !== product.price,
    [product.originalPrice, product.price]
  )

  const discountPercent = useMemo(() => 
    hasDiscount && product.originalPrice
      ? Math.round(((Math.abs(product.originalPrice - product.price)) / 
         Math.max(product.originalPrice, product.price)) * 100)
      : 0,
    [hasDiscount, product.originalPrice, product.price]
  )

  const isPriceIncreased = useMemo(() => 
    product.originalPrice && product.originalPrice < product.price,
    [product.originalPrice, product.price]
  )

  const productTier = useMemo(() => 
    product.price > 1000 ? "luxury" : 
    product.price > 500 ? "premium" : "standard",
    [product.price]
  )

  return (
    <motion.div 
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      {/* Tier Badges */}
      {productTier === "luxury" && (
        <span className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
          <Crown className="w-3 h-3 mr-1" /> Luxury
        </span>
      )}
      {productTier === "premium" && (
        <span className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
          <Gem className="w-3 h-3 mr-1" /> Premium
        </span>
      )}

      <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
            onLoad={() => setIsImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={product.featured}
          />

          {/* Loading Skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md"
              asChild
            >
              <Link href={`/products/${productSlug}`}>
                <Eye className="w-4 h-4 text-gray-700" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full shadow-md ${
                isWishlisted 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white/80 hover:bg-white text-gray-700'
              }`}
              onClick={() => toggleItem({
                id: product._id,
                name: product.name,
                price: product.price,
                slug: productSlug,
                image: imageUrl,
              })}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {hasDiscount && (
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isPriceIncreased ? 'bg-red-500' : 'bg-green-500'
              } text-white`}>
                {isPriceIncreased ? `+${discountPercent}%` : `-${discountPercent}%`}
              </span>
            )}
            {product.inventoryCount === 0 && (
              <span className="bg-gray-600 text-white px-2 py-1 text-xs font-semibold rounded-full">
                Sold Out
              </span>
            )}
            {product.featured && (
              <span className="bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded-full flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> Featured
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-2">
          {/* Category */}
          {product.category?.name && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}

          {/* Product Name */}
          <Link href={`/products/${productSlug}`}>
            <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              {hasDiscount ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{isPriceIncreased ? product.originalPrice : product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{isPriceIncreased ? product.price : product.originalPrice}
                    </span>
                  </div>
                  {!isPriceIncreased && (
                    <span className="text-xs text-green-600">
                      Save ₹{product.originalPrice! - product.price}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-4 pt-0">
          <AddToCartButton
            product={product}
            disabled={product.inventoryCount === 0 || !product.inStock}
            className="w-full py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-md text-sm font-medium transition-colors"
          />
        </div>
      </div>
    </motion.div>
  )
}