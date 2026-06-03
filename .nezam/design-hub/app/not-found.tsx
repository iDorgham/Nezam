import Link from 'next/link'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '@/components/ui/button'

/** App Router not-found boundary — branded empty state for unknown routes. */
export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you’re looking for doesn’t exist or may have moved."
      action={
        <Link href="/">
          <Button type="button">Back to home</Button>
        </Link>
      }
    />
  )
}
