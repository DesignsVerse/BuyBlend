import { notFound } from "next/navigation"
import Image from "next/image"
import { client, queries, urlFor } from "@/lib/sanity/client"
import type { Product } from "@/lib/sanity/types"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { Star, Truck, Shield, RotateCw, Check, Heart, Share2 } from "lucide-react"

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
  const mainMedia = mediaItems[0] || null

  const hasDiscount = product.originalPrice && product.originalPrice !== product.price
  const discountPercent =
    hasDiscount && product.originalPrice
      ? Math.round(
          ((Math.abs(product.originalPrice - product.price)) /
            Math.max(product.originalPrice, product.price)) *
            100
        )
      : 0
  const isPriceIncreased =
    product.originalPrice && product.originalPrice < product.price

  // Check stock status
  const isOutOfStock = product.inventory <= 0
  const isLowStock = product.inventory > 0 && product.inventory <= 10

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li>Home</li>
            <li>/</li>
            <li>Products</li>
            {product.category && (
              <>
                <li>/</li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ✅ Product Media Section */}
          <div className="space-y-4">
            {/* Main Media Display */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-md">
              {mainMedia?._type === "image" ? (
                <Image
                  src={getMediaUrl(mainMedia, 800, 800)}
                  alt={mainMedia.alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : mainMedia?._type === "file" ? (
                <video
                  src={getMediaUrl(mainMedia)}
                  controls
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg"
                />
              ) : (
                <Image
                  src="/placeholder.svg"
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
              
              {/* Discount Badge */}
              {hasDiscount && !isPriceIncreased && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {discountPercent}% OFF
                </div>
              )}
              
              {/* Favorite and Share Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {mediaItems.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {mediaItems.map((item, index) => (
                  <div
                    key={item._key || index}
                    className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm cursor-pointer border-2 border-transparent hover:border-blue-400 transition-colors"
                  >
                    {item._type === "image" ? (
                      <Image
                        src={getMediaUrl(item, 150, 150)}
                        alt={item.alt || `${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : item._type === "file" ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <video
                          src={getMediaUrl(item)}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black bg-opacity-40 rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src="/placeholder.svg"
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Product Details Section */}
          <div className="flex flex-col space-y-6">
            <div>
              {/* Category & Tags */}
              <div className="flex items-center gap-2 mb-3">
                {product.category && (
                  <span className="text-sm text-blue-600 font-medium capitalize">
                  </span>
                )}
                {product.tags && product.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Product Title */}
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
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                
                {hasDiscount && (
                  <>
                    <span className="text-xl line-through text-gray-500">
                      ₹{product.originalPrice?.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${isPriceIncreased ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                      {isPriceIncreased ? `+${discountPercent}%` : `-${discountPercent}%`}
                    </span>
                  </>
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
            </div>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 py-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold">Options</h3>
                {product.variants.map((variant, index) => (
                  <div key={index}>
                    <h3 className="font-medium mb-2">{variant.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-blue-500 transition-colors">
                        {variant.value}
                        {variant.price && (
                          <span className="ml-2 text-sm text-gray-500">+₹{variant.price}</span>
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

            {/* Add to Cart Section */}
            <div className="pt-4 border-t border-gray-200">
              <AddToCartButton product={product} />
              
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

        {/* Additional Information Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Category</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Product Type</span>
                  <span className="font-medium">{product.type || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Inventory</span>
                  <span className="font-medium">{product.inventory} units</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">SKU</span>
                  <span className="font-medium">{product._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Added On</span>
                  <span className="font-medium">
                    {new Date(product._createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}