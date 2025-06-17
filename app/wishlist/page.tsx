'use client'

import { useState, useEffect } from 'react'
import { Heart, X, Eye } from 'lucide-react'
import { products } from '@/data/products'
import { getWishlist, removeFromWishlist } from '@/utils/cartWishlist'
import Link from 'next/link'
import Image from 'next/image'

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([])

  useEffect(() => {
    setWishlistItems(getWishlist())
  }, [])
  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId)
    setWishlistItems(getWishlist())
    window.dispatchEvent(new Event('cartWishlistUpdate'))
  }

  const wishlistProducts = products.filter(product => wishlistItems.includes(product.id))
  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 font-serif">My Wishlist</h1>
          </div>
          <p className="text-xl text-gray-600 font-serif">
            Your favorite jewelry pieces saved for later
          </p>
        </div>
        
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2 font-serif">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 font-serif">Save your favorite pieces for later</p>
            <Link 
              href="/collections" 
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-serif"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>                <div className="p-6">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700 font-serif mb-2">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 font-serif mb-2">{product.collection}</p>
                  <p className="text-lg font-medium text-gray-900 mb-4 font-serif">{product.price}</p>
                  <Link
                    href={`/product/${product.id}`}
                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 font-serif"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </Link>
                </div></div>
            ))}
          </div>        )}      </div>
    </div>
  )
}
