"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, VolumeX, Volume2, Pause, Play, ChevronLeft, ChevronRight, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { products} from '@/data/videos/product-video'

export default function VideoShowcaseReels() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activePopupIndex, setActivePopupIndex] = useState(0)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isReelMode, setIsReelMode] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const popupVideoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Set up intersection observer for main view
  useEffect(() => {
    if (containerRef.current && !isMobileView) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.getAttribute('data-index') || '0')
              setActiveIndex(index)
            }
          })
        },
        {
          root: containerRef.current,
          threshold: 0.8
        }
      )

      const videoContainers = containerRef.current.querySelectorAll('.video-container')
      videoContainers.forEach(container => {
        observerRef.current?.observe(container)
      })
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [isMobileView])

  // Handle main video play state
  useEffect(() => {
    if (!isReelMode) {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          video.muted = isMuted
          if (index === activeIndex && isPlaying) {
            video.play().catch(() => setIsPlaying(false))
          } else {
            video.pause()
          }
        }
      })
    }
  }, [activeIndex, isPlaying, isMuted, isReelMode])

  // Handle popup video play state
  useEffect(() => {
    popupVideoRefs.current.forEach((video, index) => {
      if (video) {
        video.muted = isMuted
        if (index === activePopupIndex && isReelMode) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      }
    })
  }, [activePopupIndex, isMuted, isReelMode])

  // Scroll to center in popup
  useEffect(() => {
    if (isPopupOpen && sliderRef.current) {
      const itemWidth = sliderRef.current.children[0]?.clientWidth || 0
      const scrollPosition = selectedIndex * itemWidth
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
      setActivePopupIndex(selectedIndex)
    }
  }, [isPopupOpen, selectedIndex])

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const itemWidth = sliderRef.current.children[0]?.clientWidth || 0
      const centerIndex = Math.round(scrollLeft / itemWidth)
      setActivePopupIndex(centerIndex)
    }
  }, [])

  useEffect(() => {
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener('scroll', handleScroll)
      return () => slider.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Handle touch events for mobile swipe in reel mode
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isReelMode) return
    const touchY = e.targetTouches[0].clientY
    setActiveIndex(prev => {
      if (touchY < window.innerHeight / 2) {
        // Swipe up - next video
        return Math.min(products.length - 1, prev + 1)
      } else {
        // Swipe down - previous video
        return Math.max(0, prev - 1)
      }
    })
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const goToIndex = (index: number) => {
    setActiveIndex(index)
    if (containerRef.current) {
      const element = containerRef.current.children[index] as HTMLElement
      if (element) {
        containerRef.current.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        })
      }
    }
  }

  const nextProduct = () => {
    if (activePopupIndex < products.length - 1) {
      const nextIndex = activePopupIndex + 1
      setActivePopupIndex(nextIndex)
      if (sliderRef.current) {
        const itemWidth = sliderRef.current.children[0]?.clientWidth || 0
        const scrollPosition = nextIndex * itemWidth
        sliderRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  const prevProduct = () => {
    if (activePopupIndex > 0) {
      const prevIndex = activePopupIndex - 1
      setActivePopupIndex(prevIndex)
      if (sliderRef.current) {
        const itemWidth = sliderRef.current.children[0]?.clientWidth || 0
        const scrollPosition = prevIndex * itemWidth
        sliderRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  const openPopup = (index: number) => {
    setSelectedIndex(index)
    setIsPopupOpen(true)
    if (isMobileView) {
      setIsReelMode(true)
    }
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setIsReelMode(false)
  }

  return (
    <section className="w-full bg-white text-gray-900">
      {/* Desktop View - Side by Side Videos */}
      <div className="hidden md:block py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold mb-2 text-gray-900">Watch and Shop</h2>
            <p className="text-gray-600">Video Collection</p>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer"
                onClick={() => openPopup(index)}
              >
                <div className="relative h-80">
                  <video
        ref={el => { videoRefs.current[index] = el }}
        src={product.video}
                            className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                </div>
                
                <div className="p-4 bg-white">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2 text-gray-900">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">₹{product.discountPrice || product.price}</span>
                      {product.discountPrice && (
                        <span className="text-gray-500 line-through text-sm">₹{product.price}</span>
                      )}
                    </div>
                    <button className="bg-gray-900 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-gray-900' : 'bg-gray-300'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View - Grid Layout (Same as Desktop) */}
      <div className="block md:hidden py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold mb-2 text-gray-900">Watch and Shop</h2>
            <p className="text-gray-600">Video Collection</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
  {products.map((product, index) => (
    <div 
      key={product.id}
      className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 cursor-pointer"
      onClick={() => openPopup(index)}
    >
      <div className="relative h-64 w-64">
        <video
ref={el => { videoRefs.current[index] = el }}
src={product.video}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      
      <div className="p-3 bg-white">
        <h3 className="font-medium text-sm mb-1 line-clamp-2 text-gray-900">{product.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-gray-900 text-sm">₹{product.discountPrice || product.price}</span>
            {product.discountPrice && (
              <span className="text-gray-500 line-through text-sm">₹{product.price}</span>
            )}
          </div>
          <button className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-800 transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </div>

      {isPopupOpen && isReelMode && (
  <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-start overflow-hidden">
    {/* Close Button */}
    <button
      onClick={closePopup}
      className="absolute top-4 right-4 z-50 bg-black/50 text-white rounded-full p-2"
    >
      <X className="h-6 w-6" />
    </button>

    {/* Vertical Scrollable Reel */}
    <div
      ref={sliderRef}
      className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className="w-full h-screen snap-start relative flex items-center justify-center"
        >
          <video
ref={el => { popupVideoRefs.current[index] = el }}
src={product.video}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />

          {/* Right Side Navigation Center */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
            <button
              onClick={prevProduct}
              className="bg-white/30 text-white rounded-full p-2 hover:bg-white/50 transition-colors"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <button
              onClick={nextProduct}
              className="bg-white/30 text-white rounded-full p-2 hover:bg-white/50 transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="font-medium text-lg">{product.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold">₹{product.discountPrice || product.price}</span>
                {product.discountPrice && (
                  <span className="line-through text-gray-300 text-sm">{product.price}</span>
                )}
              </div>
              <button className="bg-white text-black px-3 py-2 rounded-md font-medium flex items-center gap-1">
                <ShoppingBag className="w-4 h-4" /> Shop Now
              </button>
            </div>
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-20 right-4 bg-black/50 text-white rounded-full p-2"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      ))}
    </div>
  </div>
)}


      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}