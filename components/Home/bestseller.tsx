"use client"
import { useState, useEffect, useRef } from "react"
import { ProductCard } from "@/components/Home/product-card"
import type { Product } from "@/lib/sanity/types"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

interface FeaturedProductsSectionProps {
  featuredProducts: Product[]
}

export function FeaturedProductsSection({ featuredProducts }: FeaturedProductsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!featuredProducts || featuredProducts.length === 0) {
    return null
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center mb-3 bg-amber-50 rounded-full px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Curated Collection
            </span>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-serif font-light text-gray-900 mb-3">
            Featured Products
          </h2>
          
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Handpicked luxury items showcasing exceptional craftsmanship and timeless elegance from all categories
          </p>
        </motion.div>

        {/* Scrollable Products Container */}
        <div className="relative">
          <motion.div 
            ref={scrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 md:gap-6 pb-4"
            style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className="flex-shrink-0 snap-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Buttons */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8"
        >
          <button className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 group text-sm font-medium shadow-sm hover:shadow-md">
            Browse All Collections
            <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
