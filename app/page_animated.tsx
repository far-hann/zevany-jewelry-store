'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  direction: number
}

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const initialParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 1200,
        y: Math.random() * 800,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
        direction: Math.random() * Math.PI * 2,
      })
    }
    setParticles(initialParticles)

    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => {
          let newX = particle.x + Math.cos(particle.direction) * particle.speed
          let newY = particle.y + Math.sin(particle.direction) * particle.speed
          
          if (newX > 1200) newX = 0
          if (newX < 0) newX = 1200
          if (newY > 800) newY = 0
          if (newY < 0) newY = 800
          
          return { ...particle, x: newX, y: newY }
        })
      )
    }

    const interval = setInterval(animateParticles, 16)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-8xl font-serif font-light text-amber-600 tracking-[0.3em]">
          ZEVANY
        </h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 animate-pulse"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px rgba(251, 191, 36, 0.4)`,
            }}
          />
        ))}
      </div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center">
          {/* Animated ZEVANY Text */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateY: 0,
            }}
            transition={{ 
              duration: 2,
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 tracking-[0.3em] select-none mb-8"
            style={{
              textShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
              filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))'
            }}
          >
            <motion.span
              animate={{ 
                textShadow: [
                  '0 0 30px rgba(251, 191, 36, 0.6)',
                  '0 0 50px rgba(251, 191, 36, 0.9)',
                  '0 0 30px rgba(251, 191, 36, 0.6)'
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ZEVANY
            </motion.span>
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="text-xl md:text-2xl text-gray-600 font-light tracking-wider"
          >
            Luxury Jewelry Collection
          </motion.p>

          {/* Animated Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex items-center justify-center mt-12 space-x-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)' }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ delay: 2, duration: 1.5 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)' }}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="/collections"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-full shadow-xl hover:from-amber-400 hover:to-yellow-500 transition-all duration-300"
            >
              Explore Collection
            </motion.a>
            
            <motion.a
              href="/rings"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-amber-400 text-amber-600 font-semibold rounded-full hover:bg-amber-50 transition-all duration-300"
            >
              Featured Rings
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
