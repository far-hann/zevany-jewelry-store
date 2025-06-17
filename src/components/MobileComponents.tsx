"use client"

import { useState, useEffect } from 'react'
import { ShoppingBag, Home, Search, Heart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// Floating Cart Button (Mobile Only)
function MobileFloatingCart() {
  const [cartCount, setCartCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const updateCartCount = () => {
      if (typeof window !== 'undefined') {
        try {
          const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
          const count = Array.isArray(cartItems) ? cartItems.length : 0
          setCartCount(count)
          setIsVisible(count > 0)
        } catch (error) {
          console.error('Error reading cart:', error)
          setCartCount(0)
          setIsVisible(false)
        }
      }
    }

    // Initial load
    updateCartCount()

    // Listen for cart updates
    const handleStorageChange = () => updateCartCount()
    const handleCartUpdate = () => updateCartCount()

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartWishlistUpdate', handleCartUpdate)
    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartWishlistUpdate', handleCartUpdate)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  if (!isVisible) return null

  return (
    <button
      onClick={() => router.push('/cart')}
      className="lg:hidden fixed bottom-20 right-4 z-40 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      aria-label={`Cart with ${cartCount} items`}
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5" />
        {cartCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {cartCount > 9 ? '9+' : cartCount}
          </div>
        )}
      </div>
    </button>
  )
}

// Bottom Navigation (Mobile Only)
function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/wishlist', icon: Heart, label: 'Wishlist' },
    { href: '/cart', icon: ShoppingBag, label: 'Cart' },
    { href: '/account', icon: User, label: 'Account' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-1">
      <div className="flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all ${
                isActive 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-gray-900' : ''}`} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-gray-900' : ''}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Main Mobile Components Wrapper
export default function MobileComponents() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <MobileFloatingCart />
      <MobileBottomNav />
    </>
  )
}
