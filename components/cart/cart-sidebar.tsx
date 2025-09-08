"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function CartSidebar() {
  const { state, removeItem, updateQuantity, clearCart, trackActivity } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleInteraction = () => {
    trackActivity()
  }

  if (state.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full text-center p-8 bg-white"
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-2xl font-serif font-light text-black mb-2">Your Cart is Empty</h3>
        <p className="text-gray-600 mb-6">Discover our curated collection and add elegance to your cart.</p>
        <Link href="/products">
          <Button className="bg-black hover:bg-gray-800 text-white rounded-sm px-8 py-3 font-medium">
            Explore Collection
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <ShoppingBag className="h-5 w-5 text-gray-700 mr-3" />
          <h2 className="text-xl font-serif font-light text-black">Your Cart</h2>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">{state.itemCount} items</span>
          <ShoppingBag className="h-4 w-4 text-black" />
        </div>
      </div>

      {/* Cart Items - Vertical Scroll */}
      <div className="flex-1 overflow-y-auto py-4 px-6 pb-48"> {/* Added pb-48 to prevent overlap */}
        <div className="flex flex-col space-y-4 min-h-[200px]"> {/* Added min-h-[200px] */}
          <AnimatePresence>
            {state.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center"
              >
                {/* Product Image */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.image || "/placeholder.svg?height=80&width=80"}
                    alt={item.name || "Product Image"}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-black truncate">{item.name || "Unnamed Product"}</h4>
                  <p className="text-sm text-gray-600 mt-1">₹{(item.price || 0).toLocaleString("en-IN")}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-transparent border-gray-300 hover:border-black"
                        onClick={() => {
                          const newQty = Math.max(item.quantity - 1, 1)
                          updateQuantity(item.id, newQty)
                          handleInteraction()
                        }}
                      >
                        <Minus className="h-4 w-4 text-black" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center text-black">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-transparent border-gray-300 hover:border-black"
                        onClick={() => {
                          updateQuantity(item.id, item.quantity + 1)
                          handleInteraction()
                        }}
                      >
                        <Plus className="h-4 w-4 text-black" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full"
                      onClick={() => {
                        removeItem(item.id)
                        handleInteraction()
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Cart Summary - Sticky */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-6 space-y-5"
      >
        {/* Free Shipping Progress */}
        {state.total < 299 ? (
          <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Free shipping on orders above ₹299</span>
              <span>₹{(299 - state.total).toLocaleString("en-IN")} more</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((state.total / 299) * 100, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-green-100 p-3 rounded-lg border border-green-200 text-green-700 text-sm font-medium">
            🎉 Free shipping applied!
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-base font-medium text-black pt-3 border-t border-gray-200">
          <span>Total Amount</span>
          <span>₹{state.total.toLocaleString("en-IN")}</span>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link href="/checkout">
            <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-sm h-12 font-medium">
              Proceed to Checkout
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full bg-white border-gray-300 text-black hover:bg-gray-100 rounded-sm h-10 font-medium"
            onClick={() => {
              clearCart()
              handleInteraction()
            }}
          >
            Clear Cart
          </Button>
        </div>

        {/* Security & Trust Badges */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Lock className="h-4 w-4 text-gray-600 mb-1" />
              <span className="text-xs text-gray-600">Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="h-4 w-4 text-gray-600 mb-1" />
              <span className="text-xs text-gray-600">Premium</span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-4 w-4 text-gray-600 mb-1" />
              <span className="text-xs text-gray-600">Quality</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
