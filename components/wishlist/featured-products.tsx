"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"
import { Heart } from "lucide-react"
import { useWishlist } from "@/lib/wishlist/wishlist-context"

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toggleItem, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured')
        if (response.ok) {
          const data = await response.json()
          setFeaturedProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="aspect-square rounded-lg bg-gray-100 animate-pulse" />
            <div className="mt-3 h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="mt-2 h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {featuredProducts.slice(0, 4).map((product) => {
        const productSlug = product.slug?.current || product.name?.toLowerCase().replace(/\s+/g, "-") || "product"
        const isWishlisted = isInWishlist(product._id)
        
        // Get first image from media
        const firstImage = product.media?.find(media => media._type === "image")
        const imageUrl = firstImage ? urlFor(firstImage.asset)?.width(400)?.height(400)?.url() : "/placeholder.svg"
        
        const hasDiscount = product.originalPrice && product.originalPrice !== product.price
        const discountPercent = hasDiscount && product.originalPrice
          ? Math.round((Math.abs(product.originalPrice - product.price) / Math.max(product.originalPrice, product.price)) * 100)
          : 0

        return (
          <div key={product._id} className="rounded-xl border border-gray-200 bg-white overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-square">
              <Link href={`/collection/product/${productSlug}`}>
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Wishlist button */}
              <button
                onClick={() => toggleItem({
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  slug: productSlug,
                  image: imageUrl,
                })}
                className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center shadow-md z-20 transition-all duration-300 ${
                  isWishlisted 
                    ? "bg-red-500 text-white" 
                    : "bg-white/80 text-gray-700 hover:bg-white hover:scale-110"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              {/* Discount badge */}
              {hasDiscount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                  {discountPercent}% OFF
                </div>
              )}
            </div>
            
            <div className="p-3">
              <Link href={`/collection/product/${productSlug}`}>
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="text-xs line-through text-gray-500">
                    ₹{product.originalPrice?.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


