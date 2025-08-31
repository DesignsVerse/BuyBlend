"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

type Category = {
  slug: string;
  title: string;
  image: string;
  description: string;
};

const categories: Category[] = [
  { 
    slug: "necklaces", 
    title: "Necklaces", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop", 
    description: "Elegant neckpieces for every occasion"
  },
  { 
    slug: "earrings", 
    title: "Earrings", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop", 
    description: "Sparkling ear adornments"
  },
  { 
    slug: "rings", 
    title: "Rings", 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop", 
    description: "Symbols of love and commitment"
  },
  { 
    slug: "bangles", 
    title: "Bangles", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop", 
    description: "Traditional and contemporary designs"
  },
  { 
    slug: "bracelets", 
    title: "Bracelets", 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop", 
    description: "Delicate wrist accessories"
  },
  { 
    slug: "brooches", 
    title: "Brooches", 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop", 
    description: "Statement pieces for any outfit"
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">Collections</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4 font-serif">Discover Our Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Explore our exquisite range of jewelry categories, each crafted with precision and love
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="flex flex-col items-center">
          {/* Top row with 4 cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mb-4 md:mb-6">
            {categories.slice(0, 4).map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-4 text-center">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 group-hover:text-amber-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-1">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-center text-xs text-amber-600 font-medium">
                      <span>Explore</span>
                      <ChevronRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom row with 2 centered cards */}
          <div className="grid grid-cols-2 md:flex md:justify-center gap-4 md:gap-6 w-full max-w-5xl">
            {categories.slice(4, 6).map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 4) * 0.1 }}
                viewport={{ once: true }}
                className="group md:w-1/4"
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="block rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-4 text-center">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 group-hover:text-amber-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-1">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-center text-xs text-amber-600 font-medium">
                      <span>Explore</span>
                      <ChevronRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-12"
        >
          <Link
            href="/collections"
            className="inline-flex items-center bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-sm hover:bg-gray-800 transition-colors font-medium text-sm md:text-base"
          >
            View All Categories
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}