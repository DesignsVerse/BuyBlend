"use client"

import { useState } from "react"
import Image from "next/image"
import { urlFor, fileUrl } from "@/lib/sanity/client"
import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ProductMediaSlider({ mediaItems, product }: { mediaItems: any[], product: any }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0) // left/right track karne ke liye

  const activeMedia = mediaItems[activeIndex]

  const getMediaUrl = (mediaItem: any, width = 800, height = 800): string => {
    if (!mediaItem) return "/placeholder.svg"
    if (mediaItem._type === "image" && mediaItem.asset) {
      return urlFor(mediaItem).width(width).height(height).url()
    }
    if (mediaItem._type === "file" && mediaItem.asset) {
      return fileUrl(mediaItem) || "/placeholder.svg"
    }
    return "/placeholder.svg"
  }

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Media with Slider Controls */}
      <div className="relative h-120 w-full overflow-hidden rounded-lg bg-white shadow-md mx-auto">
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
                src={getMediaUrl(activeMedia, 600, 600)}
                alt={activeMedia.alt || product.name}
                fill
                className="object-cover"
              />
            ) : activeMedia?._type === "file" ? (
              <video
  src={getMediaUrl(activeMedia)}
  autoPlay
  loop
  muted
  playsInline
  controls={false}
  onContextMenu={(e) => e.preventDefault()}
  className="w-full h-full object-cover"
/>

            ) : (
              <Image
                src="/placeholder.svg"
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Slider Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {mediaItems.map((item, index) => (
            <div
              key={item._key || index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1) // decide slide direction
                setActiveIndex(index)
              }}
              className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer border-2 transition-colors 
                ${activeIndex === index ? "border-blue-500" : "border-transparent hover:border-blue-400"}`}
            >
              {item._type === "image" ? (
                <Image
                  src={getMediaUrl(item, 150, 150)}
                  alt={item.alt || `${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <>
                  <video
  src={getMediaUrl(activeMedia)}
  autoPlay
  loop
  muted
  playsInline
  controls={false}
  onContextMenu={(e) => e.preventDefault()}
  className="w-full h-full object-cover"
/>

                  {/* Video Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <PlayCircle className="w-8 h-8 text-white" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
