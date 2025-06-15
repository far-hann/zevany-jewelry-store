'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import OptimizedImage from './OptimizedImage'

// Image component with fallback for missing images
function ImageWithFallback({ src, alt, category, className }: { 
  src: string; 
  alt: string; 
  category: string; 
  className: string; 
}) {
  const [imageError] = useState(false)
  
  const getEmoji = (category: string) => {
    switch (category) {
      case 'Rings': return '💍'
      case 'Necklaces': return '📿'
      case 'Earrings': return '👂'
      case 'Bracelets': return '💫'
      default: return '💎'
    }
  }

  if (imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">{getEmoji(category)}</div>
          <p className="text-sm font-medium">Add {category} Image</p>
          <p className="text-xs mt-1">Place image at:</p>
          <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-1">
            {src}
          </p>
        </div>
      </div>
    )
  }
  // SVGs: never use fill, always use width/height
  if (src.endsWith('.svg')) {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        width={400}
        height={200}
        className={className}
        loading="eager"
        quality={100}
      />
    )
  }
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={className}
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
      loading="lazy"
      quality={85}
    />
  )
}

export function Categories() {  
  const categories = [
    {
      name: 'Rings',
      description: 'Engagement, wedding, and statement rings',
      image: '/images/categories/rings-category.jpg',
      href: '/rings',
      featured: true,
      itemCount: '120+ pieces'
    },
    {
      name: 'Necklaces',
      description: 'Delicate chains and statement pieces',
      image: '/images/categories/necklaces-category.jpg',
      href: '/necklaces',
      featured: false,
      itemCount: '95+ pieces'
    },
    {
      name: 'Earrings',
      description: 'Studs, hoops, and drop earrings',
      image: '/images/categories/earrings-category.jpg',
      href: '/earrings',
      featured: false,
      itemCount: '80+ pieces'
    },
    {
      name: 'Bracelets',
      description: 'Tennis bracelets and charm collections',
      image: '/images/categories/bracelets-category.jpg',
      href: '/bracelets',
      featured: true,
      itemCount: '65+ pieces'
    }
  ]
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 font-serif">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-serif">
            Explore our curated collections of fine jewelry, each piece designed to capture your unique style
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
        </motion.div>{/* Enhanced Category Grid - Single Row Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20 max-w-full overflow-hidden">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 w-full"
            >              <Link href={category.href}>
                <div className="aspect-[3/4] lg:aspect-[3/4] relative">
                  {/* Enhanced gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 group-hover:from-black/80 transition-all duration-300" />                  {/* Category Image */}
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    category={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Enhanced content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 z-20">
                    <div className="transform group-hover:-translate-y-2 transition-transform duration-300">
                      <h3 className="text-lg lg:text-2xl font-semibold text-white mb-1 lg:mb-2 group-hover:text-yellow-300 transition-colors font-serif">
                        {category.name}
                      </h3>
                      <p className="text-gray-200 text-xs lg:text-sm mb-1 lg:mb-2 font-serif hidden sm:block">
                        {category.description}
                      </p>
                      <p className="text-yellow-300 text-xs font-medium mb-2 lg:mb-4 font-serif">
                        {category.itemCount}
                      </p>
                      <span className="inline-flex items-center text-white font-medium group-hover:text-yellow-300 transition-colors text-xs lg:text-sm font-serif">
                        Explore Collection
                        <svg className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute top-2 lg:top-4 right-2 lg:right-4 w-6 h-6 lg:w-8 lg:h-8 border-2 border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>        {/* Enhanced Featured Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-16 mb-20 border border-gray-100"
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 font-serif">
              Featured This Season
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-serif leading-relaxed">
              Discover our handpicked selection of exceptional pieces, carefully chosen to complement any style and celebrate life&apos;s most precious moments
            </p>
            <div className="mt-8 w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">            {/* Enhanced Featured Product Cards */}
            {[
              {
                name: 'Diamond Solitaire Ring',
                price: '$2,299',
                originalPrice: '$2,799',
                image: '/images/jewelry/rings/diamond-solitaire-ring.jpg',
                category: 'Rings',
                link: '/product/1',
                badge: 'Bestseller',
                rating: 5
              },
              {
                name: 'Gold Pearl Necklace',
                price: '$1,899',
                originalPrice: '$2,299',
                image: '/images/jewelry/necklaces/gold-pearl-necklace.jpg',
                category: 'Necklaces',
                link: '/product/5',
                badge: 'New',
                rating: 5
              },
              {
                name: 'Diamond Drop Earrings',
                price: '$1,599',
                originalPrice: '$1,899',
                image: '/images/jewelry/earrings/diamond-drop-earrings.jpg',
                category: 'Earrings',
                link: '/product/7',
                badge: 'Limited',
                rating: 4
              },
              {
                name: 'Tennis Bracelet',
                price: '$2,799',
                originalPrice: '$3,299',
                image: '/images/jewelry/bracelets/tennis-bracelet.jpg',
                category: 'Bracelets',
                link: '/product/9',
                badge: 'Premium',
                rating: 5
              }
            ].map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <Link href={product.link}>
                  {/* Product Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      product.badge === 'Bestseller' ? 'bg-green-100 text-green-800' :
                      product.badge === 'New' ? 'bg-blue-100 text-blue-800' :
                      product.badge === 'Limited' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {product.badge}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-square bg-white rounded-2xl mb-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      category={product.category}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <svg className="h-6 w-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="px-6 pb-8 text-center">
                    <p className="text-sm text-gray-500 font-serif mb-2 uppercase tracking-wider">{product.category}</p>
                    
                    {/* Star Rating */}
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <h4 className="text-xl font-medium text-gray-900 mb-4 font-serif group-hover:text-gray-700 transition-colors leading-tight">
                      {product.name}
                    </h4>
                    
                    {/* Price */}
                    <div className="flex items-center justify-center space-x-3">
                      <p className="text-2xl font-bold text-gray-900 font-serif">{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-lg text-gray-500 line-through font-serif">{product.originalPrice}</p>
                      )}
                    </div>
                    
                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="mt-2">
                        <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                          Save {Math.round((1 - parseFloat(product.price.replace('$', '').replace(',', '')) / parseFloat(product.originalPrice.replace('$', '').replace(',', ''))) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>          
          <div className="text-center mt-16">
            <Link
              href="/collections"
              className="group inline-flex items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white px-10 py-4 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-300 font-medium font-serif text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Products
              <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Enhanced Custom Design Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-200/30 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300/20 rounded-full translate-x-20 translate-y-20"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 font-serif">
              Custom Jewelry Design
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto font-serif">
              Create something uniquely yours. Work with our master craftsmen to design bespoke jewelry that tells your story and celebrates your most precious moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/custom"
                className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium font-serif"
              >
                Start Custom Design
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 font-medium font-serif"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
