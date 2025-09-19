import Link from "next/link"
import { Home, Search, ArrowLeft, Heart } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3f3] via-white to-[#fff5f5] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main 404 Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          {/* Decorative Elements */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#ff4d8d] to-[#ff85a2] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#ff85a2] to-[#ff4d8d] rounded-full opacity-30 animate-pulse delay-1000"></div>
            
            {/* 404 Number */}
            <div className="relative z-10">
              <h1 className="text-8xl md:text-9xl font-serif font-bold bg-gradient-to-r from-[#ff4d8d] to-[#ff85a2] bg-clip-text text-transparent mb-4">
                404
              </h1>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off like a lost piece of jewelry. 
              Don't worry, we'll help you find your way back to our beautiful collection!
            </p>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#ff4d8d] to-transparent"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-[#ff4d8d] to-[#ff85a2] rounded-full mx-4"></div>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#ff4d8d] to-transparent"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ff4d8d] to-[#ff85a2] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
            
            <Link
              href="/collection"
              className="group flex items-center gap-3 px-8 py-4 border-2 border-[#ff4d8d] text-[#ff4d8d] rounded-xl font-semibold hover:bg-[#ff4d8d] hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Browse Collection
            </Link>
          </div>

          {/* Search Section */}
          <div className="bg-gradient-to-r from-[#fff3f3] to-white p-6 rounded-xl border border-[#ff4d8d]/10">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
              Looking for something specific?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for jewelry..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d8d] focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#ff4d8d] to-[#ff85a2] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-12">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Popular Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Earrings", href: "/collection/earrings", icon: "💎" },
              { name: "Rings", href: "/collection/ring", icon: "💍" },
              { name: "Pendants", href: "/collection/pendants", icon: "✨" },
              { name: "Combos", href: "/collection/combos", icon: "🎁" }
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-[#ff4d8d]/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <p className="font-semibold text-gray-900 group-hover:text-[#ff4d8d] transition-colors">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff4d8d] to-[#ff85a2] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl">🚚</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Free Shipping</h4>
            <p className="text-sm text-gray-600">On orders over ₹299</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff4d8d] to-[#ff85a2] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl">🔄</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Easy Returns</h4>
            <p className="text-sm text-gray-600">30 days return policy</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff4d8d] to-[#ff85a2] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl">🔒</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Secure Payment</h4>
            <p className="text-sm text-gray-600">100% secure payment</p>
          </div>
        </div>

        {/* Back to Previous Page */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-gray-600 hover:text-[#ff4d8d] transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Go back to previous page</span>
          </button>
        </div>
      </div>
    </div>
  )
}
