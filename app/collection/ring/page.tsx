"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import EarringsLayout from "@/components/collection/earrings-layout"
import { Circle } from "lucide-react"

async function getRingProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && category->slug.current == "rings"]{
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
    console.error("Error fetching ring products:", error)
    return []
  }
}

export default function RingProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getRingProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <EarringsLayout
      collectionType="rings"
      title="Ring Collection"
      description="Explore our exquisite collection of rings, from elegant bands to statement pieces. Each ring is crafted with precision and attention to detail, designed to complement your style and celebrate life's special moments."
      icon={<Circle className="h-12 w-12 text-white" />}
      products={products}
      isLoading={isLoading}
    />
  )
}
