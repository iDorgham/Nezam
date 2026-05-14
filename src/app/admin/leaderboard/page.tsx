'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { useAuth } from '../../../lib/auth/context'
import { useRouter } from 'next/navigation'

export default function LeaderboardPage() {
  const { user, role, loading: authLoading } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'tonight' | 'week' | 'month'>('month')

  useEffect(() => {
    if (!authLoading && (!user || (role !== 'manager' && role !== 'owner'))) {
      router.push('/login')
    }
  }, [user, role, authLoading, router])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (authLoading || loading) {
    return <div style={{ color: 'var(--text-low)', textAlign: 'center', padding: '2rem', backgroundColor: '#121212', height: '100vh' }}>Loading leaderboard...</div>
  }

  if (!user || (role !== 'manager' && role !== 'owner')) {
    return <div style={{ color: '#ff4b4b', textAlign: 'center', padding: '2rem', backgroundColor: '#121212', height: '100vh' }}>Unauthorized. Redirecting to login...</div>
  }

  // Mock data for leaderboard (since we don't have full user profiles in schema yet)
  const leaderboardData = [
    { rank: 1, name: 'Ahmed Rayan', sales: 150000, bookings: 24, commission: 15000, avatar: 'AR', target: 200000 },
    { rank: 2, name: 'Karim Zayed', sales: 120000, bookings: 18, commission: 12000, avatar: 'KZ', target: 200000 },
    { rank: 3, name: 'John Doe', sales: 85000, bookings: 12, commission: 8500, avatar: 'JD', target: 100000 },
    { rank: 4, name: 'Sarah Aly', sales: 60000, bookings: 9, commission: 6000, avatar: 'SA', target: 100000 },
    { rank: 5, name: 'Omar Sherif', sales: 45000, bookings: 6, commission: 4500, avatar: 'OS', target: 100000 },
  ]

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  return (
    <div 
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-high)',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
      className="animate-fadeIn"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Sales Leaderboard</h1>
          <p style={{ color: 'var(--text-low)', fontSize: '0.85rem' }}>Track rep performance and commissions</p>
        </div>
        
        {/* Timeframe Selector */}
        <div style={{ display: 'flex', backgroundColor: 'var(--surface)', borderRadius: '8px', padding: '0.25rem' }}>
          <button 
            onClick={() => setTimeframe('tonight')}
            style={timeframe === 'tonight' ? activeTabStyle : inactiveTabStyle}
          >
            Tonight
          </button>
          <button 
            onClick={() => setTimeframe('week')}
            style={timeframe === 'week' ? activeTabStyle : inactiveTabStyle}
          >
            This Week
          </button>
          <button 
            onClick={() => setTimeframe('month')}
            style={timeframe === 'month' ? activeTabStyle : inactiveTabStyle}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Total Sales (EGP)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>460,000</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Total Commissions</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>46,000</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Top Performer</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Ahmed Rayan</div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--surface-elevated)',
        borderRadius: '8px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--surface-elevated)', fontSize: '0.75rem', color: 'var(--text-low)', textTransform: 'uppercase' }}>
          <div style={{ width: '50px' }}>Rank</div>
          <div style={{ flex: 2 }}>Sales Rep</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Bookings</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Total Sales</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Commission</div>
        </div>

        {leaderboardData.map((rep) => {
          const progress = Math.min((rep.sales / rep.target) * 100, 100)
          
          return (
            <div 
              key={rep.rank}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0.75rem 0',
                borderBottom: rep.rank !== 5 ? '1px solid rgba(255,255,255,0.02)' : 'none'
              }}
            >
              {/* Rank */}
              <div style={{ width: '50px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {getRankBadge(rep.rank)}
              </div>

              {/* Rep Info & Progress */}
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  backgroundColor: 'var(--surface-elevated)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: rep.rank === 1 ? 'var(--primary)' : 'var(--text-high)'
                }}>
                  {rep.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{rep.name}</div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', maxWidth: '200px', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.25rem' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: rep.rank === 1 ? 'var(--primary)' : '#fff', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>

              {/* Bookings */}
              <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                {rep.bookings}
              </div>

              {/* Total Sales */}
              <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                {rep.sales.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>EGP</span>
              </div>

              {/* Commission */}
              <div style={{ flex: 1, textAlign: 'right', color: 'var(--primary)', fontWeight: 'bold' }}>
                {rep.commission.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>EGP</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Target Info */}
      <div style={{ backgroundColor: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.2)', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '1.5rem' }}>💡</span>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>Commission Rate: 10%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)' }}>Reps earn a flat 10% commission on the minimum spend of tables they successfully book. Hit 200,000 EGP in a month to unlock a 5,000 EGP bonus!</div>
        </div>
      </div>
    </div>
  )
}

const statCardStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--surface-elevated)',
  borderRadius: '8px',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem'
}

const activeTabStyle = {
  backgroundColor: 'var(--surface-elevated)',
  color: 'var(--text-high)',
  border: 'none',
  padding: '0.4rem 0.75rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: 'bold' as const,
  cursor: 'pointer'
}

const inactiveTabStyle = {
  backgroundColor: 'transparent',
  color: 'var(--text-low)',
  border: 'none',
  padding: '0.4rem 0.75rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: 'bold' as const,
  cursor: 'pointer'
}
