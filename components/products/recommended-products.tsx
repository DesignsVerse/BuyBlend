"use client"
import { useState, useEffect, useRef } from "react"
import { ProductCard } from "@/components/Home/product-card"
import type { Product } from "@/lib/sanity/types"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"

interface RecommendedProductsSectionProps {
  recommendedProducts: Product[]
}

export function RecommendedProductsSection({ recommendedProducts }: RecommendedProductsSectionProps) {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout>()
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    const checkOverflow = () => { 
      if (scrollRef.current) {
        setShowScrollButtons(scrollRef.current.scrollWidth > scrollRef.current.clientWidth)
      }
    }
    
    checkIsMobile()
    checkOverflow()
    
    const handleResize = () => {
      checkIsMobile()
      checkOverflow()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [recommendedProducts])

  useEffect(() => {
    if (!isHovered && recommendedProducts.length > 0) {
      autoScrollRef.current = setInterval(() => scrollRight(), 4000)
    }
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [isHovered, recommendedProducts.length])

  if (!recommendedProducts || recommendedProducts.length === 0) return null

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('.product-card')?.clientWidth || 280
      const scrollAmount = isMobile ? cardWidth * 2 + 16 : cardWidth + 16
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('.product-card')?.clientWidth || 280
      const scrollAmount = isMobile ? cardWidth * 2 + 16 : cardWidth + 16
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden scrollbar-hide">
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
              Recommended for You
            </span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-2">
            Our Top Picks
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Explore products tailored just for you, handpicked based on your preferences
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
            className="flex overflow-x-auto gap-3 pb-4 md:pb-6 px-2 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollPadding: "0 16px" }}
          >
            {recommendedProducts.map((product) => (
              <motion.div
                key={product._id}
                className={`flex-shrink-0 snap-center product-card ${
                  isMobile 
                    ? 'w-[calc(50%-12px)]' // 2 cards per view on mobile
                    : 'w-[260px] sm:w-[280px] md:w-[300px]' // desktop/tablet sizes
                }`}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Buttons */}
          <AnimatePresence>
            {showScrollButtons && recommendedProducts.length > (isMobile ? 2 : 1) && (
              <>
                <motion.button 
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 rounded-r-lg shadow-md hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center"
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
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 md:p-3 rounded-l-lg shadow-md hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center"
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
      </div>
    </section>
  )
}
