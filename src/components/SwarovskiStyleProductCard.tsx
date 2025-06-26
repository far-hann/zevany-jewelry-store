import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../utils/cartWishlist';

interface ProductCardProps {
  id: string | number
  name: string
  description?: string
  price: string | number
  originalPrice?: string | number
  image: string
  alt?: string
  category?: string
  colors?: number | string[] | any
  isNew?: boolean
  specifications?: Record<string, string | undefined>
}

export function SwarovskiStyleProductCard({ 
  id, 
  name, 
  description,
  price, 
  originalPrice,
  image, 
  alt,
  category,
  colors = [],
  isNew = false,
  specifications = {}
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isClient, setIsClient] = useState(false);
    // Initialize client state and wishlist status
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsWishlisted(getWishlist().includes(String(id)));
    }  }, [id]);
  
  // Handle wishlist toggle
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(String(id));
    } else {
      addToWishlist(String(id));
    }    setIsWishlisted(!isWishlisted);
  }
  
  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
    if (!isNaN(numericPrice)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(numericPrice);
    }
    return price;
  };

  const formattedPrice = formatPrice(price);
  const formattedOriginalPrice = originalPrice ? formatPrice(originalPrice) : null;
  const hasSale = originalPrice && originalPrice !== price;

  return (
    <Link href={`/product/${id}`} prefetch={true} className="block group text-left cursor-pointer">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="bg-white flex flex-col h-full relative"      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10">
          {isNew && (
            <span className="bg-white text-gray-800 text-xs font-normal px-2.5 py-1 shadow">
              New
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        {isClient && (
          <button 
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-500 group-hover:text-red-500 group-hover:fill-current'}`} />
          </button>
        )}
        
        {/* Product Image */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={image}
            alt={`${name} - Luxury jewelry from ZEVANY${description ? ` - ${description}` : ''}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col text-left">
          <h3 className="text-base text-black font-serif mb-1 truncate">{name}</h3>
          {description && <p className="text-xs text-gray-500 font-sans mb-2 truncate">{description}</p>}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <p className={`text-sm font-sans font-semibold ${hasSale ? 'text-red-600' : 'text-gray-900'}`}>
                {formattedPrice}
              </p>
              {hasSale && formattedOriginalPrice && (
                <p className="text-sm text-gray-500 line-through">
                  {formattedOriginalPrice}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 font-sans mt-1">MRP (incl. of all taxes)</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default SwarovskiStyleProductCard;
