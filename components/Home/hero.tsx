"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample banner data - replace with your actual images and content
  const banners = [
    {
      id: 1,
      title: "Elegant Diamond Collection",
      description: "Discover our exquisite diamond jewelry crafted to perfection",
      image: "/images/1.jpg",
      ctaText: "Shop Now",
      ctaLink: "/collections/diamonds"
    },
    {
      id: 2,
      title: "New Gold Arrivals",
      description: "Explore our latest 24K gold jewelry collection",
      image: "/images/2.webp",
      ctaText: "View Collection",
      ctaLink: "/collections/gold"
    },
    // {
    //   id: 3,
    //   title: "Pearl Elegance",
    //   description: "Timeless pearl jewelry for the modern woman",
    //   image: "/api/placeholder/1200/600",
    //   ctaText: "Discover Pearls",
    //   ctaLink: "/collections/pearls"
    // },
    // {
    //   id: 4,
    //   title: "Wedding Collection",
    //   description: "Perfect jewelry for your special day",
    //   image: "/api/placeholder/1200/600",
    //   ctaText: "Explore Wedding",
    //   ctaLink: "/collections/wedding"
    // },
    // {
    //   id: 5,
    //   title: "Limited Edition",
    //   description: "Exclusive designs available for a limited time",
    //   image: "/api/placeholder/1200/600",
    //   ctaText: "Shop Exclusive",
    //   ctaLink: "/collections/limited"
    // }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative h-screen max-h-[500px] w-full overflow-hidden">
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative w-full flex-shrink-0">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={banner.id === 1}
              />
            </div>
            
            {/* Content */}
            <div className="relative flex h-screen max-h-[500px] items-center justify-center">
              
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-all hover:bg-black/50"
        aria-label="Previous slide"
      >
        <ChevronLeft size={30} />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-all hover:bg-black/50"
        aria-label="Next slide"
      >
        <ChevronRight size={30} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform">
        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                currentSlide === index ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}