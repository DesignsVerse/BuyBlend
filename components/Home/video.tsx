"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, VolumeX, Volume2, Pause, Play, ChevronLeft, ChevronRight, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { products } from '@/data/videos/product-video'

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
        if (index === activePopupIndex) {
          video.play().catch(() => { })
        } else {
          video.pause()
        }
      }
    })
  }, [activePopupIndex, isMuted])

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

          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-80 bg-white  overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer"
                onClick={() => openPopup(index)}
              >
                <div className="relative h-120">
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

        </div>
      </div>

      {/* Mobile View - Grid Layout */}
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
                className="flex-shrink-0 w-74 bg-white  overflow-hidden shadow-md border border-gray-100 cursor-pointer"
                onClick={() => openPopup(index)}
              >
                <div className="relative h-120">
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
                        <span className="text-gray-500 line-through text-xs">₹{product.price}</span>
                      )}
                    </div>
                    <button className="bg-gray-900 text-white p-2 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                      <ShoppingBag className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Reel Popup */}
      {isPopupOpen && isMobileView && (
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
                        <span className="line-through text-gray-300 text-sm">₹{product.price}</span>
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

      {/* Desktop Popup */}
      {isPopupOpen && !isMobileView && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-50 bg-black/50 text-white rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex h-[80vh]">
              {/* Video Section */}
              <div className="flex-1 relative bg-black">
                <video
                  ref={el => { popupVideoRefs.current[activePopupIndex] = el }}
                  src={products[activePopupIndex].video}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />

                {/* Navigation Arrows */}
                {products.length > 1 && (
                  <>
                    <button
                      onClick={prevProduct}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextProduct}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Product Info Section */}
              <div className="w-96 p-6 bg-white overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{products[activePopupIndex].title}</h2>
                <p className="text-gray-600 mb-6">{products[activePopupIndex].description}</p>
                
                <div className="flex items-center mb-6">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{products[activePopupIndex].discountPrice || products[activePopupIndex].price}
                  </span>
                  {products[activePopupIndex].discountPrice && (
                    <span className="text-lg line-through text-gray-500 ml-2">
                      ₹{products[activePopupIndex].price}
                    </span>
                  )}
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>

                {/* Thumbnail Navigation */}
                {products.length > 1 && (
                  <div className="mt-8">
                    <h3 className="font-medium mb-3">More Videos</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {products.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => setActivePopupIndex(index)}
                          className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all ${
                            index === activePopupIndex ? 'border-gray-900' : 'border-transparent'
                          }`}
                        >
                          <video
                            src={product.video}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
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