"use client"
import { useState, useEffect, useRef } from "react"
import { ProductCard } from "@/components/Home/product-card"
import type { Product } from "@/lib/sanity/types"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"

interface FeaturedProductsSectionProps {
  featuredProducts: Product[]
}

export function FeaturedProductsSection({ featuredProducts }: FeaturedProductsSectionProps) {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout  | null>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        setShowScrollButtons(scrollRef.current.scrollWidth > scrollRef.current.clientWidth)
      }
    }
    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [featuredProducts])

  useEffect(() => {
    if (!isHovered && featuredProducts.length > 0) {
      autoScrollRef.current = setInterval(() => scrollRight(), 4000)
    }
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [isHovered, featuredProducts.length])

  if (!featuredProducts || featuredProducts.length === 0) return null

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector(".product-card")?.clientWidth || 320
      scrollRef.current.scrollBy({ left: -cardWidth - 24, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector(".product-card")?.clientWidth || 320
      scrollRef.current.scrollBy({ left: cardWidth + 24, behavior: "smooth" })
    }
  }

  return (
    <section className="py-6 bg-white relative overflow-hidden scrollbar-hide">
      <div className="w-full md:px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 px-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center mb-4 bg-black rounded-full px-4 py-1.5"
          >
            <Sparkles className="h-3 w-3 text-white mr-2" />
            <span className="text-xs font-medium text-white uppercase tracking-wider">
              Featured Collection
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-4">
            Best Seller
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Discover our handpicked luxury items showcasing exceptional craftsmanship
          </p>
        </motion.div>

        {/* Scrollable Products Container */}
        <div
          className="relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            ref={scrollRef}
            className="flex overflow-x-auto gap-2 pb-10 snap-x snap-mandatory scrollbar-hide w-full"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                className="flex-shrink-0 snap-center w-1/2 sm:w-1/3 md:w-[320px] lg:w-[300px] product-card"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Buttons */}
          {/* <AnimatePresence>
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
          </AnimatePresence> */}
        </div>

        {/* View All Button */}
        {/* <motion.div
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
        </motion.div> */}
      </div>
    </section>
  )
}
