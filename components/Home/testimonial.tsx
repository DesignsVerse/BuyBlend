// components/TestimonialReviews.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string; // URL for user avatar
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Jewelry Enthusiast',
    text: 'This jewelry collection is stunning! The designs are elegant and the quality is top-notch. Highly recommend for anyone looking for timeless pieces.',
    image: '/images/1.jpg', // Replace with real image URL
    rating: 5
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Satisfied Customer',
    text: 'Amazing service and beautiful products. The necklace I bought was perfect for my wife birthday. Fast delivery and great value for money!',
    image: '/images/1.jpg', // Replace with real image URL
    rating: 5
  },
  {
    id: 3,
    name: 'Anjali Patel',
    role: 'Loyal Customer',
    text: 'The craftsmanship is exceptional. I\'ve purchased multiple pieces and each one has exceeded my expectations. Their attention to detail is remarkable.',
    image: '/images/1.jpg', // Replace with real image URL
    rating: 4
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Collector',
    text: 'As someone who appreciates fine jewelry, I can confidently say this is among the best I\'ve encountered. The pieces have a distinctive character.',
    image: '/images/1.jpg', // Replace with real image URL
    rating: 5
  },
  {
    id: 5,
    name: 'Meera Desai',
    role: 'Fashion Blogger',
    text: 'These pieces are not just accessories but works of art. They elevate any outfit and always receive compliments whenever I wear them.',
    image: '/images/1.jpg', // Replace with real image URL
    rating: 4
  }
];

const TestimonialReviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-black' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-[#fff3f3] text-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-serif font-bold mb-4 text-black"
          >
            What Our Customers Say
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-black mx-auto mb-4"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
          >
            Discover why our customers love our premium jewelry collections and exceptional service
          </motion.p>
        </div>
        
        <div 
          className="relative h-96 max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="relative mb-6">
                <div className="relative inline-block">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-md"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                    ★ {testimonials[currentIndex].rating}.0
                  </div>
                </div>
              </div>
              
              <StarRating rating={testimonials[currentIndex].rating} />
              
              <div className="text-gray-400 mb-4">
                <svg className="w-8 h-8 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 italic leading-relaxed max-w-2xl">
                "{testimonials[currentIndex].text}"
              </p>
              
              <div>
                <h3 className="font-semibold text-gray-900 text-xl">{testimonials[currentIndex].name}</h3>
                <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation arrows */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Additional decorative elements */}
        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Read More Testimonials
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialReviews;