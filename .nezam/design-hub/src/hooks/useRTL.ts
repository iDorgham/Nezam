'use client'
import { useState, useEffect } from 'react'

export function useRTL(): boolean {
  const [isRTL, setIsRTL] = useState(false)
  useEffect(() => {
    const check = () => setIsRTL(document.documentElement.dir === 'rtl')
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] })
    return () => observer.disconnect()
  }, [])
  return isRTL
}
