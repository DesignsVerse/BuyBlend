"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/Home/product-card"
import { Product } from "@/lib/sanity/types"
import { client } from "@/lib/sanity/client"
import { notFound } from "next/navigation"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

// ✅ Fetch combo products
async function getComboProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && category->slug.current == "combos"]{
        _id,
        name,
        slug,
        price,
        media,
        description,
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

type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"

export default function ComboProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [activeSort, setActiveSort] = useState<SortOption>("featured")
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Selected products for combo
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [comboList, setComboList] = useState<Product[][]>([]) // final added combos

  useEffect(() => {
    setIsLoading(true)
    getComboProducts().then((data) => {
      if (!data || data.length === 0) return notFound()
      setProducts(data)
      setSortedProducts(data)
      setIsLoading(false)
    })
  }, [])

  // ✅ Sorting logic
  useEffect(() => {
    let sorted = [...products]
    switch (activeSort) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b._createdAt).getTime() -
            new Date(a._createdAt).getTime()
        )
        break
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "name-asc":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        break
      case "name-desc":
        sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""))
        break
      default:
        break
    }
    setSortedProducts(sorted)
  }, [products, activeSort])

  // ✅ Handle select/deselect product
  function toggleSelect(product: Product) {
    if (selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter((p) => p._id !== product._id))
    } else {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  // ✅ Remove from selected sidebar
  function removeSelected(id: string) {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== id))
  }

  // ✅ Add combo to local list
  function handleAddCombo() {
    if (selectedProducts.length % 3 === 0 && selectedProducts.length > 0) {
      setComboList([...comboList, selectedProducts])
      setSelectedProducts([]) // reset after adding
    }
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Build Your Combo</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortOption)}
              className="appearance-none border rounded-lg px-3 py-2 pr-8"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left: Products */}
        <div className="w-3/4 grid grid-cols-3 gap-4">
          {isLoading ? (
            <p>Loading products...</p>
          ) : sortedProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            sortedProducts.map((product) => {
              const isSelected = !!selectedProducts.find(
                (p) => p._id === product._id
              )
              return (
                <div
                  key={product._id}
                  className={`cursor-pointer rounded-lg border p-4 transition ${
                    isSelected
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => toggleSelect(product)}
                >
                  <ProductCard product={product} />
                </div>
              )
            })
          )}
        </div>

        {/* Right: Combo Sidebar */}
        <div className="w-1/4 border p-4 rounded-lg sticky top-8 h-fit">
          <h2 className="font-bold text-lg mb-4">Your Combo</h2>

          {selectedProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No products selected</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {selectedProducts.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between items-center text-sm border-b pb-1"
                >
                  <span>{p.name}</span>
                  <button
                    onClick={() => removeSelected(p._id)}
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add Combo Button */}
          <button
            disabled={
              selectedProducts.length % 3 !== 0 ||
              selectedProducts.length === 0
            }
            onClick={handleAddCombo}
            className={`w-full px-4 py-2 rounded-lg ${
              selectedProducts.length % 3 === 0 &&
              selectedProducts.length !== 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Add Combo
          </button>

          {/* Show saved combos */}
          {comboList.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-sm">Saved Combos</h3>
              <ul className="space-y-2 text-xs">
                {comboList.map((combo, idx) => (
                  <li key={idx} className="border rounded p-2">
                    Combo {idx + 1}: {combo.map((p) => p.name).join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
