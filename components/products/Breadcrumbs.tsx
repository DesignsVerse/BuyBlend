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
    <nav className="text-gray-600 mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-end gap-2 text-sm md:text-base justify-end">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="hover:underline text-gray-500 transition-colors"
          >
            Home
          </Link>
        </li>


        {/* Category */}
        {product?.category?.name && (
          <>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/collection/${
                  product.category.slug?.current ||
                  product.category.name.toLowerCase()
                }`}
                className="hover:underline text-gray-500 capitalize transition-colors"
              >
                {product.category.name}
              </Link>
            </li>
          </>
        )}

        {/* Type */}
        {product?.type && (
          <>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/collection/${product.type.toLowerCase()}`}
                className="hover:underline text-gray-500 capitalize transition-colors"
              >
                {product.type}
              </Link>
            </li>
          </>
        )}

        {/* Product Name */}
        <li className="text-gray-400">/</li>
        <li className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg">
          {product?.name}
        </li>
      </ol>
    </nav>
  )
}
