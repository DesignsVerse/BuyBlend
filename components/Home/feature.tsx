"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/Home/product-card";
import type { Product } from "@/lib/sanity/types";
import { client, queries } from "@/lib/sanity/client";
import { mockProducts } from "@/lib/sanity/mock-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left side - Featured image (hidden on mobile) */}
          <div className="hidden lg:block lg:w-2/5 relative rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-[3/4] w-full relative">
              <Image
                src="/images/hero/home-gemstone.png"
                alt="Find what's meant to be yours"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div className="text-center w-full">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Find Gemstone what&apos;s meant to be yours
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Products */}
          <div className="w-full md:mt-16 lg:w-3/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">Featured Products</h3>
              <Link href="/products" className="text-black hover:underline font-medium">
                VIEW ALL
              </Link>
            </div>

            <div className="relative">
              {/* Prev button - now visible on mobile too (smaller size) */}
              <button
                aria-label="Scroll left"
                className="flex items-center justify-center absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-2 sm:p-2.5 rounded-full opacity-90 hover:opacity-100 active:scale-95"
                onClick={goPrev}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Scroller with snap */}
              <div
                ref={scrollerRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 hide-scrollbar"
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="snap-center snap-always shrink-0 w-full basis-full sm:w-1/2 sm:basis-1/2 lg:w-1/3 lg:basis-1/3"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Next button - visible on mobile too */}
              <button
                aria-label="Scroll right"
                className="flex items-center justify-center absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-2 sm:p-2.5 rounded-full opacity-90 hover:opacity-100 active:scale-95"
                onClick={goNext}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Dots pagination (mobile + desktop) */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {products.map((_, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => scrollToIndex(i)}
                    className={[
                      "h-2.5 rounded-full transition-all duration-200",
                      isActive ? "w-5 bg-black" : "w-2.5 bg-gray-300 hover:bg-gray-400",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          </div>
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
