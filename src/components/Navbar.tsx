'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart } from 'lucide-react'
import { getCart, getWishlist } from '../utils/cartWishlist';
import { AuthDropdown } from './AuthDropdown';

export function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null)

  useEffect(() => {
    function updateCounts() {
      setCartCount(getCart().length)
      setWishlistCount(getWishlist().length)
    }
    function updateUser() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }
    updateCounts()
    updateUser()
    window.addEventListener('storage', updateCounts)
    window.addEventListener('cartWishlistUpdate', updateCounts)
    window.addEventListener('storage', updateUser)
    return () => {
      window.removeEventListener('storage', updateCounts)
      window.removeEventListener('cartWishlistUpdate', updateCounts)
      window.removeEventListener('storage', updateUser)
    }
  }, [])
  const handleLogin = (userData: { firstName: string; lastName: string; email: string }) => {
    setUser(userData)
    window.dispatchEvent(new Event('storage'))
  }
  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload()
  }
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-12 select-none">
            <span className="text-4xl font-serif font-normal tracking-tight text-gray-900 leading-none">ZEVANY</span>
          </Link>
          {/* Centered Menu */}
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-12">
              <Link href="/" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Home</Link>
              <Link href="/collections" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Collections</Link>
              <Link href="/rings" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Rings</Link>
              <Link href="/bracelets" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Bracelets</Link>
              <Link href="/necklaces" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Necklaces</Link>
              <Link href="/earrings" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Earrings</Link>
            </div>
          </div>
          {/* Right Side Icons */}
          <div className="flex items-center space-x-6 ml-8">
            <Link href="/wishlist" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* User Account */}
            <AuthDropdown 
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
