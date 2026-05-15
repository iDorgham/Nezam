import Link from 'next/link'

export default function TopNav() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#ffffff14] bg-[#08090a] px-4 text-sm">
      <div className="flex items-center space-x-6">
        <span className="font-semibold text-white">◆ NEZAM Design Server</span>
        <nav className="flex space-x-4 text-ds-text-muted">
          <Link href="/profiles" className="hover:text-white transition-colors">Profiles</Link>
          <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          <Link href="/tokens" className="hover:text-white transition-colors">Tokens</Link>
          <Link href="/review" className="hover:text-white transition-colors">Review</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        {/* Progress indicator will go here later */}
        <button className="px-3 py-1.5 bg-[#5e6ad2] text-white rounded font-medium text-xs hover:bg-[#7170ff] transition-colors">
          Export
        </button>
      </div>
    </header>
  )
}
