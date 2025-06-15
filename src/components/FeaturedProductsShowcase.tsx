'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart, Eye, ShoppingBag } from 'lucide-react'

// Dynamically import motion components to prevent SSR issues
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false })

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  discount?: number
}

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Diamond Solitaire Ring',
    price: 2499,
    image: '/images/jewelry/rings/diamond-solitaire-ring.jpg',
    category: 'Rings',
    isNew: true
  },
  {
    id: '2',
    name: 'Gold Pearl Necklace',
    price: 1899,
    image: '/images/jewelry/necklaces/gold-pearl-necklace.jpg',
    category: 'Necklaces',
    discount: 15
  },
  {
    id: '3',
    name: 'Diamond Drop Earrings',
    price: 1299,
    image: '/images/jewelry/earrings/diamond-drop-earrings.jpg',
    category: 'Earrings'
  },
  {
    id: '4',
    name: 'Tennis Bracelet',
    price: 899,
    image: '/images/jewelry/bracelets/tennis-bracelet.jpg',
    category: 'Bracelets',
    isNew: true
  },
  {
    id: '5',
    name: 'Vintage Emerald Ring',
    price: 3299,
    image: '/images/jewelry/rings/vintage-emerald-ring.jpg',
    category: 'Rings',
    discount: 10
  },
  {
    id: '6',
    name: 'Gold Hoop Earrings',
    price: 599,
    image: '/images/jewelry/earrings/gold-hoops.jpg',
    category: 'Earrings'
  },
  {
    id: '7',
    name: 'Charm Bracelet',
    price: 749,
    image: '/images/jewelry/bracelets/charm-bracelet.jpg',
    category: 'Bracelets'
  },
  {
    id: '8',
    name: 'Pearl Stud Earrings',
    price: 449,
    image: '/images/jewelry/earrings/pearl-studs.jpg',
    category: 'Earrings',
    isNew: true
  }
]

export default function FeaturedProductsShowcase() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-100 to-transparent rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-100 to-transparent rounded-full opacity-15 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        {isVisible && typeof window !== 'undefined' ? (
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Discover our handpicked selection of extraordinary pieces, each crafted with meticulous attention to detail
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
            </div>
          </MotionDiv>
        ) : (
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Discover our handpicked selection of extraordinary pieces, each crafted with meticulous attention to detail
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <div key={product.id}>
              {isVisible && typeof window !== 'undefined' ? (
                <MotionDiv
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut", 
                    delay: index * 0.1 
                  }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  onHoverStart={() => setHoveredProduct(product.id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                >                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          New
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-black/20 flex items-center justify-center"
                    >
                      <div className="flex space-x-3">
                        <button className="bg-white text-gray-800 p-3 rounded-full hover:bg-amber-500 hover:text-white transition-colors duration-300 shadow-lg">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="bg-white text-gray-800 p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300 shadow-lg">
                          <Heart className="h-5 w-5" />
                        </button>
                        <button className="bg-white text-gray-800 p-3 rounded-full hover:bg-green-500 hover:text-white transition-colors duration-300 shadow-lg">
                          <ShoppingBag className="h-5 w-5" />
                        </button>
                      </div>
                    </MotionDiv>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-amber-700 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline">
                        {product.discount ? (
                          <>
                            <span className="text-xl font-semibold text-gray-900">
                              ${Math.round(product.price * (1 - product.discount / 100))}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-semibold text-gray-900">
                            ${product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ) : (
                // Static version for SSR
                <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden">                  <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          New
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline">
                        {product.discount ? (
                          <>
                            <span className="text-xl font-semibold text-gray-900">
                              ${Math.round(product.price * (1 - product.discount / 100))}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-semibold text-gray-900">
                            ${product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        {isVisible && typeof window !== 'undefined' ? (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Link
              href="/collections"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-full hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>View All Collections</span>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </MotionDiv>
        ) : (
          <div className="text-center">
            <Link
              href="/collections"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-full shadow-lg"
            >
              <span>View All Collections</span>
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
