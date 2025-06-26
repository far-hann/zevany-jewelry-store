'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../utils/cartWishlist';

interface ProductCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: string | number;
  originalPrice?: string | number;
  image: string;
  images?: string[];
  alt?: string;
  category?: string;
  isNew?: boolean;
  specifications?: Record<string, string | undefined>;
  animationDelay?: number;
}

const ProductCardV2: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  description,
  price, 
  originalPrice,
  image,
  images = [],
  alt,
  category,
  isNew = false,
  specifications = {},
  animationDelay = 0
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [imageSrc, setImageSrc] = useState(image || '/images/placeholder.jpg');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsWishlisted(getWishlist().includes(String(id)));
    }
  }, [id]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(String(id));
    } else {
      addToWishlist(String(id));
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/images/placeholder.jpg');
    }
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
    if (!isNaN(numericPrice)) {
      return new Intl.NumberFormat('en-IN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericPrice);
    }
    return price;
  };

  const formattedPrice = formatPrice(price);
  const formattedOriginalPrice = originalPrice ? formatPrice(originalPrice) : null;
  const hasSale = originalPrice && originalPrice !== price;

  // Determine material text from specifications or use default
  const materialText = specifications?.material || 'Mixed cuts, Multicolored, Gold-tone plated';
  return (
    <motion.div 
      className="swarovski-card"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.7, 
        delay: animationDelay,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.5 }
      }}
    >
      <Link href={`/product/${id}`} className="block h-full">
        <div className="relative h-full">
          {/* Heart wishlist button */}
          <div className="absolute right-4 top-4 z-10">
            {isClient && (
              <button
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="bg-white rounded-full p-2 shadow-sm hover:shadow transition-all"
              >
                <Heart 
                  size={18} 
                  strokeWidth={1.5}
                  fill={isWishlisted ? "currentColor" : "none"} 
                  className={isWishlisted ? "text-pink-500" : "text-gray-800"}
                />
              </button>
            )}
          </div>          {/* Product image */}
          <div className="relative bg-white mb-4 p-2">
            <div style={{ aspectRatio: '1/1' }} className="relative w-full overflow-hidden flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={name}
                width={280}
                height={280}
                className="object-contain w-full h-full"
                onError={handleImageError}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority
              />
            </div>
          </div>          {/* Product info */}
          <div className="p-3 mt-auto">
            <h3 className="swarovski-product-title text-base font-normal text-gray-900 mb-2">
              {name}
            </h3>
            
            <p className="swarovski-product-subtitle text-sm text-gray-600 mb-3">
              {materialText}
            </p>
            
            <div className="swarovski-price-container">
              <span className="swarovski-current-price">{formattedPrice} ₹</span>
              {hasSale && (
                <span className="swarovski-original-price">{formattedOriginalPrice} ₹</span>
              )}
            </div>
            
            <p className="swarovski-tax-text">
              MRP (incl. of all taxes)
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCardV2;
