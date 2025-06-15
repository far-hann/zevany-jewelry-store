// SEO Performance Testing and Validation Utilities

export interface SEOChecklistItem {
  name: string
  description: string
  status: 'pass' | 'fail' | 'warning' | 'not-tested'
  details?: string
}

export interface SEOAuditResult {
  score: number
  total: number
  items: SEOChecklistItem[]
  recommendations: string[]
}

export class SEOValidator {
  private results: SEOChecklistItem[] = []

  // Check if page has proper title tag
  checkTitle(): SEOChecklistItem {
    const title = document.title
    const result: SEOChecklistItem = {
      name: 'Title Tag',
      description: 'Page has unique, descriptive title under 60 characters',
      status: 'not-tested'
    }

    if (!title) {
      result.status = 'fail'
      result.details = 'No title tag found'
    } else if (title.length > 60) {
      result.status = 'warning'
      result.details = `Title too long: ${title.length} characters`
    } else if (title.length < 10) {
      result.status = 'warning'
      result.details = `Title too short: ${title.length} characters`
    } else {
      result.status = 'pass'
      result.details = `Title length: ${title.length} characters`
    }

    this.results.push(result)
    return result
  }

  // Check if page has meta description
  checkMetaDescription(): SEOChecklistItem {
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content')
    const result: SEOChecklistItem = {
      name: 'Meta Description',
      description: 'Page has unique meta description between 120-160 characters',
      status: 'not-tested'
    }

    if (!metaDesc) {
      result.status = 'fail'
      result.details = 'No meta description found'
    } else if (metaDesc.length > 160) {
      result.status = 'warning'
      result.details = `Description too long: ${metaDesc.length} characters`
    } else if (metaDesc.length < 120) {
      result.status = 'warning'
      result.details = `Description too short: ${metaDesc.length} characters`
    } else {
      result.status = 'pass'
      result.details = `Description length: ${metaDesc.length} characters`
    }

    this.results.push(result)
    return result
  }

  // Check for structured data
  checkStructuredData(): SEOChecklistItem {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
    const result: SEOChecklistItem = {
      name: 'Structured Data',
      description: 'Page has valid JSON-LD structured data',
      status: 'not-tested'
    }

    if (jsonLdScripts.length === 0) {
      result.status = 'fail'
      result.details = 'No structured data found'
    } else {
      try {
        jsonLdScripts.forEach(script => {
          JSON.parse(script.textContent || '')
        })
        result.status = 'pass'
        result.details = `Found ${jsonLdScripts.length} structured data blocks`      } catch {
        result.status = 'fail'
        result.details = 'Invalid JSON-LD syntax'
      }
    }

    this.results.push(result)
    return result
  }

  // Check for Open Graph tags
  checkOpenGraph(): SEOChecklistItem {
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const ogImage = document.querySelector('meta[property="og:image"]')
    const ogUrl = document.querySelector('meta[property="og:url"]')

    const result: SEOChecklistItem = {
      name: 'Open Graph Tags',
      description: 'Page has essential Open Graph meta tags',
      status: 'not-tested'
    }

    const missing = []
    if (!ogTitle) missing.push('og:title')
    if (!ogDescription) missing.push('og:description')
    if (!ogImage) missing.push('og:image')
    if (!ogUrl) missing.push('og:url')

    if (missing.length === 0) {
      result.status = 'pass'
      result.details = 'All essential Open Graph tags present'
    } else if (missing.length <= 2) {
      result.status = 'warning'
      result.details = `Missing: ${missing.join(', ')}`
    } else {
      result.status = 'fail'
      result.details = `Missing: ${missing.join(', ')}`
    }

    this.results.push(result)
    return result
  }

  // Check for header hierarchy
  checkHeaderHierarchy(): SEOChecklistItem {
    const h1s = document.querySelectorAll('h1')
    const h2s = document.querySelectorAll('h2')
    const h3s = document.querySelectorAll('h3')

    const result: SEOChecklistItem = {
      name: 'Header Hierarchy',
      description: 'Page has proper header structure (single H1, logical hierarchy)',
      status: 'not-tested'
    }

    if (h1s.length === 0) {
      result.status = 'fail'
      result.details = 'No H1 tag found'
    } else if (h1s.length > 1) {
      result.status = 'warning'
      result.details = `Multiple H1 tags found: ${h1s.length}`
    } else {
      result.status = 'pass'
      result.details = `H1: 1, H2: ${h2s.length}, H3: ${h3s.length}`
    }

    this.results.push(result)
    return result
  }

  // Check for alt text on images
  checkImageAltText(): SEOChecklistItem {
    const images = document.querySelectorAll('img')
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '')

    const result: SEOChecklistItem = {
      name: 'Image Alt Text',
      description: 'All images have descriptive alt text',
      status: 'not-tested'
    }

    if (images.length === 0) {
      result.status = 'pass'
      result.details = 'No images found'
    } else if (imagesWithoutAlt.length === 0) {
      result.status = 'pass'
      result.details = `All ${images.length} images have alt text`
    } else {
      const percentage = Math.round(((images.length - imagesWithoutAlt.length) / images.length) * 100)
      if (percentage >= 80) {
        result.status = 'warning'
        result.details = `${imagesWithoutAlt.length}/${images.length} images missing alt text (${percentage}% have alt text)`
      } else {
        result.status = 'fail'
        result.details = `${imagesWithoutAlt.length}/${images.length} images missing alt text (${percentage}% have alt text)`
      }
    }

    this.results.push(result)
    return result
  }

  // Check for canonical URL
  checkCanonicalUrl(): SEOChecklistItem {
    const canonical = document.querySelector('link[rel="canonical"]')
    const result: SEOChecklistItem = {
      name: 'Canonical URL',
      description: 'Page has canonical URL specified',
      status: 'not-tested'
    }

    if (!canonical) {
      result.status = 'warning'
      result.details = 'No canonical URL found'
    } else {
      const href = canonical.getAttribute('href')
      if (!href) {
        result.status = 'fail'
        result.details = 'Canonical tag exists but has no href'
      } else {
        result.status = 'pass'
        result.details = `Canonical URL: ${href}`
      }
    }

    this.results.push(result)
    return result
  }

  // Run all checks
  runAudit(): SEOAuditResult {
    this.results = []

    this.checkTitle()
    this.checkMetaDescription()
    this.checkStructuredData()
    this.checkOpenGraph()
    this.checkHeaderHierarchy()
    this.checkImageAltText()
    this.checkCanonicalUrl()

    const passed = this.results.filter(r => r.status === 'pass').length
    const score = Math.round((passed / this.results.length) * 100)

    const recommendations = []
    if (score < 60) {
      recommendations.push('Critical SEO issues found. Immediate action required.')
    } else if (score < 80) {
      recommendations.push('Good SEO foundation. Address warnings to improve further.')
    } else {
      recommendations.push('Excellent SEO implementation!')
    }

    // Add specific recommendations based on failed checks
    this.results.forEach(result => {
      if (result.status === 'fail') {
        switch (result.name) {
          case 'Title Tag':
            recommendations.push('Add a unique, descriptive title tag under 60 characters')
            break
          case 'Meta Description':
            recommendations.push('Add a compelling meta description between 120-160 characters')
            break
          case 'Structured Data':
            recommendations.push('Implement JSON-LD structured data for better search visibility')
            break
          case 'Open Graph Tags':
            recommendations.push('Add Open Graph meta tags for better social media sharing')
            break
        }
      }
    })

    return {
      score,
      total: this.results.length,
      items: this.results,
      recommendations
    }
  }
}

// Performance metrics checker
export class PerformanceValidator {
  async checkWebVitals() {
    try {
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals')
      
      const metrics = {
        cls: 0,
        inp: 0,
        fcp: 0,
        lcp: 0,
        ttfb: 0
      }

      return new Promise<typeof metrics>((resolve) => {
        let collected = 0
        const total = 5

        const checkComplete = () => {
          collected++
          if (collected === total) {
            resolve(metrics)
          }
        }

        onCLS((metric) => {
          metrics.cls = metric.value
          checkComplete()
        })

        onINP((metric) => {
          metrics.inp = metric.value
          checkComplete()
        })

        onFCP((metric) => {
          metrics.fcp = metric.value
          checkComplete()
        })

        onLCP((metric) => {
          metrics.lcp = metric.value
          checkComplete()
        })

        onTTFB((metric) => {
          metrics.ttfb = metric.value
          checkComplete()
        })

        // Timeout after 5 seconds
        setTimeout(() => resolve(metrics), 5000)
      })
    } catch (error) {
      console.warn('Could not check web vitals:', error)
      return null
    }
  }

  evaluateWebVitals(metrics: { lcp: number; inp: number; cls: number }) {
    const results = []

    // LCP (Largest Contentful Paint)
    if (metrics.lcp <= 2500) {
      results.push({ metric: 'LCP', value: metrics.lcp, status: 'good' })
    } else if (metrics.lcp <= 4000) {
      results.push({ metric: 'LCP', value: metrics.lcp, status: 'needs-improvement' })
    } else {
      results.push({ metric: 'LCP', value: metrics.lcp, status: 'poor' })
    }

    // INP (Interaction to Next Paint)
    if (metrics.inp <= 200) {
      results.push({ metric: 'INP', value: metrics.inp, status: 'good' })
    } else if (metrics.inp <= 500) {
      results.push({ metric: 'INP', value: metrics.inp, status: 'needs-improvement' })
    } else {
      results.push({ metric: 'INP', value: metrics.inp, status: 'poor' })
    }

    // CLS (Cumulative Layout Shift)
    if (metrics.cls <= 0.1) {
      results.push({ metric: 'CLS', value: metrics.cls, status: 'good' })
    } else if (metrics.cls <= 0.25) {
      results.push({ metric: 'CLS', value: metrics.cls, status: 'needs-improvement' })
    } else {
      results.push({ metric: 'CLS', value: metrics.cls, status: 'poor' })
    }

    return results
  }
}

// Named export for SEO testing utilities
export const seoTestingUtilities = {
  SEOValidator,
  PerformanceValidator
}
