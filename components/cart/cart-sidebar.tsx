"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, Lock, Sparkles, X, Truck, Gift, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function CartSidebar() {
  const { state, removeItem, updateQuantity, clearCart, trackActivity } = useCart()
  const [isVisible, setIsVisible] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleInteraction = () => {
    trackActivity()
  }

  const applyPromoCode = () => {
    if (promoCode.trim() !== "") {
      setAppliedPromo(true)
      // Here you would typically validate and apply the promo code
    }
  }

  const calculateDiscount = () => {
    return appliedPromo ? state.total * 0.1 : 0 // 10% discount for demo
  }

  const calculateFinalTotal = () => {
    return state.total - calculateDiscount()
  }

  if (state.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-b from-white to-gray-50"
      >
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h3>
        <p className="text-gray-600 mb-6 max-w-xs">Discover our curated collection and add elegance to your cart.</p>
        <Link href="/products">
          <Button className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white rounded-lg px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
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
      className="flex flex-col h-full bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center">
          <div className="bg-black p-2 rounded-lg mr-3">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
        </div>
        <div className="flex items-center bg-black text-white rounded-full px-3 py-1">
          <span className="text-sm font-medium mr-2">{state.itemCount}</span>
          <span className="text-xs">{state.itemCount === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="bg-blue-50 border-b border-blue-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Truck className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">
              {state.total >= 299 ? "You've unlocked free shipping!" : "Free shipping on orders above ₹299"}
            </span>
          </div>
          {state.total < 299 && (
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
              ₹{(299 - state.total).toLocaleString("en-IN")} more
            </span>
          )}
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((state.total / 299) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Cart Items - Vertical Scroll */}
      <div className="flex-1 overflow-y-auto py-4 px-5">
        <div className="flex flex-col space-y-4">
          <AnimatePresence>
            {state.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center group"
              >
                {/* Product Image */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.image || "/placeholder.svg?height=80&width=80"}
                    alt={item.name || "Product Image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                    }}
                  />
                  <div className="absolute top-1 right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>

                {/* Product Details */}
                <div className="ml-4 flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name || "Unnamed Product"}</h4>
                  <p className="text-sm text-gray-600 mt-1">₹{(item.price || 0).toLocaleString("en-IN")}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white border border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-colors"
                        onClick={() => {
                          const newQty = Math.max(item.quantity - 1, 1)
                          updateQuantity(item.id, newQty)
                          handleInteraction()
                        }}
                      >
                        <Minus className="h-3 w-3 text-gray-700" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center text-gray-900">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white border border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-colors"
                        onClick={() => {
                          updateQuantity(item.id, item.quantity + 1)
                          handleInteraction()
                        }}
                      >
                        <Plus className="h-3 w-3 text-gray-700" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="sticky bottom-0 border-t border-gray-100 bg-white p-5 space-y-5 shadow-lg"
      >
        {/* Promo Code Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center mb-2">
            <Gift className="h-4 w-4 text-gray-700 mr-2" />
            <span className="text-sm font-medium text-gray-900">Promo Code</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Button
              onClick={applyPromoCode}
              disabled={promoCode.trim() === ""}
              className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </Button>
          </div>
          {appliedPromo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 text-sm text-green-600 font-medium"
            >
              ✓ Promo code applied! 10% discount added.
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>₹{state.total.toLocaleString("en-IN")}</span>
          </div>
          
          {appliedPromo && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount (10%)</span>
              <span>-₹{calculateDiscount().toLocaleString("en-IN")}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span className={state.total >= 299 ? "text-green-600 font-medium" : ""}>
              {state.total >= 299 ? "FREE" : "₹50"}
            </span>
          </div>
          
          <div className="h-px bg-gray-200 my-2"></div>
          
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{(state.total >= 299 ? calculateFinalTotal() : calculateFinalTotal() + 50).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link href="/checkout">
            <Button className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white rounded-lg h-12 font-medium shadow-md hover:shadow-lg transition-all duration-300">
              Proceed to Checkout
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg h-10 font-medium"
            onClick={() => {
              clearCart()
              handleInteraction()
            }}
          >
            Clear Cart
          </Button>
        </div>

        {/* Security & Trust Badges */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-2 rounded-full mb-1">
                <Lock className="h-4 w-4 text-gray-700" />
              </div>
              <span className="text-xs text-gray-600">Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-2 rounded-full mb-1">
                <ShieldCheck className="h-4 w-4 text-gray-700" />
              </div>
              <span className="text-xs text-gray-600">Protected</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-2 rounded-full mb-1">
                <Sparkles className="h-4 w-4 text-gray-700" />
              </div>
              <span className="text-xs text-gray-600">Premium</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}