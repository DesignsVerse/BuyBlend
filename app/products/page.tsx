import { client, queries } from "@/lib/sanity/client"
import type { Product } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { mockProducts } from "@/lib/sanity/mock-data"

async function getProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch(queries.allProducts)
    return products && products.length > 0 ? products : mockProducts
  } catch (error) {
    console.error("Error fetching products:", error)
    return mockProducts
  }
}

export default async function ProductsPage() {
  const allProducts = await getProducts()

  return (
    <div className="min-h-screen">
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
    </div>
  )
}
