"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Shield, Truck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    setSubscribed(true)
    setEmail("")
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="bg-black text-white">
     

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-serif font-bold tracking-wider">BuyBlend.in</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
            Blend brings you jewelry crafted with love, respect, and perfection — a graceful touch of timeless elegance for every occasion.            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-white/5 hover:bg-white p-2 rounded-full transition-colors group">
                <Facebook className="h-5 w-5 text-white group-hover:text-black" />
              </a>
              <a href="https://www.instagram.com/buyblend.in/" className="bg-white/5 hover:bg-white p-2 rounded-full transition-colors group">
                <Instagram className="h-5 w-5 text-white group-hover:text-black" />
              </a>
              <a href="#" className="bg-white/5 hover:bg-white p-2 rounded-full transition-colors group">
                <Twitter className="h-5 w-5 text-white group-hover:text-black" />
              </a>
              <a href="#" className="bg-white/5 hover:bg-white p-2 rounded-full transition-colors group">
                <Youtube className="h-5 w-5 text-white group-hover:text-black" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Collections</h3>
            <ul className="space-y-3">
              <li><Link href="/collection/earrings" className="text-gray-400 hover:text-white transition-colors">Earrings</Link></li>
              <li><Link href="/collection/earrings/korean" className="text-gray-400 hover:text-white transition-colors">Korean Earrings</Link></li>
              <li><Link href="/collection/earrings/western" className="text-gray-400 hover:text-white transition-colors">Western Earrings</Link></li>
              <li><Link href="/collection/earrings/stud" className="text-gray-400 hover:text-white transition-colors">Stud Earrings</Link></li>
              <li><Link href="/collection/pendants" className="text-gray-400 hover:text-white transition-colors">Pendants</Link></li>
              <li><Link href="/collection/ring" className="text-gray-400 hover:text-white transition-colors">Rings</Link></li>
              <li><Link href="/collection/combos" className="text-gray-400 hover:text-white transition-colors">Combos</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/wishlist" className="text-gray-400 hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link href="/profile" className="text-gray-400 hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to get special offers and luxury insights</p>
            
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-white text-black hover:bg-white/90"
                  disabled={subscribed}
                >
                  {subscribed ? "✓" : "Join"}
                </Button>
              </div>
            </form>

            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-3" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-3" />
                <span>contact@buyblend.in</span>
              </div>
              <div className="flex items-start text-gray-400">
                <MapPin className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} BuyBlend.in. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/refunds" className="text-gray-500 hover:text-white text-sm transition-colors">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}