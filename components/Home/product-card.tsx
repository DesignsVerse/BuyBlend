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
  onSelectForCombo?: (product: Product) => void
  isSelected?: boolean
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
          urlFor(firstMedia.asset)?.width(400)?.height(400)?.url() ?? "/fallback-product.png"
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
              className={`object-cover transition-transform ${isMediaLoaded ? "opacity-100" : "opacity-0"}`}
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

          {/* ⭐️ Static Rating badge - left bottom */}
          <div className="absolute left-2 bottom-2 px-2 py-1 rounded-md bg-white/95 flex items-center gap-1 shadow text-xs font-semibold z-10 min-w-[40px]"
               style={{ boxShadow: "0 1px 4px 0 rgba(20,23,28,0.11)" }}>
            <span className=" font-bold">4.5</span>
            <svg aria-label="star" fill="#10847e" width="15" height="15" viewBox="0 0 20 20">
              <path d="M10 15.27L16.18 19l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 4.73L4.82 19z"/>
            </svg>
            <span className="font-bold text-gray-700 mx-1">|</span>
            <span className="font-bold text-black">255</span>
          </div>
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
            <span className="text-m font-bold">₹{(product.originalPrice ?? 0).toLocaleString("en-IN")}</span>
            {hasDiscount && (
              <span className="text-xs line-through text-gray-500">
                ₹{(product.price ?? 0).toLocaleString("en-IN")}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs text-[#FF905A]">({discountPercent}% OFF)</span>
            )}
          </div>
        </div>

        <div className="p-4 pt-0">
          {onSelectForCombo ? (
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
