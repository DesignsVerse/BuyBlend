"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { id: 1, name: "John Doe", role: "CEO, Tech Corp", content: "This product revolutionized our workflow! The quality and support are exceptional.", rating: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "Jane Smith", role: "Designer", content: "The design and functionality are top-notch. Highly recommend to everyone!", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "Mike Johnson", role: "Developer", content: "One of the best tools I've used. It's efficient, intuitive, and reliable.", rating: 4, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 4, name: "Sarah Wilson", role: "Marketing Manager", content: "Outstanding service and incredible results. A game-changer for our team!", rating: 5, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { id: 5, name: "David Lee", role: "Entrepreneur", content: "Completely transformed our daily operations. Absolutely brilliant!", rating: 5, avatar: "https://images.unsplash.com/photo-1522529590303-1b8a3cb40f89?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex mb-3" aria-label={`Rating: ${rating} out of 5`}>
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
  enableTilt = true,
}: {
  t: (typeof testimonials)[number];
  enableTilt?: boolean;
}) {
  return (
    <motion.div
      whileHover={enableTilt ? { y: -3 } : undefined}
      className="min-w-[320px] max-w-[380px] bg-[#fff3f3] border border-gray-200 rounded-xl p-6 sm:p-7 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center mb-5">
        <Image
          src={t.avatar}
          alt={t.name}
          width={56}
          height={56}
          className="rounded-full grayscale object-cover"
        />
        <div className="ml-3">
          <h4 className="font-semibold text-black text-base sm:text-lg">{t.name}</h4>
          <p className="text-xs sm:text-sm text-gray-600">{t.role}</p>
        </div>
      </div>
      <Stars rating={t.rating} />
      <p className="text-gray-800 text-sm sm:text-base leading-relaxed">{t.content}</p>
    </motion.div>
  );
}

const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0);
  const visible = 3; // slides visible on desktop
  const total = testimonials.length;

  const canPrev = index > 0;
  const canNext = index < total - visible;

  const shown = useMemo(() => {
    // Clamp for small screens (1–2 visible)
    return testimonials;
  }, []);

  return (
    <section className="py-14 sm:py-16 bg-[#fff3f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-black mb-8 sm:mb-12">
          What Our Customers Say
        </h2>

        {/* Slider wrapper */}
        <div className="relative">
          {/* Arrows */}
          <div className="absolute -top-14 right-0 flex items-center gap-2">
            <button
              aria-label="Previous testimonials"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next testimonials"
              onClick={() => setIndex((i) => Math.min(total - visible, i + 1))}
              disabled={!canNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Track */}
          <div className="overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
              className="flex gap-4 sm:gap-6"
              style={{
                transform: `translateX(calc(${index * -100}% / var(--per, 1)))`,
                transition: "transform 400ms ease",
                // --per: slides per view, updated via CSS below
              } as React.CSSProperties}
            >
              {shown.map((t) => (
                <div key={t.id} className="basis-[100%] sm:basis-[50%] lg:basis-[33.333%] shrink-0">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: Math.max(1, total - visible + 1) }).map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    active ? "w-6 bg-black" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          :root { --per: 1; }
        }
        @media (min-width: 641px) and (max-width: 1023px) {
          :root { --per: 2; }
        }
        @media (min-width: 1024px) {
          :root { --per: 3; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
