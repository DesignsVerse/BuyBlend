"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/Home/product-card"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import { ProductSortBar, SortOption } from "@/components/sorting"

async function getStudProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && type == "korean"]{
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

export default function StudProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [activeSort, setActiveSort] = useState<SortOption>("price-asc")

  useEffect(() => {
    getStudProducts().then((data) => {
      if (!data || data.length === 0) return notFound()

      // 🔹 Reverse the array so last product comes first
      const reversedData = [...data].reverse()

      setProducts(reversedData)
      setSortedProducts(reversedData)
    })
  }, [])

  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort)
    const sorted = [...products].sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : b.price - a.price
    )
    setSortedProducts(sorted)
  }

  if (!products || products.length === 0)
    return <p className="text-center mt-20">No products found.</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Stud Products</h1>

      {/* Top Sort Bar */}
      <ProductSortBar activeSort={activeSort} onSortChange={handleSortChange} />

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
