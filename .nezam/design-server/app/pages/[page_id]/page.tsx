import React from 'react'
import { getAllBlocks } from '@/lib/blocks/registry'
import WireframeEditor from '@/components/wireframe/WireframeEditor'

export default async function PageEditor({ params }: { params: Promise<{ page_id: string }> }) {
  const resolvedParams = await params
  const pageId = resolvedParams.page_id

  const availableBlocks = getAllBlocks()

  return (
    <div className="p-6">
      <WireframeEditor pageId={pageId} availableBlocks={availableBlocks} />
    </div>
  )
}
