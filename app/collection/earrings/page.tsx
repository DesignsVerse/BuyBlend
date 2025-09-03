// app/products/earrings/page.tsx
import { client } from "@/lib/sanity/client"
import type { Product, Category } from "@/lib/sanity/types"
import ProductsPageClient from "@/app/products/products-client" // client component
import { notFound } from "next/navigation"

// Fetch all earrings products
async function getEarringsProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && category->slug.current == "earring"]{
        _id,
        name,
        slug,
        price,
        compareAtPrice,
        media,
        description,
        highlights,
        category->{_id, name, slug},
        featured,
        inStock,
        inventory,
        type
      }`,
      {},
      { cache: "no-store" }
    )
  } catch (error) {
    console.error("Error fetching earrings products:", error)
    return []
  }
}

// Fetch categories (sirf earrings ke related, ya poore bhi le sakte ho)
async function getCategories(): Promise<Category[]> {
  try {
    return await client.fetch(
      `*[_type == "category" && slug.current == "earring"]{
        _id,
        name,
        slug
      }`,
      {},
      { cache: "no-store" }
    )
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function EarringsPage() {
  const products = await getEarringsProducts()
  const categories = await getCategories()

  if (!products || products.length === 0) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          {/* Client Component */}
          <ProductsPageClient allProducts={products} categories={categories} />
          </div>
      </section>
    </div>
  )
}