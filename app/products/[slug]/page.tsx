import { notFound } from "next/navigation"
import Image from "next/image"
import { client, queries, urlFor } from "@/lib/sanity/client"
import type { Product } from "@/lib/sanity/types"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Star, Truck, Shield, RotateCw, Check, Heart, Share2 } from "lucide-react"
import { ProductMediaSlider } from "@/components/products/product-media-slider"
import { TestimonialSection } from "@/components/products/TestimonialSection"
import { FeaturedProductsSection } from "@/components/Home/bestseller"
import CustomProductCard from "@/components/Home/feature"

interface ProductPageProps {
  params: {
    slug: string
  }
}

// ✅ Image / Video URL Generator
function getMediaUrl(mediaItem: any, width = 800, height = 800): string {
  if (!mediaItem) return "/placeholder.svg"

  // Image from Sanity
  if (mediaItem._type === "image" && mediaItem.asset) {
    try {
      return urlFor(mediaItem).width(width).height(height).url()
    } catch (err) {
      console.error("Error generating image URL:", err)
      return "/placeholder.svg"
    }
  }

  // File (video)
  if (mediaItem._type === "file" && mediaItem.asset?._ref) {
    return `/api/media/${mediaItem.asset._ref}`
  }

  return "/placeholder.svg"
}

// ✅ Fetch product by slug
async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await client.fetch(queries.productBySlug, { slug })
  } catch (error) {
    console.error("Error fetching from Sanity:", error)
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) notFound()

  // ✅ Media Handling
  const mediaItems = product.media || []

  // Handle pricing: prefer compareAtPrice over originalPrice for discounts
  const effectiveOriginalPrice = product.compareAtPrice || product.originalPrice
  const hasDiscount = effectiveOriginalPrice && effectiveOriginalPrice !== product.price
  const discountPercent =
    effectiveOriginalPrice && product.price
      ? Math.round(
        ((product.price - effectiveOriginalPrice) / product.price) * 100
      )
      : 0
  const isPriceIncreased =
    effectiveOriginalPrice && effectiveOriginalPrice < product.price

  // Check stock status
  const isOutOfStock = !product.inStock || product.inventory <= 0
  const isLowStock = product.inStock && product.inventory > 0 && product.inventory <= 10

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li>Home</li>
            <li>/</li>
            <li>Products</li>
            {product.category && product.category.name && (
              <>
                <li>/</li>
                <li>{product.category.name}</li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <ProductMediaSlider mediaItems={mediaItems} product={product} />
          </div>

          {/* ✅ Product Details Section */}
          <div className="flex flex-col space-y-6">
            <div>
              {/* Category, Type & Tags */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {product.category && product.category.name && (
                  <span className="text-sm text-blue-600 font-medium capitalize">
                    {product.category.name}
                  </span>
                )}
                {product.type && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.type}
                  </span>
                )}
                {product.tags && product.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Product name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating (placeholder) */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(42 reviews)</span>
                <span className="text-sm text-blue-600 font-medium ml-4">142 purchased</span>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-3 mb-6">
                {hasDiscount ? (
                  <>
                    {/* Original Price (line-through) */}
                    <span className="text-xl line-through text-gray-500">
                      ₹{effectiveOriginalPrice?.toLocaleString("en-IN")}
                    </span>

                    {/* Current Price (highlighted) */}
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {/* Discount Badge */}
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded ${isPriceIncreased
                        ? "bg-green-100 text-green-600"
                        : "bg-green-100 text-green-600"
                        }`}
                    >
                      {isPriceIncreased
                        ? `${discountPercent}% OFF`
                        : `${discountPercent}% OFF`}
                    </span>
                  </>
                ) : (
                  // If no discount, just show price
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <div className="text-red-600 font-medium flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    Out of Stock
                  </div>
                ) : isLowStock ? (
                  <div className="text-amber-600 font-medium flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                    Only {product.inventory} left in stock
                  </div>
                ) : (
                  <div className="text-green-600 font-medium flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    In Stock ({product.inventory} available)
                  </div>
                )}
              </div>

              {/* Product Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Product Highlights</h2>
                  <ul className="space-y-2">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Style Tips */}
              {product.styleTips && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2 text-blue-800">Style Tips</h2>
                  <p className="text-blue-700 italic">"{product.styleTips}"</p>
                </div>
              )}

              {/* Product Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "No description available for this product."}
                </p>
              </div>

              {/* Variants Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 py-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold">Options</h3>
                  {product.variants.map((variant, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-2">{variant.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-blue-500 transition-colors">
                          {variant.value}
                          {variant.price && (
                            <span className="ml-2 text-sm text-gray-500">+₹{variant.price.toLocaleString('en-IN')}</span>
                          )}
                        </button>
                      </div>
                      {variant.inventory !== undefined && (
                        <p className="text-sm text-gray-500 mt-1">
                          {variant.inventory > 0
                            ? `${variant.inventory} available`
                            : "Out of stock"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="pt-4 border-t border-gray-200">
              <AddToCartButton product={product} disabled={isOutOfStock} />

              {/* Delivery Estimate */}
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-2" />
                <span>Free delivery expected by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Free Shipping</span>
                <span className="text-xs text-gray-500">On orders over ₹999</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <RotateCw className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Easy Returns</span>
                <span className="text-xs text-gray-500">30 days return policy</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Secure Payment</span>
                <span className="text-xs text-gray-500">100% secure payment</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonial Section - Full Width */}
        <div className="mt-16">
          <TestimonialSection />
        </div>
        <div className="mt-16">
        <CustomProductCard />
        </div>

      </div>
    </div>
  )
}