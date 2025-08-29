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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative px-6 sm:px-10 py-12 text-center">
              {/* Illustration / placeholder */}
              <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gray-100">
                <Image
                  src="/icons/heart-outline.png"
                  alt="Empty wishlist"
                  width={48}
                  height={48}
                  className="opacity-80"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                Your Wishlist is empty
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto mb-8">
                Save favorites to keep track of items and shop them later. Start exploring collections and tap the heart on products to add them here.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/collections">
                  <Button className="bg-black hover:bg-gray-800 text-white px-6">
                    Explore collections
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="border-black text-black hover:bg-gray-50 px-6">
                    Continue shopping
                  </Button>
                </Link>
              </div>

              {/* Helpful links */}
              <div className="mt-8 text-sm text-gray-600">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/collections/new" className="underline underline-offset-2 hover:text-black">
                    Shop new arrivals
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/collections/bestsellers" className="underline underline-offset-2 hover:text-black">
                    View bestsellers
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/collections/sale" className="underline underline-offset-2 hover:text-black">
                    Browse offers
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Optional: suggested products block (neutral skeletons) */}
          <div className="mt-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Popular picks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="aspect-square rounded-lg bg-gray-100 animate-pulse" />
                  <div className="mt-3 h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="mt-2 h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your Wishlist ({state.itemCount})</h1>
        <Button variant="outline" onClick={clear} className="border-black text-black hover:bg-gray-50">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {state.items.map((item) => (
          <Card key={item.id} className="overflow-hidden border border-gray-200 bg-white">
            <div className="relative aspect-square">
              <Image
                src={item.image || "/diverse-products-still-life.png"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-3">
              <Link href={`/products/${item.slug}`} className="block">
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">${item.price}</span>
                <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)} className="text-gray-700 hover:bg-gray-100">
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
