"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import EarringsLayout from "@/components/collection/earrings-layout"
import { Gem } from "lucide-react"

async function getStudProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && type == "stud"]{
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
    console.error("Error fetching stud products:", error)
    return []
  }
}

export default function StudProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getStudProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <EarringsLayout
      collectionType="stud"
      title="Premium Stud Collection"
      description="Discover our exclusive range of premium stud earrings, crafted for durability and style. Each piece is meticulously designed to elevate your look with timeless elegance."
      icon={<Gem className="h-12 w-12 text-white" />}
      products={products}
      isLoading={isLoading}
    />
  )
}