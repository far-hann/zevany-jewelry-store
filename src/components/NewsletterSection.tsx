'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Mail, ArrowRight, Check, Sparkles, Gift } from 'lucide-react'

// Dynamically import motion components
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false })

export default function NewsletterSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail('')
    }, 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated particles */}
        {isVisible && typeof window !== 'undefined' && (
          <>
            <MotionDiv
              className="absolute top-20 left-20 w-2 h-2 bg-amber-400 rounded-full opacity-60"
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <MotionDiv
              className="absolute top-40 right-32 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50"
              animate={{
                y: [0, 25, 0],
                x: [0, -15, 0],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <MotionDiv
              className="absolute bottom-32 left-1/4 w-2.5 h-2.5 bg-purple-400 rounded-full opacity-40"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </>
        )}
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-900/10 via-transparent to-blue-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(245,158,11,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Header */}
        {isVisible && typeof window !== 'undefined' ? (
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <MotionDiv
              className="flex justify-center mb-6"
              animate={{
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Gift className="h-12 w-12 text-amber-400" />
            </MotionDiv>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white mb-4">
              Join Our Exclusive Circle
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              Be the first to discover new collections, exclusive offers, and jewelry care tips from our master craftsmen
            </p>
            
            {/* Benefits */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12 text-sm text-gray-400">
              {[
                { icon: <Sparkles className="h-4 w-4" />, text: "Exclusive Previews" },
                { icon: <Gift className="h-4 w-4" />, text: "Member-Only Offers" },
                { icon: <Mail className="h-4 w-4" />, text: "Expert Tips" }
              ].map((benefit, index) => (
                <MotionDiv
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                >
                  <div className="mr-2 text-amber-400">{benefit.icon}</div>
                  <span>{benefit.text}</span>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        ) : (
          <div>
            <div className="flex justify-center mb-6">
              <Gift className="h-12 w-12 text-amber-400" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white mb-4">
              Join Our Exclusive Circle
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              Be the first to discover new collections, exclusive offers, and jewelry care tips from our master craftsmen
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12 text-sm text-gray-400">
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                <span>Exclusive Previews</span>
              </div>
              <div className="flex items-center">
                <Gift className="h-4 w-4 mr-2 text-amber-400" />
                <span>Member-Only Offers</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-amber-400" />
                <span>Expert Tips</span>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Form */}
        {isVisible && typeof window !== 'undefined' ? (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                      required
                      disabled={isLoading}
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-full hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </MotionDiv>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">
                  By subscribing, you agree to our privacy policy. Unsubscribe at any time.
                </p>
              </form>
            ) : (
              <MotionDiv
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="max-w-md mx-auto"
              >
                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-8">
                  <MotionDiv
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-4"
                  >
                    <Check className="h-16 w-16 text-green-400 mx-auto" />
                  </MotionDiv>
                  <h3 className="text-2xl font-medium text-white mb-2">Welcome to ZEVANY!</h3>
                  <p className="text-gray-300">
                    Thank you for subscribing. Check your inbox for a special welcome offer.
                  </p>
                </div>
              </MotionDiv>
            )}
          </MotionDiv>
        ) : (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-full flex items-center justify-center"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our privacy policy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
