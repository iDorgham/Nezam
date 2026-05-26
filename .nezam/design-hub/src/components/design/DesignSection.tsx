'use client'

import dynamic from 'next/dynamic'
import { useHub } from '@/store/hub.store'

export function DesignSection() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <TokensViewLazy />
    </div>
  )
}

// Lazy load TokensView to keep bundle small
const TokensViewLazy = dynamic(
  () => import('./TokensView').then(m => ({ default: m.TokensView })),
  { ssr: false },
)
