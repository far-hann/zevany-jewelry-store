'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ShoppingBag, Heart, Sparkles, X } from 'lucide-react'

// Dynamically import motion components
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false })

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    // Show FAB after page loads
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    // Simulate cart/wishlist counts (in real app, get from state/context)
    setCartCount(2)
    setWishlistCount(5)

    // Auto-collapse after 5 seconds of expansion
    let collapseTimer: NodeJS.Timeout
    if (isExpanded) {
      collapseTimer = setTimeout(() => {
        setIsExpanded(false)
      }, 5000)
    }

    return () => {
      clearTimeout(timer)
      if (collapseTimer) clearTimeout(collapseTimer)
    }
  }, [isExpanded])

  if (!isVisible) return null

  return (
    <>
      {isVisible && typeof window !== 'undefined' ? (
        <MotionDiv
          initial={{ opacity: 0, scale: 0, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ 
            duration: 0.6, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Expanded Menu */}
          {isExpanded && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 right-0 flex flex-col space-y-3 mb-4"
            >
              {/* Wishlist Button */}
              <MotionDiv
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href="/wishlist"
                  className="flex items-center bg-white text-gray-800 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                >
                  <div className="relative">
                    <Heart className="h-5 w-5 text-red-500 group-hover:fill-current transition-colors duration-300" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="ml-3 font-medium">Wishlist</span>
                </Link>
              </MotionDiv>

              {/* Cart Button */}
              <MotionDiv
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href="/cart"
                  className="flex items-center bg-white text-gray-800 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
                >
                  <div className="relative">
                    <ShoppingBag className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="ml-3 font-medium">Cart</span>
                </Link>
              </MotionDiv>
            </MotionDiv>
          )}

          {/* Main FAB */}
          <MotionDiv
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              rotate: isExpanded ? 45 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group overflow-hidden"
            >
              {/* Animated background */}
              <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ scale: 0 }}
                animate={{ scale: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Icon */}
              <div className="relative z-10">
                {isExpanded ? (
                  <X className="h-6 w-6" />
                ) : (
                  <MotionDiv
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </MotionDiv>
                )}
              </div>

              {/* Notification badges */}
              {(cartCount > 0 || wishlistCount > 0) && !isExpanded && (
                <MotionDiv
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
                >
                  {cartCount + wishlistCount}
                </MotionDiv>
              )}

              {/* Pulse effect */}
              <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </button>
          </MotionDiv>
        </MotionDiv>
      ) : (
        // Static version for SSR
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-4 rounded-full shadow-2xl"
          >
            <Sparkles className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  )
}
