'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

// Dynamically import motion components
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false })

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  image: string
  product: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Designer",
    content: "The craftsmanship is absolutely exquisite. Every detail shows the care and precision that goes into each piece. My engagement ring from ZEVANY is perfect.",
    rating: 5,
    image: "/images/testimonials/sarah.jpg",
    product: "Diamond Engagement Ring"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Art Collector",
    content: "I've collected jewelry for years, and ZEVANY's pieces stand out for their unique designs and exceptional quality. The attention to detail is remarkable.",
    rating: 5,
    image: "/images/testimonials/michael.jpg",
    product: "Gold Statement Necklace"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Interior Designer",
    content: "Not only beautiful but also sustainable practices. I love that ZEVANY cares about ethical sourcing. My pearl earrings are stunning and meaningful.",
    rating: 5,
    image: "/images/testimonials/emma.jpg",
    product: "Pearl Drop Earrings"
  },
  {
    id: 4,
    name: "David Williams",
    role: "Entrepreneur",
    content: "Purchased a watch for my wife's anniversary. The packaging, the quality, the customer service - everything exceeded expectations. Truly luxury experience.",
    rating: 5,
    image: "/images/testimonials/david.jpg",
    product: "Diamond Watch"
  }
]

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-100 to-transparent rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-amber-100 to-transparent rounded-full opacity-20 blur-3xl"></div>
        
        {/* Decorative quotes */}
        {isVisible && typeof window !== 'undefined' && (
          <>
            <MotionDiv
              className="absolute top-32 left-1/4 text-gray-200"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Quote className="h-16 w-16" />
            </MotionDiv>
            <MotionDiv
              className="absolute bottom-32 right-1/4 text-gray-200"
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            >
              <Quote className="h-12 w-12" />
            </MotionDiv>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        {isVisible && typeof window !== 'undefined' ? (
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Discover why jewelry enthusiasts worldwide choose ZEVANY for their most precious moments
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
            </div>
          </MotionDiv>
        ) : (
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Discover why jewelry enthusiasts worldwide choose ZEVANY for their most precious moments
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
            </div>
          </div>
        )}

        {/* Testimonial Carousel */}
        <div className="relative">
          {isVisible && typeof window !== 'undefined' ? (
            <MotionDiv
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto relative"
            >
              {/* Quote icon */}
              <MotionDiv
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="absolute -top-6 left-8"
              >
                <div className="bg-purple-500 text-white p-4 rounded-full shadow-lg">
                  <Quote className="h-6 w-6" />
                </div>
              </MotionDiv>

              <div className="pt-8">
                {/* Stars */}
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex justify-center mb-6"
                >
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <MotionDiv
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    >
                      <Star className="h-6 w-6 text-yellow-400 fill-current mx-1" />
                    </MotionDiv>
                  ))}
                </MotionDiv>                {/* Testimonial content */}
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <blockquote className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed text-center mb-8 italic">
                    &ldquo;{currentTestimonial.content}&rdquo;
                  </blockquote>
                </MotionDiv>

                {/* Client info */}
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg mb-4 sm:mb-0 sm:mr-6">
                    {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-gray-600 mb-1">{currentTestimonial.role}</p>
                    <p className="text-sm text-purple-600 font-medium">
                      Purchased: {currentTestimonial.product}
                    </p>
                  </div>
                </MotionDiv>
              </div>
            </MotionDiv>
          ) : (
            // Static version for SSR
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto relative">
              <div className="absolute -top-6 left-8">
                <div className="bg-purple-500 text-white p-4 rounded-full shadow-lg">
                  <Quote className="h-6 w-6" />
                </div>
              </div>

              <div className="pt-8">
                <div className="flex justify-center mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current mx-1" />
                  ))}
                </div>                <blockquote className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed text-center mb-8 italic">
                  &ldquo;{currentTestimonial.content}&rdquo;
                </blockquote>

                <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg mb-4 sm:mb-0 sm:mr-6">
                    {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-gray-600 mb-1">{currentTestimonial.role}</p>
                    <p className="text-sm text-purple-600 font-medium">
                      Purchased: {currentTestimonial.product}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-purple-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
