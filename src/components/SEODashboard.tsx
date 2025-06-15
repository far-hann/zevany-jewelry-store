'use client'

import { useState, useEffect } from 'react'
import { SEOValidator, PerformanceValidator } from '@/utils/seoTesting'

interface SEODashboardProps {
  showInProduction?: boolean
}

export function SEODashboard({ showInProduction = false }: SEODashboardProps) {
  const [seoResults, setSeoResults] = useState<null | {
    score: number;
    total: number;
    items: { name: string; status: string }[];
    recommendations: string[];
  }>(null)
  const [performanceResults, setPerformanceResults] = useState<null | { metric: string; value: number; status: string }[]>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Only show in development unless explicitly enabled for production
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' || showInProduction) {
      setIsVisible(true)
    }
  }, [showInProduction])

  const runSEOAudit = async () => {
    setIsLoading(true)
    try {
      const validator = new SEOValidator()
      const results = validator.runAudit()
      setSeoResults(results)

      const perfValidator = new PerformanceValidator()
      const perfMetrics = await perfValidator.checkWebVitals()
      if (perfMetrics) {
        const perfResults = perfValidator.evaluateWebVitals(perfMetrics)
        setPerformanceResults(perfResults)
      }
    } catch (error) {
      console.error('SEO Audit failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">SEO & Performance</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {!seoResults && !isLoading && (
          <button
            onClick={runSEOAudit}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Run SEO Audit
          </button>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="text-sm text-gray-600 mt-2">Running audit...</p>
          </div>
        )}

        {seoResults && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">SEO Score</span>
              <span className={`text-lg font-bold ${
                seoResults.score >= 80 ? 'text-green-600' : 
                seoResults.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {seoResults.score}/100
              </span>
            </div>

            <div className="space-y-1">
              {seoResults.items.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="truncate mr-2">{item.name}</span>
                  <span className={`font-medium ${
                    item.status === 'pass' ? 'text-green-600' : 
                    item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.status === 'pass' ? '\u2713' : item.status === 'warning' ? '\u26a0' : '\u2717'}
                  </span>
                </div>
              ))}
            </div>

            {performanceResults && (
              <div className="border-t pt-3">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Core Web Vitals</h4>
                <div className="space-y-1">
                  {performanceResults.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span>{metric.metric}</span>
                      <span className={`font-medium ${
                        metric.status === 'good' ? 'text-green-600' : 
                        metric.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={runSEOAudit}
              className="w-full bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-200"
            >
              Re-run Audit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Floating SEO debug button
export function SEODebugButton() {
  const [showDashboard, setShowDashboard] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null

  return (
    <>
      <button
        onClick={() => setShowDashboard(!showDashboard)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        title="SEO Dashboard"
      >
        📊
      </button>
      {showDashboard && (
        <SEODashboard showInProduction={false} />
      )}
    </>
  )
}

export default SEODashboard
