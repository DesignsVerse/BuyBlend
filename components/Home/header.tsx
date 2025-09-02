"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Search, User, Heart, Menu, X, ArrowRight } from "lucide-react"
import { useWishlist } from "@/lib/wishlist/wishlist-context"
import { CartButton } from "@/components/cart/cart-button"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { state: wishlistState } = useWishlist()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Perform search action here
      console.log("Searching for:", searchQuery)
      // You can redirect to search page or perform search
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "border-b border-gray-200 bg-white/95 backdrop-blur" : "bg-white/80 backdrop-blur"}`}>
        {/* Top announcement bar - full width */}
        <div className="bg-black text-white text-center py-2 text-xs">
          Free shipping on all orders over $500 | Use code FIRST10 for 10% off
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 z-50">
              <span className="text-2xl font-serif font-bold tracking-wider">BuyBlend.in</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Home
              </Link>
              <div className="relative group">
                <Link href="/products" className="text-sm font-medium hover:text-gray-600 transition-colors flex items-center">
                  Products
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-4 w-48 mt-2 border border-gray-100">
                  <Link href="/products/rings" className="block py-2 px-4 hover:bg-gray-50 rounded">Rings</Link>
                  <Link href="/products/necklaces" className="block py-2 px-4 hover:bg-gray-50 rounded">Necklaces</Link>
                  <Link href="/products/earrings" className="block py-2 px-4 hover:bg-gray-50 rounded">Earrings</Link>
                  <Link href="/products/bracelets" className="block py-2 px-4 hover:bg-gray-50 rounded">Bracelets</Link>
                </div>
              </div>
              <Link href="/earrings" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Earrings
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Contact Us
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-5">
              <div className="hidden md:flex items-center space-x-5">
                <button 
                  className="relative p-1 transition-transform hover:scale-110"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </button>
                <Link href="/wishlist" className="relative p-1 transition-transform hover:scale-110">
                  <Heart className="h-5 w-5" />
                  {wishlistState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-black text-xs text-white">
                      {wishlistState.itemCount}
                    </span>
                  )}
                </Link>
                <button className="relative p-1 transition-transform hover:scale-110">
                  <User className="h-5 w-5" />
                </button>
              </div>
              
              <CartButton />
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t absolute w-full h-screen z-40">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-6">
                <Link href="/" className="text-lg font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/products" className="text-lg font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Collections
                </Link>
                <Link href="/new-arrivals" className="text-lg font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  New Arrivals
                </Link>
                <Link href="/about" className="text-lg font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </Link>
                <div className="border-t pt-4 mt-4 flex flex-col space-y-4">
                  <button 
                    className="flex items-center space-x-2 text-lg"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsSearchOpen(true)
                    }}
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </button>
                  <Link href="/wishlist" className="flex items-center space-x-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </Link>
                  <button className="flex items-center space-x-2 text-lg">
                    <User className="h-5 w-5" />
                    <span>Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Animated Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
          
          <div className="relative z-10 bg-white shadow-2xl">
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
                    className="w-full pl-10 pr-4 py-3 text-lg border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                  />
                </div>
                
                <button
                  type="submit"
                  className="ml-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </form>
            </div>

            {/* Recent Searches/Suggestions (optional) */}
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
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .relative.z-10 {
          animation: slideIn 0.3s ease-out;
        }

        input::placeholder {
          transition: opacity 0.2s ease;
        }

        input:focus::placeholder {
          opacity: 0.5;
        }
      `}</style>
    </>
  )
}