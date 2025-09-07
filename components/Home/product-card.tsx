"use client"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Heart } from "lucide-react"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useWishlist } from "@/lib/wishlist/wishlist-context"

interface ProductCardProps {
  product: Product
  onSelectForCombo?: (product: Product) => void  // 👈 new prop
  isSelected?: boolean                           // 👈 new prop
}

export function ProductCard({ product, onSelectForCombo, isSelected }: ProductCardProps) {
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

  return (
    <motion.div
      className="group relative h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative bg-white dark:bg-black shadow-md overflow-hidden border flex flex-col h-full">
        {/* Media */}
        <div className="relative aspect-square overflow-hidden">
          {firstMedia?._type === "image" ? (
            <Image
              src={mediaUrl ?? "/fallback-product.png"}
              alt={product.name}
              fill
              className={`object-cover transition-transform ${
                isMediaLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsMediaLoaded(true)}
              priority={product.featured}
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

          {/* ❤️ Wishlist */}
          <button
            onClick={() =>
              toggleItem({
                id: product._id,
                name: product.name,
                price: product.price,
                slug: productSlug,
                image: mediaUrl,
              })
            }
            className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center shadow-md ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-700"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-1 flex-grow">
          <Link href={`/products/${productSlug}`}>
            <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
            {product.description && (
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                {product.description}
              </p>
            )}
          </Link>

          {/* Price */}
          <div className="flex items-center gap-1.5">
            <span className="text-m font-bold">₹{product.price.toLocaleString("en-IN")}</span>
            {hasDiscount && (
              <span className="text-xs line-through text-gray-500">
                ₹{product.originalPrice?.toLocaleString("en-IN")}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs text-[#FF905A]">({discountPercent}% OFF)</span>
            )}
          </div>
        </div>

        <div className="p-4 pt-0">
  {onSelectForCombo ? (
    // ✅ Combo ka apna button (stock check ignore)
    <button
      onClick={() => onSelectForCombo(product)}
      className={`w-full py-2 rounded-md text-sm font-medium transition ${
        isSelected
          ? "bg-green-500 text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {isSelected ? "✅ Added to Combo" : "Add to Combo"}
    </button>
  ) : (
    // ✅ Normal AddToCart (stock check chalta rahega)
    <AddToCartButton
      product={product}
      className="w-full py-2 bg-black text-white hover:bg-gray-800 rounded-md text-sm font-medium"
    />
  )}
</div>

      </div>
    </motion.div>
  )
}
