'use client';

import { motion, useAnimation } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../utils/cartWishlist';

interface LuxuryProductCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: string | number;
  originalPrice?: string | number;
  image: string;
  images?: string[];
  alt?: string;
  category?: string;
  colors?: number | string[] | any;
  isNew?: boolean;
  isBestseller?: boolean;
  specifications?: Record<string, string | undefined>;
  rating?: number;
  reviewCount?: number;
}

export function LuxuryProductCard({ 
  id, 
  name, 
  description,
  price, 
  originalPrice,
  image,
  images = [],
  alt,
  category,
  colors = [],
  isNew = false,
  isBestseller = false,
  specifications = {},
  rating,
  reviewCount
}: LuxuryProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  // All available images (main image + additional images)
  const allImages = [image, ...(images || [])].filter(Boolean);

  // Initialize client state and wishlist status
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsWishlisted(getWishlist().includes(String(id)));
    }
  }, [id]);

  // Auto-cycle through images on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && allImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 800);
    } else {
      setCurrentImageIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
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

    // Animate heart
    controls.start({
      scale: [1, 1.3, 1],
      transition: { duration: 0.3 }
    });
  };

  // Handle quick view (placeholder for future implementation)
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log('Quick view for product:', id);
  };

  // Handle add to cart (placeholder for future implementation)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log('Add to cart for product:', id);
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
  const discountPercentage = hasSale && originalPrice && typeof originalPrice === 'number' && typeof price === 'number' 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3 w-3 ${i <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <Link href={`/product/${id}`} prefetch={true} className="block group text-left cursor-pointer">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-white flex flex-col h-full relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
          {isNew && (
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black text-white text-xs font-medium px-2.5 py-1 uppercase tracking-wide"
            >
              New
            </motion.span>
          )}
          {isBestseller && (
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 uppercase tracking-wide"
            >
              Bestseller
            </motion.span>
          )}
          {hasSale && discountPercentage > 0 && (
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-600 text-white text-xs font-medium px-2.5 py-1 uppercase tracking-wide"
            >
              -{discountPercentage}%
            </motion.span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          {/* Wishlist Heart */}
          {isClient && (
            <motion.button 
              animate={controls}
              onClick={handleToggleWishlist}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Heart className={`h-4 w-4 transition-colors duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-500 hover:text-red-500'}`} />
            </motion.button>
          )}
          
          {/* Quick View - appears on hover */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.8 
            }}
            transition={{ duration: 0.2 }}
            onClick={handleQuickView}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Eye className="h-4 w-4 text-gray-600 hover:text-black transition-colors" />
          </motion.button>
        </div>
        
        {/* Product Image */}
        <div className="relative w-full aspect-square overflow-hidden group">
          <Image
            src={allImages[currentImageIndex]}
            alt={`${name} - Luxury jewelry from ZEVANY${description ? ` - ${description}` : ''}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Image overlay gradient on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
          />
          
          {/* Image indicators */}
          {allImages.length > 1 && isHovered && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick Add to Cart - appears on hover */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={handleAddToCart}
            className="absolute bottom-4 left-4 right-4 bg-black text-white py-2 px-4 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Quick Add
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col text-left">
          {/* Category */}
          {category && (
            <p className="text-xs text-gray-500 font-sans uppercase tracking-wider mb-1">
              {category}
            </p>
          )}
          
          {/* Product Name */}
          <h3 className="text-base text-black font-serif mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {name}
          </h3>
          
          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 font-sans mb-2 line-clamp-2">
              {description}
            </p>
          )}

          {/* Rating */}
          {rating && rating > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {renderStars(rating)}
              </div>
              {reviewCount && (
                <span className="text-xs text-gray-500">({reviewCount})</span>
              )}
            </div>
          )}

          {/* Colors */}
          {Array.isArray(colors) && colors.length > 0 && (
            <div className="flex gap-1 mb-2">
              {colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={`Color option ${index + 1}`}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-xs text-gray-500 ml-1">+{colors.length - 4}</span>
              )}
            </div>
          )}
          
          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-1">
              <p className={`text-base font-sans font-bold ${hasSale ? 'text-red-600' : 'text-gray-900'}`}>
                {formattedPrice}
              </p>
              {hasSale && formattedOriginalPrice && (
                <p className="text-sm text-gray-500 line-through">
                  {formattedOriginalPrice}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 font-sans">MRP (incl. of all taxes)</p>
          </div>
        </div>

        {/* Subtle bottom border accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 origin-left"
        />
      </motion.div>
    </Link>
  );
}

export default LuxuryProductCard;
