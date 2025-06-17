'use client'

import { Crown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>{/* Main Content */}
      <div className="flex items-center justify-center min-h-screen relative z-10 px-2 will-change-transform" style={{ transform: 'translateZ(0)' }}>
        <div className="text-center max-w-6xl mx-auto w-full overflow-hidden will-change-transform"
             style={{ minWidth: '280px', transform: 'translateZ(0)' }}
        >{/* Crown Icon with GPU-optimized Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "tween"
            }}
            className="mb-6 will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          >
            <Crown className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 mx-auto text-amber-600" />
          </motion.div>{/* Animated ZEVANY Text with Individual Letter Hover */}          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "tween"
            }}
            className="zevany-text text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-light text-gray-900 tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] select-none mb-6 whitespace-nowrap will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          >
            {['Z', 'E', 'V', 'A', 'N', 'Y'].map((letter, index) => (              <motion.span
                key={index}                whileHover={{
                  y: -6,
                  color: "#d97706",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{
                  y: -6,
                  color: "#d97706",
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
                className="inline-block cursor-pointer transition-colors duration-200 touch-manipulation will-change-transform"
                style={{ 
                  marginRight: index < 5 ? '0.1em' : '0',
                  transform: 'translateZ(0)'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>{/* Explore Collection Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="mt-8 sm:mt-12 will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          >
            <motion.a
              href="/collections"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#f59e0b",
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-full hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 shadow-lg text-sm sm:text-base will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            >
              <span className="mr-2">Explore Collection</span>              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="will-change-transform"
                style={{ transform: 'translateZ(0)' }}
              >
                →
              </motion.div>
            </motion.a>
          </motion.div></div>
      </div>
    </div>
  );
}
