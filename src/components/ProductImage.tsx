'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  id: string | number;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, id }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      console.warn(`Image failed to load for product ${id}. Falling back to placeholder.`);
      setImageSrc('/images/placeholder.jpg');
    }
  };  return (
    <div className="relative overflow-hidden bg-white" style={{
      paddingBottom: '100%', /* Creates a perfect square */
      height: 0,
    }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          key={imageSrc} // Re-render if src changes
          src={imageSrc}
          alt={alt}
          width={280}
          height={280}
          className="object-contain max-w-full max-h-full"
          onError={handleError}
          unoptimized={process.env.NODE_ENV === 'development'} // Helps with local image loading issues
        />
      </div>
    </div>
  );
};

export default ProductImage;
