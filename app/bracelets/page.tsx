"use client";

import ShowcaseProductCard from '@/components/ShowcaseProductCard';
import { useState, useEffect } from 'react';
import { Product } from '@/types/Product';

export default function Bracelets() {
  const [braceletProducts, setBraceletProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bracelet products from our API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=bracelets');
        if (!response.ok) throw new Error('Failed to fetch bracelet products');
        
        const data = await response.json();
        
        // Ensure each product has the required details property
        const processedProducts = (data.products || []).map((product: any) => {
          const details = product.specifications || {};
          
          return {
            ...product,
            details: {
              material: details.material || product.material || 'Gold',
              gemstone: details.gemstone || product.gemstone || 'Diamond',
              weight: details.weight || product.weight || '0.10 ct',
              dimensions: details.dimensions || product.dimensions || '15mm',
              ...details
            }
          };
        });
        
        setBraceletProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching bracelet products:', error);
        setError('Unable to load bracelets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const parsePrice = (price: string | number): number => {
    if (typeof price === 'number') return price;
    return parseFloat(price.replace(/[^\d.]/g, '')) || 0;
  };

  return (
    <div className="min-h-screen bg-[#f5f3ea]">
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Bracelets
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-montserrat)" }}>
            Elegant bracelets that add sophistication to any outfit. From delicate chains to statement pieces.
          </p>
        </div>

        {/* Products Count */}
        <div className="mb-8">
          <p className="text-sm text-gray-600" style={{ fontFamily: "var(--font-montserrat)" }}>
            {loading ? 'Loading...' : `${braceletProducts.length} Results`}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[4px]">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white h-96 animate-pulse"></div>
              ))
            : braceletProducts.map((product) => (
                <ShowcaseProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={parsePrice(product.price)}
                  image={product.images[0]}
                  images={product.images}
                  isNew={product.isNew}
                  colors={product.colors}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
