"use client"
import { Gem, Leaf, Truck, HeadphonesIcon, Box } from "lucide-react"

export function TrustBadgesSection() {
  const badges = [
    { icon: Gem, title: "Premium Quality", description: "Durable & Long-lasting jewellery." },
    { icon: Leaf, title: "Customisable Pieces", description: "Personalized to your style." },
    { icon: Truck, title: "Easy returns", description: "Hassle free refunds and Exchanges." },
    { icon: HeadphonesIcon, title: "Affordable Luxury", description: "Elegant jewellery within your Budget" },
    { icon: Box, title: "Free Delivery", description: " Free shipping over 399" }
  ]

  return (
    <section className="py-8 bg-white border-t border-b border-gray-200">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`text-center ${
            index === badges.length - 1 ? "col-span-2 mx-auto lg:col-auto lg:mx-0" : ""
          }`}
        >
          <badge.icon className="h-6 w-6 text-gray-700 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {badge.title}
          </h3>
          <p className="text-xs text-gray-600">{badge.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

  )
}
