"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function CartSidebar() {
  const { state, removeItem, updateQuantity, clearCart, trackActivity } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Small delay for animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Track activity when user interacts with cart
  const handleInteraction = () => {
    trackActivity()
  }

  if (state.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full text-center p-8"
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-amber-400" />
          </div>
        </div>
        <h3 className="text-xl font-serif font-light mb-2">Your Cart is Empty</h3>
        <p className="text-gray-500 mb-6">Add exquisite pieces to begin your collection</p>
        <Button className="bg-black hover:bg-gray-800 rounded-sm px-6">
          Continue Shopping
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-serif font-light">Your Cart</h2>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">{state.itemCount} items</span>
          <Sparkles className="h-4 w-4 text-amber-400" />
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto py-2 px-4">
        <AnimatePresence>
          {state.items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="flex items-center p-4 mb-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg?height=80&width=80"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 ml-4">
                <h4 className="text-sm font-medium truncate">{item.name}</h4>
                <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)}</p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full bg-transparent border-gray-300"
                      onClick={() => {
                        updateQuantity(item.id, item.quantity - 1)
                        handleInteraction()
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full bg-transparent border-gray-300"
                      onClick={() => {
                        updateQuantity(item.id, item.quantity + 1)
                        handleInteraction()
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
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

      {/* Cart Summary */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="border-t border-gray-100 bg-gray-50 p-6 space-y-5"
      >
        {/* Subtotal
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${state.subtotal?.toFixed(2) || state.total.toFixed(2)}</span>
        </div>

        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{state.subtotal > 500 ? "FREE" : "$15.00"}</span>
        </div> */}

        {/* Total */}
        <div className="flex justify-between text-base font-medium pt-3 border-t border-gray-200">
          <span>Total</span>
          <span>${state.total.toFixed(2)}</span>
        </div>

        {/* Promo message */}
        {/* {state.subtotal < 500 && (
          <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
            <p className="text-xs text-amber-800 text-center">
              Add ${(500 - state.subtotal).toFixed(2)} more for free shipping
            </p>
          </div>
        )} */}

        {/* Buttons */}
        <div className="space-y-3">
          <Link href="/checkout">
            <Button className="w-full bg-black hover:bg-gray-800 rounded-sm h-12 font-normal">
              Proceed to Checkout
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full bg-white border-gray-300 text-gray-600 hover:bg-gray-50 rounded-sm h-10 font-normal"
            onClick={() => {
              clearCart()
              handleInteraction()
            }}
          >
            Clear Cart
          </Button>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Checkout
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}