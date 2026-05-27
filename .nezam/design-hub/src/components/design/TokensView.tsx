'use client'

import { useHub } from '@/store/hub.store'
import { TokenNav } from './TokenNav'
import { ColorEditor }       from './editors/ColorEditor'
import { TypographyEditor }  from './editors/TypographyEditor'
import { SpacingEditor }     from './editors/SpacingEditor'
import { RadiusEditor }      from './editors/RadiusEditor'
import { ShadowEditor }       from './editors/ShadowEditor'
import { MotionEditor }      from './editors/MotionEditor'
import { BorderEditor }      from './editors/BorderEditor'
import { IconographyEditor } from './editors/IconographyEditor'
import { ElevationEditor }   from './editors/ElevationEditor'
import { FontEditor }        from './editors/FontEditor'
import { InteractionEditor } from './editors/InteractionEditor'
import { UtilityEditor }     from './editors/UtilityEditor'
import { OpacityEditor }     from './editors/OpacityEditor'
import { ZIndexEditor }      from './editors/ZIndexEditor'
import { BreakpointsEditor } from './editors/BreakpointsEditor'
import { LayoutEditor }       from './editors/LayoutEditor'
import { CursorEditor }       from './editors/CursorEditor'
import { ScrollbarEditor }   from './editors/ScrollbarEditor'
import { GlassEditor }       from './editors/GlassEditor'
import { GradientEditor }    from './editors/GradientEditor'
import { GridEditor }        from './editors/GridEditor'
import { ContentEditor }     from './editors/ContentEditor'
import { DensityEditor }     from './editors/DensityEditor'
import { ComponentStrip }     from './ComponentStrip'

/** Original token-editor experience — now the "Tokens" sub-tab. */
export function TokensView() {
  const category = useHub((s) => s.design.selectedCategory)
  const showStrip = useHub((s) => s.design.showPreviewStrip)

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <TokenNav />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-app-border">
        <div className="flex-1 overflow-y-auto app-scroll p-10">
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
          {category === 'opacity'     && <OpacityEditor />}
          {category === 'z-index'     && <ZIndexEditor />}
          {category === 'breakpoints' && <BreakpointsEditor />}
          {category === 'layout'      && <LayoutEditor />}
          {category === 'cursor'      && <CursorEditor />}
          {category === 'scrollbar'   && <ScrollbarEditor />}
          {category === 'glass'       && <GlassEditor />}
          {category === 'gradients'   && <GradientEditor />}
          {category === 'grid'        && <GridEditor />}
          {category === 'content'     && <ContentEditor />}
          {category === 'density'     && <DensityEditor />}
        </div>
      </main>

      {showStrip && <ComponentStrip />}
    </div>
  )
}
