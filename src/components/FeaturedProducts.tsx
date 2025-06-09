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
    <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-serif text-5xl lg:text-6xl font-light text-gray-900 mb-8 tracking-wide">
            Featured Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Discover our handpicked selection of exceptional jewelry pieces, each crafted with precision and passion to celebrate life&apos;s most precious moments.
          </p>
        </div>

        {/* Enhanced Grid with Luxury Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Enhanced Call-to-Action */}
        <div className="flex flex-col items-center mt-16">
          <p className="text-gray-600 mb-6 text-lg font-light">
            Explore our complete collection of luxury jewelry
          </p>
          <div className="flex gap-4">
            <Link 
              href="/collections"
              className="bg-gray-900 text-white px-8 py-4 hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide"
            >
              View All Collections
            </Link>
            <button className="bg-white border-2 border-gray-900 text-gray-900 px-6 py-4 hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg">
              <svg 
                className="w-6 h-6" 
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
