"use client"

import { useState, useEffect, useRef } from "react"
import { productTestimonials } from "@/data/products/testimonials-data"
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react"

export function TestimonialSection({ productSlug }: { productSlug: string }) {
  const testimonials = productTestimonials[productSlug] || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  if (!testimonials.length) {
    return null
  }

  // Group testimonials into sets of 3
  const testimonialGroups = []
  for (let i = 0; i < testimonials.length; i += 3) {
    testimonialGroups.push(testimonials.slice(i, i + 3))
  }

  const currentGroup = testimonialGroups[currentIndex] || []

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonialGroups.length - 1 ? 0 : prev + 1))
      setIsTransitioning(false)
    }, 300)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonialGroups.length - 1 : prev - 1))
      setIsTransitioning(false)
    }, 300)
  }

  // Auto-slide functionality
  useEffect(() => {
    if (isHovered) return // Pause when hovered
    
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, testimonialGroups.length])

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <section 
      className="relative bg-gradient-to-br from-gray-50 to-white py-16 md:py-20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 bg-black rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-black rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-black rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-gray-700 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Customer Experiences</h2>
            <Sparkles className="w-5 h-5 text-gray-700 ml-2" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what our valued customers have to say about their experience with this product
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 group z-10"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-300 group z-10"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
          </button>

          {/* Testimonial Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}>
            {currentGroup.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 left-4 opacity-10">
                  <Quote className="w-10 h-10 text-black" />
                </div>
                
                {/* User Info */}
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    {/* <p className="text-xs text-gray-400 mt-1">{testimonial.date}</p> */}
                  </div>
                </div>

                {/* Testimonial Message */}
                <p className="italic text-gray-700 mb-4 leading-relaxed relative z-10">
                  "{testimonial.message}"
                </p>

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < testimonial.rating 
                            ? "fill-gray-800 text-gray-800" 
                            : "fill-gray-300 text-gray-300"
                        }`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {testimonial.rating}/5
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-10">
          <div className="flex gap-2">
            {testimonialGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-gray-900 scale-125" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial group ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">4.8/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-600">Would Recommend</div>
          </div>
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
    </section>
  )
}