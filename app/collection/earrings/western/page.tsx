// app/products/stud/page.tsx
"use client"

import { useState, useEffect } from "react"
import { client } from "@/lib/sanity/client"
import type { Product } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { Sparkles, Filter, Grid, List, ChevronDown, X } from "lucide-react"

async function getStudProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && type == "western"]{
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
        tags
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortOption, setSortOption] = useState<string>("recommended")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const data = await getStudProducts()
      setProducts(data)
      setFilteredProducts(data)
      setIsLoading(false)
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let sortedProducts = [...products]
    
    switch(sortOption) {
      case "price-low-high":
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // Assuming newer products have higher _id values
        sortedProducts.sort((a, b) => a._id.localeCompare(b._id))
        break
      case "recommended":
      default:
        // Default order (as fetched from Sanity)
        break
    }
    
    setFilteredProducts(sortedProducts)
  }, [sortOption, products])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-4xl font-serif font-light text-gray-900 mb-4">
            Stud Earrings Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our exquisite collection of western stud earrings, 
            crafted to perfection for every occasion.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter and Sort Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <p className="text-gray-500 text-sm">
              Showing {filteredProducts.length} products
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-amber-50 text-amber-600" : "bg-white text-gray-500"}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-amber-50 text-amber-600" : "bg-white text-gray-500"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            : "grid grid-cols-1 gap-6"
          }>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
              />
            ))}
          </div>
        )}

        {/* Collection Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-200">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600 text-sm">
              Crafted with attention to detail using the finest materials
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Shipping</h3>
            <p className="text-gray-600 text-sm">
              Free delivery on orders over ₹999. Ready to ship within 24 hours.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Customer Love</h3>
            <p className="text-gray-600 text-sm">
              Loved by thousands of customers with 4.8+ average ratings
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}