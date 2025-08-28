"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart/cart-context"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CartSidebar } from "./cart-sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function CartButton() {
  const { state } = useCart()
  const [prevItemCount, setPrevItemCount] = useState(0)
  const [isPulsing, setIsPulsing] = useState(false)

  // Animation when item count changes
  useEffect(() => {
    if (state.itemCount > prevItemCount) {
      setIsPulsing(true)
      const timer = setTimeout(() => setIsPulsing(false), 500)
      return () => clearTimeout(timer)
    }
    setPrevItemCount(state.itemCount)
  }, [state.itemCount, prevItemCount])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative bg-transparent border-none hover:bg-gray-100 transition-all duration-300 group"
        >
          <motion.div
            animate={{ scale: isPulsing ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
          </motion.div>
          
          <AnimatePresence mode="wait">
            {state.itemCount > 0 && (
              <motion.div
                key={state.itemCount}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-black text-white border border-white shadow-lg"
                >
                  {state.itemCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-white p-0 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <SheetHeader className="px-6 py-4 border-b border-gray-100">
            <SheetTitle className="text-xl font-serif">Your Shopping Cart</SheetTitle>
            <SheetDescription className="text-sm">
              {state.itemCount === 0
                ? "Your cart is empty"
                : `${state.itemCount} premium item${state.itemCount > 1 ? "s" : ""} awaiting checkout`}
            </SheetDescription>
          </SheetHeader>
          
          <CartSidebar />
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}