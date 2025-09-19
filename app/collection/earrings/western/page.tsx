"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import EarringsLayout from "@/components/collection/earrings-layout"
import { Crown } from "lucide-react"

async function getWesternProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && type == "western"]{
        _id,
        name,
        slug,
        price,
        originalPrice,
        compareAtPrice,
        media,
        description,
        highlights,
        category->{_id, name, slug},
        featured,
        inStock,
        inventory,
        type,
        tags,
        _createdAt
      }`,
      {},
      { cache: "no-store" }
    )
  } catch (error) {
    console.error("Error fetching western products:", error)
    return []
  }
}

export default function WesternProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getWesternProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <EarringsLayout
      collectionType="western"
      title="Western Earrings Collection"
      description="Discover our exquisite collection of western-style earrings, crafted to perfection for every occasion. From classic elegance to modern sophistication, find your perfect statement piece."
      icon={<Crown className="h-12 w-12 text-white" />}
      products={products}
      isLoading={isLoading}
    />
  )
}