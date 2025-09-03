"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react"
import { testimonials, Testimonial } from "@/data/products/testimonials-data"

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'left'|'right'>('right')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const handlePrev = () => {
    if (isTransitioning) return
    setDirection('left')
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? Math.ceil(testimonials.length / 3) - 1 : prev - 1))
      setIsTransitioning(false)
    }, 300)
  }

  const handleNext = () => {
    if (isTransitioning) return
    setDirection('right')
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === Math.ceil(testimonials.length / 3) - 1 ? 0 : prev + 1))
      setIsTransitioning(false)
    }, 300)
  }

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Get current testimonials to display (3 for desktop, 1 for mobile)
  const getCurrentTestimonials = () => {
    if (isMobile) {
      return [testimonials[currentIndex]]
    }
    
    const startIndex = currentIndex * 3
    return [
      testimonials[startIndex % testimonials.length],
      testimonials[(startIndex + 1) % testimonials.length],
      testimonials[(startIndex + 2) % testimonials.length]
    ]
  }

  const currentTestimonials = getCurrentTestimonials()

  return (
    <section className="relative bg-white py-16 md:py-24 overflow-hidden">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Customer Experiences</h2>
          </div>
          <p className="text-gray-600 mx-auto">
            Discover what our valued customers have to say about their experience with our products
          </p>
        </div>

        {/* Testimonial Cards Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Cards Grid - 3 columns on desktop, 1 on mobile */}
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}>
            {currentTestimonials.map((testimonial, index) => (
              <div key={testimonial.id || index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                {/* Quote Icon */}
                <div className="absolute top-4 left-4 opacity-10">
                  <Quote className="w-10 h-10 text-black" />
                </div>
                
                {/* Message */}
                <p className="text-gray-700 italic leading-relaxed mb-6 relative z-10">
                  "{testimonial.message}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    
                    {/* Rating */}
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 0) 
                              ? "fill-gray-800 text-gray-800" 
                              : "fill-gray-300 text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls - Only show on mobile */}
          {isMobile && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
              </button>
            </>
          )}
        </div>

        {/* Progress Indicators */}
        <div className="flex flex-col items-center mt-10">
          {/* Dots - Show for mobile only */}
          {isMobile && (
            <div className="flex justify-center gap-3 mb-4">
              {Array.from({ length: Math.ceil(testimonials.length / 1) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-gray-900 scale-125" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Dots - Show for desktop (grouped by 3) */}
          {!isMobile && (
            <div className="flex justify-center gap-3 mb-4">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-gray-900 scale-125" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial group ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Counter */}
          <div className="text-sm text-gray-500">
            {!isMobile ? `Showing ${currentIndex * 3 + 1}-${Math.min((currentIndex * 3) + 3, testimonials.length)} of ${testimonials.length}` : `${currentIndex + 1} of ${testimonials.length}`}
          </div>
        </div>

        {/* Trust Badges */}
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