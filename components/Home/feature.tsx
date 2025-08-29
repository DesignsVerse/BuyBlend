"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/Home/product-card";
import type { Product } from "@/lib/sanity/types";
import { client, queries } from "@/lib/sanity/client";
import { mockProducts } from "@/lib/sanity/mock-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const featured = await client.fetch<Product[]>(queries.featuredProducts);
        if (isMounted) setProducts((featured && featured.length > 0) ? featured : mockProducts.slice(0, 6));
      } catch {
        if (isMounted) setProducts(mockProducts.slice(0, 6));
      }
    })();
    return () => { isMounted = false };
  }, []);

  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollByCards = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const step = el.clientWidth / 3
    el.scrollBy({ left: direction * step, behavior: "smooth" })
  }

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

          {/* Right side - Products grid using ProductCard */}
          <div className="w-full md:mt-16 lg:w-3/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">Featured Products</h3>
              <Link href="/products" className="text-black hover:underline font-medium">
                VIEW ALL
              </Link>
            </div>

            <div className="relative">
              <button
                aria-label="Scroll left"
                className="hidden sm:flex items-center justify-center absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-2 rounded-full opacity-80 hover:opacity-100"
                onClick={() => scrollByCards(-1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                ref={scrollerRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 hide-scrollbar"
              >
                {products.map((product) => (
                  <div key={product._id} className="snap-start shrink-0 basis-1/3 w-1/3">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <button
                aria-label="Scroll right"
                className="hidden sm:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-2 rounded-full opacity-80 hover:opacity-100"
                onClick={() => scrollByCards(1)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default ProductShowcase;