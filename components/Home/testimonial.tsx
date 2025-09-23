'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    text: 'This jewelry collection is stunning! The designs are elegant and the quality is top-notch. Highly recommend for anyone looking for timeless pieces.'
  },
  {
    id: 2,
    name: 'Rahul Verma',
    text: 'Amazing service and beautiful products. The necklace I bought was perfect for my wife birthday. Fast delivery and great value for money!'
  },
  {
    id: 3,
    name: 'Anjali Patel',
    text: 'The craftsmanship is exceptional. I\'ve purchased multiple pieces and each one has exceeded my expectations. Their attention to detail is remarkable.'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    text: 'As someone who appreciates fine jewelry, I can confidently say this is among the best I\'ve encountered. The pieces have a distinctive character.'
  },
  {
    id: 5,
    name: 'Meera Desai',
    text: 'These pieces are not just accessories but works of art. They elevate any outfit and always receive compliments whenever I wear them.'
  },
  {
    id: 6,
    name: 'Arjun Kumar',
    text: 'Outstanding quality and beautiful designs. The customer service is exceptional and the delivery was super fast. Will definitely order again!'
  },
  {
    id: 7,
    name: 'Kavya Reddy',
    text: 'Love the attention to detail in every piece. The jewelry feels premium and looks absolutely gorgeous. Worth every penny!'
  },
  {
    id: 8,
    name: 'Suresh Gupta',
    text: 'Perfect gift for special occasions. The packaging was beautiful and the jewelry exceeded my expectations. Highly recommended!'
  }
];

export default function TestimonialReviews() {
  // Create a duplicated array for seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-10 md:py-14 bg-white relative overflow-hidden">
      {/* Background disabled to keep clean white BG */}
      <div className="hidden"></div>

      <div className="w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8 max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            What Our Customers Say
          </motion.h2>
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
                    <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white font-semibold">
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
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold">
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