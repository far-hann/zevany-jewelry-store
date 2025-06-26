
import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 overflow-hidden animate-pulse">
      {/* Match the aspect ratio of ProductImage component */}
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0 bg-gray-200"></div>
      </div>
      <div className="p-3 mt-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
