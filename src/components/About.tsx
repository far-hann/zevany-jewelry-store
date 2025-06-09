'use client'

import { motion } from 'framer-motion'
import { Award, Users, Gem, Clock } from 'lucide-react'

export function About() {
  const stats = [
    {
      icon: <Award className="h-8 w-8" />,
      number: '50+',
      label: 'Years of Excellence'
    },
    {
      icon: <Users className="h-8 w-8" />,
      number: '10K+',
      label: 'Happy Customers'
    },
    {
      icon: <Gem className="h-8 w-8" />,
      number: '5000+',
      label: 'Unique Pieces'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      number: '24/7',
      label: 'Customer Support'
    }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 font-serif leading-tight">
              Crafting Dreams Into
              <span className="block font-semibold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                Timeless Beauty
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mb-8 rounded-full"></div>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
              At Zevany, we believe that jewelry is more than just an accessory—it&apos;s a celebration of life&apos;s most precious moments. For over five decades, we&apos;ve been crafting exceptional pieces that tell unique stories and create lasting memories.
            </p>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
              Our master craftsmen combine traditional techniques with contemporary design, using only the finest materials to create jewelry that stands the test of time. Every piece is meticulously crafted with passion, precision, and an unwavering commitment to excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-gray-900 text-white px-10 py-4 hover:bg-gray-800 transition-all duration-300 font-medium font-serif text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                Our Story
              </button>
              <button className="border-2 border-gray-900 text-gray-900 px-10 py-4 hover:bg-gray-900 hover:text-white transition-all duration-300 font-medium font-serif text-lg">
                Craftsmanship
              </button>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Enhanced Placeholder for brand image */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-200">
              <div className="text-center text-gray-500 p-8">
                <div className="text-8xl mb-6">✨</div>
                <p className="text-2xl font-serif font-medium mb-4">Brand Heritage</p>
                <p className="text-lg leading-relaxed max-w-sm">Showcase your craftsmanship, workshop, or brand heritage with a stunning image here</p>
              </div>
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-yellow-300 rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full opacity-60"></div>
            <div className="absolute top-1/2 -right-4 w-12 h-12 bg-yellow-300 rounded-full opacity-20"></div>
          </motion.div>
        </div>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-32 pt-20 border-t border-gray-200"
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl font-light text-gray-900 mb-4 font-serif">
              Excellence in Numbers
            </h3>
            <p className="text-xl text-gray-600 font-light">
              A legacy built on trust, quality, and customer satisfaction
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full mb-6 text-yellow-600 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-3 font-serif">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-lg font-serif">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-32 bg-gradient-to-r from-gray-50 to-white rounded-3xl p-12 md:p-20 text-center shadow-xl border border-gray-100"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl text-yellow-500 mb-8 font-serif">&ldquo;</div>
            <p className="text-2xl text-gray-700 mb-10 italic leading-relaxed font-light">
              Zevany created the most beautiful engagement ring for my fiancée. The attention to detail and craftsmanship is absolutely stunning. It&apos;s not just jewelry, it&apos;s a work of art that will be treasured for generations.
            </p>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div className="text-left">
                <div className="text-gray-900 font-semibold text-xl font-serif">Sarah & Michael</div>
                <div className="text-gray-600 font-light">Engaged 2024</div>
              </div>
            </div>
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-6 w-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
