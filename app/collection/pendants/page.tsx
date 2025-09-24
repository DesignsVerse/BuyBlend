"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import EarringsLayout from "@/components/collection/earrings-layout"
import { Heart } from "lucide-react"

async function getPendantProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && category->slug.current == "pendant"]{
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
    console.error("Error fetching pendant products:", error)
    return []
  }
}

export default function PendantProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getPendantProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <EarringsLayout
      collectionType="pendant"
      title="Pendant Collection"
      description="Discover Blend’s exquisite pendant collection. Each piece is a symbol of elegance, designed to complement your unique style, day or night."
      icon={<Heart className="h-12 w-12 text-white" />}
      products={products}
      isLoading={isLoading}
    />
  )
}
