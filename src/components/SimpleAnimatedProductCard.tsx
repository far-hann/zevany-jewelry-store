'use client';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // All available images (main image + additional images)
  const allImages = [image, ...(images || [])].filter(Boolean);

  // Initialize client state and wishlist status
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsWishlisted(getWishlist().includes(String(id)));
    }
  }, [id]);
  // Auto-cycle through images on hover - only show second image
  useEffect(() => {
    if (isHovered && allImages.length > 1) {
      // Show second image immediately on hover
      setCurrentImageIndex(1);
    } else {
      // Return to first image when not hovering
      setCurrentImageIndex(0);
    }
  }, [isHovered, allImages.length]);

  // Handle wishlist toggle
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
    <Link href={`/product/${id}`} prefetch={true} className="block group text-left cursor-pointer swarovski-card">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.7,
          ease: 'easeOut',
          delay: animationDelay,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-white flex flex-col h-full relative overflow-hidden"
      >
        {/* Only wishlist heart - no other buttons */}
        <div className="absolute top-3 right-3 z-20">
          {isClient && (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleWishlist}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Heart className={`h-4 w-4 transition-colors duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-500 hover:text-red-500'}`} />
            </motion.button>
          )}
        </div>

        {/* Product Image with smooth transition to second image on hover */}
        <div className="relative w-full product-image-aspect overflow-hidden group">
          <Image
            src={allImages[currentImageIndex]}
            alt={`${name} - Luxury jewelry from ZEVANY${description ? ` - ${description}` : ''}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-all duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.jpg';
            }}
          />
        </div>

        {/* Simplified product info */}
        <div className="p-4 flex-grow flex flex-col text-left">
          {/* Category */}
          {isNew && (
            <p className="text-xs text-gray-500 font-sans uppercase tracking-wider mb-2">
              New
            </p>
          )}

          {/* Product Name with animation */}
          <h3 className="product-name">
            {name}
          </h3>

          {/* Price Section with animation */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <p className="product-price">
                {formattedPrice}
              </p>
              {hasSale && formattedOriginalPrice && (
                <p className="text-xs text-gray-500 line-through">
                  {formattedOriginalPrice}
                </p>
              )}
            </div>
            <p className="mrp-text">MRP (incl. of all taxes)</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default SimpleAnimatedProductCard;
