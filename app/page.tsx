'use client'

import { Crown, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-amber-100 to-transparent rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-blue-100 to-transparent rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-100 to-transparent rounded-full opacity-10 blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center max-w-4xl mx-auto px-4">          {/* Crown Icon with Matched Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <Crown className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-amber-600" />
          </motion.div>{/* Animated ZEVANY Text with Individual Letter Hover */}
          <motion.h1
            initial={{ opacity: 0, y: -100 }}
            animate={{ 
              opacity: 1, 
              y: 0,
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut",
              type: "spring",
              stiffness: 80,
              delay: 0.5
            }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-gray-900 tracking-[0.2em] sm:tracking-[0.3em] select-none mb-6"
          >
            {['Z', 'E', 'V', 'A', 'N', 'Y'].map((letter, index) => (              <motion.span
                key={index}
                whileHover={{
                  y: -10,
                  color: "#d97706",
                  transition: { duration: 0.2 }
                }}
                whileTap={{
                  y: -10,
                  color: "#d97706",
                  transition: { duration: 0.2 }
                }}
                className="inline-block cursor-pointer transition-colors duration-200 touch-manipulation"
                style={{ marginRight: index < 5 ? '0.1em' : '0' }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>          {/* Decorative Line with Matched Sparkles Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center justify-center mb-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.2 }}
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mr-4 sm:mr-6 cursor-pointer" />
            </motion.div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '160px' }}
              transition={{ duration: 1.5, delay: 1.5 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"
            />
              <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.2 }}
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 ml-4 sm:ml-6 cursor-pointer" />
            </motion.div>
          </motion.div>

          {/* Explore Collection Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.0 }}
            className="mt-12 sm:mt-16"
          >
            <motion.a
              href="/collections"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#f59e0b"
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-full hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
            >
              <span className="mr-2">Explore Collection</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.a>
          </motion.div></div>
      </div>
    </div>
  );
}
