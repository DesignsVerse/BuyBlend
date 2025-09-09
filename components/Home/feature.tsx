"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/Home/product-card";
import type { Product } from "@/lib/sanity/types";
import { client, queries } from "@/lib/sanity/client";
import { mockProducts } from "@/lib/sanity/mock-data";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => setIsMobile(window.innerWidth < 1024);
      
      // Initial check
      checkIsMobile();
      
      // Add event listener for resize
      window.addEventListener('resize', checkIsMobile);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkIsMobile);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const featured = await client.fetch<Product[]>(queries.featuredProducts);
        if (isMounted) {
          setProducts(
            featured && featured.length > 0 ? featured : mockProducts.slice(0, 6)
          );
        }
      } catch {
        if (isMounted) setProducts(mockProducts.slice(0, 6));
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to a specific card index, accounting for gap
  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const target = children[index];
    if (!target) return;
    el.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  // Prev/next controls
  const goPrev = () => {
    const next = Math.max(0, activeIndex - 1);
    scrollToIndex(next);
  };
  const goNext = () => {
    const last = Math.max(0, products.length - 1);
    const next = Math.min(last, activeIndex + 1);
    scrollToIndex(next);
  };

  // Track which card is centered/most visible
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with highest intersection ratio
        let best: { i: number; r: number } = { i: 0, r: 0 };
        for (const entry of entries) {
          const i = items.indexOf(entry.target as HTMLElement);
          if (entry.intersectionRatio > best.r) best = { i, r: entry.intersectionRatio };
        }
        setActiveIndex((prev) => (best.r > 0 ? best.i : prev));
      },
      {
        root: el,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10), // 0..1
      }
    );

    items.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [products.length]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isHovered && products.length > 0) {
      const interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % products.length;
        scrollToIndex(nextIndex);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [activeIndex, isHovered, products.length, scrollToIndex]);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading and View All - Always at top, with conditional styling */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">Featured Collection</h3>
            <p className="text-gray-600 text-sm">Handpicked selections of our finest gemstones</p>
          </div>
          
          <Link 
            href="/products" 
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center group text-sm"
          >
            VIEW ALL
            <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Video Section - order-1 on mobile (after heading), order-1 on lg (left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-2/5 relative rounded-2xl overflow-hidden shadow-2xl order-1"
          >
            <div className="aspect-[3/4] w-full relative">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full"
              >
                <source src="/video/1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                <div className="text-center w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center justify-center mb-3 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 border border-amber-400/30"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300 mr-2" />
                    <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">
                      Exclusive Collection
                    </span>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight"
                  >
                    Discover Your Perfect Gemstone
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-amber-100/90 text-sm max-w-md mx-auto mb-6"
                  >
                    Each piece is meticulously crafted to bring out the natural beauty and energy of these precious stones.
                  </motion.p>
                  
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="inline-flex items-center bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Section - order-2 on mobile (after video), order-2 on lg (right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-3/5 flex flex-col justify-center order-2"
          >
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Navigation buttons */}
              <AnimatePresence>
                {isHovered && (
                  <>
                    <motion.button
                      aria-label="Scroll left"
                      className="hidden lg:flex items-center justify-center absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl border border-gray-100 backdrop-blur-sm"
                      onClick={goPrev}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      aria-label="Scroll right"
                      className="hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl border border-gray-100 backdrop-blur-sm"
                      onClick={goNext}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>

              {/* Scroller with snap */}
              <div
                ref={scrollerRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 hide-scrollbar pb-4 px-1"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="snap-center snap-always shrink-0 w-full basis-[85%] sm:basis-[45%] lg:basis-[30%]"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* hide native scrollbar */}
      <style jsx global>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default ProductShowcase;
