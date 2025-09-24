"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/Home/product-card"
import { Product } from "@/lib/sanity/types"
import {
    Filter,
    Grid,
    List,
    ChevronDown,
    Sparkles,
    Search,
    SlidersHorizontal,
    X,
    Zap,
    Star,
    Truck,
    Shield,
    Heart
} from "lucide-react"

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

interface EarringsLayoutProps {
    collectionType: "korean" | "stud" | "western" | "rings" | "pendant" | "combos"
    title: string
    description: string
    icon: React.ReactNode
    products: Product[]
    isLoading?: boolean
}

export default function EarringsLayout({
    collectionType,
    title,
    description,
    icon,
    products,
    isLoading = false
}: EarringsLayoutProps) {
    const [sortedProducts, setSortedProducts] = useState<Product[]>([])
    const [activeSort, setActiveSort] = useState<SortOption>("featured")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
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
        setSortedProducts(products)

        // Calculate price range
        if (products.length > 0) {
            const prices = products.map(p => p.price || 0).filter(p => p > 0)
            const min = Math.min(...prices)
            const max = Math.max(...prices)
            setPriceRange({ min, max })
            setActivePriceRange({ min, max })
        }
    }, [products])

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

        switch (sort) {
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
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h1>
                        <p className="text-gray-600 mb-6">We couldn't find any products at the moment. Please check back later.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Premium Hero Section */}
            <div className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white py-10 md:py-18 px-6 overflow-hidden">
  {/* Background Elements - Premium Glow */}
  <div className="absolute inset-0">
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-tr from-white/10 to-gray-700/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-bl from-gray-600/20 to-black/40 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>
    <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gray-700/20 rounded-full blur-xl animate-pulse delay-500"></div>
  </div>

  <div className="container mx-auto relative z-10">
    <div className="max-w-2xl mx-auto text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight">
        {title}
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-gray-300/90 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
        {description}
      </p>

      {/* Optional Search Bar (Uncomment if needed) */}
      {/*
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center max-w-2xl mx-auto mt-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${collectionType} products...`}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 text-base"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-2 flex items-center gap-2 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm"
        >
          <Filter size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
      */}
    </div>
  </div>
</div>


            {/* Advanced Filter Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 shadow-lg">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center text-gray-900">
                                    <SlidersHorizontal className="mr-3 h-6 w-6 text-gray-700" />
                                    Advanced Filters
                                </h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="lg:hidden p-2 rounded-full hover:bg-gray-100"
                                >
                                    <X size={24} className="text-gray-700" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-6">
                                {/* Categories */}
                                {categories.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Categories</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((category) => (
                                                <button
                                                    key={category?._id || 'unknown'}
                                                    onClick={() => {
                                                        if (category?._id && selectedCategories.includes(category._id)) {
                                                            setSelectedCategories(selectedCategories.filter(id => id !== category._id))
                                                        } else if (category?._id) {
                                                            setSelectedCategories([...selectedCategories, category._id])
                                                        }
                                                    }}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category?._id && selectedCategories.includes(category._id)
                                                            ? "bg-black text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {category?.name || 'Unnamed Category'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            value={activePriceRange.min}
                                            onChange={(e) => setActivePriceRange({ ...activePriceRange, min: Number(e.target.value) })}
                                            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                            placeholder="Min"
                                        />
                                        <span className="text-gray-500 font-medium">-</span>
                                        <input
                                            type="number"
                                            value={activePriceRange.max}
                                            onChange={(e) => setActivePriceRange({ ...activePriceRange, max: Number(e.target.value) })}
                                            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                {/* Availability Filters */}
                                <div className="flex items-end">
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={availability.inStock}
                                                onChange={(e) => setAvailability({ ...availability, inStock: e.target.checked })}
                                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">In Stock</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={availability.onSale}
                                                onChange={(e) => setAvailability({ ...availability, onSale: e.target.checked })}
                                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">On Sale</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={availability.featured}
                                                onChange={(e) => setAvailability({ ...availability, featured: e.target.checked })}
                                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Featured</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-end gap-3">
                                    <button
                                        onClick={resetFilters}
                                        className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                                    >
                                        Reset All
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="px-6 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all hover:scale-105"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFilters(false)}
                                className="hidden lg:block text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-10">
                {/* Results Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
                    <div>
                        <p className="text-lg text-gray-600">
                            Showing <span className="font-bold text-gray-900">{sortedProducts.length}</span> of {products.length} products
                        </p>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="text-sm text-gray-700 hover:text-black mt-2 font-medium underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* View Toggle */}
                        <div className="flex items-center bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-gray-100 text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Grid size={20} />
                            </button>
                            {/* <button
                                onClick={() => setViewMode("list")}
                                className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-gray-100 text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <List size={20} />
                            </button> */}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={activeSort}
                                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                                className="appearance-none bg-white border-2 border-gray-200 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full sm:w-auto text-gray-900 font-medium shadow-sm"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A-Z</option>
                                <option value="name-desc">Name: Z-A</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Products Grid/List */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {sortedProducts.map((product) => (
                            <div key={product._id} className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {sortedProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all hover:shadow-xl">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 aspect-square relative">
                                        {product.media && product.media[0] && product.media[0]._type === "image" ? (
                                            <img
                                                src={product.media[0].asset ? `https://cdn.sanity.io/images/your-project-id/production/${product.media[0].asset._ref.split('-')[1]}-${product.media[0].asset._ref.split('-')[2]}.${product.media[0].asset._ref.split('.')[1]}` : "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <Zap className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8 md:w-2/3">
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h3>
                                                <p className="text-gray-600 mb-4 line-clamp-3 text-lg">{product.description}</p>
                                                {product.highlights && product.highlights.length > 0 && (
                                                    <ul className="text-sm text-gray-500 mb-4">
                                                        {product.highlights.slice(0, 3).map((highlight, i) => (
                                                            <li key={i} className="mb-2 flex items-center">
                                                                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                                                                {highlight}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    ₹{product.price?.toLocaleString("en-IN")}
                                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                        <span className="text-lg text-gray-500 line-through ml-3">
                                                            ₹{product.compareAtPrice.toLocaleString("en-IN")}
                                                        </span>
                                                    )}
                                                </div>
                                                <button className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:scale-105">
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
                    <div className="text-center py-16">
                        <Zap className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No products match your filters</h3>
                        <p className="text-gray-600 mb-8 text-lg">Try adjusting your search or filter criteria</p>
                        <button
                            onClick={resetFilters}
                            className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:scale-105"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Premium Features Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center group">
                            <div className="flex justify-center mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Star className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Quality</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Crafted with meticulous attention to detail using the finest materials and traditional techniques
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="flex justify-center mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Truck className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Shipping</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Free delivery on orders over ₹999. Ready to ship within 24 hours with premium packaging
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="flex justify-center mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Love</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Loved by thousands of customers with 4.9+ average ratings and lifetime warranty
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
