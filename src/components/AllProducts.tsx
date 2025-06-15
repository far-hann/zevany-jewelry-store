// src/components/AllProducts.tsx
'use client'

import ProductCard from './ProductCard'
import { products } from '@/data/products'

export default function AllProducts() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-4 sm:mb-6 lg:mb-8 tracking-wide">
            Shop All Products
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed px-4">
            Explore our full range of luxury jewelry, crafted with precision and passion for every occasion.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
          {products.map((product) => (
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
      </div>
    </section>
  )
}
