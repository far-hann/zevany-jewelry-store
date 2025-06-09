'use client'

import React from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'

const featuredProducts = [
  {
    id: '1',
    name: 'Diamond Solitaire Ring',
    description: 'Cushion cut, Multicolored...',
    price: '$2,299',
    image: '/images/jewelry/rings/diamond-solitaire-ring.jpg',
    alt: 'Diamond Solitaire Ring',
    colors: 3
  },
  {
    id: '2',
    name: 'Gold Pearl Necklace',
    description: 'Classic cut, Pearl...',
    price: '$899',
    image: '/images/jewelry/necklaces/gold-pearl-necklace.jpg',
    alt: 'Gold Pearl Necklace',
    colors: 2
  },
  {
    id: '3',
    name: 'Diamond Drop Earrings',
    description: 'Elegant cut, Diamond...',
    price: '$1,599',
    image: '/images/jewelry/earrings/diamond-drop-earrings.jpg',
    alt: 'Diamond Drop Earrings',
    colors: 4
  },
  {
    id: '4',
    name: 'Tennis Bracelet',
    description: 'Diamond cut, Crystal...',
    price: '$3,500',
    image: '/images/jewelry/bracelets/tennis-bracelet.jpg',
    alt: 'Tennis Bracelet',
    colors: 3
  }
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-4 sm:mb-6 lg:mb-8 tracking-wide">
            Featured Collection
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed px-4">
            Discover our handpicked selection of exceptional jewelry pieces, each crafted with precision and passion to celebrate life&apos;s most precious moments.
          </p>
        </div>

        {/* Enhanced Grid with Responsive Spacing */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Enhanced Call-to-Action */}
        <div className="flex flex-col items-center mt-12 sm:mt-16">
          <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg font-light text-center px-4">
            Explore our complete collection of luxury jewelry
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link 
              href="/collections"
              className="bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide text-center text-sm sm:text-base"
            >
              View All Collections
            </Link>
            <button className="bg-white border-2 border-gray-900 text-gray-900 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg flex items-center justify-center">
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
