"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import EarringsLayout from "@/components/collection/earrings-layout"
import { Sparkles } from "lucide-react"

async function getKoreanProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && type == "korean"]{
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
    console.error("Error fetching Korean products:", error)
    return []
  }
}

export default function KoreanProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getKoreanProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <EarringsLayout
      collectionType="korean"
      title="Korean Earrings Collection"
      description="Discover our exquisite collection of Korean-inspired earrings, featuring delicate designs and modern elegance that capture the essence of Korean beauty and sophistication."
      icon={<Sparkles className="h-12 w-12 text-white" />}
      products={products}
      isLoading={isLoading}
    />
  )
}
