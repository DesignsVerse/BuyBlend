"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { urlFor, fileUrl } from "@/lib/sanity/client"
import { PlayCircle, ChevronLeft, ChevronRight, Pause } from "lucide-react"
import { motion } from "framer-motion"

export function ProductMediaSlider({ mediaItems, product }: { mediaItems: any[], product: any }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const mobileContainerRef = useRef<HTMLDivElement | null>(null)

  const activeMedia = mediaItems[activeIndex]

  const getMediaUrl = (mediaItem: any): string => {
    if (!mediaItem) return "/placeholder.svg"
    try {
      if (mediaItem._type === "image" && mediaItem.asset) {
        return urlFor(mediaItem)?.width(1000)?.height(1000)?.url() ?? "/placeholder.svg"
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
    setIsPlaying(true)
    setActiveIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
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

  useEffect(() => {
    // Pause all videos first
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex && activeMedia?._type === "file" && isPlaying) {
          const playPromise = video.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => setIsPlaying(false))
          }
        } else {
          video.pause()
        }
      }
    })
  }, [activeIndex, activeMedia?._type, isPlaying])

  // Sync active index with mobile horizontal scroll
  const handleMobileScroll = () => {
    const container = mobileContainerRef.current
    if (!container) return
    const width = container.clientWidth || 1
    const index = Math.round(container.scrollLeft / width)
    if (index !== activeIndex) {
      setActiveIndex(index)
    }
  }

  const scrollMobileTo = (index: number) => {
    const container = mobileContainerRef.current
    if (!container) return
    const width = container.clientWidth
    container.scrollTo({ left: index * width, behavior: "smooth" })
    setActiveIndex(index)
    setIsPlaying(true)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-">
      {/* Desktop thumbnails (left side) */}
      <div className="hidden lg:flex flex-col space-y-3 w-16">
        {mediaItems.map((item, index) => (
          <button
            key={item._key || index}
            onClick={() => {
              setActiveIndex(index)
              setIsPlaying(true)
            }}
            className={`relative aspect-square overflow-hidden rounded-md cursor-pointer border-2 transition-all 
              ${activeIndex === index ? "border-black" : "border-gray-200 hover:border-gray-400"}`}
          >
            {item._type === "image" ? (
              <Image
                src={getMediaUrl(item)}
                alt={item.alt || `${product.name} ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <video
                src={getMediaUrl(item)}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main media container */}
      <div className="relative flex-1">
        <div className="relative h-[530px] w-full overflow-hidden rounded-lg bg-black hidden lg:block">
          {/* Desktop sliding container */}
          <div className="flex h-full w-full">
            <motion.div
              className="flex h-full w-full"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.6
              }}
            >
              {mediaItems.map((item, index) => (
                <div
                  key={item._key || index}
                  className="relative w-full h-full flex-shrink-0"
                >
                  {item._type === "image" ? (
                    <Image
                      src={getMediaUrl(item)}
                      alt={item.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  ) : item._type === "file" ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={el => { if (el) videoRefs.current[index] = el }}
                        src={getMediaUrl(item)}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        autoPlay={index === activeIndex}
                      />
                      {index === activeIndex && !isPlaying && (
                        <button
                          onClick={togglePlay}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40"
                        >
                          <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg" />
                        </button>
                      )}
                      {index === activeIndex && isPlaying && (
                        <button
                          onClick={togglePlay}
                          className="absolute bottom-4 right-4 bg-black/60 rounded-full p-2 text-white"
                        >
                          <Pause className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Desktop arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}
        </div>

        {/* Mobile slider with thumbnails below */}
        <div className="lg:hidden relative w-full h-[400px] overflow-hidden rounded-lg bg-black">
          <div
            ref={mobileContainerRef}
            onScroll={handleMobileScroll}
            className="flex w-[400px] h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
          >
            {mediaItems.map((item, index) => (
              <div
                key={item._key || index}
                className="flex-shrink-0 w-full h-full snap-center relative"
              >
                {item._type === "image" ? (
                  <Image
                    src={getMediaUrl(item)}
                    alt={item.alt || `${product.name} ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <video
                    src={getMediaUrl(item)}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {mediaItems.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${activeIndex === index ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile thumbnail strip */}
        {mediaItems.length > 1 && (
          <div className="lg:hidden mt-3 flex items-center gap-2 overflow-x-auto">
            {mediaItems.map((item, index) => (
              <button
                key={item._key || index}
                onClick={() => scrollMobileTo(index)}
                className={`relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                  activeIndex === index ? "border-black" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {item._type === "image" ? (
                  <Image
                    src={getMediaUrl(item)}
                    alt={item.alt || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={getMediaUrl(item)}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
