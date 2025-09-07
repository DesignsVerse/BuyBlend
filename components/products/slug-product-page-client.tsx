"use client"

import { useState } from "react"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Star, Truck, Shield, RotateCw, Check, Heart } from "lucide-react"
import { ProductMediaSlider } from "@/components/products/product-media-slider"
import { TestimonialSection } from "@/components/products/TestimonialSection"
import { FeaturedProductsSection } from "@/components/Home/bestseller"
import CustomProductCard from "@/components/Home/feature"
import RecommendedProducts from "@/components/products/recommended-products"
import ReviewSection from "@/components/products/user-review-section"
import CustomerLove from "@/components/products/customer-images"
import type { Product } from "@/lib/sanity/types"

export default function ProductPageClient({
  product,
  featuredProducts,
  allProducts,
}: {
  product: Product
  featuredProducts: Product[]
  allProducts: Product[]
}) {
  const [showHighlights, setShowHighlights] = useState(false)

  const effectiveOriginalPrice = product.compareAtPrice || product.originalPrice
  const hasDiscount = effectiveOriginalPrice && effectiveOriginalPrice !== product.price
  const discountPercent =
    effectiveOriginalPrice && product.price
      ? Math.round(((effectiveOriginalPrice - product.price) / effectiveOriginalPrice) * 100)
      : 0

  const isOutOfStock = !product.inStock || product.inventory <= 0
  const isLowStock = product.inStock && product.inventory > 0 && product.inventory <= 10

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Media */}
            <div className="space-y-4">
              <ProductMediaSlider mediaItems={product.media || []} product={product} />
            </div>

            {/* Details */}
            <div className="flex flex-col space-y-3">
              {/* Name, Rating, Price, Stock etc. */}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xl line-through text-gray-500">
                      ₹{effectiveOriginalPrice?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-semibold bg-black text-white px-2 py-1 rounded">
                      {discountPercent}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Cart + Wishlist */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <AddToCartButton
                      product={product}
                      disabled={isOutOfStock}
                      className="w-full py-3 text-base rounded-lg"
                    />
                  </div>
                  <button className="flex-1 flex items-center justify-center py-3 text-base border rounded-lg text-gray-700 hover:text-red-500 hover:border-red-500 transition">
                    <Heart className="h-5 w-5 mr-2" />
                    Wishlist
                  </button>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>
                    Free delivery by{" "}
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>

              {/* ✅ Product Highlights - Dropdown */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="py-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowHighlights(!showHighlights)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <h2 className="text-lg font-semibold text-gray-900">Product Highlights</h2>
                    <svg
                      className={`h-5 w-5 transform transition-transform ${
                        showHighlights ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showHighlights && (
                    <ul className="mt-3 space-y-2">
                      {product.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ✅ Desktop Box */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="hidden lg:block mt-12">
              <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
                <button
                  onClick={() => setShowHighlights(!showHighlights)}
                  className="flex justify-between items-center w-full p-4 text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Product Highlights</h2>
                  <svg
                    className={`h-5 w-5 transform transition-transform ${
                      showHighlights ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showHighlights && (
                  <ul className="px-6 pb-4 space-y-2">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Reviews, Recommended etc */}
          <div className="mt-16">
            <ReviewSection productName={product.name} />
          </div>
          <div className="mt-16">
            <RecommendedProducts type={product.type ?? ""} currentSlug={product.slug?.current ?? ""} />
          </div>
          <div className="mt-16">
            <CustomProductCard />
          </div>
          <div className="mt-16">
            <TestimonialSection productSlug={product.slug?.current ?? ""} />
          </div>
          <div className="mt-16">
            <FeaturedProductsSection featuredProducts={featuredProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}
