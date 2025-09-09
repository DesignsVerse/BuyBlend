"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  { 
    id: 1, 
    name: "John Doe", 
    role: "CEO, Tech Corp", 
    content: "This product revolutionized our workflow! The quality and support are exceptional. It has significantly improved our team's productivity.", 
    rating: 5, 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    role: "Creative Director", 
    content: "The design and functionality are top-notch. Highly recommend to everyone in the creative industry looking for premium solutions.", 
    rating: 5, 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
  },
  { 
    id: 3, 
    name: "Mike Johnson", 
    role: "Lead Developer", 
    content: "One of the best tools I've used. It's efficient, intuitive, and reliable. The attention to detail is remarkable.", 
    rating: 4, 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
  },
  { 
    id: 4, 
    name: "Sarah Wilson", 
    role: "Marketing Director", 
    content: "Outstanding service and incredible results. A game-changer for our team! The ROI was evident within weeks.", 
    rating: 5, 
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
  },
  { 
    id: 5, 
    name: "David Lee", 
    role: "Entrepreneur", 
    content: "Completely transformed our daily operations. Absolutely brilliant! The premium experience is worth every penny.", 
    rating: 5, 
    avatar: "https://images.unsplash.com/photo-1522529590303-1b8a3cb40f89?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
  },
  { 
    id: 6, 
    name: "Emma Roberts", 
    role: "Product Manager", 
    content: "Exceeded all our expectations. The seamless integration and premium support made implementation effortless.", 
    rating: 5, 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1 
    } 
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3
    }
  }
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex mb-4" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? "text-black fill-black" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  t,
  isActive = false,
}: {
  t: (typeof testimonials)[number];
  isActive?: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative min-w-[320px] max-w-[420px] bg-white rounded-xl p-7 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 ${
        isActive ? "ring-1 ring-black/10" : ""
      }`}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.2 }
      }}
    >
      {/* Decorative quote icon */}
      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-black flex items-center justify-center">
        <Quote className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex items-start mb-6">
        <div className="relative">
          <Image
            src={t.avatar}
            alt={t.name}
            width={60}
            height={60}
            className="rounded-full object-cover border-2 border-white shadow-md grayscale"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border-2 border-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-gray-900 text-lg">{t.name}</h4>
          <p className="text-sm text-gray-600 font-medium">{t.role}</p>
        </div>
      </div>
      
      <Stars rating={t.rating} />
      
      <p className="text-gray-700 text-base leading-relaxed">
        "{t.content}"
      </p>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full bg-gray-100 -z-10"></div>
    </motion.div>
  );
}

const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const total = testimonials.length;
  
  // Responsive slides per view
  const [slidesPerView, setSlidesPerView] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setSlidesPerView(1);
        } else if (window.innerWidth < 1024) {
          setSlidesPerView(2);
        } else {
          setSlidesPerView(3);
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const maxIndex = total - slidesPerView;
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      if (index < maxIndex) {
        setIndex(prev => prev + 1);
      } else {
        setIndex(0);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [index, isAutoPlaying, maxIndex]);

  const shownTestimonials = useMemo(() => {
    return testimonials.slice(index, index + slidesPerView);
  }, [index, slidesPerView]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gray-50"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-gray-200/40 blur-3xl"></div>
      <div className="absolute bottom-10 -right-20 w-72 h-72 rounded-full bg-gray-100/50 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 mb-4">
            <Star className="w-4 h-4 mr-2 fill-black text-black" />
            Trusted by Industry Leaders
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 font-serif">
            Client Testimonials
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why professionals across industries choose our premium solutions
          </p>
        </motion.div>

        {/* Slider wrapper */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
         

          {/* Track */}
          <div className="overflow-hidden px-2">
            <motion.div
              key={`slider-${index}-${slidesPerView}`}
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="flex gap-6 lg:gap-8 justify-center"
            >
              <AnimatePresence mode="wait">
                {shownTestimonials.map((t) => (
                  <TestimonialCard key={t.id} t={t} isActive={true} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Dots indicator */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    active ? "w-8 bg-black" : "w-3 bg-gray-300 hover:bg-gray-500"
                  }`}
                />
              );
            })}
          </div>
        </div>
        
        {/* Stats section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-black mb-2">500+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wider">Happy Clients</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-black mb-2">98%</div>
            <div className="text-sm text-gray-600 uppercase tracking-wider">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-black mb-2">24/7</div>
            <div className="text-sm text-gray-600 uppercase tracking-wider">Support</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-black mb-2">5.0</div>
            <div className="text-sm text-gray-600 uppercase tracking-wider">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;