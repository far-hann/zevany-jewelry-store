// src/components/AllProducts.tsx
'use client'

import { SimpleProductCard } from './SimpleProductCard'
import { useState, useEffect } from 'react'
import { ClientProduct, safeProductId, safeProductName, safeProductPrice, safeProductImage } from '@/types/clientTypes'

export default function AllProducts() {
  const [allProducts, setAllProducts] = useState<ClientProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch all products from our API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching all products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-4 sm:mb-6 lg:mb-8 tracking-wide">
            Shop All Products
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed px-4">
            Explore our full range of luxury jewelry, crafted with precision and passion for every occasion.
          </p>
        </div>        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {loading ? (
            <div className="col-span-4 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : allProducts.length > 0 ? (            allProducts.map((product) => (
              <SimpleProductCard
                key={safeProductId(product)}
                id={safeProductId(product)}
                name={safeProductName(product)}
                description={product.description}
                price={safeProductPrice(product)}
                image={safeProductImage(product)}
                alt={safeProductName(product)}
                colors={Array.isArray(product.colors) ? product.colors.length : undefined}
              />
            ))
          ) : (
            <div className="col-span-4 py-12 text-center">
              <p className="text-gray-600">No products found. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
