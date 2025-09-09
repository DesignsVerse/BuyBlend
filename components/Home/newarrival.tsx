"use client"
import { useState, useEffect, useRef } from "react"
import { ProductCard } from "@/components/Home/product-card"
import type { Product } from "@/lib/sanity/types"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { client } from "@/lib/sanity/client" // Import your Sanity client

interface NewArrivalsSectionProps {
  initialNewArrivals?: Product[]
}

export function NewArrivalsSection({ initialNewArrivals = [] }: NewArrivalsSectionProps) {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout>()
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("earring") // Default: Earrings
  const [newArrivals, setNewArrivals] = useState<Product[]>(initialNewArrivals)
  const [isLoading, setIsLoading] = useState(!initialNewArrivals.length)

  // Categories with Korean and Western as types
  const categories = [
    { label: "Earrings", value: "earring" },
    { label: "Necklace", value: "necklace" },
    { label: "Ring", value: "ring" },
    { label: "Pendant", value: "pendant" },
    { label: "Korean", value: "korean" },
    { label: "Western", value: "western" },
  ]

  // Fetch all new arrivals if not provided (e.g., recent products across categories)
  useEffect(() => {
    if (!initialNewArrivals.length) {
      const fetchNewArrivals = async () => {
        try {
          const data = await client.fetch(
            `*[_type == "product"] | order(_createdAt desc) [0...20] { // Fetch recent 20 products; adjust as needed
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
          setNewArrivals(data)
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching new arrivals:", error)
          setIsLoading(false)
        }
      }
      fetchNewArrivals()
    }
  }, [initialNewArrivals.length])

  // Filtered products: Use category for standard ones, type for Korean/Western
  const filteredProducts = newArrivals.filter((product) => {
    if (!selectedCategory) return true;
    if (['korean', 'western'].includes(selectedCategory)) {
      return product.type === selectedCategory; // Assuming type is a string field matching the value
    } else {
      return product.category?.slug?.current === selectedCategory;
    }
  })

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        setShowScrollButtons(scrollRef.current.scrollWidth > scrollRef.current.clientWidth)
      }
    }
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [filteredProducts])

  useEffect(() => {
    if (!isHovered && filteredProducts.length > 0) {
      autoScrollRef.current = setInterval(() => scrollRight(), 4000)
    }
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [isHovered, filteredProducts.length])

  if (isLoading) return <div className="text-center py-16">Loading new arrivals...</div>
  if (newArrivals.length === 0) return null

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('.product-card')?.clientWidth || 320
      scrollRef.current.scrollBy({ left: -cardWidth - 24, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('.product-card')?.clientWidth || 320
      scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: "smooth" })
    }
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden scrollbar-hide">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center mb-4 bg-black rounded-full px-4 py-1.5"
          >
            <Sparkles className="h-3 w-3 text-white mr-2" />
            <span className="text-xs font-medium text-white uppercase tracking-wider">
              New Arrivals
            </span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-4">
            Fresh Arrivals
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Explore our latest additions in premium jewelry
          </p>
        </motion.div>

        {/* Category Filters - Responsive: 3 per row on mobile */}
        <div className="grid grid-cols-3 gap-2 mb-8 md:flex md:justify-center md:gap-4 md:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.value
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } md:px-4 md:py-2 md:text-sm`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Products Container - Adjusted widths for responsiveness */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-10 px-2 snap-x snap-mandatory scrollbar-hide md:gap-6"
            style={{ scrollPadding: "0 50px" }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="flex-shrink-0 snap-center w-[calc(100%-16px)] sm:w-[calc(50%-16px)] md:w-[320px] lg:w-[300px] product-card"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full text-gray-600 py-8">
                No new arrivals in this category yet.
              </div>
            )}
          </motion.div>

          {/* Scroll Buttons */}
          <AnimatePresence>
            {showScrollButtons && (
              <>
                <motion.button 
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-r-lg shadow-md hover:bg-gray-50 transition-all border border-gray-200 hidden md:flex items-center justify-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </motion.button>
                <motion.button 
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-l-lg shadow-md hover:bg-gray-50 transition-all border border-gray-200 hidden md:flex items-center justify-center"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <motion.button 
            className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-sm hover:bg-gray-800 transition-all duration-300 group text-sm font-medium border border-black mt-4"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            View All Products
            <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
