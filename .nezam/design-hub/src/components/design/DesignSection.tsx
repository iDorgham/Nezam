'use client'

import { useHub } from '@/store/hub.store'
import { TokenNav } from './TokenNav'
import { ColorEditor }       from './editors/ColorEditor'
import { TypographyEditor }  from './editors/TypographyEditor'
import { SpacingEditor }     from './editors/SpacingEditor'
import { RadiusEditor }      from './editors/RadiusEditor'
import { ShadowEditor }      from './editors/ShadowEditor'
import { MotionEditor }      from './editors/MotionEditor'
import { BorderEditor }      from './editors/BorderEditor'
import { IconographyEditor } from './editors/IconographyEditor'
import { ElevationEditor }   from './editors/ElevationEditor'
import { FontEditor }        from './editors/FontEditor'
import { InteractionEditor } from './editors/InteractionEditor'
import { UtilityEditor }     from './editors/UtilityEditor'
import { ComponentStrip }    from './ComponentStrip'

export function DesignSection() {
  const category  = useHub((s) => s.design.selectedCategory)
  const showStrip = useHub((s) => s.design.showPreviewStrip)

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Left: token nav + design profiles */}
      <TokenNav />

      {/* Center: token editor */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-app-border">
        <div className="flex-1 overflow-y-auto app-scroll p-6">
          {category === 'colors'      && <ColorEditor />}
          {category === 'typography'  && <TypographyEditor />}
          {category === 'spacing'     && <SpacingEditor />}
          {category === 'radius'      && <RadiusEditor />}
          {category === 'shadows'     && <ShadowEditor />}
          {category === 'motion'      && <MotionEditor />}
          {category === 'borders'     && <BorderEditor />}
          {category === 'iconography' && <IconographyEditor />}
          {category === 'elevation'   && <ElevationEditor />}
          {category === 'font'        && <FontEditor />}
          {category === 'interaction' && <InteractionEditor />}
          {category === 'utility'     && <UtilityEditor />}
        </div>
      </main>

      {/* Right: live component strip */}
      {showStrip && <ComponentStrip />}
    </div>
  )
}
