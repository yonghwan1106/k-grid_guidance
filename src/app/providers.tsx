'use client'

import { ReactNode } from 'react'
import Navigation from '@/components/layout/Navigation'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  )
}