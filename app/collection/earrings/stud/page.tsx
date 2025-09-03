"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/Home/product-card"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import { Filter, Grid, List, ChevronDown, Sparkles, Zap } from "lucide-react"

async function getStudProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && type == "stud"]{
        _id,
        name,
        slug,
        price,
        originalPrice,
        compareAtPrice,
        media,
        description,
        highlights,
        category->{name, slug},
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
    console.error("Error fetching stud products:", error)
    return []
  }
}

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

export default function StudProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [activeSort, setActiveSort] = useState<SortOption>("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getStudProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setSortedProducts(data)
      setIsLoading(false)
    })
  }, [])

  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort)
    let sorted = [...products]
    
    switch(sort) {
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "name-asc":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        break
      case "name-desc":
        sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""))
        break
      case "newest":
        sorted.sort((a, b) => new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime())
        break
      case "featured":
      default:
        // Featured products first, then by creation date
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime()
        })
        break
    }
    
    setSortedProducts(sorted)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-full mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Stud Products Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find any stud products at the moment. Please check back later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <Sparkles className="mr-3 h-8 w-8" />
            Premium Stud Collection
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Discover our exclusive range of premium stud products, crafted for durability and style.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={activeSort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product._id} className="transform transition-transform hover:-translate-y-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 aspect-square relative">
                    {product.media && product.media[0] && product.media[0]._type === "image" ? (
                      <img
                        src={product.media[0].asset ? `https://cdn.sanity.io/images/your-project-id/production/${product.media[0].asset._ref.split('-')[1]}-${product.media[0].asset._ref.split('-')[2]}.${product.media[0].asset._ref.split('.')[1]}` : "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Zap className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:w-3/4">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        {product.highlights && product.highlights.length > 0 && (
                          <ul className="text-sm text-gray-500 mb-4">
                            {product.highlights.slice(0, 2).map((highlight, i) => (
                              <li key={i} className="mb-1">• {highlight}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{product.price?.toLocaleString("en-IN")}
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ₹{product.compareAtPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}