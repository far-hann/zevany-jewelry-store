"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react'
import AuthenticatedLink from './AuthenticatedLink'

function BottomNavigation() {
  const pathname = usePathname()
  const navItems = [
    { href: '/', icon: Home, label: 'Home', requiresAuth: false },
    { href: '/search', icon: Search, label: 'Search', requiresAuth: false },
    { href: '/wishlist', icon: Heart, label: 'Wishlist', requiresAuth: true },
    { href: '/cart', icon: ShoppingBag, label: 'Cart', requiresAuth: false },
    { href: '/account', icon: User, label: 'Account', requiresAuth: true },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label, requiresAuth }) => {
          const isActive = pathname === href
          
          if (requiresAuth && (label === 'Wishlist' || label === 'Account')) {
            return (
              <AuthenticatedLink
                key={href}
                href={href}
                featureName={label === 'Wishlist' ? 'wishlist' : 'account'}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                  isActive 
                    ? 'text-gray-900 bg-gray-100' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-gray-900' : ''}`} />
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-gray-900' : ''}`}>
                  {label}
                </span>
              </AuthenticatedLink>
            )
          }
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                isActive 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-gray-900' : ''}`} />
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

export default BottomNavigation
