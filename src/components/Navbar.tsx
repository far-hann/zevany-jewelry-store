'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart, Menu, X, User, Package, ChevronRight } from 'lucide-react'
import { getCart, getWishlist } from '../utils/cartWishlist';
import { AuthDropdown } from './AuthDropdown';
import ClientOnly from './ClientOnly';

export function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  useEffect(() => {    
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
              <ClientOnly>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans font-bold">
                    {wishlistCount}
                  </span>
                )}
              </ClientOnly>
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              <ClientOnly>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans font-bold">
                    {cartCount}
                  </span>
                )}
              </ClientOnly>
            </Link>
            <ClientOnly>
              <AuthDropdown 
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            </ClientOnly>
          </div>          {/* Mobile Icons (visible on tablet and mobile) */}
          <div className="flex lg:hidden items-center space-x-4">
            <Link href="/wishlist" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <Heart className="h-5 w-5" />
              <ClientOnly>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-sans font-bold text-[10px]">
                    {wishlistCount}
                  </span>
                )}
              </ClientOnly>
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-900 hover:text-gray-700 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              <ClientOnly>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-sans font-bold text-[10px]">
                    {cartCount}
                  </span>
                )}
              </ClientOnly>
            </Link>
          </div>
        </div>        {/* Mobile Menu - Full Screen Overlay */}
        <ClientOnly>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Full Screen Menu */}
              <div className={`fixed top-0 right-0 w-full h-full bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}>
                <div className="flex flex-col h-full">
                  {/* Header with Close Button */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <span className="text-xl font-serif font-medium text-gray-900">Menu</span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-900" />
                    </button>
                  </div>
                  
                  {/* Account Section with Circle Avatar */}
                  <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        {user ? (
                          <div>
                            <p className="text-lg font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-medium text-gray-900">Welcome</p>
                            <p className="text-sm text-gray-500">Sign in to your account</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-6 py-4 space-y-1">
                      {/* New In */}
                      <div className="py-4 border-b border-gray-100">
                        <span className="text-lg font-medium text-gray-900">New In</span>
                      </div>
                      
                      {/* Jewelry */}
                      <div className="py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium text-gray-900">Jewelry</span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="mt-3 ml-4 space-y-3">
                          <Link 
                            href="/rings" 
                            className="block text-base text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Rings
                          </Link>
                          <Link 
                            href="/necklaces" 
                            className="block text-base text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Necklaces
                          </Link>
                          <Link 
                            href="/bracelets" 
                            className="block text-base text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Bracelets
                          </Link>
                          <Link 
                            href="/earrings" 
                            className="block text-base text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Earrings
                          </Link>
                        </div>
                      </div>
                      
                      {/* Collections */}
                      <div className="py-4 border-b border-gray-100">
                        <Link 
                          href="/collections" 
                          className="flex items-center justify-between"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-lg font-medium text-gray-900">Collections</span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>
                      </div>
                      
                      {/* Account Section */}
                      <div className="py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium text-gray-900">Account</span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="mt-3 ml-4 space-y-3">
                          <Link 
                            href="/account" 
                            className="block text-base text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <Link 
                            href="/orders" 
                            className="block text-base text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            My Orders
                          </Link>
                          <Link 
                            href="/track-order" 
                            className="flex items-center text-base text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Track Order
                          </Link>
                          <Link 
                            href="/wishlist" 
                            className="flex items-center text-base text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Wishlist ({wishlistCount})
                          </Link>
                        </div>
                      </div>
                      
                      {/* About & Support */}
                      <div className="py-4 border-b border-gray-100">
                        <Link 
                          href="/about" 
                          className="flex items-center justify-between"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-lg font-medium text-gray-900">About</span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>
                      </div>
                      
                      <div className="py-4 border-b border-gray-100">
                        <Link 
                          href="/support" 
                          className="flex items-center justify-between"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-lg font-medium text-gray-900">Support</span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Auth Actions */}
                  <div className="px-6 py-6 border-t border-gray-100">
                    <ClientOnly>
                      {user ? (
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMenuOpen(false)
                          }}
                          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                          Sign Out
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <AuthDropdown 
                            user={user}
                            onLogin={handleLogin}
                            onLogout={handleLogout}
                          />
                        </div>
                      )}
                    </ClientOnly>
                  </div>
                </div>
              </div>
            </>
          )}
        </ClientOnly>
      </div>
    </nav>
  )
}
