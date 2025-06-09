'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <span className="text-2xl font-bold tracking-wide">ZEVANY</span>
              <span className="ml-2 text-xs text-gray-400 font-light">JEWELRY</span>
            </Link>            <p className="text-gray-300 mb-6 leading-relaxed">
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
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/collections" className="text-gray-300 hover:text-white transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/rings" className="text-gray-300 hover:text-white transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/necklaces" className="text-gray-300 hover:text-white transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/earrings" className="text-gray-300 hover:text-white transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/bracelets" className="text-gray-300 hover:text-white transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/custom" className="text-gray-300 hover:text-white transition-colors">
                  Custom Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/craftsmanship" className="text-gray-300 hover:text-white transition-colors">
                  Craftsmanship
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-gray-300 hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-white transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact & Support</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="text-gray-300 hover:text-white transition-colors">
                  Jewelry Care
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                hello@zevany.com
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                New York, NY
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Stay in Touch</h4>
              <p className="text-gray-300">Subscribe to receive updates about new collections and exclusive offers.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-none border border-gray-700 focus:outline-none focus:border-yellow-500 flex-1 md:w-64"
              />
              <button className="bg-yellow-600 text-white px-6 py-2 hover:bg-yellow-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 Zevany Jewelry. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
