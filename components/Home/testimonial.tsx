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
    <section className="py-10 bg-[#FFF4F4] relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 md:top-40 left-5 md:left-10 w-40 h-40 md:w-80 md:h-80 bg-black/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        ></motion.div>
        <motion.div
          className="absolute bottom-20 md:bottom-40 right-5 md:right-10 w-40 h-40 md:w-80 md:h-80 bg-black/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        ></motion.div>
      </div>

      <div className="w-full  relative ">
        {/* Section Header */}
        <div className="text-center mb-2 max-w-7xl mx-auto">
          <motion.p
            className="text-black/70 text-xs md:text-sm font-medium mb-3 md:mb-4 uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.p>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 md:mb-6"
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
            className="flex flex-none py-2 md:py-4 gap-3 md:gap-4 lg:gap-6 pr-3 md:pr-6"
            animate={{
              x: [0, -1032] // 300px width + 24px gap = 324px per item * 3 items = 972px, but need to adjust
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear"
              }
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`top-${index}`}
                className="w-[280px] md:w-[300px] h-[160px] md:h-[180px] lg:h-[200px] flex-shrink-0 bg-white/80 backdrop-blur-sm border border-black/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-black/20 transition-all duration-300 group relative overflow-hidden shadow-md hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl md:rounded-2xl"></div>
                <p className="text-black text-sm md:text-base font-medium mb-3 md:mb-4 leading-relaxed relative z-10 line-clamp-3 overflow-hidden">
                  "{testimonial.text}"
                </p>
                <div className="flex items-start space-x-2 md:space-x-3 relative z-10 mt-auto">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 shadow-sm">
                    <AvatarFallback className="bg-black text-white">
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-black font-semibold text-xs md:text-sm truncate">
                      {testimonial.name}
                    </h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-black rounded flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-xs">★</span>
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
            className="flex flex-none py-2 md:py-4 gap-3 md:gap-4 lg:gap-6 pr-3 md:pr-6"
            animate={{
              x: [-1032, 0] // Reverse direction
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear"
              }
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`bottom-${index}`}
                className="w-[280px] md:w-[300px] h-[160px] md:h-[180px] lg:h-[200px] flex-shrink-0 bg-white/80 backdrop-blur-sm border border-black/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-black/20 transition-all duration-300 group relative overflow-hidden shadow-md hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl md:rounded-2xl"></div>
                <p className="text-black text-sm md:text-base font-medium mb-3 md:mb-4 leading-relaxed relative z-10 line-clamp-3 overflow-hidden">
                  "{testimonial.text}"
                </p>
                <div className="flex items-start space-x-2 md:space-x-3 relative z-10 mt-auto">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 shadow-sm">
                    <AvatarFallback className="bg-black text-white">
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-black font-semibold text-xs md:text-sm truncate">
                      {testimonial.name}
                    </h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-black rounded flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-xs">★</span>
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