import { motion } from 'framer-motion'
import { Heart, Eye } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
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

export function InteractiveProductCard({ 
  id, 
  name, 
  description,
  price, 
  image, 
  alt,
  category,
  colors,
  isNew = false,
  delay = 0 
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer will-change-transform"
      style={{ transform: 'translateZ(0)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-2xl">        <motion.div
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="w-full h-full will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        >
          <Image
            src={image}
            alt={alt || name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            loading="lazy"
          />
        </motion.div>

        {/* Colors indicator */}
        {colors && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 500 }}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg"
          >
            <span className="text-xs text-gray-700 font-semibold">{colors} Colors</span>
          </motion.div>
        )}

        {/* Wishlist button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: "spring", stiffness: 500 }}
          onClick={handleToggleWishlist}
          className="absolute top-3 left-3 p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg z-10"
        >
          <Heart 
            className={`h-4 w-4 transition-colors duration-200 ${
              isWishlisted 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </motion.button>        {/* Overlay with view action on hover */}        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/30 flex items-center justify-center will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.15 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/product/${id}`)
            }}
            className="p-3 bg-white/90 rounded-full text-gray-900 hover:bg-white transition-colors will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          >
            <Eye className="h-5 w-5" />
          </motion.button>
        </motion.div>

        {/* New Badge */}
        {isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring", stiffness: 500 }}
            className="absolute top-3 right-3 bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded-full"
          >
            NEW
          </motion.div>
        )}
      </div>      {/* Product Info */}
      <div className="p-6">
        {category && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="text-sm text-amber-600 font-medium mb-2 uppercase tracking-wide"
          >
            {category}
          </motion.p>
        )}
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="text-lg font-medium text-gray-900 mb-3 group-hover:text-amber-600 transition-colors font-serif"
        >
          {name}
        </motion.h3>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.35 }}
            className="text-gray-600 text-sm mb-3 leading-relaxed font-light"
          >
            {description}
          </motion.p>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className="flex items-center justify-between"
        >
          <div>            <span className="text-xl font-semibold text-gray-900 font-serif">
              {formatPrice(price)}
            </span>
            <div className="text-xs text-gray-500 mt-1 font-light tracking-wide">
              MRP (incl. of all taxes)
            </div>
          </div>
        </motion.div>
      </div>{/* Subtle shine effect on hover */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: isHovered ? '100%' : '-100%', opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
        style={{ pointerEvents: 'none' }}
      />
    </motion.div>
  )
}

export default InteractiveProductCard
