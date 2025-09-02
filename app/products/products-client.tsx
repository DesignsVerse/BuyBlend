// app/products/products-client.tsx
"use client"

import { useState, useEffect } from "react"
import type { Product, Category } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { Filter, Search, Grid, List, ChevronDown, X } from "lucide-react"

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
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Products</h2>
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Filter size={18} />
          Filters
          {selectedCategories.length > 0 || minPrice !== null || maxPrice !== null || availability.inStock || availability.onSale ? (
            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {[selectedCategories.length, minPrice !== null ? 1 : 0, maxPrice !== null ? 1 : 0, availability.inStock ? 1 : 0, availability.onSale ? 1 : 0].reduce((a, b) => a + b, 0)}
            </span>
          ) : null}
        </button>
      </div>

      {/* Sidebar Filters - Mobile Overlay */}
      {showMobileFilters && isMobile && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Filter Content */}
            <div className="space-y-6">
              {/* Search */}
              <div>
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
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
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
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice ?? ""}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <span className="text-gray-500 text-sm">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice ?? ""}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
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

              {/* Reset and Apply Buttons for Mobile */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSearch("")
                    setSelectedCategories([])
                    setMinPrice(null)
                    setMaxPrice(null)
                    setAvailability({ inStock: false, onSale: false })
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 font-medium"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Filters - Desktop */}
      <aside className="hidden lg:block lg:w-1/4 bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
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
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice ?? ""}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice ?? ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
      <div className="w-full lg:w-3/4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredProducts.length}</span>{" "}
            of <span className="font-medium">{allProducts.length}</span> products
          </p>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No products found.</p>
            <button 
              onClick={() => {
                setSearch("")
                setSelectedCategories([])
                setMinPrice(null)
                setMaxPrice(null)
                setAvailability({ inStock: false, onSale: false })
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}