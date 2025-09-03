"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export type SortOption = "price-asc" | "price-desc"

interface ProductSortBarProps {
  activeSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export function ProductSortBar({ activeSort, onSortChange }: ProductSortBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSort = (sort: SortOption) => {
    onSortChange(sort)
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Sort Products</h2>
      <div className="relative">
        <Button
          variant="outline"
          className="flex items-center justify-between w-48"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {activeSort === "price-asc" ? "Price: Low → High" : "Price: High → Low"}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <ul className="flex flex-col">
              <li>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    activeSort === "price-asc" ? "bg-gray-100 font-semibold" : ""
                  } hover:bg-gray-50`}
                  onClick={() => handleSort("price-asc")}
                >
                  Price: Low → High
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    activeSort === "price-desc" ? "bg-gray-100 font-semibold" : ""
                  } hover:bg-gray-50`}
                  onClick={() => handleSort("price-desc")}
                >
                  Price: High → Low
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
