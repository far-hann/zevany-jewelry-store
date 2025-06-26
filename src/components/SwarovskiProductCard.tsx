'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductImage from './ProductImage'; // Import the new component
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../utils/cartWishlist';

interface SimpleAnimatedProductCardProps {
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

export function SimpleAnimatedProductCard({ 
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
}: SimpleAnimatedProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const allImages = [image, ...(images || [])].filter(Boolean);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease: [0.33, 1, 0.68, 1],
        delay: animationDelay,
      }}
      className="swarovski-product-card group"
    >
      <Link href={`/product/${id}`} prefetch={true} className="block">
        <div className="relative">          {/* Wishlist Heart */}
          <div className="absolute top-4 right-4 z-20">
            {isClient && (
              <button 
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`heart-button p-1.5 rounded-full transition-colors duration-300 ease-in-out 
                  ${isWishlisted ? 'bg-pink-50 text-pink-500' : 'bg-white text-gray-700 shadow-sm'}`}>
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          {/* Product Image */}
          <ProductImage src={image} alt={name} id={id} />

          {isNew && (
            <div className="absolute top-3 left-3 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full z-10">
              New
            </div>
          )}          {/* Product Info */}
          <div className="pt-3 pb-2 px-3 mt-2">
            {/* Product Name */}
            <h3 className="product-name">
              {name}
            </h3>
            
            {/* Description */}
            <p className="product-description">
              {specifications?.material || 'Mixed cuts, Multicolored, Gold-tone plated'}
            </p>
            
            {/* Price */}
            <div className="product-price">
              <span>
                {formattedPrice} ₹
              </span>
              {hasSale && formattedOriginalPrice && (
                <span className="original-price">
                  {formattedOriginalPrice} ₹
                </span>
              )}
            </div>
            
            {/* MRP Text */}
            <p className="mrp-text">MRP (incl. of all taxes)</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default SimpleAnimatedProductCard;
