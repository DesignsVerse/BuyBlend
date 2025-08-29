"use client"
import { Gem, Leaf, Truck, HeadphonesIcon } from "lucide-react"

export function TrustBadgesSection() {
  const badges = [
    { icon: Gem, title: "Guarantee of Purity", description: "100% Natural & Certified" },
    { icon: Leaf, title: "Ethically Sourced", description: "Responsibly harvested" },
    { icon: Truck, title: "Free Shipping", description: "On all orders over ₹21k" },
    { icon: HeadphonesIcon, title: "24/7 Support", description: "Dedicated customer care" }
  ]

  return (
    <section className="py-8 bg-white border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <badge.icon className="h-6 w-6 text-gray-700 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {badge.title}
              </h3>
              <p className="text-xs text-gray-600">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
