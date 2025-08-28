import { client, queries } from "@/lib/sanity/client"
import type { Product } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { SiteHeader } from "@/components/Home/header"
import { mockProducts } from "@/lib/sanity/mock-data"
import { HeroSection } from "@/components/Home/hero"
import { FeaturedProductsSection } from "@/components/Home/product"
import { SiteFooter } from "@/components/Home/footer"

async function getProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch(queries.allProducts)
    return products && products.length > 0 ? products : mockProducts
  } catch (error) {
    console.error("Error fetching products:", error)
    return mockProducts
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

export default async function HomePage() {
  const [featuredProducts, allProducts] = await Promise.all([getFeaturedProducts(), getProducts()])

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <HeroSection/>
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Our Store</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover amazing products with seamless shopping experience
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>
      </section> */}

      <FeaturedProductsSection featuredProducts={featuredProducts} />

      {/* All Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">All Products</h2>
          {allProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found. Add some products in your Sanity Studio!</p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter/>
    </div>
  )
}
