import { Heart, ShoppingBag, Eye } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../utils/cartWishlist'

interface ProductCardProps {
  id: string | number
  name: string
  description?: string
  price: string | number
  image: string
  alt?: string
  category?: string
  colors?: number
  isNew?: boolean
  delay?: number
  specifications?: Record<string, string | undefined>
}

export function SimpleProductCard({ 
  id, 
  name, 
  description,
  price, 
  image, 
  alt,
  category,
  colors,
  isNew = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window !== 'undefined') {
      return getWishlist().includes(String(id));
    }
    return false;
  });

  const router = useRouter()
  
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/product/${id}`)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(String(id))
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(String(id))
    } else {
      addToWishlist(String(id))
    }
    setIsWishlisted(!isWishlisted)
  }

  const formatPrice = (price: string | number) => {
    if (typeof price === 'string') return price
    return `₹${price.toLocaleString()}`
  }

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-2xl">
        <Image
          src={image}
          alt={alt || name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
        />

        {/* Colors indicator */}
        {colors && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <span className="text-xs text-gray-700 font-semibold">{colors} Colors</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 left-3 p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg z-10"
        >
          <Heart 
            className={`h-4 w-4 transition-colors duration-200 ${
              isWishlisted 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>

        {/* Simple overlay with actions on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200">
            <div className="flex space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/product/${id}`)
                }}
                className="p-3 bg-white/90 rounded-full text-gray-900 hover:bg-white transition-colors duration-200"
              >
                <Eye className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleAddToCart}
                className="p-3 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-3 right-3 bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            NEW
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        {category && (
          <p className="text-sm text-amber-600 font-medium mb-2 uppercase tracking-wide">
            {category}
          </p>
        )}
        
        <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-200 font-serif">
          {name}
        </h3>

        {description && (
          <p className="text-gray-600 text-sm mb-3 leading-relaxed font-light">
            {description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold text-gray-900 font-serif">
              {formatPrice(price)}
            </span>
            <div className="text-xs text-gray-500 mt-1 font-light tracking-wide">
              MRP (incl. of all taxes)
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-amber-600 transition-colors duration-200 flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimpleProductCard
