"use client"

import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <button
      onClick={handleBack}
      className="group flex items-center gap-2 text-gray-600 hover:text-[#ff4d8d] transition-colors mx-auto"
    >
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">Go back to previous page</span>
    </button>
  )
}
