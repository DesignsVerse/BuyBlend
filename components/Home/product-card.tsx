"use client"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Eye, Heart, Sparkles, Gem, Crown } from "lucide-react"
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
    if (!product.images?.[0]) return "/diverse-products-still-life.png"
    
    const image = product.images[0]
    if (typeof image === "string") return image
    if (!image) return "/diverse-products-still-life.png"

    try {
      return urlFor(image).width(400).height(400).url()
    } catch (error) {
      console.log("Error processing image:", error)
      return "/diverse-products-still-life.png"
    }
  }

  const imageUrl = getImageUrl()
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const productTier = product.price > 1000 ? "luxury" : product.price > 500 ? "premium" : "standard"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      {/* Premium Tier Badge - Smaller */}
      {productTier === "luxury" && (
        <div className="absolute -top-2 -right-2 z-30 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center">
          <Crown className="h-3 w-3 mr-1" />
          Luxury
        </div>
      )}
      
      {productTier === "premium" && (
        <div className="absolute -top-2 -right-2 z-30 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center">
          <Gem className="h-3 w-3 mr-1" />
          Premium
        </div>
      )}

      <Card className="overflow-hidden border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg relative h-full flex flex-col">
        {/* Metallic Accent Border */}
        <div className="absolute inset-0 rounded-lg border border-gray-100/60 pointer-events-none" />
        
        <div 
          className="relative aspect-square overflow-hidden rounded-t-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Product Image */}
          <Image
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className={`object-cover transition-all duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
            onLoad={() => setIsImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Loading State */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/10 flex items-center justify-center space-x-2 backdrop-blur-sm z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white text-gray-800 h-8 w-8 shadow-md"
                    asChild
                  >
                    <Link href={`/products/${product.slug.current}`}>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Button 
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-8 w-8 shadow-md ${
                      activeWishlist 
                        ? 'bg-red-500/90 hover:bg-red-500 text-white' 
                        : 'bg-white/90 hover:bg-white text-gray-800'
                    }`}
                    onClick={() => setActiveWishlist(!activeWishlist)}
                  >
                    <Heart className={`h-3 w-3 ${activeWishlist ? 'fill-current' : ''}`} />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {hasDiscount && (
              <div className="bg-red-500 text-white px-2 py-1 text-[10px] font-bold rounded-full">
                -{discountPercent}%
              </div>
            )}
            
            {product.inventory === 0 && (
              <div className="bg-gray-600 text-white px-2 py-1 text-[10px] font-medium rounded-full">
                Sold Out
              </div>
            )}

            {product.featured && (
              <div className="bg-blue-500 text-white px-2 py-1 text-[10px] font-bold rounded-full flex items-center">
                <Sparkles className="h-2 w-2 mr-1" />
                Featured
              </div>
            )}
          </div>
        </div>

        {/* Card Content - Compact */}
        <CardContent className="p-3 flex-1 flex flex-col">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
              {product.category.name}
            </p>
          )}
          
          {/* Product Name */}
          <Link href={`/products/${product.slug.current}`}>
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-2 flex-1">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-900">${product.price}</span>
              {hasDiscount && (
                <span className="text-xs text-gray-500 line-through">${product.compareAtPrice}</span>
              )}
            </div>
          </div>
        </CardContent>

        {/* Add to Cart */}
        <CardFooter className="p-3 pt-0">
          <AddToCartButton 
            product={product} 
            disabled={product.inventory === 0}
            className="w-full text-xs py-2 bg-black hover:bg-gray-800 text-white transition-colors rounded-md"
          />
        </CardFooter>
      </Card>
    </motion.div>
  )
}