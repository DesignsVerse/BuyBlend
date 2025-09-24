"use client"

import { useState, useEffect } from "react"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import EarringsLayout from "@/components/collection/earrings-layout"
import { Package } from "lucide-react"

async function getComboProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && category->slug.current == "combos"]{
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
    console.error("Error fetching combo products:", error)
    return []
  }
}

export default function ComboProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getComboProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <EarringsLayout
      collectionType="combos"
      title="Combo Collection"
      description="Blend brings you exclusive jewelry combos—crafted to mix, match, and elevate your style while you save more."
      icon={<Package className="h-12 w-12 text-white" />}
      products={products}
      isLoading={isLoading}
    />
  )
}
