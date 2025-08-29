"use client";
import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "CEO, Tech Corp",
    content: "This product revolutionized our workflow! The quality and support are exceptional.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Designer",
    content: "The design and functionality are top-notch. Highly recommend to everyone!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Developer",
    content: "One of the best tools I've used. It's efficient, intuitive, and reliable.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    role: "Marketing Manager",
    content: "Outstanding service and incredible results. A game-changer for our team!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 5,
    name: "David Lee",
    role: "Entrepreneur",
    content: "Completely transformed our daily operations. Absolutely brilliant!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1522529590303-1b8a3cb40f89?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
} } ) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-w-[360px] max-w-[400px] bg-white border border-gray-200 rounded-xl p-8 shadow-lg mx-4 hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex items-center mb-6">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={64}
          height={64}
          className="rounded-full grayscale object-cover"
        />
        <div className="ml-4">
          <h4 className="font-bold text-black text-lg">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < testimonial.rating ? "text-black fill-black" : "text-gray-300"}`}
          />
        ))}
      </div>
      <p className="text-gray-700 text-base leading-relaxed">{testimonial.content}</p>
    </motion.div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-100 overflow-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-black mb-12">What Our Customers Say</h2>
        <div className="relative">
          <div className="marquee">
            <div className="track flex">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
              {testimonials.map((testimonial) => (
                <TestimonialCard key={`dup-${testimonial.id}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .marquee {
          overflow: hidden;
          position: relative;
          width: 100%;
        }
        .track {
          display: flex;
          animation: scroll 25s linear infinite;
          will-change: transform;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .track:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .min-w-[360px] {
            min-width: 300px;
          }
          .text-4xl {
            font-size: 2.5rem;
          }
        }
        @media (max-width: 640px) {
          .min-w-[360px] {
            min-width: 280px;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;