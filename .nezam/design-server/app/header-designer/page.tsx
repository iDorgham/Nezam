import React from 'react'
import WireframeEditor from '@/components/wireframe/WireframeEditor'

export default function HeaderDesignerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ds-text-primary mb-4">Header Designer</h1>
      <WireframeEditor pageId="__header__" />
    </div>
  )
}
