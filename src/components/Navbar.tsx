'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart, Menu, X } from 'lucide-react'
import { getCart, getWishlist } from '../utils/cartWishlist';
import { AuthDropdown } from './AuthDropdown';

export function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client flag to prevent hydration mismatch
    setIsClient(true)
    
    function updateCounts() {
      if (typeof window !== 'undefined') {
        setCartCount(getCart().length)
        setWishlistCount(getWishlist().length)
      }
    }
    function updateUser() {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch (error) {
            console.error('Error parsing user data:', error)
            localStorage.removeItem('user')
            setUser(null)
          }
        } else {
          setUser(null)
        }
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
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center select-none">
            {/* Small, non-animated logo for navbar */}
            <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-gray-900 leading-none">ZEVANY</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center">
            <div className="flex space-x-8 xl:space-x-12">
              <Link href="/" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Home</Link>
              <Link href="/collections" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Collections</Link>
              <Link href="/rings" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Rings</Link>
              <Link href="/bracelets" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Bracelets</Link>
              <Link href="/necklaces" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Necklaces</Link>
              <Link href="/earrings" className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors">Earrings</Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-900 hover:text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>          {/* Desktop Right Side Icons */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/wishlist" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <Heart className="h-6 w-6" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <AuthDropdown 
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </div>          {/* Mobile Icons (visible on tablet and mobile) */}
          <div className="flex lg:hidden items-center space-x-4">
            <Link href="/wishlist" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <Heart className="h-5 w-5" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-sans font-bold text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-sans font-bold text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <Link 
                href="/" 
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/collections" 
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              <Link 
                href="/rings" 
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Rings
              </Link>
              <Link 
                href="/bracelets" 
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Bracelets
              </Link>
              <Link 
                href="/necklaces" 
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Necklaces
              </Link>
              <Link 
                href="/earrings" 
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Earrings
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="px-3">
                  <AuthDropdown 
                    user={user}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
