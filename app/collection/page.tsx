import { client, queries } from "@/lib/sanity/client"
import type { Product, Category } from "@/lib/sanity/types"
import ProductsPageClient from "../products/products-client"

async function getProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch(
      queries.allProducts,
      {},
      { cache: "no-store" }
    )
    return products || []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const categories = await client.fetch(
      `*[_type == "category"]{_id, name, slug, description, image}`
    )
    return categories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function ProductsPage() {
  const allProducts = await getProducts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          {/* Client Component */}
          <ProductsPageClient allProducts={allProducts} categories={categories} />
        </div>
      </section>
    </div>
  )
}
