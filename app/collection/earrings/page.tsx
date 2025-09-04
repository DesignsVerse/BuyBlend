// app/products/earrings/page.tsx
import { client } from "@/lib/sanity/client"
import type { Product, Category } from "@/lib/sanity/types"
import ProductsPageClient from "@/app/products/products-client"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"
import { TopMarquee } from "@/components/products/offer-marquee"

// Fetch all earrings products
async function getEarringsProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && category->slug.current == "earring"]{
        _id,
        name,
        slug,
        price,
        compareAtPrice,
        media,
        description,
        highlights,
        category->{_id, name, slug},
        featured,
        inStock,
        inventory,
        type
      }`,
      {},
      { cache: "no-store" }
    )
  } catch (error) {
    console.error("Error fetching earrings products:", error)
    return []
  }
}

// Fetch unique types inside earrings
async function getEarringTypes(): Promise<Category[]> {
  try {
    const types = await client.fetch(
      `array::unique(*[_type == "product" && category->slug.current == "earring" && defined(type)].type)`
    )
    // Convert simple string list into Category-like objects
    return types.map((t: string, i: number) => ({
      _id: String(i),
      name: t,
      slug: { current: t.toLowerCase() }   
    }))
  } catch (error) {
    console.error("Error fetching earring types:", error)
    return []
  }
}

// Category card data with images
const categoryCards = [
  {
    id: 1,
    name: "Studs",
    slug: "stud",
    description: "Elegant and timeless stud earrings for everyday wear",
    image: "/new/1.jpg",
    bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
    borderColor: "border-amber-200",
    textColor: "text-amber-800"
  },
  {
    id: 2,
    name: "Western",
    slug: "western",
    description: "Bold and stylish western-inspired earrings",
    image: "/new/2.jpg",
    bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    borderColor: "border-red-200",
    textColor: "text-red-800"
  },
  {
    id: 3,
    name: "Korean",
    slug: "korean",
    description: "Delicate and trendy Korean-style earrings",
    image: "/new/3.jpg",
    bgColor: "bg-gradient-to-br from-pink-50 to-pink-100",
    borderColor: "border-pink-200",
    textColor: "text-pink-800"
  },
  {
    id: 4,
    name: "Jhumkas",
    slug: "jhumkas",
    description: "Traditional and beautiful jhumka earrings",
    image: "/new/4.jpg",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
    textColor: "text-purple-800"
  }
]

export default async function EarringsPage() {
  const products = await getEarringsProducts()
  const categories = await getEarringTypes()

  if (!products || products.length === 0) return notFound()

  return ( 
    <div className="min-h-screen bg-white">
      <TopMarquee />
      
      {/* Category Cards Section */}
      <div className="">
        <div className="mx-auto px-4 py-2 grid md:grid-cols-4 grid-cols-2 gap-3 ">
          {categoryCards.map((category) => (
            <Link
              key={category.id}
              href={`/collection/earrings/${category.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5 h-full">
                {/* Image Container */}
                <div className="relative  h-40 md:h-62 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/5 transition-opacity duration-300 group-hover:bg-black/0" />
                </div>
                
                {/* Content */}
                <div className="p-2">
                  <h3 className="text-sm font-semibold mb-1 text-gray-900 text-center line-clamp-1">
                    {category.name}
                  </h3>
                
                  <div className="flex items-center justify-center text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span className="text-xs">Explore</span>
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="">
          <ProductsPageClient allProducts={products} categories={categories} />
        </div>
      </div>
    </div>
  )
}