// app/products/products-client.tsx
"use client"

import { useState } from "react"
import type { Product, Category } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { Filter, Search, Grid, List, ChevronDown } from "lucide-react"

export default function ProductsPageClient({
  allProducts,
  categories,
}: {
  allProducts: Product[]
  categories: Category[]
}) {
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [availability, setAvailability] = useState({
    inStock: false,
    onSale: false,
  })

  // Apply filters
  const filteredProducts = allProducts.filter((p) => {
    // Search
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
  
    // Category
    if (selectedCategories.length > 0) {
      // Check actual category field
      const productCatId = p.category?._id || p.category?.slug?.current
      if (!productCatId || !selectedCategories.includes(productCatId)) {
        return false
      }
    }
  
    // Price
    const price = Number(p.price) || 0
    if (minPrice !== null && price < minPrice) return false
    if (maxPrice !== null && price > maxPrice) return false
  
    // Availability (only check if field exists)
    if (availability.inStock && p.inStock === false) return false
  
    return true
  })

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:w-1/4 bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </h3>
          <button
            onClick={() => {
              setSearch("")
              setSelectedCategories([])
              setMinPrice(null)
              setMaxPrice(null)
              setAvailability({ inStock: false, onSale: false })
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset All
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, cat._id])
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((id) => id !== cat._id)
                        )
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Min"
                value={minPrice ?? ""}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice ?? ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Availability</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={availability.inStock}
                onChange={(e) =>
                  setAvailability({ ...availability, inStock: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={availability.onSale}
                onChange={(e) =>
                  setAvailability({ ...availability, onSale: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">On Sale</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Products Grid */}
      <div className="lg:w-3/4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredProducts.length}</span>{" "}
            of <span className="font-medium">{allProducts.length}</span> products
          </p>

          {/* Sort Dropdown */}
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Name: A-Z</option>
              <option>Name: Z-A</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
