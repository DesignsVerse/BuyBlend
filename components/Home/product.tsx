"use client"
import { useState, useEffect } from "react"
import { ProductCard } from "@/components/Home/product-card"
import type { Product } from "@/lib/sanity/types"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Gem } from "lucide-react"

interface FeaturedProductsSectionProps {
  featuredProducts: Product[]
}

export function FeaturedProductsSection({ featuredProducts }: FeaturedProductsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Filter only Ring category products
  const ringProducts = featuredProducts.filter(product => {
    const categoryName = product.category?.name?.toLowerCase()
    console.log('Product:', product.name, 'Category:', categoryName) // Debug log
    return categoryName === 'ring' || categoryName === 'rings'
  })

  console.log('Total featured products:', featuredProducts.length) // Debug log
  console.log('Ring products found:', ringProducts.length) // Debug log

  if (!ringProducts || ringProducts.length === 0) {
    console.log('No ring products found, hiding section') // Debug log
    return null
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
            Exquisite Jewelry Pieces
          </h2>
          
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Handpicked luxury items showcasing exceptional craftsmanship and timeless elegance
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
          {ringProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

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