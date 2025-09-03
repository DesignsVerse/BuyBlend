"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/Home/product-card"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import { Filter, Grid, List, ChevronDown, Sparkles, Zap, X, Search, SlidersHorizontal } from "lucide-react"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [activePriceRange, setActivePriceRange] = useState({ min: 0, max: 10000 })
  const [showFilters, setShowFilters] = useState(false)
  const [availability, setAvailability] = useState({
    inStock: false,
    onSale: false,
    featured: false
  })

  // Extract unique categories from products
  const categories = Array.from(
    new Map(
      products
        .filter(p => p.category)
        .map(p => [p.category?._id, p.category])
    ).values()
  )

  useEffect(() => {
    setIsLoading(true)
    getStudProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setSortedProducts(data)
      
      // Calculate price range
      if (data.length > 0) {
        const prices = data.map(p => p.price || 0).filter(p => p > 0)
        const min = Math.min(...prices)
        const max = Math.max(...prices)
        setPriceRange({ min, max })
        setActivePriceRange({ min, max })
      }
      
      setIsLoading(false)
    })
  }, [])

  // Apply filters whenever any filter criteria changes
  useEffect(() => {
    let filtered = [...products]
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product.category && selectedCategories.includes(product.category._id)
      )
    }
    
    // Apply price filter
    filtered = filtered.filter(product => {
      const price = product.price || 0
      return price >= activePriceRange.min && price <= activePriceRange.max
    })
    
    // Apply availability filters
    if (availability.inStock) {
      filtered = filtered.filter(product => product.inStock)
    }
    if (availability.onSale) {
      filtered = filtered.filter(product => product.compareAtPrice && product.compareAtPrice > product.price)
    }
    if (availability.featured) {
      filtered = filtered.filter(product => product.featured)
    }
    
    // Apply sorting
    handleSortChange(activeSort, filtered)
  }, [searchQuery, selectedCategories, activePriceRange, availability, products, activeSort])

  const handleSortChange = (sort: SortOption, productsToSort = products) => {
    setActiveSort(sort)
    let sorted = [...productsToSort]
    
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

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setActivePriceRange(priceRange)
    setAvailability({
      inStock: false,
      onSale: false,
      featured: false
    })
  }

  const activeFilterCount = [
    searchQuery ? 1 : 0,
    selectedCategories.length,
    activePriceRange.min !== priceRange.min ? 1 : 0,
    activePriceRange.max !== priceRange.max ? 1 : 0,
    availability.inStock ? 1 : 0,
    availability.onSale ? 1 : 0,
    availability.featured ? 1 : 0
  ].reduce((a, b) => a + b, 0)

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
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section - Black and White */}
      <div className="relative bg-black text-white py-16 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gray-800/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gray-700/20 rounded-full"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
              <Sparkles className="mr-3 h-8 w-8 md:h-10 md:w-10" />
              Premium Stud Collection
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Discover our exclusive range of premium stud products, crafted for durability and style. 
              Each piece is meticulously designed to elevate your space.
            </p>
            
            {/* Search Bar in Hero */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stud products..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="ml-2 flex items-center gap-2 px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Filter size={18} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center text-gray-900">
                  <SlidersHorizontal className="mr-2 h-5 w-5 text-gray-700" />
                  Filter Products
                </h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="md:hidden p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-4">
                
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={activePriceRange.min}
                      onChange={(e) => setActivePriceRange({...activePriceRange, min: Number(e.target.value)})}
                      className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white text-gray-900"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={activePriceRange.max}
                      onChange={(e) => setActivePriceRange({...activePriceRange, max: Number(e.target.value)})}
                      className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white text-gray-900"
                      placeholder="Max"
                    />
                  </div>
                </div>
                
                {/* Availability Filters */}
                <div className="flex items-end">
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={availability.inStock}
                        onChange={(e) => setAvailability({...availability, inStock: e.target.checked})}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={availability.onSale}
                        onChange={(e) => setAvailability({...availability, onSale: e.target.checked})}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">On Sale</span>
                    </label>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => setShowFilters(false)}
                className="hidden md:block text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> of {products.length} products
            </p>
            {activeFilterCount > 0 && (
              <button 
                onClick={resetFilters}
                className="text-xs text-gray-700 hover:text-black mt-1"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-100 text-black" : "text-gray-500"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-100 text-black" : "text-gray-500"}`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={activeSort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 w-full sm:w-auto text-gray-900"
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
              <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 aspect-square relative">
                    {product.media && product.media[0] && product.media[0]._type === "image" ? (
                      <img
                        src={product.media[0].asset ? `https://cdn.sanity.io/images/your-project-id/production/${product.media[0].asset._ref.split('-')[1]}-${product.media[0].asset._ref.split('-')[2]}.${product.media[0].asset._ref.split('.')[1]}` : "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
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
                        <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
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

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}