// app/products/stud/page.tsx
import { client } from "@/lib/sanity/client"
import type { Product } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { notFound } from "next/navigation"

async function getStudProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && type == "western"]{
        _id,
        name,
        slug,
        price,
        originalPrice,
        media,
        description,
        highlights,
        category->{name, slug},
        featured,
        inStock,
        inventory,
        type
      }`,
      {},
      { cache: "no-store" }
    )
  } catch (error) {
    console.error("Error fetching stud products:", error)
    return []
  }
}

export default async function StudProductsPage() {
  const products = await getStudProducts()

  if (!products || products.length === 0) return notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Stud Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
