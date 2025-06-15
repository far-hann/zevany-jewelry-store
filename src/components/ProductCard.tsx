'use client'

import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  specifications?: Record<string, string | undefined>
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
      className="bg-white rounded-xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100 w-full max-w-full"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden w-full">        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
        />

        {/* Colors indicator */}
        {colors && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white bg-opacity-95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-lg">
            <span className="text-xs text-gray-700 font-semibold">{colors} Colors</span>
          </div>
        )}

        {/* Wishlist button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-2 sm:top-4 left-2 sm:left-4 p-2 sm:p-3 bg-white bg-opacity-95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 group/heart shadow-lg"
        >
          <Heart 
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
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
      <div className="p-4 sm:p-6 lg:p-8 text-center bg-white w-full max-w-full overflow-hidden">
        <h3 className="font-serif font-light text-gray-900 mb-2 sm:mb-3 text-lg sm:text-xl tracking-wide group-hover:text-gray-700 transition-colors break-words">
          {name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed font-light break-words">
          {description}
        </p>
        <div className="mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
            {price}
          </span>
          <div className="text-xs text-gray-500 mt-1 sm:mt-2 font-light tracking-wide">
            MRP (incl. of all taxes)
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-gray-900 text-white py-3 sm:py-4 px-4 sm:px-6 hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 font-medium tracking-wide group/btn rounded-lg shadow-md text-sm sm:text-base"
        >
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:scale-110 transition-transform" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
