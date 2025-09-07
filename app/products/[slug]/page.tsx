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
import RecommendedProducts from "@/components/products/recommended-products"
import ReviewSection from "@/components/products/user-review-section"
import CustomerLove from "@/components/products/customer-images"
import { mockProducts } from "@/lib/sanity/mock-data"

interface ProductPageProps {
  params: {
    slug: string
  }
}
async function getProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch(queries.allProducts)
    return products && products.length > 0 ? products : mockProducts
  } catch (error) {
    console.error("Error fetching products:", error)
    return mockProducts
  }
}

// ✅ Image / Video URL Generator
function getMediaUrl(mediaItem: any, width = 800, height = 800): string {
  if (!mediaItem) return "/placeholder.svg"

  if (mediaItem._type === "image" && mediaItem.asset) {
    try {
      return urlFor(mediaItem)?.width(width)?.height(height)?.url() ?? "/placeholder.svg"
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
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch(queries.featuredProducts)
    return products && products.length > 0 ? products : mockProducts.filter((p) => p.featured)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return mockProducts.filter((p) => p.featured)
  }
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await getProduct(slug)

  if (!product) notFound()

  // ✅ Media Handling
  const mediaItems = product.media || []
  const [featuredProducts, allProducts] = await Promise.all([getFeaturedProducts(), getProducts()])

  // Handle pricing: prefer compareAtPrice over originalPrice for discounts
  const effectiveOriginalPrice = product.compareAtPrice || product.originalPrice
  const hasDiscount = effectiveOriginalPrice && effectiveOriginalPrice !== product.price
  const discountPercent =
    effectiveOriginalPrice && product.price
      ? Math.round(
        ((effectiveOriginalPrice - product.price) /  product.price) * 100
      )
      : 0

  // Check stock status
  const isOutOfStock = !product.inStock || product.inventory <= 0
  const isLowStock = product.inStock && product.inventory > 0 && product.inventory <= 10

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8">
        {/* Product Content Grid - Only this section has max-w-7xl */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Media Section */}
            <div className="space-y-4">
              <ProductMediaSlider mediaItems={mediaItems} product={product} />
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col space-y-3">
              {/* Category & Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.category && product.category.name && (
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {product.category.name}
                  </span>
                )}
                {product.type && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {product.type}
                  </span>
                )}
                {product.tags && product.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Product Name */}
              
<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
  {product.name}
</h1>

{/* ✅ Desktop Description - Just below Name */}
{product.description && (
  <p className="text-sm text-gray-600 leading-relaxed max-w-2xl  hidden lg:block">
    {product.description}
  </p>
)}

{/* ✅ Mobile / Tablet Description */}
<div className="border-t border-gray-200 lg:hidden">
  <p className="text-sm text-gray-700 leading-relaxed">
    {product.description || "No description available for this product."}
  </p>
</div>

              {/* Rating & Purchase Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.8 (42 reviews)</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">142 purchased</span>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-4">
  {hasDiscount ? (
    <>
      {/* Current Price */}
      <span className="text-3xl font-bold text-gray-900">
        ₹{product.price.toLocaleString("en-IN")}
      </span>

      {/* Original Price (Strikethrough) */}
      <span className="text-xl line-through text-gray-500">
        ₹{effectiveOriginalPrice?.toLocaleString("en-IN")}
      </span>

      {/* Discount Badge */}
      <span className="text-sm font-semibold bg-green-600 text-white px-2 py-1 rounded">
        {Math.abs(discountPercent)}% OFF
      </span>
    </>
  ) : (
    <span className="text-3xl font-bold text-gray-900">
      ₹{product.price.toLocaleString("en-IN")}
    </span>
  )}
</div>

              {/* Stock Status */}
              <div className="py-2">
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
                    In Stock
                  </div>
                )}
              </div>
{/* Add to Cart & Wishlist Section */}
<div className="pt-4 border-t border-gray-200">
  <div className="flex items-center gap-3">
    {/* Add to Cart */}
    <div className="flex-1">
      <AddToCartButton 
        product={product} 
        disabled={isOutOfStock} 
        className="w-full py-3 text-base rounded-lg"
      />
    </div>

    {/* Wishlist Button */}
    <button
      className="flex-1 flex items-center justify-center py-3 text-base border rounded-lg text-gray-700 hover:text-red-500 hover:border-red-500 transition"
    >
      <Heart className="h-5 w-5 mr-2" />
      Wishlist
    </button>
  </div>

  {/* Delivery Estimate */}
  <div className="mt-4 flex items-center text-sm text-gray-600">
    <Truck className="h-4 w-4 mr-2" />
    <span>
      Free delivery by{" "}
      {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-IN",
        { weekday: "long", day: "numeric", month: "long" }
      )}
    </span>
  </div>
</div>

 {/* Style Tips */}
 {product.styleTips && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold mb-2 text-gray-900">Style Tips</h2>
                  <p className="text-gray-700 italic">"{product.styleTips}"</p>
                </div>
              )}

              {/* Product Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="py-4 border-t border-gray-200">
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">Product Highlights</h2>
                  <ul className="space-y-2">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

             

              {/* Variants Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 py-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Options</h3>
                  {product.variants.map((variant, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-2 text-gray-800">{variant.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-black transition-colors">
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

           

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="flex flex-col items-center text-center p-3 bg-white border border-gray-200 rounded-lg">
                  <Truck className="h-6 w-6 text-black mb-2" />
                  <span className="text-sm font-medium text-gray-900">Free Shipping</span>
                  <span className="text-xs text-gray-500">On orders over ₹999</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-white border border-gray-200 rounded-lg">
                  <RotateCw className="h-6 w-6 text-black mb-2" />
                  <span className="text-sm font-medium text-gray-900">Easy Returns</span>
                  <span className="text-xs text-gray-500">30 days return policy</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-white border border-gray-200 rounded-lg">
                  <Shield className="h-6 w-6 text-black mb-2" />
                  <span className="text-sm font-medium text-gray-900">Secure Payment</span>
                  <span className="text-xs text-gray-500">100% secure payment</span>
                </div>
              </div>
            </div>
          </div>

         
        </div>

        {/* Customer Images - Full width */}
        <div className="mt-12">
          <CustomerLove />
        </div>
        
        {/* Recommended Products - Full width */}
        <div className="mt-16">
          <RecommendedProducts
            type={product.type ?? ""}
            currentSlug={product.slug?.current ?? ""}
          />
        </div>

        {/* Reviews Section - Full width */}
        <div className="mt-16">
          <ReviewSection productName={slug.replace(/-/g, " ")} />
        </div>

        {/* Featured Products - Full width */}
        <div className="mt-16">
          <CustomProductCard />
        </div>

        {/* Testimonials - Full width */}
        <div className="mt-16">
          <TestimonialSection productSlug={slug} />
        </div>

        {/* Featured Products Section - Full width */}
        <div className="mt-16">
          <FeaturedProductsSection featuredProducts={featuredProducts} />
        </div>
      </div>
    </div>
  )
}