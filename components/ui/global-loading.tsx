'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * GlobalLoadingOverlay shows a full-screen spinner during client-side navigations.
 * It starts on internal <a> clicks and hides when the URL (pathname or search) changes.
 */
export default function GlobalLoadingOverlay() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const hideTimeoutRef = useRef<number | null>(null)

  // Start loading on internal link clicks
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Ignore modified clicks (new tab, download, etc.)
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      // Find nearest anchor element
      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.('a') as HTMLAnchorElement | null
      if (!anchor) return

      // Only handle same-origin navigations
      const url = new URL(anchor.href, window.location.href)
      const isSameOrigin = url.origin === window.location.origin
      const isHashOnly = url.pathname === window.location.pathname && url.hash && url.search === window.location.search

      if (!isSameOrigin || isHashOnly) return

      // Show loading immediately for better UX
      window.clearTimeout(timeoutRef.current ?? undefined)
      window.clearTimeout(hideTimeoutRef.current ?? undefined)
      setIsLoading(true)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // Stop loading when route actually changes
  useEffect(() => {
    if (isLoading) {
      // Hide loading immediately when route changes
      window.clearTimeout(hideTimeoutRef.current ?? undefined)
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsLoading(false)
      }, 100) // Much faster hide time
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  // Also ensure we hide spinner on hard navigations/unloads
  useEffect(() => {
    const handleBeforeUnload = () => setIsLoading(false)
    const handlePageShow = () => setIsLoading(false)
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pageshow', handlePageShow)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  // Auto-hide after maximum time to prevent stuck loading
  useEffect(() => {
    if (isLoading) {
      const maxTimeout = window.setTimeout(() => {
        setIsLoading(false)
      }, 3000) // Maximum 3 seconds

      return () => clearTimeout(maxTimeout)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1000] bg-white/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3 border border-gray-100"
          >
            {/* Professional Spinner */}
            <div className="relative">
              <div className="h-6 w-6 rounded-full border-2 border-gray-200 border-t-[#ff4d8d] animate-spin" />
            </div>
            
            {/* Loading Text */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-medium text-gray-700"
            >
              Loading...
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


