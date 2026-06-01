'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  placeholder?: ReactNode
  /** IntersectionObserver rootMargin — larger values preload before scroll. */
  rootMargin?: string
  className?: string
  /** When true, mount immediately (e.g. drag preview). */
  forceMount?: boolean
}

const DEFAULT_PLACEHOLDER = (
  <div
    className="min-h-[72px] w-full rounded-app-md border border-app-border/60 bg-app-bg/80 animate-pulse"
    aria-hidden
  />
)

export function LazyMountWhenVisible({
  children,
  placeholder = DEFAULT_PLACEHOLDER,
  rootMargin = '160px',
  className,
  forceMount = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(forceMount)

  useEffect(() => {
    if (visible || forceMount) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [visible, forceMount, rootMargin])

  return (
    <div ref={ref} className={cn('w-full', className)}>
      {visible || forceMount ? children : placeholder}
    </div>
  )
}
