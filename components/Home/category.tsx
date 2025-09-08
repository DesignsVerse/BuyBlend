"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

type Category = {
  slug: string;
  title: string;
  image: string;
  description: string;
  featured?: boolean;
};

const categories: Category[] = [
  { 
    slug: "necklaces", 
    title: "Necklaces", 
    image: "/new/8.jpg", 
    description: "Elegant neckpieces for every occasion",
    featured: true
  },
  { 
    slug: "earrings", 
    title: "Earrings", 
    image: "/new/2.jpg", 
    description: "Sparkling ear adornments"
  },
  { 
    slug: "rings", 
    title: "Rings", 
    image: "/new/6.jpg", 
    description: "Symbols of love and commitment",
    featured: true
  },
  { 
    slug: "bangles", 
    title: "Bangles", 
    image: "/new/3.jpg", 
    description: "Traditional and contemporary designs"
  },
  { 
    slug: "bracelets", 
    title: "Bracelets", 
    image: "/new/5.jpg", 
    description: "Delicate wrist accessories"
  },
  { 
    slug: "brooches", 
    title: "Brooches", 
    image: "/new/4.jpg", 
    description: "Statement pieces for any outfit"
  },
];

export default function CategoriesSection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const imageHoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 }
  };
  
  const contentHoverVariants = {
    rest: { y: 0 },
    hover: { y: -5 }
  };

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div> */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-6"
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">Collections</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 font-serif">
            Discover Our <span className="font-medium">Exquisite</span> Collections
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Explore our carefully curated jewelry categories, each piece meticulously crafted to perfection
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* ✅ Mobile Layout: sab ek sath 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-6xl md:hidden">
            {categories.map((category) => (
              <motion.div
                key={category.slug}
                className="group relative"
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="block overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-amber-600 transition-colors">
                      {category.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ✅ Desktop Layout */}
          <div className="hidden md:flex flex-col items-center w-full">
            {/* Regular (upar) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 w-full max-w-6xl mb-4 mx-auto">
              {categories.filter(cat => !cat.featured).map((category) => (
                <motion.div
                  key={category.slug}
                  className="group relative"
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="block  overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <motion.div
                        variants={imageHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        className="h-full w-full"
                      >
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 group-hover:text-amber-600 transition-colors">
                        {category.title}
                      </h3>
                      <div className="flex items-center justify-center text-xs text-amber-600 font-medium">
                        <span>Explore</span>
                        <ChevronRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Featured (neeche) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-6xl mx-auto">
              {categories.filter(cat => cat.featured).map((category) => (
                <motion.div
                  key={category.slug}
                  className="group relative"
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="block  overflow-hidden bg-gradient-to-br from-amber-50 to-rose-50 shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Image */}
                      <div className="relative aspect-square md:aspect-auto md:w-1/2 overflow-hidden">
                        <motion.div
                          variants={imageHoverVariants}
                          initial="rest"
                          whileHover="hover"
                          className="h-full w-full"
                        >
                          <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                        <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
                          Featured
                        </div>
                      </div>
                      {/* Content */}
                      <motion.div 
                        variants={contentHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        className="p-6 md:p-8 flex flex-col justify-center md:w-1/2"
                      >
                        <h3 className="font-semibold text-gray-900 text-xl md:text-2xl mb-2 group-hover:text-amber-600 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm md:text-base">
                          {category.description}
                        </p>
                        <div className="flex items-center text-amber-600 font-medium mt-2">
                          <span className="text-sm md:text-base">Explore Collection</span>
                          <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* View All Button */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href="/collections"
            className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium text-sm md:text-base group"
          >
            <span>View All Categories</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
}
