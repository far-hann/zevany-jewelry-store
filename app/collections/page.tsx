"use client"

import { SwarovskiStyleProductCard } from '@/src/components/SwarovskiStyleProductCard'
import { useState, useEffect } from 'react'
import { Product } from '@/types/Product'

export default function Collections() {
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch collection products from our API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/test-supabase');
        if (!response.ok) throw new Error('Failed to fetch collection products');
        
        const data = await response.json();
        console.log('Supabase test data:', data);
        setCollectionProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching collection products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-6">Complete the Look</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections of fine jewelry, each piece crafted with precision and passion.
          </p>
        </div>        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
          {loading ? (
            <div className="col-span-4 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading collections...</p>
            </div>          
          ) : collectionProducts.length > 0 ? (            
            collectionProducts.map((product) => {
              // Calculate original price (25% higher than current price for discount effect)
              const currentPrice = typeof product.price === 'string' ? 
                parseFloat(product.price.replace(/[^\d.-]/g, '')) : 
                product.price;
              const originalPrice = currentPrice * 1.25;
              
              return (                <SwarovskiStyleProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={currentPrice}
                  originalPrice={originalPrice}
                  image={product.image || (product.images && product.images[0]) || '/images/placeholder.jpg'}
                  alt={product.name}
                  isNew={product.isNew}
                />
              )
            })
          ) : (
            <div className="col-span-4 py-12 text-center">
              <p className="text-gray-600">No collection products found. Check back soon!</p>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-8">
          <button className="bg-black text-white p-3 rounded-lg hover:bg-gray-800">
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
