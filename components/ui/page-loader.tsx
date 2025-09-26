'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SiteHeader } from '@/components/Home/header'

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Listen for clicks on links and cards
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      const card = target.closest('[data-card]')
      
      // Show loader immediately on click
      if (link || card) {
        setIsLoading(true)
      }
    }

    document.addEventListener('click', handleClick, true)
    
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  useEffect(() => {
    // Hide loader when route changes and page is actually visible
    if (isLoading) {
      let hasHidden = false
      
      const hideLoader = () => {
        if (!hasHidden) {
          hasHidden = true
          setIsLoading(false)
        }
      }

      // Wait for the new page to be fully rendered and visible
      const checkPageVisible = () => {
        // Check if the page has substantial content
        const mainContent = document.querySelector('main') || document.querySelector('[data-main]') || document.body
        const hasContent = mainContent && mainContent.children.length > 0
        
        // Check if images are loaded (if any)
        const images = document.querySelectorAll('img')
        const imagesLoaded = Array.from(images).every(img => img.complete)
        
        // Check if the page has been rendered for a bit
        const hasRendered = document.readyState === 'complete'
        
        if (hasContent && hasRendered && imagesLoaded) {
          // Add delay to ensure page is fully visible
          setTimeout(hideLoader, 500)
        }
      }

      // Start checking after a small delay to let the page start loading
      const startChecking = setTimeout(() => {
        checkPageVisible()
        const interval = setInterval(checkPageVisible, 150)
        
        // Store interval to clear later
        const cleanup = () => {
          clearInterval(interval)
        }
        
        // Cleanup after timeout
        setTimeout(cleanup, 5000)
      }, 300)

      // Safety timeout - hide after 6 seconds no matter what
      const safetyTimeout = setTimeout(hideLoader, 6000)

      return () => {
        clearTimeout(startChecking)
        clearTimeout(safetyTimeout)
      }
    }
  }, [pathname, isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col"
        >
          {/* Real Header */}
          <SiteHeader />

          {/* Main Content Area with Loader */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Circular Loader */}
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
              </div>
              
              {/* Loading Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 font-medium"
              >
                Loading...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
