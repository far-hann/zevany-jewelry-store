import Link from 'next/link'
import { ShoppingBag, Heart, Menu } from 'lucide-react'

export function SimpleNavbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ZEVANY
            </Link>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex space-x-8">
            <Link href="/rings" className="text-gray-700 hover:text-gray-900 transition-colors">
              Rings
            </Link>
            <Link href="/necklaces" className="text-gray-700 hover:text-gray-900 transition-colors">
              Necklaces
            </Link>
            <Link href="/earrings" className="text-gray-700 hover:text-gray-900 transition-colors">
              Earrings
            </Link>
            <Link href="/bracelets" className="text-gray-700 hover:text-gray-900 transition-colors">
              Bracelets
            </Link>
            <Link href="/collections" className="text-gray-700 hover:text-gray-900 transition-colors">
              Collections
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link href="/wishlist" className="text-gray-700 hover:text-gray-900 transition-colors">
              <Heart className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-gray-900 transition-colors">
              <ShoppingBag className="h-6 w-6" />
            </Link>
            <button className="md:hidden text-gray-700 hover:text-gray-900 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
