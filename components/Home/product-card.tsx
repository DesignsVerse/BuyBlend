"use client"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Heart } from "lucide-react"
import { useState, useMemo, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { useWishlist } from "@/lib/wishlist/wishlist-context"

interface ProductCardProps {
  product: Product
  onSelectForCombo?: (product: Product) => void
  isSelected?: boolean
}

export function ProductCard({ product, onSelectForCombo, isSelected }: ProductCardProps) {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [previousImageIndex, setPreviousImageIndex] = useState(0)
  const [direction, setDirection] = useState(0) // 0: right, 1: left
  const { toggleItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product._id)
  const shadow = useMotionValue("0 4px 8px rgba(0, 0, 0, 0.05)")
  const springShadow = useSpring(shadow, { stiffness: 300, damping: 20 })

  const productSlug = useMemo(
    () =>
      product.slug?.current ||
      product.name?.toLowerCase().replace(/\s+/g, "-") ||
      "product",
    [product.slug, product.name]
  )

  // Media processing - Only Images
  const imageArray = useMemo(() => 
    (product.media || []).filter(media => media._type === "image"), 
    [product.media]
  )
  const hasMultipleImages = imageArray.length > 1
  
  const currentImage = useMemo(() => imageArray[currentMediaIndex], [imageArray, currentMediaIndex])
  const previousImage = useMemo(() => imageArray[previousImageIndex], [imageArray, previousImageIndex])
  
  const currentImageUrl = useMemo(() => {
    if (!currentImage) return "/fallback-product.png"
    try {
      return urlFor(currentImage.asset)?.width(400)?.height(400)?.url() ?? "/fallback-product.png"
    } catch {
      return "/fallback-product.png"
    }
  }, [currentImage])

  const previousImageUrl = useMemo(() => {
    if (!previousImage) return "/fallback-product.png"
    try {
      return urlFor(previousImage.asset)?.width(400)?.height(400)?.url() ?? "/fallback-product.png"
    } catch {
      return "/fallback-product.png"
    }
  }, [previousImage])

  const hasDiscount = useMemo(
    () => product.originalPrice && product.originalPrice !== product.price,
    [product.originalPrice, product.price]
  )

  const discountPercent = useMemo(
    () =>
      hasDiscount && product.originalPrice
        ? Math.round(
            (Math.abs(product.originalPrice - product.price) / Math.max(product.originalPrice, product.price)) *
              100
          )
        : 0,
    [hasDiscount, product.originalPrice, product.price]
  )

  // Auto-slide effect on hover - Only Images
  useEffect(() => {
    if (!isHovered || !hasMultipleImages) return

    const interval = setInterval(() => {
      setPreviousImageIndex(currentMediaIndex)
      setDirection(0) // Always slide in the same direction for consistency
      setCurrentMediaIndex((prev) => (prev + 1) % imageArray.length)
    }, 3000) // Change slide every 3 seconds for a more relaxed pace

    return () => clearInterval(interval)
  }, [isHovered, hasMultipleImages, imageArray.length, currentMediaIndex])

  // Reset to first image when not hovered
  useEffect(() => {
    if (!isHovered) {
      setCurrentMediaIndex(0)
    }
  }, [isHovered])

  // Variants for image animation
  const imageVariants = {
    enter: (direction: number) => ({
      x: direction === 0 ? 300 : -300,
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction === 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95
    })
  }

  return (
    <motion.div
      className="group relative h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      onHoverStart={() => {
        shadow.set("0 8px 16px rgba(0, 0, 0, 0.1)")
        setIsHovered(true)
      }}
      onHoverEnd={() => {
        shadow.set("0 4px 8px rgba(0, 0, 0, 0.05)")
        setIsHovered(false)
      }}
      style={{ boxShadow: springShadow }}
    >
      <div
        className="relative bg-white dark:bg-black shadow-md overflow-hidden border flex flex-col h-full"
      >
        {/* Image Slider - Only Photos (clickable area) */}
        <div className="relative">
          <Link href={`/collection/product/${productSlug}`} className="relative block aspect-square overflow-hidden">
            <div className="relative w-full h-full">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentMediaIndex}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 }
                }}
                className="absolute inset-0 w-full h-full"
              >
                {currentImage ? (
                  <Image
                    src={currentImageUrl}
                    alt={currentImage.alt || product.name}
                    fill
                    className={`object-cover ${
                      isMediaLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setIsMediaLoaded(true)}
                    priority={product.featured && currentMediaIndex === 0}
                  />
                ) : (
                  <Image 
                    src="/fallback-product.png" 
                    alt={product.name} 
                    fill 
                    className="object-cover" 
                  />
                )}
              </motion.div>
            </AnimatePresence>
            </div>
            {!isMediaLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
            )}
          </Link>

          {/* ❤️ Wishlist (separate from link) */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleItem({
                id: product._id,
                name: product.name,
                price: product.price,
                slug: productSlug,
                image: currentImageUrl,
              })
            }}
            className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center shadow-md z-20 transition-all duration-300 ${
              isWishlisted 
                ? "bg-red-500 text-white" 
                : "bg-white/80 text-gray-700 hover:bg-white hover:scale-110"
            }`}
            style={{ zIndex: 20 }}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* ⭐️ Static Rating */}
          <div
            className="absolute left-2 bottom-2 px-2 py-1 rounded-md bg-white/95 flex items-center gap-1 shadow text-xs font-semibold z-10 min-w-[40px]"
            style={{ boxShadow: "0 1px 4px 0 rgba(20,23,28,0.11)" }}
          >
            <span className="font-bold">4.5</span>
            <svg aria-label="star" fill="#10847e" width="15" height="15" viewBox="0 0 20 20">
              <path d="M10 15.27L16.18 19l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 4.73L4.82 19z" />
            </svg>
            <span className="font-bold text-gray-700 mx-1">|</span>
            <span className="font-bold text-black">255</span>
          </div>
        </div>

        {/* Content (clickable title/description only) */}
        <div className="p-4 flex flex-col gap-1 flex-grow">
          <Link href={`/collection/product/${productSlug}`} className="block">
            <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                {product.description}
              </p>
            )}
          </Link>

          {/* Price */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-m font-bold">
              ₹{(product.price ?? 0).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-xs line-through text-gray-500">
                ₹{(product.originalPrice ?? 0).toLocaleString("en-IN")}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs text-[#FF905A] font-medium bg-orange-50 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart / Combo (non-link area) */}
        <div className="p-4 pt-0">
          {onSelectForCombo ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onSelectForCombo(product)
              }}
              className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isSelected 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              {isSelected ? "✅ Added to Combo" : "Add to Combo"}
            </button>
          ) : (
            <AddToCartButton
              product={product}
              className="w-full py-2 bg-black text-white hover:bg-gray-800 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-[1.02]"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}