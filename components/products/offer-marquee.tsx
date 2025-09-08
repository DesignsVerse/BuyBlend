"use client"
import { Tag, Gift, Truck, RotateCcw, Shield, CreditCard, Headphones, Award } from "lucide-react"

const offers = [
  { text: "COD AVAILABLE", icon: <CreditCard className="w-4 h-4 inline-block mr-2 text-amber-400" /> },
  { text: "EASY RETURN", icon: <RotateCcw className="w-4 h-4 inline-block mr-2 text-amber-400" /> },
  { text: "FREE SHIPPING", icon: <Truck className="w-4 h-4 inline-block mr-2 text-amber-400" /> },
  { text: "5% OFF ON FIRST ORDER", icon: <Tag className="w-4 h-4 inline-block mr-2 text-amber-400" /> },
  { text: "10% OFF ABOVE ₹999", icon: <Gift className="w-4 h-4 inline-block mr-2 text-amber-400" /> },
  { text: "SECURE PAYMENT", icon: <Shield className="w-4 h-4 inline-block mr-2 text-amber-400" /> },
  { text: "24/7 SUPPORT", icon: <Headphones className="w-4 h-4 inline-block mr-2 text-amber-400" /> },
  { text: "PREMIUM QUALITY", icon: <Award className="w-4 h-4 inline-block mr-2 text-amber-400" /> },
]

export function TopMarquee() {
  return (
    <div className="w-full bg-black overflow-hidden py-2 relative">
      <div className="flex animate-marquee gap-12 min-w-max">
        {[...offers, ...offers].map((offer, idx) => (
          <div key={idx} className="flex items-center text-xs font-medium text-white tracking-wide opacity-90 hover:opacity-100 transition-opacity">
            {offer.icon}
            <span>{offer.text}</span>
          </div>
        ))}
      </div>

      {/* Subtle gradient overlays for premium fade effect */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none" />

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          gap: 3rem;
          min-width: max-content;
          animation: marquee 25s linear infinite;
          will-change: transform; /* Smooth performance */
        }
        .animate-marquee:hover {
          animation-play-state: paused; /* Pause on hover for premium UX */
        }
      `}</style>
    </div>
  )
}
