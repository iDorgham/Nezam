import React from 'react'
import WireframeEditor from '@/components/wireframe/WireframeEditor'

export default function SidePanelDesignerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ds-text-primary mb-4">Side Panel Designer</h1>
      <WireframeEditor pageId="__side_panel__" />
    </div>
  )
}
