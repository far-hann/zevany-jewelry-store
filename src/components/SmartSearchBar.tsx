'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Clock, Star, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface TrendingSearches {
  term: string
  count: number
  category: string
}

interface RecentSearches {
  term: string
  timestamp: Date
}

interface QuickActions {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

export default function SmartSearchBar() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [trendingSearches] = useState<TrendingSearches[]>([
    { term: 'diamond rings', count: 1250, category: 'rings' },
    { term: 'gold necklaces', count: 980, category: 'necklaces' },
    { term: 'pearl earrings', count: 756, category: 'earrings' },
    { term: 'vintage bracelets', count: 654, category: 'bracelets' },
    { term: 'engagement rings', count: 2100, category: 'rings' }
  ])
  
  const [recentSearches, setRecentSearches] = useState<RecentSearches[]>([])

  const quickActions: QuickActions[] = [
    {
      title: 'New Arrivals',
      description: 'Latest jewelry pieces',
      icon: <Star className="h-5 w-5" />,
      href: '/collections?filter=new',
      color: 'bg-blue-500'
    },
    {
      title: 'Sale Items',
      description: 'Up to 40% off',
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/collections?filter=sale',
      color: 'bg-red-500'
    },
    {
      title: 'Best Sellers',
      description: 'Customer favorites',
      icon: <ShoppingBag className="h-5 w-5" />,
      href: '/collections?filter=bestsellers',
      color: 'bg-green-500'
    }
  ]

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      // Mock suggestions - in production, call API
      const mockSuggestions = [
        'diamond engagement rings',
        'gold chain necklaces',
        'pearl stud earrings',
        'silver bracelets',
        'vintage jewelry sets'
      ].filter(s => s.toLowerCase().includes(query.toLowerCase()))
      
      setSuggestions(mockSuggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [query])

  const handleSearch = (searchTerm: string = query) => {
    if (!searchTerm.trim()) return

    // Save to recent searches
    const newSearch: RecentSearches = {
      term: searchTerm.trim(),
      timestamp: new Date()
    }
    
    const updated = [newSearch, ...recentSearches.filter(s => s.term !== searchTerm.trim())].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="relative">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 1)}
          placeholder="Search jewelry... (e.g., diamond rings, gold necklaces)"
          className="w-full pl-12 pr-20 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg shadow-sm"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h4>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-900"
                >
                  <Search className="inline h-4 w-4 text-gray-400 mr-2" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Searches
            </h4>
            <div className="space-y-2">
              {trendingSearches.slice(0, 3).map((trend, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(trend.term)}
                  className="flex items-center justify-between w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-900">{trend.term}</span>
                  <span className="text-xs text-gray-500">{trend.count.toLocaleString()} searches</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Searches
              </h4>
              <div className="space-y-2">
                {recentSearches.slice(0, 3).map((recent, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(recent.term)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-900"
                  >
                    {recent.term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className={`${action.color} text-white p-1.5 rounded-lg mr-3`}>
                    {action.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}
