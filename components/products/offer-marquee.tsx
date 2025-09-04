"use client"
import { Tag, Gift, Truck, RotateCcw, Shield, CreditCard, Headphones, Award } from "lucide-react"

const offers = [
  { text: "COD AVAILABLE", icon: <CreditCard className="w-4 h-4 inline-block mr-2" /> },
  { text: "EASY RETURN", icon: <RotateCcw className="w-4 h-4 inline-block mr-2" /> },
  { text: "FREE SHIPPING", icon: <Truck className="w-4 h-4 inline-block mr-2" /> },
  { text: "5% OFF ON FIRST ORDER", icon: <Tag className="w-4 h-4 inline-block mr-2" /> },
  { text: "10% OFF ABOVE ₹999", icon: <Gift className="w-4 h-4 inline-block mr-2" /> },
  { text: "SECURE PAYMENT", icon: <Shield className="w-4 h-4 inline-block mr-2" /> },
  { text: "24/7 SUPPORT", icon: <Headphones className="w-4 h-4 inline-block mr-2" /> },
  { text: "PREMIUM QUALITY", icon: <Award className="w-4 h-4 inline-block mr-2" /> },
]

export function TopMarquee() {
  return (
    <div className="w-full bg-black overflow-hidden py-3">
      <div className="flex animate-marquee gap-10 min-w-max">
        {[...offers, ...offers].map((offer, idx) => (
          <div key={idx} className="flex items-center text-sm font-semibold text-white">
            {offer.icon}
            <span>{offer.text}</span>
          </div>
        ))}
      </div>

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
          gap: 2.5rem;
          min-width: max-content;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
