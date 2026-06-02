'use client'

import { useHub } from '@/store/hub.store'
import { PageDetail } from './PageDetail'
import { ServiceIntegrationGuide } from './ServiceIntegrationGuide'

interface Props {
  onClose: () => void
}

export function ArchRightRail({ onClose }: Props) {
  const selectedServiceId = useHub((s) => s.arch.selectedServiceId)
  const selectedPageId = useHub((s) => s.arch.selectedPageId)
  const pages = useHub((s) => s.arch.pages)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const archSelectService = useHub((s) => s.archSelectService)

  if (selectedServiceId && pages[selectedServiceId]?.type === 'service') {
    return (
      <div data-spotlight="arch-right-rail" className="contents">
        <ServiceIntegrationGuide
          servicePage={pages[selectedServiceId]}
          onClose={() => {
            archSelectService(null)
            onClose()
          }}
        />
      </div>
    )
  }

  if (selectedPageId && pages[selectedPageId]) {
    return (
      <div data-spotlight="arch-right-rail" className="contents">
        <PageDetail
          onClose={() => {
            archSelectPage(null)
            onClose()
          }}
        />
      </div>
    )
  }

  return null
}
