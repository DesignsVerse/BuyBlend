"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  discountPrice?: number;
  image: string;
  video: string;
  thumbnail: string;
  description: string;
};

// Sample product data
const products: Product[] = [
  {
    id: "1",
    slug: "oxidized-studs-earrings",
    title: "Set Of 12 Oxidized Designers Studs Earrings With Folding Jewelry Box",
    price: 2499,
    discountPrice: 1999,
    image: "/images/oxidized-earrings.jpg",
    video: "/videos/oxidized-earrings.mp4",
    thumbnail: "/thumbnails/oxidized-earrings.jpg",
    description: "Beautiful set of 12 designer oxidized stud earrings with premium folding jewelry box."
  },
  {
    id: "2",
    slug: "pink-lotus-set",
    title: "Elegant Pink Lotus Necklace & Earrings Set",
    price: 3499,
    discountPrice: 2799,
    image: "/images/pink-lotus.jpg",
    video: "/videos/pink-lotus.mp4",
    thumbnail: "/thumbnails/pink-lotus.jpg",
    description: "Exquisite pink lotus themed necklace and earrings set for special occasions."
  },
  {
    id: "3",
    slug: "gemstone-drop-earrings",
    title: "Layers of Gemstone Drop Earrings",
    price: 1899,
    image: "/images/gemstone-earrings.jpg",
    video: "/videos/gemstone-earrings.mp4",
    thumbnail: "/thumbnails/gemstone-earrings.jpg",
    description: "Elegant gemstone drop earrings with multiple layers for a sophisticated look."
  },
  {
    id: "4",
    slug: "floral-choker-set",
    title: "Antique Floral Choker Set with Stud Earrings",
    price: 2999,
    discountPrice: 2399,
    image: "/images/floral-choker.jpg",
    video: "/videos/floral-choker.mp4",
    thumbnail: "/thumbnails/floral-choker.jpg",
    description: "Vintage-inspired floral choker set with matching stud earrings."
  }
];

export default function VideoShowcaseReels() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer to detect which video is in view
  useEffect(() => {
    if (containerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.getAttribute('data-index') || '0');
              setActiveIndex(index);
            }
          });
        },
        {
          root: containerRef.current,
          threshold: 0.8
        }
      );

      // Observe all video containers
      const videoContainers = containerRef.current.querySelectorAll('.video-container');
      videoContainers.forEach(container => {
        observerRef.current?.observe(container);
      });
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Handle video play state
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex && isPlaying) {
          video.play().catch(() => {
            // Autoplay might be blocked by browser
            setIsPlaying(false);
          });
        } else {
          video.pause();
        }
      }
    });
  }, [activeIndex, isPlaying]);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe up
      setActiveIndex(prev => Math.min(products.length - 1, prev + 1));
    } else if (touchEnd - touchStart > 50) {
      // Swipe down
      setActiveIndex(prev => Math.max(0, prev - 1));
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
    if (containerRef.current) {
      const element = containerRef.current.children[index] as HTMLElement;
      if (element) {
        containerRef.current.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section className="w-full bg-black text-white">
      {/* Desktop View - Side by Side Videos */}
      <div className="hidden md:block py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Watch and Shop</h2>
            <p className="text-amber-400">FUBS Video Collection</p>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="flex-shrink-0 w-80 bg-gray-900 rounded-xl overflow-hidden transition-transform hover:scale-105"
                onClick={() => goToIndex(index)}
              >
                <div className="relative h-96">
                  <video
                    ref={el => videoRefs.current[index] = el}
                    src={product.video}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    loop
                    playsInline
                    preload="auto"
                  />
                  
                  {/* Mute/Unmute button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 text-white"
                  >
                    {isMuted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.047 3.062a.75.75 0 01.453.688v12.5a.75.75 0 01-1.264.546L5.203 13H2.667a.75.75 0 01-.7-.48A6.985 6.985 0 011.5 10c0-.887.165-1.737.468-2.52a.75.75 0 01.7-.48h2.535l4.033-3.796a.75.75 0 01.811-.142zM13.78 7.22a.75.75 0 10-1.06 1.06L14.44 10l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 001.06-1.06L16.56 10l1.72-1.72a.75.75 0 00-1.06-1.06L15.5 8.94l-1.72-1.72z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.5 3.75a.75.75 0 00-1.264-.546L5.203 7H2.667a.75.75 0 00-.7.48A6.985 6.985 0 001.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 001.264-.546V3.75zM16.45 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z" />
                        <path d="M14.329 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">₹{product.discountPrice || product.price}</span>
                      {product.discountPrice && (
                        <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
                      )}
                    </div>
                    <button className="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600 transition-colors">
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
                  index === activeIndex ? 'bg-amber-500' : 'bg-gray-600'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View - Reel Experience */}
      <div className="block md:hidden relative">
        <div 
          ref={containerRef}
          className="h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <div 
              key={product.id}
              data-index={index}
              className="video-container h-screen w-full snap-start snap-always relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <video
                ref={el => videoRefs.current[index] = el}
                src={product.video}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                preload="auto"
              />
              
              {/* Product Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">₹{product.discountPrice || product.price}</span>
                    {product.discountPrice && (
                      <span className="text-gray-300 line-through text-sm">₹{product.price}</span>
                    )}
                  </div>
                  <button className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex flex-col items-center space-y-4">
                {/* Mute/Unmute button */}
                <button
                  onClick={toggleMute}
                  className="bg-black/50 rounded-full p-2 text-white"
                >
                  {isMuted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.047 3.062a.75.75 0 01.453.688v12.5a.75.75 0 01-1.264.546L5.203 13H2.667a.75.75 0 01-.7-.48A6.985 6.985 0 011.5 10c0-.887.165-1.737.468-2.52a.75.75 0 01.7-.48h2.535l4.033-3.796a.75.75 0 01.811-.142zM13.78 7.22a.75.75 0 10-1.06 1.06L14.44 10l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 001.06-1.06L16.56 10l1.72-1.72a.75.75 0 00-1.06-1.06L15.5 8.94l-1.72-1.72z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.5 3.75a.75.75 0 00-1.264-.546L5.203 7H2.667a.75.75 0 00-.7.48A6.985 6.985 0 001.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 001.264-.546V3.75zM16.45 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z" />
                      <path d="M14.329 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" />
                    </svg>
                  )}
                </button>

                {/* Play/Pause button */}
                <button
                  onClick={togglePlay}
                  className="bg-black/50 rounded-full p-2 text-white"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Navigation Dots for Mobile */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {products.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeIndex ? 'bg-amber-500' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Swipe Instruction for Mobile */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center">
          <div className="bg-black/50 rounded-full px-4 py-2 text-sm animate-bounce">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              Swipe to explore
            </span>
          </div>
        </div>
      </div>

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
  );
}