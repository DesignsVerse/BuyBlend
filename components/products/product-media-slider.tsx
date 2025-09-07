"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { urlFor, fileUrl } from "@/lib/sanity/client"
import { PlayCircle, ChevronLeft, ChevronRight, Pause, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ProductMediaSlider({ mediaItems, product }: { mediaItems: any[], product: any }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showAllOffers, setShowAllOffers] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const thumbnailVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const activeMedia = mediaItems[activeIndex]

  const getMediaUrl = (mediaItem: any): string => {
    if (!mediaItem) return "/placeholder.svg"

    try {
      if (mediaItem._type === "image" && mediaItem.asset) {
        return urlFor(mediaItem)?.width(800)?.height(800)?.url() ?? "/placeholder.svg"
      }

      if (mediaItem._type === "file" && mediaItem.asset) {
        return fileUrl(mediaItem) ?? "/placeholder.svg"
      }
    } catch (err) {
      console.error("Error generating media URL:", err)
    }

    return "/placeholder.svg"
  }

  const handlePrev = () => {
    setDirection(-1)
    setIsPlaying(true)
    setActiveIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setIsPlaying(true)
    setActiveIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
  }

  const togglePlay = () => {
    if (videoRefs.current[activeIndex]) {
      if (isPlaying) {
        videoRefs.current[activeIndex]?.pause()
      } else {
        videoRefs.current[activeIndex]?.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle video play state when active index changes
  useEffect(() => {
    // Pause all videos first
    videoRefs.current.forEach(video => {
      if (video) video.pause()
    })

    // Play the active video if it's a video and autoplay is enabled
    if (activeMedia?._type === "file" && isPlaying) {
      const playPromise = videoRefs.current[activeIndex]?.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, update state accordingly
          setIsPlaying(false)
        })
      }
    }
  }, [activeIndex, activeMedia?._type, isPlaying])

  // Set up thumbnail videos to autoplay and loop
  useEffect(() => {
    thumbnailVideoRefs.current.forEach((video, index) => {
      if (video) {
        video.muted = true
        video.loop = true
        video.play().catch(() => {
          // Silently handle autoplay errors for thumbnails
        })
      }
    })
  }, [])

  // Mock offers data
  const offers = [
    "5% cashback on Flipkart Axis Bank Credit Card T&C",
    "5% cashback on Flipkart SBI Credit Card upto ₹500",
    "5% cashback on Axis Bank Flipkart Debit Card T&C",
    "Special Price Get extra 4% off (price inclusive of cashback)",
    "Additional 5% off on EMI transactions",
    "No cost EMI on select credit cards"
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto p-4">
      {/* Left Column - Media Slider */}
      <div className="lg:w-1/2">
        <div className="space-y-4">
          {/* Main Media with Slider Controls */}
          <div className="relative h-96 w-full overflow-hidden rounded-lg bg-black">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {activeMedia?._type === "image" ? (
                  <Image
                    src={getMediaUrl(activeMedia)}
                    alt={activeMedia.alt || product.name}
                    fill
                    className="object-contain"
                  />
                ) : activeMedia?._type === "file" ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={el => {
                        if (el) videoRefs.current[activeIndex] = el
                      }} src={getMediaUrl(activeMedia)}
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      autoPlay
                    />
                    {/* Play/Pause overlay button */}
                    {!isPlaying && (
                      <button
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40"
                      >
                        <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg" />
                      </button>
                    )}
                    {isPlaying && (
                      <button
                        onClick={togglePlay}
                        className="absolute bottom-4 right-4 bg-black/60 rounded-full p-2 text-white hover:bg-black/80 transition-colors"
                      >
                        <Pause className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                ) : (
                  <Image
                    src="/placeholder.svg"
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Slider Arrows */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Slide Indicator */}
            {mediaItems.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {mediaItems.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${activeIndex === index ? "bg-white" : "bg-white/50"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {mediaItems.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {mediaItems.map((item, index) => (
                <button
                  key={item._key || index}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1)
                    setActiveIndex(index)
                    setIsPlaying(true)
                  }}
                  className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer border-2 transition-all 
                    ${activeIndex === index ? "border-blue-600" : "border-transparent hover:border-gray-400"}`}
                >
                  {item._type === "image" ? (
                    <Image
                      src={getMediaUrl(item)}
                      alt={item.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <>
                      {/* Video thumbnail with actual video */}
                      <div className="relative w-full h-full">
                        <video
                          ref={el => {
                            if (el) thumbnailVideoRefs.current[index] = el
                          }}
                          src={getMediaUrl(item)}
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                          autoPlay
                        />
                        {/* Video play icon overlay for consistency */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <PlayCircle className="w-6 h-6 text-white/80" />
                        </div>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    
    </div>
  )
}