'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUp } from 'lucide-react'

// Dynamically import motion components
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false })

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <>
      {typeof window !== 'undefined' ? (
        <MotionDiv
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <MotionDiv
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={scrollToTop}
              className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5 group-hover:text-amber-600 transition-colors duration-300" />
            </button>
          </MotionDiv>
        </MotionDiv>
      ) : (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={scrollToTop}
            className="bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-200"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
