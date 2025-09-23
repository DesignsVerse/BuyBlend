"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Gift, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function GiftOption() {
  const [isGift, setIsGift] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGift, setSelectedGift] = useState(0)
  const [autoChange, setAutoChange] = useState(true)

  // Sample gift images (replace with your own URLs or paths)
  const giftImages = [
    "/gift/gift-1.png",
    "/gift/gift-2.png",
    "/gift/gift-3.png",
    "/gift/gift-4.png",
  ]

  const nextImage = () => {
    setSelectedGift((prev) => (prev + 1) % giftImages.length)
  }

  const prevImage = () => {
    setSelectedGift((prev) => (prev - 1 + giftImages.length) % giftImages.length)
  }

  // Auto change images every 3 seconds
  useEffect(() => {
    if (autoChange) {
      const interval = setInterval(() => {
        setSelectedGift((prev) => (prev + 1) % giftImages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [autoChange, giftImages.length])

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm md:mt-6 md:p-6 md:rounded-xl">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="gift-checkbox"
            checked={isGift}
            onCheckedChange={(checked) => setIsGift(checked as boolean)}
            className="data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600 h-5 w-5"
          />
          <Label htmlFor="gift-checkbox" className="font-medium text-gray-900 cursor-pointer text-sm md:text-base">
            Buy as a gift
          </Label>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2 w-full sm:w-auto">
              <Gift className="h-4 w-4" />
              <span>View Gift Images</span>
            </Button>
          </DialogTrigger>
            <DialogContent className="max-w-[95vw] rounded-xl p-0 overflow-hidden bg-black/90 backdrop-blur-sm border-0 sm:max-w-2xl">
              <DialogHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
                <DialogTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400" />
                  <span>Select Design ({selectedGift + 1}/{giftImages.length})</span>
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20">
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </DialogClose>
              </DialogHeader>
              
              {/* Main Image with Arrows */}
              <div className="relative flex items-center justify-center p-4 sm:p-8">
                {/* Left Arrow */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 z-10"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>

                {/* Main Image */}
                <div className="relative h-64 w-full max-w-2xl rounded-lg overflow-hidden sm:h-96">
                  <Image
                    src={giftImages[selectedGift]}
                    alt={`Gift Card ${selectedGift + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Right Arrow */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 z-10"
                >
                  <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
              </div>

              {/* Thumbnail Preview */}
              <div className="flex overflow-x-auto space-x-2 p-3 bg-black/50 sm:justify-center sm:p-4">
                {giftImages.map((img, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative h-14 w-16 sm:h-16 sm:w-20 rounded-md border-2 cursor-pointer transition-all duration-200 flex-shrink-0",
                      selectedGift === index
                        ? "border-rose-500 shadow-lg"
                        : "border-white/30 hover:border-white/50"
                    )}
                    onClick={() => setSelectedGift(index)}
                  >
                    <Image
                      src={img}
                      alt={`Gift Card ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                    {selectedGift === index && (
                      <div className="absolute inset-0 bg-rose-500/20 border-2 border-rose-400 rounded-md" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end p-3 border-t border-white/20 sm:p-4">
                <DialogClose asChild>
                  <Button 
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-4 text-sm sm:px-6 sm:text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
      </div>

      {/* Auto-changing Image Preview */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Gift Card Preview</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              Design {selectedGift + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoChange(!autoChange)}
              className="text-xs px-2 py-1 h-6"
            >
              {autoChange ? "Pause" : "Play"}
            </Button>
          </div>
        </div>
        <div className="relative h-60 sm:h-60 w-full rounded-md overflow-hidden border">
          <Image
            src={giftImages[selectedGift]}
            alt="Gift Card Preview"
            fill
            className="object-cover transition-opacity duration-500"
          />
        </div>
      </div>
    </div>
  )
}