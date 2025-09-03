// app/products/earrings/page.tsx
import { client } from "@/lib/sanity/client"
import type { Product, Category } from "@/lib/sanity/types"
import ProductsPageClient from "@/app/products/products-client"
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

// Fetch unique types inside earrings
async function getEarringTypes(): Promise<Category[]> {
  try {
    const types = await client.fetch(
      `array::unique(*[_type == "product" && category->slug.current == "earring" && defined(type)].type)`
    )
    // Convert simple string list into Category-like objects
    return types.map((t: string, i: number) => ({
      _id: String(i),
      name: t,
      slug: { current: t }   
    }))
  } catch (error) {
    console.error("Error fetching earring types:", error)
    return []
  }
}

export default async function EarringsPage() {
  const products = await getEarringsProducts()
  const categories = await getEarringTypes()

  if (!products || products.length === 0) return notFound()

  return ( 
    <div className="min-h-screen bg-gray-50">
      <ProductsPageClient allProducts={products} categories={categories} />
    </div>
  )
}
