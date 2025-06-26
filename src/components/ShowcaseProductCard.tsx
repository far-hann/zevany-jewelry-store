import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ShowcaseProductCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  isNew?: boolean;
  colors?: string[] | number;
}

export default function ShowcaseProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  images = [],
  isNew = false,
  colors,
}: ShowcaseProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const primaryImage = images && images.length > 0 ? images[0] : image;
  const secondaryImage = images && images.length > 1 ? images[1] : null;

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formattedPrice = formatPrice(price);

  return (
    <Link href={`/product/${id}`} className="block group text-left animate-fade-in-up">
      <div 
        className="bg-white flex flex-col relative aspect-square"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative w-full h-0 pb-[100%] bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* NEW Badge */}
          {isNew && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
              NEW
            </div>
          )}
          
          {/* Wishlist Heart */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Heart size={20} className="text-gray-600 hover:text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between p-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2" style={{ fontFamily: "inherit" }}>
              {name}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mb-2 line-clamp-2" style={{ fontFamily: "inherit" }}>
                {description}
              </p>
            )}
          </div>
          
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: "inherit" }}>
                {formattedPrice}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "inherit" }}>incl. of all taxes</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
