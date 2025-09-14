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
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Jewelry Enthusiast',
    text: 'This jewelry collection is stunning! The designs are elegant and the quality is top-notch. Highly recommend for anyone looking for timeless pieces.',
    image: '/images/1.jpg', // Replace with real image URL
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Satisfied Customer',
    text: 'Amazing service and beautiful products. The necklace I bought was perfect for my wife birthday. Fast delivery and great value for money!',
    image: '/images/1.jpg', // Replace with real image URL
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

  return (
    <section className="py-12 bg-white text-black">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
              className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300"
            />
            <p className="text-lg italic mb-4">"{testimonials[currentIndex].text}"</p>
            <h3 className="font-semibold">{testimonials[currentIndex].name}</h3>
            <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialReviews;
