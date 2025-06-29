import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FadeInView } from './animations/FadeInView';
import { addToWishlist } from '../utils/cartWishlist';
import AuthModal from './AuthModal';

interface ShowcaseProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  isNew?: boolean;
  colors?: string[] | number;
  index?: number;
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
  index = 0,
}: ShowcaseProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  useEffect(() => {
    // Check auth status on component mount
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation(); // Stop event from bubbling up

    if (isAuthenticated) {
      addToWishlist(id);
      toast.success(`${name} added to your wishlist!`);
    } else {
      toast.info('Please log in to save to your wishlist.', {
        action: {
          label: 'Login',
          onClick: () => setIsAuthModalOpen(true),
        },
      });
    }
  };
  
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
    <>
      <FadeInView delay={index * 0.05}>
        <Link href={`/product/${id}`} className="block group text-left">
          <div 
            className="bg-white flex flex-col relative aspect-square"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Product Image */}
            <div className="relative w-full h-0 pb-[100%] bg-gray-100 overflow-hidden">
              {primaryImage ? (
                <Image
                  src={isHovered && secondaryImage ? secondaryImage : primaryImage}
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
              <div 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                onClick={handleWishlistClick}
              >
                <Heart size={20} className="text-gray-600 hover:text-red-500" />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between p-4 showcase-card-info">
              <div className="h-20">
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
      </FadeInView>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="login"
      />
    </>
  );
}
