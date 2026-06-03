import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

/** App Router loading boundary — shown during route segment transitions. */
export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2 text-app-muted">
        <Spinner size="sm" />
        <span className="text-sm">Loading…</span>
      </div>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
