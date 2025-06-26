'use client'

import { useState, useEffect } from 'react'
import AuthModal from './AuthModal'

export default function GlobalAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login')

  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent) => {
      const { tab } = event.detail
      setAuthModalTab(tab || 'login')
      setIsAuthModalOpen(true)
    }

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener)

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener)
    }
  }, [])

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <>
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultTab={authModalTab}
      />
    </>
  )
}
