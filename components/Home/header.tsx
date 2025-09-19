"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useCart } from "@/lib/cart/cart-context"
import { Search, User, Heart, Menu, X, LogOut, Settings, Bell } from "lucide-react"
import { useWishlist } from "@/lib/wishlist/wishlist-context"
import { CartButton } from "@/components/cart/cart-button"
import { SearchOverlay } from "@/components/Home/search-overlay"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import "/styles/globals.css"

type AuthUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const { state: wishlistState } = useWishlist()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setUserId, clearIdentityAndCart, state } = useCart()

  // Separate refs for each desktop dropdown
  const productsDropdownRef = useRef<HTMLDivElement>(null)
  const earringsDropdownRef = useRef<HTMLDivElement>(null)
  const accountDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  // Fetch user authentication status
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          // Inform cart context about authenticated user so server cart is loaded
          setUserId(data.user.id)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setAuthLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [productsDropdownRef, earringsDropdownRef, accountDropdownRef]
      if (!refs.some(ref => ref.current?.contains(event.target as Node))) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


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

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      // Clear cart and identity locally for a fresh guest session
      clearIdentityAndCart()
      setIsMobileMenuOpen(false)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "border-b border-gray-200 bg-[#fff3f3]/95 backdrop-blur supports-backdrop-blur:backdrop-blur" : "bg-[#fff3f3]/80 backdrop-blur supports-backdrop-blur:backdrop-blur"}`}>
        {/* Top announcement bar with infinite marquee scrolling */}
        <div className="marquee-wrapper">
          <div className="marquee-content">
            <span>🚚 Free shipping on all orders over $500 | Use code FIRST10 for 10% off</span>
            <span>💎 Diamond Rings Sale – 15% OFF | Limited Time</span>
            <span>🎁 Buy 2 Get 1 Free on Earrings Collection</span>
            <span>🚚 Free shipping on all orders over $500 | Use code FIRST10 for 10% off</span>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo with text and tagline */}
            <Link
              href="/"
              className="flex items-center space-x-1.5 z-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              {/* Left side logo icon */}
              <Image
                src="/logo/logo.png"
                alt="BuyBlend Logo Icon"
                width={60}
                height={60}
                priority
              />

              {/* Right side text */}
              <div className="flex flex-col leading-tight">
                <span className="text-3xl font-serif tracking-wide text-black">
                  BLEND
                </span>
                <span className="text-[10px] font-serif text-black uppercase tracking-normal">
                  Pure Blend, Pure You
                </span>
              </div>
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
           className="absolute bg-white shadow-xl rounded-lg p-4 w-96 left-1/2 transform -translate-x-1/2 mt-2 border border-gray-100 z-50"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h3>
           <div className="grid grid-cols-4 gap-2">
             <Link href="/collection/pendants" className="group block">
               <div className="bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200">
                 <div className="aspect-square w-full overflow-hidden rounded-md bg-white mb-1">
                   <Image 
                     src="/new/1.jpg" 
                     alt="Pendants" 
                     width={60}  
                     height={60} 
                     className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" 
                   />
                 </div>
                 <p className="text-xs font-medium text-gray-900 text-center">Pendants</p>
               </div>
             </Link>
            
            <Link href="/collection/earrings" className="group block">
              <div className="bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200">
                <div className="aspect-square w-full overflow-hidden rounded-md bg-white mb-1">
                  <Image 
                    src="/new/2.jpg" 
                    alt="Earrings" 
                    width={60} 
                    height={60} 
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" 
                  />
                </div>
                <p className="text-xs font-medium text-gray-900 text-center">Earrings</p>
              </div>
            </Link>
            
            <Link href="/collection/ring" className="group block">
              <div className="bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200">
                <div className="aspect-square w-full overflow-hidden rounded-md bg-white mb-1">
                  <Image 
                    src="/new/3.jpg" 
                    alt="Rings" 
                    width={60} 
                    height={60} 
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" 
                  />
                </div>
                <p className="text-xs font-medium text-gray-900 text-center">Rings</p>
              </div>
            </Link>
            
            <Link href="/collection/combos" className="group block">
              <div className="bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200">
                <div className="aspect-square w-full overflow-hidden rounded-md bg-white mb-1">
                  <Image 
                    src="/new/4.jpg" 
                    alt="Combos" 
                    width={60} 
                    height={60} 
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" 
                  />
                </div>
                <p className="text-xs font-medium text-gray-900 text-center">Combos</p>
              </div>
            </Link>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/collection" className="block text-center py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">
              View All Products
            </Link>
          </div>
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
           className="absolute bg-white shadow-xl rounded-lg p-4 w-96 left-1/2 transform -translate-x-1/2 mt-2 border border-gray-100 z-50"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earring Styles</h3>
           <div className="grid grid-cols-4 gap-2">
             <Link href="/collection/earrings/stud" className="group block">
               <div className="bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200">
                 <div className="aspect-square w-full overflow-hidden rounded-md bg-white mb-1">
                   <Image 
                     src="/new/5.jpg" 
                     alt="Stud Earrings" 
                     width={60} 
                     height={60} 
                     className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" 
                   />
                 </div>
                 <p className="text-xs font-medium text-gray-900 text-center">Studs</p>
               </div>
             </Link>
             
             <Link href="/collection/earrings/western" className="group block">
               <div className="bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200">
                 <div className="aspect-square w-full overflow-hidden rounded-md bg-white mb-1">
                   <Image 
                     src="/new/6.jpg" 
                     alt="Western Earrings" 
                     width={60} 
                     height={60} 
                     className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" 
                   />
                 </div>
                 <p className="text-xs font-medium text-gray-900 text-center">Western</p>
               </div>
             </Link>
             
             <Link href="/collection/earrings/korean" className="group block">
               <div className="bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200">
                 <div className="aspect-square w-full overflow-hidden rounded-md bg-white mb-1">
                   <Image 
                     src="/new/7.jpg" 
                     alt="Korean Earrings" 
                     width={60} 
                     height={60} 
                     className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" 
                   />
                 </div>
                 <p className="text-xs font-medium text-gray-900 text-center">Korean</p>
               </div>
             </Link>
             
             <Link href="/collection/earrings" className="group block">
               <div className="bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200">
                 <div className="aspect-square w-full overflow-hidden rounded-md bg-white mb-1">
                   <Image 
                     src="/new/8.jpg" 
                     alt="Jhumkas" 
                     width={60} 
                     height={60} 
                     className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" 
                   />
                 </div>
                 <p className="text-xs font-medium text-gray-900 text-center">Jhumkas</p>
               </div>
             </Link>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/collection/earrings" className="block text-center py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">
              View All Earrings
            </Link>
          </div>
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

                {/* Account Dropdown */}
                <div className="relative" ref={accountDropdownRef}>
                  {authLoading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                  ) : user ? (
                    <>
                      <button
                        className="relative flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-black transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                        onMouseEnter={() => setActiveDropdown("account")}
                        onClick={() => setActiveDropdown(activeDropdown === "account" ? null : "account")}
                        aria-label="Account menu"
                        aria-expanded={activeDropdown === "account"}
                      >
                        {/* User avatar with initial */}
                        <span className="text-xs font-medium text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                        </span>

                        {/* Online status indicator */}
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      </button>

                      <AnimatePresence>
                        {activeDropdown === "account" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="absolute right-0 bg-white shadow-xl rounded-xl py-2 w-64 mt-2 border border-gray-200 z-50"
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            {/* User info header */}
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                            </div>

                            <div className="py-2">
                              <Link
                                href="/profile"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                                Your Profile
                              </Link>

                              <Link
                                href="/settings"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Settings className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                                Settings
                              </Link>

                              <Link
                                href="/notifications"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Bell className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                                Notifications
                                <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">3</span>
                              </Link>
                            </div>

                            <div className="py-2 border-t border-gray-100">
                              <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                              >
                                <LogOut className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                                Sign out
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="relative flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 transition-all duration-300 hover:scale-110 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                      aria-label="Login"
                    >
                      <User className="h-4 w-4 text-gray-600" />
                    </Link>
                  )}
                </div>
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
            className="md:hidden fixed top-0 right-0 w-full max-w-sm h-screen bg-[#fff3f3] shadow-2xl z-[60] overflow-y-auto"
            ref={mobileMenuRef}
          >
            <div className="px-4 py-4">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src="/logo/logo.png"
                    alt="BuyBlend Logo"
                    width={40}
                    height={40}
                    priority
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="text-xl font-serif tracking-wide text-black">BLEND</span>
                    <span className="text-[8px] font-serif text-black uppercase tracking-normal">Pure Blend, Pure You</span>
                  </div>
                </Link>
                <button
                  className="p-2 transition-transform hover:scale-110 duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
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
                        <Link href="/collection" className="block py-2 font-semibold text-gray-900 border-b border-gray-200 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>
                          All Products
                        </Link>
                        <Link href="/collection/pendants" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Pendants</Link>
                        <Link href="/collection/earrings" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Earrings</Link>
                        <Link href="/collection/ring" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Rings</Link>
                        <Link href="/collection/combos" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Combos</Link>
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
                        <Link href="/collection/earrings" className="block py-1 hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" onClick={() => setIsMobileMenuOpen(false)}>Jhumkas</Link>
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

                {/* Mobile Action Buttons */}
                <div className="border-t pt-4 mt-4 flex flex-col space-y-3">
                  <button
                    className="flex items-center space-x-3 text-base hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 py-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsSearchOpen(true)
                    }}
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Products</span>
                  </button>
                  <Link href="/wishlist" className="flex items-center space-x-3 text-base hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="h-5 w-5" />
                    <span>My Wishlist</span>
                    {wishlistState.itemCount > 0 && (
                      <span className="ml-auto bg-black text-white text-xs px-2 py-1 rounded-full">
                        {wishlistState.itemCount}
                      </span>
                    )}
                  </Link>

                  {/* User Section */}
                  {authLoading ? (
                    <div className="flex items-center space-x-3 py-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ) : user ? (
                    <>
                      <div className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg mb-2">
                        <div className="font-medium">Hello, {user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 text-base hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-base hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-full text-left py-2"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 text-base hover:text-gray-600 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Login / Register</span>
                    </Link>
                  )}
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
            className="md:hidden fixed inset-0 bg-black/30 z-[55]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}