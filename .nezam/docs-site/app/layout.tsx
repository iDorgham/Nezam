import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import 'nextra-theme-docs/style.css'

export const metadata: Metadata = {
  title: {
    default: 'NEZAM — Specification-driven development for AI-native teams',
    template: '%s — NEZAM'
  },
  description:
    'NEZAM governs Cursor, Claude, Codex, and more with one pipeline: plan → lock design → scaffold → develop — with hardlocks that block unsafe work.',
  metadataBase: new URL('https://nezam.dev')
}

const navbar = (
  <Navbar
    logo={<b>NEZAM</b>}
    projectLink="https://github.com/iDorgham/Nezam"
  />
)

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} © NEZAM. Specification-driven delivery for builders who think in systems.
  </Footer>
)

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/iDorgham/Nezam/tree/Master/.nezam/docs-site"
          sidebar={{ defaultMenuCollapseLevel: 2 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

export default RootLayout
