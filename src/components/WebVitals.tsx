'use client'

import { useEffect } from 'react'

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Web Vitals tracking for performance monitoring
export function WebVitals() {
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = async () => {
      try {        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals')
        
        // Track each metric
        onCLS((metric: { name: string; value: number }) => {
          console.log('CLS:', metric)
          // Send to analytics
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_action: 'CLS',
              value: Math.round(metric.value * 1000),
              custom_parameter: metric.name,
            })
          }
        })
        
        onINP((metric: { name: string; value: number }) => {
          console.log('INP:', metric)
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_action: 'INP',
              value: Math.round(metric.value),
              custom_parameter: metric.name,
            })
          }
        })

        onFCP((metric: { name: string; value: number }) => {
          console.log('FCP:', metric)
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_action: 'FCP',
              value: Math.round(metric.value),
              custom_parameter: metric.name,
            })
          }
        })

        onLCP((metric: { name: string; value: number }) => {
          console.log('LCP:', metric)
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_action: 'LCP',
              value: Math.round(metric.value),
              custom_parameter: metric.name,
            })
          }
        })

        onTTFB((metric: { name: string; value: number }) => {
          console.log('TTFB:', metric)
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_action: 'TTFB',
              value: Math.round(metric.value),
              custom_parameter: metric.name,
            })
          }
        })
      } catch (error) {
        console.warn('Web Vitals tracking failed:', error)
      }
    }

    // Only track in production
    if (process.env.NODE_ENV === 'production') {
      trackWebVitals()
    }
  }, [])

  return null
}

// Performance observer for additional metrics
export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track page load performance
    const trackPageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
        const firstByte = navigation.responseStart - navigation.fetchStart
        
        console.log('Performance Metrics:', {
          pageLoadTime,
          domContentLoaded,
          firstByte
        })
          // Send to analytics if available
        if (window.gtag) {
          window.gtag('event', 'page_load_performance', {
            event_category: 'Performance',
            value: Math.round(pageLoadTime),
            custom_parameter_1: Math.round(domContentLoaded),
            custom_parameter_2: Math.round(firstByte),
          })
        }
      }
    }

    // Track resource loading
    const trackResources = () => {
      const resources = performance.getEntriesByType('resource')
      const slowResources = resources.filter((resource: PerformanceResourceTiming) => 
        resource.duration > 1000 // Resources taking more than 1 second
      )
      
      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources)
      }
    }

    // Run after page load
    if (document.readyState === 'complete') {
      setTimeout(() => {
        trackPageLoad()
        trackResources()
      }, 1000)
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          trackPageLoad()
          trackResources()
        }, 1000)
      })
    }
  }, [])

  return null
}

export default WebVitals
