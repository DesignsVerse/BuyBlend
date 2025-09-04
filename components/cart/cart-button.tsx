"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart/cart-context"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CartSidebar } from "./cart-sidebar"

export function CartButton() {
  const { state } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative bg-transparent border-none hover:bg-gray-100 transition-all duration-300"
        >
          <ShoppingCart className="h-5 w-5" />
          
          {state.itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-black text-white border border-white shadow-lg"
            >
              {state.itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-white p-0 overflow-hidden"
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
      </SheetContent>
    </Sheet>
  )
}
