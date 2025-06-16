"use client"

import ProductCard from '@/components/SimpleProductCard'
import { products } from '@/data/products'

export default function Earrings() {
  // Filter only earring products by checking the image path
  const earringProducts = products.filter(p => p.images[0]?.includes('/earrings/'));
  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-light text-gray-900 mb-6 tracking-wide">Complete the Look</h1>        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-14 px-2 md:px-0">
          {earringProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.images[0]}
              alt={product.name}              colors={Array.isArray(product.colors) ? product.colors.length : undefined}
            />
          ))}
        </div>
        {/* Navigation Arrow */}
        <div className="flex justify-end mt-8">
          <button className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>          </button>
        </div>
      </div>
    </div>
  )
}
