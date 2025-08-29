"use client"

import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/lib/wishlist/wishlist-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function WishlistPage() {
  const { state, removeItem, clear } = useWishlist()

  if (state.itemCount === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>
        <p className="text-gray-600 mb-6">You haven't added any products to your wishlist yet.</p>
        <Link href="/">
          <Button className="bg-black text-white hover:bg-gray-800">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Wishlist ({state.itemCount})</h1>
        <Button variant="outline" onClick={clear}>Clear All</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {state.items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image src={item.image || "/diverse-products-still-life.png"} alt={item.name} fill className="object-cover" />
            </div>
            <CardContent className="p-3">
              <Link href={`/products/${item.slug}`} className="block">
                <h3 className="text-sm font-medium mb-1 line-clamp-2">{item.name}</h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">${item.price}</span>
                <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


