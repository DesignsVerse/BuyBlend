"use client"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Eye, Heart, Sparkles, ZoomIn, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [activeWishlist, setActiveWishlist] = useState(false)

  const getImageUrl = () => {
    if (!product.images?.[0]) {
      return "/diverse-products-still-life.png"
    }

    const image = product.images[0]

    if (typeof image === "string") {
      return image
    }

    if (!image) {
      return "/diverse-products-still-life.png"
    }

    try {
      return urlFor(image).width(600).height(600).url()
    } catch (error) {
      console.log("[v0] Error processing Sanity image, using fallback:", error)
      return "/diverse-products-still-life.png"
    }
  }

  const imageUrl = getImageUrl()
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      {/* Premium Badge */}
      {product.featured && (
        <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Premium
        </div>
      )}

      <Card className="overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 rounded-lg relative">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
        
        <div 
          className="relative aspect-square overflow-hidden rounded-t-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Product Image with Gradient Overlay */}
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className={`object-cover transition-all duration-700 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} group-hover:scale-105`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Loading Skeleton with Shimmer */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-shimmer" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Quick Actions Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/20 flex items-center justify-center space-x-3"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full bg-white/95 hover:bg-white text-gray-800 backdrop-blur-sm h-12 w-12 shadow-md hover:shadow-lg transition-all"
                    asChild
                  >
                    <Link href={`/products/${product.slug.current}`}>
                      <ZoomIn className="h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className={`rounded-full backdrop-blur-sm h-12 w-12 shadow-md hover:shadow-lg transition-all ${
                      activeWishlist 
                        ? 'bg-red-500/95 hover:bg-red-500 text-white' 
                        : 'bg-white/95 hover:bg-white text-gray-800'
                    }`}
                    onClick={() => setActiveWishlist(!activeWishlist)}
                  >
                    <Heart className={`h-5 w-5 ${activeWishlist ? 'fill-current' : ''}`} />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {hasDiscount && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md"
              >
                -{discountPercent}% OFF
              </motion.div>
            )}
            
            {product.inventory === 0 && (
              <div className="bg-gray-700/95 text-white px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-5 relative">
          {/* Category with subtle background */}
          {product.category && (
            <div className="inline-block bg-gray-100 rounded-full px-3 py-1 mb-3">
              <p className="text-xs text-gray-600 font-medium">
                {product.category.name}
              </p>
            </div>
          )}
          
          {/* Product Name with hover effect */}
          <Link href={`/products/${product.slug.current}`}>
            <h3 className="font-sans text-lg font-semibold text-gray-900 mb-2 hover:text-amber-600 transition-colors duration-300 line-clamp-2 group-hover:translate-x-1 transition-transform">
              {product.name}
            </h3>
          </Link>

          {/* Description with fade effect */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px] leading-relaxed"
          >
            {product.description}
          </motion.p>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">${product.price}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">${product.compareAtPrice}</span>
              )}
            </div>
            
            {/* View Details Link */}
            <Link href={`/products/${product.slug.current}`} className="flex items-center text-xs text-amber-600 hover:text-amber-700 font-medium">
              Details
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <AddToCartButton 
            product={product} 
            disabled={product.inventory === 0}
          />
        </CardFooter>
      </Card>
    </motion.div>
  )
}