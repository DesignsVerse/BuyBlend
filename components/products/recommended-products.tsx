"use client"

import { useEffect, useState, useRef } from "react"
import { client, queries } from "@/lib/sanity/client"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react"

interface Product {
  _id: string
  name: string
  slug: { current: string }
  price: number
  originalPrice?: number
  image?: string
  category?: { name: string }
  featured?: boolean
  inStock?: boolean
  rating?: number
}

export default function RecommendedProducts({
  type,
  currentSlug,
}: {
  type: string
  currentSlug: string
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(4)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await client.fetch(queries.productsByType, {
          type,
          currentSlug,
        })
        setProducts(data)
      } catch (error) {
        console.error("Error fetching recommended products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [type, currentSlug])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1)
      } else if (window.innerWidth < 768) {
        setSlidesToShow(2)
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3)
      } else {
        setSlidesToShow(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev >= products.length - slidesToShow ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev <= 0 ? products.length - slidesToShow : prev - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <div className="mt-16">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Recommended Products</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!products.length) {
    return null
  }

  return (
    <div className="mt-16 relative">
      {/* Section Header */}
      <div className="flex items-center justify-center mb-8">
        <Sparkles className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
      </div>

      {/* Slider Container */}
      <div className="relative group">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Previous products"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Next products"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Slider */}
        <div 
          ref={sliderRef}
          className="overflow-hidden"
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
          >
            {products.map((product) => (
              <div 
                key={product._id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <Link
                  href={`/products/${product.slug.current}`}
                  className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="aspect-square relative overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                        No Image
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.featured && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      {!product.inStock && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    
                    {product.category?.name && (
                      <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
                    )}

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= (product.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-300 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.rating})</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      {products.length > slidesToShow && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(products.length / slidesToShow) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index * slidesToShow)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide >= index * slidesToShow && currentSlide < (index + 1) * slidesToShow
                    ? "bg-gray-900 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}