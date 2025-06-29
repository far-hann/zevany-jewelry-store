'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ProductSkeletonV2 from '@/components/ProductSkeletonV2'
import ShowcaseProductCard from '@/components/ShowcaseProductCard'
import SpringSummerBanner from '@/components/SpringSummerBanner'
import { Product } from '@/types/Product'

export default function Home() {
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
      const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        if (response.ok) {
          const data = await response.json();
          const products = data.products || [];
          // Shuffle the products
          const shuffled = [...products].sort(() => Math.random() - 0.5);
          setShuffledProducts(shuffled);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const parsePrice = (price: string | number): number => {
    if (!price) return 0;
    if (typeof price === 'number') return price;
    // Handle any price format by removing all non-numeric characters except the decimal point
    return parseFloat(price.replace(/[^0-9.]/g, ''));
  };

  return (
    <div className="bg-white">
      {/* Hero Section with ZEVANY Text Animation - Full Page Height */}
      <section className="relative h-screen bg-white flex items-center justify-center">
        <div className="zevany-hero-text">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-light tracking-wider text-gray-900 leading-none cursor-default"
            style={{ fontFamily: "var(--font-cormorant)", letterSpacing: "0.1em", fontWeight: "300", lineHeight: "1.1" }}
          >
            ZEVANY
          </motion.h1>
        </div>
      </section>

      {/* Section: Product Showcase, beige background restored */}
      <section className="py-12 bg-[#f5f3ea]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <ProductSkeletonV2 key={index} />
              ))
            ) : (
              <>
                {/* First 4 products */}
                {shuffledProducts.slice(0, 4).map((product, index) => (
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
                    index={index}
                  />
                ))}
                
                {/* Spring-Summer Banner */}
                <div className="col-span-2 md:col-span-2 lg:col-span-2">
                  <SpringSummerBanner imagePath="/images/banners/pixelperfect.png" />
                </div>
                
                {/* Remaining products */}
                {shuffledProducts.slice(4).map((product, index) => (
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
                    index={index + 4}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
