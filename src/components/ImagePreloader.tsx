'use client'

import { useEffect, useState } from 'react'
import { products } from '../data/products'

export function ImagePreloader() {
  const [preloadStatus, setPreloadStatus] = useState<'loading' | 'complete' | 'error'>('loading')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client flag to prevent hydration mismatch
    setIsClient(true)
    
    let isMounted = true

    const preloadImages = async () => {
      try {        // Critical images to preload
        const criticalImages = [
          '/images/placeholder.jpg',
          // Only preload existing product images
          ...products.slice(0, 8).map(product => product.images[0]).filter(Boolean)
        ]

        // Preload with retry mechanism
        const preloadPromises = criticalImages.map(src => 
          new Promise<void>((resolve) => {
            const img = new window.Image()
            let retryCount = 0
            const maxRetries = 2

            const attemptLoad = () => {
              img.onload = () => resolve()
              img.onerror = () => {
                if (retryCount < maxRetries) {
                  retryCount++
                  setTimeout(() => {
                    img.src = src + `?retry=${retryCount}&t=${Date.now()}`
                  }, 500)
                } else {
                  console.warn(`Failed to preload image after ${maxRetries} retries: ${src}`)
                  resolve() // Don't fail the entire batch
                }
              }
              img.src = src
            }

            attemptLoad()
          })
        )

        await Promise.allSettled(preloadPromises)
        
        if (isMounted) {
          setPreloadStatus('complete')
          console.log('✅ Image preloading completed successfully')
          
          // Store preload status in sessionStorage to avoid re-preloading
          sessionStorage.setItem('images-preloaded', 'true')
        }
      } catch (error) {
        console.error('❌ Image preloading failed:', error)
        if (isMounted) {
          setPreloadStatus('error')
        }
      }
    }

    // Check if already preloaded this session
    const alreadyPreloaded = sessionStorage.getItem('images-preloaded') === 'true'
    
    if (alreadyPreloaded) {
      setPreloadStatus('complete')
    } else {
      preloadImages()
    }

    return () => {
      isMounted = false
    }  }, [])

  // Don't render anything on server side to prevent hydration mismatch
  if (!isClient) {
    return null
  }

  // Only show loading indicator on client side and only briefly
  if (preloadStatus === 'loading') {
    return (
      <div className="fixed top-4 right-4 z-50 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs opacity-75">
        <span className="animate-pulse">Loading images...</span>
      </div>
    )
  }

  return null
}
