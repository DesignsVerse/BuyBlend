"use client"

import { useState, useEffect, useMemo } from "react"
import type { Product, Category } from "@/lib/sanity/types"
import { ProductCard } from "@/components/Home/product-card"
import { Filter, Search, ChevronDown, X, SlidersHorizontal, Sparkles } from "lucide-react"
import { TopMarquee } from "@/components/products/offer-marquee"

export default function ProductsPageClient({
  allProducts,
  categories,
}: {
  allProducts: Product[]
  categories: Category[]
}) {
  const [search, setSearch] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [availability, setAvailability] = useState({
    inStock: false,
    onSale: false,
    featured: false,
  })
  const [sortBy, setSortBy] = useState("featured")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [activePriceRange, setActivePriceRange] = useState({ min: 0, max: 10000 })
  const [showSortOptions, setShowSortOptions] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile && showMobileFilters) setShowMobileFilters(false)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [showMobileFilters])

  // Calculate price range
  useEffect(() => {
    if (allProducts.length > 0) {
      const prices = allProducts.map(p => p.price || 0).filter(p => p > 0)
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      setPriceRange({ min, max })
      setActivePriceRange({ min, max })
    }
  }, [allProducts])

  // Filtering + Sorting
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((p) => {
      if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (selectedTypes.length > 0) {
        if (!p.type || !selectedTypes.includes(p.type)) {
          return false
        }
      }
      const price = Number(p.price) || 0
      if (activePriceRange.min !== null && price < activePriceRange.min) return false
      if (activePriceRange.max !== null && price > activePriceRange.max) return false
      if (availability.inStock && !p.inStock) return false
      if (availability.onSale && !(p.compareAtPrice && p.compareAtPrice > p.price)) return false
      if (availability.featured && !p.featured) return false
      return true
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
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
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime()
      }
    })

    return filtered
  }, [allProducts, search, selectedTypes, activePriceRange, availability, sortBy])

  const resetFilters = () => {
    setSearch("")
    setSelectedTypes([])
    setActivePriceRange(priceRange)
    setAvailability({ inStock: false, onSale: false, featured: false })
    setShowMobileFilters(false) // Close mobile filters on reset
  }

  const applyFilters = () => {
    setShowMobileFilters(false) // Close mobile filters on apply
  }

  const activeFilterCount = [
    selectedTypes.length,
    activePriceRange.min !== priceRange.min ? 1 : 0,
    activePriceRange.max !== priceRange.max ? 1 : 0,
    availability.inStock ? 1 : 0,
    availability.onSale ? 1 : 0,
    availability.featured ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-white">
    <TopMarquee/>

      <div className="container mx-auto py-4 md:px-8 px-2 max-w-full">
        {/* ✅ Premium Top Section with Title + Sort */}
        <div className="relative mb-8 pt-6 pb-4 border-b border-gray-100">
          {/* Background decorative element */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-r from-amber-50 to-rose-50 rounded-full opacity-70 blur-3xl"></div>
          </div>
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            {/* Left: Dynamic Heading */}
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="w-12 h-px bg-amber-400 mr-3"></div>
                <span className="text-xs font-medium tracking-wider text-amber-600 uppercase">
                  Premium Collection
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif font-light text-gray-900 tracking-tight">
                {selectedTypes.length > 0
                  ? categories.find(c => c.slug.current === selectedTypes[0])?.name
                  : "All Products"}
              </h1>
              
              <p className="text-base text-gray-600 mt-3 max-w-2xl leading-relaxed">
                {selectedTypes.length > 0
                  ? `Exquisite ${categories.find(c => c.slug.current === selectedTypes[0])?.name} crafted with precision and attention to detail. Each piece tells a story of elegance and sophistication.`
                  : "Discover our complete collection of premium jewelry, where exceptional craftsmanship meets timeless design for the discerning individual."}
              </p>
              
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available
                </span>
                <span className="mx-3">•</span>
                <span>Curated with excellence</span>
              </div>
            </div>

            {/* Right: Sort Dropdown */}
            <div className="relative flex-shrink-0 self-end lg:self-auto">
              <button
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Sort by</span>
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showSortOptions ? 'rotate-180' : ''}`} />
              </button>

              {showSortOptions && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl border border-gray-100 z-20 overflow-hidden py-2">
                  <ul className="text-sm text-gray-700">
                    {[
                      { id: "featured", label: "Featured", icon: "✨" },
                      { id: "newest", label: "Newest First", icon: "🆕" },
                      { id: "price-low-high", label: "Price: Low to High", icon: "↗️" },
                      { id: "price-high-low", label: "Price: High to Low", icon: "↘️" },
                      { id: "name-a-z", label: "Name: A to Z", icon: "🔤" },
                      { id: "name-z-a", label: "Name: Z to A", icon: "🔠" },
                    ].map((option) => (
                      <li key={option.id}>
                        <button
                          onClick={() => { setSortBy(option.id); setShowSortOptions(false) }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors ${
                            sortBy === option.id ? 'bg-amber-50 text-amber-700' : ''
                          }`}
                        >
                          <span className="mr-3">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center px-4 py-2 bg-black text-white rounded-lg font-medium"
          >
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-black font-medium"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-80 bg-white rounded-xl shadow-md border border-gray-200 p-6 h-fit sticky top-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center text-gray-900">
                <SlidersHorizontal className="mr-2 h-5 w-5 text-gray-700" />
                Filter & Sort
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-black font-medium transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white"
                />
              </div>
            </div>

            {/* Type Filters */}
            {categories.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Earring Type</h4>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(cat.slug.current)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([...selectedTypes, cat.slug.current])
                          } else {
                            setSelectedTypes(selectedTypes.filter((id) => id !== cat.slug.current))
                          }
                        }}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
              <div className="px-2 relative">
                <div className="relative h-2 bg-gray-200 rounded-lg">
                  <div
                    className="absolute h-2 bg-gray-700 rounded-lg"
                    style={{
                      left: `${((activePriceRange.min - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                      right: `${100 - ((activePriceRange.max - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={activePriceRange.min}
                  onChange={(e) =>
                    setActivePriceRange({
                      ...activePriceRange,
                      min: Math.min(parseInt(e.target.value), activePriceRange.max - 1),
                    })
                  }
                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={activePriceRange.max}
                  onChange={(e) =>
                    setActivePriceRange({
                      ...activePriceRange,
                      max: Math.max(parseInt(e.target.value), activePriceRange.min + 1),
                    })
                  }
                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
                />
                <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                  <span>₹{activePriceRange.min.toLocaleString("en-IN")}</span>
                  <span>₹{activePriceRange.max.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Product Status</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "inStock", label: "In Stock", checked: availability.inStock },
                  { id: "onSale", label: "On Sale", checked: availability.onSale },
                  { id: "featured", label: "Featured", checked: availability.featured },
                ].map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={(e) =>
                        setAvailability({
                          ...availability,
                          [option.id]: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center text-gray-900">
                    <SlidersHorizontal className="mr-2 h-5 w-5 text-gray-700" />
                    Filter & Sort
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-600 hover:text-black"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white"
                    />
                  </div>
                </div>

                {/* Type Filters */}
                {categories.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Earring Type</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {categories.map((cat) => (
                        <label key={cat._id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(cat.slug.current)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTypes([...selectedTypes, cat.slug.current])
                              } else {
                                setSelectedTypes(selectedTypes.filter((id) => id !== cat.slug.current))
                              }
                            }}
                            className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                  <div className="px-2 relative">
                    <div className="relative h-2 bg-gray-200 rounded-lg">
                      <div
                        className="absolute h-2 bg-gray-700 rounded-lg"
                        style={{
                          left: `${((activePriceRange.min - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                          right: `${100 - ((activePriceRange.max - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={activePriceRange.min}
                      onChange={(e) =>
                        setActivePriceRange({
                          ...activePriceRange,
                          min: Math.min(parseInt(e.target.value), activePriceRange.max - 1),
                        })
                      }
                      className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={activePriceRange.max}
                      onChange={(e) =>
                        setActivePriceRange({
                          ...activePriceRange,
                          max: Math.max(parseInt(e.target.value), activePriceRange.min + 1),
                        })
                      }
                      className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                      <span>₹{activePriceRange.min.toLocaleString("en-IN")}</span>
                      <span>₹{activePriceRange.max.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Product Status</h4>
                  <div className="space-y-3">
                    {[
                      { id: "inStock", label: "In Stock", checked: availability.inStock },
                      { id: "onSale", label: "On Sale", checked: availability.onSale },
                      { id: "featured", label: "Featured", checked: availability.featured },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={(e) =>
                            setAvailability({
                              ...availability,
                              [option.id]: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="w-full lg:flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="w-full transform transition-transform hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
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
          background: #000;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          border: 2px solid #fff;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  )
}
