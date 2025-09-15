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
];

const TestimonialReviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white text-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Customers Say</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover why our customers love our premium jewelry collections and exceptional service
          </p>
        </div>
        
        <div className="relative h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center text-center bg-white p-8 rounded-lg shadow-xl border border-gray-100"
            >
              <div className="relative mb-6">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-amber-100 shadow-md"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ★ {testimonials[currentIndex].rating}.0
                </div>
              </div>
              
              <StarRating rating={testimonials[currentIndex].rating} />
              
              <svg className="w-8 h-8 text-amber-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              
              <p className="text-lg text-gray-700 mb-6 italic leading-relaxed max-w-2xl">
                "{testimonials[currentIndex].text}"
              </p>
              
              <div>
                <h3 className="font-semibold text-gray-900 text-xl">{testimonials[currentIndex].name}</h3>
                <p className="text-sm text-amber-600">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-amber-500 scale-125' : 'bg-gray-300 hover:bg-amber-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
       
      </div>
    </section>
  );
};

export default TestimonialReviews;