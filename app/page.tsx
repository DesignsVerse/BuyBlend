import { client, queries } from "@/lib/sanity/client"
import type { Product } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { mockProducts } from "@/lib/sanity/mock-data"
import { HeroSection } from "@/components/Home/hero"
import { FeaturedProductsSection } from "@/components/Home/product"
import { TrustBadgesSection } from "@/components/Home/trustbadges"
import CustomProductCard from "@/components/Home/feature"
import Testimonials from "@/components/Home/testimonial"
import CategoriesSection from "@/components/Home/category"

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
      <HeroSection />
      <TrustBadgesSection />
      <CategoriesSection />
      <FeaturedProductsSection featuredProducts={featuredProducts} />
      <CustomProductCard />
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
      <Testimonials />
    </div>
  )
}
