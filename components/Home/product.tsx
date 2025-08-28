"use client"
import { useState, useEffect } from "react"
import { ProductCard } from "@/components/Home/product-card"
import type { Product } from "@/lib/sanity/types"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface FeaturedProductsSectionProps {
  featuredProducts: Product[]
}

export function FeaturedProductsSection({ featuredProducts }: FeaturedProductsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!featuredProducts || featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
            <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">Premium Collection</span>
          </div>
          <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">Featured Jewelry</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most exquisite pieces, carefully selected for their exceptional craftsmanship and timeless beauty.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="bg-transparent border border-gray-300 text-gray-700 px-8 py-3 rounded-sm hover:bg-gray-900 hover:text-white transition-all duration-300 font-medium">
            View All Collections
          </button>
        </motion.div>
      </div>
    </section>
  )
}