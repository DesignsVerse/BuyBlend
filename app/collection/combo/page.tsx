"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/Home/product-card"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react"

async function getComboProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && category->slug.current == "combos"]{
        _id,
        name,
        slug,
        price,
        originalPrice,
        compareAtPrice,
        media,
        description,
        highlights,
        category->{_id, name, slug},
        featured,
        inStock,
        inventory,
        type,
        tags,
        _createdAt
      }`,
      {},
      { cache: "no-store" }
    )
  } catch (error) {
    console.error("Error fetching combo products:", error)
    return []
  }
}

type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"

export default function ComboProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [activeSort, setActiveSort] = useState<SortOption>("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getComboProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setSortedProducts(data)
      setIsLoading(false)
    })
  }, [])

  // Sorting logic
  useEffect(() => {
    let sorted = [...products]

    switch (activeSort) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() -
            new Date(a._createdAt).getTime()
        )
        break
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "name-asc":
        sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        )
        break
      case "name-desc":
        sorted.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        )
        break
      default:
        break
    }

    setSortedProducts(sorted)
  }, [products, activeSort])

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Combo Collection</h1>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid" ? "bg-gray-200" : ""
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list" ? "bg-gray-200" : ""
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortOption)}
              className="appearance-none border rounded-lg px-3 py-2 pr-8"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products */}
      {isLoading ? (
        <p>Loading products...</p>
      ) : sortedProducts.length === 0 ? (
        <p>No products found.</p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 border p-4 rounded-lg"
            >
              <ProductCard product={product}  />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
