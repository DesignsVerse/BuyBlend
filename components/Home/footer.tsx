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
    <footer className="bg-gray-950 text-white">
      {/* Premium Features Banner */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                <Truck className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-medium mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-400">On orders over $500</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                <Shield className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-medium mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-400">256-bit encryption</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                <Sparkles className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-medium mb-1">Authenticity</h3>
              <p className="text-sm text-gray-400">Certified luxury pieces</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                <CreditCard className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-medium mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-400">30-day guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-serif font-bold tracking-wider">LUXE JEWELS</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              Discover exquisite jewelry crafted to perfection. Each piece tells a story of elegance and timeless beauty.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-amber-500 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-amber-500 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-amber-500 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-amber-500 p-2 rounded-full transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Collections</h3>
            <ul className="space-y-3">
              <li><Link href="/collections/rings" className="text-gray-400 hover:text-amber-400 transition-colors">Rings</Link></li>
              <li><Link href="/collections/necklaces" className="text-gray-400 hover:text-amber-400 transition-colors">Necklaces</Link></li>
              <li><Link href="/collections/earrings" className="text-gray-400 hover:text-amber-400 transition-colors">Earrings</Link></li>
              <li><Link href="/collections/bracelets" className="text-gray-400 hover:text-amber-400 transition-colors">Bracelets</Link></li>
              <li><Link href="/collections/new-arrivals" className="text-gray-400 hover:text-amber-400 transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-amber-400 transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-amber-400 transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-gray-400 hover:text-amber-400 transition-colors">Press</Link></li>
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
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={subscribed}
                >
                  {subscribed ? "✓" : "Join"}
                </Button>
              </div>
            </form>

            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-3" />
                <span>contact@luxejewels.com</span>
              </div>
              <div className="flex items-start text-gray-400">
                <MapPin className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                <span>123 Luxury Avenue, Jewelry District, NY 10001</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Luxe Jewels. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/refunds" className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}