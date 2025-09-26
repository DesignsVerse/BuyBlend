'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

export default function TestimonialReviews() {
  // Shuffle testimonials randomly
  const shuffleArray = (array: typeof testimonials) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffledTestimonials = shuffleArray(testimonials);
  
  // Create a duplicated array for seamless scrolling
  const duplicatedTestimonials = [...shuffledTestimonials, ...shuffledTestimonials];

  return (
    <section className="py-6 md:py-12 bg-white relative overflow-hidden">
      {/* Background disabled to keep clean white BG */}
      <div className="hidden"></div>

      <div className="w-full relative z-10">
        {/* Section Header */}
        <div className="font-serif text-center mb-6 md:mb-8 max-w-7xl mx-auto px-4">
  {/* Top label */}
  <motion.div
    className="inline-flex items-center justify-center mb-2"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <span className="text-sm md:text-base font-medium text-amber-600 uppercase tracking-wider">
      Customer Reviews
    </span>
  </motion.div>

  {/* Main heading */}
  <motion.h2
    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.1 }}
    viewport={{ once: true }}
  >
    What Our Customers Say
  </motion.h2>

  {/* Short description */}
  <motion.p
    className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
  >
    Hear from our happy customers who love our exquisite jewelry collections. Real reviews, real satisfaction!
  </motion.p>
</div>


        {/* Top Marquee: Scrolls Left */}
        <div className="relative flex overflow-hidden">
          <motion.div 
            className="flex flex-none py-2 md:py-3 gap-3 md:gap-4 pr-3 md:pr-4"
            animate={{
              x: [0, -900]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 18,
                ease: "linear"
              }
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`top-${index}`}
                className="w-[240px] md:w-[280px] h-[160px] md:h-[180px] flex-shrink-0 bg-white border border-gray-200 p-4 md:p-5 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <p className="text-gray-700 text-sm md:text-base font-medium mb-3 md:mb-4 leading-relaxed relative z-10 line-clamp-3 overflow-hidden">
                  {testimonial.text}
                </p>
                <div className="flex items-center space-x-3 md:space-x-4 relative z-10 mt-auto">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 shadow-sm ring-2 ring-white">
                    <AvatarFallback className="bg-black text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800 font-semibold text-sm md:text-base truncate">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400 text-xs md:text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Bottom Marquee: Scrolls Right */}
        <div className="relative flex overflow-hidden">
          <motion.div 
            className="flex flex-none py-2 md:py-3 gap-3 md:gap-4 pr-3 md:pr-4"
            animate={{
              x: [-900, 0]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 18,
                ease: "linear"
              }
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`bottom-${index}`}
                className="w-[240px] md:w-[280px] h-[160px] md:h-[180px] flex-shrink-0 bg-white border border-gray-200 p-4 md:p-5 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <p className="text-gray-700 text-sm md:text-base font-medium mb-3 md:mb-4 leading-relaxed relative z-10 line-clamp-3 overflow-hidden">
                  {testimonial.text}
                </p>
                <div className="flex items-center space-x-3 md:space-x-4 relative z-10 mt-auto">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 shadow-sm ring-2 ring-white">
                    <AvatarFallback className="bg-black text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800 font-semibold text-sm md:text-base truncate">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400 text-xs md:text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}