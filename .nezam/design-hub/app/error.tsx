'use client'

import { Button } from '@/components/ui/button'

/** App Router error boundary — catches render errors in this segment. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center"
    >
      <h2 className="text-base font-semibold text-app-text">Something went wrong</h2>
      <p className="max-w-sm text-sm text-app-subtle">
        An unexpected error occurred while rendering this view. You can try again.
      </p>
      <Button type="button" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
