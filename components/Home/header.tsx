"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, User, Heart, Menu, X } from "lucide-react"
import { CartButton } from "@/components/cart/cart-button"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "border-b border-gray-200 bg-white/95 backdrop-blur" : "bg-white/80 backdrop-blur"}`}>
      {/* Top announcement bar - full width */}
      <div className="bg-black text-white text-center py-2 text-xs">
        Free shipping on all orders over $500 | Use code FIRST10 for 10% off
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50">
            <span className="text-2xl font-serif font-bold tracking-wider">LUXE JEWELS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Home
            </Link>
            <div className="relative group">
              <Link href="/products" className="text-sm font-medium hover:text-gray-600 transition-colors flex items-center">
                Collections
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
            <Link href="/new-arrivals" className="text-sm font-medium hover:text-gray-600 transition-colors">
              New Arrivals
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-5">
            <div className="hidden md:flex items-center space-x-5">
              <button className="relative p-1">
                <Search className="h-5 w-5" />
              </button>
              <button className="relative p-1">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">0</span>
              </button>
              <button className="relative p-1">
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
                <button className="flex items-center space-x-2 text-lg">
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </button>
                <button className="flex items-center space-x-2 text-lg">
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </button>
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
  )
}