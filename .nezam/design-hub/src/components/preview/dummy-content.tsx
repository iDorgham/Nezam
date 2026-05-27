'use client'

// ─── Dummy content helpers for page previews ────────────────────────────────

export const DUMMY = {
  names: [
    'Alex Rivera', 'Priya Nair', 'James Chen', 'Sofia Martinez',
    'Yuki Tanaka', 'Omar Hassan', 'Lena Schmidt', 'David Kim',
    'Aisha Patel', 'Marcus Johnson',
  ],
  companies: ['Acme Corp', 'Globex', 'Initech', 'Cyberdyne', 'Umbrella Corp', 'Stark Industries', 'Hooli', 'Pied Piper'],
  products: ['Arc Desk Lamp', 'Nova Chair', 'Luna Side Table', 'Aero Bookshelf', 'Cove Ottoman', 'Flux Pendant Light'],
  headings: [
    'Build faster. Ship smarter.',
    'The platform your team deserves.',
    'From idea to production in minutes.',
    'Scale without the complexity.',
    'Designed for teams that ship.',
    'Your product, amplified.',
    'Workflow that works.',
    'The future of collaboration.',
  ],
  descriptions: [
    'Streamline your workflow with intelligent automation and real-time collaboration tools your team will love.',
    'Enterprise-grade infrastructure with developer-first tooling. Deploy globally in one click.',
    'Connect your tools, automate your work, and focus on what matters most — building great products.',
    'Powerful analytics, intuitive dashboards, and seamless integrations. Everything you need to scale.',
  ],
  prices: [
    { name: 'Starter', price: '$19', desc: 'For small teams getting started' },
    { name: 'Professional', price: '$79', desc: 'For growing businesses', featured: true },
    { name: 'Enterprise', price: '$299', desc: 'For large organizations' },
  ],
  features: [
    { title: 'Lightning Fast', desc: 'Sub-100ms response times worldwide with edge delivery.' },
    { title: 'Secure by Default', desc: 'SOC2 certified infrastructure with end-to-end encryption.' },
    { title: 'Team Collaboration', desc: 'Real-time sync and granular permissions for every project.' },
    { title: 'Smart Analytics', desc: 'Actionable insights powered by machine learning models.' },
    { title: 'API First', desc: 'REST & GraphQL APIs with SDKs for every major language.' },
    { title: 'Global CDN', desc: 'Deploy to 200+ edge locations with automatic cache management.' },
  ],
  stats: [
    { value: '$48.2K', label: 'Monthly Revenue', change: '+12.5%', up: true },
    { value: '2,847', label: 'Active Users', change: '+8.3%', up: true },
    { value: '99.99%', label: 'Uptime', change: '99.99%', up: true },
    { value: '142', label: 'Team Members', change: '+4', up: true },
  ],
  team: [
    { name: 'Yasser Dorgham', role: 'CEO & Founder', initials: 'YD' },
    { name: 'Alex Rivera', role: 'CTO', initials: 'AR' },
    { name: 'Priya Nair', role: 'Head of Design', initials: 'PN' },
    { name: 'James Chen', role: 'Engineering Lead', initials: 'JC' },
  ],
  blogPosts: [
    { title: 'Building accessible design systems', date: 'Mar 15, 2026', readTime: '8 min read', tag: 'Design' },
    { title: 'Scaling real-time APIs with WebSockets', date: 'Mar 12, 2026', readTime: '12 min read', tag: 'Engineering' },
    { title: 'The future of component-driven development', date: 'Mar 8, 2026', readTime: '6 min read', tag: 'Product' },
    { title: 'How we reduced bundle size by 60%', date: 'Mar 3, 2026', readTime: '10 min read', tag: 'Engineering' },
  ],
  notifications: [
    { user: 'Alex Rivera', action: 'commented on your pull request', time: '2m ago' },
    { user: 'Priya Nair', action: 'assigned you to "Dashboard redesign"', time: '15m ago' },
    { user: 'James Chen', action: 'merged "Fix auth flow" into main', time: '1h ago' },
    { user: 'Sofia Martinez', action: 'invited you to "Q2 Planning"', time: '3h ago' },
  ],
  chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  chartData: [30, 45, 28, 62, 55, 38, 70],
}

// ─── SVG Illustration primitives ─────────────────────────────────────────────

export function IllusHero({ brand }: { brand: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="40" y="60" width="320" height="180" rx="16" fill={`${brand}15`} />
      <rect x="60" y="100" width="120" height="8" rx="4" fill={`${brand}40`} />
      <rect x="60" y="118" width="200" height="8" rx="4" fill={`${brand}25`} />
      <rect x="60" y="136" width="160" height="8" rx="4" fill={`${brand}20`} />
      <circle cx="300" cy="120" r="36" fill={`${brand}20`} />
      <circle cx="300" cy="120" r="20" fill={`${brand}30`} />
      <rect x="80" y="180" width="80" height="28" rx="8" fill={brand} />
      <rect x="172" y="180" width="80" height="28" rx="8" stroke={brand} strokeWidth="2" fill="none" />
      <path d="M200 252 Q240 232 280 252" stroke={`${brand}20`} strokeWidth="2" fill="none" />
      {[0,1,2,3].map(i => (
        <rect key={i} x={80 + i * 85} y="270" width="16" height="24" rx="3" fill={`${brand}${30 + i * 10}`} />
      ))}
    </svg>
  )
}

export function IllusFeatures({ brand }: { brand: string }) {
  return (
    <svg viewBox="0 0 400 240" fill="none" style={{ width: '100%', height: '100%' }}>
      {[0,1,2].map(row => (
        <g key={row}>
          <rect x={20 + row * 140} y={20} width="120" height="90" rx="12" fill={`${brand}12`} stroke={`${brand}25`} strokeWidth="1" />
          <circle cx={60 + row * 140} cy={50} r="14" fill={`${brand}40`} />
          <rect x={40 + row * 140} y={74} width="80" height="6" rx="3" fill={`${brand}30`} />
          <rect x={40 + row * 140} y={86} width="60" height="6" rx="3" fill={`${brand}20`} />
        </g>
      ))}
      {[0,1,2].map(row => (
        <g key={`b-${row}`}>
          <rect x={20 + row * 140} y={130} width="120" height="90" rx="12" fill={`${brand}12`} stroke={`${brand}25`} strokeWidth="1" />
          <rect x={40 + row * 140} y={150} width="80" height="6" rx="3" fill={`${brand}30`} />
          <rect x={40 + row * 140} y={166} width="60" height="6" rx="3" fill={`${brand}20`} />
          <rect x={40 + row * 140} y={182} width="40" height="6" rx="3" fill={`${brand}15`} />
        </g>
      ))}
    </svg>
  )
}

export function IllusDashboard({ brand }: { brand: string }) {
  return (
    <svg viewBox="0 0 400 260" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="10" y="10" width="380" height="240" rx="12" fill={`${brand}10`} stroke={`${brand}20`} strokeWidth="1" />
      <rect x="10" y="10" width="380" height="32" rx="12" fill={`${brand}15`} />
      {[20, 60, 100, 140, 180, 220, 260, 300, 340].map(x => (
        <circle key={x} cx={x} cy={26} r="3" fill={`${brand}50`} />
      ))}
      {[0,1,2,3].map(i => (
        <rect key={i} x={30 + i * 88} y={52} width="78" height="54" rx="8" fill={`${brand}12`} stroke={`${brand}20`} strokeWidth="1" />
      ))}
      {[0,1,2,3].map(i => (
        <rect key={`l-${i}`} x={40 + i * 88} y={62} width="28" height="4" rx="2" fill={`${brand}30`} />
      ))}
      <rect x="30" y="118" width="340" height="120" rx="8" fill={`${brand}12`} stroke={`${brand}20`} strokeWidth="1" />
      {[0,1,2,3,4,5].map(i => (
        <rect key={`b-${i}`} x={50 + i * 55} y={160} width="36" height={30 + Math.random() * 50} rx="4" fill={`${brand}${20 + i * 5}`} />
      ))}
      <rect x={50} y={140} width="60" height="6" rx="3" fill={`${brand}40`} />
    </svg>
  )
}

export function IllusChart({ brand, accent }: { brand: string; accent: string }) {
  return (
    <svg viewBox="0 0 400 200" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="10" y="10" width="380" height="180" rx="12" fill={`${brand}8`} />
      <path d="M40 150 L80 130 L120 140 L160 80 L200 60 L240 90 L280 40 L320 70 L360 50" stroke={brand} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 150 L80 130 L120 140 L160 80 L200 60 L240 90 L280 40 L320 70 L360 50" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
      {[40, 100, 160, 220, 280, 340].map(x => (
        <circle key={x} cx={x} cy={26} r="2" fill={`${brand}40`} />
      ))}
    </svg>
  )
}

export function IllusAvatar({ initials, brand }: { initials: string; brand: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill={`${brand}20`} />
      <text x="18" y="21" textAnchor="middle" fill={brand} fontSize="12" fontWeight="700" fontFamily="system-ui">{initials}</text>
    </svg>
  )
}

export function IllusProduct({ brand }: { brand: string }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="20" y="20" width="160" height="140" rx="12" fill={`${brand}12`} stroke={`${brand}25`} strokeWidth="1.5" />
      <rect x="60" y="120" width="80" height="28" rx="6" fill={`${brand}35`} />
      <rect x="70" y="100" width="60" height="8" rx="4" fill={`${brand}30`} />
      <rect x="70" y="80" width="40" height="8" rx="4" fill={`${brand}20`} />
      <circle cx="100" cy="55" r="20" fill={`${brand}40`} />
      <circle cx="100" cy="55" r="10" fill={`${brand}60`} />
    </svg>
  )
}

export function IllusEmpty({ brand }: { brand: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="10" y="10" width="100" height="100" rx="20" stroke={`${brand}30`} strokeWidth="2" strokeDasharray="6 4" fill={`${brand}8`} />
      <rect x="45" y="45" width="30" height="30" rx="8" fill={`${brand}25`} />
      <line x1="55" y1="60" x2="65" y2="60" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="55" x2="60" y2="65" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
