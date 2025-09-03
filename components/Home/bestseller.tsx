"use client"
import { useState, useEffect, useRef } from "react"
import { ProductCard } from "@/components/Home/product-card"
import type { Product } from "@/lib/sanity/types"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react"

interface FeaturedProductsSectionProps {
  featuredProducts: Product[]
}

export function FeaturedProductsSection({ featuredProducts }: FeaturedProductsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setIsVisible(true)
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Auto-scroll functionality
    if (!isHovered && featuredProducts.length > 0) {
      autoScrollRef.current = setInterval(() => {
        scrollRight()
      }, 4000)
    }
    
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
      }
    }
  }, [isHovered, featuredProducts.length])

  if (!featuredProducts || featuredProducts.length === 0) {
    return null
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" })
      setCurrentIndex(prev => Math.max(0, prev - 1))
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" })
      setCurrentIndex(prev => Math.min(featuredProducts.length - 1, prev + 1))
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth / featuredProducts.length
      scrollRef.current.scrollTo({ left: index * scrollWidth, behavior: "smooth" })
      setCurrentIndex(index)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white via-amber-50/30 to-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center mb-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full px-5 py-2 shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="h-4 w-4 text-white mr-2" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Curated Collection
            </span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 relative inline-block">
            Best Sellers
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent bottom-0 left-0"
            ></motion.div>
          </h2>
          
          <p className="text-gray-600 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
            Handpicked luxury items showcasing exceptional craftsmanship and timeless elegance from all categories
          </p>
        </motion.div>

        {/* Scrollable Products Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div 
            ref={scrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 pb-8 px-2"
            style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex-shrink-0 snap-center w-[280px] sm:w-[300px] transform transition-all duration-300"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Buttons */}
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.button 
                  onClick={scrollLeft}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-all backdrop-blur-sm border border-gray-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </motion.button>
                <motion.button 
                  onClick={scrollRight}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-all backdrop-blur-sm border border-gray-100"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
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
          className="text-center mt-10"
        >
          <motion.button 
            className="inline-flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-gray-900/20 transition-all duration-300 group text-sm font-semibold shadow-md"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Browse All Collections
            <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}