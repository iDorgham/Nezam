import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nezam — Nightclub System',
  description: 'Spotify-inspired reservation and guest list system.',
}

import Sidebar from '../components/features/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
