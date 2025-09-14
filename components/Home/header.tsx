"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Search, User, Heart, Menu, X, ArrowRight } from "lucide-react"
import { useWishlist } from "@/lib/wishlist/wishlist-context"
import { CartButton } from "@/components/cart/cart-button"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { state: wishlistState } = useWishlist()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Separate refs for each desktop dropdown
  const productsDropdownRef = useRef<HTMLDivElement>(null)
  const earringsDropdownRef = useRef<HTMLDivElement>(null)

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

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [productsDropdownRef, earringsDropdownRef]
      if (!refs.some(ref => ref.current?.contains(event.target as Node))) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  // Toggle dropdown for mobile
  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutsideMobile = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutsideMobile)
    return () => document.removeEventListener("mousedown", handleClickOutsideMobile)
  }, [isMobileMenuOpen])

  // Prevent body scroll when mobile menu or search is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = prevOverflow
    }
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isMobileMenuOpen, isSearchOpen])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false)
        setIsSearchOpen(false)
        setActiveDropdown(null)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "border-b border-gray-200 bg-[#fff3f3]/95 backdrop-blur supports-backdrop-blur:backdrop-blur" : "bg-[#fff3f3]/80 backdrop-blur supports-backdrop-blur:backdrop-blur"}`}>
        {/* Top announcement bar - Updated with premium hover and gradient */}
        <div className="bg-gradient-to-r from-black to-gray-900 text-[#fff3f3] text-center py-3 text-sm font-medium tracking-wider hover:opacity-90 transition-opacity cursor-pointer">
          Free shipping on all orders over $500 | Use code FIRST10 for 10% off
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo - Enhanced hover with shadow */}
            <Link href="/" className="flex items-center space-x-2 z-50 transition-all hover:scale-105 hover:shadow-md duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              <Image
                src="/logo/111.png"
                alt="BuyBlend Logo Icon"
                width={40}
                height={40}
                priority
              />
              <Image
                src="/logo-text.png"
                alt="BuyBlend Logo Text"
                width={120}
                height={40}
                priority
              />
            </Link>

            {/* Desktop Navigation - Enhanced with cursor pointer and focus rings */}
            <nav className="hidden md:flex items-center space-x-10">
              <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                Home
              </Link>

              {/* Products Dropdown */}
              <div
                className="relative"
                ref={productsDropdownRef}
              >
                <button
                  className="text-sm font-medium hover:text-gray-600 transition-colors duration-200 flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  onMouseEnter={() => setActiveDropdown("products")}
                >
                  Products
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {activeDropdown === "products" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bg-white shadow-xl rounded-lg p-4 w-48 mt-2 border border-gray-100"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Link href="/products" className="block py-2 px-4 hover:bg-gray-50 rounded font-semibold text-gray-900 border-b border-gray-100 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                        All Products
                      </Link>
                      <Link href="/collection/pendants" className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Pendant</Link>
                      <Link href="/collection/earrings" className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Earrings</Link>
                      <Link href="/collection/combos" className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Combos</Link>
                      <Link href="/collection/rings" className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Rings</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Earrings Dropdown */}
              <div
                className="relative"
                ref={earringsDropdownRef}
              >
                <button
                  className="text-sm font-medium hover:text-gray-600 transition-colors duration-200 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  onMouseEnter={() => setActiveDropdown("earrings")}
                >
                  Earrings
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {activeDropdown === "earrings" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bg-white shadow-xl rounded-lg p-4 w-48 mt-2 border border-gray-100"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Link href="/collection/earrings" className="block py-2 px-4 hover:bg-gray-50 rounded font-semibold text-gray-900 border-b border-gray-100 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                        All Earrings
                      </Link>
                      <Link href="/collection/earrings/stud" className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Studs</Link>
                      <Link href="/collection/earrings/western" className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Western</Link>
                      <Link href="/collection/earrings/korean" className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Korean</Link>
                      <Link href="/collection/earrings/jhumkas" className="block py-2 px-4 hover:bg-gray-50 rounded transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Jhumkas</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-gray-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                Contact Us
              </Link>
            </nav>

            {/* Right side icons - Enhanced with cursor and focus */}
            <div className="flex items-center space-x-4 md:space-x-5">
              <div className="hidden md:flex items-center space-x-5">
                <button
                  className="relative p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 duration-200 cursor-pointer"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  href="/wishlist"
                  className="relative p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 duration-200 cursor-pointer"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-black text-xs text-[#fff3f3]">
                      {wishlistState.itemCount}
                    </span>
                  )}
                </Link>
                <button
                  className="relative p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 duration-200 cursor-pointer"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>

              <CartButton />

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed top-0 right-0 w-80 max-w-[80vw] h-screen bg-[#fff3f3] shadow-2xl z-40 overflow-y-auto"
            ref={mobileMenuRef}
          >
            <div className="px-6 py-6">
              <button
                className="absolute top-4 right-4 p-2 transition-transform hover:scale-110 duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex flex-col space-y-6 mt-8">
                <Link href="/" className="text-lg font-medium py-2 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>

                {/* Mobile Products Dropdown */}
                <div>
                  <button
                    className="text-lg font-medium py-2 flex items-center justify-between w-full hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    onClick={() => toggleDropdown("mobile-products")}
                  >
                    <span>Products</span>
                    <svg className={`transform transition-transform ${activeDropdown === "mobile-products" ? "rotate-180" : ""} h-5 w-5 duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {activeDropdown === "mobile-products" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 flex flex-col space-y-3 overflow-hidden"
                      >
                        <Link href="/products" className="block py-2 font-semibold text-gray-900 border-b border-gray-200 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>
                          All Products
                        </Link>
                        <Link href="/collection/pendants" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Pendants</Link>
                        <Link href="/collection/earrings" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Earrings</Link>
                        <Link href="/collection/combos" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Combos</Link>
                        <Link href="/collection/rings" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Rings</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Earrings Dropdown */}
                <div>
                  <button
                    className="text-lg font-medium py-2 flex items-center justify-between w-full hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    onClick={() => toggleDropdown("mobile-earrings")}
                  >
                    <span>Earrings</span>
                    <svg className={`transform transition-transform ${activeDropdown === "mobile-earrings" ? "rotate-180" : ""} h-5 w-5 duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {activeDropdown === "mobile-earrings" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 flex flex-col space-y-3 overflow-hidden"
                      >
                        <Link href="/collection/earrings" className="block py-2 font-semibold text-gray-900 border-b border-gray-200 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>
                          All Earrings
                        </Link>
                        <Link href="/collection/earrings/stud" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Studs</Link>
                        <Link href="/collection/earrings/western" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Western</Link>
                        <Link href="/collection/earrings/korean" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Korean</Link>
                        <Link href="/collection/earrings/jhumkas" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Jhumkas</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/about" className="text-lg font-medium py-2 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </Link>
                <Link href="/contact" className="text-lg font-medium py-2 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Contact Us
                </Link>

                <div className="border-t pt-4 mt-4 flex flex-col space-y-4">
                  <button
                    className="flex items-center space-x-2 text-lg hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsSearchOpen(true)
                    }}
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </button>
                  <Link href="/wishlist" className="flex items-center space-x-2 text-lg hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </Link>
                  <Link href='/login' className="flex items-center space-x-2 text-lg hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                    <User className="h-5 w-5" />
                    <span>Account</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/30 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Animated Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />

            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 bg-[#fff3f3] shadow-2xl"
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
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </form>
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
    </>
  )
}
