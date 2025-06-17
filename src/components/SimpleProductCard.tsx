import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../utils/cartWishlist'
import ClientOnly from './ClientOnly'

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
  const [isWishlisted, setIsWishlisted] = useState(false);

  const router = useRouter()
    // Initialize wishlist status on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsWishlisted(getWishlist().includes(String(id)));
    }
  }, [id]);
    const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/product/${id}`);
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
  return (      <div
      className="group relative bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:border-amber-200 hover:bg-gradient-to-br hover:from-white hover:to-amber-50/30"
      onClick={handleCardClick}
    >      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-2xl group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-amber-100/50 transition-all duration-500">
        <Image
          src={image}
          alt={alt || name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
        />{/* Colors indicator */}
        {colors && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <span className="text-xs text-gray-700 font-semibold">{colors} Colors</span>
          </div>
        )}

        {/* New Badge - positioned below colors if both exist */}
        {isNew && (
          <div className={`absolute ${colors ? 'top-12' : 'top-3'} right-3 bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded-full`}>
            NEW
          </div>
        )}        {/* Wishlist button */}
        <ClientOnly>
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 left-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg z-10 hover:bg-white active:scale-95 hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
            aria-label="Add to wishlist"
          >
            <Heart 
              className={`h-5 w-5 transition-all duration-300 ${
                isWishlisted 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 group-hover:text-amber-600'
              }`}
            />
          </button>        </ClientOnly>
      </div>      {/* Product Info */}
      <div className="p-6 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-amber-50/20">
        {category && (
          <p className="text-sm text-amber-600 font-medium mb-2 uppercase tracking-wide transition-all duration-300 group-hover:text-amber-700 group-hover:font-semibold">
            {category}
          </p>
        )}
          <h3 className="text-lg font-medium text-gray-900 mb-3 font-serif transition-all duration-300 group-hover:text-gray-800 group-hover:font-semibold">
          {name}
        </h3>

        {description && (
          <p className="text-gray-600 text-sm mb-3 leading-relaxed font-light transition-all duration-300 group-hover:text-gray-700">
            {description}
          </p>
        )}        <div className="text-center">
          <div>
            <span className="text-xl font-semibold text-gray-900 font-serif transition-all duration-300 group-hover:text-amber-800 group-hover:font-bold">
              {formatPrice(price)}
            </span>
            <div className="text-xs text-gray-500 mt-1 font-light tracking-wide transition-all duration-300 group-hover:text-gray-600">              MRP (incl. of all taxes)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleProductCard
