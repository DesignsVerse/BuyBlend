"use client"
import { useState, useEffect, useRef } from "react"
import { ProductCard } from "@/components/Home/product-card"
import type { Product } from "@/lib/sanity/types"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { client } from "@/lib/sanity/client" // Import your Sanity client

interface NewArrivalsSectionProps {
  initialNewArrivals?: Product[]
}

export function NewArrivalsSection({ initialNewArrivals = [] }: NewArrivalsSectionProps) {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
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
    <section className="md: py-6 bg-white relative overflow-hidden scrollbar-hide">
    {/* ✅ Full width instead of container with px-4 */}
    <div className="w-full md:px-4 relative z-10">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 px-4" // sirf header ko thoda padding diya
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
  
      {/* Category Filters */}
      <div className="grid grid-cols-3 gap-2 mb-8 md:flex md:justify-center md:gap-4 md:flex-wrap ">
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
  
    {/* ✅ Full width scrollable container with correct snap padding */}
<div
  className="relative w-full"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  <motion.div
    ref={scrollRef}
    className="
      flex overflow-x-auto gap-2 pt-4 pb-10 no-scrollbar w-full
      snap-x snap-mandatory
      -mx- px-4
      scroll-px-4
    "
  >
    {filteredProducts.length > 0 ? (
      filteredProducts.map((product) => (
        <motion.div
          key={product._id}
          className="
            product-card flex-shrink-0
            snap-center
            w-1/2 sm:w-1/3 md:w-[320px] lg:w-[300px]
          "
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
</div>

    </div>
  </section>
  
  )
}
