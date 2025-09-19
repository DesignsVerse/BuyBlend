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

      // Next.js intercepts internal links; show loading after a brief delay
      // This prevents flashing for very fast transitions
      window.clearTimeout(timeoutRef.current ?? undefined)
      timeoutRef.current = window.setTimeout(() => setIsLoading(true), 200)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // Stop loading when route actually changes
  useEffect(() => {
    if (isLoading) {
      // Grace period to ensure smooth transition
      window.clearTimeout(timeoutRef.current ?? undefined)
      timeoutRef.current = window.setTimeout(() => setIsLoading(false), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  // Also ensure we hide spinner on hard navigations/unloads
  useEffect(() => {
    const handleBeforeUnload = () => setIsLoading(false)
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1000] bg-[#fff3f3]/40  flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center space-y-4 border border-gray-100"
          >
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-3 border-gray-200 border-t-black animate-spin" />
              <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-black/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-medium text-gray-700"
              >
                Loading...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-gray-500 mt-1"
              >
                Please wait a moment
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


