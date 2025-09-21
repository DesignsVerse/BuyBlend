"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart/cart-context";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSidebar } from "./cart-sidebar";

export function CartButton() {
  const { state, setIsCartOpen } = useCart();

  return (
    <Sheet open={state.isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-transparent border-none hover:bg-gray-100 transition-all duration-300"
          onClick={() => setIsCartOpen(true)} // Ensure clicking the button opens the sheet
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
        <CartSidebar />
      </SheetContent>
    </Sheet>
  );
}
