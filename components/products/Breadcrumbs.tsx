"use client"

import Link from "next/link"

interface BreadcrumbsProps {
  product: {
    name: string
    type?: string
    category?: {
      name: string
      slug?: { current: string }
    }
  }
}

export default function Breadcrumbs({ product }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-gray-600 mb-6">
<ol className="flex flex-wrap items-center space-x-2 justify-start ml-22">
{/* Home */}
        <li>
          <Link href="/" className="hover:underline text-gray-500">
            Home
          </Link>
        </li>
        <li>/</li>

        {/* Products */}
        <li>
          <Link href="/products" className="hover:underline text-gray-500">
            Products
          </Link>
        </li>

        {/* Category */}
        {product?.category?.name && (
          <>
            <li>/</li>
            <li>
              <Link
                href={`/collection/${
                  product.category.slug?.current ||
                  product.category.name.toLowerCase()
                }`}
                className="hover:underline text-gray-500 capitalize"
              >
                {product.category.name}
              </Link>
            </li>
          </>
        )}

        {/* Type */}
        {product?.type && (
          <>
            <li>/</li>
            <li>
              <Link
                href={`/collection/earrings/${product.type.toLowerCase()}`}
                className="hover:underline text-gray-500 capitalize"
              >
                {product.type}
              </Link>
            </li>
          </>
        )}

        {/* Product Name */}
        <li>/</li>
        <li className="text-gray-900 font-semibold">{product?.name}</li>
      </ol>
    </nav>
  )
}
