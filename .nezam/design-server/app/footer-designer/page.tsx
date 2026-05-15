import React from 'react'
import { getAllBlocks } from '@/lib/blocks/registry'
import WireframeEditor from '@/components/wireframe/WireframeEditor'

export default function FooterDesignerPage() {
  const availableBlocks = getAllBlocks()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ds-text-primary mb-4">Footer Designer</h1>
      <WireframeEditor pageId="__footer__" availableBlocks={availableBlocks} />
    </div>
  )
}
