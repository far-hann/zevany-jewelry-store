'use client'

import { useState, useCallback } from 'react'

export function useAuthPrompt() {
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [featureName, setFeatureName] = useState<'cart' | 'wishlist' | 'account'>('cart')

  const checkAuthAndPrompt = useCallback((feature: 'cart' | 'wishlist' | 'account'): boolean => {
    if (typeof window === 'undefined') return false
    
    const user = localStorage.getItem('user')
    if (!user) {
      setFeatureName(feature)
      setIsPromptOpen(true)
      return false
    }
    return true
  }, [])

  const closePrompt = useCallback(() => {
    setIsPromptOpen(false)
  }, [])

  return {
    isPromptOpen,
    featureName,
    checkAuthAndPrompt,
    closePrompt
  }
}
