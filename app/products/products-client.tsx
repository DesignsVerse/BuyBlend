"use client"

import { useState, useEffect, useMemo } from "react"
import type { Product, Category } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { Filter, Search, Grid, List, ChevronDown, X, SlidersHorizontal, Sparkles, Star } from "lucide-react"

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
    featured: false
  })
  const [sortBy, setSortBy] = useState("featured")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [activePriceRange, setActivePriceRange] = useState({ min: 0, max: 10000 })

  // Check screen size on mount and resize
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Calculate price range from products
  useEffect(() => {
    if (allProducts.length > 0) {
      const prices = allProducts.map(p => p.price || 0).filter(p => p > 0)
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      setPriceRange({ min, max })
      setActivePriceRange({ min, max })
    }
  }, [allProducts])

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((p) => {
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
      if (activePriceRange.min !== null && price < activePriceRange.min) return false
      if (activePriceRange.max !== null && price > activePriceRange.max) return false
    
      // Availability
      if (availability.inStock && !p.inStock) return false
      if (availability.onSale && !(p.compareAtPrice && p.compareAtPrice > p.price)) return false
      if (availability.featured && !p.featured) return false
    
      return true
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case "price-low-high":
          return (a.price || 0) - (b.price || 0)
        case "price-high-low":
          return (b.price || 0) - (a.price || 0)
        case "name-a-z":
          return (a.name || "").localeCompare(b.name || "")
        case "name-z-a":
          return (b.name || "").localeCompare(a.name || "")
        case "newest":
          return new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime()
        case "featured":
        default:
          // Featured products first, then by creation date
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime()
      }
    })

    return filtered
  }, [allProducts, search, selectedCategories, activePriceRange, availability, sortBy])

  const resetFilters = () => {
    setSearch("")
    setSelectedCategories([])
    setActivePriceRange(priceRange)
    setAvailability({ inStock: false, onSale: false, featured: false })
  }

  const activeFilterCount = [
    selectedCategories.length, 
    activePriceRange.min !== priceRange.min ? 1 : 0,
    activePriceRange.max !== priceRange.max ? 1 : 0,
    availability.inStock ? 1 : 0,
    availability.onSale ? 1 : 0,
    availability.featured ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Premium Collection</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Discover our exclusive range of premium products, carefully curated for the discerning customer.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-blue-600" />
              Products
            </h2>
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Filter size={18} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Sidebar Filters - Mobile Overlay */}
          {showMobileFilters && isMobile && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 lg:hidden flex items-end">
              <div className="bg-white w-full h-4/5 rounded-t-3xl overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold flex items-center">
                    <SlidersHorizontal className="mr-2 h-5 w-5 text-blue-600" />
                    Filter & Sort
                  </h3>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="h-full overflow-y-auto pb-24">
                  <div className="p-6 space-y-8">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Products
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search products..."
                          className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "featured", label: "Featured" },
                          { id: "newest", label: "Newest" },
                          { id: "price-low-high", label: "Price: Low to High" },
                          { id: "price-high-low", label: "Price: High to Low" },
                          { id: "name-a-z", label: "Name: A-Z" },
                          { id: "name-z-a", label: "Name: Z-A" }
                        ].map(option => (
                          <button
                            key={option.id}
                            onClick={() => setSortBy(option.id)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              sortBy === option.id
                                ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    {categories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {categories.map((cat) => (
                            <label key={cat._id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
                              <span className="ml-3 text-sm text-gray-700">{cat.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Range Slider */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                      <div className="space-y-4">
                        <div className="px-2">
                          <input
                            type="range"
                            min={priceRange.min}
                            max={priceRange.max}
                            value={activePriceRange.min}
                            onChange={(e) => setActivePriceRange({...activePriceRange, min: parseInt(e.target.value)})}
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="range"
                            min={priceRange.min}
                            max={priceRange.max}
                            value={activePriceRange.max}
                            onChange={(e) => setActivePriceRange({...activePriceRange, max: parseInt(e.target.value)})}
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer mt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>₹{activePriceRange.min.toLocaleString("en-IN")}</span>
                          <span>₹{activePriceRange.max.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Product Status</h4>
                      <div className="space-y-3">
                        {[
                          { id: "inStock", label: "In Stock", checked: availability.inStock },
                          { id: "onSale", label: "On Sale", checked: availability.onSale },
                          { id: "featured", label: "Featured", checked: availability.featured }
                        ].map(option => (
                          <label key={option.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={option.checked}
                              onChange={(e) => setAvailability({...availability, [option.id]: e.target.checked})}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Actions */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={resetFilters}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Show {filteredProducts.length} Products
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-80 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <SlidersHorizontal className="mr-2 h-5 w-5 text-blue-600" />
                Filter & Sort
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Search */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "featured", label: "Featured" },
                  { id: "newest", label: "Newest" },
                  { id: "price-low-high", label: "Price: Low to High" },
                  { id: "price-high-low", label: "Price: High to Low" },
                  { id: "name-a-z", label: "Name: A-Z" },
                  { id: "name-z-a", label: "Name: Z-A" }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                      sortBy === option.id
                        ? "bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
                      <span className="ml-3 text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range Slider */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
              <div className="space-y-4">
                <div className="px-2">
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={activePriceRange.min}
                    onChange={(e) => setActivePriceRange({...activePriceRange, min: parseInt(e.target.value)})}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={activePriceRange.max}
                    onChange={(e) => setActivePriceRange({...activePriceRange, max: parseInt(e.target.value)})}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>₹{activePriceRange.min.toLocaleString("en-IN")}</span>
                  <span>₹{activePriceRange.max.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Product Status</h4>
              <div className="space-y-3">
                {[
                  { id: "inStock", label: "In Stock", checked: availability.inStock },
                  { id: "onSale", label: "On Sale", checked: availability.onSale },
                  { id: "featured", label: "Featured", checked: availability.featured }
                ].map(option => (
                  <label key={option.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={(e) => setAvailability({...availability, [option.id]: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="w-full lg:flex-1">
           

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="w-full transform transition-transform hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          border: none;
        }
      `}</style>
    </div>
  )
}