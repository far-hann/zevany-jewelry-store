'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl font-bold tracking-wide">ZEVANY</span>
              <span className="ml-2 text-xs text-gray-400 font-light">JEWELRY</span>
            </Link>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Crafting exceptional jewelry for life&apos;s most precious moments. 
              Experience luxury, quality, and timeless elegance with every piece.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>          {/* Shop Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Shop</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/collections" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/rings" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/necklaces" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/earrings" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/bracelets" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/custom" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Custom Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/craftsmanship" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Craftsmanship
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Contact & Support</h3>
            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Jewelry Care
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  FAQ
                </Link>
              </li>
            </ul>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="break-all">hello@zevany.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                New York, NY
              </div>
            </div>
          </div>
        </div>        {/* Newsletter Section */}
        <div className="border-t border-gray-800 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="mb-4 lg:mb-0">
              <h4 className="text-base sm:text-lg font-semibold mb-2">Stay in Touch</h4>
              <p className="text-gray-300 text-sm sm:text-base">Subscribe to receive updates about new collections and exclusive offers.</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 sm:rounded-l-md border border-gray-700 focus:outline-none focus:border-yellow-500 w-full sm:w-64 text-sm sm:text-base"
              />
              <button className="bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:rounded-r-md hover:bg-yellow-700 transition-colors font-medium text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2025 Zevany Jewelry. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-center">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
