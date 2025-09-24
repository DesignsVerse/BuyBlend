"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Lock, Truck, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function CartSidebar() {
  const { state, removeItem, updateQuantity, clearCart, trackActivity, setIsCartOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInteraction = () => {
    trackActivity();
  };

  const handleClose = () => {
    if (setIsCartOpen) setIsCartOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    handleInteraction();
  };

  const handleDecrease = (id: string, qty: number) => {
    if (qty <= 1) {
      handleRemoveItem(id);
    } else {
      updateQuantity(id, qty - 1);
      handleInteraction();
    }
  };

  const handleIncrease = (id: string, qty: number) => {
    updateQuantity(id, qty + 1);
    handleInteraction();
  };

  if (state.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-b from-white to-gray-50 relative"
      >
        <button
          onClick={handleClose}
          aria-label="Close cart"
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        <motion.div
          animate={{ y: [0, -5, 0], rotate: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h3>
        <p className="text-gray-600 mb-6 max-w-xs">Discover our curated collection and add elegance to your cart.</p>
        <Link href="/products" className="cursor-pointer">
          <Button className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white rounded-lg px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">
            Explore Collection
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center cursor-default">
          <div className="bg-gradient-to-r from-gray-900 to-black p-2 rounded-lg mr-3 shadow-sm cursor-pointer">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
          <span className="ml-2 text-xs text-gray-500">({state.itemCount} {state.itemCount === 1 ? "item" : "items"})</span>
        </div>
      </div>

      {/* Free Shipping */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4 cursor-default">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-blue-100 p-1 rounded-full mr-2 cursor-pointer">
              <Truck className="h-4 w-4 text-black" />
            </div>
            <span className="text-sm font-medium text-black">
              {state.total >= 299 ? "You've unlocked free shipping!" : "Free shipping on orders above ₹299"}
            </span>
          </div>
          {state.total < 299 && (
            <span className="text-xs font-semibold bg-white px-2 py-1 rounded-full cursor-default">
              ₹{(299 - state.total).toLocaleString("en-IN")} more
            </span>
          )}
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden cursor-default">
          <motion.div
            className="bg-black h-2 rounded-full relative"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((state.total / 299) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {state.total < 299 && (
              <motion.div
                className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full -mt-0.5 -mr-1.5 shadow-sm cursor-pointer"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto py-4 px-5">
        <div className="flex flex-col space-y-4">
          <AnimatePresence mode="popLayout">
            {state.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center group relative overflow-hidden cursor-default"
              >
                {/* Product Image */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 cursor-pointer">
                  <Image
                    src={item.image || "/placeholder.svg?height=80&width=80"}
                    alt={item.name || "Product Image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg?height=80&width=80"; }}
                  />
                  <div className="absolute top-1 right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm cursor-default">
                    {item.quantity}
                  </div>
                </div>

                {/* Product Details */}
                <div className="ml-4 flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate cursor-default">{item.name || "Unnamed Product"}</h4>
                  <p className="text-sm text-gray-600 mt-1 cursor-default">₹{(item.originalPrice || 0).toLocaleString("en-IN")}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white border border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3 text-gray-700" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center text-gray-900 cursor-default">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white border border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3 text-gray-700" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                      onClick={() => handleRemoveItem(item.id)}
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

      {/* Cart Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
        className="sticky bottom-0 border-t border-gray-100 bg-white p-5 space-y-5 shadow-lg cursor-default"
      >
        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-default">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{state.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/checkout" onClick={handleClose} className="block cursor-pointer">
            <Button className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white rounded-lg h-12 font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer">
              Proceed to Checkout
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg h-10 font-medium shadow-sm cursor-pointer"
            onClick={() => { clearCart(); handleInteraction(); }}
          >
            Clear Cart
          </Button>
        </div>

        <div className="pt-2 flex items-center justify-center cursor-default">
          <div className="flex items-center text-xs text-gray-500">
            <Lock className="h-3 w-3 mr-1" />
            Secure SSL Encryption
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
