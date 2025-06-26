import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  image: string
  alt?: string
  category?: string
  colors?: number | string[] | any
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
  const [isClient, setIsClient] = useState(false);

  const router = useRouter()
  
  // Initialize client state and wishlist status
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsWishlisted(getWishlist().includes(String(id)));
    }
  }, [id]);
    const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use Next.js router for navigation with better page transitions
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
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
    if (!isNaN(numericPrice)) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(numericPrice);
    }
    return price;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="group relative bg-white overflow-hidden cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
      data-product-id={id}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-white">
        <Image
          src={image}
          alt={alt || name}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
          loading="lazy"
        />
        <div className="absolute top-3 left-3 z-10">
          {isNew && (
            <span className="bg-white text-gray-800 text-xs font-normal px-2.5 py-1 shadow">
              New
            </span>
          )}
        </div>
        {isClient && (
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 z-10 p-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
          </button>
        )}
      </div>

      <div className="p-4 text-left flex-grow flex flex-col">
        <h3 className="text-base text-black font-serif mb-1 truncate">{name}</h3>
        {description && <p className="text-xs text-gray-500 font-sans mb-2 truncate">{description}</p>}
        <div className="mt-auto">
          <p className="text-sm text-black font-sans font-semibold">{formatPrice(price)}</p>
          <p className="text-xs text-gray-500 font-sans mt-1">MRP (incl. of all taxes)</p>
        </div>
      </div>
    </motion.div>
  );
}

export default SimpleProductCard;
