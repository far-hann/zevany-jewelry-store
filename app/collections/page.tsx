"use client"

import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

export default function Collections() {
  // Use the correct product IDs for featured products
  const featuredIds = ['1', '7', '10', '6'];
  const featuredProducts = featuredIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[number] => Boolean(p));
  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-6">Complete the Look</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections of fine jewelry, each piece crafted with precision and passion.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-14 px-2 md:px-0">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.images[0]}
              alt={product.name}
              colors={Array.isArray(product.colors) ? product.colors.length : undefined}
            />
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>        </div>
      </div>
    </div>
  )
}
