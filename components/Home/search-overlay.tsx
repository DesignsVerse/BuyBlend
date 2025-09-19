"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

type SearchResult = {
  _id: string
  name: string
  slug: { current: string }
  price?: number
  originalPrice?: number
  description?: string
  image?: string
  category?: { name?: string }
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Debounced live search
  useEffect(() => {
    if (!isOpen) return
    const query = searchQuery.trim()
    if (query.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      setSearchError(null)
      return
    }

    setIsSearching(true)
    setSearchError(null)
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        setSearchResults(Array.isArray(data.products) ? data.products : [])
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setSearchError("Search failed. Please try again.")
          setSearchResults([])
        }
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [searchQuery, isOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  // Reset search when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setSearchResults([])
      setIsSearching(false)
      setSearchError(null)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 bg-[#fff3f3] shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for exquisite jewelry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-lg border-0 focus:ring-0 focus:outline-none placeholder-gray-400 bg-transparent cursor-text"
                  />
                </div>

                <button
                  type="submit"
                  className="ml-4 bg-black text-[#fff3f3] p-3 rounded-full hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </form>
            </div>

            {/* Live results */}
            <div className="border-t border-gray-100">
              <div className="container mx-auto px-4 py-4">
                {isSearching && (
                  <div className="text-sm text-gray-500">Searching…</div>
                )}

                {!isSearching && searchError && (
                  <div className="text-sm text-red-500">{searchError}</div>
                )}

                {!isSearching && !searchError && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <div className="text-sm text-gray-500">No products found.</div>
                )}

                {!isSearching && !searchError && searchResults.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {searchResults.map((p) => (
                      <Link key={p._id} href={`/collection/product/${p.slug?.current ?? ""}`}
                        className="group rounded-md border border-gray-200 bg-white p-2 hover:shadow-sm transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                        <div className="aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
                          {p.image ? (
                            <Image src={p.image} alt={p.name} width={100} height={100} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">No image</div>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-medium text-gray-900 line-clamp-1">{p.name}</div>
                          {typeof p.price === 'number' && (
                            <div className="text-xs text-gray-700">₹{p.price}</div>
                          )}
                          {p.category?.name && (
                            <div className="text-[10px] text-gray-500 mt-0.5">{p.category.name}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Popular Searches */}
            <div className="border-t border-gray-100 bg-gray-50">
              <div className="container mx-auto px-4 py-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {['Diamond Rings', 'Gold Necklaces', 'Pearl Earrings', 'Wedding Bands', 'Luxury Watches'].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearchQuery(item)
                        searchInputRef.current?.focus()
                      }}
                      className="px-3 py-1 bg-[#fff3f3] border border-gray-200 rounded-full text-sm hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
