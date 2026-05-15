import React from 'react'
import WireframeEditor from '@/components/wireframe/WireframeEditor'

export default async function PageEditor({ params }: { params: Promise<{ page_id: string }> }) {
  const resolvedParams = await params
  const pageId = resolvedParams.page_id

  return (
    <div className="h-[calc(100vh-60px)] w-full overflow-hidden">
      <WireframeEditor pageId={pageId} />
    </div>
  )
}
