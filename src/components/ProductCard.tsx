'use client'

import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../utils/cartWishlist'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: string
  image: string
  alt: string
  colors?: number
}

export function ProductCard({ 
  id, 
  name, 
  description, 
  price, 
  image, 
  alt, 
  colors 
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window !== 'undefined') {
      return getWishlist().includes(id);
    }
    return false;
  });

  const router = useRouter()
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/product/${id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      router.push(`/product/${id}`)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(id)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(id)
    } else {
      addToWishlist(id)
    }
    setIsWishlisted(!isWishlisted)
  }
  return (
    <div
      className="bg-white rounded-xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Colors indicator */}
        {colors && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
            <span className="text-xs text-gray-700 font-semibold">{colors} Colors</span>
          </div>
        )}

        {/* Wishlist button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-4 left-4 p-3 bg-white bg-opacity-95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 group/heart shadow-lg"
        >
          <Heart 
            className={`h-5 w-5 transition-colors duration-200 ${
              isWishlisted 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600 group-hover/heart:text-red-500'
            }`} 
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-8 text-center bg-white">
        <h3 className="font-serif font-light text-gray-900 mb-3 text-xl tracking-wide group-hover:text-gray-700 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed font-light">
          {description}
        </p>
        <div className="mb-6">
          <span className="text-2xl font-bold text-gray-900 font-serif">
            {price}
          </span>
          <div className="text-xs text-gray-500 mt-2 font-light tracking-wide">
            MRP (incl. of all taxes)
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-gray-900 text-white py-4 px-6 hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 font-medium tracking-wide group/btn rounded-lg shadow-md"
        >
          <ShoppingBag className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
