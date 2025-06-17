"use client"

import React, { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { getCart } from '../utils/cartWishlist'
import { useRouter } from 'next/navigation'

function FloatingCartButton() {
  const [cartCount, setCartCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {    const updateCartCount = () => {
      if (typeof window !== 'undefined') {
        const items = getCart()
        setCartCount(items.length)
        setIsVisible(items.length > 0)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for cart updates
    const handleStorageChange = () => {
      updateCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for cart updates within the same tab
    window.addEventListener('cartUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
    }
  }, [])

  const handleClick = () => {
    router.push('/cart')
  }

  if (!isVisible) return null

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
      aria-label={`Cart with ${cartCount} items`}
    >
      <div className="relative">
        <ShoppingBag className="h-6 w-6" />
        {cartCount > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {cartCount > 9 ? '9+' : cartCount}
          </div>
        )}
      </div>
    </button>
  )
}

export default FloatingCartButton
