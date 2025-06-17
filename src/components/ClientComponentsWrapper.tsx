"use client"

import dynamic from 'next/dynamic'

// Dynamically import client components to avoid SSR issues
const FloatingCartButton = dynamic(() => import('./FloatingCartButton'), {
  ssr: false,
  loading: () => null
})

const BottomNavigation = dynamic(() => import('./BottomNavigation'), {
  ssr: false,
  loading: () => null
})

export default function ClientComponents() {
  return (
    <>
      <FloatingCartButton />
      <BottomNavigation />
    </>
  )
}
