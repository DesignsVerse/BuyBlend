import { notFound } from "next/navigation"
import Image from "next/image"
import { client, queries, urlFor } from "@/lib/sanity/client"
import { mockProducts } from "@/lib/sanity/mock-data"
import type { Product } from "@/lib/sanity/types"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { SiteHeader } from "@/components/Home/header"

interface ProductPageProps {
  params: {
    slug: string
  }
}

function findMockProduct(slug: string): Product | null {
  return mockProducts.find((product) => product.slug.current === slug) || null
}

function getImageUrl(imageRef: any, width = 600, height = 600): string {
  if (typeof imageRef === "string") {
    // Handle regular file paths from mock data
    return imageRef
  }

  try {
    // Handle Sanity asset references
    return urlFor(imageRef).width(width).height(height).url()
  } catch (error) {
    console.error("Error processing image:", error)
    return "/placeholder.svg"
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const sanityProduct = await client.fetch(queries.productBySlug, { slug })
    if (sanityProduct) {
      return sanityProduct
    }
  } catch (error) {
    console.error("Error fetching from Sanity:", error)
  }

  return findMockProduct(slug)
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const mainImage = product.images?.[0] ? getImageUrl(product.images[0], 600, 600) : "/diverse-products-still-life.png"

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={typeof product.images?.[0] === "object" ? product.images[0].alt || product.name : product.name}
                fill
                className="object-cover"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={typeof image === "object" ? image._key || index : index}
                    className="relative aspect-square overflow-hidden rounded"
                  >
                    <Image
                      src={getImageUrl(image, 150, 150) || "/placeholder.svg"}
                      alt={
                        typeof image === "object"
                          ? image.alt || `${product.name} ${index + 2}`
                          : `${product.name} ${index + 2}`
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.category && <p className="text-gray-600">{product.category.name}</p>}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">${product.price}</span>
              {hasDiscount && <span className="text-xl text-gray-500 line-through">${product.compareAtPrice}</span>}
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Availability:</span>
                  <span className={product.inventory > 0 ? "text-green-600" : "text-red-600"}>
                    {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
                  </span>
                </div>

                <AddToCartButton product={product} disabled={product.inventory === 0} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
